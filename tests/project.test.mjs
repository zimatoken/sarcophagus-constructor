import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
const root = fileURLToPath(new URL('../', import.meta.url));
const read = p => readFileSync(join(root,p),'utf8');

test('both constructor scripts are valid JavaScript', () => {
  for (const p of ['web/constructor.js','docs-app/constructor-v2.js']) assert.doesNotThrow(() => new vm.Script(read(p)),p);
});
test('module library has unique IDs and all four project types', () => {
  const context = {};
  vm.runInNewContext(read('web/library.js') + String.fromCharCode(10) + 'globalThis.lib=MODULE_LIBRARY;', context);
  const modules = context.lib.modules;
  assert.equal(modules.length,27);
  assert.equal(new Set(modules.map(m=>m.id)).size,modules.length);
  for (const type of ['A','B','C','D']) assert.ok(modules.some(m=>m.type.includes(type)),`type ${type}`);
});
test('v2 page loads the actual module library before constructor runtime', () => {
  const html = read('docs-app/index.html');
  const library = read('docs-app/library-v2.js');
  assert.ok(html.indexOf('library-v2.js') < html.indexOf('constructor-v2.js'), 'library must load before runtime');
  const context = {};
  vm.runInNewContext(library + String.fromCharCode(10) + 'globalThis.lib=MODULE_LIBRARY;', context);
  assert.equal(context.lib.modules.length, 27);
  assert.equal(new Set(context.lib.modules.map(m => m.id)).size, 27);
});
test('v2 diagnostic aliases map to existing module IDs', () => {
  const js = read('docs-app/constructor-v2.js');
  const ids = [...js.matchAll(/(?:foundation|compass|playground|treasure|first_aid|translator|sos): '(M\d+)'/g)].map(m=>m[1]);
  const context = {};
  vm.runInNewContext(read('web/library.js') + String.fromCharCode(10) + 'globalThis.lib=MODULE_LIBRARY;', context);
  const known = new Set(context.lib.modules.map(m=>m.id));
  assert.ok(ids.length >= 7);
  for (const id of ids) assert.ok(known.has(id),`unknown diagnostic module ${id}`);
});
test('v2 runtime has import/export controls and local draft persistence', () => {
  const html=read('docs-app/index.html'), js=read('docs-app/constructor-v2.js');
  for (const id of ['btnExportJSON','btnImportJSON','importJSONFile','btnCopyShort','btnCopyFull']) assert.ok(html.includes(id),id);
  assert.match(js,/schemaVersion:\s*2/);
  assert.match(js,/normalizeProjectData/);
});
test('legacy and v2 icon libraries are complete', () => {
  for (const file of ['foundation.png','compass.png','first-aid.png','treasure.png','playground.png','emergency.png','ai-memo.png']) {
    const hasLegacy = existsSync(join(root,'web/assets/icons',file));
    const hasNew = existsSync(join(root,'docs-app/assets/icons',file));
    assert.ok(hasLegacy || hasNew, `missing icon ${file}`);
  }
  // Проверяем, что в constructor-v2.js используется локальная папка иконок
  const js = read('docs-app/constructor-v2.js');
  assert.ok(js.includes('assets/icons/'), 'v2 uses local icon directory');
});

test('v2 restores original contextual help for all key wizard fields', () => {
  const js = read('docs-app/constructor-v2.js');
  for (const id of ['type','name','version','date','status','philosophy','purpose','architecture',
    'M01','M03','M04','M06','M07','M08','M10','M15','M20','M26','M27',
    'opt-currentStatus','opt-checklists','opt-risks','opt-changelog','opt-links','aiMemo','criticalNotes']) {
    assert.ok(js.includes(`'${id}'`), `missing help content: ${id}`);
  }
  assert.match(js,/function showHelp\(helpId\)/);
  assert.match(js,/helpBtn\.dataset\.help/);
});
test('v2 branding assets and mode controls are styled', () => {
  const html = read('docs-app/index.html');
  const css = read('docs-app/styles.css');
  assert.ok(html.includes('sarcophagus-logo.webp'));
  assert.ok(html.includes('favicon.png'));
  assert.match(css,/\.mode-btn\.active/);
  assert.match(css,/\.help-btn/);
  assert.match(read('scripts/serve.mjs'),/\.webp':'image\/webp'/);
  for (const f of ['sarcophagus-logo.webp','sarcophagus-logo.png','favicon.png']) {
    const hasLegacy = existsSync(join(root,'web/assets',f));
    const hasNew = existsSync(join(root,'docs-app/assets',f));
    assert.ok(hasLegacy || hasNew, `missing brand asset ${f}`);
  }
});

test('v2 provides expanded cheat-sheets for every fixed input and optional decision', () => {
  const js = read('docs-app/constructor-v2.js');
  const html = read('docs-app/index.html');
  for (const id of ['type','name','version','date','status','philosophy','purpose','architecture',
    'opt-currentStatus','opt-checklists','opt-risks','opt-changelog','opt-links','aiMemo','criticalNotes','diagnostInput']) {
    assert.ok(js.includes(`${id}:`) || js.includes(`'${id}':`), `missing field guide ${id}`);
  }
  for (const phrase of ['Что сюда вводить','Зачем это нужно','Что последует','Что сделать тебе','Пример ориентира']) {
    assert.ok(js.includes(phrase), `missing guide section ${phrase}`);
  }
  assert.match(js,/function renderGuide\(key, module\)/);
  assert.match(js,/renderGuide\(module\.id, module\)/);
  assert.match(html,/diagnostInput/);
});

test('v2 module cheat-sheets are generated from the full 27-module library', () => {
  const js = read('docs-app/constructor-v2.js');
  const library = read('docs-app/library-v2.js');
  const context = {};
  vm.runInNewContext(library + String.fromCharCode(10) + 'globalThis.lib=MODULE_LIBRARY;', context);
  assert.equal(context.lib.modules.length, 27);
  assert.match(js,/renderGuide\(module\.id, module\)/);
  assert.match(js,/module\.description/);
  assert.match(js,/module\.example \|\| module\.template/);
});

test('v2 import validator accepts supported project envelopes and rejects foreign or unsupported files', () => {
  const js = read('docs-app/constructor-v2.js');
  const start = js.indexOf('function normalizeProjectData(source) {');
  const end = js.indexOf('\nfunction saveDraft()', start);
  assert.ok(start >= 0 && end > start);
  const context = { MODULE_LIBRARY: { modules: Array.from({ length: 27 }, (_, i) => ({ id: `M${String(i + 1).padStart(2, '0')}` })) } };
  vm.runInNewContext(js.slice(start, end) + '\nglobalThis.api={normalizeProjectData,validateImportedProject};', context);
  assert.equal(context.api.validateImportedProject({ app: 'Sarcophagus Constructor', schemaVersion: 2, data: { type: 'A', name: 'QA' } }).name, 'QA');
  assert.throws(() => context.api.validateImportedProject({ app: 'foreign', schemaVersion: 2, data: {} }), /другим приложением/);
  assert.throws(() => context.api.validateImportedProject({ app: 'Sarcophagus Constructor', schemaVersion: 99, data: {} }), /Неподдерживаемая версия/);
  assert.throws(() => context.api.validateImportedProject({ data: { type: 'Z' } }), /тип проекта/);
  assert.throws(() => context.api.validateImportedProject({ data: { name: 42 } }), /должно быть текстом/);
});

test('v2 import normalization whitelists known module keys and bounds text fields', () => {
  const js = read('docs-app/constructor-v2.js');
  const start = js.indexOf('function normalizeProjectData(source) {');
  const end = js.indexOf('\nfunction saveDraft()', start);
  const context = { MODULE_LIBRARY: { modules: [{ id: 'M01' }, { id: 'M02' }] } };
  vm.runInNewContext(js.slice(start, end) + '\nglobalThis.normalize=normalizeProjectData;', context);
  const normalized = context.normalize({ type: 'D', name: 'X'.repeat(400), typeSpecific: { module_M01: true, input_M01: 'safe', admin: true }, optional: { risks: 'yes' } });
  assert.equal(normalized.name.length, 300);
  assert.equal(normalized.typeSpecific.module_M01, true);
  assert.equal(normalized.typeSpecific.input_M01, 'safe');
  assert.equal(Object.hasOwn(normalized.typeSpecific, 'admin'), false);
  assert.equal(normalized.optional.risks, 'yes');
  assert.equal(normalized.optional.checklists, null);
});

test('v2 FULL generation includes selected modules and enabled optional sections without leaking disabled modules', () => {
  const js = read('docs-app/constructor-v2.js');
  const start = js.indexOf('function generateMarkdown() {');
  const end = js.indexOf('\n// Навигация', start);
  assert.ok(start >= 0 && end > start);
  const modules = [
    { id: 'M01', name: 'Foundation', type: ['A'], required: true },
    { id: 'M02', name: 'Optional module', type: ['A'], required: false }
  ];
  const data = { type: 'A', name: 'FULL QA', version: 'v9', date: '2026-11-19', status: '🟡', philosophy: 'Keep working logic', purpose: 'Test FULL', architecture: 'Vanilla JS', typeSpecific: { input_M01: 'Required content', module_M02: true, input_M02: 'Selected content', module_M03: true, input_M03: 'Must not leak' }, optional: { currentStatus: 'no', checklists: 'yes', risks: 'no', changelog: 'no', links: 'no' }, optionalText: { checklists: 'Checklist content' }, aiMemo: 'standard', criticalNotes: 'No destructive refactors' };
  const context = { state: { data }, MODULE_LIBRARY: { modules } };
  vm.runInNewContext(js.slice(start, end) + '\nglobalThis.output=generateMarkdown();', context);
  const full = context.output.full;
  assert.match(full, /Required content/);
  assert.match(full, /Selected content/);
  assert.match(full, /Checklist content/);
  assert.match(full, /No destructive refactors/);
  assert.doesNotMatch(full, /Must not leak/);
  assert.doesNotMatch(full, /### 5\.1 Фактический статус/);
});

test('help dialog cleans up Escape listener and provides accessible modal semantics', () => {
  const js = read('docs-app/constructor-v2.js');
  const start = js.indexOf('function showHelp(helpId) {');
  const end = js.indexOf('\nfunction attachModuleCheckboxes()', start);
  const fn = js.slice(start, end);
  assert.match(fn, /aria-modal', 'true'/);
  assert.match(fn, /aria-labelledby/);
  assert.match(fn, /document\.removeEventListener\('keydown', onKey\)/);
  assert.match(fn, /previousFocus\.focus\(\)/);
  assert.match(fn, /if \(e\.key === 'Tab'\)/);
});

test('diagnostic mode accurately identifies itself as a local keyword heuristic, not AI', () => {
  const js = read('docs-app/constructor-v2.js');
  const html = read('docs-app/index.html');
  assert.match(html, /локальный диагностический алгоритм/i);
  assert.match(js, /внешняя AI-модель не вызывается/i);
  assert.doesNotMatch(html, /AI сам предложит решение/i);
});

test('v2 complex draft envelope restores stage, all module values and optional blocks', () => {
  const js = read('docs-app/constructor-v2.js');
  const start = js.indexOf('function normalizeProjectData(source) {');
  const end = js.indexOf('\nfunction renderStage(stage)', start);
  assert.ok(start >= 0 && end > start);
  const values = new Map();
  const context = {
    DRAFT_KEY: 'sarcophagus_draft_v2',
    MODULE_LIBRARY: { modules: Array.from({ length: 27 }, (_, i) => ({ id: `M${String(i + 1).padStart(2, '0')}` })) },
    state: { currentStage: 4, data: {} },
    localStorage: { setItem: (k,v) => values.set(k,v), getItem: k => values.get(k) ?? null },
    document: { getElementById: () => ({ textContent: '' }) },
    confirm: () => true,
    alert: () => {},
    console
  };
  vm.runInNewContext(js.slice(start, end) + '\nglobalThis.persistence={saveDraft,loadDraft};', context);
  context.state.data = { type: 'D', name: 'Complex QA', typeSpecific: Object.fromEntries(Array.from({length:27},(_,i)=>[`input_M${String(i+1).padStart(2,'0')}`,`module-${i+1}`])), optional: { risks: 'yes', links: 'no' }, optionalText: { risks: 'Risk log' } };
  context.persistence.saveDraft();
  context.state = { currentStage: 0, data: {} };
  assert.equal(context.persistence.loadDraft(), true);
  assert.equal(context.state.currentStage, 4);
  assert.equal(context.state.data.type, 'D');
  assert.equal(context.state.data.typeSpecific.input_M27, 'module-27');
  assert.equal(context.state.data.optional.risks, 'yes');
  assert.equal(context.state.data.optionalText.risks, 'Risk log');
});

test('v2 module library exposes usable descriptions and field examples for all 27 modules', () => {
  const context = {};
  vm.runInNewContext(read('docs-app/library-v2.js') + '\nglobalThis.lib=MODULE_LIBRARY;', context);
  assert.equal(context.lib.modules.length, 27);
  for (const module of context.lib.modules) {
    assert.ok(module.id && module.name, `module identity ${module.id}`);
    assert.ok(Array.isArray(module.type) && module.type.length > 0, `${module.id} project types`);
    assert.ok(typeof module.description === 'string' && module.description.trim(), `${module.id} description`);
    assert.ok(typeof module.description === 'string' && module.description.trim(), `${module.id} can use description-based guide fallback`);
  }
});
