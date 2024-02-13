import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseOptions, FirebaseTriggerType } from '../types';

function getStorageFunction(trigger: FirebaseTriggerType, metadataKey) {
  return (bucketName?: string, options?: FirebaseOptions) => (target: any, key: string) => {
    const firebaseFunction: FirebaseFunction = {
      className: getClassName(target),
      methodName: key,
      method: getClassMethod(target, key),
      trigger,
      key: bucketName,
      options,
    };
    addFirebaseFunction(firebaseFunction);
    Reflect.defineMetadata(metadataKey, { bucketName, options }, target, key);
  };
}

export const onStorageArchive = getStorageFunction(FirebaseTriggerType.STORAGE_ARCHIVE, 'onStorageArchive');

export const onStorageDelete = getStorageFunction(FirebaseTriggerType.STORAGE_DELETE, 'onStorageDelete');

export const onStorageFinalize = getStorageFunction(FirebaseTriggerType.STORAGE_FINALIZE, 'onStorageFinalize');

export const onStorageMetadataUpdate = getStorageFunction(FirebaseTriggerType.STORAGE_METADATA_UPDATE, 'onStorageMetadataUpdate');
