import 'reflect-metadata';
import { getFirebaseFunctionListToExport } from 'firebase-triggers';
import { UserCtrl } from './user-ctrl';

// Just mentioning the used controls
UserCtrl;

// Obtain the "Cloud Functions" found in the code and export each one
const list = getFirebaseFunctionListToExport();
for (const key in list) {
  exports[key] = list[key];
}
