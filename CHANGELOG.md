# Changelog

## 3.0.0

Major release: Firebase Gen2-only surface, modern tooling, and clearer Auth semantics.

### Breaking changes

- Requires **Node.js >= 20**
- `firebase-functions@^7` and `firebase-admin@^13 || ^14` are now **peerDependencies**
- Removed all `firebase-functions/v1` usage from the library
- `@onFirebaseUserCreate()` is now the **event** trigger (`onUserCreated`). Blocking create moved to `@beforeFirebaseUserCreate()`
- `@onFirebaseUserDelete()` now uses Gen2 `onUserDeleted` with a single event argument (no v1 `(user, context)`)
- Removed shared v1-based `FirebaseOptions` / `RuntimeOptions` typing
- Dual package entrypoints (`lib/cjs` + `lib/esm`)

See **[MIGRATION.md](./MIGRATION.md)** for step-by-step adaptation examples.

### Added

- `@beforeFirebaseUserCreate()`
- Firestore auth-context decorators (`*WithAuthContext`)
- Optional DI: `tsyringe` when registered, otherwise safe `new Class()` fallback
- Native `node:test` suite, ESLint, GitHub Actions on Node 20/22

### Removed

- Jest / TSLint / Travis CI toolchain

### Sample app

Reference sources for updating [firebase-triggers-sample](https://github.com/andrebraghini/firebase-triggers-sample) live in `doc/sample-3.0/` (validated with local pack + `tsc`). Push that update to the sample repository as a follow-up when publishing 3.0.
