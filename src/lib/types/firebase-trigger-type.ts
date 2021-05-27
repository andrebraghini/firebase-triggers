/**
 * Action to trigger a Cloud Function
 */
export enum FirebaseTriggerType {
  /** Triggered as a callable function */
  CALLABLE = 'CALLABLE',

  /** Triggered when a new user is created on Firebase Authentication */
  USER_CREATE = 'USER_CREATE',

  /** Triggered when a user is removed from Firebase Authentication */
  USER_DELETE = 'USER_DELETE',

  /** Triggered when a document is created on Firestore */
  FIRESTORE_CREATE = 'FIRESTORE_CREATE',

  /** Triggered when a document is updated on Firestore */
  FIRESTORE_UPDATE = 'FIRESTORE_UPDATE',

  /** Triggered when a document is removed from Firestore */
  FIRESTORE_DELETE = 'FIRESTORE_DELETE',

  /** Triggered when a document is created, updated or removed from Firestore */
  FIRESTORE_WRITE = 'FIRESTORE_WRITE',

  /** Triggered when there is a new post on a specific topic on PubSub */
  PUBSUB_PUBLISH = 'PUBSUB_PUBLISH',

  /** Triggered within a defined time range */
  PUBSUB_SCHEDULE = 'PUBSUB_SCHEDULE',

  /** Triggered by HTTP requests */
  HTTP_REQUEST = 'HTTP_REQUEST',

  /** Triggered when a file is archived */
  STORAGE_ARCHIVE = 'STORAGE_ARCHIVE',

  /** Triggered when a file is deleted */
  STORAGE_DELETE = 'STORAGE_DELETE',

  /** Triggered when a file finalize the upload */
  STORAGE_FINALIZE = 'STORAGE_FINALIZE',

  /** Triggered when a file metadata is updated */
  STORAGE_METADATA_UPDATE = 'STORAGE_METADATA_UPDATE',
}
