import { getClassMethod, getClassName, addFirebaseFunction } from '../internal-methods';
import { FirebaseFunction, FirebaseTriggerType } from '../types';

function getStorageFunction(trigger: FirebaseTriggerType) {
  return (bucketName?: string) => (target: any, key: string) => {
    const firebaseFunction: FirebaseFunction = {
      className: getClassName(target),
      methodName: key,
      method: getClassMethod(target, key),
      trigger,
      key: bucketName
    };
    addFirebaseFunction(firebaseFunction);
  };
}

export const onStorageArchive = getStorageFunction(FirebaseTriggerType.STORAGE_ARCHIVE);

export const onStorageDelete = getStorageFunction(FirebaseTriggerType.STORAGE_DELETE);

export const onStorageFinalize = getStorageFunction(FirebaseTriggerType.STORAGE_FINALIZE);

export const onStorageMetadataUpdate = getStorageFunction(FirebaseTriggerType.STORAGE_METADATA_UPDATE);
