import {
  beforeUserCreated,
  BlockingOptions,
} from 'firebase-functions/v2/identity';
import type { GlobalOptions } from 'firebase-functions/v2/options';
import * as identity from 'firebase-functions/v2/identity';

/**
 * Options for Auth event triggers (onUserCreated / onUserDeleted).
 * Upstream event APIs are available at runtime but not fully typed in firebase-functions@7.
 */
export type AuthEventOptions = GlobalOptions & {
  tenantId?: string;
  retry?: boolean;
};

type AuthEventHandler = (event: unknown) => unknown | Promise<unknown>;

type AuthEventTrigger = {
  (handler: AuthEventHandler): Function;
  (options: AuthEventOptions, handler: AuthEventHandler): Function;
};

const identityRuntime = identity as typeof identity & {
  onUserCreated: AuthEventTrigger;
  onUserDeleted: AuthEventTrigger;
};

export { beforeUserCreated, BlockingOptions };

export const onUserCreated = identityRuntime.onUserCreated;
export const onUserDeleted = identityRuntime.onUserDeleted;
