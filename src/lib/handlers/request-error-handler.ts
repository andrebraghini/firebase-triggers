import * as functions from 'firebase-functions';
import { INTERNAL_ERROR, mergeError } from '../errors';

/**
 * Retorna método que, ao executar o método passado como parâmetro faz um tratamento
 * com try catch para responder corretamente a erros não previstos de requisições HTTP
 * @param requestHandler Método de requisição HTTP que será executado
 */
export function requestErrorHandler(requestHandler: Function): Function {
  return async function(...args: any[]) {
    const res: functions.Response = args[1];
    try {
      requestHandler.apply(this, args);
    } catch (error) {
      res
        .status(error.responseCode || 500)
        .json({
          success: false,
          error: mergeError(INTERNAL_ERROR, { error })
        });

      console.error(error);
    }
  }
}
