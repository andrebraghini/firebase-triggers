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

  @onRequest({ path: 'newNamePath', memory: '256MiB' })
  httpRequestDiffNameWithOptions() {
    return 'httpRequestDiffNameWithOptions';
  }

  @onRequest({ path: 'pathWithOpt', methods: ['GET', 'POST'], memory: '128MiB' })
  httpRequestWithOpt() {
    return 'httpRequestWithOpt';
  }

  @GET()
  get() {
    return 'get';
  }

  @GET({ minInstances: 2 })
  getWithOptions() {
    return 'getWithOptions';
  }

  @POST()
  post() {
    return 'post';
  }

  @POST({ minInstances: 2 })
  postWithOptions() {
    return 'postWithOptions';
  }

  @PUT()
  put() {
    return 'put';
  }

  @PUT({ minInstances: 2 })
  putWithOptions() {
    return 'putWithOptions';
  }

  @PATCH()
  patch() {
    return 'patch';
  }

  @PATCH({ minInstances: 2 })
  patchWithOptions() {
    return 'patchWithOptions';
  }

  @DELETE()
  del() {
    return 'del';
  }

  @DELETE({ maxInstances: 1 })
  delWithOptions() {
    return 'delWithOptions';
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
      expect(func.options).toEqual({});
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
      expect(func.key).toEqual({ path: 'newNamePath' });
      expect(func.options).toEqual({});
    } else {
      fail('method httpRequestDiffName() not found');
    }
  });

  it('should have httpRequestDiffNameWithOptions() method on the Firebase Function List on memory within a different key', () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'httpRequestDiffNameWithOptions');
    if (func) {
      // Execute
      const result = func.method();

      // Validate
      expect(result).toBe('httpRequestDiffNameWithOptions');
      expect(func.className).toBe('DemoCtrl');
      expect(func.methodName).toBe('httpRequestDiffNameWithOptions');
      expect(func.trigger).toBe(FirebaseTriggerType.HTTP_REQUEST);
      expect(func.key).toEqual({ path: 'newNamePath' });
      expect(func.options?.memory).toBe('256MiB');
    } else {
      fail('method httpRequestDiffNameWithOptions() not found');
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
      expect(func.options?.memory).toBe('128MiB');
    } else {
      fail('Method httpRequestWithOpt() not found');
    }
  });

  it('should define metadata reflection', () => {
    // Setup
    const expectedMetadata = {
      path: 'pathWithOpt',
      methods: ['GET', 'POST'],
      memory: '128MiB',
    };

    // Execute
    const result = Reflect.getMetadata('onRequest', DemoCtrl.prototype, 'httpRequestWithOpt');

    // Validate
    expect(result).toMatchObject(expectedMetadata);
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
      expect(func.options).toEqual({});
    } else {
      fail(`Method del() not found`);
    }
  });

  it(`should have delWithOptions() method on the Firebase Function List on memory`, () => {
    // Setup
    const func = getFirebaseFunctionList().find((item) => item.methodName === 'delWithOptions');
    if (func) {
      // Execute
      const result = func.method();

      // Validate
      expect(result).toBe('delWithOptions');
      expect(func.className).toBe('DemoCtrl');
      expect(func.methodName).toBe('delWithOptions');
      expect(func.trigger).toBe(FirebaseTriggerType.HTTP_REQUEST);
      expect(func.options?.maxInstances).toBe(1);
    } else {
      fail(`Method delWithOptions() not found`);
    }
  });

  it('should define metadata reflection', () => {
    // Setup
    const expectedMetadata = {
      maxInstances: 1
    };

    // Execute
    const result = Reflect.getMetadata('DELETE', DemoCtrl.prototype, 'delWithOptions');

    // Validate
    expect(result).toMatchObject(expectedMetadata);
  });
});

['GET', 'POST', 'PUT', 'PATCH'].forEach((method) => {
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
        expect(func.options).toEqual({});
      } else {
        fail(`Method ${method.toLowerCase()}() not found`);
      }
    });

    it(`should have ${method.toLowerCase()}WithOptions() method on the Firebase Function List on memory`, () => {
      // Setup
      const functionName = `${method.toLowerCase()}WithOptions`;
      const func = getFirebaseFunctionList().find((item) => item.methodName === functionName);
      if (func) {
        // Execute
        const result = func.method();

        // Validate
        expect(result).toBe(functionName);
        expect(func.className).toBe('DemoCtrl');
        expect(func.methodName).toBe(functionName);
        expect(func.trigger).toBe(FirebaseTriggerType.HTTP_REQUEST);
        expect(func.options?.minInstances).toBe(2);
      } else {
        fail(`Method ${functionName}() not found`);
      }
    });

    it('should define metadata reflection', () => {
      // Setup
      const functionName = `${method.toLowerCase()}WithOptions`;
      const expectedMetadata = {
        minInstances: 2,
      };
  
      // Execute
      const result = Reflect.getMetadata(method, DemoCtrl.prototype, functionName);
  
      // Validate
      expect(result).toMatchObject(expectedMetadata);
    });
  });
});
