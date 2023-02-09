import 'reflect-metadata';
import { FirebaseTriggerType } from '../types';
import { getFirebaseFunctionList } from '../internal-methods';
import { onFirestoreUpdate } from './firestore-update';

class DemoCtrl {
  @onFirestoreUpdate('demo_collection/{id}')
  docUpdate() {
    return 'docUpdate';
  }

  @onFirestoreUpdate('demo_collection/{id}', { memory: '256MB' })
  docUpdateWithOptions() {
    return 'docUpdateWithOptions';
  }
}

describe('@onFirestoreUpdate', () => {
  it('should have docUpdate() method on the Firebase Function List on memory', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'docUpdate');
    if (func) {
      // Execute
      const result = func.method();

      // Validate
      expect(result).toBe('docUpdate');
      expect(func.className).toBe('DemoCtrl');
      expect(func.methodName).toBe('docUpdate');
      expect(func.trigger).toBe(FirebaseTriggerType.FIRESTORE_UPDATE);
      expect(func.key).toBe('demo_collection/{id}');
      expect(func.options).toBeUndefined();
    } else {
      fail('Method docUpdate() not found');
    }
  });

  it('should have docUpdateWithOptions() method on the Firebase Function List on memory', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'docUpdateWithOptions');
    if (func) {
      // Execute
      const result = func.method();

      // Validate
      expect(result).toBe('docUpdateWithOptions');
      expect(func.className).toBe('DemoCtrl');
      expect(func.methodName).toBe('docUpdateWithOptions');
      expect(func.trigger).toBe(FirebaseTriggerType.FIRESTORE_UPDATE);
      expect(func.key).toBe('demo_collection/{id}');
      expect(func.options?.memory).toBe('256MB');
    } else {
      fail('Method docUpdateWithOptions() not found');
    }
  });
});
