import 'reflect-metadata';
import { FirebaseTriggerType } from '../types';
import { getFirebaseFunctionList } from '../internal-methods';
import { onFirestoreUpdate } from './firestore-update';

class DemoCtrl {
  @onFirestoreUpdate('demo_collection/{id}')
  docUpdate() {
    return 'docUpdate';
  }

  @onFirestoreUpdate({ document: 'demo_collection/{id}', memory: '256MiB' })
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
      expect(func.options).toEqual({ document: 'demo_collection/{id}' });
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
      expect(func.options).toEqual({ document: 'demo_collection/{id}', memory: '256MiB' });
    } else {
      fail('Method docUpdateWithOptions() not found');
    }
  });

  it('should define metadata reflection', () => {
    // Setup
    const expectedMetadata = {
      document: 'demo_collection/{id}',
      memory: '256MiB',
    };

    // Execute
    const result = Reflect.getMetadata('onFirestoreUpdate', DemoCtrl.prototype, 'docUpdateWithOptions');

    // Validate
    expect(result).toMatchObject(expectedMetadata);
  });
});
