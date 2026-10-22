/* =====================================================================
   SignVerse — DEMONSTRATION CONTROLLER
   ---------------------------------------------------------------------
   One controller drives every sign demonstration in the application
   (Translate, Learn, Dictionary detail). It owns:

     • the 2D renderer (sign-renderer.js) with four viewing angles
       (front · back · left · right)
     • play / pause / replay / loop / skip
     • slow · normal · fast playback speeds
     • a progress bar and the current-word indicator
     • reduced-motion behaviour
     • clean teardown (animation frames, listeners)

   The controller never touches the camera feature.
   ===================================================================== */

const SignViewer = (function () {
  const SPEED_TIME_SCALE = { 1: 0.55, 3: 1, 5: 1.8 };
  const BASE_DURATION = 1150; // ms for a complete sign at normal speed

  function prefersReducedMotion() {
    return typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  class Viewer {
    constructor(opts) {
      const options = opts || {};
      this.svg = options.svg || null;
      this.onState = options.onState || function () {};
      this.onEnd = options.onEnd || function () {};
      this.onWordChange = options.onWordChange || function () {};

      this.entries = [];
      this.index = 0;
      this.current = null;
      this.frames = null;
      this.view = options.view || 'front';

      this.playing = false;
      this.loop = false;
      this.speed = 3;
      this.reduced = prefersReducedMotion();
      this.mirror = false;

      this._raf = null;
      this._start = 0;
      this._destroyed = false;
      /* guards against the end callback of a previous sequence firing
         after a new one has been started */
      this._generation = 0;
      this._active = 0;

      this._onVisibility = () => {
        if (document.hidden && this.playing) this.pause();
      };
      document.addEventListener('visibilitychange', this._onVisibility);
    }

    /* ── public API ─────────────────────────────────────────── */
    /**
     * Re-attach the viewer to freshly rendered markup (the panels rebuild
     * their DOM when an entry is opened).
     */
    bind(opts) {
      const options = opts || {};
      if (options.svg) this.svg = options.svg;
      if (this.current) {
        this._render(this._progress());
      }
    }

    setSequence(entries, startIndex) {
      this.entries = (entries || []).filter(Boolean);
      this.index = Math.max(0, Math.min(startIndex || 0, this.entries.length - 1));
      this._generation++;
      this._active = this._generation;
    }

    /**
     * Switch the viewing angle. The simulation itself is not restarted,
     * only re-rendered from the new viewpoint.
     */
    setView(viewId) {
      const next = (window.SignRenderer && SignRenderer.VIEWS[viewId]) ? viewId : 'front';
      if (next === this.view) return;
      this.view = next;
      this._render(this._progress());
      this._emit();
    }

    getView() { return this.view; }

    show(entry, opts) {
      const options = opts || {};
      if (!entry) return;
      this.current = entry;
      this.frames = SignRenderer.buildFrames(entry, {});
      this.onWordChange(entry);
      if (options.autoPlay !== false && !this.reduced) {
        this.play();
      } else {
        this._render(1);
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
      this._start = performance.now();
      this._tick();
      this._emit();
    }

    pause() {
      this.playing = false;
      if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; }
      this._emit();
    }

    toggle() {
      if (this.playing) this.pause(); else this.play();
    }

    replay() {
      this.pause();
      if (this.current) this.show(this.current, { autoPlay: !this.reduced });
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
      this._emit();
    }

    setLoop(on) {
      this.loop = !!on;
      this._emit();
    }

    /** Draw the sign at a fixed position (0..1) of its timeline. */
    seek(ratio) {
      this._render(Math.max(0, Math.min(1, ratio)));
    }

    getProgress() { return this._progress ? this._progress() : 0; }

    /** Release every resource owned by this viewer. */
    destroy() {
      this._destroyed = true;
      document.removeEventListener('visibilitychange', this._onVisibility);
      if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; }
    }

    /* ── internals ───────────────────────────────────────────── */
    _progress() {
      if (!this.frames || !this.frames.duration) return 0;
      if (!this.playing) return this._lastProgress || 0;
      /* performance.now() is in milliseconds, the clip duration is in
         seconds — convert before comparing */
      const elapsed = (performance.now() - this._start) / 1000 * (SPEED_TIME_SCALE[this.speed] || 1);
      return Math.min(1, elapsed / this.frames.duration);
    }

    _render(ratio) {
      if (!this.svg || !this.current) return;
      this._lastProgress = ratio;
      SignRenderer.render(this.svg, this.current, {
        view: this.view, progress: ratio, frames: this.frames, mirror: this.mirror
      });
    }

    /** Mirror the scene left/right (the signer's left hand becomes right). */
    setMirror(on) {
      this.mirror = !!on;
      this._render(this._progress());
      this._emit();
    }

    _tick() {
      const self = this;
      function loop() {
        if (self._destroyed || !self.playing) return;
        const ratio = self._progress();
        self._render(ratio);
        self._emit({ progress: ratio });
        if (ratio >= 1) {
          self._handleEnd();
          return;
        }
        self._raf = requestAnimationFrame(loop);
      }
      this._raf = requestAnimationFrame(loop);
    }

    _handleEnd() {
      if (this._destroyed) return;
      if (this._generation !== this._active) return;   /* a stale sequence */
      if (this.loop) {
        this._start = performance.now();
        this._tick();
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
        playing: this.playing,
        loop: this.loop,
        speed: this.speed,
        reduced: this.reduced,
        index: this.index,
        total: this.entries.length,
        entry: this.current,
        view: this.view,
        progress: this.getProgress()
      };
      if (extra) Object.assign(state, extra);
      try { this.onState(state); } catch (e) { /* a UI error must never break playback */ }
    }
  }

  return { Viewer: Viewer, SPEED_TIME_SCALE: SPEED_TIME_SCALE, BASE_DURATION: BASE_DURATION };
})();

if (typeof window !== 'undefined') window.SignViewer = SignViewer;
