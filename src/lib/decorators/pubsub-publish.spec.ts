import 'reflect-metadata';
import { FirebaseTriggerType } from '../types';
import { getFirebaseFunctionList } from '../internal-methods';
import { onPubSubPublish } from './pubsub-publish';

class DemoCtrl {
  @onPubSubPublish('the-topic')
  pubsubSubscribe() {
    return 'pubsubSubscribe';
  }
}

describe('@onPubSubPublish', () => {
  it('should have pubsubSubscribe() method on the Firebase Function List on memory', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'pubsubSubscribe');
    if (!func) {
      fail('Method pubsubSubscribe() not found');
    }

    // Execute
    const result = func.method();

    // Validate
    expect(result).toBe('pubsubSubscribe');
    expect(func.className).toBe('DemoCtrl');
    expect(func.methodName).toBe('pubsubSubscribe');
    expect(func.trigger).toBe(FirebaseTriggerType.PUBSUB_PUBLISH);
    expect(func.key).toBe('the-topic');
  });
});
