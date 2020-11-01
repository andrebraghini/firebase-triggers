import { RequestError } from './types';

export const INTERNAL_ERROR: RequestError = {
  code: 'internal/error',
  msg: 'An unexpected internal error has occurred'
};

export const SCHEMA_INVALID: RequestError = {
  code: 'schema/invalid-schema',
  error: 'The sent object is different from the expected schema'
};

export const HTTP_METHOD_NOT_FOUND: RequestError = {
  code: 'http/method-not-found',
  error: 'The HTTP method used in this operation is not allowed'
};

export function mergeError(requestError: RequestError, opt?: { msg?: string, error?: any }): RequestError {
  const result = {
    ...requestError,
    ...(!!(opt && opt.msg) && { msg: opt.msg })
  };

  if (opt && opt.error) {
    let isRequestError = false;

    if (opt.error.code) {
      result.code = opt.error.code;
      isRequestError = true;
    }
    if (opt.error.msg) {
      result.msg = opt.error.msg;
      isRequestError = true;
    }

    if (!isRequestError) {
      result.error = opt.error.message || JSON.stringify(opt.error);
    }
  }

  return result;
}
