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

## 1. What is in this release

| Area | State |
| --- | --- |
| Dictionary | Source-backed ISL lexicon (`isl-dictionary.js`) with English **and** Hindi glosses, word senses, synonyms, alternate/regional variants, source attribution and licence notes |
| Simulation | A **2D multi-view renderer** (`sign-renderer.js`): the signer is modelled in 3D and projected onto SVG, so the same sign can be seen from the **front, the back, the left profile and the right profile** — real rotations of the same model, not mirrored copies |
| Controls | Play · pause · replay · loop · skip, slow/normal/fast, progress bar, current-word indicator, reduced-motion support |
| Search | Fast English + Hindi + synonym + sense search, category filters, status filters, empty/loading/unavailable states |
| Verification | Explicit statuses (`reviewed-3d` → *reviewed animation*, `verified-video`, `unverified`, `unavailable`) shown on every entry, with a visible notice when a sign is only an approximation |
| Audit | `tools/audit-dictionary.js` checks **every** entry (shape, location, movement, resolvability, duplicate animations) and writes an inventory to `docs/` |

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
| **SignVerse local lexicon** (`isl-dictionary.js`) | Handshape + motion + location descriptions written for this project, and the multi-view renderer | Our own material: **CC BY 4.0** for the text/description data, **MIT** for the code. Every entry is labelled as an *approximation* unless a human reviewer signed it off. |

The registry with all URLs, publishers, licence notes and per-term adapters
lives in **`isl-sources.js`** (`ISLSources`). The UI prints the attribution
next to every external link and marks links that need an internet connection.

### Verification statuses

| Status | Meaning |
| --- | --- |
| `verified-video` | An ISLRTC demonstration video is the reference for this sign (linked, never embedded). |
| `reviewed-3d` | A human reviewer compared the local animation with the official reference and signed it off. |
| `unverified` | The local animation is an approximation written for SignVerse. **Not** validated against an ISLRTC video. Shown with a warning badge and an explicit notice. |
| `unavailable` | No demonstration exists yet; the entry explains why and still links to the official dictionary. |

No entry is marked verified on the basis of a plausible-looking description.

---

## 3. Architecture

```
index.html          markup (Translate · Dictionary · Quiz · Learn · Recognise)
style.css           design system, dictionary/angle components, a11y, reduced motion
isl-sources.js      source registry + source adapters (attribution, licences, links)
isl-dictionary.js   the ISL lexicon: senses, Hindi glosses, synonyms, variants, statuses
sign-clips.js       sign → keyframe poses (handshape, body location, movement path)  [no rendering code]
sign-renderer.js    the multi-view 2D renderer: 3D model → SVG projection, 4 angles
sign-viewer.js      demonstration controller: play/pause/replay/loop/skip, speeds, progress, angles
dictionary-ui.js    Dictionary tab: search, filters, result list, detail view, states
features.js         gamification, learn engine, camera recogniser (unchanged camera code)
animation.js        legacy flat hand renderer (ASL letter preview of the recogniser),
                    translate queue, quiz, tabs, angle wiring
tools/audit-dictionary.js   offline integrity check for every lexicon entry
docs/isl-audit.md   the generated inventory of all entries
```

Data and rendering are kept apart: `isl-dictionary.js` (metadata) →
`sign-clips.js` (motion data) → `sign-renderer.js` (renderer) →
`sign-viewer.js` (playback controller).

### The simulation and the four viewing angles

The signer (head, torso, arms, hands with five articulated fingers) is modelled
in 3D and **projected** onto the SVG stage. That is what makes the four views
genuine instead of faked:

* **Front** — the signer faces the viewer.
* **Back** — the camera moves behind the signer; the hair, the shoulders and
  the hands are seen from behind (the right hand appears on the right, as it
  must when you stand behind someone).
* **Left** / **Right** — true side profiles: the nose, the ear and the profile
  of the hand show which way the signer is facing.

Because all four views come from the same model and the same frame data, the
handshape, the arm, the body orientation and the timing stay consistent
between them. The depth sorting (painter's algorithm) makes the near hand
cover the far hand, and the elbow is solved with a pole-vector IK so the arm
looks the same from every side.

The front view is the refined version of the original flat hand: the fingers
are separate tapered segments with knuckles, the palm is a solid slab with
volume, the thumb has its own articulation, the hand keeps a correct palm
orientation and the camera frames the head **and** the path of the hands so
that nothing leaves the frame.

### Keyboard, motion and accessibility

* Every control is a real `<button>` with an accessible name; the angle
  switcher is a labelled radio-style group with `aria-pressed`.
* `prefers-reduced-motion` disables the CSS animations and stops the
  simulation from auto-playing (the sign is shown as a static pose).
* Visible `:focus-visible` outlines, screen-reader labels for the search
  fields and the result list, and responsive layouts down to 390 px.

---

## 4. Running it

No build step. Serve the folder over HTTP:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```

Everything works offline — there are no external assets and no CDN dependency.

---

## 5. Checks that are run

```bash
node --check *.js                     # syntax of every script
node tools/audit-dictionary.js        # integrity of all 187 lexicon entries
node tools/audit-dictionary.js --json --md   # + docs/isl-audit.{json,md}
```

Browser checks (headless Chromium, Puppeteer):

* page load, English search, Hindi search, missing-term empty state;
* dictionary detail (senses, variants, sources, verification status);
* **all four angles** in the dictionary, the translation stage and the learn
  panel — switching an angle must not restart the simulation;
* playback controls, loop, speed changes, pause/resume, skip;
* the translation queue, unknown words, the quiz, favourites and learned
  progress, the theme;
* **every entry rendered in all four views** (187 × 4 = 748 renders, 0 empty);
* the camera panel's element integrity (unchanged);
* 390 × 844 mobile viewport, no horizontal overflow.

---

## 6. Known limitations

* The offline lexicon holds 187 curated entries (151 words, 26 manual-alphabet
  letters, 10 numbers). It is **not** the ISLRTC dictionary, which contains
  thousands of entries. Words outside the lexicon are fingerspelled when
  short, otherwise the app points you at the official dictionary.
* **Every bundled animation is still `unverified`** — an approximation written
  for SignVerse. A human reviewer must compare it with the ISLRTC
  demonstration before an entry can be promoted to `reviewed-3d`.
* ISL has strong regional variation. The lexicon documents the alternate signs
  it knows about; the regional variants that only exist in the official
  dictionary are reachable through the link, not mirrored.
* The renderer is a stylised 2D figure. It shows the hand shape, the palm
  orientation and the movement path faithfully, but it is not a photographic
  human — use the linked ISLRTC video to check the exact execution.
* The recogniser tab still uses the legacy ASL-style letter table — it was
  explicitly out of scope for this release.

---

## 7. Licence

* Code: **MIT** (see the repository).
* Lexicon descriptions and handshape/motion data: **CC BY 4.0**.
* ISLRTC / DEPwD content is **not** redistributed; it is linked with
  attribution as required by the DEPwD copyright policy.
