import 'reflect-metadata';
import {
  onFirebaseUserCreate,
  onFirebaseUserDelete,
  onFirestoreCreate,
  onFirestoreUpdate,
  onFirestoreDelete,
  onFirestoreWrite,
  onPubSubPublish,
  onRequest,
  onPubSubSchedule,
  GET,
  POST,
  PUT,
  PATCH,
  DELETE,
} from './decorators';
import { getFirebaseFunctionListToExport } from './functions';
import { FirebaseFunctionList } from './types';

class DemoCtrl {
  @onFirebaseUserCreate()
  userCreate() {
    return 'userCreate';
  }

  @onFirebaseUserDelete()
  userDelete() {
    return 'userDelete';
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

// tslint:disable-next-line: max-classes-per-file
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

// tslint:disable-next-line: max-classes-per-file
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

describe('getFirebaseFunctionListToExport()', () => {
  it('should contain DemoCtrl class methods', () => {
    // Execute
    const result = getFirebaseFunctionListToExport();

    // Validate
    expect((result.demo as FirebaseFunctionList).userCreate).toBeDefined();
    expect((result.demo as FirebaseFunctionList).userDelete).toBeDefined();
    expect((result.demo as FirebaseFunctionList).docCreate).toBeDefined();
    expect((result.demo as FirebaseFunctionList).docUpdate).toBeDefined();
    expect((result.demo as FirebaseFunctionList).docDelete).toBeDefined();
    expect((result.demo as FirebaseFunctionList).docWrite).toBeDefined();
    expect((result.demo as FirebaseFunctionList).pubsubSubscribe).toBeDefined();
    expect((result.demo as FirebaseFunctionList).scheduleInterval).toBeDefined();
    expect((result.demo as FirebaseFunctionList).httpRequest).toBeDefined();
    expect((result.demo as FirebaseFunctionList).httpRequestDiffName).toBeUndefined();
    expect((result.demo as FirebaseFunctionList).newNamePath).toBeUndefined();
    expect(result.newNamePath).toBeDefined();
  });

  it('should contain SecondClassCtrl class methods', () => {
    // Execute
    const result = getFirebaseFunctionListToExport();

    // Validate
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
    // Execute
    const result = getFirebaseFunctionListToExport();

    // Validate
    expect(result.thirdClass).toBeUndefined();
    expect(result.rest).toBeDefined();
  });
});
