/* =====================================================================
   SignVerse — MULTI-VIEW 2D SIGN RENDERER
   ---------------------------------------------------------------------
   The signer is modelled in 3D (head, torso, arms, hands with five
   articulated fingers) and projected onto the SVG stage, so the same
   simulation can be shown from four real viewpoints:

     front · back · left profile · right profile

   The views are genuine rotations of the same model — the back view is
   not a mirrored front view — and the hand shape, arm, body and movement
   stay consistent between them because they are all derived from the
   same frame data (isl-dictionary.js → sign-clips.js).

   Everything is plain SVG: no WebGL, no external assets.
   ===================================================================== */

const SignRenderer = (function () {
  const NS = 'http://www.w3.org/2000/svg';

  /* ── view definitions ───────────────────────────────────────── */
  const VIEWS = {
    front: { id: 'front', label: 'Front', yaw: 0, hint: 'Frontal view of the signer' },
    back: { id: 'back', label: 'Back', yaw: 180, hint: 'View from behind the signer' },
    left: { id: 'left', label: 'Left', yaw: 90, hint: 'Left side profile of the signer' },
    right: { id: 'right', label: 'Right', yaw: -90, hint: 'Right side profile of the signer' }
  };
  const VIEW_ORDER = ['front', 'back', 'left', 'right'];

  /* ── body metrics (metres, avatar space) ────────────────────── */
  const SHOULDER = { R: [-0.163, 1.335, 0], L: [0.163, 1.335, 0] };
  const L_UPPER = 0.255;
  const L_FORE = 0.245;
  const HEAD_Y = 1.545;
  const HEAD_R = 0.094;
  const TORSO = { x: 0, y: 1.150, z: 0, rx: 0.146, ry: 0.215, rz: 0.098 };

  /* finger definitions: base position (local), segment lengths, radius */
  const FINGERS = [
    { name: 'index', base: [-0.030, 0.070], len: [0.040, 0.029, 0.021], radius: 0.0098 },
    { name: 'middle', base: [-0.010, 0.076], len: [0.045, 0.033, 0.023], radius: 0.0102 },
    { name: 'ring', base: [0.010, 0.072], len: [0.041, 0.031, 0.022], radius: 0.0098 },
    { name: 'pinky', base: [0.030, 0.059], len: [0.032, 0.023, 0.018], radius: 0.0086 }
  ];
  const THUMB = { base: [-0.042, 0.026], len: [0.031, 0.025], radius: 0.0108 };
  const PALM_W = 0.037;
  const PALM_LEN = 0.092;
  const PALM_T = 0.014;

  const COLORS = {
    skin: '#E8A87C', skinDark: '#D08055', skinLight: '#F3C3A0',
    shirt: '#2F9E8F', shirtDark: '#268075', shirtLight: '#3FB6A6',
    hair: '#262A35', eye: '#1B2432', lip: '#B4615C',
    outline: 'rgba(120,60,30,0.45)', bg: 'none'
  };

  /* joint colours (kept in sync with the legend in the UI) */
  const JOINT = {
    mcp: '#22C55E', pip: '#3B82F6', dip: '#A855F7', tip: '#EF4444', thumb: '#F97316'
  };

  /* ── tiny vector helpers (plain arrays, no dependencies) ────── */
  function v(x, y, z) { return { x: x, y: y, z: z }; }
  function add(a, b) { return v(a.x + b.x, a.y + b.y, a.z + b.z); }
  function sub(a, b) { return v(a.x - b.x, a.y - b.y, a.z - b.z); }
  function mul(a, s) { return v(a.x * s, a.y * s, a.z * s); }
  function dot(a, b) { return a.x * b.x + a.y * b.y + a.z * b.z; }
  function cross(a, b) {
    return v(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
  }
  function len(a) { return Math.sqrt(dot(a, a)) || 1e-6; }
  function norm(a) { const l = len(a); return v(a.x / l, a.y / l, a.z / l); }
  function rotX(p, ang) {
    const c = Math.cos(ang), s = Math.sin(ang);
    return v(p.x, p.y * c - p.z * s, p.y * s + p.z * c);
  }
  function rotY(p, ang) {
    const c = Math.cos(ang), s = Math.sin(ang);
    return v(p.x * c + p.z * s, p.y, -p.x * s + p.z * c);
  }
  function rotZ(p, ang) {
    const c = Math.cos(ang), s = Math.sin(ang);
    return v(p.x * c - p.y * s, p.x * s + p.y * c, p.z);
  }
  const DEG = Math.PI / 180;

  /** Apply an XYZ Euler rotation (degrees) to a vector. */
  function applyEuler(p, e) {
    let q = rotZ(p, e[2] * DEG);
    q = rotY(q, e[1] * DEG);
    q = rotX(q, e[0] * DEG);
    return q;
  }

  /* ── SVG helper ─────────────────────────────────────────────── */
  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function ptStr(p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }

  /* ── camera ─────────────────────────────────────────────────── */
  function makeCamera(yaw, focus, dist, vw, vh, fovDeg, mirror) {
    const a = yaw * DEG;
    const dir = v(Math.sin(a), 0, Math.cos(a));
    const cam = v(focus.x + dir.x * dist, focus.y + 0.02, focus.z + dir.z * dist);
    const fwd = norm(sub(focus, cam));
    let right = cross(fwd, v(0, 1, 0));
    if (len(right) < 1e-5) right = v(1, 0, 0);
    right = norm(right);
    if (mirror) right = mul(right, -1);
    const up = cross(right, fwd);
    const focal = (vh / 2) / Math.tan((fovDeg || 32) * DEG / 2);
    return { cam: cam, fwd: fwd, right: right, up: up, focal: focal, cx: vw / 2, cy: vh / 2, dist: dist };
  }
  /** Orthographic projection — used for outlines that must not spiral. */
  function projectOrtho(cam, p, scale) {
    const rel = sub(p, cam.cam);
    const x = dot(rel, cam.right);
    const y = dot(rel, cam.up);
    return { x: cam.cx + x * scale, y: cam.cy - y * scale, z: 0 };
  }

  function project(cam, p) {
    const rel = sub(p, cam.cam);
    const x = dot(rel, cam.right);
    const y = dot(rel, cam.up);
    const z = dot(rel, cam.fwd);
    const k = cam.focal / Math.max(z, 0.05);
    return { x: cam.cx + x * k, y: cam.cy - y * k, z: z };
  }
  function depth(cam, p) { return dot(sub(p, cam.cam), cam.fwd); }

  /* ── geometry builders ──────────────────────────────────────── */
  /**
   * Tapered limb segment. Both ends use the same side vector, so the quad
   * never twists and the joint stays closed.
   */
  function bonePath(a, b, r1, r2, ref) {
    const dir = norm(sub(b, a));
    let side = cross(dir, ref || v(0, 0, 1));
    if (len(side) < 1e-5) side = cross(dir, v(0, 1, 0));
    if (len(side) < 1e-5) side = v(1, 0, 0);
    side = norm(side);
    return [add(a, mul(side, r1)), add(a, mul(side, -r1)), add(b, mul(side, -r2)), add(b, mul(side, r2))];
  }

  /**
   * Outline of a joint chain (a finger or a thumb): one continuous tapered
   * shape instead of separate segments, so the joints never show a gap.
   */
  function chainOutline(points, radii, normal) {
    const left = [], right = [];
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      const b = points[Math.min(i + 1, points.length - 1)];
      const dir = norm(sub(b, a));
      if (len(sub(b, a)) < 1e-6) dir.copy ? dir.copy(a) : null;
      let side = cross(dir, normal);
      if (len(side) < 1e-5) side = v(1, 0, 0);
      side = norm(side);
      left.push(add(a, mul(side, radii[i])));
      right.push(add(a, mul(side, -radii[i])));
    }
    return left.concat(right.reverse());
  }

  /** Axis aligned box in the hand's local frame → world corners. */
  function boxCorners(origin, ax, ay, az, w, h, t) {
    const out = [];
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (c) {
      out.push(add(origin, add(mul(ax, c[0] * w), add(mul(ay, c[1] * h), mul(az, -t)))));
    });
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (c) {
      out.push(add(origin, add(mul(ax, c[0] * w), add(mul(ay, c[1] * h), mul(az, t)))));
    });
    return out;
  }

  /** Circle in 3D → projected polygon. */
  function circlePoints(centre, r, axisU, axisV, steps) {
    const pts = [];
    for (let i = 0; i < (steps || 20); i++) {
      const t = (i / (steps || 20)) * Math.PI * 2;
      const p = add(centre, add(mul(axisU, Math.cos(t) * r), mul(axisV, Math.sin(t) * r)));
      pts.push(p);
    }
    return pts;
  }

  /* ── the hand ───────────────────────────────────────────────── */
  /**
   * Build the 3D joints of one hand.
   * @param {object} frame  one frame from ISLClips.buildFrames
   * @param {string} side    'right' | 'left'
   */
  function buildHand(frame, side) {
    const h = frame.hands[side === 'right' ? 'right' : 'left'];
    if (!h) return null;
    const mirror = side === 'left' ? -1 : 1;
    const W = v(h.pos[0], h.pos[1], h.pos[2]);
    /* hand basis: X = across the palm, Y = along the fingers, Z = palm normal.
       The clip builder provides it as a matrix (it composes the body
       location with the entry's own rotation); the euler is the fallback. */
    const basis = h.basis ? {
      X: v(h.basis.x[0], h.basis.x[1], h.basis.x[2]),
      Y: v(h.basis.y[0], h.basis.y[1], h.basis.y[2]),
      Z: v(h.basis.z[0], h.basis.z[1], h.basis.z[2])
    } : {
      X: applyEuler(v(1, 0, 0), h.euler),
      Y: applyEuler(v(0, 1, 0), h.euler),
      Z: applyEuler(v(0, 0, 1), h.euler)
    };
    const spread = (frame.spread != null) ? frame.spread : 1;
    const toWorld = function (lx, ly, lz) {
      return add(W, add(mul(basis.X, lx * mirror), add(mul(basis.Y, ly), mul(basis.Z, lz))));
    };

    const f = h.f || [0, 0, 0, 0, 0];
    const fingers = [];
    for (let i = 0; i < 4; i++) {
      const spec = FINGERS[i];
      const state = Math.max(0, Math.min(2, f[i + 1] !== undefined ? f[i + 1] : 0));
      const ang = ISLClips.FINGER_ANGLES[state].angles;
      const base = toWorld(spec.base[0] * spread, spec.base[1], 0);
      let dir = basis.Y;
      const joints = [base];
      for (let s = 0; s < 3; s++) {
        dir = norm(rotX(dir, -ang[s] * DEG));   /* curl towards the palm */
        const next = add(joints[joints.length - 1], mul(dir, spec.len[s]));
        joints.push(next);
      }
      fingers.push({
        name: spec.name,
        joints: joints,
        radius: spec.radius,
        angles: ang
      });
    }

    /* thumb: base direction from flex / raise, then its own curl */
    const t = ISLClips.THUMB_ANGLES[h.th] || ISLClips.THUMB_ANGLES.side;
    let tDir = rotY(rotZ(v(-1, 0, 0), -t.raise * DEG), t.flex * DEG);
    /* express it in the hand's local frame, then transform */
    tDir = toWorldDir(tDir, basis, mirror);
    const tBase = toWorld(THUMB.base[0], THUMB.base[1], 0);
    const tJoints = [tBase];
    const t1 = add(tBase, mul(tDir, THUMB.len[0]));
    tJoints.push(t1);
    const t2 = add(t1, mul(norm(rotX(tDir, -38 * DEG)), THUMB.len[1]));
    tJoints.push(t2);

    /* palm: a solid slab so it has volume from every angle */
    const palmCorners = boxCorners(
      toWorld(0, PALM_LEN / 2, 0),
      basis.X, basis.Y, basis.Z,
      PALM_W, PALM_LEN / 2, PALM_T
    );

    return {
      side: side, wrist: W, basis: basis, mirror: mirror,
      fingers: fingers, thumb: { joints: tJoints, radius: THUMB.radius },
      palm: palmCorners, normal: basis.Z
    };
  }

  /** Transform a local direction into the hand's world frame. */
  function toWorldDir(local, basis, mirror) {
    return add(mul(basis.X, local.x * mirror), add(mul(basis.Y, local.y), mul(basis.Z, local.z)));
  }

  /* ── the arm ────────────────────────────────────────────────── */
  function buildArm(hand) {
    const side = hand.side;
    const O = v(SHOULDER[side === 'right' ? 'R' : 'L'][0], SHOULDER[side === 'right' ? 'R' : 'L'][1], 0);
    const T = hand.wrist;
    const delta = sub(T, O);
    let D = len(delta);
    const maxReach = (L_UPPER + L_FORE) * 0.995;
    D = Math.min(Math.max(D, 0.05), maxReach);
    const dir = norm(delta);
    const a = (L_UPPER * L_UPPER - L_FORE * L_FORE + D * D) / (2 * D);
    const h = Math.sqrt(Math.max(0, L_UPPER * L_UPPER - a * a));
    const centre = add(O, mul(dir, a));
    /* preferred elbow: down, slightly out and back */
    const preferred = side === 'right' ? norm(v(-0.62, -1, -0.18)) : norm(v(0.62, -1, -0.18));
    let p1 = cross(dir, preferred);
    if (len(p1) < 1e-6) p1 = v(1, 0, 0);
    p1 = norm(p1);
    const p2 = norm(cross(dir, p1));
    const proj = preferred;
    const elbow = add(centre, add(mul(p1, h * dot(proj, p1)), mul(p2, h * dot(proj, p2))));
    return { shoulder: O, elbow: elbow, wrist: T };
  }

  /* ── body ───────────────────────────────────────────────────── */
  /* The body parts are ellipsoids: their silhouette is an ellipse from
     every viewing direction, which keeps the front, back and side views
     consistent with each other. */
  const HEAD_RADII = { x: 0.088, y: 0.103, z: 0.094 };
  const NECK_RADII = { x: 0.036, y: 0.048, z: 0.036 };

  function ellipsoidPoint(centre, radii, phi, theta) {
    const s = Math.sin(phi);
    return v(
      centre.x + radii.x * s * Math.cos(theta),
      centre.y + radii.y * Math.cos(phi),
      centre.z + radii.z * s * Math.sin(theta)
    );
  }

  /** Bounding ellipse of an ellipsoid as seen by the camera. */
  function silhouette(cam, centre, radii, rings, sectors) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let i = 0; i <= (rings || 12); i++) {
      const phi = Math.PI * i / (rings || 12);
      for (let j = 0; j < (sectors || 20); j++) {
        const theta = 2 * Math.PI * j / (sectors || 20);
        const p = project(cam, ellipsoidPoint(centre, radii, phi, theta));
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      }
    }
    return { cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, rx: (maxX - minX) / 2, ry: (maxY - minY) / 2 };
  }

  /**
   * Hair outline on the head: the crown is covered everywhere, the back of
   * the head is covered as well. The boundary is a smooth curve over the
   * azimuth, so it stays correct in every view.
   */
  function hairOutline(centre, radii, includeBack) {
    const pts = [];
    const steps = 40;
    pts.push(ellipsoidPoint(centre, radii, 0, 0));   /* the crown */
    for (let i = 0; i <= steps; i++) {
      const theta = 2 * Math.PI * i / steps;
      /* the back of the head is at −Z, i.e. around theta = −90° */
      let d = Math.abs(((theta + Math.PI / 2) % (2 * Math.PI)) - 0);
      d = Math.min(d, 2 * Math.PI - d);
      const back = includeBack ? Math.max(0, 1 - d / (Math.PI * 0.55)) : 0;
      const phiMax = (74 + back * 56) * DEG;
      pts.push(ellipsoidPoint(centre, radii, phiMax, theta));
    }
    return pts;
  }

  /* ── the main render ────────────────────────────────────────── */
  /**
   * Render one sign.
   * @param {SVGElement} svg
   * @param {object} entry   lexicon entry (or a legacy shape)
   * @param {object} opts    { view, progress, frames }
   */
  function render(svg, entry, opts) {
    const options = opts || {};
    const view = VIEWS[options.view] || VIEWS.front;
    if (!svg) return;
    svg.innerHTML = '';

    const frames = options.frames || (window.ISLClips ? ISLClips.buildFrames(toClipEntry(entry), {}) : null);
    if (!frames || !frames.frames.length) return;

    /* pick the frame for the requested progress */
    let frame = frames.frames[frames.frames.length - 1];
    if (options.progress != null) {
      const p = Math.max(0, Math.min(1, options.progress));
      const total = frames.duration || 1;
      const t = p * total;
      for (let i = 0; i < frames.frames.length; i++) {
        if (frames.frames[i].t <= t) frame = frames.frames[i];
        else break;
      }
    }

    const hands = [];
    if (frame.hands.right) hands.push(buildHand(frame, 'right'));
    if (frame.hands.left) hands.push(buildHand(frame, 'left'));

    /* ── framing: fit the head and the hands into the view ────── */
    let minX = -0.20, maxX = 0.20, minY = HEAD_Y - 0.16, maxY = HEAD_Y + 0.14;
    hands.forEach(function (h) {
      minX = Math.min(minX, h.wrist.x - 0.10);
      maxX = Math.max(maxX, h.wrist.x + 0.10);
      minY = Math.min(minY, h.wrist.y - 0.10);
      maxY = Math.max(maxY, h.wrist.y + 0.17);
    });
    const focus = v((minX + maxX) / 2, (minY + maxY) / 2, 0.04);
    /* the stage can be any shape — the SVG view box follows the element so
       the simulation always fills the space it is shown in */
    const vw = Math.max(svg.clientWidth || 0, 240);
    const vh = Math.max(svg.clientHeight || 0, 200);
    svg.setAttribute('viewBox', '0 0 ' + vw + ' ' + vh);
    const aspect = vw / vh;
    const halfH = (maxY - minY) / 2 * 1.18;
    const halfW = (maxX - minX) / 2 * 1.18;
    const fov = 32;
    const tanHalf = Math.tan(fov * DEG / 2);
    let dist = Math.max(halfH / tanHalf, (halfW / aspect) / tanHalf);
    dist = Math.min(Math.max(dist, 0.85), 2.1);
    const cam = makeCamera(view.yaw, focus, dist, vw, vh, fov, options.mirror);

    const items = [];

    /* ── torso + neck + head ─────────────────────────────────── */
    items.push({ z: depth(cam, v(TORSO.x, TORSO.y, TORSO.z)), kind: 'torso' });
    items.push({ z: depth(cam, v(0, 1.430, 0)), kind: 'neck' });
    items.push({ z: depth(cam, v(0, HEAD_Y, 0)), kind: 'head' });

    /* ── arms + hands ────────────────────────────────────────── */
    hands.forEach(function (h) {
      const arm = buildArm(h);
      items.push({ z: depth(cam, arm.elbow) - 0.02, kind: 'arm', arm: arm, hand: h });
    });

    items.sort(function (a, b) { return b.z - a.z; });

    const g = el('g', {}, svg);
    items.forEach(function (it) {
      if (it.kind === 'torso') drawTorso(g, cam);
      else if (it.kind === 'neck') drawNeck(g, cam);
      else if (it.kind === 'head') drawHead(g, cam, view);
      else if (it.kind === 'arm') drawArm(g, cam, it.arm, it.hand, view);
    });
  }

  /* ── drawing ────────────────────────────────────────────────── */
  function poly(g, pts3, cam, attrs) {
    const pts = pts3.map(function (p) { return project(cam, p); });
    const d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1); }).join(' ');
    return el('path', Object.assign({ d: d + ' Z' }, attrs || {}), g);
  }

  function drawTorso(g, cam) {
    const s = silhouette(cam, v(TORSO.x, TORSO.y, TORSO.z), { x: TORSO.rx, y: TORSO.ry, z: TORSO.rz }, 12, 22);
    el('ellipse', {
      cx: s.cx.toFixed(1), cy: s.cy.toFixed(1), rx: s.rx.toFixed(1), ry: s.ry.toFixed(1),
      fill: COLORS.shirt, stroke: COLORS.outline, 'stroke-width': 1.2
    }, g);
    /* shoulder line */
    const sl = project(cam, v(SHOULDER.L[0], SHOULDER.L[1], 0));
    const sr = project(cam, v(SHOULDER.R[0], SHOULDER.R[1], 0));
    el('path', {
      d: 'M' + sr.x.toFixed(1) + ' ' + sr.y.toFixed(1) + ' L' + sl.x.toFixed(1) + ' ' + sl.y.toFixed(1),
      stroke: COLORS.shirtDark, 'stroke-width': 3, 'stroke-linecap': 'round', fill: 'none', opacity: 0.55
    }, g);
  }

  function drawNeck(g, cam) {
    const s = silhouette(cam, v(0, 1.430, 0), NECK_RADII, 8, 14);
    el('ellipse', {
      cx: s.cx.toFixed(1), cy: s.cy.toFixed(1), rx: s.rx.toFixed(1), ry: s.ry.toFixed(1),
      fill: COLORS.skin, stroke: 'none'
    }, g);
  }

  /** Point on a projected ellipse. */
  function ellipsePoint(s, t) {
    return { x: s.cx + s.rx * Math.cos(t), y: s.cy + s.ry * Math.sin(t) };
  }

  /**
   * The face is cut out of the head silhouette: in the frontal view it is
   * the lower part below the hair line, in the profile the front part.
   * That keeps the hair a clean shape in every view.
   */
  function faceShape(cam, view, s) {
    if (view.id === 'back') return null;
    const angleOf = function (p) {
      return Math.atan2((p.y - s.cy) / (s.ry || 1), (p.x - s.cx) / (s.rx || 1));
    };
    const norm = Math.PI * 2;
    const forward = function (from, delta, steps) {
      const pts = [];
      for (let i = 0; i <= steps; i++) pts.push(ellipsePoint(s, from + delta * i / steps));
      return pts;
    };
    /* the arc from → to that passes through the given angle */
    const arc = function (from, to, through) {
      const delta = ((to - from) % norm + norm) % norm;
      const steps = 24;
      if (through === undefined) return forward(from, delta, 30);
      const toThrough = ((through - from) % norm + norm) % norm;
      if (toThrough <= delta) return forward(from, delta, steps * 2);
      /* go the other way round */
      const back = forward(from, -(norm - toThrough), steps);
      const rest = ((through - to) % norm + norm) % norm;
      return back.concat(forward(through, -rest, steps));
    };
    if (view.id === 'front') {
      const l = project(cam, v(-0.084, HEAD_Y + 0.024, 0));
      const r = project(cam, v(0.084, HEAD_Y + 0.024, 0));
      const tl = angleOf(l), tr = angleOf(r);
      /* the arc below the hair line (through the chin) */
      const pts = arc(tl, tr, Math.PI / 2);
      pts.push({ x: l.x, y: l.y }, { x: r.x, y: r.y });
      return pts;
    }
    /* profile: the front half of the head */
    const top = project(cam, v(0, HEAD_Y + HEAD_RADII.y, 0));
    const bottom = project(cam, v(0, HEAD_Y - HEAD_RADII.y, 0));
    const tt = angleOf(top), tb = angleOf(bottom);
    const front = view.id === 'left' ? Math.PI : 0;   /* screen side of the face */
    const pts = arc(tt, tb, front);
    pts.push({ x: top.x, y: top.y }, { x: bottom.x, y: bottom.y });
    return pts;
  }

  function drawHead(g, cam, view) {
    const centre = v(0, HEAD_Y, 0);
    const s = silhouette(cam, centre, HEAD_RADII, 12, 22);

    /* the whole head is drawn as hair, the face is placed on top of it —
       that way the crown reads as hair from every direction */
    el('ellipse', {
      cx: s.cx.toFixed(1), cy: (s.cy - s.ry * 0.02).toFixed(1),
      rx: (s.rx * 1.03).toFixed(1), ry: (s.ry * 1.03).toFixed(1),
      fill: COLORS.hair, stroke: COLORS.outline, 'stroke-width': 1.2
    }, g);

    const face = faceShape(cam, view, s);
    if (face) {
      el('path', {
        d: face.map(function (p, i) { return (i ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1); }).join(' ') + ' Z',
        fill: COLORS.skin, stroke: 'none'
      }, g);
    }

    if (view.id === 'front') {
      [[-0.029, -0.004], [0.029, -0.004]].forEach(function (e) {
        const p = project(cam, v(e[0], HEAD_Y + e[1], HEAD_R * 0.92));
        el('circle', { cx: p.x.toFixed(1), cy: p.y.toFixed(1), r: 5.2, fill: '#fff', stroke: 'rgba(40,40,60,0.35)', 'stroke-width': 1 }, g);
        const q = project(cam, v(e[0], HEAD_Y + e[1], HEAD_R * 1.0));
        el('circle', { cx: q.x.toFixed(1), cy: q.y.toFixed(1), r: 2.5, fill: COLORS.eye }, g);
      });
      [[-0.029, 0.024], [0.029, 0.024]].forEach(function (e) {
        const p = project(cam, v(e[0], HEAD_Y + e[1], HEAD_R * 0.90));
        el('path', {
          d: 'M' + (p.x - 7).toFixed(1) + ' ' + p.y.toFixed(1) + ' q 7 -3.5 14 0',
          stroke: COLORS.hair, 'stroke-width': 2.4, fill: 'none', 'stroke-linecap': 'round'
        }, g);
      });
      const mouth = project(cam, v(0, HEAD_Y - 0.058, HEAD_R * 0.88));
      el('path', {
        d: 'M' + (mouth.x - 7).toFixed(1) + ' ' + mouth.y.toFixed(1) + ' q 7 5 14 0',
        stroke: COLORS.lip, 'stroke-width': 2.4, fill: 'none', 'stroke-linecap': 'round'
      }, g);
    } else if (view.id === 'left' || view.id === 'right') {
      /* the profile: a small nose and a mouth so the direction is clear */
      const nose = project(cam, v(0, HEAD_Y - 0.010, HEAD_R * 0.99));
      const nose2 = project(cam, v(0, HEAD_Y - 0.026, HEAD_R * 0.80));
      el('path', {
        d: 'M' + nose.x.toFixed(1) + ' ' + nose.y.toFixed(1) + ' L' + nose2.x.toFixed(1) + ' ' + nose2.y.toFixed(1),
        stroke: COLORS.skinDark, 'stroke-width': 2.6, 'stroke-linecap': 'round', fill: 'none'
      }, g);
      const mouth = project(cam, v(0, HEAD_Y - 0.058, HEAD_R * 0.86));
      el('path', {
        d: 'M' + (mouth.x - 6).toFixed(1) + ' ' + mouth.y.toFixed(1) + ' q 6 4 12 0',
        stroke: COLORS.lip, 'stroke-width': 2.2, fill: 'none', 'stroke-linecap': 'round'
      }, g);
      /* the ear */
      const ear = project(cam, v(view.id === 'left' ? 0.055 : -0.055, HEAD_Y - 0.005, -0.02));
      el('ellipse', {
        cx: ear.x.toFixed(1), cy: ear.y.toFixed(1), rx: 4.5, ry: 6,
        fill: COLORS.skin, stroke: COLORS.skinDark, 'stroke-width': 1
      }, g);
    }
  }

  function drawArm(g, cam, arm, hand, view) {
    const ref = v(0, 0, 1);
    const upper = bonePath(arm.shoulder, arm.elbow, 0.052, 0.040, ref);
    const fore = bonePath(arm.elbow, arm.wrist, 0.038, 0.028, ref);
    function bonePathD(pts) {
      return pts.map(function (p, i) { return (i ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1); }).join(' ') + ' Z';
    }
    el('path', {
      d: bonePathD(upper.map(function (p) { return project(cam, p); })),
      fill: COLORS.shirt, stroke: COLORS.outline, 'stroke-width': 1
    }, g);
    el('path', {
      d: bonePathD(fore.map(function (p) { return project(cam, p); })),
      fill: COLORS.skin, stroke: COLORS.outline, 'stroke-width': 1
    }, g);
    const ej = project(cam, arm.elbow);
    const ejScale = cam.focal / Math.max(depth(cam, arm.elbow), 0.05);
    el('circle', {
      cx: ej.x.toFixed(1), cy: ej.y.toFixed(1), r: (0.039 * ejScale).toFixed(1),
      fill: COLORS.skin, stroke: COLORS.outline, 'stroke-width': 0.8
    }, g);
    drawHand(g, cam, hand);
  }

  function drawHand(g, cam, hand) {
    const normal = hand.normal;

    /* palm: the six faces of the slab, painted back to front */
    const c = hand.palm;
    const faces = [
      [c[0], c[1], c[2], c[3]],   /* back  */
      [c[4], c[5], c[6], c[7]],   /* front */
      [c[0], c[1], c[5], c[4]],
      [c[1], c[2], c[6], c[5]],
      [c[2], c[3], c[7], c[6]],
      [c[3], c[0], c[4], c[7]]
    ];
    const palmFaces = faces.map(function (f) {
      let z = 0;
      f.forEach(function (p) { z += depth(cam, p); });
      return { pts: f, z: z / 4 };
    });
    palmFaces.sort(function (a, b) { return b.z - a.z; });
    palmFaces.forEach(function (f, i) {
      poly(g, f.pts, cam, {
        fill: i === 0 ? COLORS.skinDark : COLORS.skin,
        stroke: COLORS.outline, 'stroke-width': 0.9
      });
    });

    /* fingers and thumb: one continuous tapered shape each */
    const parts = [];
    hand.fingers.forEach(function (f) {
      const radii = [f.radius, f.radius * 0.92, f.radius * 0.84, f.radius * 0.74];
      parts.push({ z: depth(cam, f.joints[2]), pts: chainOutline(f.joints, radii, normal), color: COLORS.skin });
    });
    parts.push({
      z: depth(cam, hand.thumb.joints[1]),
      pts: chainOutline(hand.thumb.joints,
        [hand.thumb.radius, hand.thumb.radius * 0.9, hand.thumb.radius * 0.78], normal),
      color: COLORS.skin
    });
    parts.sort(function (a, b) { return b.z - a.z; });
    parts.forEach(function (p) {
      poly(g, p.pts, cam, { fill: p.color, stroke: COLORS.outline, 'stroke-width': 0.9 });
    });

    /* knuckle shading + the joint markers (colours match the UI legend) */
    hand.fingers.forEach(function (f) {
      const marks = [[f.joints[1], JOINT.pip, 2.8], [f.joints[2], JOINT.dip, 2.6], [f.joints[3], JOINT.tip, 2.4]];
      marks.forEach(function (m) {
        const p = project(cam, m[0]);
        el('circle', {
          cx: p.x.toFixed(1), cy: p.y.toFixed(1), r: m[2],
          fill: m[1], stroke: 'rgba(0,0,0,0.28)', 'stroke-width': 0.6
        }, g);
      });
    });
    const tp = project(cam, hand.thumb.joints[2]);
    el('circle', { cx: tp.x.toFixed(1), cy: tp.y.toFixed(1), r: 2.4, fill: JOINT.tip, stroke: 'rgba(0,0,0,0.28)', 'stroke-width': 0.6 }, g);
  }

  /* ── helpers for callers ────────────────────────────────────── */
  /** Convert a lexicon entry into the shape the clip builder needs. */
  function toClipEntry(entry) {
    if (!entry) return null;
    if (entry.hs && entry.loc) return entry;               // already an entry
    /* legacy shape (f / th / motion) */
    const hs = { f: entry.f || [0, 0, 0, 0, 0], th: entry.th || 'out' };
    const path = entry.motion ? { t: entry.motion.t, dx: entry.motion.dx || 0, dy: entry.motion.dy || 0, r: entry.motion.r || 0 } : null;
    return {
      id: entry.id || 'sign',
      hs: hs,
      loc: 'neutral',
      path: path,
      hands: entry.hands || 'right',
      reps: 1,
      euler: [entry.w || 0, 0, 0]
    };
  }

  return {
    VIEWS: VIEWS, VIEW_ORDER: VIEW_ORDER,
    render: render, toClipEntry: toClipEntry,
    buildFrames: function (entry, opts) { return ISLClips.buildFrames(toClipEntry(entry), opts || {}); }
  };
})();

if (typeof window !== 'undefined') window.SignRenderer = SignRenderer;
