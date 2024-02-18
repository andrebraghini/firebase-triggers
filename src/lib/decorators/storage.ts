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

export const onStorageArchive = getStorageFunction(FirebaseTriggerType.STORAGE_ARCHIVE, 'onStorageArchive');

export const onStorageDelete = getStorageFunction(FirebaseTriggerType.STORAGE_DELETE, 'onStorageDelete');

export const onStorageFinalize = getStorageFunction(FirebaseTriggerType.STORAGE_FINALIZE, 'onStorageFinalize');

export const onStorageMetadataUpdate = getStorageFunction(FirebaseTriggerType.STORAGE_METADATA_UPDATE, 'onStorageMetadataUpdate');
