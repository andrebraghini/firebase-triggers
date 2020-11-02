import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseTriggerType } from '../types';

/**
 * Decorator that adds the method to the list of Cloud Functions triggered when a publication is made via PubSub triggered via Cron
 * @param schedule Cron time interval (ex: '5 11 * * *' ou 'every 5 minutes')
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
