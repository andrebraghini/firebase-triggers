import { Change } from 'firebase-functions/v2';
import { CallableRequest, Request } from 'firebase-functions/v2/https';
import { Response } from 'express';
import { AuthBlockingEvent } from 'firebase-functions/v2/identity';
import { FirestoreEvent, QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';
import { MessagePublishedData } from 'firebase-functions/v2/pubsub';
import { StorageEvent } from 'firebase-functions/v2/storage';
import { CloudEvent } from 'firebase-functions/v2/core';
import {
  beforeFirebaseUserCreate,
  onFirebaseUserCreate,
  onFirebaseUserDelete,
  onFirestoreCreate,
  onFirestoreUpdate,
  onFirestoreDelete,
  onFirestoreWrite,
  onPubSubPublish,
  onPubSubSchedule,
  onRequest,
  GET,
  POST,
  PUT,
  PATCH,
  DELETE,
  onStorageArchive,
  onStorageDelete,
  onStorageFinalize,
  onStorageMetadataUpdate,
  onCall,
} from 'firebase-triggers';

export class UserCtrl {
  @onCall()
  doSomething(_request: CallableRequest) {
    console.log('callable method doSomething() executed');
  }

  @beforeFirebaseUserCreate()
  beforeCreate(event: AuthBlockingEvent) {
    console.log(`${event.data?.displayName} is joining`);
  }

  @onFirebaseUserCreate()
  onCreate(event: unknown) {
    console.log('user created', event);
  }

  @onFirebaseUserDelete()
  onDelete(event: unknown) {
    console.log('user deleted', event);
  }

  @onFirestoreCreate('users/{uid}')
  docCreate(event: FirestoreEvent<QueryDocumentSnapshot | undefined>) {
    const newValue = event.data?.data();
    const name = newValue?.name;
    const age = newValue?.age;
    console.log(`${name} is ${age} years old.`);
  }

  @onFirestoreUpdate('users/{id}')
  docUpdate(event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined>) {
    const newValue = event.data?.after.data();
    const previousValue = event.data?.before.data();
    console.log(`Changed age from "${previousValue?.age}" to "${newValue?.age}"`);
  }

  @onFirestoreDelete('users/{id}')
  docDelete(event: FirestoreEvent<QueryDocumentSnapshot | undefined>) {
    const oldValue = event.data?.data();
    console.log(`User "${oldValue?.name}" was removed from collection`);
  }

  @onFirestoreWrite('user/{id}')
  docWrite(event: FirestoreEvent<Change<QueryDocumentSnapshot> | undefined>) {
    const newDocument = event.data?.after.exists ? event.data.after.data() : undefined;
    const oldDocument = event.data?.before.exists ? event.data.before.data() : undefined;

    if (!newDocument) {
      console.log(`User "${oldDocument?.name}" was removed from collection`);
      return;
    }

    if (!oldDocument) {
      console.log(`${newDocument.name} is ${newDocument.age} years old.`);
      return;
    }

    console.log(`Changed age from "${oldDocument.age}" to "${newDocument.age}"`);
  }

  @onPubSubPublish('my-topic')
  pubsubSubscribe(event: CloudEvent<MessagePublishedData>) {
    console.log('Data published via PubSub on my-topic:', event.data.message.json);
  }

  @onPubSubSchedule('0 5 * * *')
  everyDayAtFiveAM() {
    console.log('Method executed every day at 5 AM');
  }

  @onRequest('myCustomPath')
  httpRequest(request: Request, response: Response) {
    console.log({ requestBody: request.body });
    response.send('Custom response!');
  }

  @onRequest()
  helloWorld(_request: Request, response: Response) {
    response.send('Hello World!');
  }

  @GET('users')
  get(request: Request, response: Response) {
    const id = request.path.split('/')[1];
    const data = id
      ? {
          name: 'Robin Hood',
          age: 42,
        }
      : [];
    response.json(data);
  }

  @POST('users')
  post(_request: Request, response: Response) {
    response.status(201).json({ success: true, msg: 'User created' });
  }

  @PUT('users')
  put(_request: Request, response: Response) {
    response.status(201).json({ success: true, msg: 'User updated' });
  }

  @PATCH('users')
  patch(_request: Request, response: Response) {
    response.status(201).json({ success: true, msg: 'User updated partially' });
  }

  @DELETE('users')
  del(_request: Request, response: Response) {
    response.status(201).json({ success: true, msg: 'User removed' });
  }

  @onStorageArchive('sample-bucket')
  onArchiveFile(event: StorageEvent) {
    console.log(`File ${event.data.name} archived`);
  }

  @onStorageDelete('sample-bucket')
  onDeleteFile(event: StorageEvent) {
    console.log(`File ${event.data.name} deleted`);
  }

  @onStorageFinalize('sample-bucket')
  onFinalizeFileUpload(event: StorageEvent) {
    console.log(`File ${event.data.name} uploaded`);
  }

  @onStorageMetadataUpdate('sample-bucket')
  onUpdateFileMetadata(event: StorageEvent) {
    console.log(`File ${event.data.name} updated`);
  }

  @onRequest({
    memory: '128MiB',
    timeoutSeconds: 60,
    minInstances: 2,
    maxInstances: 4,
    vpcConnectorEgressSettings: 'ALL_TRAFFIC',
    ingressSettings: 'ALLOW_ALL',
    invoker: 'public',
    region: 'us-east1',
  })
  httpRequestWithCustomSetup(request: Request, response: Response) {
    console.log({ requestBody: request.body });
    response.send('Custom response!');
  }
}
