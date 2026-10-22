# SignVerse

**SignVerse — a learning app for Indian Sign Language (ISL).**
It turns typed English or Hindi into ISL signs, lets you look words up in a
source-attributed dictionary, and lets you practise with quizzes, flashcards,
favourites and progress tracking.

> **Accuracy first.** ISL is a full language, not a word-for-word substitute for
> English. SignVerse shows **word-by-word demonstrations** and links to the
> official ISLRTC dictionary — it never pretends that a literal English
> sentence is a validated ISL translation, and it never presents an
> unverified local animation as an authentic ISL sign.

---

## 1. What changed in this release

| Area | Before | Now |
| --- | --- | --- |
| Dictionary | hard-coded ASL-style sign table (`S` in `animation.js`) | source-backed ISL lexicon (`isl-dictionary.js`) with English **and** Hindi glosses, word senses, synonyms, alternate/regional variants, source attribution and licence notes |
| Animation | one reusable SVG hand, the same motion for every word | a **rigged 3D avatar** (Three.js) with independently articulated fingers/thumbs, IK-solved arms, per-word handshape, body location, movement path, repetitions and timing — plus the old 2D renderer as a fallback |
| Controls | pause / skip only | play · pause · replay · loop · skip · slow/normal/fast, progress bar, current-word indicator, reduced-motion support |
| Search | none | fast English + Hindi + synonym + sense search, category filters, status filters, empty/loading/unavailable states |
| Verification | none | explicit statuses (`reviewed-3d`, `verified-video`, `unverified`, `unavailable`) shown on every entry, with a visible notice when a sign is only an approximation |

The camera-based recogniser (`#panel-recognize`, MediaPipe/TF.js pipeline in
`features.js`) is **out of scope and untouched** — its markup, handlers,
canvases and styles are unchanged.

---

## 2. Sources, attribution and licensing

| Source | What we use | Usage decision |
| --- | --- | --- |
| [ISLRTC online ISL dictionary](https://divyangjan.depwd.gov.in/islrtc/) — ISLRTC, DEPwD, Govt. of India | The authoritative dictionary (word senses, synonyms, alternate and regional signs, multi-language entries) | **Linked, never mirrored.** DEPwD's copyright policy states that its contents may not be reproduced partially or fully without permission, so no ISLRTC video, image or dataset is downloaded, bundled or embedded here. |
| [ISLRTC institutional site](https://islrtc.nic.in/) | Dictionary website / dataset / YouTube / "Sign Learn" pointers, licence text | Linked with attribution |
| [ISL dictionary dataset (ISLRTC, Google Drive)](https://drive.google.com/drive/folders/1U-Pr4r1-cupgNOOq9NH_uTsQnPSVEKco) | Official dictionary media + metadata folder | Linked, not redistributed |
| [ISLRTC dictionary videos on YouTube](https://www.youtube.com/@ISLRTC) | Public demonstrations | Linked, not re-hosted |
| [data.gov.in — Indian Sign Language Dictionary](https://data.gov.in/catalog/indian-sign-language-dictionary) | Open-government-data catalogue metadata | Linked (GoD licence as stated on the catalogue page) |
| [ARGISL / RKMVERI ISL generation research](https://cs.rkmvu.ac.in/~isl/) | Supplementary reference for sign motion conventions | Linked for reference only (© CS, RKMVERI) |
| **SignVerse local lexicon** (`isl-dictionary.js`) | Handshape + motion + location descriptions written for this project, and the procedural 3D avatar | Our own material: **CC BY 4.0** for the text/description data, **MIT** for the code. Every entry is labelled as an *approximation* unless a human reviewer signed it off. |

The registry with all URLs, publishers, licence notes and per-term adapters
lives in **`isl-sources.js`** (`ISLSources`). The UI prints the attribution
next to every external link and marks links that need an internet connection.

### Verification statuses

| Status | Meaning |
| --- | --- |
| `verified-video` | An ISLRTC demonstration video is the reference for this sign (linked, never embedded). |
| `reviewed-3d` | A human reviewer compared the local 3D animation with the official reference and signed it off. |
| `unverified` | The local animation is an approximation written for SignVerse. **Not** validated against an ISLRTC video. Shown with a warning badge and an explicit notice. |
| `unavailable` | No demonstration exists yet; the entry explains why and still links to the official dictionary. |

No entry is marked verified on the basis of a plausible-looking description.

---

## 3. Architecture

```
index.html          markup (Translate · Dictionary · Quiz · Learn · Recognise)
style.css           design system, new dictionary/3D components, a11y, reduced motion
isl-sources.js      source registry + source adapters (attribution, licences, links)
isl-dictionary.js   the ISL lexicon: senses, Hindi glosses, synonyms, variants, statuses
sign-clips.js       sign → keyframe poses (handshape, body location, movement path)  [no rendering code]
sign-rig.js         procedural Three.js avatar: rig, IK, materials, lights, mixer, disposal
sign-viewer.js      demonstration controller: 3D/2D switching, play/pause/replay/loop/skip, speeds, progress
dictionary-ui.js    Dictionary tab: search, filters, result list, detail view, states
features.js         gamification, learn engine, camera recogniser (unchanged camera code)
animation.js        legacy SVG hand renderer (2D fallback), translate queue, tabs, quiz
```

Data and rendering are kept apart: `isl-dictionary.js` (metadata) →
`sign-clips.js` (motion data) → `sign-rig.js` (renderer) → `sign-viewer.js`
(playback controller).

### The 3D avatar

* **Procedural, code-generated rig** — no third-party model is downloaded, so
  nothing is redistributed and the avatar weighs kilobytes of source instead of
  megabytes of GLB:
  `root → torso → neck → head` and
  `torso → shoulder → upperArm → elbow → forearm → wrist → palm → 4 fingers × (MCP/PIP/DIP) + 2 thumb joints`.
* **Human proportions and a face** — the head has eyes, brows, nose, mouth,
  ears and hair; the limbs are tapered bones with rounded joints so the arm
  reads as one continuous limb instead of a chain of beads.
* **Two-link IK with a pole vector** places the elbow on the circle of valid
  solutions, closest to a natural "elbow down and slightly out" direction, so
  the arm looks human instead of mechanical.
* **Camera framing follows the sign.** For every clip the camera computes the
  box that contains the head *and* the path of the hands and frames it with a
  margin — the handshape, the part a learner has to read, is always large
  enough to see and never leaves the frame.
* **Every word gets its own clip.** A clip is generated from the entry's
  handshape, body location, movement path, repetition count and timing — so
  `HELLO` (forehead, arc), `EAT` (mouth, tap ×3) and `LOVE` (two hands,
  crossed over the chest) are genuinely different motions. Clips are built
  with `THREE.AnimationClip` + `AnimationMixer` on demand and cached per entry.
* **Lazy loading** — Three.js is fetched from a CDN only when the first sign
  is demonstrated, and the 3D renderer is never initialised for the quiz,
  the flashcards or the camera tab.
* **Graceful degradation** — if WebGL or the CDN is unavailable, the viewer
  switches to the existing 2D SVG renderer and says so in the UI; nothing
  else in the application breaks.
* **Clean teardown** — `Avatar.dispose()` releases geometries, materials, the
  renderer, the WebGL context and the animation mixer; the viewer cancels
  animation frames and removes its listeners.

---

## 4. Running it

No build step. Serve the folder over HTTP (a `file://` page cannot fetch the
Three.js ES module reliably):

```bash
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```

Everything except the optional 3D enhancement works offline.

---

## 5. Testing performed

* `node --check` on every JavaScript file (syntax).
* Headless Chromium (Puppeteer + system Chromium, SwiftShader WebGL) end-to-end
  script covering: page load, English search, Hindi search, missing-term empty
  state, detail view (senses, variants, sources, status), 3D activation,
  playback controls, translate queue, pause/skip/speed, unknown words, Learn
  tab, quiz answering, favourites/learned persistence, theme toggle, tab
  switching with 3D teardown, and the camera panel's element integrity —
  **0 console errors, 0 page errors**.
* Manual diff review: the camera panel (`#panel-recognize`) and its handlers
  are byte-identical to `main`.
* Mobile pass at 390 × 844 (headless Chromium): no horizontal overflow, the
  navigation scrolls, the dictionary stacks into a single column and the 3D
  canvas resizes with the stage.

---

## 6. Known limitations

* The offline lexicon holds ~150 curated words; it is **not** the ISLRTC
  dictionary (which contains thousands of entries). Words outside the lexicon
  are fingerspelled when short, otherwise the app points you at the official
  dictionary.
* Every bundled 3D animation is currently marked **`unverified`** — an
  approximation written for SignVerse. A human reviewer must compare it with
  the ISLRTC demonstration before an entry can be promoted to `reviewed-3d`.
* ISL has strong regional variation. The lexicon documents the alternate signs
  it knows about; the regional variants that only exist in the official
  dictionary are reachable through the link, not mirrored.
* The 3D avatar is a stylised low-poly figure, not a photoreal human, and the
  camera angle is fixed (front view). Mirror mode is available in the Learn tab.
* The quiz still renders the 2D illustration for speed; the dictionary and
  translation views use the 3D avatar.
* The recogniser tab still works with the legacy ASL-style letter table —
  it was explicitly out of scope for this release.

---

## 7. Licence

* Code: **MIT** (see the repository).
* Lexicon descriptions and handshape/motion data: **CC BY 4.0**.
* ISLRTC / DEPwD content is **not** redistributed; it is linked with
  attribution as required by the DEPwD copyright policy.
