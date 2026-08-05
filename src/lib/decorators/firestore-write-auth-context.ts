import { DocumentOptions } from 'firebase-functions/v2/firestore';
import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseTriggerType } from '../types';

/**
 * Decorator for Firestore document write triggers that include auth context.
 *
 * @param document Firestore document/collection path or complete options.
 */
export function onFirestoreWriteWithAuthContext(document: string | DocumentOptions) {
  return (target: any, key: string) => {
    const options = typeof document === 'string' ? { document } : document;
    const firebaseFunction: FirebaseFunction = {
      className: getClassName(target),
      methodName: key,
      method: getClassMethod(target, key),
      trigger: FirebaseTriggerType.FIRESTORE_WRITE_WITH_AUTH_CONTEXT,
      key: options.document,
      options,
    };
    addFirebaseFunction(firebaseFunction);
    Reflect.defineMetadata('onFirestoreWriteWithAuthContext', options, target, key);
  };
}
