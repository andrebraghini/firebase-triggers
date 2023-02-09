import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseOptions, FirebaseTriggerType } from '../types';
/**
 * Decorator that adds the class method to the Cloud Functions list triggered as a callable function
 */
export function onCall(options?: FirebaseOptions) {
  return (target: any, key: string) => {
    const firebaseFunction: FirebaseFunction = {
      className: getClassName(target),
      methodName: key,
      method: getClassMethod(target, key),
      trigger: FirebaseTriggerType.CALLABLE,
      options,
    };
    addFirebaseFunction(firebaseFunction);
  };
}
