import { FirebaseTriggerType } from './firebase-trigger-type';
import { RuntimeOptions } from 'firebase-functions/v1';

export type FirebaseOptions = RuntimeOptions & { region?: string | string[] };

/**
 * Firebase function data
 */
export interface FirebaseFunction {
  /** Class name */
  className: string;

  /** Method name */
  methodName: string;

  /** The method */
  method: Function;

  /** Firebase trigger type */
  trigger: FirebaseTriggerType;

  /**
   * The key to trigger the Cloud Function.
   * If it's a PubSub Publish, the key is the topic.
   * If it's a PubSub Schedule, the key is the cron string.
   * If it's a Firestore Event, the key is the document path.
   */
  key?: string | any;

  /** Firebase runtime options */
  options?: any;
}

export interface FirebaseFunctionList {
  [key: string]: Function | FirebaseFunction | FirebaseFunctionList;
}
