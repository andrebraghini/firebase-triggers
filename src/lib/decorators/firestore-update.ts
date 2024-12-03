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
 * @example
 * import { FirestoreEvent, QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';
 * import { Change } from 'firebase-functions';
 * import { ParamsOf } from 'firebase-functions/lib/common/params';
 * import { onFirestoreUpdate } from 'firebase-triggers';
 * 
 * class TodoCtrl {
 *     \@onFirestoreUpdate('todo/{id}')
 *     onUpdate(event: FirestoreEvent<Change<QueryDocumentSnapshot>, ParamsOf<string>>) {
 *         // Get an object representing the document. e.g. { title: 'Wash the dishes', time: '12:00' }
 *         const newValue = event.data.after.data();
 *         // ...or the previous value before this update
 *         const previousValue = event.data.before.data();
 *         // access a particular field as you would any JS property
 *         const newTitle = newValue.title;
 *         const oldTitle = previousValue.title;
 * 
 *         console.log(`Changed the title from "${oldTitle}" to "${newTitle}"`);
 *     }
 * }
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
