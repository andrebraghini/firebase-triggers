import 'reflect-metadata';
import { onFirebaseUserCreate } from './firebase-user-create';
import { FirebaseTriggerType } from '../types';
import { getFirebaseFunctionList } from '../internal-methods';

class DemoCtrl {
  @onFirebaseUserCreate()
  userCreate() {
    return 'userCreate';
  }

  @onFirebaseUserCreate({ memory: '256MiB', region: 'us-east1' })
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
      expect(func.options).toEqual({});
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
      expect(func.options?.memory).toBe('256MiB');
      expect(func.options?.region).toEqual('us-east1');
    } else {
      fail('Method userCreateWithOptions() not found');
    }
  });

  it('should define metadata reflection', () => {
    // Setup
    const expectedMetadata = { memory: '256MiB', region: 'us-east1' };

    // Execute
    const result = Reflect.getMetadata('onFirebaseUserCreate', DemoCtrl.prototype, 'userCreateWithOptions');

    // Validate
    expect(result).toMatchObject(expectedMetadata);
  });
});
