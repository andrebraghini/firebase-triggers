import { HttpsOptions } from 'firebase-functions/v2/https';
import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseTriggerType } from '../types';

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | string;
export type RequestOptions = { path?: string; methods?: HTTPMethod | HTTPMethod[] };

/**
 * Returns a FirebaseFunction based on a specific method.
 * 
 * @param httpMethod HTTP method
 * @param target
 * @param key
 * @param path URL suffix also used as method name in GCP. (optional)
 *             If you do not enter the path, the method name will be used. (Recommended)
 */
function getSpecificMethod(httpMethod: HTTPMethod, target: any, key: string, opt: HttpsOptions & { path?: string } = {}): FirebaseFunction {
  const path = opt.path;
  const options = { ...opt };
  delete options.path;

  return {
    className: getClassName(target),
    methodName: key,
    method: getClassMethod(target, key),
    trigger: FirebaseTriggerType.HTTP_REQUEST,
    key: { methods: httpMethod, ...(!!path && { path }) },
    options,
  };
}

function extractRequestOptions(options: string | RequestOptions & HttpsOptions = {}): RequestOptions {
  if (options && typeof options === 'object') {
    const { path, methods } = options;
    return {
      ...(path && { path }),
      ...(methods && { methods }),
    };
  }
  
  return { path: options };
}

function extractHttpsOptions(options?: string | RequestOptions & HttpsOptions): HttpsOptions {
  if (!options || typeof options === 'string') {
    return {};
  }

  const result = { ...options };
  delete result.path;
  delete result.methods;
  
  return result;
}

/**
 * Decorator that adds the method to the Cloud Functions list triggered when receiving an HTTP
 * request.
 * 
 * @param opt Optional function settings. If you enter a string it is used as a path.
 * @param opt.methods HTTP methods accepted in the request.
 * @param opt.path URL suffix also used as method name in GCP. (optional)
 *                 If you do not enter the path, the method name will be used. (Recommended)
 */
export function onRequest(opt: string | RequestOptions & HttpsOptions = {}) {
  const requestOptions = extractRequestOptions(opt);
  const options = extractHttpsOptions(opt);

  return (target: any, key: string) => {
    const firebaseFunction: FirebaseFunction = {
      className: getClassName(target),
      methodName: key,
      method: getClassMethod(target, key),
      trigger: FirebaseTriggerType.HTTP_REQUEST,
      key: requestOptions,
      options,
    };
    addFirebaseFunction(firebaseFunction);

    Reflect.defineMetadata('onRequest', opt, target, key);
  };
}

/**
 * Decorator that adds the method to the Cloud Functions list triggered when receiving an GET HTTP
 * request.
 * 
 * @param path URL suffix also used as method name in GCP. (optional)
 *             If you do not enter the path, the method name will be used. (Recommended)
 */
export function GET(path: string | HttpsOptions & { path?: string } = {}) {
  return (target: any, key: string) => {
    const options = typeof path === 'string' ? { path } : path;
    addFirebaseFunction(getSpecificMethod('GET', target, key, options));
    Reflect.defineMetadata('GET', options, target, key);
  };
}

/**
 * Decorator that adds the method to the Cloud Functions list triggered when receiving an POST HTTP
 * request.
 * 
 * @param path URL suffix also used as method name in GCP. (optional)
 *             If you do not enter the path, the method name will be used. (Recommended)
 */
export function POST(path: string | HttpsOptions & { path?: string } = {}) {
  return (target: any, key: string) => {
    const options = typeof path === 'string' ? { path } : path;
    addFirebaseFunction(getSpecificMethod('POST', target, key, options));
    Reflect.defineMetadata('POST', options, target, key);
  };
}

/**
 * Decorator that adds the method to the Cloud Functions list triggered when receiving an PUT HTTP
 * request.
 * 
 * @param path URL suffix also used as method name in GCP. (optional)
 *             If you do not enter the path, the method name will be used. (Recommended)
 */
export function PUT(path: string | HttpsOptions & { path?: string } = {}) {
  return (target: any, key: string) => {
    const options = typeof path === 'string' ? { path } : path;
    addFirebaseFunction(getSpecificMethod('PUT', target, key, options));
    Reflect.defineMetadata('PUT', options, target, key);
  };
}

/**
 * Decorator that adds the method to the Cloud Functions list triggered when receiving an PATCH HTTP request
 * @param path URL suffix also used as method name in GCP. (optional)
 *             If you do not enter the path, the method name will be used. (Recommended)
 */
export function PATCH(path: string | HttpsOptions & { path?: string } = {}) {
  return (target: any, key: string) => {
    const options = typeof path === 'string' ? { path } : path;
    addFirebaseFunction(getSpecificMethod('PATCH', target, key, options));
    Reflect.defineMetadata('PATCH', options, target, key);
  };
}

/**
 * Decorator that adds the method to the Cloud Functions list triggered when receiving an DELETE HTTP request
 * @param path URL suffix also used as method name in GCP. (optional)
 *             If you do not enter the path, the method name will be used. (Recommended)
 */
export function DELETE(path: string | HttpsOptions & { path?: string } = {}) {
  return (target: any, key: string) => {
    const options = typeof path === 'string' ? { path } : path;
    addFirebaseFunction(getSpecificMethod('DELETE', target, key, options));
    Reflect.defineMetadata('DELETE', options, target, key);
  };
}
