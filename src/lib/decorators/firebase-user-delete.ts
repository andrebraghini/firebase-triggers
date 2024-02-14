import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseOptions, FirebaseTriggerType } from '../types';

/**
 * Decorator that adds the method to the Cloud Functions list that is
 * triggered when removing a user from Firebase Authentication
 */
export function onFirebaseUserDelete(options?: FirebaseOptions) {
  return (target: any, key: string) => {
    const firebaseFunction: FirebaseFunction = {
      className: getClassName(target),
      methodName: key,
      method: getClassMethod(target, key),
      trigger: FirebaseTriggerType.USER_DELETE,
      options,
    };
    addFirebaseFunction(firebaseFunction);
    Reflect.defineMetadata('onFirebaseUserDelete', { options }, target, key);
  };
}
