import 'reflect-metadata';
import { FirebaseTriggerType } from '../types';
import { getFirebaseFunctionList } from '../internal-methods';
import { onFirestoreCreate } from './firestore-create';

class DemoCtrl {
  @onFirestoreCreate('demo_collection/{id}')
  docCreate() {
    return 'docCreate';
  }
}

describe('@onFirestoreCreate', () => {
  it('should have docCreate() method on the Firebase Function List on memory', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'docCreate');
    if (!func) {
      fail('method docCreate() not found');
    }

    // Execute
    const result = func.method();

    // Validate
    expect(result).toBe('docCreate');
    expect(func.className).toBe('DemoCtrl');
    expect(func.methodName).toBe('docCreate');
    expect(func.trigger).toBe(FirebaseTriggerType.FIRESTORE_CREATE);
    expect(func.key).toBe('demo_collection/{id}');
  });
});
