<p align="center">
  <img src="./doc/firebase-triggers.png" alt="Firebase Triggers" width="500"/>
</p>

<p align="center">	
  <a href="https://www.linkedin.com/in/andrebraghinis/">
    <img alt="André Braghini" src="https://img.shields.io/badge/-AndreBraghiniS-FFCA28?style=flat&logo=Linkedin&logoColor=white" />
  </a>
  <a href="https://www.npmjs.com/package/firebase-triggers">
    <img alt="npm version" src="https://img.shields.io/npm/v/firebase-triggers?color=FFCA28">
  </a>
  <a href="https://github.com/andrebraghini/firebase-triggers/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-FFCA28">
  </a>
  <a href="https://codecov.io/gh/andrebraghini/firebase-triggers">
    <img src="https://codecov.io/gh/andrebraghini/firebase-triggers/branch/main/graph/badge.svg?token=SF8KVUI3A8"/>
  </a>
  <img alt="Build result" src="https://travis-ci.org/andrebraghini/firebase-triggers.svg?branch=main">

  <br>

  <i>
    A TypeScript library that provides decorators to link class methods to Firebase Authentication, Firestore and PubSub triggers. 
  </i>
</p>

<p align="center">
  <a href="README.md">English</a>
  ·
  <a href="https://github.com/andrebraghini/firebase-triggers/blob/main/README.pt.md">Portuguese</a>
</p>


## Content

1. [Installation](#installation)

2. [Usage](#usage)

3. [Decorators](#decorators)

4. [Schema validation](#schema-validation)

5. [Sample project](https://github.com/andrebraghini/firebase-triggers-sample)


## Installation

`npm install --save firebase-triggers`


## Usage

Before deploying to Firebase Functions you need to export the methods at the entry point of your application.

The `getFirebaseFunctionListToExport()` method returns an object with the list of methods found in the application.

Iterate the object by exporting each method individually with the property name as in the example below:

```ts
import 'reflect-metadata';
import { getFirebaseFunctionListToExport } from 'firebase-triggers';

// Obtain the "Cloud Functions" found in the code and export each one
const list = getFirebaseFunctionListToExport();
for (const key in list) {
    exports[key] = list[key];
}
```

Cloud Functions will be exported grouped by class.
Assuming you have an `UserCtrl` class with `update()` and `list()` methods, these methods will be exported with the names **user-update** and **user-list** respectively in Cloud Functions.


### Simple example

```ts
import 'reflect-metadata';
import { ParamsOf } from 'firebase-functions/lib/common/params';
import { FirestoreEvent, QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';
import { Request } from 'firebase-functions/lib/common/providers/https';
import { Response } from 'firebase-functions';
import { getFirebaseFunctionListToExport, onFirestoreCreate, onRequest } from 'firebase-triggers';

class MyCtrl {
    @onFirestoreCreate('todo/{id}')
    docWrite(event: FirestoreEvent<QueryDocumentSnapshot, ParamsOf<string>>) {
        const id = event.params.uid;
        const data = event.data.data();
        console.log(`New task ${id} added: ${data.title} at ${data.time}`);
    }

    @onRequest('hello-world')
    httpRequest(request: Request, response: Response) {
        response.send('Hello World!');
    }
}

// Obtain the "Cloud Functions" found in the code and export each one
const list = getFirebaseFunctionListToExport();
for (const key in list) {
    exports[key] = list[key];
}
```

## Decorators

To define Firebase Functions triggers, just add the desired decorator on the method, not forgetting to import the decorator:

e.g. `import { onRequest } from 'firebase-triggers';`

### @onFirebaseUserCreate()

Add the `@onFirebaseUserCreate()` decorator to a method to be executed whenever a new user is created in Firebase Authentication.

```ts
import { onFirebaseUserCreate } from 'firebase-triggers';
import { AuthBlockingEvent } from 'firebase-functions/v2/identity';
import { EventContext } from 'firebase-functions';

class UserCtrl {
    @onFirebaseUserCreate()
    onCreate(event: AuthBlockingEvent) {
        console.log(`${event.data.displayName} joined us`);
    }
}
```


### @onFirebaseUserDelete()

Add the `@onFirebaseUserDelete()` decorator to a method to be executed whenever a user is removed from Firebase Authentication.

```ts
import { onFirebaseUserDelete } from 'firebase-triggers';
import { UserRecord } from 'firebase-functions/auth';
import { EventContext } from 'firebase-functions';

class UserCtrl {
    @onFirebaseUserDelete()
    onDelete(user: UserRecord, context: EventContext) {
        console.log(`${user.displayName} left us`);
    }
}
```


### @onFirestoreCreate()

Add the `@onFirestoreCreate()` decorator to a method to be executed whenever a new document is **created** in Firestore, in the collection defined as a decorator parameter.

```ts
import { FirestoreEvent, QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';
import { ParamsOf } from 'firebase-functions/lib/common/params';
import { onFirestoreCreate } from 'firebase-triggers';

class TodoCtrl {
    @onFirestoreCreate('todo/{id}')
    onCreate(event: FirestoreEvent<QueryDocumentSnapshot, ParamsOf<string>>) {
        // Get an object representing the document. e.g. { title: 'Wash the dishes', time: '12:00' }
        const newValue = event.data.data();
        // access a particular field as you would any JS property
        const title = newValue.title;
        const time = newValue.time;

        console.log(`New task added: ${title} at ${time}`);
    }
}
```


### @onFirestoreUpdate()

Add the `@onFirestoreUpdate()` decorator to a method to be executed whenever an existing document is **changed** in Firestore, in the collection defined as a decorator parameter.

```ts
import { FirestoreEvent, QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';
import { Change } from 'firebase-functions';
import { ParamsOf } from 'firebase-functions/lib/common/params';
import { onFirestoreUpdate } from 'firebase-triggers';

class TodoCtrl {
    @onFirestoreUpdate('todo/{id}')
    onUpdate(event: FirestoreEvent<Change<QueryDocumentSnapshot>, ParamsOf<string>>) {
        // Get an object representing the document. e.g. { title: 'Wash the dishes', time: '12:00' }
        const newValue = event.data.after.data();
        // ...or the previous value before this update
        const previousValue = event.data.before.data();
        // access a particular field as you would any JS property
        const newTitle = newValue.title;
        const oldTitle = previousValue.title;

        console.log(`Changed the title from "${oldTitle}" to "${newTitle}"`);
    }
}
```


### @onFirestoreDelete()

Add the `@onFirestoreDelete()` decorator to a method to be executed whenever a document is **removed** from the Firestore, in the collection defined as a decorator parameter.

```ts
import { FirestoreEvent, QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';
import { ParamsOf } from 'firebase-functions/lib/common/params';
import { onFirestoreDelete } from 'firebase-triggers';

class TodoCtrl {
    @onFirestoreDelete('todo/{id}')
    onDelete(event: FirestoreEvent<QueryDocumentSnapshot, ParamsOf<string>>) {
        // Get an object representing the document. e.g. { title: 'Wash the dishes', time: '12:00' }
        const oldValue = event.data.data();
        // access a particular field as you would any JS property
        const title = oldValue.title;

        console.log(`Task "${title}" removed`);
    }
}
```


### @onFirestoreWrite()

Add the `onFirestoreWrite()`decorator to a method to be executed whenever a document is **created, changed or removed** from the Firestore, in the collection defined as a decorator parameter.

```ts
import { FirestoreEvent, QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';
import { Change } from 'firebase-functions';
import { ParamsOf } from 'firebase-functions/lib/common/params';
import { onFirestoreWrite } from 'firebase-triggers';

class TodoCtrl {
    @onFirestoreWrite('todo/{id}')
    onWrite(event: FirestoreEvent<Change<DocumentSnapshot>, ParamsOf<string>>) {
        // Get an object with the current document value. If the document does not exist, it has been deleted.
        const newDocument = event.data.after.exists ? event.data.after.data() : null;
        // Get an object with the previous document value (for update or delete)
        const oldDocument = event.data.before.exists ? event.data.before.data() : null;

        if (!newDocument) {
            const title = oldDocument.title;
            console.log(`Task "${title}" removed`);
            return;
        }

        if (!oldDocument) {
            const title = newDocument.title;
            const time = newDocument.time;
            console.log(`New task added: ${title} at ${time}`);
            return;
        }

        const newTitle = newDocument.title;
        const oldTitle = oldDocument.title;

        console.log(`Changed the title from "${oldTitle}" to "${newTitle}"`);
    }
}
```


### @onPubSubPublish()

Add the `@onPubSubPublish()` decorator to a method to be executed whenever a publication is made via PubSub, on the topic defined as a parameter in the decorator.

```ts
import { CloudEvent } from 'firebase-functions/lib/v2/core';
import { MessagePublishedData } from 'firebase-functions/v2/pubsub';
import { onPubSubPublish } from 'firebase-triggers';

class SampleCtrl {
    @onPubSubPublish('my-topic')
    doSomething(event: CloudEvent<MessagePublishedData<any>>) {
        const publishedData = message.json;
        console.log('Data published via PubSub on my-topic:', publishedData);
    }
}
```


### @onPubSubSchedule()

Add the `@onPubSubSchedule()` decorator in a method to be executed according to the interval defined as a parameter in the decorator, following the cron patterns.

The default time zone is **America/Los_Angeles**.
Alternatively, you can enter a different time zone as follows: `@onPubSubSchedule({ interval: '* * * * *', timezone: 'America/Araguaina' })`.

To better understand how to set the time using the cron pattern see an example on the website [https://crontab.guru](https://crontab.guru).

```ts
import { ScheduledEvent } from 'firebase-functions/v2/scheduler';
import { onPubSubSchedule } from 'firebase-triggers';

class TimerCtrl {
    @onPubSubSchedule('0 5 * * *')
    everyDayAtFiveAM(event: ScheduledEvent) {
        console.log('Method executed every day at 5 AM');
    }
}
```


### @onRequest()

Add the `@onRequest()` decorator to a method to be executed whenever an HTTP request is made to the project address in Cloud Functions followed by the class and method name, using camelCase and ignoring the `Ctrl` suffix control class nomenclature.

e.g. Considering the code below, where the class name is `UserCtrl` and the method is named `profile()`, then the external URL for the HTTP request would be `https://us-central1-project-name.cloudfunctions.net/user-profile`.

```ts
import { Response } from 'firebase-functions';
import { onRequest } from 'firebase-triggers';
import { Request } from 'firebase-functions/lib/common/providers/https';

class UserCtrl {

    /*
     * This method will be exported as "user-profile" on Cloud Functions
     * e.g. https://us-central1-project-name.cloudfunctions.net/user-profile
     */
    @onRequest()
    async profile(request: Request, response: Response) {
        const profile = await loadProfile(request.body.id);
        response.json(profile);
    }

    /*
     * This method will be exported as "hello" on Cloud Functions
     * e.g. https://us-central1-project-name.cloudfunctions.net/hello
     */
    @onRequest('hello')
    async sample(request: Request, response: Response) {
        response.send('Hello World!');
    }
}
```

This method also accepts a parameter, which when informed, becomes the name of the function in Cloud Functions and also the URL suffix for the request.

Considering the example above, if the decorator was declared with parameter 'api' (e.g. `@onRequest('api')`), in this case the external URL for the HTTP request would be `https://us-central1-project-name.cloudfunctions.net/api`, ignoring the control class naming rule.


### @GET(), @POST(), @PUT(), @PATCH(), @DELETE()

The decorators `@GET()`, `@POST()`, `@PUT()`, `@PATCH()` and `@DELETE()` work in much the same way as decorator `@onRequest()`, with the difference that each responds to a unique HTTP method.

Below is a REST simulation of user data using the aforementioned decorators.
In this case the external URL for the HTTP request would be `https://us-central1-project-name.cloudfunctions.net/users`, ignoring the control class naming rule.

```ts
import { Request } from 'firebase-functions/lib/common/providers/https';
import { Response } from 'firebase-functions';
import { GET, POST, PUT, PATCH, DELETE } from 'firebase-triggers';

class UserCtrl {

    @GET('users')
    async get(request: Request, response: Response) {
        response.json([]);
    }

    @POST('users')
    async post(request: Request, response: Response) {
        response.status(201).send();
    }

    @PUT('users')
    async put(request: Request, response: Response) {
        response.status(201).send();
    }

    @PATCH('users')
    async patch(request: Request, response: Response) {
        response.status(201).send();
    }

    @DELETE('users')
    async del(request: Request, response: Response) {
        response.status(201).send();
    }
}
```


#### Schema validation

Requests using the `@onRequest()` decorator can be validated through schema files that must be in the `schema` folder with the exact name of the function that will be exported to Cloud Functions.
If the file exists, validation will be performed.

Using the decorators `@GET()`, `@POST()`, `@PUT()`, `@PATCH()` or `@DELETE()`, it is necessary to add a suffix separated by an underscore in the name of the schema file for every need.

__Samples:__

`user-update.json` (Applied when using @onRequest() without specifying the HTTP method)

`user-update_GET.json` (Applied to HTTP GET requests)

`user-update_POST.json` (Applied to HTTP POST requests)

`user-update_PUT.json` (Applied to HTTP PUT requests)

`user-update_PATCH.json` (Applied to HTTP PATCH requests)

`user-update_DELETE.json` (Applied to HTTP DELETE requests)

It is also possible on the client side to view the schema files by adding the suffix `/schema.json` to the URL of the exported method.

You can use the [jsonschema.net](https://jsonschema.net/) to generate your JSON schemas.


### @onCall()

Add the decorator `@onCall()` to a method so you can call it straight from the Firebase SDK.
They call it [Callable methods](https://firebase.google.com/docs/functions/callable-reference).

The method name will be prefixed with the class name, using *camelCase* and ignoring the `Ctrl` suffix of the control class nomenclature.

```ts
import { onCall } from 'firebase-triggers';
import { CallableRequest } from 'firebase-functions/lib/common/providers/https';

class TodoCtrl {
    @onCall()
    add(event: CallableRequest) {
        console.log('Add new todo', event.data);
    }
}
```


### @onStorageArchive(), @onStorageDelete(), @onStorageFinalize(), @onStorageMetadataUpdate()

Add the decorator `onStorageArchive()` to a method to be executed whenever an item is archived on Cloud Storage.

Add the decorator `onStorageDelete()` to a method to be executed whenever an item is removed from Cloud Storage.

Add the decorator `onStorageFinalize()` to a method to be executed whenever an item is finished uploading on Cloud Storage.

Add the decorator `onStorageMetadataUpdate()` to a method to be executed whenever an item metadata is updated on _Cloud Storage_.

If the bucket is empty, the method will be executed for all buckets.
See [Cloud Storage Events](https://firebase.google.com/docs/functions/gcp-storage-events).

```ts
import {onStorageArchive, onStorageDelete, onStorageFinalize, onStorageMetadataUpdate } from 'firebase-triggers';
import { StorageEvent } from 'firebase-functions/v2/storage';

class TodoCtrl {
    @onStorageArchive('bucket-name')
    archive(event: StorageEvent) {
        console.log(`File ${event.data.name} archived`);
    }
    
    @onStorageDelete('bucket-name')
    del(event: StorageEvent) {
        console.log(`File ${event.data.name} deleted`);
    }

    @onStorageFinalize('bucket-name')
    uploaded(event: StorageEvent) {
        console.log(`File ${event.data.name} uploaded`);
    }

    @onStorageMetadataUpdate('bucket-name')
    updateMetadata(event: StorageEvent) {
        console.log(`File ${event.data.name} updated`);
    }
}
```


## Runtime Options

Cloud Functions for Firebase lets you select runtime options such as the Node.js runtime version and per-function timeout, memory allocation, and minimum/maximum function instances.

As a best practice, these options (except for Node.js version) should be set on a configuration object inside the function code. This RuntimeOptions object is the source of truth for your function's runtime options, and will override options set via any other method (such as via the Google Cloud console or gcloud CLI).

To define runtime options in a Cloud Function, you can provide an options object with all options  in the desired decorator with the settings you want to define. See some examples below:

```ts
import 'reflect-metadata';
import { getFirebaseFunctionListToExport, onFirestoreCreate, onRequest } from 'firebase-triggers';

class MyCtrl {
    @onFirestoreCreate({
        document: 'todo/{id}',
        database: 'my-database-name',
        namespace: 'some-namespace',
        retry: false,
        region: 'us-east1',
        omit: false,
        memory: '128MiB',
        timeoutSeconds: 60,
        minInstances: 2,
        maxInstances: 4,
        concurrency: 100,
        cpu: 0.5,
        vpcConnectorEgressSettings: 'ALL_TRAFFIC',
        ingressSettings: 'ALLOW_ALL',
        invoker: 'public',
        labels: { someKey: 'my-label-value'},
        preserveExternalChanges: false,
    })
    docWrite(event) {
        const data = event.data.data();
        console.log(`New task added: ${data.title} at ${data.time}`);
    }

    @onRequest({ path: 'hello-world', region: 'us-east1' })
    httpRequest(request, response) {
        response.send('Hello World!');
    }
}
```