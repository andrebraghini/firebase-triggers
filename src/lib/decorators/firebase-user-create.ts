import { AuthEventOptions } from '../firebase-identity';
import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseTriggerType } from '../types';

/**
 * Decorator that adds the class method to the Cloud Functions list triggered when a new
 * user is created in Firebase Authentication (event trigger).
 *
 * Note: upstream Firebase Auth event triggers may be marked beta.
 *
 * @example
 * import { onFirebaseUserCreate } from 'firebase-triggers';
 *
 * class UserCtrl {
 *     \@onFirebaseUserCreate()
 *     onCreate(event: unknown) {
 *         console.log('user created', event);
 *     }
 * }
 */
export function onFirebaseUserCreate(options: AuthEventOptions = {}) {
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
