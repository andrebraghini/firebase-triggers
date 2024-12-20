import { RuntimeOptions } from 'firebase-functions/v1';
import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseTriggerType } from '../types';

/**
 * Decorator that adds the method to the Cloud Functions list that is triggered when removing a
 * user from Firebase Authentication.
 *
 * @example
 * import { onFirebaseUserDelete } from 'firebase-triggers';
 * import { UserRecord } from 'firebase-functions/auth';
 * import { EventContext } from 'firebase-functions';
 * 
 * class UserCtrl {
 *     \@onFirebaseUserDelete()
 *     onDelete(user: UserRecord, context: EventContext) {
 *         console.log(`${user.displayName} left us`);
 *     }
 * }
 */
export function onFirebaseUserDelete(options: RuntimeOptions = {}) {
  return (target: any, key: string) => {
    const firebaseFunction: FirebaseFunction = {
      className: getClassName(target),
      methodName: key,
      method: getClassMethod(target, key),
      trigger: FirebaseTriggerType.USER_DELETE,
      options,
    };
    addFirebaseFunction(firebaseFunction);
    Reflect.defineMetadata('onFirebaseUserDelete', options, target, key);
  };
}
