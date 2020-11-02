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


### Exemplo completo

```ts
import 'reflect-metadata';
import {
  getFirebaseFunctionListToExport,
  onFirebaseUserCreate,
  onFirebaseUserDelete,
  onFirestoreCreate,
  onFirestoreUpdate,
  onFirestoreDelete,
  onFirestoreWrite,
  onPubSubPublish,
  onRequest,
  onPubSubSchedule,
} from 'firebase-triggers';

class MyCtrl {
  @onFirebaseUserCreate()
  userCreate(user, context) {
    console.log(`${user.displayName} se juntou a nós`);
  }

  @onFirebaseUserDelete()
  userDelete(user, context) {
    console.log(`${user.displayName} nos deixou`);
  }

  @onFirestoreCreate('todo/{id}')
  docCreate(snapshot, context) {
    // Pega um objeto representando o documento. ex: { title: 'Lavar a louça', time: '12:00' }
    const newValue = snapshot.data();
    // acessar um determinado campo como faria com qualquer propriedade JS
    const title = newValue.title;
    const time = newValue.time;

    console.log(`Nova tarefa adicionada: ${title} às ${time}`);
  }

  @onFirestoreUpdate('todo/{id}')
  docUpdate(change, context) {
    // Pega um objeto representando o documento. ex: { title: 'Lavar a louça', time: '12:00' }
    const newValue = change.after.data();
    // ...ou valor anterior a esta atualização(update)
    const previousValue = change.before.data();
    // acessar um determinado campo como faria com qualquer propriedade JS
    const newTitle = newValue.title;
    const oldTitle = previousValue.title;

    console.log(`Alterado título de "${oldTitle}" para "${newTitle}"`);
  }

  @onFirestoreDelete('todo/{id}')
  docDelete(snapshot, context) {
    // Pega um objeto representando o documento. ex: { title: 'Lavar a louça', time: '12:00' }
    const oldValue = snapshot.data();
    // acessar um determinado campo como faria com qualquer propriedade JS
    const title = oldValue.title;

    console.log(`Tarefa "${title}" removida`);
  }

  @onFirestoreWrite('todo/{id}')
  docWrite(snapshot, context) {
    // Pega um objeto com o valor do documento atual. Se o documento não existir, ele foi removido.
    const newDocument = change.after.exists ? change.after.data() : null;
    // Pega um objeto com o valor do documento anterior (para uma atualização ou remoção (update ou delete)
    const oldDocument = change.before.exists ? change.before.data() : null;

    if (!newDocument) {
      const title = oldDocument.title;
      console.log(`Tarefa "${title}" removida`);
      return;
    }

    if (!oldDocument) {
      const title = newDocument.title;
      const time = newDocument.time;
      console.log(`Nova tarefa adicionada: ${title} às ${time}`);
      return;
    }

    const newTitle = newDocument.title;
    const oldTitle = oldDocument.title;

    console.log(`Título alterado de "${oldTitle}" para "${newTitle}"`);
  }

  @onPubSubPublish('meu-topico')
  pubsubSubscribe(message, context) {
    const publishedData = message.json;
    console.log('Dados publicados via PubSub em meu-topico:', publishedData);
  }

  @onPubSubSchedule('0 5 * * *')
  everyDayAtFiveAM(context) {
    console.log('Método executado todos os dias às 5 horas da manhã');
  }

  @onRequest('myCaminhoPersonalizado')
  httpRequest(request, response) {
    const requestBody = request.body;
    console.log({ requestBody });

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

### @onFirebaseUserDelete()

Adicione o *decorator* `@onFirebaseUserDelete()` em um método para ser executado sempre que um usuário for removido do *Firebase Authentication*.

### @onFirestoreCreate()

Adicione o *decorator* `@onFirestoreCreate()` em um método para ser executado sempre que um novo documento for **criado** no Firestore, na *collection* definida parâmetro do *decorator*.

### @onFirestoreUpdate()

Adicione o *decorator* `@onFirestoreUpdate()` em um método para ser executado sempre que um documento existente for **alterado** no Firestore, na *collection* definida parâmetro no *decorator*.

### @onFirestoreDelete()

Adicione o *decorator* `@onFirestoreDelete()` em um método para ser executado sempre que um documento for **removido** do Firestore, na *collection* definida parâmetro no *decorator*.

### @onFirestoreWrite()

Adicione o *decorator* `onFirestoreWrite()` em um método para ser executado sempre que um documento for **criado, alterado ou removido** do Firestore, na *collection* definida como parâmetro do *decorator*.

### @onPubSubPublish()

Adicione o *decorator* `@onPubSubPublish()` em um método para ser executado sempre que for feita uma publicação via PubSub no tópico definido como parâmetro no *decorator*.

### @onPubSubSchedule()

Adicione o *decorator* `@onPubSubSchedule()` em um método para ser executado de forma temporizada de acordo com o intervalo definido no parâmetro no *decorator* seguindo os padrões do cron.

O fuso horário padrão é **America/Los_Angeles**.
Como alternativa pode informar um fuso horário diferente da seguinte forma: `@onPubSubSchedule({ interval: '* * * * *', timezone: 'America/Araguaina' })`.

Para entender melhor como definir o horário usando o padrão do cron veja um exemplo no site [https://crontab.guru](https://crontab.guru).

### @onRequest()

Adicione o decorator `@onRequest()` em um método para ser executado sempre que uma requisição HTTP for feita para o endereço do projeto no Cloud Functions seguido do nome de classe e do método, usando *camelCase* e ignorando o sufixo `Ctrl` da nomenclatura das classes de controle.

Ex: Considerando o código abaixo, onde o nome da classe é `UserCtrl` e o método é nomeado como `getProfile()`, logo a URL externa para a requisição HTTP seria `https://us-central1-project-name.cloudfunctions.net/user-getProfile`.

```ts
class UserCtrl {
  @onRequest()
  static async getProfile(req, res) {
    const profile = await loadProfile(req.body.id);
    res.json(profile);
  }
}
```

Este método também aceita um parâmetro, que quando informado, passa a ser o nome da função no _Cloud Functions_ e também o sufixo da URL para requisição.

Considerando o exemplo acima, se o _decorator_ fosse declarado com parâmetro 'api' (ex: `@onRequest('api')`), neste caso a URL externa para a requisição HTTP seria `https://us-central1-project-name.cloudfunctions.net/api`, ignorando a regra de nomenclatura das classes de controle.

#### Validação de esquema

As requisições que usam o _decorator_ `@onRequest()` podem ser validadas através de arquivos de schema que devem estar na pasta `schema` com o nome exato da função que será exportada para o _Cloud Functions_.
Se o arquivo existir a validação será feita.

Também é possível no lado do cliente visualizar os arquivos de schema adicionando o sufixo `/schema.json` na URL do método exportado.
