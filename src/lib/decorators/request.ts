import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseTriggerType } from '../types';

/**
 * Decorator que adiciona o método da classe à lista de Cloud Functions
 * acionada ao receber uma requisição HTTP
 * @param opt Configurações opcionais da função. Se passar uma string ela é usada como path
 * @param opt.methods Métodos HTTP aceitos na requisição
 * @param opt.path Sufixo da URL também utilizada como nome do método no GCP
 *                 Se não informar o path, será utilizado o próprio nome do método (Recomendado).
 */
export function onRequest(opt?: string | { path?: string, methods?: string|string[] }) {
  return (target: any, key: string) => {
    const firebaseFunction: FirebaseFunction = {
      className: getClassName(target),
      methodName: key,
      method: getClassMethod(target, key),
      trigger: FirebaseTriggerType.HTTP_REQUEST,
      key: opt
    }
    addFirebaseFunction(firebaseFunction);
  }
}
