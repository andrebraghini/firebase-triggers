import 'reflect-metadata';
import { FirebaseTriggerType } from '../types';
import { getFirebaseFunctionList } from '../internal-methods';
import { DELETE, GET, onRequest, PATCH, POST, PUT } from './request';

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

  @GET()
  get() {
    return 'get';
  }

  @POST()
  post() {
    return 'post';
  }

  @PUT()
  put() {
    return 'put';
  }

  @PATCH()
  patch() {
    return 'patch';
  }

  @DELETE()
  del() {
    return 'del';
  }
}

describe('@onRequest', () => {
  it('should have httpRequest() method on the Firebase Function List on memory', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'httpRequest');
    if (func) {
      // Execute
      const result = func.method();

      // Validate
      expect(result).toBe('httpRequest');
      expect(func.className).toBe('DemoCtrl');
      expect(func.methodName).toBe('httpRequest');
      expect(func.trigger).toBe(FirebaseTriggerType.HTTP_REQUEST);
    } else {
      fail('Method httpRequest() not found');
    }
  });

  it('should have httpRequestDiffName() method on the Firebase Function List on memory within a different key', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'httpRequestDiffName');
    if (func) {
      // Execute
      const result = func.method();

      // Validate
      expect(result).toBe('httpRequestDiffName');
      expect(func.className).toBe('DemoCtrl');
      expect(func.methodName).toBe('httpRequestDiffName');
      expect(func.trigger).toBe(FirebaseTriggerType.HTTP_REQUEST);
      expect(func.key).toBe('newNamePath');
    } else {
      fail('method httpRequestDiffName() not found');
    }
  });

  it('should have httpRequestWithOpt() method on the Firebase Function List on memory within a different key', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'httpRequestWithOpt');
    if (func) {
      // Execute
      const result = func.method();

      // Validate
      expect(result).toBe('httpRequestWithOpt');
      expect(func.className).toBe('DemoCtrl');
      expect(func.methodName).toBe('httpRequestWithOpt');
      expect(func.trigger).toBe(FirebaseTriggerType.HTTP_REQUEST);
      expect(func.key.path).toBe('pathWithOpt');
      expect(func.key.methods).toMatchObject(['GET', 'POST']);
    } else {
      fail('Method httpRequestWithOpt() not found');
    }
  });
});

describe(`@DELETE`, () => {
  it(`should have del() method on the Firebase Function List on memory`, () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'del');
    if (func) {
      // Execute
      const result = func.method();

      // Validate
      expect(result).toBe('del');
      expect(func.className).toBe('DemoCtrl');
      expect(func.methodName).toBe('del');
      expect(func.trigger).toBe(FirebaseTriggerType.HTTP_REQUEST);
    } else {
      fail(`Method del() not found`);
    }
  });

});

['GET', 'POST', 'PUT', 'PATCH'].forEach(method => {
  describe(`@${method}`, () => {
    it(`should have ${method.toLowerCase()}() method on the Firebase Function List on memory`, () => {
      // Setup
      const func = getFirebaseFunctionList().find((item) => item.methodName === method.toLowerCase());
      if (func) {
        // Execute
        const result = func.method();
  
        // Validate
        expect(result).toBe(method.toLowerCase());
        expect(func.className).toBe('DemoCtrl');
        expect(func.methodName).toBe(method.toLowerCase());
        expect(func.trigger).toBe(FirebaseTriggerType.HTTP_REQUEST);
      } else {
        fail(`Method ${method.toLowerCase()}() not found`);
      }
    });
  
  });
});
