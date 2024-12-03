import { ScheduleOptions } from 'firebase-functions/v2/scheduler';
import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseTriggerType } from '../types';

/**
 * Decorator that adds the method to the list of Cloud Functions triggered when a publication is
 * made via PubSub triggered via Cron.
 *
 * @param schedule Cron time interval (ex: '5 11 * * *' ou 'every 5 minutes')
 * @example
 * import { ScheduledEvent } from 'firebase-functions/v2/scheduler';
 * import { onPubSubSchedule } from 'firebase-triggers';
 * 
 * class TimerCtrl {
 *     \@onPubSubSchedule('0 5 * * *')
 *     everyDayAtFiveAM(event: ScheduledEvent) {
 *         console.log('Method executed every day at 5 AM');
 *     }
 * }
 */
export function onPubSubSchedule(schedule: string | ScheduleOptions) {
  const options = typeof schedule === 'string' ? { schedule } : schedule;
  return (target: any, key: string) => {
    const firebaseFunction: FirebaseFunction = {
      className: getClassName(target),
      methodName: key,
      method: getClassMethod(target, key),
      trigger: FirebaseTriggerType.PUBSUB_SCHEDULE,
      key: options.schedule,
      options,
    };
    addFirebaseFunction(firebaseFunction);
    Reflect.defineMetadata('onPubSubSchedule', options, target, key);
  };
}
