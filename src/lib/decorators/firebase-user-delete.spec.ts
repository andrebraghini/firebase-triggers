import 'reflect-metadata';
import { FirebaseTriggerType } from '../types';
import { getFirebaseFunctionList } from '../internal-methods';
import { onFirebaseUserDelete } from './firebase-user-delete';

class DemoCtrl {
  @onFirebaseUserDelete()
  userDelete() {
    return 'userDelete';
  }
}

describe('@onFirebaseUserDelete', () => {
  it('should have userDelete() method on the Firebase Function List on memory', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'userDelete');
    if (!func) {
      fail('Method userDelete() not found');
    }

    // Execute
    const result = func.method();

    // Validate
    expect(result).toBe('userDelete');
    expect(func.className).toBe('DemoCtrl');
    expect(func.methodName).toBe('userDelete');
    expect(func.trigger).toBe(FirebaseTriggerType.USER_DELETE);
  });
});
