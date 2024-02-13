import 'reflect-metadata';
import { FirebaseTriggerType } from '../types';
import { getFirebaseFunctionList } from '../internal-methods';
import { onFirestoreCreate } from './firestore-create';

class DemoCtrl {
  @onFirestoreCreate('demo_collection/{id}')
  docCreate() {
    return 'docCreate';
  }

  @onFirestoreCreate('demo_collection/{id}', { memory: '256MB' })
  docCreateWithOptions() {
    return 'docCreateWithOptions';
  }
}

describe('@onFirestoreCreate', () => {
  it('should have docCreate() method on the Firebase Function List on memory', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'docCreate');
    if (func) {
      // Execute
      const result = func.method();

      // Validate
      expect(result).toBe('docCreate');
      expect(func.className).toBe('DemoCtrl');
      expect(func.methodName).toBe('docCreate');
      expect(func.trigger).toBe(FirebaseTriggerType.FIRESTORE_CREATE);
      expect(func.key).toBe('demo_collection/{id}');
      expect(func.options).toBeUndefined();
    } else {
      fail('method docCreate() not found');
    }
  });

  it('should have docCreateWithOptions() method on the Firebase Function List on memory', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'docCreateWithOptions');
    if (func) {
      // Execute
      const result = func.method();

      // Validate
      expect(result).toBe('docCreateWithOptions');
      expect(func.className).toBe('DemoCtrl');
      expect(func.methodName).toBe('docCreateWithOptions');
      expect(func.trigger).toBe(FirebaseTriggerType.FIRESTORE_CREATE);
      expect(func.key).toBe('demo_collection/{id}');
      expect(func.options?.memory).toBe('256MB');
    } else {
      fail('method docCreateWithOptions() not found');
    }
  });

  it('should define metadata reflection', () => {
    // Setup
    const expectedMetadata = {
      documentOrCollection: 'demo_collection/{id}',
      options: { memory: '256MB' }
    };

    // Execute
    const result = Reflect.getMetadata('onFirestoreCreate', DemoCtrl.prototype, 'docCreateWithOptions');

    // Validate
    expect(result).toMatchObject(expectedMetadata);
  });
});
