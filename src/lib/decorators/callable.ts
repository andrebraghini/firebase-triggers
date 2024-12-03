import 'reflect-metadata';
import { CallableOptions } from 'firebase-functions/v2/https';
import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseTriggerType } from '../types';

/**
 * Decorator that adds the class method to the Cloud Functions list triggered as a callable 
 * function.
 *
 * @example
 * import { onCall } from 'firebase-triggers';
 * import { CallableRequest } from 'firebase-functions/lib/common/providers/https';
 * 
 * class TodoCtrl {
 *     \@onCall()
 *     add(event: CallableRequest) {
 *         console.log('Add new todo', event.data);
 *     }
 * }
 */
export function onCall(options: CallableOptions = {}) {
  return (target: any, key: string) => {
    const firebaseFunction: FirebaseFunction = {
      className: getClassName(target),
      methodName: key,
      method: getClassMethod(target, key),
      trigger: FirebaseTriggerType.CALLABLE,
      options,
    };
    addFirebaseFunction(firebaseFunction);
    Reflect.defineMetadata('onCall', options, target, key);
  };
}
