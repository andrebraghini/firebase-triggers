const { writeFileSync, mkdirSync } = require('fs');
const { join } = require('path');

const root = join(__dirname, '..');

mkdirSync(join(root, 'lib/cjs'), { recursive: true });
mkdirSync(join(root, 'lib/esm'), { recursive: true });

writeFileSync(join(root, 'lib/cjs/package.json'), JSON.stringify({ type: 'commonjs' }, null, 2) + '\n');
writeFileSync(join(root, 'lib/esm/package.json'), JSON.stringify({ type: 'module' }, null, 2) + '\n');
