import { DocumentOptions } from 'firebase-functions/v2/firestore';
import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseTriggerType } from '../types';

/**
 * Decorator that adds the method to the Cloud Functions list triggered when editing an existing
 * document in Firestore.
 * 
 * @param document Firestore document/collection path os complete options.
 *                 To use wildcard keys, enter the parameters between keys.
 *                 e.g. 'user/{uid}/account/{accountId}'
 */
export function onFirestoreUpdate(document: string | DocumentOptions) {
  const options = typeof document === 'string' ? { document } : document;
  return (target: any, key: string) => {
    const firebaseFunction: FirebaseFunction = {
      className: getClassName(target),
      methodName: key,
      method: getClassMethod(target, key),
      trigger: FirebaseTriggerType.FIRESTORE_UPDATE,
      key: options.document,
      options,
    };
    addFirebaseFunction(firebaseFunction);
    Reflect.defineMetadata('onFirestoreUpdate', options, target, key);
  };
}
