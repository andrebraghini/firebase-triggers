import { DocumentOptions } from 'firebase-functions/v2/firestore';
import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseTriggerType } from '../types';

/**
 * Decorator that adds the method to the list of Cloud Functions triggered when creating, editing
 * or removing documents in Firestore.
 * 
 * @param document Firestore document or collection path
 *                 To use wildcard keys, enter the parameters between keys.
 *                 e.g. 'user/{uid}/account/{accountId}'
 * @example
 * import { FirestoreEvent, QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';
 * import { Change } from 'firebase-functions';
 * import { ParamsOf } from 'firebase-functions/lib/common/params';
 * import { onFirestoreWrite } from 'firebase-triggers';
 * 
 * class TodoCtrl {
 *     \@onFirestoreWrite('todo/{id}')
 *     onWrite(event: FirestoreEvent<Change<DocumentSnapshot>, ParamsOf<string>>) {
 *         // Get an object with the current document value. If the document does not exist, it has been deleted.
 *         const newDocument = event.data.after.exists ? event.data.after.data() : null;
 *         // Get an object with the previous document value (for update or delete)
 *         const oldDocument = event.data.before.exists ? event.data.before.data() : null;
 * 
 *         if (!newDocument) {
 *             const title = oldDocument.title;
 *             console.log(`Task "${title}" removed`);
 *             return;
 *         }
 * 
 *         if (!oldDocument) {
 *             const title = newDocument.title;
 *             const time = newDocument.time;
 *             console.log(`New task added: ${title} at ${time}`);
 *             return;
 *         }
 * 
 *         const newTitle = newDocument.title;
 *         const oldTitle = oldDocument.title;
 * 
 *         console.log(`Changed the title from "${oldTitle}" to "${newTitle}"`);
 *     }
 * }
 */
export function onFirestoreWrite(document: string | DocumentOptions) {
  const options = typeof document === 'string' ? { document } : document;
  return (target: any, key: string) => {
    const firebaseFunction: FirebaseFunction = {
      className: getClassName(target),
      methodName: key,
      method: getClassMethod(target, key),
      trigger: FirebaseTriggerType.FIRESTORE_WRITE,
      key: options.document,
      options,
    };
    addFirebaseFunction(firebaseFunction);
    Reflect.defineMetadata('onFirestoreWrite', options, target, key);
  };
}
