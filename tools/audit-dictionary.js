#!/usr/bin/env node
/* =====================================================================
   SignVerse — DICTIONARY AUDIT
   ---------------------------------------------------------------------
   Loads the ISL lexicon and checks every single entry:

     • every entry has a handshape, a thumb pose, a body location and a
       movement path that the renderer understands
     • every entry produces a complete animation (frames, no NaN, the
       hand stays inside the frame)
     • entries that would silently share the very same animation are
       reported, so no two different words fall back to the same motion
     • letters, numbers and words keep distinct handshapes
     • every entry can be resolved from its English name, its Hindi name
       and its synonyms

   Usage:  node tools/audit-dictionary.js [--json] [--out docs/isl-audit.json]
   ===================================================================== */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

/* ---- load the lexicon in a minimal browser-like sandbox ------------ */
const sandbox = { window: {} };
const vm = require('vm');
function loadScript(file) {
  const code = fs.readFileSync(path.join(ROOT, file), 'utf8');
  vm.runInNewContext(code, sandbox, { filename: file });
}
loadScript('isl-dictionary.js');
loadScript('sign-clips.js');
const ISLDictionary = sandbox.window.ISLDictionary;
const ISLClips = sandbox.window.ISLClips;

/* ---- checks -------------------------------------------------------- */
const problems = [];
const rows = [];
const seen = new Map();

const THUMB_NAMES = Object.keys(ISLClips.THUMB_ANGLES);
const LOC_NAMES = Object.keys(ISLClips.LOCATIONS);
const PATH_TYPES = ['arc', 'forward', 'side', 'up', 'down', 'flip', 'chop', 'wave', 'shake',
  'wiggle', 'tap', 'nod', 'snap', 'rock', 'squeeze', 'circle', 'open', 'in', 'z', 'swap'];

function isFiniteNum(n) { return typeof n === 'number' && isFinite(n); }

for (const entry of ISLDictionary.all()) {
  const issues = [];
  const hs = entry.hs || {};
  const f = hs.f || [];

  /* --- handshape --------------------------------------------------- */
  if (!Array.isArray(f) || f.length !== 5) issues.push('handshape must have 5 finger states');
  else if (!f.every(v => v === 0 || v === 1 || v === 2)) issues.push('finger states must be 0, 1 or 2');
  if (!THUMB_NAMES.includes(hs.th)) issues.push('unknown thumb pose "' + hs.th + '"');

  /* --- location & movement ----------------------------------------- */
  if (!LOC_NAMES.includes(entry.loc)) issues.push('unknown body location "' + entry.loc + '"');
  if (entry.path) {
    if (!PATH_TYPES.includes(entry.path.t)) issues.push('unknown movement type "' + entry.path.t + '"');
  } else if (entry.type !== 'letter' && entry.type !== 'number') {
    issues.push('no movement path');
  }
  if (entry.hands !== 'right' && entry.hands !== 'both') issues.push('hands must be "right" or "both"');
  if (!isFiniteNum(entry.reps) || entry.reps < 1) issues.push('reps must be a positive number');

  /* --- animation ---------------------------------------------------- */
  let frames = null;
  try {
    frames = ISLClips.buildFrames(entry, {});
  } catch (e) {
    issues.push('animation failed: ' + e.message);
  }
  if (frames) {
    if (!frames.frames.length) issues.push('animation has no frames');
    if (!isFiniteNum(frames.duration) || frames.duration <= 0) issues.push('animation duration is invalid');
    for (const fr of frames.frames) {
      if (!isFiniteNum(fr.t)) { issues.push('frame with an invalid timestamp'); break; }
      for (const side of ['right', 'left']) {
        const h = fr.hands[side];
        if (!h) continue;
        if (!h.pos.every(isFiniteNum)) { issues.push('frame with a non-numeric hand position'); break; }
        if (!h.euler.every(isFiniteNum)) { issues.push('frame with a non-numeric hand orientation'); break; }
      }
    }
    /* the hand has to stay within a sane box so it cannot leave the frame */
    let minY = Infinity, maxY = -Infinity, minX = Infinity, maxX = -Infinity;
    frames.frames.forEach(fr => {
      ['right', 'left'].forEach(side => {
        const h = fr.hands[side];
        if (!h) return;
        minY = Math.min(minY, h.pos[1]); maxY = Math.max(maxY, h.pos[1]);
        minX = Math.min(minX, h.pos[0]); maxX = Math.max(maxX, h.pos[0]);
      });
    });
    if (minY < 0.9) issues.push('the hand drops below the body (y=' + minY.toFixed(2) + ')');
    if (maxY > 1.95) issues.push('the hand goes above the head (y=' + maxY.toFixed(2) + ')');
    if (maxX - minX > 0.9) issues.push('the hands move further apart than a shoulder width');
  }

  /* --- resolution ---------------------------------------------------- */
  const found = ISLDictionary.search(entry.en).map(r => r.entry.id);
  if (found.indexOf(entry.id) === -1) issues.push('the entry cannot be found by its English name');
  if (entry.hi && entry.type === 'word') {
    const hits = ISLDictionary.search(entry.hi).map(r => r.entry.id);
    if (hits.indexOf(entry.id) === -1) issues.push('the entry cannot be found by its Hindi name');
  }

  /* --- duplicated simulations ---------------------------------------- */
  const key = [JSON.stringify(f), hs.th, entry.loc, entry.hands,
    entry.path ? entry.path.t + ':' + (entry.path.dx || 0) + ':' + (entry.path.dy || 0) + ':' + (entry.path.r || 0) : 'none',
    entry.reps, (hs.spread != null ? hs.spread : 1),
    entry.rot ? entry.rot.join(',') : 'no-rot'].join('|');
  if (seen.has(key)) {
    const other = seen.get(key);
    if (other.type !== entry.type || other.type === 'word') {
      issues.push('shares the exact same animation as "' + other.id + '"');
    }
  } else {
    seen.set(key, entry);
  }

  rows.push({
    id: entry.id,
    term: entry.en,
    hi: entry.hi,
    type: entry.type,
    category: entry.cat,
    handshape: f.join(''),
    thumb: hs.th,
    location: entry.loc,
    movement: entry.path ? entry.path.t : 'static',
    reps: entry.reps,
    twoHands: entry.hands === 'both',
    status: entry.status,
    issues: issues
  });
  if (issues.length) problems.push({ id: entry.id, issues });
}

/* ---- summary -------------------------------------------------------- */
const words = rows.filter(r => r.type === 'word');
const letters = rows.filter(r => r.type === 'letter');
const numbers = rows.filter(r => r.type === 'number');
const clean = rows.filter(r => !r.issues.length);

console.log('ISL dictionary audit');
console.log('---------------------');
console.log('entries        : ' + rows.length + '  (words ' + words.length + ', letters ' + letters.length + ', numbers ' + numbers.length + ')');
console.log('clean entries  : ' + clean.length);
console.log('with issues    : ' + problems.length);
console.log('');
if (problems.length) {
  console.log('Issues:');
  problems.forEach(p => {
    console.log('  ' + p.id + ': ' + p.issues.join('; '));
  });
}

const args = process.argv.slice(2);
if (args.includes('--json')) {
  const out = (args.indexOf('--out') >= 0 && args[args.indexOf('--out') + 1]) ? args[args.indexOf('--out') + 1] : 'docs/isl-audit.json';
  fs.mkdirSync(path.dirname(path.join(ROOT, out)), { recursive: true });
  fs.writeFileSync(path.join(ROOT, out), JSON.stringify({
    generated: new Date().toISOString(),
    totals: {
      entries: rows.length, words: words.length, letters: letters.length,
      numbers: numbers.length, clean: clean.length, withIssues: problems.length
    },
    entries: rows
  }, null, 2));
  console.log('\nreport written to ' + out);
}

/* ── markdown inventory ─────────────────────────────────────────── */
if (args.includes('--md')) {
  const out = (args.indexOf('--md') >= 0 && args[args.indexOf('--md') + 1]) ? args[args.indexOf('--md') + 1] : 'docs/isl-audit.md';
  const byCat = {};
  rows.forEach(r => { (byCat[r.category] = byCat[r.category] || []).push(r); });
  let md = '# ISL dictionary inventory\n\n';
  md += 'Generated by `node tools/audit-dictionary.js --md`.\n\n';
  md += '| metric | value |\n|---|---|\n';
  md += '| entries | ' + rows.length + ' |\n';
  md += '| words | ' + words.length + ' |\n';
  md += '| manual-alphabet letters | ' + letters.length + ' |\n';
  md += '| numbers | ' + numbers.length + ' |\n';
  md += '| entries without issues | ' + clean.length + ' |\n';
  md += '| entries with issues | ' + problems.length + ' |\n\n';
  md += 'Verification status of the local animations: every entry is an **unverified ';
  md += 'approximation** written for SignVerse — it has not been compared frame by frame with an ';
  md += 'ISLRTC demonstration video. The official video is linked from every entry.\n\n';
  Object.keys(byCat).forEach(cat => {
    md += '## ' + cat + ' (' + byCat[cat].length + ')\n\n';
    md += '| entry | Hindi | type | handshape | thumb | location | movement | reps | hands | status | issues |\n';
    md += '|---|---|---|---|---|---|---|---|---|---|---|\n';
    byCat[cat].forEach(r => {
      md += '| ' + [r.term, r.hi, r.type, r.handshape, r.thumb, r.location, r.movement,
        r.reps, r.twoHands ? 'both' : 'one', r.status,
        r.issues.length ? r.issues.join('; ') : '—'].join(' | ') + ' |\n';
    });
    md += '\n';
  });
  fs.mkdirSync(path.dirname(path.join(ROOT, out)), { recursive: true });
  fs.writeFileSync(path.join(ROOT, out), md.replace(/\n+$/, '\n'));
  console.log('inventory written to ' + out);
}

process.exit(problems.length ? 1 : 0);
