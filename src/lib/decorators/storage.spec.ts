import 'reflect-metadata';
import { onStorageArchive, onStorageDelete, onStorageFinalize, onStorageMetadataUpdate } from './storage';
import { FirebaseTriggerType } from '../types';
import { getFirebaseFunctionList } from '../internal-methods';

class DemoCtrl {
  @onStorageArchive('bucketName')
  archiveFile() {
    return 'archiveFile';
  }

  @onStorageArchive('bucketName', { memory: '256MB' })
  archiveFileWithOptions() {
    return 'archiveFileWithOptions';
  }

  @onStorageDelete('bucketName')
  deleteFile() {
    return 'deleteFile';
  }

  @onStorageDelete('bucketName', { memory: '256MB' })
  deleteFileWithOptions() {
    return 'deleteFileWithOptions';
  }

  @onStorageFinalize('bucketName')
  finalizeFile() {
    return 'finalizeFile';
  }

  @onStorageFinalize('bucketName', { memory: '256MB' })
  finalizeFileWithOptions() {
    return 'finalizeFileWithOptions';
  }

  @onStorageMetadataUpdate('bucketName')
  updateMetadata() {
    return 'updateMetadata';
  }

  @onStorageMetadataUpdate('bucketName', { memory: '256MB' })
  updateMetadataWithOptions() {
    return 'updateMetadataWithOptions';
  }
}

[
  { decorator: 'onStorageArchive', methodName: 'archiveFile', trigger: FirebaseTriggerType.STORAGE_ARCHIVE },
  { decorator: 'onStorageDelete', methodName: 'deleteFile', trigger: FirebaseTriggerType.STORAGE_DELETE },
  { decorator: 'onStorageFinalize', methodName: 'finalizeFile', trigger: FirebaseTriggerType.STORAGE_FINALIZE },
  {
    decorator: 'onStorageMetadataUpdate',
    methodName: 'updateMetadata',
    trigger: FirebaseTriggerType.STORAGE_METADATA_UPDATE,
  },
].forEach((test) => {
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

    it(`should have ${test.methodName}WithOptions() method on the Firebase Function List on memory`, () => {
      // Setup
      const methodName = `${test.methodName}WithOptions`;
      const func = getFirebaseFunctionList().find((item) => item.methodName === methodName);
      if (func) {
        // Execute
        const result = func.method();

        // Validate
        expect(result).toBe(methodName);
        expect(func.className).toBe('DemoCtrl');
        expect(func.methodName).toBe(methodName);
        expect(func.trigger).toBe(test.trigger);
        expect(func.key).toBe('bucketName');
      } else {
        fail(`Method ${methodName}WithOptions() not found`);
      }
    });

    it('should define metadata reflection', () => {
      // Setup
      const expectedMetadata = {
        bucketName: 'bucketName',
        options: undefined
      };
  
      // Execute
      const result = Reflect.getMetadata(test.decorator, DemoCtrl.prototype, test.methodName);
  
      // Validate
      expect(result).toMatchObject(expectedMetadata);
    });
  });
});
