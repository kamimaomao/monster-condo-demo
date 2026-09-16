import assert from 'node:assert/strict';
import { Game, COLORS, findMatch } from '../src/model.js';

const floors = (...types) => types.map((type, i) => ({ id: 100 + i, type }));
const gameWith = (...types) => {
  const game = new Game();
  game.floors = floors(...types);
  game.start();
  return game;
};

// First swipe gives the intended three-red collapse and rotates the red monster.
const opening = new Game();
assert.equal(opening.phase, 'ready');
opening.tick(20);
assert.equal(opening.remaining, 120);
assert.equal(findMatch(opening.floors), null);
opening.start();
const first = opening.swipe(opening.floors[2].id, 0);
assert.equal(first.good, true);
assert.deepEqual(opening.floors.slice(0, 3).map(floor => floor.type), ['red', 'red', 'red']);
const firstMatch = opening.resolveMatch(findMatch(opening.floors));
assert.equal(firstMatch.result, 'bronze');
assert.equal(firstMatch.created.length, 1);
assert.equal(opening.floors[0].type, 'bronze');
assert.deepEqual(firstMatch.tagged.map(tag => tag.from), ['red']);
assert.equal(new Set(opening.monsters.map(monster => monster.color)).size, 2);
assert.equal(opening.resolveMatch(firstMatch), null, 'stale event cannot award twice');
assert.equal(opening.refill().length, 3);
assert.equal(opening.floors.length, 14);

// A different ordinary colour blocks; metal bridges remain after the colours disappear.
const bridge = gameWith('red', 'bronze', 'red', 'silver', 'gold', 'red', 'blue');
const bridgeEvent = bridge.resolveMatch(findMatch(bridge.floors));
assert.deepEqual(bridgeEvent.ids, [100, 102, 105]);
assert.deepEqual(bridge.floors.map(floor => floor.type), ['bronze', 'bronze', 'silver', 'gold', 'blue']);
assert.equal(findMatch(floors('red', 'red', 'concrete', 'red')).result, 'bronze');
assert.equal(findMatch(floors('red', 'red', 'blue', 'red')), null);
assert.equal(findMatch(floors('bronze', 'silver', 'bronze', 'bronze')), null);

// The bronze bridges become a second match after the ordinary colours disappear.
const cascade = gameWith('blue', 'bronze', 'blue', 'bronze', 'blue');
cascade.resolveMatch(findMatch(cascade.floors));
assert.deepEqual(cascade.floors.map(floor => floor.type), ['bronze', 'bronze', 'bronze']);
assert.equal(cascade.resolveMatch(findMatch(cascade.floors)).result, 'silver');

// Three metal upgrades, then three diamonds enter Mega without enabling monster powers.
for (const [from, to] of [['bronze', 'silver'], ['silver', 'gold'], ['gold', 'diamond'], ['diamond', 'mega']]) {
  const game = gameWith(from, from, from, 'red');
  const event = game.resolveMatch(findMatch(game.floors));
  assert.equal(event.result, to);
  assert.equal(event.mega, to === 'mega');
  assert.equal(game.floors[0].type, to === 'mega' ? 'red' : to);
  if (to === 'mega') assert.equal(game.mega, 12);
}

const concrete = gameWith('concrete', 'green', 'green', 'green', 'concrete', 'blue');
assert.equal(concrete.swipe(100, 0), null);
const concreteEvent = concrete.resolveMatch(findMatch(concrete.floors));
assert.equal(concreteEvent.cleared.length, 2);
assert.deepEqual(concrete.floors.map(floor => floor.type), ['bronze', 'blue']);

const concreteBridge = gameWith('red', 'red', 'concrete', 'red', 'blue');
const concreteBridgeEvent = concreteBridge.resolveMatch(findMatch(concreteBridge.floors));
assert.equal(concreteBridgeEvent.cleared[0].type, 'concrete');
assert.deepEqual(concreteBridge.floors.map(floor => floor.type), ['bronze', 'blue']);

// The official clip has yellow match across a cat and two silvers; the silvers survive.
const catBridge = gameWith('yellow', 'cat', 'silver', 'yellow', 'silver', 'yellow', 'red');
const catEvent = catBridge.resolveMatch(findMatch(catBridge.floors));
assert.equal(catEvent.collected.cat, 1);
assert.equal(catEvent.created.length, 2, 'cat output count is an explicitly approximate tuning value');
assert.equal(catBridge.floors.filter(floor => floor.type === 'silver').length, 2);
assert.equal(catBridge.floors.some(floor => floor.type === 'cat'), false);

assert.equal(findMatch(floors('gold', 'concrete', 'gold', 'clock', 'gold')).result, 'diamond');
assert.equal(findMatch(floors('gold', 'silver', 'gold', 'gold')), null);
assert.equal(findMatch(floors('gold', 'red', 'gold', 'gold')), null);
assert.equal(findMatch(floors('red', 'red', 'cat', 'blue', 'red')), null);

const feeding = gameWith('blue', 'green', 'bronze', 'yellow');
assert.equal(feeding.swipe(100, 7), null);
const calm = feeding.monsters[0].anger;
assert.equal(feeding.swipe(100, 0).good, true);
assert.ok(feeding.monsters[0].anger < calm);
const happy = feeding.monsters[0].anger;
assert.equal(feeding.swipe(101, 0).good, false);
assert.ok(feeding.monsters[0].anger > happy);
feeding.tilt = 0.7;
assert.equal(feeding.swipe(102, 0).power, true);
assert.equal(feeding.monsters[0].power, 8);
assert.equal(feeding.multiplier, 1, 'blue does not double all scoring');
assert.ok(feeding.tilt < 0.3);

for (const color of COLORS) {
  const game = gameWith('bronze', 'red', 'red', 'red', 'blue');
  game.monsters[0].color = color;
  game.monsters[1].color = color === 'red' ? 'blue' : 'red';
  game.swipe(100, 0);
  if (color === 'red') {
    game.tick(2);
    assert.ok(Math.abs(game.remaining - 119.1) < 1e-8);
    assert.equal(game.monsters[0].power, 6);
  }
  if (color === 'blue') assert.equal(game.multiplier, 1);
  if (color === 'green') assert.equal(game.resolveMatch(findMatch(game.floors)).created.length, 2);
  if (color === 'yellow') assert.equal(game.multiplier, 10);
}

const pinkMatch = gameWith('clock', 'piggy', 'clock', 'red');
const pinkEvent = pinkMatch.resolveMatch(findMatch(pinkMatch.floors));
assert.equal(pinkEvent.result, 'multiplier');
assert.equal(pinkEvent.collected.seconds, 6);
assert.equal(pinkEvent.collected.coins, 3);
assert.equal(pinkMatch.remaining, 126);
assert.equal(pinkMatch.coins, 3);
assert.deepEqual(pinkMatch.floors.map(floor => floor.type), ['multiplier', 'red']);

// Blue doubles clock, piggy and multiplier loot, including direct feeding.
const loot = gameWith('bronze', 'clock', 'piggy', 'multiplier', 'green');
loot.swipe(100, 0);
assert.equal(loot.swipe(101, 0).collected.seconds, 2);
assert.equal(loot.swipe(102, 0).collected.coins, 2);
assert.equal(loot.swipe(103, 0).collected.multiplierGain, 2);
assert.equal(loot.remaining, 122);
assert.equal(loot.coins, 2);
assert.equal(loot.baseMultiplier, 3);
assert.equal(loot.multiplier, 3);
loot.tick(8);
assert.equal(loot.multiplier, 3, 'earned base multiplier survives the end of blue power');

const collectedEdges = gameWith('clock', 'red', 'piggy', 'red', 'multiplier', 'red', 'blue');
collectedEdges.monsters[0].power = 5;
const collectedEvent = collectedEdges.resolveMatch(findMatch(collectedEdges.floors));
assert.equal(collectedEvent.cleared.length, 3);
assert.equal(collectedEvent.collected.seconds, 12);
assert.equal(collectedEvent.collected.coins, 12);
assert.equal(collectedEvent.collected.multiplierGain, 12);

for (const type of ['green', 'bronze']) {
  const four = gameWith(type, type, type, type, 'red');
  assert.equal(four.resolveMatch(findMatch(four.floors)).created.length, 1);
  const five = gameWith(type, type, type, type, type, 'red');
  const event = five.resolveMatch(findMatch(five.floors));
  assert.deepEqual(event.created.map(floor => floor.type), [type === 'green' ? 'bronze' : 'silver', 'piggy']);
}

const chaining = gameWith('green', 'green', 'green');
for (let i = 1; i <= 3; i++) {
  chaining.floors = floors('green', 'green', 'green');
  const event = chaining.resolveMatch(findMatch(chaining.floors));
  assert.equal(event.chain, i);
  assert.equal(event.created.some(floor => floor.type === 'clock'), i === 3);
  chaining.tick(0.5);
}
chaining.tick(1.5);
assert.equal(chaining.chain, 0);
assert.equal(chaining.maxChain, 3);

const mega = gameWith('diamond', 'diamond', 'diamond', 'yellow');
mega.monsters.forEach(monster => { monster.power = 10; monster.anger = 99; });
const megaEvent = mega.resolveMatch(findMatch(mega.floors));
assert.equal(megaEvent.mega, true);
assert.deepEqual(mega.monsters.map(monster => monster.power), [0, 0]);
assert.equal(mega.multiplier, 100);
mega.tick(1);
assert.equal(mega.remaining, 119, 'Mega does not implicitly enable red slow time');
mega.swipe(103, 0);
assert.equal(mega.monsters[0].anger, 0, 'Mega prevents wrong-colour anger');
mega.floors = floors('green', 'green', 'green');
assert.equal(mega.resolveMatch(findMatch(mega.floors)).created.filter(floor => floor.type === 'bronze').length, 1, 'Mega does not implicitly enable green');

const timer = new Game();
timer.start();
timer.tick(NaN);
timer.tick(-10);
assert.equal(timer.remaining, 120);
timer.tick(120);
assert.equal(timer.phase, 'ended');
assert.equal(timer.resultReason, 'time');
assert.equal(timer.swipe(timer.floors[0].id, 0), null);

const powerBoundary = gameWith('bronze', 'green');
powerBoundary.swipe(100, 1); // Red power lasts eight seconds, then clock returns to normal.
powerBoundary.tick(10);
assert.ok(Math.abs(powerBoundary.remaining - 114.4) < 1e-8);
assert.equal(powerBoundary.monsters[1].power, 0);

const collapse = new Game();
collapse.start();
for (let i = 0; i < 12 && collapse.phase === 'playing'; i++) {
  collapse.floors.push({ id: 1000 + i, type: 'yellow' });
  collapse.swipe(1000 + i, 0);
}
assert.equal(collapse.resultReason, 'tower');
assert.ok(collapse.feeds >= 8 && collapse.feeds <= 12);

const badMatch = gameWith('concrete', 'concrete', 'concrete');
badMatch.tick(0.1);
assert.equal(badMatch.phase, 'playing');
const badEvent = badMatch.resolveMatch(findMatch(badMatch.floors));
assert.equal(badEvent.result, 'cat');
assert.deepEqual(badMatch.floors.map(floor => floor.type), ['cat']);
const practice = new Game({ mode: 'practice' });
practice.start();
practice.tick(1000);
assert.equal(practice.phase, 'playing');
assert.equal(practice.remaining, 120);
assert.ok(Math.abs(practice.tilt) < 1);

// Seeded refill is reproducible and does not manufacture a top-of-tower triple.
const a = new Game({ seed: 42 });
const b = new Game({ seed: 42 });
a.floors = []; b.floors = [];
assert.deepEqual(a.refill(), b.refill());
assert.equal(findMatch(a.floors), null);
assert.equal(new Set(a.floors.map(floor => floor.id)).size, 14);

console.log('model checks passed: retained metal cascades, special bridges, mixed pinks, concrete-to-cat, loot, chains, Mega, timers, tilt and practice');
