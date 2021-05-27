import 'reflect-metadata';
import { onStorageArchive, onStorageDelete, onStorageFinalize, onStorageMetadataUpdate } from './storage';
import { FirebaseTriggerType } from '../types';
import { getFirebaseFunctionList } from '../internal-methods';

class DemoCtrl {
  @onStorageArchive('bucketName')
  archiveFile() {
    return 'archiveFile';
  }

  @onStorageDelete('bucketName')
  deleteFile() {
    return 'deleteFile';
  }

  @onStorageFinalize('bucketName')
  finalizeFile() {
    return 'finalizeFile';
  }

  @onStorageMetadataUpdate('bucketName')
  updateMetadata() {
    return 'updateMetadata';
  }
}

[
  { decorator: 'onStorageArchive', methodName: 'archiveFile', trigger: FirebaseTriggerType.STORAGE_ARCHIVE },
  { decorator: 'onStorageDelete', methodName: 'deleteFile', trigger: FirebaseTriggerType.STORAGE_DELETE },
  { decorator: 'onStorageFinalize', methodName: 'finalizeFile', trigger: FirebaseTriggerType.STORAGE_FINALIZE },
  { decorator: 'onStorageMetadataUpdate', methodName: 'updateMetadata', trigger: FirebaseTriggerType.STORAGE_METADATA_UPDATE },
].forEach(test => {
  describe(`@${test.decorator}()`, () => {
    it(`should have ${test.methodName}() method on the Firebase Function List on memory`, () => {
      // Setup
      const func = getFirebaseFunctionList().find((item) => item.methodName === test.methodName);
      if (func) {
        // Execute
        const result = func.method();

        // Validate
        expect(result).toBe(test.methodName);
        expect(func.className).toBe('DemoCtrl');
        expect(func.methodName).toBe(test.methodName);
        expect(func.trigger).toBe(test.trigger);
        expect(func.key).toBe('bucketName');
      } else {
        fail(`Method ${test.methodName}() not found`);
      }
    });
  });
});
