/* =====================================================================
   SignVerse — 3D SIGN AVATAR (Three.js)
   ---------------------------------------------------------------------
   A procedural, fully rigged upper-body avatar:

     root ─ torso ─ neck ─ head
                   ├ shoulderR ─ upperArmR ─ elbowR ─ forearmR ─ wristR ─ palm ─ fingers
                   └ shoulderL ─ upperArmL ─ elbowL ─ forearmL ─ wristL ─ palm ─ fingers

   Every finger has an independent MCP / PIP / DIP joint and the thumb has
   two, so any handshape in the lexicon can be articulated. The arm is
   solved with a pole-vector IK so the elbow hangs naturally and the hand
   actually reaches the body location required by the sign (forehead, chin,
   chest, …).

   The rig is intentionally code-generated: no third-party model is
   downloaded, nothing is redistributed, and the whole avatar weighs a
   few kilobytes of source instead of megabytes of GLB.

   Three.js is loaded lazily from a CDN. If WebGL or the network is not
   available the viewer falls back to the 2D renderer and the application
   keeps working.
   ===================================================================== */

const SignRig = (function () {
  const THREE_CDN = [
    { type: 'module', url: 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js' },
    { type: 'umd', url: 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js' },
    { type: 'umd', url: 'https://unpkg.com/three@0.160.0/build/three.min.js' }
  ];

  let threePromise = null;

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src="' + src + '"]')) { resolve(); return; }
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error('Failed to load ' + src)); };
      document.head.appendChild(s);
    });
  }

  /** Load Three.js once; resolves with the THREE namespace or null. */
  function loadThree() {
    if (threePromise) return threePromise;
    threePromise = (async function () {
      for (const candidate of THREE_CDN) {
        try {
          if (candidate.type === 'module') {
            const mod = await import(/* webpackIgnore: true */ candidate.url);
            if (mod && mod.Scene) return mod;
          } else {
            await loadScript(candidate.url);
            if (window.THREE && window.THREE.Scene) return window.THREE;
          }
        } catch (e) { /* try the next candidate */ }
      }
      return null;
    })();
    return threePromise;
  }

  /* ── rig metrics (metres, a ~1.7 m person seen from the chest up) ── */
  const TORSO_Y = 1.13;          // torso group height
  const SHOULDER = { R: [-0.163, 1.335, 0.0], L: [0.163, 1.335, 0.0] };
  const L_UPPER = 0.255;         // shoulder → elbow
  const L_FORE = 0.245;          // elbow → wrist
  const HEAD_Y = 1.545;          // head centre
  const HEAD_R = 0.094;

  /* fingers: [x offset, y offset, segment lengths, radius] */
  const FINGERS = [
    { name: 'index', base: [0.030, 0.072], len: [0.038, 0.027, 0.020], radius: 0.0098 },
    { name: 'middle', base: [0.010, 0.078], len: [0.043, 0.031, 0.022], radius: 0.0102 },
    { name: 'ring', base: [-0.010, 0.074], len: [0.039, 0.029, 0.021], radius: 0.0098 },
    { name: 'pinky', base: [-0.029, 0.061], len: [0.030, 0.021, 0.017], radius: 0.0084 }
  ];
  const THUMB = { base: [0.042, 0.026], len: [0.030, 0.024], radius: 0.0108 };
  const PALM_W = 0.068;
  const PALM_H = 0.086;
  const PALM_T = 0.024;

  /* =================================================================
     AVATAR
     ================================================================= */
  class Avatar {
    constructor(container, THREE) {
      this.THREE = THREE;
      this.container = container;
      this.nodes = {};
      this.disposables = [];
      this.mixer = null;
      this.action = null;
      this.clip = null;
      this.duration = 0;
      this.playing = false;
      this.speed = 1;
      this.loop = false;
      this._raf = null;
      this._last = 0;
      this._onProgress = null;
      this._onEnd = null;
      this._reducedMotion = false;
      this._mirror = false;
      this._disposed = false;
      this._init();
    }

    _init() {
      const THREE = this.THREE;
      const w = Math.max(this.container.clientWidth || 320, 1);
      const h = Math.max(this.container.clientHeight || 320, 1);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default' });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.setSize(w, h, false);
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.05;
      this.renderer.domElement.classList.add('sv-three-canvas');
      this.container.appendChild(this.renderer.domElement);

      this.scene = new THREE.Scene();
      /* tight framing: head + hands fill the frame so the handshape reads */
      this.camera = new THREE.PerspectiveCamera(30, w / h, 0.05, 20);
      this.camera.position.set(0, 1.520, 1.26);
      this.camera.lookAt(0, 1.515, 0.06);

      const hemi = new THREE.HemisphereLight(0xffffff, 0x8fa3b8, 0.85);
      const key = new THREE.DirectionalLight(0xfff4e8, 1.25);
      key.position.set(0.9, 2.1, 1.6);
      const fill = new THREE.DirectionalLight(0xdce9ff, 0.55);
      fill.position.set(-1.7, 1.1, 1.0);
      const rim = new THREE.DirectionalLight(0xffffff, 0.75);
      rim.position.set(-0.5, 1.9, -1.5);
      this.scene.add(hemi, key, fill, rim);

      this._buildBackdrop();
      this._buildAvatar();

      this.mixer = new THREE.AnimationMixer(this.scene);

      this._resizeObserver = (typeof ResizeObserver !== 'undefined')
        ? new ResizeObserver(() => this.resize())
        : null;
      if (this._resizeObserver) this._resizeObserver.observe(this.container);
      this._onWinResize = () => this.resize();
      window.addEventListener('resize', this._onWinResize);

      this.renderer.render(this.scene, this.camera);
    }

    _track(obj) { this.disposables.push(obj); return obj; }

    /** Soft glow behind the avatar so the silhouette stays readable. */
    _buildBackdrop() {
      const THREE = this.THREE;
      /* a radial gradient fades out at the edges — no visible disc rim */
      const size = 256;
      const cnv = document.createElement('canvas');
      cnv.width = size; cnv.height = size;
      const ctx = cnv.getContext('2d');
      const g = ctx.createRadialGradient(size / 2, size / 2, size * 0.05, size / 2, size / 2, size * 0.5);
      g.addColorStop(0, 'rgba(226,236,248,0.95)');
      g.addColorStop(0.55, 'rgba(226,236,248,0.75)');
      g.addColorStop(1, 'rgba(226,236,248,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
      const tex = new THREE.CanvasTexture(cnv);
      tex.colorSpace = THREE.SRGBColorSpace;
      this._track(tex);
      const mat = this._track(new THREE.MeshBasicMaterial({
        map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide
      }));
      const geo = this._track(new THREE.PlaneGeometry(2.4, 2.4));
      const disc = new THREE.Mesh(geo, mat);
      disc.position.set(0, 1.45, -0.7);
      this.scene.add(disc);
    }

    /* ── geometry helpers ─────────────────────────────────────── */
    _cylinder(rTop, rBottom, len, mat, seg) {
      const THREE = this.THREE;
      const geo = new THREE.CylinderGeometry(rTop, rBottom, len, seg || 12, 1, false);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = false;
      return mesh;
    }

    _ball(r, mat, seg) {
      const THREE = this.THREE;
      return new THREE.Mesh(new THREE.SphereGeometry(r, seg || 18, seg ? Math.round(seg * 0.7) : 12), mat);
    }

    /**
     * A tapered limb bone. The bone runs from the group origin (the
     * proximal joint) down the local −Y axis, so it lines up with the
     * elbow/wrist offsets used by the IK.
     */
    _bone(rTop, rBottom, len, mat, jointMat) {
      const THREE = this.THREE;
      const group = new THREE.Group();
      const seg = this._cylinder(rTop, rBottom, len, mat, 14);
      seg.position.y = -len / 2;
      group.add(seg);
      const j = this._ball(rBottom * 1.02, jointMat || mat, 14);
      group.add(j);
      return group;
    }

    /* ── avatar ───────────────────────────────────────────────── */
    _buildAvatar() {
      const THREE = this.THREE;
      const skin = this._track(new THREE.MeshStandardMaterial({ color: 0xdda07c, roughness: 0.68, metalness: 0.0 }));
      const shirt = this._track(new THREE.MeshStandardMaterial({ color: 0x2f9e8f, roughness: 0.88 }));
      const hair = this._track(new THREE.MeshStandardMaterial({ color: 0x272b36, roughness: 0.95 }));
      const sclera = this._track(new THREE.MeshStandardMaterial({ color: 0xf7f9fc, roughness: 0.3 }));
      const pupil = this._track(new THREE.MeshStandardMaterial({ color: 0x141b26, roughness: 0.25 }));
      const brow = this._track(new THREE.MeshStandardMaterial({ color: 0x2b2f3a, roughness: 0.9 }));
      const lip = this._track(new THREE.MeshStandardMaterial({ color: 0xb4615c, roughness: 0.55 }));
      this.materials = [skin, shirt, hair, sclera, pupil, brow, lip];

      const root = new THREE.Group();
      root.name = 'sv_root';
      this.scene.add(root);
      this.nodes.root = root;

      /* ── torso ─────────────────────────────────────────────── */
      const torso = new THREE.Group();
      torso.name = 'sv_torso';
      torso.position.set(0, TORSO_Y, 0);
      root.add(torso);
      this.nodes.torso = torso;

      const torsoMesh = this._track(new THREE.Mesh(new THREE.CapsuleGeometry(0.125, 0.24, 4, 16), shirt));
      torsoMesh.scale.set(1.16, 1, 0.74);
      torso.add(torsoMesh);

      /* shoulder yoke */
      const yoke = this._ball(0.15, shirt, 20);
      yoke.position.set(0, 0.195, 0);
      yoke.scale.set(1.20, 0.48, 0.74);
      torso.add(yoke);

      /* collar */
      const collar = this._track(new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.014, 8, 20), shirt));
      collar.position.set(0, 0.245, 0.004);
      collar.rotation.x = Math.PI / 2;
      torso.add(collar);

      /* ── neck + head ───────────────────────────────────────── */
      const neck = new THREE.Group();
      neck.name = 'sv_neck';
      neck.position.set(0, 0.255, 0);
      torso.add(neck);
      this.nodes.neck = neck;

      const neckMesh = this._cylinder(0.043, 0.048, 0.10, skin, 16);
      neckMesh.position.y = 0.045;
      neck.add(neckMesh);

      const head = new THREE.Group();
      head.name = 'sv_head';
      head.position.set(0, 0.160, 0);
      neck.add(head);
      this.nodes.head = head;

      const skull = this._ball(HEAD_R, skin, 24);
      skull.scale.set(0.93, 1.10, 1.0);
      head.add(skull);

      /* jaw / chin */
      const jaw = this._ball(0.068, skin, 18);
      jaw.position.set(0, -0.052, 0.004);
      jaw.scale.set(0.90, 0.78, 0.92);
      head.add(jaw);

      /* hair cap */
      /* hair cap — stops just above the brow line so the face stays visible */
      const hairGeo = new THREE.SphereGeometry(HEAD_R * 1.04, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.40);
      const hairMesh = new THREE.Mesh(hairGeo, hair);
      hairMesh.scale.set(0.99, 1.12, 1.04);
      hairMesh.position.set(0, 0.004, -0.010);
      head.add(hairMesh);
      /* hair at the back of the head */
      const hairBack = this._ball(HEAD_R * 0.92, hair, 18);
      hairBack.position.set(0, 0.010, -0.030);
      hairBack.scale.set(0.98, 1.05, 0.85);
      head.add(hairBack);

      /* eyes */
      [-0.032, 0.032].forEach(function (x) {
        const w = new THREE.Mesh(new THREE.SphereGeometry(0.0122, 16, 12), sclera);
        w.position.set(x, 0.008, 0.081);
        w.scale.set(1, 0.78, 0.5);
        head.add(w);
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.0062, 12, 10), pupil);
        p.position.set(x, 0.007, 0.088);
        head.add(p);
        const b = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.004, 0.004), brow);
        b.position.set(x, 0.026, 0.086);
        b.rotation.z = x < 0 ? 0.12 : -0.12;
        head.add(b);
      });

      /* nose */
      const nose = new THREE.Mesh(new THREE.ConeGeometry(0.0115, 0.026, 10), skin);
      nose.position.set(0, -0.012, 0.084);
      nose.rotation.x = Math.PI / 2;
      head.add(nose);

      /* mouth */
      const mouth = new THREE.Mesh(new THREE.SphereGeometry(0.0165, 14, 10), lip);
      mouth.position.set(0, -0.042, 0.080);
      mouth.scale.set(1.2, 0.36, 0.35);
      head.add(mouth);

      /* ears */
      [-0.086, 0.086].forEach(function (x) {
        const ear = this._ball(0.020, skin, 12);
        ear.position.set(x, -0.004, -0.004);
        ear.scale.set(0.45, 1.15, 0.85);
        head.add(ear);
      }, this);

      /* ── arms ──────────────────────────────────────────────── */
      const self = this;
      ['R', 'L'].forEach(function (side) {
        const sign = side === 'R' ? -1 : 1;   // the right hand sits on −X

        const shoulder = new THREE.Group();
        shoulder.name = 'sv_shoulder' + side;
        shoulder.position.set(SHOULDER[side][0], SHOULDER[side][1] - TORSO_Y, SHOULDER[side][2]);
        torso.add(shoulder);
        self.nodes['shoulder' + side] = shoulder;

        /* deltoid — hides the seam between torso and arm */
        const deltoid = self._ball(0.055, shirt, 18);
        deltoid.scale.set(1, 0.95, 0.9);
        shoulder.add(deltoid);

        const upper = new THREE.Group();
        upper.name = 'sv_upperArm' + side;
        shoulder.add(upper);
        self.nodes['upperArm' + side] = upper;

        const upperBone = self._bone(0.046, 0.038, L_UPPER, shirt, shirt);
        upper.add(upperBone);

        const elbow = new THREE.Group();
        elbow.name = 'sv_elbow' + side;
        elbow.position.set(0, -L_UPPER, 0);
        upper.add(elbow);
        self.nodes['elbow' + side] = elbow;

        const elbowBall = self._ball(0.038, skin, 14);
        elbow.add(elbowBall);

        const foreBone = self._bone(0.037, 0.028, L_FORE, skin, skin);
        elbow.add(foreBone);

        const wrist = new THREE.Group();
        wrist.name = 'sv_wrist' + side;
        wrist.position.set(0, -L_FORE, 0);
        elbow.add(wrist);
        self.nodes['wrist' + side] = wrist;

        /* ── hand ─────────────────────────────────────────────── */
        /* palm: a flattened rounded shape */
        const palm = self._ball(0.046, skin, 20);
        palm.position.set(0, PALM_H / 2 - 0.012, 0);
        palm.scale.set(PALM_W / 0.092, PALM_H / 0.092, PALM_T / 0.092);
        wrist.add(palm);

        /* knuckle ridge */
        const knuckles = self._ball(0.036, skin, 16);
        knuckles.position.set(0, PALM_H - 0.014, 0.004);
        knuckles.scale.set(0.95, 0.55, 0.42);
        wrist.add(knuckles);

        FINGERS.forEach(function (f, fi) {
          const mcp = new THREE.Group();
          mcp.name = 'sv_f' + side + '_' + f.name + '_mcp';
          mcp.position.set(f.base[0] * sign, f.base[1], 0.002);
          wrist.add(mcp);
          self.nodes['f' + side + fi + 'mcp'] = mcp;

          let parent = mcp;
          ['pip', 'dip', 'tip'].forEach(function (jointName, ji) {
            const g = new THREE.Group();
            g.name = 'sv_f' + side + '_' + f.name + '_' + jointName;
            if (ji > 0) g.position.set(0, f.len[ji - 1], 0);
            parent.add(g);
            self.nodes['f' + side + fi + jointName] = g;

            const rTop = f.radius * (1 - ji * 0.10);
            const rBottom = f.radius * (1 - (ji + 1) * 0.10);
            const seg = self._cylinder(rTop, rBottom, f.len[ji], skin, 10);
            seg.position.y = f.len[ji] / 2;
            g.add(seg);

            if (ji < 2) {
              const knuckle = self._ball(rBottom * 1.06, skin, 12);
              knuckle.position.y = f.len[ji];
              g.add(knuckle);
            } else {
              const tip = self._ball(rBottom * 1.12, skin, 12);
              tip.position.y = f.len[ji];
              tip.scale.set(1, 1.15, 1);
              g.add(tip);
            }
            parent = g;
          });
        });

        /* thenar eminence — the muscle at the base of the thumb, so the
           thumb grows out of the palm instead of floating next to it */
        const thenar = self._ball(0.020, skin, 14);
        thenar.position.set(0.030 * sign, 0.018, 0.006);
        thenar.scale.set(0.75, 1.25, 0.75);
        wrist.add(thenar);

        /* thumb: two segments, angled away from the palm */
        const tBase = new THREE.Group();
        tBase.name = 'sv_thumb' + side + '_base';
        tBase.position.set(THUMB.base[0] * sign, THUMB.base[1], 0.006);
        wrist.add(tBase);
        self.nodes['thumb' + side + 'base'] = tBase;

        const t1 = new THREE.Group();
        t1.name = 'sv_thumb' + side + '_1';
        t1.position.set(THUMB.len[0] * sign * 0.92, 0.004, 0);
        tBase.add(t1);
        self.nodes['thumb' + side + '1'] = t1;
        const tSeg = self._cylinder(THUMB.radius, THUMB.radius * 0.88, THUMB.len[0], skin, 10);
        tSeg.rotation.z = sign > 0 ? -Math.PI / 2 : Math.PI / 2;
        tSeg.position.set(THUMB.len[0] * 0.5 * sign, 0, 0);
        t1.add(tSeg);
        const tJoint = self._ball(THUMB.radius * 0.95, skin, 12);
        t1.add(tJoint);

        const t2 = new THREE.Group();
        t2.name = 'sv_thumb' + side + '_2';
        t2.position.set(THUMB.len[1] * sign * 0.92, 0, 0);
        t1.add(t2);
        self.nodes['thumb' + side + '2'] = t2;
        const tSeg2 = self._cylinder(THUMB.radius * 0.88, THUMB.radius * 0.72, THUMB.len[1], skin, 10);
        tSeg2.rotation.z = sign > 0 ? -Math.PI / 2 : Math.PI / 2;
        tSeg2.position.set(THUMB.len[1] * 0.5 * sign, 0, 0);
        t2.add(tSeg2);
        const tTip = self._ball(THUMB.radius * 0.8, skin, 12);
        tTip.position.set(THUMB.len[1] * sign, 0, 0);
        t2.add(tTip);
      });
    }

    /* ── IK + pose application ─────────────────────────────────── */
    /**
     * Two-link IK with a pole vector.
     *
     * The elbow is placed on the circle of valid solutions and the point
     * closest to the preferred "elbow down and slightly out" direction is
     * used. That is what makes the arm read like a human arm instead of a
     * mechanical linkage.
     */
    _armPose(side, target, handEuler) {
      const THREE = this.THREE;
      const O = new THREE.Vector3(SHOULDER[side][0], SHOULDER[side][1], SHOULDER[side][2]);
      const T = new THREE.Vector3(target[0], target[1], target[2]);

      const delta = new THREE.Vector3().subVectors(T, O);
      let D = delta.length();
      const maxReach = (L_UPPER + L_FORE) * 0.995;
      const minReach = Math.abs(L_UPPER - L_FORE) + 0.02;
      D = Math.min(Math.max(D, minReach), maxReach);
      const dir = delta.clone().normalize();

      /* distance from the shoulder to the elbow projection */
      const a = (L_UPPER * L_UPPER - L_FORE * L_FORE + D * D) / (2 * D);
      const h = Math.sqrt(Math.max(0, L_UPPER * L_UPPER - a * a));
      const centre = O.clone().addScaledVector(dir, a);

      /* preferred elbow direction: down, slightly out and back */
      const preferred = side === 'R'
        ? new THREE.Vector3(-0.62, -1, -0.18).normalize()
        : new THREE.Vector3(0.62, -1, -0.18).normalize();

      /* basis of the plane that contains the elbow circle */
      let p1 = new THREE.Vector3().crossVectors(dir, preferred);
      if (p1.lengthSq() < 1e-6) {
        p1 = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 0, 1));
        if (p1.lengthSq() < 1e-6) p1.set(1, 0, 0);
      }
      p1.normalize();
      const p2 = new THREE.Vector3().crossVectors(dir, p1).normalize();

      /* pick the solution whose elbow direction matches "preferred" */
      const proj = preferred.clone().addScaledVector(dir, -preferred.dot(dir));
      if (proj.lengthSq() < 1e-8) proj.copy(p1);
      proj.normalize();
      const elbowPos = centre.clone()
        .addScaledVector(p1, h * proj.dot(p1))
        .addScaledVector(p2, h * proj.dot(p2));

      const upperDir = elbowPos.clone().sub(O).normalize();
      const foreDir = T.clone().sub(elbowPos).normalize();

      const down = new THREE.Vector3(0, -1, 0);
      const qUpper = new THREE.Quaternion().setFromUnitVectors(down, upperDir);
      const qFore = new THREE.Quaternion().setFromUnitVectors(down, foreDir);
      const qElbowLocal = qUpper.clone().invert().multiply(qFore);

      const qHand = new THREE.Quaternion().setFromEuler(new THREE.Euler(
        THREE.MathUtils.degToRad(handEuler[0]),
        THREE.MathUtils.degToRad(handEuler[1]),
        THREE.MathUtils.degToRad(handEuler[2]),
        'XYZ'
      ));
      const chain = qUpper.clone().multiply(qElbowLocal);
      const qWristLocal = chain.clone().invert().multiply(qHand);

      return { upper: qUpper, elbow: qElbowLocal, wrist: qWristLocal };
    }

    _fingerQuats(fingers, thumb, mirror) {
      const THREE = this.THREE;
      const m = (mirror === undefined) ? 1 : mirror;
      const out = [];
      for (let i = 0; i < 4; i++) {
        /* interpolate between the two neighbouring handshape states so
           that morphing handshapes (TAKE, the snap in NO, …) stay smooth */
        const raw = Math.max(0, Math.min(2, fingers[i] || 0));
        const low = Math.floor(raw);
        const high = Math.min(2, low + 1);
        const t = raw - low;
        const a = ISLClips.FINGER_ANGLES[low].angles;
        const b = ISLClips.FINGER_ANGLES[high].angles;
        const angles = [
          a[0] + (b[0] - a[0]) * t,
          a[1] + (b[1] - a[1]) * t,
          a[2] + (b[2] - a[2]) * t
        ];
        out.push([
          new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(angles[0])),
          new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(angles[1])),
          new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(angles[2]))
        ]);
      }
      const t = ISLClips.THUMB_ANGLES[thumb] || ISLClips.THUMB_ANGLES.side;
      /* the thumb points along ±X: raise works inside the palm plane (Z),
         flex curls it towards the palm (Y) and twist rolls it (X) */
      const qRaise = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(-t.raise * m));
      const qFlex = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(t.flex * m));
      const qTwist = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(t.twist));
      out.push([qRaise.clone().multiply(qFlex).multiply(qTwist), qFlex.clone()]);
      return out;
    }

    /**
     * Build a Three.js animation clip for a lexicon entry.
     */
    buildClip(entry) {
      const THREE = this.THREE;
      const data = ISLClips.buildFrames(entry, { transition: 0.24, hold: 0.3, moveTime: 0.5 });
      const times = data.frames.map(function (f) { return f.t; });
      const tracks = [];
      const self = this;

      function addQuatTrack(nodeName, quatAt) {
        const values = [];
        for (let i = 0; i < data.frames.length; i++) {
          const q = quatAt(i);
          values.push(q.x, q.y, q.z, q.w);
        }
        tracks.push(new THREE.QuaternionKeyframeTrack(nodeName + '.quaternion', times, values));
      }

      ['R', 'L'].forEach(function (side) {
        const poses = data.frames.map(function (frame) {
          const h = frame.hands[side === 'R' ? 'right' : 'left'];
          if (!h) return null;
          return self._armPose(side, h.pos, h.euler);
        });
        const has = poses.some(Boolean);
        if (has) {
          addQuatTrack('sv_upperArm' + side, function (i) { return poses[i] ? poses[i].upper : new THREE.Quaternion(); });
          addQuatTrack('sv_elbow' + side, function (i) { return poses[i] ? poses[i].elbow : new THREE.Quaternion(); });
          addQuatTrack('sv_wrist' + side, function (i) { return poses[i] ? poses[i].wrist : new THREE.Quaternion(); });
        }
        for (let fi = 0; fi < 4; fi++) {
          ['mcp', 'pip', 'dip'].forEach(function (joint, ji) {
            addQuatTrack('sv_f' + side + '_' + ['index', 'middle', 'ring', 'pinky'][fi] + '_' + joint, function (i) {
              const frame = data.frames[i];
              const h = frame.hands[side === 'R' ? 'right' : 'left'];
              if (!h) return new THREE.Quaternion();
              const fingers = h.f || [0, 0, 0, 0, 0];
              return self._fingerQuats(fingers, h.th, side === 'R' ? 1 : -1)[fi][ji];
            });
          });
        }
        addQuatTrack('sv_thumb' + side + '_base', function (i) {
          const frame = data.frames[i];
          const h = frame.hands[side === 'R' ? 'right' : 'left'];
          if (!h) return new THREE.Quaternion();
          return self._fingerQuats(h.f || [0, 0, 0, 0, 0], h.th, side === 'R' ? 1 : -1)[4][0];
        });
        addQuatTrack('sv_thumb' + side + '_1', function (i) {
          const frame = data.frames[i];
          const h = frame.hands[side === 'R' ? 'right' : 'left'];
          if (!h) return new THREE.Quaternion();
          return self._fingerQuats(h.f || [0, 0, 0, 0, 0], h.th, side === 'R' ? 1 : -1)[4][1];
        });
      });

      const clip = new THREE.AnimationClip('isl:' + entry.id, data.duration, tracks);
      this.duration = data.duration;
      this.clip = clip;
      return clip;
    }

    /**
     * Frame the camera around whatever matters for the current sign: the
     * head plus the path of the hands. Without this the handshape — the
     * part a learner actually has to read — would be a few pixels big.
     */
    frameCamera(entry) {
      const THREE = this.THREE;
      const data = ISLClips.buildFrames(entry, { transition: 0.24, hold: 0.3, moveTime: 0.5 });
      let minX = -0.14, maxX = 0.14, minY = HEAD_Y - 0.13, maxY = HEAD_Y + 0.13;
      data.frames.forEach(function (frame) {
        /* the transition from the rest pose is not part of the sign itself */
        if (frame.t < 0.2) return;
        ['right', 'left'].forEach(function (side) {
          const h = frame.hands[side];
          if (!h) return;
          /* the hand extends ~0.17 m beyond the wrist along the fingers */
          minX = Math.min(minX, h.pos[0] - 0.10);
          maxX = Math.max(maxX, h.pos[0] + 0.10);
          minY = Math.min(minY, h.pos[1] - 0.09);
          maxY = Math.max(maxY, h.pos[1] + 0.17);
        });
      });

      /* keep the face near the centre of the frame: it is what the
         learner looks at while the hand moves around it */
      const centreY = ((minY + maxY) / 2 + HEAD_Y) / 2;
      const halfH = (maxY - minY) / 2 * 1.32 + 0.03;
      const halfW = (maxX - minX) / 2 * 1.26 + 0.03;
      const vFov = THREE.MathUtils.degToRad(this.camera.fov);
      const aspect = this.camera.aspect || 1;
      let dist = halfH / Math.tan(vFov / 2);
      const distW = halfW / (Math.tan(vFov / 2) * aspect);
      dist = Math.max(dist, distW);
      dist = Math.min(Math.max(dist, 0.72), 1.55);

      this.camera.position.set(0, centreY, dist + 0.06);
      this.camera.lookAt(0, centreY, 0.06);
      this.camera.updateProjectionMatrix();
    }

    /** Load a sign and reset the mixer. */
    setSign(entry) {
      if (!this.mixer || this._disposed) return;
      const THREE = this.THREE;
      const clip = this.buildClip(entry);
      this.currentEntry = entry;
      this.frameCamera(entry);
      this.mixer.stopAllAction();
      this.action = this.mixer.clipAction(clip);
      /* hold the last keyframe when the clip finishes, otherwise three
         restores the rest pose and the sign would snap back */
      this.action.clampWhenFinished = true;
      this.action.setLoop(this.loop ? THREE.LoopRepeat : THREE.LoopOnce, this.loop ? Infinity : 1);
      this.action.play();          // activate the action in the mixer
      this.action.reset();         // restart from the first keyframe
      this.action.paused = true;   // hold the first pose until play() is called
      this.mixer.setTime(0);
      this.renderer.render(this.scene, this.camera);
    }

    play() {
      if (!this.action || this._disposed) return;
      const THREE = this.THREE;
      this.action.setLoop(this.loop ? THREE.LoopRepeat : THREE.LoopOnce, this.loop ? Infinity : 1);
      this.action.play();
      this.action.reset();
      this.action.paused = false;
      this.mixer.setTime(0);
      this.playing = true;
      this._last = performance.now();
      this._startLoop();
    }

    pause() {
      this.playing = false;
      if (this.action) this.action.paused = true;
      if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; }
      if (this.renderer && !this._disposed) this.renderer.render(this.scene, this.camera);
    }

    stop() {
      this.playing = false;
      if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; }
      if (this.mixer) this.mixer.stopAllAction();
      if (this.renderer && !this._disposed) this.renderer.render(this.scene, this.camera);
    }

    setLoop(on) {
      this.loop = !!on;
      if (this.action) {
        this.action.setLoop(this.loop ? this.THREE.LoopRepeat : this.THREE.LoopOnce, this.loop ? Infinity : 1);
      }
    }

    setSpeed(multiplier) {
      this.speed = multiplier || 1;
      if (this.action) this.action.setEffectiveTimeScale(this.speed);
    }

    /** Jump to a normalised position (0..1) of the current sign. */
    seek(ratio) {
      if (!this.action || !this.duration) return;
      const t = Math.max(0, Math.min(1, ratio)) * this.duration;
      /* the mixer advances the action, so it must not be paused while we
         seek — it is paused again right afterwards to hold the pose */
      this.action.paused = false;
      this.action.time = 0;
      this.action._loopCount = 0;
      this.mixer.setTime(t);
      this.action.paused = true;
      if (this.renderer && !this._disposed) this.renderer.render(this.scene, this.camera);
    }

    setMirror(on) {
      this._mirror = !!on;
      if (this.nodes.root) this.nodes.root.rotation.y = this._mirror ? Math.PI : 0;
      if (this.renderer && !this._disposed) this.renderer.render(this.scene, this.camera);
    }

    setReducedMotion(on) {
      this._reducedMotion = !!on;
    }

    _startLoop() {
      if (this._raf) cancelAnimationFrame(this._raf);
      const self = this;
      function loop() {
        if (!self.playing || self._disposed) return;
        /* performance.now() is used on both sides: the rAF timestamp can be
           older than the moment play() was called, which would produce a
           negative delta and disable the action. */
        const now = performance.now();
        const dt = Math.min(Math.max((now - self._last) / 1000, 0), 0.1);
        self._last = now;
        if (self.action && !self.action.enabled) self.action.enabled = true;
        self.mixer.update(dt);
        self.renderer.render(self.scene, self.camera);
        if (self._onProgress) {
          self._onProgress(Math.min(1, self.getTime() / (self.duration || 1)));
        }
        if (self.action && !self.action.paused && self.getTime() >= self.duration - 1e-3) {
          if (self.loop) {
            self.action.reset();
            self.action.paused = false;
            self.mixer.setTime(0);
          } else if (self._onEnd) {
            self.playing = false;
            self._onEnd();
            return;
          }
        }
        self._raf = requestAnimationFrame(loop);
      }
      this._raf = requestAnimationFrame(loop);
    }

    resize() {
      if (this._disposed) return;
      const w = Math.max(this.container.clientWidth || 320, 1);
      const h = Math.max(this.container.clientHeight || 320, 1);
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      if (this.currentEntry) this.frameCamera(this.currentEntry);
      if (!this.playing) this.renderer.render(this.scene, this.camera);
    }

    /**
     * Move the avatar into a different container (the panels re-render
     * their markup). The renderer and the WebGL context are kept alive.
     */
    setHost(host) {
      if (!host || host === this.container) return;
      this.container = host;
      if (this.renderer && this.renderer.domElement) {
        host.appendChild(this.renderer.domElement);
      }
      if (this._resizeObserver) {
        this._resizeObserver.disconnect();
        this._resizeObserver.observe(host);
      }
      this.resize();
    }

    onProgress(cb) { this._onProgress = cb; }
    onEnd(cb) { this._onEnd = cb; }

    /** Current mixer time in seconds (three r150+ exposes `mixer.time`). */
    getTime() {
      if (!this.mixer) return 0;
      if (typeof this.mixer.getTime === 'function') return this.mixer.getTime();
      return this.mixer.time || 0;
    }

    dispose() {
      if (this._disposed) return;
      this._disposed = true;
      this.playing = false;
      if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; }
      window.removeEventListener('resize', this._onWinResize);
      if (this._resizeObserver) this._resizeObserver.disconnect();
      if (this.mixer) { this.mixer.stopAllAction(); this.mixer.uncacheRoot(this.scene); }
      this.scene.traverse(function (obj) {
        if (obj.geometry) obj.geometry.dispose();
      });
      this.disposables.forEach(function (d) { if (d && d.dispose) d.dispose(); });
      this.disposables.length = 0;
      if (this.renderer) {
        this.renderer.dispose();
        if (this.renderer.domElement && this.renderer.domElement.parentNode) {
          this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }
        if (this.renderer.forceContextLoss) this.renderer.forceContextLoss();
      }
      this.nodes = {};
    }
  }

  return { loadThree: loadThree, Avatar: Avatar };
})();

if (typeof window !== 'undefined') window.SignRig = SignRig;
