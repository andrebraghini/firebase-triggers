import * as functions from 'firebase-functions';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { requestErrorHandler } from './handlers';
import { multipleRequestHandler } from './handlers/multiple-request-handler';
import { requestSchemaValidatorHandler } from './handlers/request-schema-validator-handler';
import { getFirebaseFunctionList, getGroupName } from './internal-methods';
import { FirebaseFunction, FirebaseTriggerType, FirebaseFunctionList } from './types';

/** Methods used to register Firebase triggers */
const triggerMethods = {
  CALLABLE: (handler: any) => functions.https.onCall(handler),
  USER_CREATE: (handler: any) => functions.auth.user().onCreate(handler),
  USER_DELETE: (handler: any) => functions.auth.user().onDelete(handler),
  HTTP_REQUEST: (handler: any) => functions.https.onRequest(handler),
  FIRESTORE_CREATE: (handler: any, path: string) => functions.firestore.document(path).onCreate(handler),
  FIRESTORE_UPDATE: (handler: any, path: string) => functions.firestore.document(path).onUpdate(handler),
  FIRESTORE_DELETE: (handler: any, path: string) => functions.firestore.document(path).onDelete(handler),
  FIRESTORE_WRITE: (handler: any, path: string) => functions.firestore.document(path).onWrite(handler),
  PUBSUB_PUBLISH: (handler: any, topic: string) => functions.pubsub.topic(topic).onPublish(handler),
  PUBSUB_SCHEDULE: (handler: any, schedule: string | { interval: string; timezone?: string }) => {
    const scheduleObj: { interval?: string; timezone?: string } = {};
    if (typeof schedule === 'object') {
      scheduleObj.interval = schedule.interval;
      scheduleObj.timezone = schedule.timezone;
    } else {
      scheduleObj.interval = schedule;
    }

    if (scheduleObj.timezone) {
      return functions.pubsub.schedule(scheduleObj.interval).timeZone(scheduleObj.timezone).onRun(handler);
    }
    return functions.pubsub.schedule(scheduleObj.interval).onRun(handler);
  },
  STORAGE_ARCHIVE: (handler: any, bucket?: string) => {
    const obj = bucket ? functions.storage.bucket(bucket).object() : functions.storage.object();
    return obj.onArchive(handler);
  },
  STORAGE_DELETE: (handler: any, bucket?: string) => {
    const obj = bucket ? functions.storage.bucket(bucket).object() : functions.storage.object();
    return obj.onDelete(handler);
  },
  STORAGE_FINALIZE: (handler: any, bucket?: string) => {
    const obj = bucket ? functions.storage.bucket(bucket).object() : functions.storage.object();
    return obj.onFinalize(handler);
  },
  STORAGE_METADATA_UPDATE: (handler: any, bucket?: string) => {
    const obj = bucket ? functions.storage.bucket(bucket).object() : functions.storage.object();
    return obj.onMetadataUpdate(handler);
  },
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
  httpRequestFunctions: { [httpMethod: string]: Function },
): Function {
  const requestHandlerList: { [key: string]: Function } = {};

  Object.keys(httpRequestFunctions).forEach((httpMethod) => {
    let specificMethod = httpRequestFunctions[httpMethod];

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
      [httpMethod: string]: Function;
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
          httpRequestFunctions[fullMethodName][httpMethod] = func.method;
        });

        return;
      }

      if (groupName) {
        if (!result[groupName]) {
          result[groupName] = {};
        }
        result[groupName][cloudFunctionName] = triggerMethod(func.method, func.key);
      } else {
        result[cloudFunctionName] = triggerMethod(func.method, func.key);
      }
    }
  });

  // Add HTTP methods to export
  Object.keys(httpRequestFunctions).forEach((fullMethodName) => {
    const name = fullMethodName.split('-');
    const groupName = name.length > 1 ? name[0] : undefined;
    const cloudFunctionName = name.length > 1 ? name[1] : name[0];
    const methodHandler = getHTTPMethodHandler(fullMethodName, httpRequestFunctions[fullMethodName]);

    if (groupName) {
      if (!result[groupName]) {
        result[groupName] = {};
      }
      result[groupName][cloudFunctionName] = functions.https.onRequest(methodHandler as any);
    } else {
      result[cloudFunctionName] = functions.https.onRequest(methodHandler as any);
    }
  });

  return result;
}
