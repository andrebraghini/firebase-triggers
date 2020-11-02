import { FirebaseFunction, FirebaseTriggerType } from './types';
import { container } from 'tsyringe';

/** List of Cloud Functions found at startup */
const firebaseFunctionList: FirebaseFunction[] = [];

/**
 * Returns the list of Cloud Functions found at startup or added later
 */
export function getFirebaseFunctionList(): FirebaseFunction[] {
  return firebaseFunctionList;
}

/**
 * Returns the class name of the target object
 * @param target
 */
export function getClassName(target: any): string {
  return target.constructor.name === 'Function' ? target.name : target.constructor.name;
}

/**
 * Returns group name based on class name ignoring any suffix equal to 'Ctrl'.
 * If the function's trigger is for HTTP requests and the parameter with the method name
 * is informed, then the naming rule will be ignored and the method should return undefined.
 * @param func Firebase function data
 */
export function getGroupName(func: FirebaseFunction): string | undefined {
  if (func.trigger === FirebaseTriggerType.HTTP_REQUEST && func.key) {
    const path = typeof func.key === 'string' ? func.key : func.key.path;
    if (path) {
      return;
    }
  }

  const removeCtrl = func.className.slice(-4).toLowerCase() === 'ctrl';
  const sliceEnd = removeCtrl ? -4 : func.className.length;

  return func.className.charAt(0).toLowerCase() + func.className.slice(1, sliceEnd);
}

/**
 * Returns the class method instantiated by the resolver to do the dependency injection.
 * @param target Control class
 * @param methodName Method name
 */
export function getClassMethod(target: any, methodName: string) {
  return (...args: any) => {
    const instance: any = container.resolve(target.constructor);
    return instance[methodName](...args);
  };
}

/**
 * Adds Firebase function to the project list in memory
 * @param firebaseFunction Firebase function data
 */
export function addFirebaseFunction(firebaseFunction: FirebaseFunction): void {
  firebaseFunctionList.push(firebaseFunction);
}
