export const COLORS = ['red', 'blue', 'green', 'yellow'];

export const TYPES = {
  red: { color: '#f13e49', name: '红色公寓', tier: 0 },
  blue: { color: '#24b8ef', name: '蓝色公寓', tier: 0 },
  green: { color: '#74d834', name: '绿色公寓', tier: 0 },
  yellow: { color: '#ffcf32', name: '黄色公寓', tier: 0 },
  bronze: { color: '#bc7848', name: '青铜公寓', tier: 1 },
  silver: { color: '#cfdeee', name: '白银公寓', tier: 2 },
  gold: { color: '#ffc845', name: '黄金公寓', tier: 3 },
  diamond: { color: '#a5f9f6', name: '钻石公寓', tier: 4 },
  concrete: { color: '#77778b', name: '混凝土', tier: -1 },
  clock: { color: '#f58fc8', name: '时钟公寓', tier: -1 },
  piggy: { color: '#ff9bd1', name: '储蓄罐公寓', tier: -1 },
  multiplier: { color: '#ec71bd', name: '倍率公寓', tier: -1 },
  cat: { color: '#ffd8ae', name: '招财猫公寓', tier: -1 },
};

const UPGRADES = ['bronze', 'silver', 'gold', 'diamond', 'mega'];
const COLLECTIBLES = ['concrete', 'clock', 'piggy', 'multiplier', 'cat'];
const PINK = ['clock', 'piggy'];
// Reconstruction tuning: exact score, mood and duration values are not public.
const RULES = {
  seconds: 120,
  towerHeight: 14,
  chainSeconds: 2,
  // Unverified threshold: guides ambiguously describe clocks as a 3+ match chain.
  clockChainThreshold: 3,
  piggyMatchThreshold: 5,
  // Unverified cat yield: each collected cat adds one upgrade before green doubles it.
  catExtraUpgrades: 1,
  points: [100, 500, 2500, 12500, 62500],
  feedPoints: 25,
  angerPerSecond: 0.95,
  wrongAnger: 11,
  goodCalm: 18,
  powerSeconds: [0, 8, 12, 18, 24],
  megaSeconds: 12,
  megaScoreMultiplier: 100,
};

// Demo pacing only: these generation weights are not rules or values from the original game.
const PACING = [
  { until: 30, concrete: .015, bronze: .015, reward: .035, pair: 2.4, food: 1.5, natural: .22 },
  { until: 75, concrete: .055, bronze: .09, reward: .09, pair: 3.1, food: 1.35, natural: .5 },
  { until: Infinity, concrete: .13, bronze: .07, reward: .075, pair: 2.3, food: 1.15, natural: .28 },
];
const OPENING_ATTEMPTS = 64;
const RESCUE_AFTER_FEEDS = 4;

/** Floors run bottom-to-top. ids contains the matching cores; resolveMatch collects special neighbours. */
export function findMatch(floors) {
  for (let i = 0; i < floors.length; i++) {
    const type = floors[i].type;
    const tier = TYPES[type]?.tier;
    const normal = COLORS.includes(type);
    const metal = tier > 0;
    const pink = PINK.includes(type);
    if (!normal && !metal && !pink && type !== 'concrete') continue;
    const ids = [floors[i].id];
    for (let j = i + 1; j < floors.length; j++) {
      const next = floors[j];
      if (next.type === type || (pink && PINK.includes(next.type))) ids.push(next.id);
      // Diamond transparency is retained as an unverified reconstruction assumption.
      else if ((normal && (TYPES[next.type]?.tier > 0 || COLLECTIBLES.includes(next.type))) || (metal && COLLECTIBLES.includes(next.type))) continue;
      else break;
    }
    if (ids.length >= 3) return { ids, type, result: pink ? 'multiplier' : type === 'concrete' ? 'cat' : UPGRADES[tier] };
  }
  return null;
}

export class Game {
  constructor({ seed = Math.floor(Math.random() * 4294967296), mode = 'classic' } = {}) {
    this.mode = mode;
    this._seed = Number(seed) >>> 0;
    this._nextId = 1;
    this._chainRemaining = 0;
    this._leanDirection = 1;
    const colors = [...COLORS];
    this.monsters = Array.from({ length: 2 }, () => ({ color: colors.splice(Math.floor(this._random() * colors.length), 1)[0], anger: 15, power: 0 }));
    this.floors = this._opening().map(type => this._floor(type));
    this.played = 0;
    this.stage = 0;
    this._refillFeeds = 0;
    this._refillMatches = 0;
    this._dryFeeds = 0;
    this._naturalMatches = 0;
    this.remaining = RULES.seconds;
    this.score = 0;
    this.baseMultiplier = 1;
    this.coins = 0;
    this.multiplier = 1;
    this.chain = 0;
    this.maxChain = 0;
    this.matches = 0;
    this.feeds = 0;
    this.phase = 'ready';
    this.mega = 0;
    this.tilt = 0;
    this.resultReason = '';
  }

  _random() {
    this._seed = (Math.imul(1664525, this._seed) + 1013904223) >>> 0;
    return this._seed / 4294967296;
  }

  _floor(type) { return { id: this._nextId++, type }; }

  _opening() {
    for (let attempt = 0; attempt < OPENING_ATTEMPTS; attempt++) {
      const floors = [];
      while (floors.length < RULES.towerHeight) {
        const choices = COLORS.filter(color => !(floors.at(-1)?.type === color && floors.at(-2)?.type === color));
        floors.push({ id: floors.length, type: choices[Math.floor(this._random() * choices.length)] });
      }
      const moves = this._moves(floors);
      if (new Set(moves.map(move => move.type)).size >= 2 && moves.some(move => move.good)) return floors.map(floor => floor.type);
    }
    // Bounded fallback: three independent gaps, with three distinct edible gap colours.
    const colors = [...COLORS];
    const [a, b, c, d] = Array.from({ length: 4 }, () => colors.splice(Math.floor(this._random() * colors.length), 1)[0]);
    return [a, a, b, a, c, c, d, c, b, b, a, b, d, c];
  }

  _moves(floors = this.floors) {
    const moves = [];
    // ponytail: bounded 14-floor lookahead; use cached matches if tower sizes become large.
    floors.forEach((floor, index) => {
      if (!TYPES[floor.type] || floor.type === 'concrete') return;
      const after = floors.filter((_, i) => i !== index);
      const match = findMatch(after);
      if (!match) return;
      const goodSides = this.monsters.map((monster, side) => COLORS.includes(floor.type) && floor.type !== monster.color ? -1 : side).filter(side => side >= 0);
      const good = goodSides.length > 0;
      const sides = good ? goodSides : [0, 1];
      const side = sides.reduce((best, next) => (good ? this.monsters[next].anger > this.monsters[best].anger : this.monsters[next].anger < this.monsters[best].anger) ? next : best);
      const preview = after.filter(item => !match.ids.includes(item.id));
      if (match.result !== 'mega') preview.splice(after.findIndex(item => item.id === match.ids[0]), 0, { id: -1, type: match.result });
      // Heuristic only: this preview estimates a follow-up and does not award or resolve it.
      const next = findMatch(preview);
      const tier = match.result === 'mega' ? 5 : Math.max(0, TYPES[match.result]?.tier ?? 0);
      moves.push({ id: floor.id, side, type: match.type, result: match.result, good, rank: (good ? 10000 : 0) + tier * 100 + (next ? 80 : 0) + match.ids.length });
    });
    return moves.sort((a, b) => b.rank - a.rank);
  }

  suggestMove() {
    if (this.phase === 'ended' || findMatch(this.floors)) return null;
    const move = this._moves()[0];
    return move ? { id: move.id, side: move.side, type: move.type, result: move.result } : null;
  }

  _power(color) {
    return this.monsters.some(monster => monster.color === color && monster.power > 0);
  }

  _refreshMultiplier() {
    this.multiplier = this.baseMultiplier * Math.max(1, this.chain) * (this._power('yellow') ? 10 : 1) * (this.mega > 0 ? RULES.megaScoreMultiplier : 1);
  }

  _collect(floors, count = 1) {
    const collected = { clock: 0, piggy: 0, multiplier: 0, cat: 0, seconds: 0, coins: 0, multiplierGain: 0 };
    for (const floor of floors) if (floor.type in collected) collected[floor.type]++;
    const loot = count * (this._power('blue') ? 2 : 1);
    collected.seconds = collected.clock * loot;
    collected.coins = collected.piggy * loot;
    collected.multiplierGain = collected.multiplier * loot;
    this.remaining += collected.seconds;
    this.coins += collected.coins;
    this.baseMultiplier += collected.multiplierGain;
    return collected;
  }

  _checkEnd() {
    if (this.phase !== 'playing' || this.mode === 'practice') return;
    if (this.remaining <= 0) this.resultReason = 'time';
    else if (Math.abs(this.tilt) >= 1) this.resultReason = 'tower';
    if (this.resultReason) this.phase = 'ended';
  }

  start() {
    if (this.phase === 'ready') this.phase = 'playing';
  }

  swipe(id, side) {
    if (this.phase !== 'playing' || (side !== 0 && side !== 1)) return null;
    const index = this.floors.findIndex(floor => floor.id === id);
    if (index < 0 || this.floors[index].type === 'concrete') return null;
    const floor = this.floors[index];
    const tier = TYPES[floor.type]?.tier;
    if (tier == null) return null;
    const monster = this.monsters[side];
    const good = tier > 0 || COLLECTIBLES.includes(floor.type) || floor.type === monster.color;
    const power = tier > 0;
    this.floors.splice(index, 1);
    this.feeds++;
    monster.anger = this.mega > 0 ? 0 : Math.max(0, Math.min(100, monster.anger + (good ? -RULES.goodCalm - Math.max(0, tier) * 4 : RULES.wrongAnger)));
    if (power) monster.power = Math.max(monster.power, RULES.powerSeconds[tier]);
    this._leanDirection = side ? 1 : -1;
    this.tilt += this._leanDirection * (good || this.mega > 0 ? 0.018 : 0.09 + Math.max(0, monster.anger - 70) / 1500);
    if (this._power('blue')) this.tilt *= 0.35;
    const collected = this._collect([floor]);
    this._refreshMultiplier();
    const points = good ? RULES.feedPoints * Math.max(1, tier * 2) * this.multiplier : 0;
    this.score += points;
    this._checkEnd();
    return { kind: 'feed', floor, side, good, power, points, collected };
  }

  resolveMatch(match) {
    if (this.phase !== 'playing' || !match) return null;
    const current = findMatch(this.floors);
    if (!current || current.type !== match.type || current.ids.length !== match.ids?.length || current.ids.some((id, i) => id !== match.ids[i])) return null;
    const { ids, type, result } = current;
    const consumed = new Set(ids);
    const firstIndex = this.floors.findIndex(floor => floor.id === ids[0]);
    const lastIndex = this.floors.findIndex(floor => floor.id === ids.at(-1));
    let lower = firstIndex;
    let upper = lastIndex;
    while (lower > 0 && COLLECTIBLES.includes(this.floors[lower - 1].type)) lower--;
    while (upper < this.floors.length - 1 && COLLECTIBLES.includes(this.floors[upper + 1].type)) upper++;
    const cleared = this.floors.filter((floor, i) => i >= lower && i <= upper && !consumed.has(floor.id) && COLLECTIBLES.includes(floor.type));
    const removed = new Set([...ids, ...cleared.map(floor => floor.id)]);
    // Reward count uses consumed floors; preserved metal bridges do not add loot.
    const collected = this._collect(this.floors.filter(floor => removed.has(floor.id)), removed.size);
    const insertAt = this.floors.slice(0, firstIndex).filter(floor => !removed.has(floor.id)).length;
    const mega = result === 'mega';
    const upgrades = (1 + collected.cat * RULES.catExtraUpgrades) * (this._power('green') ? 2 : 1);
    const created = mega ? [] : Array.from({ length: upgrades }, () => this._floor(result));
    this.chain = this._chainRemaining > 0 ? this.chain + 1 : 1;
    if (!mega && ids.length >= RULES.piggyMatchThreshold) created.push(this._floor('piggy'));
    if (!mega && this.chain >= RULES.clockChainThreshold) created.push(this._floor('clock'));
    this.floors = this.floors.filter(floor => !removed.has(floor.id));
    this.floors.splice(insertAt, 0, ...created);
    this.maxChain = Math.max(this.maxChain, this.chain);
    this._chainRemaining = RULES.chainSeconds;
    this.matches++;
    this.tilt *= 0.55;
    if (mega) {
      this.mega = RULES.megaSeconds;
      this.monsters.forEach(monster => { monster.anger = 0; monster.power = 0; });
    }
    this._refreshMultiplier();
    const points = ((RULES.points[TYPES[type].tier] ?? RULES.points[0]) * ids.length + cleared.length * 100) * this.multiplier;
    this.score += points;
    const tagged = [];
    if (COLORS.includes(type)) {
      this.monsters.forEach((monster, side) => {
        if (monster.color !== type) return;
        const choices = COLORS.filter(color => !this.monsters.some(other => other.color === color));
        const to = choices[Math.floor(this._random() * choices.length)];
        tagged.push({ side, from: monster.color, to });
        this.monsters[side] = { color: to, anger: Math.max(5, monster.anger * 0.35), power: 0 };
      });
    }
    this.monsters.forEach(monster => { monster.anger = Math.max(0, monster.anger - 5); });
    this._refreshMultiplier();
    this._checkEnd();
    return { kind: 'match', ids, created, type, result, points, chain: this.chain, tagged, mega, cleared, collected };
  }

  refill() {
    if (this.phase === 'ended') return [];
    const feeds = this.feeds - this._refillFeeds;
    this._dryFeeds = this.matches > this._refillMatches ? 0 : this._dryFeeds + Math.max(0, feeds);
    if (feeds > 0) this._naturalMatches = 0;
    this._refillFeeds = this.feeds;
    this._refillMatches = this.matches;
    const pacing = PACING[this.stage];
    let allowNatural = this.phase === 'playing' && this.feeds > 0 && this._naturalMatches === 0 && this._random() < pacing.natural;
    const added = [];
    while (this.floors.length < RULES.towerHeight) {
      const top = this.floors.findLast(floor => COLORS.includes(floor.type))?.type;
      const colors = COLORS.map(type => ({ type, weight: (type === top ? pacing.pair : 1) * (this.monsters.some(monster => monster.color === type) ? pacing.food : 1) }));
      const total = colors.reduce((sum, item) => sum + item.weight, 0);
      colors.forEach(item => { item.weight *= (1 - pacing.concrete - pacing.bronze - pacing.reward) / total; });
      const rewards = this.stage === 0 ? ['clock', 'piggy'] : ['clock', 'piggy', 'cat', 'multiplier'];
      let choices = [...colors, { type: 'bronze', weight: pacing.bronze }, ...rewards.map(type => ({ type, weight: pacing.reward / rewards.length }))];
      if (this.floors.filter(floor => floor.type === 'concrete').length < 2 + this.stage) choices.push({ type: 'concrete', weight: pacing.concrete });
      choices = choices.map(choice => {
        const trial = [...this.floors, { id: -1, type: choice.type }];
        // A pre-existing lower match must not conceal a new match at the top.
        const natural = trial.some((_, i) => findMatch(trial.slice(i))?.ids.includes(-1));
        return { ...choice, trial, natural };
      }).filter(choice => allowNatural || !choice.natural);
      // ponytail: four empty feeds trigger a local colour nudge, not a guaranteed solver.
      if (this._dryFeeds >= RESCUE_AFTER_FEEDS && !findMatch(this.floors) && !this.suggestMove()) {
        const helpful = choices.filter(choice => COLORS.includes(choice.type) && !choice.natural).map(choice => ({ ...choice, move: this._moves(choice.trial)[0] })).filter(choice => choice.move);
        if (helpful.length) {
          const best = Math.max(...helpful.map(choice => choice.move.rank));
          choices = helpful.filter(choice => choice.move.rank === best);
        }
      }
      let roll = this._random() * choices.reduce((sum, item) => sum + item.weight, 0);
      const choice = choices.find(item => (roll -= item.weight) < 0) ?? choices.at(-1);
      if (choice.natural) { this._naturalMatches++; allowNatural = false; }
      const floor = this._floor(choice.type);
      this.floors.push(floor);
      added.push(floor);
    }
    return added;
  }

  tick(dt) {
    if (this.phase !== 'playing' || !Number.isFinite(dt) || dt <= 0) return;
    // Split only at timed power boundaries so large frame gaps cannot stretch a power.
    let elapsed = dt;
    while (elapsed > 0 && this.phase === 'playing') {
      const boundaries = [elapsed, this.mega, ...this.monsters.map(monster => monster.power)].filter(value => value > 0);
      const step = Math.min(...boundaries);
      this.played += step;
      this.stage = PACING.findIndex(pacing => this.played < pacing.until);
      const red = this._power('red');
      const blue = this._power('blue');
      if (this.mode !== 'practice') this.remaining = Math.max(0, this.remaining - step * (red ? 0.45 : 1));
      this.monsters.forEach(monster => {
        monster.anger = this.mega > 0 ? 0 : Math.max(0, Math.min(100, monster.anger + step * (red ? -3 : RULES.angerPerSecond)));
        monster.power = Math.max(0, monster.power - step);
      });
      const rage = Math.max(0, Math.max(...this.monsters.map(monster => monster.anger)) - 75) / 25;
      if (blue) this.tilt *= Math.exp(-step * 3);
      else if (rage > 0) this.tilt += this._leanDirection * step * rage * 0.05;
      else this.tilt *= Math.exp(-step * 0.045);
      if (this.mode === 'practice') this.tilt = Math.max(-0.95, Math.min(0.95, this.tilt));
      this.mega = Math.max(0, this.mega - step);
      this._chainRemaining = Math.max(0, this._chainRemaining - step);
      if (this._chainRemaining === 0) this.chain = 0;
      elapsed -= step;
      this._checkEnd();
    }
    this._refreshMultiplier();
  }
}
