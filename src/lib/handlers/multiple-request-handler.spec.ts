import { describe, it } from 'node:test';
import { expect } from '../../../test/expect';
import { fn } from '../../../test/mock';
import { multipleRequestHandler } from './multiple-request-handler';

function createResponse() {
  const res = {
    status: fn(),
    json: fn(),
  };
  res.status.mockImplementation(() => res);
  res.json.mockImplementation(() => res);
  return res;
}

describe('multipleRequestHandler()', () => {
  it('should send response code 400 if using an not allowed method', async () => {
    const originalMethod = fn();
    const req = { method: 'POST' };
    const res = createResponse();

    const handledMethod = multipleRequestHandler({ GET: originalMethod });
    await handledMethod(req, res);

    expect(originalMethod).not.toBeCalled();
    expect(res.status).toBeCalledWith(400);
    expect(res.json.mock.calls.length).toBe(1);
    expect(res.json.mock.calls[0][0]).toMatchObject({
      success: false,
      error: {
        code: 'http/method-not-found',
        error: 'The HTTP method used in this operation is not allowed',
      },
    });
  });

  it('should execute the original method if it is using allowed HTTP methods', async () => {
    const originalMethod = fn((request, response) => {
      response.json({ success: true });
    });
    const req = { method: 'GET' };
    const res = createResponse();

    const handledMethod = multipleRequestHandler({ GET: originalMethod });
    await handledMethod(req, res);

    expect(originalMethod).toBeCalledWith(req, res);
    expect(res.json.mock.calls.length).toBe(1);
    expect(res.json.mock.calls[0][0]).toMatchObject({ success: true });
  });

  for (const method of ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']) {
    it(`should execute the ${method} method instead the DEFAULT method`, async () => {
      const requestedMethod = fn((request, response) => {
        response.json({ success: true });
      });
      const defaultMethod = fn();
      const req = { method };
      const res = createResponse();

      const requestHandlerList: Record<string, Function> = { DEFAULT: defaultMethod };
      requestHandlerList[method] = requestedMethod;

      const handledMethod = multipleRequestHandler(requestHandlerList);
      await handledMethod(req, res);

      expect(defaultMethod).not.toBeCalled();
      expect(requestedMethod).toBeCalledWith(req, res);
      expect(res.json.mock.calls.length).toBe(1);
      expect(res.json.mock.calls[0][0]).toMatchObject({ success: true });
    });

    it(`should execute the DEFAULT method if the ${method} method does not exist`, async () => {
      const defaultMethod = fn((request, response) => {
        response.json({ success: true });
      });
      const req = { method };
      const res = createResponse();

      const handledMethod = multipleRequestHandler({ DEFAULT: defaultMethod });
      await handledMethod(req, res);

      expect(defaultMethod).toBeCalledWith(req, res);
      expect(res.json.mock.calls.length).toBe(1);
      expect(res.json.mock.calls[0][0]).toMatchObject({ success: true });
    });
  }
});
