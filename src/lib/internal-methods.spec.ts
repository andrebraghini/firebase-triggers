import 'reflect-metadata';
import { describe, it } from 'node:test';
import { expect } from '../../test/expect';
import { injectable, container } from 'tsyringe';
import { getClassMethod } from './internal-methods';

class PlainCtrl {
  ping() {
    return 'plain';
  }
}

@injectable()
class InjectedCtrl {
  ping() {
    return 'injected';
  }
}

describe('getClassMethod() DI resolution', () => {
  it('falls back when class is not registered in tsyringe', () => {
    const method = getClassMethod(PlainCtrl.prototype, 'ping');
    expect(method()).toBe('plain');
  });

  it('uses tsyringe when the class is registered', () => {
    container.register(InjectedCtrl, { useClass: InjectedCtrl });
    const method = getClassMethod(InjectedCtrl.prototype, 'ping');
    expect(method()).toBe('injected');
  });
});
