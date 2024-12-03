import { StorageOptions } from 'firebase-functions/v2/storage';
import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseTriggerType } from '../types';

function getStorageFunction(trigger: FirebaseTriggerType, metadataKey) {
  return (bucket: string | StorageOptions) => (target: any, key: string) => {
    const options = typeof bucket === 'string' ? { bucket } : bucket; 
    const firebaseFunction: FirebaseFunction = {
      className: getClassName(target),
      methodName: key,
      method: getClassMethod(target, key),
      trigger,
      key: options.bucket,
      options,
    };
    addFirebaseFunction(firebaseFunction);
    Reflect.defineMetadata(metadataKey, options, target, key);
  };
}

/**
 * @example
 * import { onStorageArchive } from 'firebase-triggers';
 * import { StorageEvent } from 'firebase-functions/v2/storage';
 * 
 * class TodoCtrl {
 *     \@onStorageArchive('bucket-name')
 *     archive(event: StorageEvent) {
 *         console.log(`File ${event.data.name} archived`);
 *     }
 * }
 */
export const onStorageArchive = getStorageFunction(FirebaseTriggerType.STORAGE_ARCHIVE, 'onStorageArchive');

/**
 * @example
 * import { onStorageDelete } from 'firebase-triggers';
 * import { StorageEvent } from 'firebase-functions/v2/storage';
 * 
 * class TodoCtrl {
 *     \@onStorageDelete('bucket-name')
 *     del(event: StorageEvent) {
 *         console.log(`File ${event.data.name} deleted`);
 *     }
 * }
 */
export const onStorageDelete = getStorageFunction(FirebaseTriggerType.STORAGE_DELETE, 'onStorageDelete');

/**
 * @example
 * import { onStorageFinalize } from 'firebase-triggers';
 * import { StorageEvent } from 'firebase-functions/v2/storage';
 * 
 * class TodoCtrl {
 *     \@onStorageFinalize('bucket-name')
 *     uploaded(event: StorageEvent) {
 *         console.log(`File ${event.data.name} uploaded`);
 *     }
 * }
 */
export const onStorageFinalize = getStorageFunction(FirebaseTriggerType.STORAGE_FINALIZE, 'onStorageFinalize');

/**
 * @example
 * import { onStorageMetadataUpdate } from 'firebase-triggers';
 * import { StorageEvent } from 'firebase-functions/v2/storage';
 * 
 * class TodoCtrl {
 *     \@onStorageMetadataUpdate('bucket-name')
 *     updateMetadata(event: StorageEvent) {
 *         console.log(`File ${event.data.name} updated`);
 *     }
 * }
 */
export const onStorageMetadataUpdate = getStorageFunction(FirebaseTriggerType.STORAGE_METADATA_UPDATE, 'onStorageMetadataUpdate');
