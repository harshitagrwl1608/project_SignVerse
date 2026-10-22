/* =====================================================================
   SignVerse — ISL SIGN CLIP DATA
   ---------------------------------------------------------------------
   This module contains NO rendering code. It converts a dictionary entry
   into a list of *poses* (plain numbers) that the renderer turns into
   Three.js animation clips (or into the 2D fallback frames).

   A pose describes, for one instant:
     • where the wrist has to be (avatar space, metres)
     • how the palm has to be oriented (absolute Euler, degrees)
     • the shape of each finger and the thumb
     • how strongly the handshape is "mixed" towards a second shape
       (used by signs such as TAKE or the classic snap in NO)

   Everything is derived from the dictionary entry, so every word gets
   its own motion: different handshape, different body location,
   different path, different repetition count and timing.
   ===================================================================== */

/* Finger joint angles (degrees) per handshape state.
   Index of the array = MCP / PIP / DIP bend. */
const ISL_FINGER_ANGLES = {
  0: { name: 'extended', angles: [0, 0, 0] },
  1: { name: 'curved', angles: [38, 55, 55] },
  2: { name: 'folded', angles: [78, 90, 90] }
};

/* Thumb: spread = abduction at the base, bend = flexion of the first
   joint, twist = rotation of the thumb towards the palm. */
const ISL_THUMB_ANGLES = {
  /* flex  = flexion of the thumb towards the palm (0 = straight out,
             90 = pointing forward, 180 = folded across the palm)
     raise = elevation of the thumb inside the palm plane
     twist = roll of the thumb (turns the pad towards the palm)        */
  side: { flex: 20, raise: -20, twist: 0 },
  front: { flex: 70, raise: 10, twist: 14 },
  folded: { flex: 160, raise: 22, twist: 8 },
  up: { flex: 20, raise: 80, twist: 0 },
  out: { flex: 6, raise: -12, twist: 0 },
  curve: { flex: 45, raise: 30, twist: 12 },
  o: { flex: 30, raise: 74, twist: 26 },
  oval: { flex: 30, raise: 74, twist: 26 },
  touch: { flex: 62, raise: 42, twist: 40 },
  touch_idx: { flex: 68, raise: 46, twist: 44 },
  between: { flex: 76, raise: 30, twist: 50 },
  between_if: { flex: 70, raise: 36, twist: 52 },
  under2: { flex: 80, raise: 26, twist: 48 },
  under3: { flex: 82, raise: 28, twist: 46 },
  under: { flex: 86, raise: 30, twist: 42 },
  point: { flex: 12, raise: 10, twist: 0 },
  point2: { flex: 22, raise: 16, twist: 8 }
};

/* Where the sign is performed. Positions are the target position of the
   RIGHT wrist in avatar space (metres, origin at the feet, +Z towards
   the viewer). Euler angles orient the right palm absolutely. */
const ISL_LOCATIONS = {
  forehead: { pos: [-0.112, 1.600, 0.120], euler: [16, 62, 0] },
  temple: { pos: [-0.150, 1.585, 0.060], euler: [12, 50, 0] },
  cheek: { pos: [-0.118, 1.520, 0.108], euler: [8, 72, 0] },
  chin: { pos: [-0.082, 1.462, 0.120], euler: [12, 58, 0] },
  mouth: { pos: [-0.058, 1.505, 0.128], euler: [16, 50, 0] },
  nose: { pos: [-0.068, 1.535, 0.138], euler: [18, 44, 0] },
  eye: { pos: [-0.082, 1.558, 0.118], euler: [16, 42, 0] },
  ear: { pos: [-0.168, 1.535, 0.012], euler: [6, 66, 0] },
  wrist: { pos: [-0.150, 1.005, 0.150], euler: [0, 96, 0] },
  upperarm: { pos: [-0.208, 1.185, 0.045], euler: [0, 104, 0] },
  shoulder: { pos: [-0.182, 1.318, 0.085], euler: [0, 96, 0] },
  chest: { pos: [-0.138, 1.285, 0.165], euler: [0, 140, 0] },
  neutral: { pos: [-0.168, 1.255, 0.225], euler: [0, 8, 0] },
  side: { pos: [-0.268, 1.215, 0.085], euler: [0, 22, 0] }
};

/* Movement scale: SVG-ish units -> metres. */
const ISL_MOVE_SCALE = 0.0017;

/* ---------------------------------------------------------------------
   PATH SAMPLING
   `u` runs from 0 to 1 across the whole movement of the sign.
   Returns offsets in the sign plane (dx right, dy up) plus an optional
   second handshape to morph into.
   --------------------------------------------------------------------- */
function islSamplePath(path, u) {
  const out = { dx: 0, dy: 0, dz: 0, rotZ: 0, hs2: null, mix: 0 };
  if (!path) return out;
  const dx = path.dx || 0;
  const dy = path.dy || 0;
  const r = path.r || 18;
  const ease = u * u * (3 - 2 * u); // smooth start/stop

  switch (path.t) {
    case 'arc':
      out.dx = dx * ease;
      out.dy = dy * ease - Math.sin(Math.PI * u) * Math.abs(dx) * 0.35;
      break;
    case 'forward':
      out.dz = 0.075 * ease;
      out.dy = dy * ease;
      break;
    case 'side':
      out.dx = dx * ease;
      break;
    case 'up':
      out.dy = dy * ease;
      break;
    case 'down':
      out.dy = dy * ease;
      break;
    case 'flip':
      out.dy = dy * ease;
      out.rotZ = (1 - ease) * 42;
      break;
    case 'chop':
      out.dy = dy * (u < 0.35 ? u / 0.35 : 1 - (u - 0.35) / 0.65 * 0.25);
      break;
    case 'wave':
      out.dx = Math.sin(Math.PI * 2 * 1.5 * u) * Math.abs(dx) * 0.5;
      break;
    case 'shake':
      out.dx = Math.sin(Math.PI * 2 * 3 * u) * Math.abs(dx) * 0.5;
      break;
    case 'wiggle':
      out.dx = Math.sin(Math.PI * 2 * 5 * u) * Math.abs(dx);
      out.dy = Math.cos(Math.PI * 2 * 5 * u) * 0.012;
      break;
    case 'tap':
      out.dy = -Math.abs(Math.sin(Math.PI * 2 * 2 * u)) * Math.abs(dy || 8);
      break;
    case 'nod':
      out.dy = Math.sin(Math.PI * 2 * u) * Math.abs(dy || 12) * 0.5;
      break;
    case 'snap':
      out.dy = -Math.abs(Math.sin(Math.PI * 2 * 1.5 * u)) * Math.abs(dy || 8);
      out.mix = u < 0.5 ? 0 : 1;
      out.hs2 = { f: [2, 2, 2, 2, 2], th: 'front' };
      break;
    case 'rock':
      out.dx = Math.sin(Math.PI * 2 * u) * Math.abs(dx || 10) * 0.5;
      out.dy = Math.cos(Math.PI * 2 * u) * Math.abs(dy || 6) * 0.5;
      break;
    case 'squeeze':
      out.dy = dy * ease;
      out.mix = ease;
      out.hs2 = { f: [2, 2, 2, 2, 2], th: 'front' };
      break;
    case 'circle':
      out.dx = Math.cos(Math.PI * 2 * u) * r;
      out.dy = Math.sin(Math.PI * 2 * u) * r;
      break;
    case 'open':
      out.dx = dx * ease;
      out.mix = 1 - ease;
      out.hs2 = { f: [0, 0, 0, 0, 0], th: 'out' };
      break;
    case 'in':
      out.dz = -0.06 * ease;
      out.dx = dx * ease;
      out.dy = dy * ease;
      break;
    case 'z':
      out.dx = (u < 0.5 ? (u / 0.5) : 1 - (u - 0.5) / 0.5) * Math.abs(dx);
      out.dy = (u < 0.5 ? 0 : (u - 0.5) / 0.5) * Math.abs(dy);
      break;
    case 'swap':
      out.dz = 0.05 * Math.sin(Math.PI * u);
      break;
    default:
      out.dx = dx * ease;
      out.dy = dy * ease;
  }
  return out;
}

/* Blend two handshape states (0..2 per finger). */
function islBlendFinger(a, b, t) {
  return a + (b - a) * t;
}

function islBlendThumb(a, b, t) {
  const A = ISL_THUMB_ANGLES[a] || ISL_THUMB_ANGLES.side;
  const B = ISL_THUMB_ANGLES[b] || A;
  return {
    spread: A.spread + (B.spread - A.spread) * t,
    bend: A.bend + (B.bend - A.bend) * t,
    twist: A.twist + (B.twist - A.twist) * t
  };
}

/**
 * Build the frame list for one sign.
 *
 * @param {object} entry  dictionary entry
 * @param {object} opts   { hold: seconds, transition: seconds, moveTime: seconds }
 * @returns {{duration:number, frames:Array}}
 */
function islBuildFrames(entry, opts) {
  const options = opts || {};
  const transition = options.transition != null ? options.transition : 0.24;
  const hold = options.hold != null ? options.hold : 0.28;
  const moveTime = options.moveTime != null ? options.moveTime : 0.52;
  const reps = Math.max(1, entry.reps || 1);

  const loc = ISL_LOCATIONS[entry.loc] || ISL_LOCATIONS.neutral;
  const twoHands = entry.hands === 'both';
  const base = entry.hs || { f: [0, 0, 0, 0, 0], th: 'out' };

  const frames = [];
  let t = 0;

  function pushFrame(time, rightPos, rightEuler, leftPos, leftEuler, f, th, mix, hs2) {
    const frame = { t: time, hands: {} };
    if (rightPos) {
      frame.hands.right = {
        pos: rightPos, euler: rightEuler, f: f, th: th, mix: mix || 0, hs2: hs2 || null
      };
    }
    if (leftPos) {
      frame.hands.left = {
        pos: leftPos, euler: leftEuler, f: f, th: th, mix: mix || 0, hs2: hs2 || null
      };
    }
    frames.push(frame);
  }

  /* ready pose: the hands rest in front of the chest, the way a signer
     holds them between signs — this also keeps the hand inside the frame
     while it travels to the sign position */
  const restRight = [-0.172, 1.215, 0.115];
  const restLeft = [0.172, 1.215, 0.115];
  const restEuler = [25, loc.euler[1], 0];

  /* 1 — transition from rest to the sign position */
  const transitionSteps = 8;
  for (let i = 0; i <= transitionSteps; i++) {
    const u = i / transitionSteps;
    const e = u * u * (3 - 2 * u);
    const rp = [
      restRight[0] + (loc.pos[0] - restRight[0]) * e,
      restRight[1] + (loc.pos[1] - restRight[1]) * e,
      restRight[2] + (loc.pos[2] - restRight[2]) * e
    ];
    const lp = twoHands ? [
      restLeft[0] - (loc.pos[0] - restRight[0]) * e,
      restLeft[1] + (loc.pos[1] - restRight[1]) * e,
      restLeft[2] + (loc.pos[2] - restRight[2]) * e
    ] : null;
    const re = [
      restEuler[0] + (loc.euler[0] - restEuler[0]) * e,
      restEuler[1] + (loc.euler[1] - restEuler[1]) * e,
      restEuler[2] + (loc.euler[2] - restEuler[2]) * e
    ];
    const le = twoHands ? [re[0], 180 - re[1], -re[2]] : null;
    pushFrame(t, rp, re, lp, le, base.f, base.th, 0, null);
    t += transition / transitionSteps;
  }

  /* 2 — hold at the sign position */
  pushFrame(t, loc.pos.slice(), loc.euler.slice(), twoHands ? [-loc.pos[0], loc.pos[1], loc.pos[2]] : null,
    twoHands ? [loc.euler[0], 180 - loc.euler[1], -loc.euler[2]] : null, base.f, base.th, 0, null);
  t += hold / 2;

  /* 3 — the movement itself */
  const path = entry.path;
  const moveSteps = Math.max(6, Math.round(reps * 9));
  for (let i = 1; i <= moveSteps; i++) {
    const u = i / moveSteps;
    const s = islSamplePath(path, u);
    const f = base.f.map(function (v, idx) {
      const target = (s.hs2 && s.hs2.f) ? s.hs2.f[idx] : v;
      return islBlendFinger(v, target, s.mix);
    });
    const th = s.hs2 && s.mix > 0.5 ? s.hs2.th : base.th;
    const rp = [
      loc.pos[0] - s.dx * ISL_MOVE_SCALE * (twoHands ? 0.35 : 1),
      loc.pos[1] - s.dy * ISL_MOVE_SCALE,
      loc.pos[2] + s.dz
    ];
    const lp = twoHands ? [-rp[0], rp[1], rp[2]] : null;
    const re = [loc.euler[0], loc.euler[1] + s.rotZ, loc.euler[2]];
    const le = twoHands ? [re[0], 180 - re[1], -re[2]] : null;
    pushFrame(t, rp, re, lp, le, f, th, s.mix, s.hs2);
    t += (moveTime * reps) / moveSteps;
  }

  /* 4 — settle back to the sign position and hold */
  const last = frames[frames.length - 1];
  const s = islSamplePath(path, 1);
  const endPos = [
    loc.pos[0] - s.dx * ISL_MOVE_SCALE * (twoHands ? 0.35 : 1),
    loc.pos[1] - s.dy * ISL_MOVE_SCALE,
    loc.pos[2] + s.dz
  ];
  pushFrame(t, endPos, [loc.euler[0], loc.euler[1] + s.rotZ, loc.euler[2]],
    twoHands ? [-endPos[0], endPos[1], endPos[2]] : null,
    twoHands ? [loc.euler[0], 180 - (loc.euler[1] + s.rotZ), -(loc.euler[2])] : null,
    base.f, base.th, 0, null);
  t += hold;

  frames[frames.length - 1].t = t;
  return { duration: t, frames: frames, rest: { right: restRight, left: restLeft } };
}

if (typeof window !== 'undefined') {
  window.ISLClips = {
    FINGER_ANGLES: ISL_FINGER_ANGLES,
    THUMB_ANGLES: ISL_THUMB_ANGLES,
    LOCATIONS: ISL_LOCATIONS,
    buildFrames: islBuildFrames,
    samplePath: islSamplePath
  };
}
