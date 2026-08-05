import { BlockingOptions } from 'firebase-functions/v2/identity';
import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseTriggerType } from '../types';

/**
 * Decorator that adds the class method to the Cloud Functions list triggered before creating a new
 * user in Firebase Authentication (blocking function).
 *
 * @example
 * import { beforeFirebaseUserCreate } from 'firebase-triggers';
 * import { AuthBlockingEvent } from 'firebase-functions/v2/identity';
 *
 * class UserCtrl {
 *     \@beforeFirebaseUserCreate()
 *     beforeCreate(event: AuthBlockingEvent) {
 *         console.log(`${event.data?.displayName} is joining`);
 *     }
 * }
 */
export function beforeFirebaseUserCreate(options: BlockingOptions = {}) {
  return (target: any, key: string) => {
    const firebaseFunction: FirebaseFunction = {
      className: getClassName(target),
      methodName: key,
      method: getClassMethod(target, key),
      trigger: FirebaseTriggerType.BEFORE_USER_CREATE,
      options,
    };
    addFirebaseFunction(firebaseFunction);
    Reflect.defineMetadata('beforeFirebaseUserCreate', options, target, key);
  };
}
