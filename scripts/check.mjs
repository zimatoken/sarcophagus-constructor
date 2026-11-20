import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
const root = fileURLToPath(new URL('../', import.meta.url));
const jsFiles = ['web/constructor.js','web/library.js','docs-app/constructor-v2.js','docs-app/library-v2.js'];
for (const file of jsFiles) {
  const source = readFileSync(join(root,file),'utf8');
  if (file.endsWith('.js') && file.includes('constructor')) new vm.Script(source,{filename:file});
}
const librarySource = readFileSync(join(root,'web/library.js'),'utf8') + String.fromCharCode(10) + 'globalThis.__library = MODULE_LIBRARY;';
const sandbox = {}; vm.runInNewContext(librarySource,sandbox);
const ids = new Set();
for (const module of sandbox.__library.modules) {
  if (!module.id || ids.has(module.id)) throw new Error(`Duplicate/empty module ID: ${module.id}`);
  ids.add(module.id);
}
for (const file of ['docs-app/index-v2.html','docs-app/constructor-v2.js','docs-app/library-v2.js','docs-app/styles.css']) {
  if (!existsSync(join(root,file))) throw new Error(`Missing runtime file: ${file}`);
}
const v2Source = readFileSync(join(root,'docs-app/constructor-v2.js'),'utf8');
if (!v2Source.includes('../web/assets/icons/')) throw new Error('v2 must reference shared icon assets');
for (const file of readdirSync(join(root,'web/assets/icons'))) {
  if (!existsSync(join(root,'web/assets/icons',file))) throw new Error(`Missing shared icon: ${file}`);
}
console.log(`Static check passed: ${jsFiles.length} JS files parsed, ${ids.size} unique modules, shared v2 icon path valid.\n`);
