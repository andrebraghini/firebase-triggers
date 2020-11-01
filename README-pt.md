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
[@onFirebaseUserCreate()](#onfirebaseusercreate)
[@onFirebaseUserDelete()](#onfirebaseuserdelete)
[@onFirestoreCreate()](#onfirestorecreate)
[@onFirestoreUpdate()](#onfirestoreupdate)
[@onFirestoreDelete()](#onfirestoredelete)
[@onFirestoreWrite()](#onfirestorewrite)
[@onPubSubPublish()](#onpubsubpublish)
[@onPubSubSchedule()](#onpubsubschedule)
[@onRequest()](#onrequest)

4. [Validação de esquema](#validação-de-esquema)

## Instalação

`npm install --save firebase-triggers`


## Uso

Antes de usar em uma aplicação, deve utilizar o método `getFirebaseFunctionListToExport()` que retorna um objeto com a lista de métodos a serem exportados no arquivo principal da aplicação.
Sugerimos varrer o objeto exportando cada método individualmente com o nome da propriedade como no exemplo abaixo:

```ts
import { getFirebaseFunctionListToExport } from 'firebase-triggers';

const list = getFirebaseFunctionListToExport();
for (const key in list) {
    exports[key] = list[key];
}
```

As _Cloud Functions_ serão exportadas de forma agrupada por classe.
Supondo que temos uma classe `UsuarioCtrl` com os métodos `atualizar` e `listar`, esses métodos serão exportados com os nomes **usuario-atualizar** e **usuario-listar** respectivamente no _Cloud Functions_.


## Decorators

Para definir gatilhos do Firebase Functions nos métodos, basta adicionar o decorator desejado sobre o método em questão e importar o mesmo deste pacote.

Ex: `import { onRequest } from 'firebase-triggers';`

### @onFirebaseUserCreate()

Adicione o decorator `@onFirebaseUserCreate()` sobre um método de uma classe de controle para que este método seja executado sempre que um novo usuário for criado no FirebaseAuth.

### @onFirebaseUserDelete()

Adicione o *decorator* `@onFirebaseUserDelete()` sobre um método de uma classe de controle para que este método seja executado sempre que um usuário for removido do FirebaseAuth.

### @onFirestoreCreate()

Adicione o *decorator* `@onFirestoreCreate('demo_collection/{id}')` sobre um método de uma classe de controle para que este método seja executado sempre que um novo documento for **criado** no banco de dados do Firestore na *collection* definida parâmetro no *decorator*.

### @onFirestoreUpdate()

Adicione o *decorator* `@onFirestoreUpdate('demo_collection/{id}')` sobre um método de uma classe de controle para que este método seja executado sempre que um documento existente for **alterado** no banco de dados do Firestore na *collection* definida parâmetro no *decorator*.

### @onFirestoreDelete()

Adicione o *decorator* `@onFirestoreDelete('demo_collection/{id}')` sobre um método de uma classe de controle para que este método seja executado sempre que um documento for **removido** no banco de dados do Firestore na *collection* definida parâmetro no *decorator*.

### @onFirestoreWrite()

Adicione o *decorator* `onFirestoreWrite('demo_collection/{id}')` sobre um método de uma classe de controle para que este método seja executado sempre que um documento for **criado, alterado ou removido** do banco de dados do Firestore na *collection* definida como parâmetro do *decorator*.

### @onPubSubPublish()

Adicione o *decorator* `@onPubSubPublish('the-topic')` sobre um método de uma classe de controle para que este método seja executado sempre que for feita uma publicação via PubSub no tópico definido como parâmetro no *decorator*.

### @onPubSubSchedule()

Adicione o *decorator* `@onPubSubSchedule('* * * * *')` sobre um método de uma classe de controle para que este método seja executado de forma temporizada de acordo com o intervalo definido no parâmetro no *decorator* seguindo os padrões do cron.

Os horários são baseados no fuso horário **America/Los_Angeles**.
Como alternativa pode informar um fuso horário diferente da seguinte forma: `@onPubSubSchedule({ interval: '* * * * *', timezone: 'America/Araguaina' })`.

Para entender melhor como definir o horário usando o padrão do cron veja um exemplo no site [https://crontab.guru](https://crontab.guru).

### @onRequest()

Adicione o decorator `@onRequest()` sobre um método de uma classe de controle para que este método seja executado sempre que uma requisição HTTP for feita para o endereço do projeto no Cloud Functions seguido do nome de classe e do método, usando *camelCase* ignorando o sufixo `Ctrl` da nomenclatura das classes de controle.

Ex: Levando em consideração o código abaixo, onde o nome da classe é `UserCtrl` e o método é nomeado como `getProfile()`, logo a URL externa para a requisição HTTP seria `https://us-central1-brnet-web-dev.cloudfunctions.net/user-getProfile`.

```ts
class UserCtrl {
    @onRequest()
    static async getProfile(req, res) {
        const profile = await loadProfile(req.body.id);
        res.json(profile);
    }
}
```

Este método também aceita um parâmetro, que quando informado passa a ser o nome da função no _Cloud Functions_ e também o sufixo da URL para requisição.

Levando em consideração o exemplo acima, se o _decorator_ fosse declarado com parâmetro 'api' (ex: `@onRequest('api')`), neste caso a URL externa para a requisição HTTP seria `https://us-central1-brnet-web-dev.cloudfunctions.net/api`, ignorando a regra de nomenclatura das classes de controle.

#### Validação de esquema

As requisições que usam o _decorator_ `@onRequest()` podem ser validadas através de arquivos de schema que devem estar na pasta `schema` de cada aplicação com o nome exato da função que será exportada para o _Cloud Functions_.
Se o arquivo existir a validação será feita.

Também é possível no lado do cliente visualizar os arquivos de schema adicionando o sufixo `/schema.json` na URL do método exportado.
