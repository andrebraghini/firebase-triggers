import 'reflect-metadata';
import { describe, it } from 'node:test';
import { expect } from '../../test/expect';
import { injectable, container } from 'tsyringe';
import {
  getClassMethod,
  getClassName,
  getGroupName,
} from './internal-methods';
import { FirebaseTriggerType } from './types';

class PlainCtrl {
  ping() {
    return 'plain';
  }
}

/** Constructor deps without design:paramtypes make tsyringe reject resolution */
class NeedsDependency {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(dep: { value: string }) {}
  ping() {
    return 'fallback';
  }
}

@injectable()
class InjectedCtrl {
  ping() {
    return 'injected';
  }
}

describe('getClassName()', () => {
  it('returns constructor name for class prototypes', () => {
    expect(getClassName(PlainCtrl.prototype)).toBe('PlainCtrl');
  });

  it('returns function name when target is a constructor', () => {
    expect(getClassName(PlainCtrl)).toBe('PlainCtrl');
  });
});

describe('getGroupName()', () => {
  it('strips Ctrl suffix', () => {
    expect(
      getGroupName({
        className: 'PlainCtrl',
        methodName: 'ping',
        method: () => undefined,
        trigger: FirebaseTriggerType.CALLABLE,
      }),
    ).toBe('plain');
  });

  it('strips Controller suffix', () => {
    expect(
      getGroupName({
        className: 'UserController',
        methodName: 'ping',
        method: () => undefined,
        trigger: FirebaseTriggerType.CALLABLE,
      }),
    ).toBe('user');
  });

  it('keeps class name without known suffixes', () => {
    expect(
      getGroupName({
        className: 'UserService',
        methodName: 'ping',
        method: () => undefined,
        trigger: FirebaseTriggerType.CALLABLE,
      }),
    ).toBe('userService');
  });

  it('returns undefined for HTTP triggers with a string path key', () => {
    expect(
      getGroupName({
        className: 'PlainCtrl',
        methodName: 'ping',
        method: () => undefined,
        trigger: FirebaseTriggerType.HTTP_REQUEST,
        key: 'custom-path',
      }),
    ).toBeUndefined();
  });

  it('returns undefined for HTTP triggers with an object path key', () => {
    expect(
      getGroupName({
        className: 'PlainCtrl',
        methodName: 'ping',
        method: () => undefined,
        trigger: FirebaseTriggerType.HTTP_REQUEST,
        key: { path: 'custom-path', methods: 'GET' },
      }),
    ).toBeUndefined();
  });

  it('keeps the group when HTTP key has no path', () => {
    expect(
      getGroupName({
        className: 'PlainCtrl',
        methodName: 'ping',
        method: () => undefined,
        trigger: FirebaseTriggerType.HTTP_REQUEST,
        key: { methods: 'GET' },
      }),
    ).toBe('plain');
  });
});

describe('getClassMethod() DI resolution', () => {
  it('falls back when class cannot be resolved by tsyringe', () => {
    const method = getClassMethod(NeedsDependency.prototype, 'ping');
    expect(method()).toBe('fallback');
  });

  it('reuses the same fallback instance across calls', () => {
    const first = getClassMethod(NeedsDependency.prototype, 'ping');
    const second = getClassMethod(NeedsDependency.prototype, 'ping');
    expect(first()).toBe('fallback');
    expect(second()).toBe('fallback');
  });

  it('uses tsyringe when the class is registered', () => {
    container.register(InjectedCtrl, { useClass: InjectedCtrl });
    const method = getClassMethod(InjectedCtrl.prototype, 'ping');
    expect(method()).toBe('injected');
  });
});
