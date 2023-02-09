import 'reflect-metadata';
import { onFirebaseUserCreate } from './firebase-user-create';
import { FirebaseTriggerType } from '../types';
import { getFirebaseFunctionList } from '../internal-methods';

class DemoCtrl {
  @onFirebaseUserCreate()
  userCreate() {
    return 'userCreate';
  }

  @onFirebaseUserCreate({ memory: '256MB', region: ['us-east1', 'us-east2'] })
  userCreateWithOptions() {
    return 'userCreateWithOptions';
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
      expect(func.options).toBeUndefined();
    } else {
      fail('Method userCreate() not found');
    }
  });

  it('should have userCreateWithOptions() method on the Firebase Function List on memory', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'userCreateWithOptions');
    if (func) {
      // Execute
      const result = func.method();

      // Validate
      expect(result).toBe('userCreateWithOptions');
      expect(func.className).toBe('DemoCtrl');
      expect(func.methodName).toBe('userCreateWithOptions');
      expect(func.trigger).toBe(FirebaseTriggerType.USER_CREATE);
      expect(func.options?.memory).toBe('256MB');
      expect(func.options?.region).toEqual(['us-east1', 'us-east2']);
    } else {
      fail('Method userCreateWithOptions() not found');
    }
  });
});
