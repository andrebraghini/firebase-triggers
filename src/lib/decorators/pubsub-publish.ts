import { PubSubOptions } from 'firebase-functions/v2/pubsub';
import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseTriggerType } from '../types';

/**
 * Decorator that adds the method to the list of Cloud Functions triggered when a publication is
 * made via PubSub on the specified topic.
 * 
 * @param topic PubSub topic to subscribe
 * @example
 * import { CloudEvent } from 'firebase-functions/lib/v2/core';
 * import { MessagePublishedData } from 'firebase-functions/v2/pubsub';
 * import { onPubSubPublish } from 'firebase-triggers';
 * 
 * class SampleCtrl {
 *     \@onPubSubPublish('my-topic')
 *     doSomething(event: CloudEvent<MessagePublishedData<any>>) {
 *         const publishedData = message.json;
 *         console.log('Data published via PubSub on my-topic:', publishedData);
 *     }
 * }
 */
export function onPubSubPublish(topic: string | PubSubOptions) {
  const options = typeof topic === 'string' ? { topic } : topic;
  return (target: any, key: string) => {
    const firebaseFunction: FirebaseFunction = {
      className: getClassName(target),
      methodName: key,
      method: getClassMethod(target, key),
      trigger: FirebaseTriggerType.PUBSUB_PUBLISH,
      key: options.topic,
      options,
    };
    addFirebaseFunction(firebaseFunction);
    Reflect.defineMetadata('onPubSubPublish', options, target, key);
  };
}
