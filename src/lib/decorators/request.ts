import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseOptions, FirebaseTriggerType } from '../types';

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | string;
export type RequestOptions = string | { path?: string; methods?: HTTPMethod | HTTPMethod[] };

/**
 * Returns a FirebaseFunction based on a specific method
 * @param httpMethod HTTP method
 * @param target
 * @param key
 * @param path URL suffix also used as method name in GCP. (optional)
 *             If you do not enter the path, the method name will be used. (Recommended)
 */
function getSpecificMethod(httpMethod: HTTPMethod, target: any, key: string, path?: string, options?: FirebaseOptions): FirebaseFunction {
  return {
    className: getClassName(target),
    methodName: key,
    method: getClassMethod(target, key),
    trigger: FirebaseTriggerType.HTTP_REQUEST,
    key: { methods: httpMethod, ...(!!path && { path }) },
    options,
  };
}

function extractRequestOptions(options: RequestOptions & FirebaseOptions = {}): RequestOptions | undefined {
  if (!options || typeof options === 'string') {
    return options;
  }

  const { path, methods } = options;
  return {
    ...(path && { path }),
    ...(methods && { methods }),
  };
}

function extractRuntimeOptions(options?: RequestOptions & FirebaseOptions): FirebaseOptions | undefined{
  if (!options || typeof options === 'string') {
    return undefined;
  }

  const result = { ...options };
  delete result.path;
  delete result.methods;
  
  if (JSON.stringify(result) === '{}') {
    return undefined;
  }

  return result;
}

/**
 * Decorator that adds the method to the Cloud Functions list triggered when receiving an HTTP request
 * @param opt Optional function settings. If you enter a string it is used as a path.
 * @param opt.methods HTTP methods accepted in the request
 * @param opt.path URL suffix also used as method name in GCP. (optional)
 *                 If you do not enter the path, the method name will be used. (Recommended)
 */
export function onRequest(opt?: RequestOptions & FirebaseOptions, runtimeOptions?: FirebaseOptions) {
  const requestOptions = extractRequestOptions(opt);
  const options = runtimeOptions || extractRuntimeOptions(opt);

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
  };
}

/**
 * Decorator that adds the method to the Cloud Functions list triggered when receiving an GET HTTP request
 * @param path URL suffix also used as method name in GCP. (optional)
 *             If you do not enter the path, the method name will be used. (Recommended)
 */
export function GET(path?: string | FirebaseOptions, options?: FirebaseOptions) {
  return (target: any, key: string) => {
    const parsedPath = typeof path === 'string' ? path : undefined;
    const parsedOptions = options || (typeof path !== 'string' ? path : undefined);
    addFirebaseFunction(getSpecificMethod('GET', target, key, parsedPath, parsedOptions));
  };
}

/**
 * Decorator that adds the method to the Cloud Functions list triggered when receiving an POST HTTP request
 * @param path URL suffix also used as method name in GCP. (optional)
 *             If you do not enter the path, the method name will be used. (Recommended)
 */
export function POST(path?: string | FirebaseOptions, options?: FirebaseOptions) {
  return (target: any, key: string) => {
    const parsedPath = typeof path === 'string' ? path : undefined;
    const parsedOptions = options || (typeof path !== 'string' ? path : undefined);
    addFirebaseFunction(getSpecificMethod('POST', target, key, parsedPath, parsedOptions));
  };
}

/**
 * Decorator that adds the method to the Cloud Functions list triggered when receiving an PUT HTTP request
 * @param path URL suffix also used as method name in GCP. (optional)
 *             If you do not enter the path, the method name will be used. (Recommended)
 */
export function PUT(path?: string | FirebaseOptions, options?: FirebaseOptions) {
  return (target: any, key: string) => {
    const parsedPath = typeof path === 'string' ? path : undefined;
    const parsedOptions = options || (typeof path !== 'string' ? path : undefined);
    addFirebaseFunction(getSpecificMethod('PUT', target, key, parsedPath, parsedOptions));
  };
}

/**
 * Decorator that adds the method to the Cloud Functions list triggered when receiving an PATCH HTTP request
 * @param path URL suffix also used as method name in GCP. (optional)
 *             If you do not enter the path, the method name will be used. (Recommended)
 */
export function PATCH(path?: string | FirebaseOptions, options?: FirebaseOptions) {
  return (target: any, key: string) => {
    const parsedPath = typeof path === 'string' ? path : undefined;
    const parsedOptions = options || (typeof path !== 'string' ? path : undefined);
    addFirebaseFunction(getSpecificMethod('PATCH', target, key, parsedPath, parsedOptions));
  };
}

/**
 * Decorator that adds the method to the Cloud Functions list triggered when receiving an DELETE HTTP request
 * @param path URL suffix also used as method name in GCP. (optional)
 *             If you do not enter the path, the method name will be used. (Recommended)
 */
export function DELETE(path?: string | FirebaseOptions, options?: FirebaseOptions) {
  return (target: any, key: string) => {
    const parsedPath = typeof path === 'string' ? path : undefined;
    const parsedOptions = options || (typeof path !== 'string' ? path : undefined);
    addFirebaseFunction(getSpecificMethod('DELETE', target, key, parsedPath, parsedOptions));
  };
}
