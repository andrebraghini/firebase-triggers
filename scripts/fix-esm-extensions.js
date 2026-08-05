const { readdirSync, readFileSync, writeFileSync, existsSync } = require('fs');
const { join, dirname, resolve } = require('path');

const esmRoot = join(__dirname, '..', 'lib', 'esm');

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith('.js')) files.push(full);
  }
  return files;
}

function resolveSpec(fromFile, spec) {
  if (!spec.startsWith('.')) return spec;
  if (spec.endsWith('.js')) return spec;

  const base = resolve(dirname(fromFile), spec);
  if (existsSync(`${base}.js`)) return `${spec}.js`;
  if (existsSync(join(base, 'index.js'))) return `${spec}/index.js`;
  return `${spec}.js`;
}

function rewrite(file) {
  const original = readFileSync(file, 'utf8');
  const updated = original.replace(
    /(from\s+['"]|export\s+\*\s+from\s+['"]|import\s+['"])(\.[^'"]+)(['"])/g,
    (match, prefix, spec, suffix) => `${prefix}${resolveSpec(file, spec)}${suffix}`,
  );
  if (updated !== original) writeFileSync(file, updated);
}

if (!existsSync(esmRoot)) {
  console.error('ESM output not found:', esmRoot);
  process.exit(1);
}

for (const file of walk(esmRoot)) {
  rewrite(file);
}

console.log('Fixed ESM relative import extensions');
