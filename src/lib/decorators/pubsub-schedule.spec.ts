import 'reflect-metadata';
import { FirebaseTriggerType } from '../types';
import { getFirebaseFunctionList } from '../internal-methods';
import { onPubSubSchedule } from './pubsub-schedule';

class DemoCtrl {
  @onPubSubSchedule('* * * * *')
  scheduleInterval() {
    return 'scheduleInterval';
  }

  @onPubSubSchedule({ schedule: '* * * * *', memory: '256MiB' })
  scheduleIntervalWithOptions() {
    return 'scheduleIntervalWithOptions';
  }
}

describe('@onPubSubSchedule', () => {
  it('should have scheduleInterval() method on the Firebase Function List on memory', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'scheduleInterval');
    if (func) {
      // Execute
      const result = func.method();

      // Validate
      expect(result).toBe('scheduleInterval');
      expect(func.className).toBe('DemoCtrl');
      expect(func.methodName).toBe('scheduleInterval');
      expect(func.trigger).toBe(FirebaseTriggerType.PUBSUB_SCHEDULE);
      expect(func.key).toBe('* * * * *');
      expect(func.options).toEqual({ schedule: '* * * * *' });
    } else {
      fail('Method scheduleInterval() not found');
    }
  });

  it('should have scheduleIntervalWithOptions() method on the Firebase Function List on memory', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'scheduleIntervalWithOptions');
    if (func) {
      // Execute
      const result = func.method();

      // Validate
      expect(result).toBe('scheduleIntervalWithOptions');
      expect(func.className).toBe('DemoCtrl');
      expect(func.methodName).toBe('scheduleIntervalWithOptions');
      expect(func.trigger).toBe(FirebaseTriggerType.PUBSUB_SCHEDULE);
      expect(func.key).toBe('* * * * *');
      expect(func.options).toEqual({ schedule: '* * * * *', memory: '256MiB' });
    } else {
      fail('Method scheduleIntervalWithOptions() not found');
    }
  });

  it('should define metadata reflection', () => {
    // Setup
    const expectedMetadata = {
      schedule: '* * * * *',
      memory: '256MiB',
    };

    // Execute
    const result = Reflect.getMetadata('onPubSubSchedule', DemoCtrl.prototype, 'scheduleIntervalWithOptions');

    // Validate
    expect(result).toMatchObject(expectedMetadata);
  });
});
