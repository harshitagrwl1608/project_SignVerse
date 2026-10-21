/* =====================================================================
   SignVerse — 3D SIGN AVATAR (Three.js)
   ---------------------------------------------------------------------
   A procedural, fully rigged upper-body avatar:

     root ─ torso ─ neck ─ head
                  ├ shoulderR ─ upperArmR ─ elbowR ─ forearmR ─ wristR ─ palm ─ fingers
                  └ shoulderL ─ upperArmL ─ elbowL ─ forearmL ─ wristL ─ palm ─ fingers

   Every finger has an independent MCP / PIP / DIP joint and the thumb has
   two, so any handshape in the lexicon can be articulated. The arm is
   solved with a two-link IK so the hand actually reaches the body
   location required by the sign (forehead, chin, chest, …).

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

  /* ── rig metrics ─────────────────────────────────────────────── */
  const L_UPPER = 0.29;
  const L_FORE = 0.27;
  const SHOULDER = { R: [-0.185, 1.375, 0.0], L: [0.185, 1.375, 0.0] };
  const FINGERS = [
    { name: 'index', base: [0.028, 0.070], len: [0.040, 0.029, 0.022], radius: 0.0115 },
    { name: 'middle', base: [0.009, 0.076], len: [0.046, 0.033, 0.024], radius: 0.0120 },
    { name: 'ring', base: [-0.010, 0.072], len: [0.042, 0.031, 0.023], radius: 0.0115 },
    { name: 'pinky', base: [-0.028, 0.060], len: [0.032, 0.023, 0.018], radius: 0.0098 }
  ];
  const THUMB = { base: [0.046, 0.022], len: [0.032, 0.026], radius: 0.0125 };

  const PALM_W = 0.088;
  const PALM_H = 0.098;
  const PALM_T = 0.026;

  /* ── geometry helpers ─────────────────────────────────────────── */
  function capsule(THREE, radius, length, mat) {
    const geo = new THREE.CapsuleGeometry(radius, Math.max(length - radius * 2, 0.001), 4, 10);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = false;
    return mesh;
  }

  function box(THREE, w, h, d, mat) {
    return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  }

  function ball(THREE, r, mat) {
    return new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), mat);
  }

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
      this.renderer.domElement.classList.add('sv-three-canvas');
      this.container.appendChild(this.renderer.domElement);

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(34, w / h, 0.05, 20);
      this.camera.position.set(0, 1.45, 1.02);
      this.camera.lookAt(0, 1.44, 0.05);

      const hemi = new THREE.HemisphereLight(0xffffff, 0x93a5b8, 1.05);
      const key = new THREE.DirectionalLight(0xffffff, 1.15);
      key.position.set(1.1, 2.3, 1.7);
      const fill = new THREE.DirectionalLight(0xdfe9ff, 0.45);
      fill.position.set(-1.6, 1.2, 0.9);
      const rim = new THREE.DirectionalLight(0xffffff, 0.55);
      rim.position.set(-0.4, 1.8, -1.6);
      this.scene.add(hemi, key, fill, rim);

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

    _buildAvatar() {
      const THREE = this.THREE;
      const skin = this._track(new THREE.MeshStandardMaterial({ color: 0xe3a179, roughness: 0.82, metalness: 0.0 }));
      const shirt = this._track(new THREE.MeshStandardMaterial({ color: 0x2f9e8f, roughness: 0.9 }));
      const hair = this._track(new THREE.MeshStandardMaterial({ color: 0x2b2f3a, roughness: 0.95 }));
      const eye = this._track(new THREE.MeshStandardMaterial({ color: 0x14202e, roughness: 0.4 }));
      this.materials = [skin, shirt, hair, eye];

      const root = new THREE.Group();
      root.name = 'sv_root';
      this.scene.add(root);
      this.nodes.root = root;

      const torso = new THREE.Group();
      torso.name = 'sv_torso';
      torso.position.set(0, 1.15, 0);
      root.add(torso);
      this.nodes.torso = torso;

      const torsoMesh = this._track(capsule(THREE, 0.135, 0.30, shirt));
      torsoMesh.position.set(0, 0, 0);
      torsoMesh.scale.set(1.45, 1, 0.82);
      torso.add(torsoMesh);

      /* shoulder yoke — fills the gap between the neck and the torso */
      const yoke = this._track(ball(THREE, 0.16, shirt));
      yoke.position.set(0, 0.20, 0);
      yoke.scale.set(1.38, 0.58, 0.86);
      torso.add(yoke);

      const neck = new THREE.Group();
      neck.name = 'sv_neck';
      neck.position.set(0, 0.31, 0);
      torso.add(neck);
      this.nodes.neck = neck;
      const neckMesh = this._track(capsule(THREE, 0.045, 0.10, skin));
      neckMesh.position.set(0, 0, 0);
      neck.add(neckMesh);

      const head = new THREE.Group();
      head.name = 'sv_head';
      head.position.set(0, 0.145, 0);
      neck.add(head);
      this.nodes.head = head;

      const headMesh = this._track(ball(THREE, 0.108, skin));
      headMesh.scale.set(0.94, 1.08, 1.0);
      head.add(headMesh);
      const hairMesh = this._track(ball(THREE, 0.112, hair));
      hairMesh.scale.set(0.97, 0.72, 1.02);
      hairMesh.position.set(0, 0.038, -0.012);
      head.add(hairMesh);
      [-0.042, 0.042].forEach(function (x) {
        const e = ball(THREE, 0.0125, eye);
        e.position.set(x, 0.012, 0.093);
        head.add(e);
      });

      const self = this;
      ['R', 'L'].forEach(function (side) {
        const sign = side === 'R' ? 1 : -1; // R hand is on -X, L hand on +X
        const shoulder = new THREE.Group();
        shoulder.name = 'sv_shoulder' + side;
        shoulder.position.set(SHOULDER[side][0], SHOULDER[side][1] - 1.19, SHOULDER[side][2]);
        torso.add(shoulder);
        self.nodes['shoulder' + side] = shoulder;

        const upper = new THREE.Group();
        upper.name = 'sv_upperArm' + side;
        shoulder.add(upper);
        self.nodes['upperArm' + side] = upper;
        const upperMesh = capsule(THREE, 0.046, L_UPPER, shirt);
        upperMesh.position.set(0, -L_UPPER / 2, 0);
        upper.add(upperMesh);

        const elbow = new THREE.Group();
        elbow.name = 'sv_elbow' + side;
        elbow.position.set(0, -L_UPPER, 0);
        upper.add(elbow);
        self.nodes['elbow' + side] = elbow;
        const foreMesh = capsule(THREE, 0.036, L_FORE, skin);
        foreMesh.position.set(0, -L_FORE / 2, 0);
        elbow.add(foreMesh);

        const wrist = new THREE.Group();
        wrist.name = 'sv_wrist' + side;
        wrist.position.set(0, -L_FORE, 0);
        elbow.add(wrist);
        self.nodes['wrist' + side] = wrist;

        const palm = box(THREE, PALM_W, PALM_H, PALM_T, skin);
        palm.position.set(0, PALM_H / 2 - 0.004, 0);
        wrist.add(palm);

        FINGERS.forEach(function (f, fi) {
          const mcp = new THREE.Group();
          mcp.name = 'sv_f' + side + '_' + f.name + '_mcp';
          mcp.position.set(f.base[0] * sign, f.base[1], 0);
          wrist.add(mcp);
          self.nodes['f' + side + fi + 'mcp'] = mcp;

          const segs = [];
          let parent = mcp;
          ['pip', 'dip', 'tip'].forEach(function (jointName, ji) {
            const g = new THREE.Group();
            g.name = 'sv_f' + side + '_' + f.name + '_' + jointName;
            if (ji > 0) g.position.set(0, f.len[ji - 1], 0);
            parent.add(g);
            self.nodes['f' + side + fi + jointName] = g;
            const mesh = capsule(THREE, f.radius * (1 - ji * 0.12), f.len[ji] * 0.9, skin);
            mesh.position.set(0, f.len[ji] / 2, 0);
            g.add(mesh);
            parent = g;
            segs.push(g);
          });
        });

        /* thumb: two joints, pointing towards +X for the right hand */
        const tBase = new THREE.Group();
        tBase.name = 'sv_thumb' + side + '_base';
        tBase.position.set(THUMB.base[0] * sign, THUMB.base[1], 0);
        wrist.add(tBase);
        self.nodes['thumb' + side + 'base'] = tBase;
        const t1 = new THREE.Group();
        t1.name = 'sv_thumb' + side + '_1';
        t1.position.set(THUMB.len[0] * sign, 0, 0);
        tBase.add(t1);
        self.nodes['thumb' + side + '1'] = t1;
        const tMesh = capsule(THREE, THUMB.radius, THUMB.len[0] * 0.9, skin);
        tMesh.rotation.z = sign > 0 ? -Math.PI / 2 : Math.PI / 2;
        tMesh.position.set(THUMB.len[0] * 0.5 * sign, 0, 0);
        t1.add(tMesh);
        const t2 = new THREE.Group();
        t2.name = 'sv_thumb' + side + '_2';
        t2.position.set(THUMB.len[1] * sign, 0, 0);
        t1.add(t2);
        self.nodes['thumb' + side + '2'] = t2;
        const tMesh2 = capsule(THREE, THUMB.radius * 0.88, THUMB.len[1] * 0.9, skin);
        tMesh2.rotation.z = sign > 0 ? -Math.PI / 2 : Math.PI / 2;
        tMesh2.position.set(THUMB.len[1] * 0.5 * sign, 0, 0);
        t2.add(tMesh2);
      });
    }

    /* ── IK + pose application ─────────────────────────────────── */
    _armPose(side, target, handEuler) {
      const THREE = this.THREE;
      const O = new THREE.Vector3(SHOULDER[side][0], SHOULDER[side][1], SHOULDER[side][2]);
      const T = new THREE.Vector3(target[0], target[1], target[2]);
      const d = new THREE.Vector3().subVectors(T, O);
      let D = d.length();
      const maxReach = (L_UPPER + L_FORE) * 0.995;
      const minReach = Math.abs(L_UPPER - L_FORE) + 0.02;
      D = Math.min(Math.max(D, minReach), maxReach);
      const dir = d.clone().normalize();

      const cosAlpha = (L_UPPER * L_UPPER + D * D - L_FORE * L_FORE) / (2 * L_UPPER * D);
      const alpha = Math.acos(Math.max(-1, Math.min(1, cosAlpha)));

      /* The elbow is pushed outwards (and slightly forwards) so that the
         forearm does not cover the face — this is how a signer actually
         holds the hand next to the face. */
      const outward = side === 'R'
        ? new THREE.Vector3(-1, 0, 0.30).normalize()
        : new THREE.Vector3(1, 0, 0.30).normalize();
      let axis = new THREE.Vector3().crossVectors(dir, outward);
      if (axis.lengthSq() < 1e-6) axis.set(1, 0, 0);
      axis.normalize();

      const upperDir = dir.clone().applyAxisAngle(axis, alpha).normalize();
      const elbowPos = O.clone().addScaledVector(upperDir, L_UPPER);
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

    _fingerQuats(fingers, thumb) {
      const THREE = this.THREE;
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
      const qSpread = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(t.spread));
      const qBend = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(-t.bend));
      const qTwist = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(t.twist));
      out.push([qSpread.clone().multiply(qBend).multiply(qTwist), qBend.clone()]);
      return out;
    }

    /**
     * Build a Three.js animation clip for a lexicon entry.
     */
    buildClip(entry) {
      const THREE = this.THREE;
      const data = ISLClips.buildFrames(entry, { transition: 0.34, hold: 0.3, moveTime: 0.5 });
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
              const q = self._fingerQuats(fingers, h.th)[fi][ji];
              return q;
            });
          });
        }
        addQuatTrack('sv_thumb' + side + '_base', function (i) {
          const frame = data.frames[i];
          const h = frame.hands[side === 'R' ? 'right' : 'left'];
          if (!h) return new THREE.Quaternion();
          return self._fingerQuats(h.f || [0, 0, 0, 0, 0], h.th)[4][0];
        });
        addQuatTrack('sv_thumb' + side + '_1', function (i) {
          const frame = data.frames[i];
          const h = frame.hands[side === 'R' ? 'right' : 'left'];
          if (!h) return new THREE.Quaternion();
          return self._fingerQuats(h.f || [0, 0, 0, 0, 0], h.th)[4][1];
        });
      });

      const clip = new THREE.AnimationClip('isl:' + entry.id, data.duration, tracks);
      this.duration = data.duration;
      this.clip = clip;
      return clip;
    }

    /** Load a sign and reset the mixer. */
    setSign(entry) {
      if (!this.mixer || this._disposed) return;
      const THREE = this.THREE;
      const clip = this.buildClip(entry);
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
      this.action.paused = true;
      this.mixer.setTime(t);
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
        this.renderer.forceContextLoss && this.renderer.forceContextLoss();
      }
      this.nodes = {};
    }
  }

  return { loadThree: loadThree, Avatar: Avatar };
})();

if (typeof window !== 'undefined') window.SignRig = SignRig;
