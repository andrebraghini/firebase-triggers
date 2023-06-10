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
    Uma biblioteca TypeScript que provê decorators para vincular métodos de classes a gatilhos do Firebase Authentication, Firestore e PubSub.
  </i>
</p>

<p align="center">
  <a href="README.md">Inglês</a>
  ·
  <a href="README-pt.md">Português</a>
</p>


## Conteúdo

1. [Instalação](#instalação)

2. [Uso](#uso)

3. [Decorators](#decorators)

4. [Validação de esquema](#validação-de-esquema)

5. [Projeto de exemplo](https://github.com/andrebraghini/firebase-triggers-sample)


## Instalação

`npm install --save firebase-triggers`


## Uso

Antes de fazer o _deploy_ para o _Firebase Functions_ você precisa exportar os métodos no ponto de entrada da sua aplicação.

O método `getFirebaseFunctionListToExport()` retorna um objeto com a lista de métodos encontrados na aplicação.

Itere o objeto exportando cada método individualmente com o nome da propriedade como no exemplo abaixo:

```ts
import 'reflect-metadata';
import { getFirebaseFunctionListToExport } from 'firebase-triggers';

// Obtém as "Cloud Functions" encontradas no código de exporta cada uma
const list = getFirebaseFunctionListToExport();
for (const key in list) {
  exports[key] = list[key];
}
```

As _Cloud Functions_ serão exportadas de forma agrupada por classe.
Supondo que você tenha uma classe `UserCtrl` com os métodos `update()` e `list()`, esses métodos serão exportados com os nomes **user-update** e **user-list** respectivamente no _Cloud Functions_.


### Exemplo simples

```ts
import 'reflect-metadata';
import { getFirebaseFunctionListToExport, onFirestoreCreate, onRequest } from 'firebase-triggers';

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

// Obtém as "Cloud Functions" encontradas no código de exporta cada uma
const list = getFirebaseFunctionListToExport();
for (const key in list) {
    exports[key] = list[key];
}
```


## Decorators

Para definir gatilhos do _Firebase Functions_, basta adicionar o _decorator_ desejado sobre o método, não esquecendo-se de importar o _decorator_:

Ex: `import { onRequest } from 'firebase-triggers';`


### @onFirebaseUserCreate()

Adicione o *decorator* `@onFirebaseUserCreate()` em um método para ser executado sempre que um novo usuário for criado no *Firebase Authentication*.

```ts
import { onFirebaseUserCreate } from 'firebase-triggers';
import { UserRecord } from 'firebase-functions/v2/auth';
import { EventContext } from 'firebase-functions';

class UserCtrl {
    @onFirebaseUserCreate()
    onCreate(user: UserRecord, context: EventContext) {
        console.log(`${user.displayName} joined us`);
    }
}
```


### @onFirebaseUserDelete()

Adicione o *decorator* `@onFirebaseUserDelete()` em um método para ser executado sempre que um usuário for removido do *Firebase Authentication*.

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

Adicione o *decorator* `@onFirestoreCreate()` em um método para ser executado sempre que um novo documento for **criado** no Firestore, na *collection* definida parâmetro do *decorator*.

```ts
import { onFirestoreCreate } from 'firebase-triggers';
import { QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';
import { EventContext } from 'firebase-functions';

class TodoCtrl {
    @onFirestoreCreate('todo/{id}')
    onCreate(snapshot: QueryDocumentSnapshot, context: EventContext) {
        // Pega um objeto representando o documento. ex: { title: 'Lavar a louça', time: '12:00' }
        const newValue = snapshot.data();
        // acessar um determinado campo como faria com qualquer propriedade JS
        const title = newValue.title;
        const time = newValue.time;

        console.log(`New task added: ${title} at ${time}`);
    }
}
```


### @onFirestoreUpdate()

Adicione o *decorator* `@onFirestoreUpdate()` em um método para ser executado sempre que um documento existente for **alterado** no Firestore, na *collection* definida parâmetro no *decorator*.

```ts
import { onFirestoreUpdate } from 'firebase-triggers';
import { QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';
import { Change, EventContext } from 'firebase-functions';

class TodoCtrl {
    @onFirestoreUpdate('todo/{id}')
    onUpdate(change: Change<QueryDocumentSnapshot>, context: EventContext) {
        // Pega um objeto representando o documento. ex: { title: 'Lavar a louça', time: '12:00' }
        const newValue = change.after.data();
        // ...ou valor anterior a esta atualização(update)
        const previousValue = change.before.data();
        // acessar um determinado campo como faria com qualquer propriedade JS
        const newTitle = newValue.title;
        const oldTitle = previousValue.title;

        console.log(`Changed the title from "${oldTitle}" to "${newTitle}"`);
    }
}
```


### @onFirestoreDelete()

Adicione o *decorator* `@onFirestoreDelete()` em um método para ser executado sempre que um documento for **removido** do Firestore, na *collection* definida parâmetro no *decorator*.

```ts
import { onFirestoreDelete } from 'firebase-triggers';
import { QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';
import { EventContext } from 'firebase-functions';

class TodoCtrl {
    @onFirestoreDelete('todo/{id}')
    onDelete(snapshot: QueryDocumentSnapshot, context: EventContext) {
        // Pega um objeto representando o documento. ex: { title: 'Lavar a louça', time: '12:00' }
        const oldValue = snapshot.data();
        // acessar um determinado campo como faria com qualquer propriedade JS
        const title = oldValue.title;

        console.log(`Task "${title}" removed`);
    }
}
```


### @onFirestoreWrite()

Adicione o *decorator* `onFirestoreWrite()` em um método para ser executado sempre que um documento for **criado, alterado ou removido** do Firestore, na *collection* definida como parâmetro do *decorator*.

```ts
import { onFirestoreWrite } from 'firebase-triggers';
import { QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';
import { Change, EventContext } from 'firebase-functions';

class TodoCtrl {
    @onFirestoreWrite('todo/{id}')
    onWrite(change: Change<QueryDocumentSnapshot>, context: EventContext) {
        // Pega um objeto com o valor do documento atual. Se o documento não existir, ele foi removido.
        const newDocument = change.after.exists ? change.after.data() : null;
        // Pega um objeto com o valor do documento anterior (para uma atualização ou remoção (update ou delete)
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
}
```


### @onPubSubPublish()

Adicione o *decorator* `@onPubSubPublish()` em um método para ser executado sempre que for feita uma publicação via PubSub no tópico definido como parâmetro no *decorator*.

```ts
import { onPubSubPublish } from 'firebase-triggers';
import { Message } from 'firebase-functions/v2/pubsub';
import { EventContext } from 'firebase-functions';

class SampleCtrl {
    @onPubSubPublish('my-topic')
    doSomething(message: Message<any>, context: EventContext) {
        const publishedData = message.json;
        console.log('Data published via PubSub on my-topic:', publishedData);
    }
}
```


### @onPubSubSchedule()

Adicione o *decorator* `@onPubSubSchedule()` em um método para ser executado de forma temporizada de acordo com o intervalo definido no parâmetro no *decorator* seguindo os padrões do cron.

O fuso horário padrão é **America/Los_Angeles**.
Como alternativa pode informar um fuso horário diferente da seguinte forma: `@onPubSubSchedule({ interval: '* * * * *', timezone: 'America/Araguaina' })`.

Para entender melhor como definir o horário usando o padrão do cron veja um exemplo no site [https://crontab.guru](https://crontab.guru).

```ts
import { onPubSubSchedule } from 'firebase-triggers';
import { EventContext } from 'firebase-functions';

class TimerCtrl {
    @onPubSubSchedule('0 5 * * *')
    everyDayAtFiveAM(context: EventContext) {
        console.log('Method executed every day at 5 AM');
    }
}
```


### @onRequest()

Adicione o decorator `@onRequest()` em um método para ser executado sempre que uma requisição HTTP for feita para o endereço do projeto no Cloud Functions seguido do nome de classe e do método, usando *camelCase* e ignorando o sufixo `Ctrl` da nomenclatura das classes de controle.

Ex: Considerando o código abaixo, onde o nome da classe é `UserCtrl` e o método é nomeado como `profile()`, logo a URL externa para a requisição HTTP seria `https://us-central1-project-name.cloudfunctions.net/user-profile`.

```ts
import { onRequest } from 'firebase-triggers';
import { Request, Response } from 'firebase-functions';

class UserCtrl {

    /*
     * Este método será exportado como "user-profile" no Cloud Functions
     * ex: https://us-central1-project-name.cloudfunctions.net/user-profile
     */
    @onRequest()
    async profile(request: Request, response: Response) {
        const profile = await loadProfile(request.body.id);
        response.json(profile);
    }

    /*
     * Este método será exportado como "hello" no Cloud Functions
     * ex: https://us-central1-project-name.cloudfunctions.net/hello
     */
    @onRequest('hello')
    async sample(request: Request, response: Response) {
        response.send('Hello World!');
    }
}
```

ste método também aceita um parâmetro, que quando informado, passa a ser o nome da função no _Cloud Functions_ e também o sufixo da URL para requisição.

Considerando o exemplo acima, se o _decorator_ fosse declarado com parâmetro 'api' (ex: `@onRequest('api')`), neste caso a URL externa para a requisição HTTP seria `https://us-central1-project-name.cloudfunctions.net/api`, ignorando a regra de nomenclatura das classes de controle.


### @GET(), @POST(), @PUT(), @PATCH(), @DELETE()

Os _decorators_ `@GET()`, `@POST()`, `@PUT()`, `@PATCH()` e `@DELETE()` funcionam praticamente da mesma forma que o _decorator_ `@onRequest()`, com a diferença que cada um responde a um método HTTP exclusivo.

Segue abaixo uma simulação de REST de dados de usuário usando os _decorators_ citados.
Neste caso a URL externa para a requisição HTTP seria `https://us-central1-project-name.cloudfunctions.net/users`, ignorando a regra de nomenclatura das classes de controle.

```ts
import { GET, POST, PUT, PATCH, DELETE } from 'firebase-triggers';
import { Request, Response } from 'firebase-functions';

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


#### Validação de esquema

As requisições que usam o _decorator_ `@onRequest()` podem ser validadas através de arquivos de schema que devem estar na pasta `schema` com o nome exato da função que será exportada para o _Cloud Functions_.
Se o arquivo existir a validação será feita.

Usando os decorators `@GET()`, `@POST()`, `@PUT()`, `@PATCH()` ou `@DELETE()`, é necessário acrescentar um sufixo separado por um _underline_ no nome do arquivo de schema para cada necessidade.

__Exemplos:__

`user-update.json` (Aplicado no uso do @onRequest() sem especificar o método HTTP)

`user-update_GET.json` (Aplicado em requisições HTTP do tipo GET)

`user-update_POST.json` (Aplicado em requisições HTTP do tipo POST)

`user-update_PUT.json` (Aplicado em requisições HTTP do tipo PUT)

`user-update_PATCH.json` (Aplicado em requisições HTTP do tipo PATCH)

`user-update_DELETE.json` (Aplicado em requisições HTTP do tipo DELETE)

Também é possível no lado do cliente visualizar os arquivos de schema adicionando o sufixo `/schema.json` na URL do método exportado.

Você pode usar o site [jsonschema.net](https://jsonschema.net/) para gerar seus próprios schemas JSON.


### @onCall()

Adicione o _decorator_ `@onCall()` em um método para que seja possível chamá-lo direto do Firebase SDK.
Chamam isso de [Callable methods](https://firebase.google.com/docs/functions/callable-reference).

O nome do método receberá o prefixo do nome da classe, usando *camelCase* e ignorando o sufixo `Ctrl` da nomenclatura das classes de controle.

```ts
import 'reflect-metadata';
import { EventContext } from 'firebase-functions';

class TodoCtrl {
    @onCall()
    add(data, context: EventContext) {
        console.log('Add new todo', data);
    }
}
```


### @onStorageArchive(), @onStorageDelete(), @onStorageFinalize(), @onStorageMetadataUpdate()

Adicione o _decorator_ `onStorageArchive()` em um método para que seja executado sempre que um item for arquivado no _Cloud Storage_.

Adicione o _decorator_ `onStorageDelete()` em um método para que seja executado sempre que um item for removido do _Cloud Storage_.

Adicione o _decorator_ `onStorageFinalize()` em um método para que seja executado sempre que o upload de um item for concluído no _Cloud Storage_.

Adicione o _decorator_ `onStorageMetadataUpdate()` em um método para que seja executado sempre que os metadados de um item forem atualizados no _Cloud Storage_.

Caso o _bucket_ não seja informado, o método será executado para todos os _buckets_.
Veja [Cloud Storage Events](https://firebase.google.com/docs/functions/gcp-storage-events).

```ts
import 'reflect-metadata';
import { EventContext } from 'firebase-functions';
import { ObjectMetadata } from 'firebase-functions/v1/storage';

class TodoCtrl {
    @onStorageArchive('bucketName')
    archive(object: ObjectMetadata, context: EventContext) {
        console.log(`File ${object.name} archived`);
    }
    
    @onStorageDelete('bucketName')
    del(object: ObjectMetadata, context: EventContext) {
        console.log(`File ${object.name} deleted`);
    }

    @onStorageFinalize('bucketName')
    uploaded(object: ObjectMetadata, context: EventContext) {
        console.log(`File ${object.name} uploaded`);
    }

    @onStorageMetadataUpdate('bucketName')
    updateMetadata(object: ObjectMetadata, context: EventContext) {
        console.log(`File ${object.name} updated`);
    }
}
```


## Opções de tempo de execução

O Cloud Functions para Firebase permite selecionar opções de tempo de execução, como a versão do tempo de execução do Node.js e o tempo limite por função, alocação de memória e instâncias de função mínima/máxima.

Como prática recomendada, essas opções (exceto para a versão Node.js) devem ser definidas em um objeto de configuração dentro do código da função. Este objeto RuntimeOptions é a fonte da verdade para as opções de tempo de execução da sua função e substituirá as opções definidas por meio de qualquer outro método (como por meio do console do Google Cloud ou gcloud CLI).

Para definir configurações de tempo de execução em uma Cloud Function você pode informar opcionalmente um parâmetro adicional no decorator desejado com as configurações que quer definir, incluindo a regiões de implantação da função. Veja alguns exemplos abaixo:

```ts
import 'reflect-metadata';
import { getFirebaseFunctionListToExport, onFirestoreCreate, onRequest } from 'firebase-triggers';

class MyCtrl {
    @onFirestoreCreate('todo/{id}', {
        memory: '128MB',
        timeoutSeconds: 60,
        minInstances: 2,
        maxInstances: 4,
        vpcConnectorEgressSettings: 'ALL_TRAFFIC',
        ingressSettings: 'ALLOW_ALL',
        invoker: 'public',
        region: 'us-east1'
    })
    docWrite(snapshot, context) {
        const data = snapshot.data();
        console.log(`New task added: ${data.title} at ${data.time}`);
    }

    @onRequest('hello-world', { region: ['us-east1', 'us-east2'] })
    httpRequest(request, response) {
        response.send('Hello World!');
    }
}
```
