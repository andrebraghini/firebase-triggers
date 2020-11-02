import * as functions from 'firebase-functions';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { requestErrorHandler } from './handlers';
import { acceptedMethodsHandler } from './handlers/accepted-method-handler';
import { requestSchemaValidatorHandler } from './handlers/request-schema-validator-handler';
import { getFirebaseFunctionList, getGroupName } from './internal-methods';
import { FirebaseFunction, FirebaseTriggerType, FirebaseFunctionList } from './types';

/** Methods used to register Firebase triggers */
const triggerMethods = {
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

/**
 * Returns method that will be executed with schema validation handling if there is a schema
 * in the application's schema folder with the same name as the method and also a generic
 * treatment for untreated HTTP request errors.
 * @param fullMethodName Full method name generated in Cloud Functions
 * @param func Function data
 */
function getMethodHandler(fullMethodName: string, func: FirebaseFunction): Function {
  let method = func.method;

  if (func.trigger === FirebaseTriggerType.HTTP_REQUEST) {
    const schemaFile = resolve(`${__dirname}/schema/${fullMethodName}.json`);
    if (existsSync(schemaFile)) {
      method = requestSchemaValidatorHandler(method, schemaFile);
    }

    if (func.key && typeof func.key !== 'string') {
      if (func.key.methods) {
        const methods = Array.isArray(func.key.methods) ? func.key.methods : [func.key.methods];
        method = acceptedMethodsHandler(method, methods);
      }
    }

    method = requestErrorHandler(method);
  }

  return method;
}

/**
 * Returns list of methods linked to triggers to export at application startup
 */
export function getFirebaseFunctionListToExport(): FirebaseFunctionList {
  const result: FirebaseFunctionList = {};

  const functionList = getFirebaseFunctionList();
  functionList.forEach((func) => {
    const triggerMethod = triggerMethods[func.trigger];
    if (triggerMethod) {
      const groupName = getGroupName(func);
      const cloudFunctionName = getCloudFunctionName(func);

      const fullMethodName = `${groupName}-${cloudFunctionName}`;
      const methodHandler = getMethodHandler(fullMethodName, func);

      if (groupName) {
        if (!result[groupName]) {
          result[groupName] = {};
        }
        result[groupName][cloudFunctionName] = triggerMethod(methodHandler, func.key);
      } else {
        result[cloudFunctionName] = triggerMethod(methodHandler, func.key);
      }
    }
  });

  return result;
}
