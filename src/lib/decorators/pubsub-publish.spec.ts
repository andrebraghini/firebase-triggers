import 'reflect-metadata';
import { FirebaseTriggerType } from '../types';
import { getFirebaseFunctionList } from '../internal-methods';
import { onPubSubPublish } from './pubsub-publish';

class DemoCtrl {
  @onPubSubPublish('the-topic')
  pubsubSubscribe() {
    return 'pubsubSubscribe';
  }

  @onPubSubPublish('the-topic', { memory: '256MB' })
  pubsubSubscribeWithOptions() {
    return 'pubsubSubscribeWithOptions';
  }
}

describe('@onPubSubPublish', () => {
  it('should have pubsubSubscribe() method on the Firebase Function List on memory', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'pubsubSubscribe');
    if (func) {
      // Execute
      const result = func.method();

      // Validate
      expect(result).toBe('pubsubSubscribe');
      expect(func.className).toBe('DemoCtrl');
      expect(func.methodName).toBe('pubsubSubscribe');
      expect(func.trigger).toBe(FirebaseTriggerType.PUBSUB_PUBLISH);
      expect(func.key).toBe('the-topic');
      expect(func.options).toBeUndefined();
    } else {
      fail('Method pubsubSubscribe() not found');
    }
  });

  it('should have pubsubSubscribeWithOptions() method on the Firebase Function List on memory', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'pubsubSubscribeWithOptions');
    if (func) {
      // Execute
      const result = func.method();

      // Validate
      expect(result).toBe('pubsubSubscribeWithOptions');
      expect(func.className).toBe('DemoCtrl');
      expect(func.methodName).toBe('pubsubSubscribeWithOptions');
      expect(func.trigger).toBe(FirebaseTriggerType.PUBSUB_PUBLISH);
      expect(func.key).toBe('the-topic');
      expect(func.options?.memory).toBe('256MB');
    } else {
      fail('Method pubsubSubscribeWithOptions() not found');
    }
  });

  it('should define metadata reflection', () => {
    // Setup
    const expectedMetadata = {
      topic: 'the-topic',
      options: { memory: '256MB' }
    };

    // Execute
    const result = Reflect.getMetadata('onPubSubPublish', DemoCtrl.prototype, 'pubsubSubscribeWithOptions');

    // Validate
    expect(result).toMatchObject(expectedMetadata);
  });
});
