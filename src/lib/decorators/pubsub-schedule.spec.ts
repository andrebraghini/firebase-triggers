import 'reflect-metadata';
import { FirebaseTriggerType } from '../types';
import { getFirebaseFunctionList } from '../internal-methods';
import { onPubSubSchedule } from './pubsub-schedule';

class DemoCtrl {
  @onPubSubSchedule('* * * * *')
  scheduleInterval() {
    return 'scheduleInterval';
  }
}

describe('@onPubSubSchedule', () => {
  it('should have scheduleInterval() method on the Firebase Function List on memory', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'scheduleInterval');
    if (!func) {
      fail('Method scheduleInterval() not found');
    }

    // Execute
    const result = func.method();

    // Validate
    expect(result).toBe('scheduleInterval');
    expect(func.className).toBe('DemoCtrl');
    expect(func.methodName).toBe('scheduleInterval');
    expect(func.trigger).toBe(FirebaseTriggerType.PUBSUB_SCHEDULE);
    expect(func.key).toBe('* * * * *');
  });
});
