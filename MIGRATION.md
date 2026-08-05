# Migration guide: 2.x → 3.0

This guide lists **breaking changes** in `firebase-triggers@3` and the adaptations consumers need to apply.

## Requirements

| | 2.x | 3.0 |
|---|-----|-----|
| Node.js | older LTS lines | **`>=20`** |
| `firebase-functions` | bundled dependency (^6) | **peer** `^7` |
| `firebase-admin` | bundled dependency (^13) | **peer** `^13 \|\| ^14` |
| Firebase Functions API | Gen2 + leftover v1 | **Gen2 only** |

### Install

```bash
npm install firebase-triggers@3 firebase-functions@^7 firebase-admin@^14
```

Ensure your Cloud Functions runtime is Node 20 or 22.

## Breaking changes

### 1. Peer dependencies

`firebase-functions` and `firebase-admin` are no longer installed transitively by this library. You must declare them in your app.

### 2. Auth create: blocking vs event

In 2.x, `@onFirebaseUserCreate()` mapped to **`beforeUserCreated`** (blocking), despite the `on*` name.

In 3.0:

| Decorator | Firebase API | When it runs |
|-----------|--------------|--------------|
| `@beforeFirebaseUserCreate()` | `beforeUserCreated` | Before user creation (blocking) |
| `@onFirebaseUserCreate()` | `onUserCreated` | After user creation (event; upstream may be beta) |

**If you used `@onFirebaseUserCreate` for blocking behavior, rename it:**

```ts
// 2.x
@onFirebaseUserCreate()
onCreate(event: AuthBlockingEvent) { /* ... */ }

// 3.0 (same blocking behavior)
@beforeFirebaseUserCreate()
onCreate(event: AuthBlockingEvent) { /* ... */ }
```

Use `@onFirebaseUserCreate()` only when you want the **event** trigger after creation.

### 3. Auth delete: Gen2 event signature

In 2.x, `@onFirebaseUserDelete()` used the v1 API `(user, context)`.

In 3.0 it uses Gen2 `onUserDeleted` with a **single event** argument:

```ts
// 2.x
@onFirebaseUserDelete()
onDelete(user: UserRecord, context: EventContext) {
  console.log(user.displayName);
}

// 3.0
@onFirebaseUserDelete()
onDelete(event: unknown) {
  // event payload follows firebase-functions Gen2 Auth event shape
  console.log(event);
}
```

There is **no** `@beforeFirebaseUserDelete` in 3.0: `firebase-functions@7` does not expose a Gen2 `beforeUserDeleted` API.

### 4. No `firebase-functions/v1`

The library no longer imports or builds triggers via v1 (`runWith`, `auth.user().onDelete`, v1 `Request`/`Response` types).

Update your own imports accordingly:

```ts
// Prefer Gen2 HTTPS types
import { Request } from 'firebase-functions/v2/https';
import { Response } from 'express';
```

### 5. Options typing

The shared v1-based `FirebaseOptions` / `RuntimeOptions` type was removed. Each decorator accepts its Gen2 options type (`HttpsOptions`, `DocumentOptions`, `BlockingOptions`, `AuthEventOptions`, etc.).

Memory values use Gen2 units (e.g. `'256MiB'`, not `'256MB'`).

### 6. Package entrypoints

Published layout is dual package:

- CJS: `require('firebase-triggers')`
- ESM: `import ... from 'firebase-triggers'`

`main` / `module` / `exports` point at `lib/cjs` and `lib/esm`.

### 7. Optional DI (`tsyringe`)

`tsyringe` is still supported. If the class is **not** registered in the container, the library falls back to a managed `new Class()` instance instead of failing.

## New capabilities in 3.0

- `@beforeFirebaseUserCreate()`
- Firestore auth-context decorators:
  - `@onFirestoreCreateWithAuthContext`
  - `@onFirestoreUpdateWithAuthContext`
  - `@onFirestoreDeleteWithAuthContext`
  - `@onFirestoreWriteWithAuthContext`

## Checklist

- [ ] Node.js >= 20
- [ ] Install peer deps (`firebase-functions@^7`, `firebase-admin@^13||^14`)
- [ ] Rename former blocking create handlers to `@beforeFirebaseUserCreate`
- [ ] Update `@onFirebaseUserDelete` handlers to a single event argument
- [ ] Replace v1 type imports (`Request`/`Response`/`EventContext` for Auth delete)
- [ ] Re-test deploy with the Firebase emulator
