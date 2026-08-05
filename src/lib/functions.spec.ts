import 'reflect-metadata';
import { describe, it, before, after } from 'node:test';
import { mkdirSync, writeFileSync, rmSync } from 'fs';
import { resolve } from 'path';
import { expect } from '../../test/expect';
import {
  onCall,
  onFirebaseUserCreate,
  onFirebaseUserDelete,
  beforeFirebaseUserCreate,
  onFirestoreCreate,
  onFirestoreUpdate,
  onFirestoreDelete,
  onFirestoreWrite,
  onFirestoreCreateWithAuthContext,
  onFirestoreUpdateWithAuthContext,
  onFirestoreDeleteWithAuthContext,
  onFirestoreWriteWithAuthContext,
  onPubSubPublish,
  onRequest,
  onPubSubSchedule,
  onStorageArchive,
  onStorageDelete,
  onStorageFinalize,
  onStorageMetadataUpdate,
  GET,
  POST,
  PUT,
  PATCH,
  DELETE,
} from './decorators';
import { getFirebaseFunctionListToExport } from './functions';
import { addFirebaseFunction } from './internal-methods';
import { FirebaseFunctionList, FirebaseTriggerType } from './types';

class DemoCtrl {
  @onCall()
  callableMethod() {
    return 'callableMethod';
  }

  @onFirebaseUserCreate()
  userCreate() {
    return 'userCreate';
  }

  @onFirebaseUserDelete()
  userDelete() {
    return 'userDelete';
  }

  @beforeFirebaseUserCreate()
  beforeUserCreate() {
    return 'beforeUserCreate';
  }

  @onFirestoreCreate('demo_collection/{id}')
  docCreate() {
    return 'docCreate';
  }

  @onFirestoreUpdate('demo_collection/{id}')
  docUpdate() {
    return 'docUpdate';
  }

  @onFirestoreDelete('demo_collection/{id}')
  docDelete() {
    return 'docDelete';
  }

  @onFirestoreWrite('demo_collection/{id}')
  docWrite() {
    return 'docWrite';
  }

  @onFirestoreCreateWithAuthContext('demo_collection/{id}')
  docCreateWithAuth() {
    return 'docCreateWithAuth';
  }

  @onFirestoreUpdateWithAuthContext('demo_collection/{id}')
  docUpdateWithAuth() {
    return 'docUpdateWithAuth';
  }

  @onFirestoreDeleteWithAuthContext('demo_collection/{id}')
  docDeleteWithAuth() {
    return 'docDeleteWithAuth';
  }

  @onFirestoreWriteWithAuthContext('demo_collection/{id}')
  docWriteWithAuth() {
    return 'docWriteWithAuth';
  }

  @onPubSubPublish('the-topic')
  pubsubSubscribe() {
    return 'pubsubSubscribe';
  }

  @onPubSubSchedule('* * * * *')
  scheduleInterval() {
    return 'scheduleInterval';
  }

  @onRequest()
  httpRequest() {
    return 'httpRequest';
  }

  @onRequest('newNamePath')
  httpRequestDiffName() {
    return 'httpRequestDiffName';
  }
}

class SecondClassCtrl {
  @onFirebaseUserCreate()
  userCreate() {
    return 'userCreate';
  }

  @onFirebaseUserDelete()
  userDelete() {
    return 'userDelete';
  }

  @onFirestoreCreate('demo_collection/{id}')
  testOne() {
    return 'testOne';
  }

  @onFirestoreUpdate('demo_collection/{id}')
  testTwo() {
    return 'testTwo';
  }

  @onRequest('uniquePath')
  httpRequestDiffName() {
    return 'httpRequestDiffName';
  }

  @GET()
  getRequest() {
    return 'getRequest';
  }

  @POST()
  postRequest() {
    return 'postRequest';
  }

  @PUT()
  putRequest() {
    return 'putRequest';
  }

  @PATCH()
  patchRequest() {
    return 'patchRequest';
  }

  @DELETE()
  deleteRequest() {
    return 'deleteRequest';
  }
}

class ThirdClassCtrl {
  @GET('rest')
  get() {
    return 'get';
  }

  @POST('rest')
  post() {
    return 'post';
  }

  @PUT('rest')
  put() {
    return 'put';
  }

  @PATCH('rest')
  patch() {
    return 'patch';
  }

  @DELETE('rest')
  del() {
    return 'del';
  }
}

class StorageCtrl {
  @onStorageArchive('bucket-name')
  archive() {
    return 'archive';
  }

  @onStorageDelete('bucket-name')
  del() {
    return 'del';
  }

  @onStorageFinalize('bucket-name')
  finalize() {
    return 'finalize';
  }

  @onStorageMetadataUpdate('bucket-name')
  updateMetadata() {
    return 'updateMetadata';
  }
}

/** HTTP-only class so the export path creates a new group bucket */
class OnlyHttpService {
  @onRequest()
  ping() {
    return 'ping';
  }
}

describe('getFirebaseFunctionListToExport()', () => {
  const schemaDir = resolve('schema');
  const schemaFile = resolve('schema/demo-httpRequest.json');

  before(() => {
    mkdirSync(schemaDir, { recursive: true });
    writeFileSync(
      schemaFile,
      JSON.stringify({
        type: 'object',
        properties: { ok: { type: 'boolean' } },
      }),
    );

    addFirebaseFunction({
      className: '',
      methodName: 'ungroupedCallable',
      method: () => 'ungroupedCallable',
      trigger: FirebaseTriggerType.CALLABLE,
    });

    addFirebaseFunction({
      className: 'EdgeHttp',
      methodName: 'stringKeyHttp',
      method: () => 'stringKeyHttp',
      trigger: FirebaseTriggerType.HTTP_REQUEST,
      key: 'stringKeyPath',
    });

    addFirebaseFunction({
      className: 'EdgeHttp',
      methodName: 'noKeyHttp',
      method: () => 'noKeyHttp',
      trigger: FirebaseTriggerType.HTTP_REQUEST,
    });

    addFirebaseFunction({
      className: 'EdgeHttp',
      methodName: 'methodsArrayHttp',
      method: () => 'methodsArrayHttp',
      trigger: FirebaseTriggerType.HTTP_REQUEST,
      key: { methods: ['GET', 'POST'] },
    });
  });

  after(() => {
    rmSync(schemaDir, { recursive: true, force: true });
  });

  it('should contain DemoCtrl class methods', () => {
    const result = getFirebaseFunctionListToExport();

    expect((result.demo as FirebaseFunctionList).callableMethod).toBeDefined();
    expect((result.demo as FirebaseFunctionList).userCreate).toBeDefined();
    expect((result.demo as FirebaseFunctionList).userDelete).toBeDefined();
    expect((result.demo as FirebaseFunctionList).beforeUserCreate).toBeDefined();
    expect((result.demo as FirebaseFunctionList).docCreate).toBeDefined();
    expect((result.demo as FirebaseFunctionList).docUpdate).toBeDefined();
    expect((result.demo as FirebaseFunctionList).docDelete).toBeDefined();
    expect((result.demo as FirebaseFunctionList).docWrite).toBeDefined();
    expect((result.demo as FirebaseFunctionList).docCreateWithAuth).toBeDefined();
    expect((result.demo as FirebaseFunctionList).docUpdateWithAuth).toBeDefined();
    expect((result.demo as FirebaseFunctionList).docDeleteWithAuth).toBeDefined();
    expect((result.demo as FirebaseFunctionList).docWriteWithAuth).toBeDefined();
    expect((result.demo as FirebaseFunctionList).pubsubSubscribe).toBeDefined();
    expect((result.demo as FirebaseFunctionList).scheduleInterval).toBeDefined();
    expect((result.demo as FirebaseFunctionList).httpRequest).toBeDefined();
    expect((result.demo as FirebaseFunctionList).httpRequestDiffName).toBeUndefined();
    expect((result.demo as FirebaseFunctionList).newNamePath).toBeUndefined();
    expect(result.newNamePath).toBeDefined();
  });

  it('should contain SecondClassCtrl class methods', () => {
    const result = getFirebaseFunctionListToExport();

    expect((result.secondClass as FirebaseFunctionList).userCreate).toBeDefined();
    expect((result.secondClass as FirebaseFunctionList).userDelete).toBeDefined();
    expect((result.secondClass as FirebaseFunctionList).testOne).toBeDefined();
    expect((result.secondClass as FirebaseFunctionList).testTwo).toBeDefined();
    expect((result.secondClass as FirebaseFunctionList).httpRequestDiffName).toBeUndefined();
    expect((result.secondClass as FirebaseFunctionList)['uniquePath*']).toBeUndefined();
    expect(result['uniquePath']).toBeDefined();
    expect((result.secondClass as FirebaseFunctionList).getRequest).toBeDefined();
    expect((result.secondClass as FirebaseFunctionList).postRequest).toBeDefined();
    expect((result.secondClass as FirebaseFunctionList).putRequest).toBeDefined();
    expect((result.secondClass as FirebaseFunctionList).patchRequest).toBeDefined();
    expect((result.secondClass as FirebaseFunctionList).deleteRequest).toBeDefined();
  });

  it('should contain just the "rest" method of ThirdClassCtrl', () => {
    const result = getFirebaseFunctionListToExport();

    expect(result.thirdClass).toBeUndefined();
    expect(result.rest).toBeDefined();
  });

  it('should contain StorageCtrl class methods', () => {
    const result = getFirebaseFunctionListToExport();

    expect((result.storage as FirebaseFunctionList).archive).toBeDefined();
    expect((result.storage as FirebaseFunctionList).del).toBeDefined();
    expect((result.storage as FirebaseFunctionList).finalize).toBeDefined();
    expect((result.storage as FirebaseFunctionList).updateMetadata).toBeDefined();
  });

  it('should export HTTP-only groups and edge-case registrations', () => {
    const result = getFirebaseFunctionListToExport();

    expect((result.onlyHttpService as FirebaseFunctionList).ping).toBeDefined();
    expect(result.ungroupedCallable).toBeDefined();
    expect(result.stringKeyPath).toBeDefined();
    expect((result.edgeHttp as FirebaseFunctionList).noKeyHttp).toBeDefined();
    expect((result.edgeHttp as FirebaseFunctionList).methodsArrayHttp).toBeDefined();
  });
});
