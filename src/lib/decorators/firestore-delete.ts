import { DocumentOptions } from 'firebase-functions/v2/firestore';
import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseTriggerType } from '../types';

/**
 * Decorator that adds the method to the list of Cloud Functions triggered when removing a document
 * from the Firestore.
 * 
 * @param document Firestore document/collection path or complete options.
 *                 To use wildcard keys, enter the parameters between keys.
 *                 e.g. 'user/{uid}/account/{accountId}'
 * @example
 * import { FirestoreEvent, QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';
 * import { ParamsOf } from 'firebase-functions/lib/common/params';
 * import { onFirestoreDelete } from 'firebase-triggers';
 * 
 * class TodoCtrl {
 *     \@onFirestoreDelete('todo/{id}')
 *     onDelete(event: FirestoreEvent<QueryDocumentSnapshot, ParamsOf<string>>) {
 *         // Get an object representing the document. e.g. { title: 'Wash the dishes', time: '12:00' }
 *         const oldValue = event.data.data();
 *         // access a particular field as you would any JS property
 *         const title = oldValue.title;
 * 
 *         console.log(`Task "${title}" removed`);
 *     }
 * }
 */
export function onFirestoreDelete(document: string | DocumentOptions) {
  const options = typeof document === 'string' ? { document } : document;
  return (target: any, key: string) => {
    const firebaseFunction: FirebaseFunction = {
      className: getClassName(target),
      methodName: key,
      method: getClassMethod(target, key),
      trigger: FirebaseTriggerType.FIRESTORE_DELETE,
      key: options.document,
      options,
    };
    addFirebaseFunction(firebaseFunction);
    Reflect.defineMetadata('onFirestoreDelete', options, target, key);
  };
}
