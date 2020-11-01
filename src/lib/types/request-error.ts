/**
 * HTTP request error
 */
export interface RequestError {

  /** Internal error code */
  code: string;

  /** Friendly error message */
  msg?: string;

  /** The error */
  error?: any;

  /** Response HTTP error code */
  responseCode?: number;

}
