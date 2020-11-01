import { acceptedMethodsHandler } from "./accepted-method-handler";

describe('acceptedMethodsHandler()', () => {
  it('should send response code 400 if using an not allowed method', () => {
    // Setup
    const originalMethod = jest.fn();
    const req = { method: 'POST' };
    const res = { status: jest.fn(), json: jest.fn() };
    res.status.mockReturnThis();
    res.json.mockReturnThis();

    // Execute
    const handledMethod = acceptedMethodsHandler(originalMethod, ['GET']);
    return handledMethod(req, res).then(() => {
      expect(originalMethod).not.toBeCalled();
      expect(res.status).toBeCalledWith(400);
      expect(res.json).toBeCalledTimes(1);
      expect(res.json.mock.calls[0][0]).toMatchObject({
        success: false,
        error: {
          code: 'http/method-not-found',
          error: 'The HTTP method used in this operation is not allowed'
        }
      });
    });
  });
  it('should execute the original method if it is using allowed HTTP methods', () => {
    // Setup
    const originalMethod = jest.fn();
    originalMethod.mockImplementation((request, response) => {
      response.json({ success: true });
    });
    const req = { method: 'GET' };
    const res = { status: jest.fn(), json: jest.fn() };
    res.status.mockReturnThis();
    res.json.mockReturnThis();

    // Execute
    const handledMethod = acceptedMethodsHandler(originalMethod, ['GET']);
    return handledMethod(req, res).then(() => {
      expect(originalMethod).toBeCalledWith(req, res);
      expect(res.json).toBeCalledTimes(1);
      expect(res.json.mock.calls[0][0]).toMatchObject({ success: true });
    });
  });
});
