import 'reflect-metadata';
import { FirebaseTriggerType } from '../types';
import { getFirebaseFunctionList } from '../internal-methods';
import { onFirestoreDelete } from './firestore-delete';

class DemoCtrl {
  @onFirestoreDelete('demo_collection/{id}')
  docDelete() {
    return 'docDelete';
  }
}

describe('@onFirestoreDelete', () => {
  it('should have docDelete() method on the Firebase Function List on memory', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'docDelete');
    if (func) {
      // Execute
      const result = func.method();

      // Validate
      expect(result).toBe('docDelete');
      expect(func.className).toBe('DemoCtrl');
      expect(func.methodName).toBe('docDelete');
      expect(func.trigger).toBe(FirebaseTriggerType.FIRESTORE_DELETE);
      expect(func.key).toBe('demo_collection/{id}');
    } else {
      fail('Method docDelete() not found');
    }
  });
});
