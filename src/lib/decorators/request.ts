import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseTriggerType } from '../types';

/**
 * Decorator that adds the method to the Cloud Functions list triggered when receiving an HTTP request
 * @param opt Optional function settings. If you enter a string it is used as a path.
 * @param opt.methods HTTP methods accepted in the request
 * @param opt.path URL suffix also used as method name in GCP.
 *                 If you do not enter the path, the method name will be used. (Recommended)
 */
export function onRequest(opt?: string | { path?: string; methods?: string | string[] }) {
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
