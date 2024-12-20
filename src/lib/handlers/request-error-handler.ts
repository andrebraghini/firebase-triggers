import { logger } from 'firebase-functions';
import { Response } from 'firebase-functions/v1';
import { INTERNAL_ERROR, mergeError } from '../errors';

/**
 * Returns method that, when executing the method passed as a parameter, makes a
 * "try catch" treatment to correctly respond to unexpected HTTP request errors.
 * @param requestHandler HTTP request method that will be executed
 */
export function requestErrorHandler(requestHandler: Function): Function {
  return async function (...args: any[]) {
    const res: Response = args[1];
    try {
      requestHandler.apply(this, args);
    } catch (error: any) {
      res.status(error.responseCode || 500).json({
        success: false,
        error: mergeError(INTERNAL_ERROR, { error }),
      });

      logger.error(error);
    }
  };
}
