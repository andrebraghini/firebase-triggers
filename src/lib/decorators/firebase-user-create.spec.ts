import 'reflect-metadata';
import { onFirebaseUserCreate } from './firebase-user-create';
import { FirebaseTriggerType } from '../types';
import { getFirebaseFunctionList } from '../internal-methods';

class DemoCtrl {
  @onFirebaseUserCreate()
  userCreate() {
    return 'userCreate';
  }
}

describe('@onFirebaseUserCreate()', () => {
  it('should have userCreate() method on the Firebase Function List on memory', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'userCreate');
    if (func) {
      // Execute
      const result = func.method();

      // Validate
      expect(result).toBe('userCreate');
      expect(func.className).toBe('DemoCtrl');
      expect(func.methodName).toBe('userCreate');
      expect(func.trigger).toBe(FirebaseTriggerType.USER_CREATE);
    } else {
      fail('Method userCreate() not found');
    }
  });
});
