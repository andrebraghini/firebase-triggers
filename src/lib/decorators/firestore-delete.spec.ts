import 'reflect-metadata';
import { FirebaseTriggerType } from '../types';
import { getFirebaseFunctionList } from '../internal-methods';
import { onFirestoreDelete } from './firestore-delete';

class DemoCtrl {
  @onFirestoreDelete('demo_collection/{id}')
  docDelete() {
    return 'docDelete';
  }

  @onFirestoreDelete('demo_collection/{id}', { memory: '256MB' })
  docDeleteWithOptions() {
    return 'docDeleteWithOptions';
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
      expect(func.options).toBeUndefined();
    } else {
      fail('Method docDelete() not found');
    }
  });

  it('should have docDeleteWithOptions() method on the Firebase Function List on memory', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'docDeleteWithOptions');
    if (func) {
      // Execute
      const result = func.method();

      // Validate
      expect(result).toBe('docDeleteWithOptions');
      expect(func.className).toBe('DemoCtrl');
      expect(func.methodName).toBe('docDeleteWithOptions');
      expect(func.trigger).toBe(FirebaseTriggerType.FIRESTORE_DELETE);
      expect(func.key).toBe('demo_collection/{id}');
      expect(func.options?.memory).toBe('256MB');
    } else {
      fail('Method docDeleteWithOptions() not found');
    }
  });

  it('should define metadata reflection', () => {
    // Setup
    const expectedMetadata = {
      documentOrCollection: 'demo_collection/{id}',
      options: { memory: '256MB' }
    };

    // Execute
    const result = Reflect.getMetadata('onFirestoreDelete', DemoCtrl.prototype, 'docDeleteWithOptions');

    // Validate
    expect(result).toMatchObject(expectedMetadata);
  });
});
