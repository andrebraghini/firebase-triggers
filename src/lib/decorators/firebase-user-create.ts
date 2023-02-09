import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseOptions, FirebaseTriggerType } from '../types';

/**
 * Decorator that adds the class method to the Cloud Functions list triggered
 * when creating a new user in Firebase Authentication.
 */
export function onFirebaseUserCreate(options?: FirebaseOptions) {
  return (target: any, key: string) => {
    const firebaseFunction: FirebaseFunction = {
      className: getClassName(target),
      methodName: key,
      method: getClassMethod(target, key),
      trigger: FirebaseTriggerType.USER_CREATE,
      options,
    };
    addFirebaseFunction(firebaseFunction);
  };
}
