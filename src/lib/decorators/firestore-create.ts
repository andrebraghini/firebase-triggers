import { DocumentOptions } from 'firebase-functions/v2/firestore';
import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseTriggerType } from '../types';

/**
 * Decorator that adds the method to the list of Cloud Functions triggered when creating new
 * document in Firestore.
 * 
 * @param document Firestore document/collection path or complete options.
 *                 To use wildcard keys, enter the parameters between keys.
 *                 e.g. 'user/{uid}/account/{accountId}'
 * @example
 * import { FirestoreEvent, QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';
 * import { ParamsOf } from 'firebase-functions/lib/common/params';
 * import { onFirestoreCreate } from 'firebase-triggers';
 * 
 * class TodoCtrl {
 *     \@onFirestoreCreate('todo/{id}')
 *     onCreate(event: FirestoreEvent<QueryDocumentSnapshot, ParamsOf<string>>) {
 *         // Get an object representing the document. e.g. { title: 'Wash the dishes', time: '12:00' }
 *         const newValue = event.data.data();
 *         // access a particular field as you would any JS property
 *         const title = newValue.title;
 *         const time = newValue.time;
 * 
 *         console.log(`New task added: ${title} at ${time}`);
 *     }
 * }
 */
export function onFirestoreCreate(document: string | DocumentOptions) {
  return (target: any, key: string) => {
    const options = typeof document === 'string' ? { document } : document;
    const firebaseFunction: FirebaseFunction = {
      className: getClassName(target),
      methodName: key,
      method: getClassMethod(target, key),
      trigger: FirebaseTriggerType.FIRESTORE_CREATE,
      key: options.document,
      options,
    };
    addFirebaseFunction(firebaseFunction);
    Reflect.defineMetadata('onFirestoreCreate', options, target, key);
  };
}
