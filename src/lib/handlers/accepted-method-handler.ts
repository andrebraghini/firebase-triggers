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
 * Retorna método que verifica se o método HTTP é aceito
 * @param requestHandler Método de requisição HTTP que será executado
 */
export function acceptedMethodsHandler(requestHandler: Function, methods: string[] = []): Function {
  return async function(...args: any[]) {
    if (validateRequest(args[0], args[1], methods)) {
      return requestHandler.apply(this, args);
    }
  }
}
