import { multipleRequestHandler } from './multiple-request-handler';

describe('multipleRequestHandler()', () => {
  it('should send response code 400 if using an not allowed method', () => {
    // Setup
    const originalMethod = jest.fn();
    const req = { method: 'POST' };
    const res = { status: jest.fn(), json: jest.fn() };
    res.status.mockReturnThis();
    res.json.mockReturnThis();

    // Execute
    const handledMethod = multipleRequestHandler({ GET: originalMethod });
    return handledMethod(req, res).then(() => {
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
    const handledMethod = multipleRequestHandler({ GET: originalMethod });
    return handledMethod(req, res).then(() => {
      expect(originalMethod).toBeCalledWith(req, res);
      expect(res.json.mock.calls.length).toBe(1);
      expect(res.json.mock.calls[0][0]).toMatchObject({ success: true });
    });
  });
  ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].forEach(method => {
    it(`should execute the ${method} method instead the DEFAULT method`, () => {
      // Setup
      const requestedMethod = jest.fn();
      const defaultMethod = jest.fn();
      requestedMethod.mockImplementation((request, response) => {
        response.json({ success: true });
      });
      const req = { method };
      const res = { status: jest.fn(), json: jest.fn() };
      res.status.mockReturnThis();
      res.json.mockReturnThis();

      const requestHandlerList: any = { DEFAULT: defaultMethod };
      requestHandlerList[method] = requestedMethod;
  
      // Execute
      const handledMethod = multipleRequestHandler(requestHandlerList);
      return handledMethod(req, res).then(() => {
        expect(defaultMethod).not.toBeCalled();
        expect(requestedMethod).toBeCalledWith(req, res);
        expect(res.json.mock.calls.length).toBe(1);
        expect(res.json.mock.calls[0][0]).toMatchObject({ success: true });
      });
    });
    it(`should execute the DEFAULT method if the ${method} method does not exist`, () => {
      // Setup
      const defaultMethod = jest.fn();
      defaultMethod.mockImplementation((request, response) => {
        response.json({ success: true });
      });
      const req = { method };
      const res = { status: jest.fn(), json: jest.fn() };
      res.status.mockReturnThis();
      res.json.mockReturnThis();
  
      // Execute
      const handledMethod = multipleRequestHandler({ DEFAULT: defaultMethod });
      return handledMethod(req, res).then(() => {
        expect(defaultMethod).toBeCalledWith(req, res);
        expect(res.json.mock.calls.length).toBe(1);
        expect(res.json.mock.calls[0][0]).toMatchObject({ success: true });
      });
    });
  });
});
