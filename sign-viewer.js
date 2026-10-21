/* =====================================================================
   SignVerse — DEMONSTRATION CONTROLLER
   ---------------------------------------------------------------------
   One controller drives every sign demonstration in the application
   (Translate, Learn, Dictionary detail). It owns:

     • the 3D avatar (Three.js) with a 2D SVG fallback
     • play / pause / replay / loop / skip
     • slow · normal · fast playback speeds
     • a progress bar and the current-word indicator
     • reduced-motion behaviour
     • clean teardown (WebGL resources, animation frames, listeners)

   The controller never touches the camera feature.
   ===================================================================== */

const SignViewer = (function () {
  const SPEED_TIME_SCALE = { 1: 0.55, 3: 1, 5: 1.8 };
  const BASE_2D_DURATION = 900; // ms for the 2D fallback renderer

  function prefersReducedMotion() {
    return typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  class Viewer {
    constructor(opts) {
      const options = opts || {};
      this.svg = options.svg || null;
      this.host = options.host || null;
      this.stage = options.stage || (this.svg ? this.svg.parentNode : null);
      this.onState = options.onState || function () {};
      this.onEnd = options.onEnd || function () {};
      this.onWordChange = options.onWordChange || function () {};

      this.entries = [];
      this.index = 0;
      this.current = null;
      this.avatar = null;
      this.mode = '2d';
      this.threeStatus = 'idle'; // idle | loading | ready | failed
      this.error = null;

      this.playing = false;
      this.loop = false;
      this.speed = 3;
      this.reduced = prefersReducedMotion();
      /* 'auto' | '3d' | '2d' — the user can force the 2D illustration */
      this.preferred = 'auto';

      this._raf = null;
      this._pending = null;
      this._destroyed = false;

      this._onVisibility = () => {
        if (document.hidden && this.playing) this.pause();
      };
      document.addEventListener('visibilitychange', this._onVisibility);
    }

    /* ── 3D availability ─────────────────────────────────────── */
    async enable3D() {
      if (this._destroyed) return false;
      if (this.preferred === '2d') return false;
      if (this.threeStatus === 'ready') {
        /* the avatar already exists — switch back to it */
        this.mode = '3d';
        if (this.stage) this.stage.classList.add('sv-has-3d');
        return true;
      }
      if (this.threeStatus === 'failed') return false;
      if (!this.host) return false;
      this.threeStatus = 'loading';
      this._emit();
      try {
        const THREE = await SignRig.loadThree();
        if (!THREE || this._destroyed) {
          this.threeStatus = 'failed';
          this.error = '3D engine could not be loaded';
          this._emit();
          return false;
        }
        const avatar = new SignRig.Avatar(this.host, THREE);
        if (this._destroyed) { avatar.dispose(); return false; }
        this.avatar = avatar;
        avatar.onProgress((ratio) => {
          this._emit({ progress: ratio });
        });
        avatar.onEnd(() => this._handleEnd());
        this.mode = '3d';
        this.threeStatus = 'ready';
        this._stop2D();
        if (this.stage) this.stage.classList.add('sv-has-3d');
        this._emit();
        if (this.current) {
          this.avatar.setSign(this.current);
          if (this.playing && !this.reduced) this.avatar.play();
        }
        return true;
      } catch (e) {
        this.threeStatus = 'failed';
        this.error = (e && e.message) || '3D engine failed';
        this.mode = '2d';
        if (this.avatar) { this.avatar.dispose(); this.avatar = null; }
        if (this.stage) this.stage.classList.remove('sv-has-3d');
        this._emit();
        return false;
      }
    }

    /* ── public API ─────────────────────────────────────────── */
    /**
     * Re-attach the viewer to freshly rendered markup (the panels
     * rebuild their DOM). The 3D avatar keeps its WebGL context.
     */
    bind(opts) {
      const options = opts || {};
      if (options.svg) this.svg = options.svg;
      if (options.stage) this.stage = options.stage;
      if (options.host) {
        this.host = options.host;
        if (this.avatar) {
          this.avatar.setHost(options.host);
          if (this.current) {
            this.avatar.setSign(this.current);
            if (this.playing && !this.reduced) this.avatar.play();
          }
        }
      }
      if (this.stage) this.stage.classList.toggle('sv-has-3d', this.mode === '3d');
    }

    setSequence(entries, startIndex) {
      this.entries = (entries || []).filter(Boolean);
      this.index = Math.max(0, Math.min(startIndex || 0, this.entries.length - 1));
    }

    show(entry, opts) {
      const options = opts || {};
      if (!entry) return;
      this.current = entry;
      this.onWordChange(entry);
      if (this.avatar) {
        this.avatar.setSign(entry);
        this.avatar.setSpeed(SPEED_TIME_SCALE[this.speed] || 1);
        this.avatar.setLoop(this.loop);
      }
      if (this.svg) {
        const shape = ISLDictionary.legacyShape(entry);
        if (typeof window.renderSign === 'function') {
          window.renderSign(this.svg, shape, this.reduced ? 1 : 0, null);
        }
      }
      if (this.preferred === '2d' && this.stage) this.stage.classList.remove('sv-has-3d');
      if (options.autoPlay !== false && !this.reduced) {
        this.play();
      } else {
        this._showStatic();
      }
      this._emit();
    }

    /** Show a sequence of entries and start playing from `startIndex`. */
    playSequence(entries, opts) {
      const options = opts || {};
      this.setSequence(entries, options.startIndex);
      if (!this.entries.length) return;
      this.show(this.entries[this.index], { autoPlay: options.autoPlay !== false });
    }

    play() {
      if (!this.current) return;
      this.playing = true;
      if (this.avatar && this.mode === '3d') {
        this.avatar.setSpeed(SPEED_TIME_SCALE[this.speed] || 1);
        this.avatar.setLoop(this.loop);
        this.avatar.play();
      } else {
        this._play2D();
      }
      this._emit();
    }

    pause() {
      this.playing = false;
      if (this.avatar && this.mode === '3d') this.avatar.pause();
      this._stop2D();
      this._emit();
    }

    toggle() {
      if (this.playing) this.pause(); else this.play();
    }

    replay() {
      this.pause();
      if (this.current) {
        this.show(this.current, { autoPlay: !this.reduced });
      }
    }

    /** Move to the next entry of the sequence (or restart the current one). */
    skip(dir) {
      const step = dir || 1;
      if (this.entries.length > 1) {
        const next = (this.index + step + this.entries.length) % this.entries.length;
        this.index = next;
        this.show(this.entries[this.index], { autoPlay: !this.reduced });
      } else {
        this.replay();
      }
    }

    setSpeed(value) {
      this.speed = value;
      if (this.avatar) this.avatar.setSpeed(SPEED_TIME_SCALE[value] || 1);
      this._emit();
    }

    /**
     * Switch the renderer explicitly.
     * '3d' → the Three.js avatar (loaded on demand)
     * '2d' → the flat illustration (always available, works offline)
     */
    async setRenderer(pref) {
      this.preferred = pref === '2d' ? '2d' : '3d';
      if (this.preferred === '2d') {
        if (this.avatar) this.avatar.pause();
        this.mode = '2d';
        if (this.stage) this.stage.classList.remove('sv-has-3d');
        this._showStatic();
        this._emit();
        return false;
      }
      const ok = await this.enable3D();
      if (ok && this.current) {
        this.avatar.setSign(this.current);
        this.show(this.current, { autoPlay: !this.reduced });
      }
      this._emit();
      return ok;
    }

    setLoop(on) {
      this.loop = !!on;
      if (this.avatar) this.avatar.setLoop(this.loop);
      this._emit();
    }

    setMirror(on) {
      if (this.avatar) this.avatar.setMirror(on);
      this.mirror = !!on;
    }

    seek(ratio) {
      if (this.avatar && this.mode === '3d') this.avatar.seek(ratio);
    }

    getProgress() {
      if (this.avatar && this.mode === '3d') {
        return this.avatar.getTime ? Math.min(1, this.avatar.getTime() / (this.avatar.duration || 1)) : 0;
      }
      return this._progress || 0;
    }

    /** Release every resource owned by this viewer. */
    destroy() {
      this._destroyed = true;
      document.removeEventListener('visibilitychange', this._onVisibility);
      this._stop2D();
      if (this.avatar) {
        this.avatar.dispose();
        this.avatar = null;
      }
      this.mode = '2d';
      this.threeStatus = 'idle';
    }

    /* ── internals ───────────────────────────────────────────── */
    _showStatic() {
      this._stop2D();
      if (this.avatar && this.mode === '3d') {
        this.avatar.pause();
        this.avatar.seek(1);
      } else if (this.svg && this.current) {
        const shape = ISLDictionary.legacyShape(this.current);
        if (typeof window.renderSign === 'function') window.renderSign(this.svg, shape, 1, null);
      }
    }

    _play2D() {
      this._stop2D();
      if (!this.svg || !this.current) return;
      const shape = ISLDictionary.legacyShape(this.current);
      const duration = BASE_2D_DURATION / (SPEED_TIME_SCALE[this.speed] || 1);
      const start = performance.now();
      const self = this;
      function tick(now) {
        if (self._destroyed || !self.playing) return;
        if (self.mode === '3d') { self._raf = null; return; }
        const ratio = Math.min(1, (now - start) / duration);
        if (typeof window.renderSign === 'function') window.renderSign(self.svg, shape, ratio, null);
        self._progress = ratio;
        self._emit({ progress: ratio });
        if (ratio < 1) {
          self._raf = requestAnimationFrame(tick);
        } else {
          self._raf = null;
          self._handleEnd();
        }
      }
      this._raf = requestAnimationFrame(tick);
    }

    _stop2D() {
      if (this._raf) {
        cancelAnimationFrame(this._raf);
        this._raf = null;
      }
    }

    _handleEnd() {
      if (this._destroyed) return;
      if (this.loop) {
        if (this.avatar && this.mode === '3d') this.avatar.play();
        else this._play2D();
        return;
      }
      if (this.entries.length > 1 && this.index < this.entries.length - 1) {
        this.index++;
        this.show(this.entries[this.index], { autoPlay: true });
        return;
      }
      this.playing = false;
      this._emit();
      this.onEnd();
    }

    _emit(extra) {
      const state = {
        mode: this.mode,
        preferred: this.preferred,
        threeStatus: this.threeStatus,
        error: this.error,
        playing: this.playing,
        loop: this.loop,
        speed: this.speed,
        reduced: this.reduced,
        index: this.index,
        total: this.entries.length,
        entry: this.current,
        progress: this.getProgress()
      };
      if (extra) Object.assign(state, extra);
      try { this.onState(state); } catch (e) { /* a UI error must never break playback */ }
    }
  }

  return { Viewer: Viewer, SPEED_TIME_SCALE: SPEED_TIME_SCALE };
})();

if (typeof window !== 'undefined') window.SignViewer = SignViewer;
