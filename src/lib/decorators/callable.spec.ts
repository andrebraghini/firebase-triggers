import 'reflect-metadata';
import { onCall } from './callable';
import { FirebaseTriggerType } from '../types';
import { getFirebaseFunctionList } from '../internal-methods';

class DemoCtrl {
  @onCall()
  calledByTheApp() {
    return 'calledByTheApp';
  }

  @onCall({ memory: '256MiB', region: 'us-east1' })
  calledByTheAppWithOptions() {
    return 'calledByTheAppWithOptions';
  }
}

describe('@onCall()', () => {
  it('should have calledByTheApp() method on the Firebase Function List on memory', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'calledByTheApp');
    if (func) {
      // Execute
      const result = func.method();

      // Validate
      expect(result).toBe('calledByTheApp');
      expect(func.className).toBe('DemoCtrl');
      expect(func.methodName).toBe('calledByTheApp');
      expect(func.trigger).toBe(FirebaseTriggerType.CALLABLE);
      expect(func.options).toEqual({});
    } else {
      fail('Method calledByTheApp() not found');
    }
  });

  it('should have calledByTheAppWithOptions() method on the Firebase Function List on memory', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'calledByTheAppWithOptions');
    if (func) {
      // Execute
      const result = func.method();

      // Validate
      expect(result).toBe('calledByTheAppWithOptions');
      expect(func.className).toBe('DemoCtrl');
      expect(func.methodName).toBe('calledByTheAppWithOptions');
      expect(func.trigger).toBe(FirebaseTriggerType.CALLABLE);
      expect(func.options?.memory).toBe('256MiB');
      expect(func.options?.region).toBe('us-east1');
    } else {
      fail('Method calledByTheApp() not found');
    }
  });

  it('should define metadata reflection', () => {
    // Setup
    const expectedMetadata = { memory: '256MiB', region: 'us-east1' };

    // Execute
    const result = Reflect.getMetadata('onCall', DemoCtrl.prototype, 'calledByTheAppWithOptions');

    // Validate
    expect(result).toMatchObject(expectedMetadata);
  });
});
