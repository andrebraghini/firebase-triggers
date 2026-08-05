import 'reflect-metadata';
import { describe, it } from 'node:test';
import { expect, fail } from '../../../test/expect';
import { onFirestoreCreateWithAuthContext } from './firestore-create-auth-context';
import { onFirestoreUpdateWithAuthContext } from './firestore-update-auth-context';
import { onFirestoreDeleteWithAuthContext } from './firestore-delete-auth-context';
import { onFirestoreWriteWithAuthContext } from './firestore-write-auth-context';
import { FirebaseTriggerType } from '../types';
import { getFirebaseFunctionList } from '../internal-methods';

class DemoCtrl {
  @onFirestoreCreateWithAuthContext('demo/{id}')
  createWithAuth() {
    return 'createWithAuth';
  }

  @onFirestoreUpdateWithAuthContext('demo/{id}')
  updateWithAuth() {
    return 'updateWithAuth';
  }

  @onFirestoreDeleteWithAuthContext('demo/{id}')
  deleteWithAuth() {
    return 'deleteWithAuth';
  }

  @onFirestoreWriteWithAuthContext('demo/{id}')
  writeWithAuth() {
    return 'writeWithAuth';
  }
}

const cases = [
  {
    methodName: 'createWithAuth',
    trigger: FirebaseTriggerType.FIRESTORE_CREATE_WITH_AUTH_CONTEXT,
    meta: 'onFirestoreCreateWithAuthContext',
  },
  {
    methodName: 'updateWithAuth',
    trigger: FirebaseTriggerType.FIRESTORE_UPDATE_WITH_AUTH_CONTEXT,
    meta: 'onFirestoreUpdateWithAuthContext',
  },
  {
    methodName: 'deleteWithAuth',
    trigger: FirebaseTriggerType.FIRESTORE_DELETE_WITH_AUTH_CONTEXT,
    meta: 'onFirestoreDeleteWithAuthContext',
  },
  {
    methodName: 'writeWithAuth',
    trigger: FirebaseTriggerType.FIRESTORE_WRITE_WITH_AUTH_CONTEXT,
    meta: 'onFirestoreWriteWithAuthContext',
  },
];

describe('Firestore WithAuthContext decorators', () => {
  for (const item of cases) {
    it(`should register ${item.methodName}()`, () => {
      const func = getFirebaseFunctionList().find((entry) => entry.methodName === item.methodName);
      if (!func) {
        fail(`Method ${item.methodName}() not found`);
        return;
      }
      expect(func.method()).toBe(item.methodName);
      expect(func.trigger).toBe(item.trigger);
      expect(func.key).toBe('demo/{id}');
      expect(Reflect.getMetadata(item.meta, DemoCtrl.prototype, item.methodName)).toMatchObject({
        document: 'demo/{id}',
      });
    });
  }
});
