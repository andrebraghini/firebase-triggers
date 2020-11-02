import { requestErrorHandler } from './request-error-handler';

describe('requestErrorHandler()', () => {
  it('should handle exceptions and send response code 500', () => {
    // Setup
    const req = {};
    const res = { status: jest.fn(), json: jest.fn() };
    res.status.mockReturnThis();
    res.json.mockReturnThis();
    const originalMethod = () => {
      throw new Error('Original method error');
    };

    // Execute
    const handledMethod = requestErrorHandler(originalMethod);
    return handledMethod(req, res).then(() => {
      expect(res.status).toBeCalledWith(500);
      expect(res.json).toBeCalledTimes(1);
      expect(res.json.mock.calls[0][0]).toMatchObject({
        success: false,
        error: {
          code: 'internal/error',
          msg: 'An unexpected internal error has occurred',
          error: 'Original method error',
        },
      });
    });
  });
  it('should handle exceptions and send response code of an existent error', () => {
    // Setup
    const req = {};
    const res = { status: jest.fn(), json: jest.fn() };
    res.status.mockReturnThis();
    res.json.mockReturnThis();
    const originalMethod = () => {
      throw { responseCode: 400, msg: 'Test message' };
    };

    // Execute
    const handledMethod = requestErrorHandler(originalMethod);
    return handledMethod(req, res).then(() => {
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledTimes(1);
      expect(res.json.mock.calls[0][0]).toMatchObject({
        success: false,
        error: {
          code: 'internal/error',
          msg: 'Test message',
        },
      });
    });
  });
});
