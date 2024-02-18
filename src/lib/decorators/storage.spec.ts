import 'reflect-metadata';
import { onStorageArchive, onStorageDelete, onStorageFinalize, onStorageMetadataUpdate } from './storage';
import { FirebaseTriggerType } from '../types';
import { getFirebaseFunctionList } from '../internal-methods';

class DemoCtrl {
  @onStorageArchive('bucket-name')
  archiveFile() {
    return 'archiveFile';
  }

  @onStorageArchive({ bucket: 'bucket-name', memory: '256MiB' })
  archiveFileWithOptions() {
    return 'archiveFileWithOptions';
  }

  @onStorageDelete('bucket-name')
  deleteFile() {
    return 'deleteFile';
  }

  @onStorageDelete({ bucket: 'bucket-name', memory: '256MiB' })
  deleteFileWithOptions() {
    return 'deleteFileWithOptions';
  }

  @onStorageFinalize('bucket-name')
  finalizeFile() {
    return 'finalizeFile';
  }

  @onStorageFinalize({ bucket: 'bucket-name', memory: '256MiB' })
  finalizeFileWithOptions() {
    return 'finalizeFileWithOptions';
  }

  @onStorageMetadataUpdate('bucket-name')
  updateMetadata() {
    return 'updateMetadata';
  }

  @onStorageMetadataUpdate({ bucket: 'bucket-name', memory: '256MiB' })
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
        expect(func.key).toBe('bucket-name');
        expect(func.options).toEqual({ bucket: 'bucket-name' });
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
        expect(func.key).toBe('bucket-name');
        expect(func.options).toEqual({ bucket: 'bucket-name', memory: '256MiB' });
      } else {
        fail(`Method ${methodName}WithOptions() not found`);
      }
    });

    it('should define metadata reflection', () => {
      // Setup
      const expectedMetadata = {
        bucket: 'bucket-name'
      };
  
      // Execute
      const result = Reflect.getMetadata(test.decorator, DemoCtrl.prototype, test.methodName);
  
      // Validate
      expect(result).toMatchObject(expectedMetadata);
    });
  });
});
