import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseOptions, FirebaseTriggerType } from '../types';

/**
 * Decorator that adds the method to the list of Cloud Functions triggered when removing a document from the Firestore
 * @param documentOrCollection Firestore document or collection path
 * To use wildcard keys, enter the parameters between keys. e.g. 'user/{uid}/account/{accountId}'
 */
export function onFirestoreDelete(documentOrCollection: string, options?: FirebaseOptions) {
  return (target: any, key: string) => {
    const firebaseFunction: FirebaseFunction = {
      className: getClassName(target),
      methodName: key,
      method: getClassMethod(target, key),
      trigger: FirebaseTriggerType.FIRESTORE_DELETE,
      key: documentOrCollection,
      options,
    };
    addFirebaseFunction(firebaseFunction);
    Reflect.defineMetadata('onFirestoreDelete', { documentOrCollection, options }, target, key);
  };
}
