import { FirebaseFunction, FirebaseTriggerType } from './types';
import { container } from 'tsyringe';

/** List of Cloud Functions found at startup */
const firebaseFunctionList: FirebaseFunction[] = [];

/** Fallback instances when DI container does not resolve the class */
const fallbackInstances = new WeakMap<Function, object>();

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
  const { trigger, key, className } = func;
  if (trigger === FirebaseTriggerType.HTTP_REQUEST && key) {
    const path = typeof key === 'string' ? key : key.path;
    if (path) {
      return;
    }
  }

  return className.charAt(0).toLowerCase() + className.slice(1, getSliceEnd(className));
}

/**
 * Returns the position to slice the class name, ignoring some key words
 * @param className Class name
 */
function getSliceEnd(className: string): number {
  const suffixToRemove = ['ctrl', 'controller'];

  for (const suffix of suffixToRemove) {
    if (className.toLowerCase().endsWith(suffix)) return -suffix.length;
  }

  return className.length;
}

function resolveInstance(Constructor: Function): any {
  try {
    return container.resolve(Constructor as any);
  } catch {
    const existing = fallbackInstances.get(Constructor);
    if (existing) {
      return existing;
    }
    const instance = new (Constructor as any)();
    fallbackInstances.set(Constructor, instance);
    return instance;
  }
}

/**
 * Returns the class method instantiated by the resolver to do the dependency injection.
 * Falls back to a library-managed instance when the class is not registered in tsyringe.
 * @param target Control class
 * @param methodName Method name
 */
export function getClassMethod(target: any, methodName: string) {
  return (...args: any) => {
    const instance: any = resolveInstance(target.constructor);
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
