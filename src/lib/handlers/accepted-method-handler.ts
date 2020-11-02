import * as functions from 'firebase-functions';
import { HTTP_METHOD_NOT_FOUND } from '../errors';

function validateRequest(req: functions.Request, res: functions.Response, methods: string[]): boolean {
  if (!methods.length) {
    return true;
  }

  const index = methods
    .map(method => method.toUpperCase())
    .indexOf(req.method.toUpperCase());
  
  if (index >= 0) {
    return true;
  }

  res
    .status(400)
    .json({
      success: false,
      error: HTTP_METHOD_NOT_FOUND
    });

  return false;
}

/**
 * Returns method that checks whether the HTTP method is accepted
 * @param requestHandler HTTP request method that will be executed
 */
export function acceptedMethodsHandler(requestHandler: Function, methods: string[] = []): Function {
  return async function(...args: any[]) {
    if (validateRequest(args[0], args[1], methods)) {
      return requestHandler.apply(this, args);
    }
  }
}
