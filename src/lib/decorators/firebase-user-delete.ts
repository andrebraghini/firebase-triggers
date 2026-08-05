import { AuthEventOptions } from '../firebase-identity';
import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseTriggerType } from '../types';

/**
 * Decorator that adds the method to the Cloud Functions list that is triggered when removing a
 * user from Firebase Authentication (event trigger).
 *
 * Note: upstream Firebase Auth event triggers may be marked beta.
 *
 * @example
 * import { onFirebaseUserDelete } from 'firebase-triggers';
 *
 * class UserCtrl {
 *     \@onFirebaseUserDelete()
 *     onDelete(event: unknown) {
 *         console.log('user deleted', event);
 *     }
 * }
 */
export function onFirebaseUserDelete(options: AuthEventOptions = {}) {
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
