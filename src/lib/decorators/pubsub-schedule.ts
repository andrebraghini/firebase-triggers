import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseTriggerType } from '../types';

/**
 * Decorator que adiciona o método da classe à lista de Cloud Functions
 * acionada quando for feita uma publicação via PubSub acionado via Cron
 * @param schedule Intervalo de tempo do cron (ex: '5 11 * * *' ou 'every 5 minutes')
 */
export function onPubSubSchedule(schedule: string | { interval: string, timezone?: string }) {
  return (target: any, key: string) => {
    const firebaseFunction: FirebaseFunction = {
      className: getClassName(target),
      methodName: key,
      method: getClassMethod(target, key),
      trigger: FirebaseTriggerType.PUBSUB_SCHEDULE,
      key: schedule
    };
    addFirebaseFunction(firebaseFunction);
  }
}
