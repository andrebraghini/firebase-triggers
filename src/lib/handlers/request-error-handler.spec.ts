import { describe, it } from 'node:test';
import { expect } from '../../../test/expect';
import { fn } from '../../../test/mock';
import { requestErrorHandler } from './request-error-handler';

function createResponse() {
  const res = {
    status: fn(),
    json: fn(),
  };
  res.status.mockImplementation(() => res);
  res.json.mockImplementation(() => res);
  return res;
}

describe('requestErrorHandler()', () => {
  it('should handle exceptions and send response code 500', async () => {
    const req = {};
    const res = createResponse();
    const originalMethod = () => {
      throw new Error('Original method error');
    };

    const handledMethod = requestErrorHandler(originalMethod);
    await handledMethod(req, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.json.mock.calls.length).toBe(1);
    expect(res.json.mock.calls[0][0]).toMatchObject({
      success: false,
      error: {
        code: 'internal/error',
        msg: 'An unexpected internal error has occurred',
        error: 'Original method error',
      },
    });
  });

  it('should handle exceptions and send response code of an existent error', async () => {
    const req = {};
    const res = createResponse();
    const originalMethod = () => {
      throw { responseCode: 400, msg: 'Test message' };
    };

    const handledMethod = requestErrorHandler(originalMethod);
    await handledMethod(req, res);

    expect(res.status).toBeCalledWith(400);
    expect(res.json.mock.calls.length).toBe(1);
    expect(res.json.mock.calls[0][0]).toMatchObject({
      success: false,
      error: {
        code: 'internal/error',
        msg: 'Test message',
      },
    });
  });
});
