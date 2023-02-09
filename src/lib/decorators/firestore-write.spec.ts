import 'reflect-metadata';
import { FirebaseTriggerType } from '../types';
import { getFirebaseFunctionList } from '../internal-methods';
import { onFirestoreWrite } from './firestore-write';

class DemoCtrl {
  @onFirestoreWrite('demo_collection/{id}')
  docWrite() {
    return 'docWrite';
  }

  @onFirestoreWrite('demo_collection/{id}', { memory: '256MB' })
  docWriteWithOptions() {
    return 'docWriteWithOptions';
  }
}

describe('@onFirestoreWrite', () => {
  it('should have docWrite() method on the Firebase Function List on memory', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'docWrite');
    if (func) {
      // Execute
      const result = func.method();

      // Validate
      expect(result).toBe('docWrite');
      expect(func.className).toBe('DemoCtrl');
      expect(func.methodName).toBe('docWrite');
      expect(func.trigger).toBe(FirebaseTriggerType.FIRESTORE_WRITE);
      expect(func.key).toBe('demo_collection/{id}');
      expect(func.options).toBeUndefined();
    } else {
      fail('Method docWrite() not found');
    }
  });

  it('should have docWriteWithOptions() method on the Firebase Function List on memory', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'docWriteWithOptions');
    if (func) {
      // Execute
      const result = func.method();

      // Validate
      expect(result).toBe('docWriteWithOptions');
      expect(func.className).toBe('DemoCtrl');
      expect(func.methodName).toBe('docWriteWithOptions');
      expect(func.trigger).toBe(FirebaseTriggerType.FIRESTORE_WRITE);
      expect(func.key).toBe('demo_collection/{id}');
      expect(func.options?.memory).toBe('256MB');
    } else {
      fail('Method docWriteWithOptions() not found');
    }
  });
});
