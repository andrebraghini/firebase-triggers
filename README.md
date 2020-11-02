<p align="center">
  <img src="./doc/firebase-triggers.png" alt="Firebase Triggers" width="500"/>
</p>

<p align="center">	
  <a href="https://www.linkedin.com/in/andrebraghinis/">
    <img alt="André Braghini" src="https://img.shields.io/badge/-AndreBraghiniS-FFCA28?style=flat&logo=Linkedin&logoColor=white" />
  </a>
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/andrebraghini/firebase-triggers?color=FFCA28">
  <a href="https://github.com/andrebraghini/firebase-triggers/commits/main">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/andrebraghini/firebase-triggers?color=FFCA28">
  </a>
  <img alt="npm version" src="https://img.shields.io/npm/v/firebase-triggers?color=FFCA28">
  <a href="https://github.com/andrebraghini/firebase-triggers/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-FFCA28">
  </a>

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


## Installation

`npm install --save firebase-triggers`


## Usage

Before deploying to Firebase Functions you need to export the methods at the entry point of your application.

The `getFirebaseFunctionListToExport()` method returns an object with the list of methods found in the application.

Iterate the object by exporting each method individually with the property name as in the example below:

```ts
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
import { getFirebaseFunctionListToExport } from 'firebase-triggers';
import { onFirestoreCreate, onRequest } from './decorators';

class MyCtrl {
  @onFirestoreCreate('todo/{id}')
  docWrite(snapshot, context) {
    const data = snapshot.data();
    console.log(`New task added: ${data.title} at ${data.time}`);
  }

  @onRequest('hello-world')
  httpRequest(request, response) {
    response.send('Hello World!');
  }
}

// Obtain the "Cloud Functions" found in the code and export each one
const list = getFirebaseFunctionListToExport();
for (const key in list) {
  exports[key] = list[key];
}
```


### Complete example

```ts
import { getFirebaseFunctionListToExport } from 'firebase-triggers';
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
} from './decorators';

class MyCtrl {
  @onFirebaseUserCreate()
  userCreate(user, context) {
    console.log(`${user.displayName} joined us`);
  }

  @onFirebaseUserDelete()
  userDelete(user, context) {
    console.log(`${user.displayName} left us`);
  }

  @onFirestoreCreate('todo/{id}')
  docCreate(snapshot, context) {
    // Get an object representing the document. e.g. { title: 'Wash the dishes', time: '12:00' }
    const newValue = snapshot.data();
    // access a particular field as you would any JS property
    const title = newValue.title;
    const time = newValue.time;

    console.log(`New task added: ${title} at ${time}`);
  }

  @onFirestoreUpdate('todo/{id}')
  docUpdate(change, context) {
    // Get an object representing the document. e.g. { title: 'Wash the dishes', time: '12:00' }
    const newValue = change.after.data();
    // ...or the previous value before this update
    const previousValue = change.before.data();
    // access a particular field as you would any JS property
    const newTitle = newValue.title;
    const oldTitle = previousValue.title;

    console.log(`Changed the title from "${oldTitle}" to "${newTitle}"`);
  }

  @onFirestoreDelete('todo/{id}')
  docDelete(snapshot, context) {
    // Get an object representing the document. e.g. { title: 'Wash the dishes', time: '12:00' }
    const oldValue = snapshot.data();
    // access a particular field as you would any JS property
    const title = oldValue.title;

    console.log(`Task "${title}" removed`);
  }

  @onFirestoreWrite('todo/{id}')
  docWrite(snapshot, context) {
    // Get an object with the current document value. If the document does not exist, it has been deleted.
    const newDocument = change.after.exists ? change.after.data() : null;
    // Get an object with the previous document value (for update or delete)
    const oldDocument = change.before.exists ? change.before.data() : null;

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

  @onPubSubPublish('my-topic')
  pubsubSubscribe(message, context) {
    const publishedData = message.json;
    console.log('Data published via PubSub on my-topic:', publishedData);
  }

  @onPubSubSchedule('0 5 * * *')
  everyDayAtFiveAM(context) {
    console.log('Method executed every day at 5 AM');
  }

  @onRequest('myCustomPath')
  httpRequest(request, response) {
    const requestBody = request.body;
    console.log({ requestBody });

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

### @onFirebaseUserDelete()

Add the `@onFirebaseUserDelete()` decorator to a method to be executed whenever a user is removed from Firebase Authentication.

### @onFirestoreCreate()

Add the `@onFirestoreCreate()` decorator to a method to be executed whenever a new document is **created** in Firestore, in the collection defined as a decorator parameter.

### @onFirestoreUpdate()

Add the `@onFirestoreUpdate()` decorator to a method to be executed whenever an existing document is **changed** in Firestore, in the collection defined as a decorator parameter.

### @onFirestoreDelete()

Add the `@onFirestoreDelete()` decorator to a method to be executed whenever a document is **removed** from the Firestore, in the collection defined as a decorator parameter.

### @onFirestoreWrite()

Add the `onFirestoreWrite()`decorator to a method to be executed whenever a document is **created, changed or removed** from the Firestore, in the collection defined as a decorator parameter.

### @onPubSubPublish()

Add the `@onPubSubPublish()` decorator to a method to be executed whenever a publication is made via PubSub, on the topic defined as a parameter in the decorator.

### @onPubSubSchedule()

Add the `@onPubSubSchedule()` decorator in a method to be executed according to the interval defined as a parameter in the decorator, following the cron patterns.

The default time zone is **America/Los_Angeles**.
Alternatively, you can enter a different time zone as follows: `@onPubSubSchedule({ interval: '* * * * *', timezone: 'America/Araguaina' })`.

To better understand how to set the time using the cron pattern see an example on the website [https://crontab.guru](https://crontab.guru).

### @onRequest()

Add the `@onRequest()` decorator to a method to be executed whenever an HTTP request is made to the project address in Cloud Functions followed by the class and method name, using camelCase and ignoring the `Ctrl` suffix control class nomenclature.

e.g. Considering the code below, where the class name is `UserCtrl` and the method is named `getProfile()`, then the external URL for the HTTP request would be `https://us-central1-brnet-web-dev.cloudfunctions.net/user-getProfile`.

```ts
class UserCtrl {
  @onRequest()
  static async getProfile(req, res) {
    const profile = await loadProfile(req.body.id);
    res.json(profile);
  }
}
```

This method also accepts a parameter, which when informed, becomes the name of the function in Cloud Functions and also the URL suffix for the request.

Considering the example above, if the decorator was declared with parameter 'api' (e.g. `@onRequest('api')`), in this case the external URL for the HTTP request would be `https://us-central1-brnet-web-dev.cloudfunctions.net/api`, ignoring the control class naming rule.

#### Schema validation

Requests using the `@onRequest()` decorator can be validated through schema files that must be in the `schema` folder with the exact name of the function that will be exported to Cloud Functions.
If the file exists, validation will be performed.

It is also possible on the client side to view the schema files by adding the suffix `/schema.json` to the URL of the exported method.
