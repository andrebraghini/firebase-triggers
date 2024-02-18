import 'reflect-metadata';
import { FirebaseTriggerType } from '../types';
import { getFirebaseFunctionList } from '../internal-methods';
import { onFirebaseUserDelete } from './firebase-user-delete';

class DemoCtrl {
  @onFirebaseUserDelete()
  userDelete() {
    return 'userDelete';
  }

  @onFirebaseUserDelete({ memory: '256MB' })
  userDeleteWithOptions() {
    return 'userDeleteWithOptions';
  }
}

describe('@onFirebaseUserDelete', () => {
  it('should have userDelete() method on the Firebase Function List on memory', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'userDelete');
    if (func) {
      // Execute
      const result = func.method();

      // Validate
      expect(result).toBe('userDelete');
      expect(func.className).toBe('DemoCtrl');
      expect(func.methodName).toBe('userDelete');
      expect(func.trigger).toBe(FirebaseTriggerType.USER_DELETE);
      expect(func.options).toEqual({});
    } else {
      fail('Method userDelete() not found');
    }
  });

  it('should have userDeleteWithOptions() method on the Firebase Function List on memory', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'userDeleteWithOptions');
    if (func) {
      // Execute
      const result = func.method();

      // Validate
      expect(result).toBe('userDeleteWithOptions');
      expect(func.className).toBe('DemoCtrl');
      expect(func.methodName).toBe('userDeleteWithOptions');
      expect(func.trigger).toBe(FirebaseTriggerType.USER_DELETE);
      expect(func.options?.memory).toBe('256MB');
    } else {
      fail('Method userDeleteWithOptions() not found');
    }
  });

  it('should define metadata reflection', () => {
    // Setup
    const expectedMetadata = { memory: '256MB' };

    // Execute
    const result = Reflect.getMetadata('onFirebaseUserDelete', DemoCtrl.prototype, 'userDeleteWithOptions');

    // Validate
    expect(result).toMatchObject(expectedMetadata);
  });
});
