import 'reflect-metadata';
import { onCall } from './callable';
import { FirebaseTriggerType } from '../types';
import { getFirebaseFunctionList } from '../internal-methods';

class DemoCtrl {
  @onCall()
  calledByTheApp() {
    return 'calledByTheApp';
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
    } else {
      fail('Method calledByTheApp() not found');
    }
  });
});
