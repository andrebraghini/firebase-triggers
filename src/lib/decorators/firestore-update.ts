import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseOptions, FirebaseTriggerType } from '../types';

/**
 * Decorator that adds the method to the Cloud Functions list triggered when editing an existing document in Firestore
 * @param documentOrCollection Firestore document or collection path
 * To use wildcard keys, enter the parameters between keys. e.g. 'user/{uid}/account/{accountId}'
 */
export function onFirestoreUpdate(documentOrCollection: string, options?: FirebaseOptions) {
  return (target: any, key: string) => {
    const firebaseFunction: FirebaseFunction = {
      className: getClassName(target),
      methodName: key,
      method: getClassMethod(target, key),
      trigger: FirebaseTriggerType.FIRESTORE_UPDATE,
      key: documentOrCollection,
      options,
    };
    addFirebaseFunction(firebaseFunction);
    Reflect.defineMetadata('onFirestoreUpdate', { documentOrCollection, options }, target, key);
  };
}
