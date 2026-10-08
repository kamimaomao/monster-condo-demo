import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { Game, TYPES, findMatch } from '../src/model.js';

// Run the actual UI lifecycle with a minimal DOM and renderer; no browser or GPU required.
class Element {
  constructor() {
    this.children = []; this.dataset = {}; this.style = {}; this.events = new Map();
    const classes = new Set();
    this.classList = {
      add: (...names) => names.forEach(n => classes.add(n)),
      remove: (...names) => names.forEach(n => classes.delete(n)),
      contains: n => classes.has(n),
      toggle(n, enabled = !classes.has(n)) { enabled ? classes.add(n) : classes.delete(n); },
    };
  }
  addEventListener(name, fn) { this.events.set(name, fn); }
  setAttribute() {}
  append(child) { this.children.push(child); child.parent = this; }
  replaceChildren() { this.children = []; }
  remove() { if (this.parent) this.parent.children = this.parent.children.filter(c => c !== this); }
  focus() { this.events.get('focus')?.(); }
  querySelector(selector) { return this.children.find(c => String(c.dataset.id) === selector.match(/data-id="(.+)"/)?.[1]) ?? null; }
}
const elements = new Map();
const node = selector => {
  if (!elements.has(selector)) elements.set(selector, new Element());
  return elements.get(selector);
};
const documentEvents = new Map(), windowEvents = new Map(), pending = new Map();
let clock = 1000, sequence = 0, renders = 0;
const document = {
  hidden: false,
  querySelector: node,
  createElement: () => new Element(),
  addEventListener: (name, fn) => documentEvents.set(name, fn),
};
class TowerScene {
  constructor() { this.items = new Map(); }
  sync(floors) { this.items = new Map(floors.map(f => [f.id, { x: 0, y: 0 }])); }
  settle() {}
  mark() {}
  dragFloor() {}
  update() { renders++; }
}
const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8').replace(/^import .*;\n/gm, '');
const context = {
  Game, TYPES, findMatch, TowerScene, W: 480, H: 854, BASE: 729, STEP: 39, palette: {},
  monsterSVG: () => '', document, window: { addEventListener: (name, fn) => windowEvents.set(name, fn) },
  performance: { now: () => clock },
  requestAnimationFrame: fn => { const id = ++sequence; pending.set(id, fn); return id; },
  cancelAnimationFrame: id => pending.delete(id),
};
vm.runInNewContext(source + '\nglobalThis.ui = { start, resume, game: () => game, paused: () => paused };', context);
const step = (ms = 16) => {
  assert.equal(pending.size, 1, 'one pending animation frame');
  const [id, fn] = pending.entries().next().value;
  pending.delete(id); clock += ms; fn(clock);
};
const visibility = hidden => { document.hidden = hidden; documentEvents.get('visibilitychange')(); };
assert.equal(pending.size, 1, 'initial visible page schedules one frame');
context.ui.start(); step();
assert.equal(renders, 1);
assert.equal(pending.size, 1, 'frame reschedules exactly once');
visibility(true);
assert.equal(pending.size, 0, 'hidden page cancels rendering');
assert.equal(node('#game').dataset.rendering, 'sleeping');
assert.ok(node('#game').classList.contains('sleeping'), 'CSS animations pause with the renderer');
assert.ok(context.ui.paused(), 'active game waits for explicit resume');
const remaining = context.ui.game().remaining;
clock += 60_000;
visibility(true);
assert.equal(pending.size, 0, 'repeated hide cannot restart rendering');
visibility(false); visibility(false); windowEvents.get('pageshow')();
assert.equal(pending.size, 1, 'repeated wake and pageshow share one loop');
assert.ok(!node('#game').classList.contains('sleeping'));
step();
assert.equal(context.ui.game().remaining, remaining, 'hidden wall time and paused frames do not spend game time');
context.ui.resume(); step();
assert.ok(remaining - context.ui.game().remaining > 0 && remaining - context.ui.game().remaining < .1);
windowEvents.get('pagehide')();
assert.equal(pending.size, 0, 'pagehide cancels a visible page before BFCache');
windowEvents.get('pageshow')(); windowEvents.get('pageshow')();
assert.equal(pending.size, 1, 'BFCache restoration starts exactly one loop');
const staleFrame = pending.values().next().value;
visibility(true); staleFrame(clock + 16);
assert.equal(pending.size, 0, 'a late callback cannot restart a hidden page');
assert.equal(node('#game').dataset.rendering, 'sleeping');
console.log('UI lifecycle checks passed: hidden, resumed, repeated events, and BFCache.');

const sceneSource = readFileSync(new URL('../src/scene.js', import.meta.url), 'utf8')
  .replace(/^import .*;\n/gm, '').replace(/export (?=const|class)/g, '').replace(/^export \{.*\};?$/gm, '');
const scenePrototype = vm.runInNewContext(sceneSource + '\nTowerScene.prototype;');
let disposed = 0, removed = 0, geometryDisposed = 0;
const material = { dispose() { disposed++; } }, geometry = { dispose() { geometryDisposed++; } };
const oldFloor = { f: { id: 1, type: 'red' }, g: { traverse(fn) { fn({ material }); } } };
const scene = Object.assign(Object.create(scenePrototype), {
  tower: { remove() { removed++; } }, scene: { remove() { removed++; } },
  items: new Map([[1, oldFloor]]), tilt: 1, shake: 5,
  particles: [{ mesh: { material, geometry }, ring: true }, { mesh: { material, geometry } }],
  floor(f) { return { f, g: {}, x: 20, y: 0, vy: 10, matching: true, landed: false }; },
});
scene.sync([{ id: 1, type: 'blue' }]);
assert.notEqual(scene.items.get(1), oldFloor, 'same ID with new type replaces its visual');
assert.equal(disposed, 1, 'old floor materials are disposed');
const retainedFloor = scene.items.get(1);
scene.sync([{ id: 1, type: 'blue' }]);
assert.equal(scene.items.get(1), retainedFloor, 'unchanged floor visual is reused');
scene.settle();
assert.deepEqual([scene.tilt, scene.shake, scene.particles.length, retainedFloor.x, retainedFloor.vy, retainedFloor.matching], [0, 0, 0, 0, 0, false]);
assert.equal(retainedFloor.y, retainedFloor.target);
assert.equal(disposed, 3, 'reset disposes both particle materials');
assert.equal(geometryDisposed, 1, 'reset disposes ring geometry, retaining shared geometry');
assert.equal(removed, 3);
console.log('Scene reset checks passed: reused IDs, matching flags, tilt, shake, and particles.');
