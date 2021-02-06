import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseTriggerType } from '../types';

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | string;
export type RequestOptions = string | { path?: string; methods?: HTTPMethod | HTTPMethod[] };

/**
 * Returns a FirebaseFunction based on a specific method
 * @param method HTTP method
 * @param target 
 * @param key 
 * @param path URL suffix also used as method name in GCP. (optional)
 *             If you do not enter the path, the method name will be used. (Recommended)
 */
function getSpecificMethod(method: HTTPMethod, target: any, key: string, path?: string): FirebaseFunction {
  return {
    className: getClassName(target),
    methodName: key,
    method: getClassMethod(target, key),
    trigger: FirebaseTriggerType.HTTP_REQUEST,
    key: { method, ...(!!path && { path }) },
  }
}

/**
 * Decorator that adds the method to the Cloud Functions list triggered when receiving an HTTP request
 * @param opt Optional function settings. If you enter a string it is used as a path.
 * @param opt.methods HTTP methods accepted in the request
 * @param opt.path URL suffix also used as method name in GCP. (optional)
 *                 If you do not enter the path, the method name will be used. (Recommended)
 */
export function onRequest(opt?: RequestOptions) {
  return (target: any, key: string) => {
    const firebaseFunction: FirebaseFunction = {
      className: getClassName(target),
      methodName: key,
      method: getClassMethod(target, key),
      trigger: FirebaseTriggerType.HTTP_REQUEST,
      key: opt,
    };
    addFirebaseFunction(firebaseFunction);
  };
}

/**
 * Decorator that adds the method to the Cloud Functions list triggered when receiving an GET HTTP request
 * @param path URL suffix also used as method name in GCP. (optional)
 *             If you do not enter the path, the method name will be used. (Recommended)
 */
export function GET(path?: string) {
  return (target: any, key: string) => {
    addFirebaseFunction(getSpecificMethod('GET', target, key, path));
  };
}

/**
 * Decorator that adds the method to the Cloud Functions list triggered when receiving an POST HTTP request
 * @param path URL suffix also used as method name in GCP. (optional)
 *             If you do not enter the path, the method name will be used. (Recommended)
 */
export function POST(path?: string) {
  return (target: any, key: string) => {
    addFirebaseFunction(getSpecificMethod('POST', target, key, path));
  };
}

/**
 * Decorator that adds the method to the Cloud Functions list triggered when receiving an PUT HTTP request
 * @param path URL suffix also used as method name in GCP. (optional)
 *             If you do not enter the path, the method name will be used. (Recommended)
 */
export function PUT(path?: string) {
  return (target: any, key: string) => {
    addFirebaseFunction(getSpecificMethod('PUT', target, key, path));
  };
}

/**
 * Decorator that adds the method to the Cloud Functions list triggered when receiving an PATCH HTTP request
 * @param path URL suffix also used as method name in GCP. (optional)
 *             If you do not enter the path, the method name will be used. (Recommended)
 */
export function PATCH(path?: string) {
  return (target: any, key: string) => {
    addFirebaseFunction(getSpecificMethod('PATCH', target, key, path));
  };
}

/**
 * Decorator that adds the method to the Cloud Functions list triggered when receiving an DELETE HTTP request
 * @param path URL suffix also used as method name in GCP. (optional)
 *             If you do not enter the path, the method name will be used. (Recommended)
 */
export function DELETE(path?: string) {
  return (target: any, key: string) => {
    addFirebaseFunction(getSpecificMethod('DELETE', target, key, path));
  };
}
