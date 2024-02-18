import * as functionsV1 from 'firebase-functions/v1';
import { ScheduleOptions, onSchedule } from 'firebase-functions/v2/scheduler';
import { FirebaseFunction, FirebaseTriggerType, FirebaseFunctionList, FirebaseOptions } from './types';
import { CallableOptions, HttpsOptions, onCall, onRequest } from 'firebase-functions/v2/https';
import { BlockingOptions, beforeUserCreated } from 'firebase-functions/v2/identity';
import {
  DocumentOptions,
  onDocumentCreated,
  onDocumentDeleted,
  onDocumentUpdated,
  onDocumentWritten,
} from 'firebase-functions/v2/firestore';
import { PubSubOptions, onMessagePublished } from 'firebase-functions/v2/pubsub';
import {
  StorageOptions,
  onObjectArchived,
  onObjectDeleted,
  onObjectFinalized,
  onObjectMetadataUpdated,
} from 'firebase-functions/v2/storage';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { requestErrorHandler } from './handlers';
import { multipleRequestHandler } from './handlers/multiple-request-handler';
import { requestSchemaValidatorHandler } from './handlers/request-schema-validator-handler';
import { getFirebaseFunctionList, getGroupName } from './internal-methods';

/**
 * Get Firebase Function Builder setting the Firebase Runtime Options.
 * 
 * @param options Firebase runtime options
 * @returns Firebase Function Builder
 */
function getFunctionBuilder(options: FirebaseOptions = {}) {
  const parsedOptions = { ...options };
  delete parsedOptions.region;

  let result = functionsV1.runWith(parsedOptions);

  if (options.region) {
    const regions = typeof options.region === 'string' ? [options.region] : options.region;
    if (regions.length) {
      result = result.region(...regions);
    }
  }

  return result;
}

/** Methods used to register Firebase triggers */
const triggerMethods = {
  CALLABLE: (handler: any, options: CallableOptions = {}) => onCall(options, handler),
  USER_CREATE: (handler: any, options: BlockingOptions = {}) => beforeUserCreated(options, handler),
  USER_DELETE: (handler: any, options?: FirebaseOptions) => getFunctionBuilder(options).auth.user().onDelete(handler),
  HTTP_REQUEST: (handler: any, options: HttpsOptions = {}) => onRequest(options, handler),
  FIRESTORE_CREATE: (handler: any, options: string | DocumentOptions<string>) => onDocumentCreated(options as any, handler),
  FIRESTORE_UPDATE: (handler: any, options: string | DocumentOptions<string>) => onDocumentUpdated(options as any, handler),
  FIRESTORE_DELETE: (handler: any, options: string | DocumentOptions<string>) => onDocumentDeleted(options as any, handler),
  FIRESTORE_WRITE: (handler: any, options: string | DocumentOptions<string>) => onDocumentWritten(options as any, handler),
  PUBSUB_PUBLISH: (handler: any, options: string | PubSubOptions) => onMessagePublished(options as any, handler),
  PUBSUB_SCHEDULE: (handler: any, options: ScheduleOptions) => onSchedule(options, handler),
  STORAGE_ARCHIVE: (handler: any, options: StorageOptions) => onObjectArchived(options, handler),
  STORAGE_DELETE: (handler: any, options: StorageOptions) => onObjectDeleted(options, handler),
  STORAGE_FINALIZE: (handler: any, options: StorageOptions) => onObjectFinalized(options, handler),
  STORAGE_METADATA_UPDATE: (handler: any, options: StorageOptions) => onObjectMetadataUpdated(options, handler),
};

/**
 * Returns function name for Cloud Functions based on the method name.
 * If the function's trigger is for HTTP requests and the parameter with the method name is passed,
 * then this nomenclature rule will be ignored and the name of the method entered will be used.
 * @param func Function data
 */
function getCloudFunctionName(func: FirebaseFunction): string {
  if (func.trigger === FirebaseTriggerType.HTTP_REQUEST && func.key) {
    const path = typeof func.key === 'string' ? func.key : func.key.path;
    if (path) {
      return path;
    }
  }

  return func.methodName;
}

function getHTTPMethodHandler(
  fullMethodName: string,
  httpRequestFunctions: { [httpMethod: string]: { handler: Function } },
): Function {
  const requestHandlerList: { [key: string]: Function } = {};

  Object.keys(httpRequestFunctions).forEach((httpMethod) => {
    let specificMethod = httpRequestFunctions[httpMethod].handler;

    const schemaFileFileName = `${fullMethodName}${httpMethod === 'DEFAULT' ? '' : `_${httpMethod}`}.json`;
    const schemaFile = resolve(`schema/${schemaFileFileName}`);
    if (existsSync(schemaFile)) {
      specificMethod = requestSchemaValidatorHandler(specificMethod, schemaFile);
    }

    requestHandlerList[httpMethod] = specificMethod;
  });

  let method = multipleRequestHandler(requestHandlerList);
  method = requestErrorHandler(method);
  return method;
}

/**
 * Returns a list of methods linked to triggers to export at application startup
 */
export function getFirebaseFunctionListToExport(): FirebaseFunctionList {
  const result: FirebaseFunctionList = {};
  const httpRequestFunctions: {
    [fullMethodName: string]: {
      [httpMethod: string]: {
        handler: Function;
        options: HttpsOptions;
      }
    };
  } = {};

  const functionList = getFirebaseFunctionList();

  // Add methods to export, except HTTP methods
  functionList.forEach((func) => {
    const triggerMethod = triggerMethods[func.trigger];
    if (triggerMethod) {
      const groupName = getGroupName(func);
      const cloudFunctionName = getCloudFunctionName(func);
      const fullMethodName = groupName ? `${groupName}-${cloudFunctionName}` : cloudFunctionName;

      if (func.trigger === FirebaseTriggerType.HTTP_REQUEST) {
        const methods = !func.key
          ? ['DEFAULT']
          : Array.isArray(func.key.methods)
          ? func.key.methods
          : [func.key.methods || 'DEFAULT'];
        if (!httpRequestFunctions[fullMethodName]) {
          httpRequestFunctions[fullMethodName] = {};
        }

        methods.forEach((httpMethod) => {
          httpRequestFunctions[fullMethodName][httpMethod] = {
            handler: func.method,
            options: func.options,
          };
        });

        return;
      }

      if (groupName) {
        if (!result[groupName]) {
          result[groupName] = {};
        }
        result[groupName][cloudFunctionName] = triggerMethod(func.method, func.options);
      } else {
        result[cloudFunctionName] = triggerMethod(func.method, func.options);
      }
    }
  });

  // Add HTTP methods to export
  Object.keys(httpRequestFunctions).forEach((fullMethodName) => {
    const name = fullMethodName.split('-');
    const groupName = name.length > 1 ? name[0] : undefined;
    const cloudFunctionName = name.length > 1 ? name[1] : name[0];
    const methodHandler = getHTTPMethodHandler(fullMethodName, httpRequestFunctions[fullMethodName]);
    const options = Object
      .values(httpRequestFunctions[fullMethodName])
      .find(item => !!item.options) || {};

    if (groupName) {
      if (!result[groupName]) {
        result[groupName] = {};
      }
      result[groupName][cloudFunctionName] = onRequest(options, methodHandler as any);
    } else {
      result[cloudFunctionName] = onRequest(options, methodHandler as any);
    }
  });

  return result;
}
