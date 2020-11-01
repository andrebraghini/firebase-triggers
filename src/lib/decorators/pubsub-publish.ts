import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseTriggerType } from '../types';

/**
 * Decorator que adiciona o método da classe à lista de Cloud Functions
 * acionada quando for feita uma publicação via PubSub no tópico especificado
 * @param topic Tópico do PubSub para se inscrever
 */
export function onPubSubPublish(topic: string) {
  return (target: any, key: string) => {
    const firebaseFunction: FirebaseFunction = {
      className: getClassName(target),
      methodName: key,
      method: getClassMethod(target, key),
      trigger: FirebaseTriggerType.PUBSUB_PUBLISH,
      key: topic
    };
    addFirebaseFunction(firebaseFunction);
  }
}
