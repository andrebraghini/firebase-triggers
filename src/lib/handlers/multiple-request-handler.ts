import { Request, Response } from 'firebase-functions';
import { HTTP_METHOD_NOT_FOUND } from '../errors';

/**
 * Returns method that checks whether the HTTP method is accepted
 * @param requestHandler HTTP request method that will be executed
 */
export function multipleRequestHandler(requestHandlerList: { [key: string]: Function }): Function {
  return async function (...args: any[]) {
    const req: Request = args[0];
    const res: Response = args[1];

    const handler = requestHandlerList[req.method] || requestHandlerList.DEFAULT;
    if (handler) {
      return handler.apply(this, args);
    }

    res.status(400).json({
      success: false,
      error: HTTP_METHOD_NOT_FOUND,
    });
  };
}
