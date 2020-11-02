import 'reflect-metadata';
import { FirebaseTriggerType } from '../types';
import { getFirebaseFunctionList } from '../internal-methods';
import { onRequest } from './request';

class DemoCtrl {
  @onRequest()
  httpRequest() {
    return 'httpRequest';
  }

  @onRequest('newNamePath')
  httpRequestDiffName() {
    return 'httpRequestDiffName';
  }

  @onRequest({ path: 'pathWithOpt', methods: ['GET', 'POST'] })
  httpRequestWithOpt() {
    return 'httpRequestWithOpt';
  }
}

describe('@onRequest', () => {
  it('should have httpRequest() method on the Firebase Function List on memory', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'httpRequest');
    if (!func) {
      fail('Method httpRequest() not found');
    }

    // Execute
    const result = func.method();

    // Validate
    expect(result).toBe('httpRequest');
    expect(func.className).toBe('DemoCtrl');
    expect(func.methodName).toBe('httpRequest');
    expect(func.trigger).toBe(FirebaseTriggerType.HTTP_REQUEST);
  });

  it('should have httpRequestDiffName() method on the Firebase Function List on memory within a different key', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'httpRequestDiffName');
    if (!func) {
      fail('method httpRequestDiffName() not found');
    }

    // Execute
    const result = func.method();

    // Validate
    expect(result).toBe('httpRequestDiffName');
    expect(func.className).toBe('DemoCtrl');
    expect(func.methodName).toBe('httpRequestDiffName');
    expect(func.trigger).toBe(FirebaseTriggerType.HTTP_REQUEST);
    expect(func.key).toBe('newNamePath');
  });

  it('should have httpRequestWithOpt() method on the Firebase Function List on memory within a different key', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'httpRequestWithOpt');
    if (!func) {
      fail('Method httpRequestWithOpt() not found');
    }

    // Execute
    const result = func.method();

    // Validate
    expect(result).toBe('httpRequestWithOpt');
    expect(func.className).toBe('DemoCtrl');
    expect(func.methodName).toBe('httpRequestWithOpt');
    expect(func.trigger).toBe(FirebaseTriggerType.HTTP_REQUEST);
    expect(func.key.path).toBe('pathWithOpt');
    expect(func.key.methods).toMatchObject(['GET', 'POST']);
  });
});
