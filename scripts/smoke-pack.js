const { execSync } = require('child_process');
const { mkdtempSync, rmSync, writeFileSync } = require('fs');
const { join } = require('path');
const { tmpdir } = require('os');

const root = join(__dirname, '..');
const workdir = mkdtempSync(join(tmpdir(), 'firebase-triggers-smoke-'));

try {
  console.log('Building and packing...');
  execSync('npm run build', { cwd: root, stdio: 'inherit' });
  const packOut = execSync('npm pack', { cwd: root, encoding: 'utf8' }).trim().split('\n').pop();
  const tarball = join(root, packOut);

  writeFileSync(
    join(workdir, 'package.json'),
    JSON.stringify(
      {
        name: 'firebase-triggers-smoke',
        private: true,
        type: 'commonjs',
      },
      null,
      2,
    ),
  );

  console.log('Installing tarball + peers in', workdir);
  execSync(`npm install "${tarball}" firebase-functions@^7 firebase-admin@^14`, {
    cwd: workdir,
    stdio: 'inherit',
  });

  const cjsCheck = `
const ft = require('firebase-triggers');
if (typeof ft.getFirebaseFunctionListToExport !== 'function') {
  throw new Error('CJS export missing getFirebaseFunctionListToExport');
}
if (typeof ft.beforeFirebaseUserCreate !== 'function') {
  throw new Error('CJS export missing beforeFirebaseUserCreate');
}
if (typeof ft.onFirestoreCreateWithAuthContext !== 'function') {
  throw new Error('CJS export missing onFirestoreCreateWithAuthContext');
}
console.log('CJS smoke OK');
`;
  writeFileSync(join(workdir, 'smoke.cjs'), cjsCheck);
  execSync('node smoke.cjs', { cwd: workdir, stdio: 'inherit' });

  writeFileSync(
    join(workdir, 'smoke.mjs'),
    `
import { getFirebaseFunctionListToExport, beforeFirebaseUserCreate, onFirestoreCreateWithAuthContext } from 'firebase-triggers';
if (typeof getFirebaseFunctionListToExport !== 'function') throw new Error('ESM export missing');
if (typeof beforeFirebaseUserCreate !== 'function') throw new Error('ESM beforeFirebaseUserCreate missing');
if (typeof onFirestoreCreateWithAuthContext !== 'function') throw new Error('ESM auth-context missing');
console.log('ESM smoke OK');
`,
  );
  execSync('node smoke.mjs', { cwd: workdir, stdio: 'inherit' });

  console.log('Smoke pack completed successfully');
} finally {
  try {
    rmSync(workdir, { recursive: true, force: true });
  } catch {
    // ignore cleanup errors
  }
  try {
    execSync('rm -f firebase-triggers-*.tgz', { cwd: root });
  } catch {
    // ignore
  }
}
