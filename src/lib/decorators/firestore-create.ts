import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseTriggerType } from '../types';

/**
 * Decorator que adiciona o método da classe à lista de Cloud Functions
 * acionada ao criar novo documento no Firestore
 * @param documentOrCollection Caminho do documento ou coleção do Firestore.
 * Para utilizar chaves coringa, informe os parâmetros entre chaves. Ex: 'user/{uid}/account/{accountId}'
 */
export function onFirestoreCreate(documentOrCollection: string) {
  return (target: any, key: string) => {
    const firebaseFunction: FirebaseFunction = {
      className: getClassName(target),
      methodName: key,
      method: getClassMethod(target, key),
      trigger: FirebaseTriggerType.FIRESTORE_CREATE,
      key: documentOrCollection
    };
    addFirebaseFunction(firebaseFunction);
  }
}