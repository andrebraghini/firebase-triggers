import { BlockingOptions } from 'firebase-functions/v2/identity';
import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseTriggerType } from '../types';

/**
 * Decorator that adds the class method to the Cloud Functions list triggered when creating a new
 * user in Firebase Authentication.
 *
 * @example
 * import { onFirebaseUserCreate } from 'firebase-triggers';
 * import { AuthBlockingEvent } from 'firebase-functions/v2/identity';
 * import { EventContext } from 'firebase-functions';
 * 
 * class UserCtrl {
 *     \@onFirebaseUserCreate()
 *     onCreate(event: AuthBlockingEvent) {
 *         console.log(`${event.data.displayName} joined us`);
 *     }
 * }
 */
export function onFirebaseUserCreate(options: BlockingOptions = {}) {
  return (target: any, key: string) => {
    const firebaseFunction: FirebaseFunction = {
      className: getClassName(target),
      methodName: key,
      method: getClassMethod(target, key),
      trigger: FirebaseTriggerType.USER_CREATE,
      options,
    };
    addFirebaseFunction(firebaseFunction);
    Reflect.defineMetadata('onFirebaseUserCreate', options, target, key);
  };
}
