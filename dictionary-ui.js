/* =====================================================================
   SignVerse — ISL DICTIONARY USER INTERFACE
   ---------------------------------------------------------------------
   Provides the Dictionary tab:
     • fast search across English, Hindi, synonyms and word senses
     • category + status filters
     • a detail view with the term, meaning, demonstration, verification
       status, source attribution and licence information
     • sense selection (one word can carry several meanings)
     • variant selection (alternate / regional signs)
     • favourites + learning progress integration
     • empty / loading / unavailable states
   ===================================================================== */

const DictionaryUI = (function () {
  let els = {};
  let viewer = null;
  let currentEntry = null;
  let currentSense = 0;
  let currentVariant = null;
  let searchTimer = null;

  /* ── small helpers ─────────────────────────────────────────── */
  function esc(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function favSet() {
    return (typeof favSigns !== 'undefined' && favSigns) ? favSigns : new Set();
  }

  function learnedSet() {
    return (typeof learnedSigns !== 'undefined' && learnedSigns) ? learnedSigns : new Set();
  }

  function persistFavs() {
    if (typeof favSigns !== 'undefined' && favSigns) {
      localStorage.setItem('sv-favs', JSON.stringify([...favSigns]));
    }
  }

  function persistLearned() {
    if (typeof learnedSigns !== 'undefined' && learnedSigns) {
      localStorage.setItem('sv-learned', JSON.stringify([...learnedSigns]));
    }
  }

  function statusBadge(entry) {
    const st = ISLDictionary.statusOf(entry);
    return '<span class="st-badge st-' + st.tone + '" title="' + esc(st.detail) + '">' + esc(st.label) + '</span>';
  }

  /* ── results list ──────────────────────────────────────────── */
  function renderResults(results, query) {
    const box = els.results;
    if (!box) return;
    box.innerHTML = '';
    if (!results.length) {
      box.innerHTML = '<div class="dict-empty">' +
        '<div class="dict-empty-ico">🔍</div>' +
        '<div class="dict-empty-t">No ISL entry matches “' + esc(query) + '”</div>' +
        '<div class="dict-empty-s">Try the English word, the Hindi word (e.g. <b>नमस्ते</b>), a synonym, or pick a category. ' +
        'The official ISLRTC dictionary linked in the detail panel has far more entries than the offline lexicon.</div></div>';
      return;
    }
    const frag = document.createDocumentFragment();
    results.slice(0, 120).forEach(function (r) {
      const e = r.entry;
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'dict-item';
      item.setAttribute('role', 'option');
      item.dataset.id = e.id;
      if (currentEntry && currentEntry.id === e.id) item.classList.add('sel');
      const syn = (e.synonyms || []).slice(0, 3).join(', ');
      item.innerHTML =
        '<div class="dict-item-main">' +
        '<span class="dict-item-term">' + esc(e.en) + '</span>' +
        '<span class="dict-item-hi">' + esc(e.hi) + '</span>' +
        '</div>' +
        '<div class="dict-item-meta">' +
        '<span class="dict-item-cat">' + esc(e.catLabel) + '</span>' +
        (e.senses.length > 1 ? '<span class="dict-item-sense">' + e.senses.length + ' meanings</span>' : '') +
        (e.variants.length ? '<span class="dict-item-var">⇄ variant</span>' : '') +
        statusBadge(e) +
        '</div>' +
        (syn ? '<div class="dict-item-syn">' + esc(syn) + '</div>' : '');
      item.addEventListener('click', function () { openDetail(e.id); });
      frag.appendChild(item);
    });
    box.appendChild(frag);
    if (results.length > 120) {
      const more = document.createElement('div');
      more.className = 'dict-more';
      more.textContent = 'Showing 120 of ' + results.length + ' matches — refine your search.';
      box.appendChild(more);
    }
  }

  /* ── detail view ───────────────────────────────────────────── */
  function senseTabs(entry) {
    if (!entry.senses.length) return '';
    return entry.senses.map(function (s, i) {
      return '<button type="button" class="sense-tab' + (i === currentSense ? ' on' : '') + '" data-sense="' + i + '">' +
        esc(s.text) + '</button>';
    }).join('');
  }

  function variantTabs(entry) {
    const variants = ISLDictionary.variantsOf(entry);
    const parents = ISLDictionary.variantParents(entry.id);
    let html = '';
    if (variants.length) {
      html += '<div class="detail-sub">Alternate signs for this meaning</div><div class="variant-row">' +
        '<button type="button" class="variant-tab' + (!currentVariant ? ' on' : '') + '" data-variant="">Primary sign</button>';
      variants.forEach(function (v) {
        html += '<button type="button" class="variant-tab' + (currentVariant === v.entry.id ? ' on' : '') +
          '" data-variant="' + esc(v.entry.id) + '" title="' + esc(v.meta.note || '') + '">' +
          esc(v.entry.en) + ' <span class="variant-type">' + esc(v.meta.type || 'alternate') + '</span></button>';
      });
      html += '</div>';
    }
    if (parents.length) {
      html += '<div class="detail-sub">Also used for</div><div class="variant-row">' +
        parents.map(function (p) {
          return '<button type="button" class="variant-tab" data-variant="' + esc(p.id) + '">' + esc(p.en) + '</button>';
        }).join('') + '</div>';
    }
    return html;
  }

  function sourceBlock(entry) {
    const refs = ISLSources.references(entry.en);
    const srcs = (entry.sources || []).map(function (id) {
      const s = ISLSources.get(id);
      if (!s) return '';
      return '<li><b>' + esc(s.title) + '</b><br><span class="src-meta">' + esc(s.publisher) + '</span><br>' +
        '<span class="src-lic"><b>Usage:</b> ' + esc(s.license) + '</span>' +
        (s.licenseUrl ? ' <a href="' + esc(s.licenseUrl) + '" target="_blank" rel="noopener noreferrer">licence / policy</a>' : '') +
        '</li>';
    }).join('');
    const links = refs.map(function (r) {
      if (!r.url) {
        return '<li class="src-offline"><b>' + esc(r.title) + '</b> — ' + esc(r.hint) + '</li>';
      }
      return '<li><a href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">' + esc(r.label) + ' ↗</a>' +
        '<span class="src-hint">' + esc(r.hint) + '</span>' +
        '<span class="src-need">Needs an internet connection</span></li>';
    }).join('');
    return '<div class="detail-sub">Source &amp; attribution</div>' +
      '<ul class="src-list">' + srcs + '</ul>' +
      '<div class="detail-sub">Watch the official demonstration</div>' +
      '<ul class="src-list">' + links + '</ul>' +
      '<p class="src-foot">ISLRTC videos are streamed from the official site — they are never downloaded or bundled with SignVerse. ' +
      'SignVerse is not affiliated with ISLRTC; the offline lexicon is an approximation and every entry says so.</p>';
  }

  function renderDetail(entry) {
    const box = els.detail;
    if (!box) return;
    const st = ISLDictionary.statusOf(entry);
    const isFav = favSet().has(entry.id);
    const isLearned = learnedSet().has(entry.id);

    box.innerHTML =
      '<div class="detail-head">' +
      '<div>' +
      '<div class="detail-term">' + esc(entry.en) + '</div>' +
      '<div class="detail-hi">' + esc(entry.hi) + '</div>' +
      '</div>' +
      '<div class="detail-actions">' +
      '<button type="button" class="detail-btn" id="dict-fav" aria-pressed="' + (isFav ? 'true' : 'false') + '">' +
      (isFav ? '💛 Saved' : '☆ Save') + '</button>' +
      '<button type="button" class="detail-btn" id="dict-learned" aria-pressed="' + (isLearned ? 'true' : 'false') + '">' +
      (isLearned ? '✓ Learned' : 'Mark learned') + '</button>' +
      '</div>' +
      '</div>' +
      '<div class="detail-badges">' + statusBadge(entry) +
      '<span class="st-badge st-neutral">' + esc(entry.catLabel) + '</span>' +
      '<span class="st-badge st-neutral">' + (entry.hands === 'both' ? '🙌 Two hands' : '✋ One hand') + '</span>' +
      '<span class="st-badge st-neutral">' + esc(entry.type) + '</span>' +
      '</div>' +
      '<div class="detail-note ' + (st.tone === 'ok' ? 'note-ok' : 'note-warn') + '">' +
      '<b>' + esc(st.label) + '.</b> ' + esc(st.detail) +
      ' The ISLRTC demonstration video is the reference for this sign.' +
      '</div>' +
      '<div class="detail-sub">Meaning' + (entry.senses.length > 1 ? ' (choose the one you need)' : '') + '</div>' +
      '<div class="sense-row">' + senseTabs(entry) + '</div>' +
      '<div class="detail-sense-note">' + esc((entry.senses[currentSense] || {}).note || '') + '</div>' +
      variantTabs(entry) +
      '<div class="detail-sub">Demonstration</div>' +
      '<div class="detail-demo">' +
      '<div class="detail-stage" id="dict-stage">' +
      '<svg id="dict-svg" viewBox="0 0 480 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet"></svg>' +
      '</div>' +
      '<div class="view-switch" id="dict-views" role="group" aria-label="Viewing angle of the signer">' +
      '<button type="button" class="view-btn on" data-view="front" aria-pressed="true" title="Frontal view of the signer">Front</button>' +
      '<button type="button" class="view-btn" data-view="back" aria-pressed="false" title="View from behind the signer">Back</button>' +
      '<button type="button" class="view-btn" data-view="left" aria-pressed="false" title="Left side profile of the signer">Left</button>' +
      '<button type="button" class="view-btn" data-view="right" aria-pressed="false" title="Right side profile of the signer">Right</button>' +
      '</div>' +
      '<div class="detail-controls" id="dict-controls">' +
      '<button type="button" class="ctl" id="dict-play" aria-label="Play sign">▶</button>' +
      '<button type="button" class="ctl" id="dict-replay" aria-label="Replay sign">↻</button>' +
      '<button type="button" class="ctl" id="dict-loop" aria-pressed="false" aria-label="Loop sign">🔁</button>' +
      '<a class="ctl ctl-link" id="dict-video" href="https://divyangjan.depwd.gov.in/islrtc/" target="_blank" rel="noopener noreferrer" aria-label="Open the official ISLRTC demonstration video (needs internet)" title="Official ISLRTC demonstration — needs an internet connection">🎬</a>' +
      '<div class="ctl-speed" role="group" aria-label="Playback speed">' +
      '<button type="button" class="ctl spd" data-speed="1">🐢</button>' +
      '<button type="button" class="ctl spd on" data-speed="3">🚶</button>' +
      '<button type="button" class="ctl spd" data-speed="5">🚀</button>' +
      '</div>' +
      '<div class="ctl-progress"><div class="ctl-bar"><div class="ctl-fill" id="dict-fill"></div></div></div>' +
      '<span class="ctl-mode" id="dict-mode">2D</span>' +
      '</div>' +
      '<div class="detail-instructions">Watch the movement twice, then copy it yourself — ISL signs are produced by the ' +
      'hand shape <b>and</b> the place on the body, so practise both.</div>' +
      '</div>' +
      sourceBlock(entry);

    wireDetail(entry);
  }

  function wireDetail(entry) {
    const fav = document.getElementById('dict-fav');    if (fav) {
      fav.addEventListener('click', function () {
        const set = favSet();
        if (set.has(entry.id)) set.delete(entry.id); else set.add(entry.id);
        persistFavs();
        fav.textContent = set.has(entry.id) ? '💛 Saved' : '☆ Save';
        fav.setAttribute('aria-pressed', set.has(entry.id) ? 'true' : 'false');
        if (typeof showToast === 'function') {
          showToast(set.has(entry.id) ? 'Saved to favourites 💛' : 'Removed from favourites');
        }
      });
    }
    const learned = document.getElementById('dict-learned');
    if (learned) {
      learned.addEventListener('click', function () {
        const set = learnedSet();
        if (set.has(entry.id)) set.delete(entry.id); else set.add(entry.id);
        persistLearned();
        learned.textContent = set.has(entry.id) ? '✓ Learned' : 'Mark learned';
        learned.setAttribute('aria-pressed', set.has(entry.id) ? 'true' : 'false');
        if (typeof updateProgressRing === 'function') updateProgressRing();
        if (typeof showToast === 'function') {
          showToast(set.has(entry.id) ? 'Added to your learning progress ✓' : 'Removed from your learning progress');
        }
      });
    }

    els.detail.querySelectorAll('.sense-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentSense = parseInt(btn.dataset.sense, 10) || 0;
        els.detail.querySelectorAll('.sense-tab').forEach(function (b) { b.classList.toggle('on', b === btn); });
        const note = els.detail.querySelector('.detail-sense-note');
        const s = entry.senses[currentSense];
        if (note && s) note.textContent = s.note || '';
      });
    });

    els.detail.querySelectorAll('.variant-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = btn.dataset.variant;
        currentVariant = id || null;
        els.detail.querySelectorAll('.variant-tab').forEach(function (b) { b.classList.toggle('on', b === btn); });
        const target = id ? ISLDictionary.get(id) : entry;
        if (target) {
          currentEntry = target;
          loadDemo(target);
        }
      });
    });

    /* playback controls */
    const playBtn = document.getElementById('dict-play');
    const replayBtn = document.getElementById('dict-replay');
    const loopBtn = document.getElementById('dict-loop');

    ensureViewer();
    viewer.bind({ svg: document.getElementById('dict-svg') });

    if (playBtn) playBtn.addEventListener('click', function () { viewer.toggle(); });
    if (replayBtn) replayBtn.addEventListener('click', function () { viewer.replay(); });
    if (loopBtn) loopBtn.addEventListener('click', function () { viewer.setLoop(!viewer.loop); });

    wireViewSwitch(document.getElementById('dict-views'), viewer);
    const videoLink = document.getElementById('dict-video');
    if (videoLink) {
      videoLink.href = 'https://divyangjan.depwd.gov.in/islrtc/';
      videoLink.title = 'Official ISLRTC demonstration for “' + entry.en + '” — opens the official dictionary (needs an internet connection)';
    }    els.detail.querySelectorAll('.ctl.spd').forEach(function (btn) {
      btn.addEventListener('click', function () {
        els.detail.querySelectorAll('.ctl.spd').forEach(function (b) { b.classList.toggle('on', b === btn); });
        viewer.setSpeed(parseInt(btn.dataset.speed, 10) || 3);
      });
    });
  }

  /**
   * Create the demonstration viewer once. The state callback looks the
   * elements up by id every time so that it keeps working when the
   * detail panel is re-rendered.
   */
  function ensureViewer() {
    if (viewer) return viewer;
    viewer = new SignViewer.Viewer({
      svg: document.getElementById('dict-svg'),
      view: (typeof signView !== 'undefined' && signView) ? signView : 'front',
      onState: function (state) {
        const fill = document.getElementById('dict-fill');
        const playBtn = document.getElementById('dict-play');
        const modeEl = document.getElementById('dict-mode');
        const loopBtn = document.getElementById('dict-loop');
        if (fill) fill.style.width = Math.round((state.progress || 0) * 100) + '%';
        if (playBtn) {
          playBtn.textContent = state.playing ? '⏸' : '▶';
          playBtn.setAttribute('aria-label', state.playing ? 'Pause sign' : 'Play sign');
        }
        if (modeEl) {
          const view = SignRenderer.VIEWS[state.view] || SignRenderer.VIEWS.front;
          modeEl.textContent = view.label.toUpperCase() + ' VIEW';
          modeEl.title = view.hint;
        }
        if (loopBtn) loopBtn.setAttribute('aria-pressed', state.loop ? 'true' : 'false');
      }
    });
    if (typeof window !== 'undefined') window.__dictViewer = viewer;
    return viewer;
  }

  function loadDemo(entry) {
    if (!viewer) return;
    viewer.setSequence([entry], 0);
    viewer.show(entry, { autoPlay: true });
  }

  function openDetail(id) {
    const entry = ISLDictionary.get(id);
    if (!entry) {
      if (els.detail) {
        els.detail.innerHTML =
          '<div class="dict-empty">' +
          '<div class="dict-empty-ico">\uD83D\uDD0D</div>' +
          '<div class="dict-empty-t">This entry is not in the offline lexicon</div>' +
          '<div class="dict-empty-s">The word could not be resolved. Open the official ISLRTC dictionary ' +
          'to see the reference demonstration for it.</div></div>';
      }
      return;
    }
    currentEntry = entry;
    currentSense = 0;
    currentVariant = null;
    renderDetail(entry);
    loadDemo(entry);
    els.results.querySelectorAll('.dict-item').forEach(function (n) {
      n.classList.toggle('sel', n.dataset.id === id);
    });
    if (window.innerWidth < 860) {
      els.detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* ── search plumbing ───────────────────────────────────────── */
  function runSearch() {
    const q = els.input ? els.input.value.trim() : '';
    const cat = els.cat ? els.cat.value : '';
    const status = els.status ? els.status.value : '';
    let results = ISLDictionary.search(q, { category: cat || undefined });
    if (status === 'verified') {
      results = results.filter(function (r) {
        const s = ISLDictionary.statusOf(r.entry);
        return s.tone === 'ok';
      });
    } else if (status === 'unverified') {
      results = results.filter(function (r) {
        const s = ISLDictionary.statusOf(r.entry);
        return s.tone !== 'ok';
      });
    }
    renderResults(results, q);
  }

  function scheduleSearch() {
    if (searchTimer) clearTimeout(searchTimer);
    els.results.classList.add('loading');
    searchTimer = setTimeout(function () {
      runSearch();
      els.results.classList.remove('loading');
    }, 120);
  }

  function buildCategoryChips() {
    const wrap = els.cats;
    if (!wrap) return;
    wrap.innerHTML = '';
    ISLDictionary.categories().forEach(function (c) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cat-chip';
      b.dataset.cat = c.id;
      b.innerHTML = c.emoji + ' ' + esc(c.label) + ' <span class="cat-count">' + c.count + '</span>';
      b.addEventListener('click', function () {
        const active = b.classList.contains('on');
        wrap.querySelectorAll('.cat-chip').forEach(function (x) { x.classList.remove('on'); });
        if (active) {
          els.cat.value = '';
        } else {
          b.classList.add('on');
          els.cat.value = c.id;
        }
        runSearch();
      });
      wrap.appendChild(b);
    });
  }

  function init() {
    els.input = document.getElementById('dict-q');
    els.cat = document.getElementById('dict-cat');
    els.status = document.getElementById('dict-status');
    els.results = document.getElementById('dict-results');
    els.detail = document.getElementById('dict-detail');
    els.cats = document.getElementById('dict-cats');
    if (!els.input || !els.results || !els.detail) return;

    /* category <select> */
    if (els.cat) {
      ISLDictionary.categories().forEach(function (c) {
        const o = document.createElement('option');
        o.value = c.id;
        o.textContent = c.emoji + ' ' + c.label;
        els.cat.appendChild(o);
      });
      els.cat.addEventListener('change', function () {
        els.cats.querySelectorAll('.cat-chip').forEach(function (x) {
          x.classList.toggle('on', x.dataset.cat === els.cat.value);
        });
        runSearch();
      });
    }
    if (els.status) els.status.addEventListener('change', runSearch);

    els.input.addEventListener('input', scheduleSearch);
    els.input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const first = els.results.querySelector('.dict-item');
        if (first) first.click();
      }
    });

    buildCategoryChips();
    runSearch();
  }

  return {
    init: init,
    open: openDetail,
    search: function (q) {
      if (els.input) els.input.value = q;
      runSearch();
    },
    refresh: runSearch,
    destroy: function () {
      if (viewer) { viewer.destroy(); viewer = null; }
    }
  };
})();

if (typeof window !== 'undefined') window.DictionaryUI = DictionaryUI;
