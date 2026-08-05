import 'reflect-metadata';
import { describe, it } from 'node:test';
import { expect, fail } from '../../../test/expect';
import { beforeFirebaseUserCreate } from './firebase-user-before-create';
import { FirebaseTriggerType } from '../types';
import { getFirebaseFunctionList } from '../internal-methods';

class DemoCtrl {
  @beforeFirebaseUserCreate()
  beforeCreate() {
    return 'beforeCreate';
  }

  @beforeFirebaseUserCreate({ memory: '256MiB', region: 'us-east1' })
  beforeCreateWithOptions() {
    return 'beforeCreateWithOptions';
  }
}

describe('@beforeFirebaseUserCreate()', () => {
  it('should register beforeCreate() on the Firebase Function List', () => {
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'beforeCreate');
    if (func) {
      const result = func.method();
      expect(result).toBe('beforeCreate');
      expect(func.className).toBe('DemoCtrl');
      expect(func.trigger).toBe(FirebaseTriggerType.BEFORE_USER_CREATE);
      expect(func.options).toEqual({});
    } else {
      fail('Method beforeCreate() not found');
    }
  });

  it('should register beforeCreateWithOptions() with options', () => {
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'beforeCreateWithOptions');
    if (func) {
      expect(func.method()).toBe('beforeCreateWithOptions');
      expect(func.trigger).toBe(FirebaseTriggerType.BEFORE_USER_CREATE);
      expect(func.options?.memory).toBe('256MiB');
      expect(func.options?.region).toBe('us-east1');
    } else {
      fail('Method beforeCreateWithOptions() not found');
    }
  });

  it('should define metadata reflection', () => {
    const result = Reflect.getMetadata('beforeFirebaseUserCreate', DemoCtrl.prototype, 'beforeCreateWithOptions');
    expect(result).toMatchObject({ memory: '256MiB', region: 'us-east1' });
  });
});
