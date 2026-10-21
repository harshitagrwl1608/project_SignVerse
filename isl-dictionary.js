/* =====================================================================
   SignVerse — ISL LEXICON (offline fallback dataset)
   ---------------------------------------------------------------------
   Each entry describes ONE Indian Sign Language sign as it is used in
   everyday ISL. The data is deliberately layered:

     • `senses`   – the different meanings a word can carry. A word is
                    never assumed to map onto a single "universal" sign.
     • `synonyms` – other English words covered by the same sign.
     • `variants` – alternate / regional signs for the same meaning.
     • `hs`       – handshape (0 = extended, 1 = curved, 2 = folded,
                    thumb uses the names understood by the 2D renderer).
     • `loc`      – where the sign is performed (forehead, cheek, chin,
                    chest, neutral, …). Real ISL signs are strongly
                    anchored to the body.
     • `path`     – the movement path of the hand.
     • `status`   – verification status of the *local* demonstration.
                    `unverified`  → description written for SignVerse,
                                     NOT validated against an ISLRTC video.
                    `reviewed-3d` → a human reviewer compared the local
                                     3D animation with the official
                                     reference and signed it off.

   The official ISLRTC demonstration video is always the reference. The
   local animation is an approximation unless `status === 'reviewed-3d'`,
   and the UI says so explicitly.

   Licence of the text/handshape descriptions in this file: CC BY 4.0
   (see README). No ISLRTC media is bundled — only links.
   ===================================================================== */

/* Handshape helpers: 0 extended · 1 curved · 2 folded */
const ISL_CATS = [
  { id: 'greetings', label: 'Greetings', emoji: '👋' },
  { id: 'polite', label: 'Politeness', emoji: '🙏' },
  { id: 'emotions', label: 'Emotions', emoji: '❤️' },
  { id: 'questions', label: 'Questions', emoji: '❓' },
  { id: 'pronouns', label: 'People & Pronouns', emoji: '🧑' },
  { id: 'verbs', label: 'Common Verbs', emoji: '🏃' },
  { id: 'people', label: 'Family & People', emoji: '👨‍👩‍👧' },
  { id: 'food', label: 'Food & Drink', emoji: '🍽️' },
  { id: 'numbers', label: 'Numbers', emoji: '🔢' },
  { id: 'colors', label: 'Colours', emoji: '🎨' },
  { id: 'time', label: 'Time & Daily Life', emoji: '⏰' },
  { id: 'places', label: 'Places & Objects', emoji: '🏠' }
];

const ISL_LEXICON = [
  /* ── GREETINGS ───────────────────────────────────────────────── */
  {
    id: 'HELLO', en: 'HELLO', hi: 'नमस्ते', cat: 'greetings',
    senses: [
      { text: 'greeting used when meeting somebody', note: 'Most common everyday ISL greeting.' },
      { text: 'used at the start of a conversation or a lesson', note: 'Often replaced by NAMASTE in formal settings.' }
    ],
    synonyms: ['GREETING', 'HI', 'NAMASTE'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'forehead', hands: 'right',
    path: { t: 'arc', dx: 40, dy: -12 }, reps: 1, w: 22, status: 'unverified',
    variants: [{ id: 'NAMASTE', type: 'alternate', note: 'Palms joined at the chest — used in formal and respectful contexts.' }]
  },
  {
    id: 'NAMASTE', en: 'NAMASTE', hi: 'नमस्ते', cat: 'greetings',
    senses: [{ text: 'formal greeting with joined palms', note: 'Persian/Indic influence, widely used in ISL.' }],
    synonyms: ['PRANAM', 'GREETING'],
    hs: { f: [1, 1, 1, 1, 1], th: 'o' }, loc: 'chest', hands: 'both',
    path: { t: 'in', dx: 0, dy: 6 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'GOODBYE', en: 'GOODBYE', hi: 'अलविदा', cat: 'greetings',
    senses: [
      { text: 'leaving a conversation', note: 'Wave of the open hand.' },
      { text: 'end of a message or a call', note: 'Often paired with a nod.' }
    ],
    synonyms: ['BYE', 'FAREWELL'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'cheek', hands: 'right',
    path: { t: 'wave', dx: 30, dy: 0 }, reps: 2, w: 8, status: 'unverified'
  },
  {
    id: 'GOOD_MORNING', en: 'GOOD MORNING', hi: 'सुप्रभात', cat: 'greetings',
    senses: [{ text: 'morning greeting', note: 'Hand lifts from the chest in a rising motion.' }],
    synonyms: ['MORNING'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'chest', hands: 'right',
    path: { t: 'up', dx: 0, dy: -26 }, reps: 1, w: 18, status: 'unverified'
  },
  {
    id: 'GOOD_NIGHT', en: 'GOOD NIGHT', hi: 'शुभ रात्रि', cat: 'greetings',
    senses: [{ text: 'night greeting / farewell at night', note: 'Hand lowers toward the chest.' }],
    synonyms: ['NIGHT', 'GOOD_EVENING'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'chest', hands: 'right',
    path: { t: 'down', dx: 0, dy: 24 }, reps: 1, w: -16, status: 'unverified'
  },
  {
    id: 'HOW_ARE_YOU', en: 'HOW ARE YOU', hi: 'आप कैसे हैं', cat: 'greetings',
    senses: [{ text: 'greeting question about well-being', note: 'Both hands turn upwards.' }],
    synonyms: ['HOW_R_Y', 'KAISE_HO'],
    hs: { f: [1, 0, 0, 0, 0], th: 'up' }, loc: 'chest', hands: 'both',
    path: { t: 'up', dx: 0, dy: -22 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'YES', en: 'YES', hi: 'हाँ', cat: 'greetings',
    senses: [{ text: 'affirmative answer', note: 'Head-nod like fist movement.' }],
    synonyms: ['HAAN', 'OK', 'AFFIRMATIVE'],
    hs: { f: [2, 2, 2, 2, 2], th: 'front' }, loc: 'neutral', hands: 'right',
    path: { t: 'nod', dx: 0, dy: 16 }, reps: 2, w: -10, status: 'unverified'
  },
  {
    id: 'NO', en: 'NO', hi: 'नहीं', cat: 'greetings',
    senses: [{ text: 'negative answer', note: 'Index and middle finger close onto the thumb.' }],
    synonyms: ['NAHI', 'NAHI_H', 'NOPE'],
    hs: { f: [2, 0, 0, 2, 2], th: 'side' }, loc: 'neutral', hands: 'right',
    path: { t: 'snap', dx: 0, dy: 8 }, reps: 2, w: 0, status: 'unverified'
  },
  {
    id: 'WELCOME', en: 'WELCOME', hi: 'स्वागत है', cat: 'greetings',
    senses: [{ text: 'greeting a visitor', note: 'Open hand draws inwards towards the body.' }],
    synonyms: ['SWAGAT'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'chest', hands: 'right',
    path: { t: 'arc', dx: -26, dy: 0 }, reps: 1, w: 14, status: 'unverified'
  },
  {
    id: 'EXCUSE_ME', en: 'EXCUSE ME', hi: 'माफ़ कीजिए', cat: 'greetings',
    senses: [{ text: 'getting attention politely', note: 'Light tap on the chest with fingertips.' }],
    synonyms: ['MAF_KIJIYE', 'ATTENTION'],
    hs: { f: [1, 0, 0, 0, 0], th: 'up' }, loc: 'chest', hands: 'right',
    path: { t: 'tap', dx: 0, dy: 7 }, reps: 2, w: 8, status: 'unverified'
  },

  /* ── POLITENESS ─────────────────────────────────────────────── */
  {
    id: 'THANK_YOU', en: 'THANK YOU', hi: 'धन्यवाद', cat: 'polite',
    senses: [
      { text: 'gratitude', note: 'Fingertips move forward from the chin.' },
      { text: 'formal thanks after receiving something', note: 'Both hands may be used in a formal register.' }
    ],
    synonyms: ['THANK', 'DHANYAVAAD', 'THANKS'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'chin', hands: 'right',
    path: { t: 'forward', dx: 0, dy: -22 }, reps: 1, w: 26, status: 'unverified',
    variants: [{ id: 'DHANYAVAAD', type: 'alternate', note: 'Hands joined briefly at the chest — a common spoken-ISL variant.' }]
  },
  {
    id: 'DHANYAVAAD', en: 'DHANYAVAAD', hi: 'धन्यवाद', cat: 'polite',
    senses: [{ text: 'gratitude (alternate form)', note: 'Both palms joined briefly in front of the chest.' }],
    synonyms: ['THANK_YOU'],
    hs: { f: [1, 1, 1, 1, 1], th: 'o' }, loc: 'chest', hands: 'both',
    path: { t: 'tap', dx: 0, dy: 6 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'SORRY', en: 'SORRY', hi: 'माफ़ करें', cat: 'polite',
    senses: [
      { text: 'apology', note: 'Circular movement of a flat hand on the chest.' },
      { text: 'asking forgiveness', note: 'Formal register uses both hands.' }
    ],
    synonyms: ['MAF_KAREIN', 'APOLOGY', 'SORRRY'],
    hs: { f: [2, 2, 2, 2, 2], th: 'front' }, loc: 'chest', hands: 'right',
    path: { t: 'circle', r: 20 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'PLEASE', en: 'PLEASE', hi: 'कृपया', cat: 'polite',
    senses: [{ text: 'polite request', note: 'Flat hand rubs a circle on the chest.' }],
    synonyms: ['KRIPYA'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'chest', hands: 'right',
    path: { t: 'circle', r: 16 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'GOOD', en: 'GOOD', hi: 'अच्छा', cat: 'polite',
    senses: [
      { text: 'quality judgement — good', note: 'Flat hand moves from the mouth towards the listener.' },
      { text: 'greeting response — "good"', note: 'Same root sign used in many South Asian languages.' }
    ],
    synonyms: ['ACCHA', 'FINE', 'WELL'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'mouth', hands: 'right',
    path: { t: 'forward', dx: 0, dy: -18 }, reps: 1, w: 28, status: 'unverified'
  },
  {
    id: 'BAD', en: 'BAD', hi: 'बुरा', cat: 'polite',
    senses: [{ text: 'quality judgement — bad', note: 'Hand turns away and down from the mouth.' }],
    synonyms: ['BURA', 'KHARAB'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'mouth', hands: 'right',
    path: { t: 'flip', dx: 0, dy: 18 }, reps: 1, w: -26, status: 'unverified'
  },
  {
    id: 'WELCOME_THANKS', en: 'SHUKRIYA', hi: 'शुक्रिया', cat: 'polite',
    senses: [{ text: 'thanks (Urdu/Hindi register)', note: 'Used in ISL alongside DHANYAVAAD.' }],
    synonyms: ['SHUKRIYA'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'chin', hands: 'right',
    path: { t: 'up', dx: 0, dy: -20 }, reps: 1, w: 20, status: 'unverified'
  },

  /* ── EMOTIONS ───────────────────────────────────────────────── */
  {
    id: 'LOVE', en: 'LOVE', hi: 'प्यार', cat: 'emotions',
    senses: [
      { text: 'affection between people', note: 'Both hands crossed over the chest.' },
      { text: 'liking something', note: 'Same sign, broader context.' }
    ],
    synonyms: ['PYAAR', 'PREM', 'AFFECTION'],
    hs: { f: [2, 2, 2, 2, 2], th: 'side' }, loc: 'chest', hands: 'both',
    path: { t: 'in', dx: 0, dy: 14 }, reps: 1, w: -14, status: 'unverified'
  },
  {
    id: 'HAPPY', en: 'HAPPY', hi: 'खुश', cat: 'emotions',
    senses: [{ text: 'feeling of joy', note: 'Flat hand brushes upward on the chest.' }],
    synonyms: ['KHUSH', 'HAPPINESS', 'GLAD'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'chest', hands: 'right',
    path: { t: 'up', dx: 0, dy: -26 }, reps: 2, w: 0, status: 'unverified'
  },
  {
    id: 'SAD', en: 'SAD', hi: 'उदास', cat: 'emotions',
    senses: [
      { text: 'feeling sad', note: 'Both hands slide down the face.' },
      { text: 'sorry / regret', note: 'Overlapping sense — pick the one you need.' }
    ],
    synonyms: ['UDAS', 'SORRY_FEELING'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'cheek', hands: 'both',
    path: { t: 'down', dx: 0, dy: 26 }, reps: 1, w: -18, status: 'unverified'
  },
  {
    id: 'ANGRY', en: 'ANGRY', hi: 'गुस्सा', cat: 'emotions',
    senses: [{ text: 'anger / irritation', note: 'Bent hands pull down from the face.' }],
    synonyms: ['GUSSA', 'ANGER'],
    hs: { f: [1, 1, 1, 1, 1], th: 'curve' }, loc: 'cheek', hands: 'both',
    path: { t: 'down', dx: 0, dy: 22 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'SCARED', en: 'SCARED', hi: 'डरा हुआ', cat: 'emotions',
    senses: [{ text: 'fear / fright', note: 'Both fists tremble in front of the chest.' }],
    synonyms: ['DARA', 'FEAR', 'AFRAID'],
    hs: { f: [2, 2, 2, 2, 2], th: 'front' }, loc: 'chest', hands: 'both',
    path: { t: 'shake', dx: 14, dy: 0 }, reps: 3, w: 0, status: 'unverified'
  },
  {
    id: 'EXCITED', en: 'EXCITED', hi: 'उत्साहित', cat: 'emotions',
    senses: [{ text: 'very enthusiastic', note: 'Hands brush upward on the chest with energy.' }],
    synonyms: ['UTSAHIT', 'THRILLED'],
    hs: { f: [1, 0, 2, 2, 2], th: 'up' }, loc: 'chest', hands: 'both',
    path: { t: 'circle', r: 15 }, reps: 2, w: 0, status: 'unverified'
  },
  {
    id: 'TIRED', en: 'TIRED', hi: 'थका हुआ', cat: 'emotions',
    senses: [{ text: 'fatigue', note: 'Hands droop and rotate downwards.' }],
    synonyms: ['THAKA', 'FATIGUE'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'chest', hands: 'both',
    path: { t: 'down', dx: 0, dy: 18 }, reps: 1, w: -26, status: 'unverified'
  },
  {
    id: 'SURPRISED', en: 'SURPRISED', hi: 'आश्चर्यचकित', cat: 'emotions',
    senses: [{ text: 'surprise', note: 'Open hands fly up from the cheeks.' }],
    synonyms: ['ASHRUCHCHIT', 'SURPRISE'],
    hs: { f: [0, 0, 0, 0, 0], th: 'out' }, loc: 'cheek', hands: 'both',
    path: { t: 'up', dx: 0, dy: -24 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'I_LOVE_YOU', en: 'I LOVE YOU', hi: 'मैं तुमसे प्यार करता हूँ', cat: 'emotions',
    senses: [{ text: 'declaration of love', note: 'Index, thumb and little finger extended (ILY hand).' }],
    synonyms: ['ILY'],
    hs: { f: [0, 2, 2, 2, 0], th: 'out' }, loc: 'chest', hands: 'right',
    path: { t: 'shake', dx: 9, dy: 0 }, reps: 2, w: 0, status: 'unverified'
  },
  {
    id: 'FUNNY', en: 'FUNNY', hi: 'मज़ेदार', cat: 'emotions',
    senses: [{ text: 'humorous, amusing', note: 'Finger touches the nose twice.' }],
    synonyms: ['MAZEDAR', 'AMUSING'],
    hs: { f: [2, 0, 0, 2, 2], th: 'folded' }, loc: 'nose', hands: 'right',
    path: { t: 'tap', dx: 0, dy: 4 }, reps: 2, w: 8, status: 'unverified'
  },
  {
    id: 'SHY', en: 'SHY', hi: 'शर्मीला', cat: 'emotions',
    senses: [{ text: 'bashful', note: 'Hand rises towards the face and turns away.' }],
    synonyms: ['SHARMILA'],
    hs: { f: [1, 0, 0, 0, 0], th: 'up' }, loc: 'cheek', hands: 'right',
    path: { t: 'up', dx: 0, dy: -18 }, reps: 1, w: 10, status: 'unverified'
  },
  {
    id: 'WORRIED', en: 'WORRIED', hi: 'चिंतित', cat: 'emotions',
    senses: [{ text: 'anxious / worried', note: 'Both hands turn over slowly.' }],
    synonyms: ['CHINTIT', 'ANXIOUS'],
    hs: { f: [1, 0, 0, 0, 0], th: 'up' }, loc: 'chest', hands: 'both',
    path: { t: 'rock', dx: 12, dy: 6 }, reps: 2, w: 0, status: 'unverified'
  },
  {
    id: 'PROUD', en: 'PROUD', hi: 'गर्वित', cat: 'emotions',
    senses: [{ text: 'pride', note: 'Hand moves forward from the chest, chin raised.' }],
    synonyms: ['GURVIT'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'chest', hands: 'right',
    path: { t: 'forward', dx: 0, dy: -16 }, reps: 1, w: 16, status: 'unverified'
  },

  /* ── QUESTIONS ──────────────────────────────────────────────── */
  {
    id: 'WHAT', en: 'WHAT', hi: 'क्या', cat: 'questions',
    senses: [{ text: 'question word "what"', note: 'Index finger sweeps across the open palm.' }],
    synonyms: ['KYA', 'WHAT_IS'],
    hs: { f: [0, 0, 0, 0, 0], th: 'out' }, loc: 'neutral', hands: 'both',
    path: { t: 'side', dx: 22, dy: 0 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'WHEN', en: 'WHEN', hi: 'कब', cat: 'questions',
    senses: [{ text: 'question word "when"', note: 'Index finger circles and taps.' }],
    synonyms: ['KAB'],
    hs: { f: [2, 0, 2, 2, 2], th: 'folded' }, loc: 'neutral', hands: 'right',
    path: { t: 'circle', r: 11 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'WHERE', en: 'WHERE', hi: 'कहाँ', cat: 'questions',
    senses: [{ text: 'question word "where"', note: 'Index finger shakes side to side.' }],
    synonyms: ['KAHAN', 'KAHAN_H'],
    hs: { f: [2, 0, 2, 2, 2], th: 'folded' }, loc: 'neutral', hands: 'right',
    path: { t: 'shake', dx: 13, dy: 0 }, reps: 2, w: 0, status: 'unverified'
  },
  {
    id: 'WHY', en: 'WHY', hi: 'क्यों', cat: 'questions',
    senses: [{ text: 'question word "why"', note: 'Middle finger bends down from the forehead.' }],
    synonyms: ['KYON', 'KYU'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'forehead', hands: 'right',
    path: { t: 'down', dx: 0, dy: 13 }, reps: 1, w: 18, status: 'unverified'
  },
  {
    id: 'HOW', en: 'HOW', hi: 'कैसे', cat: 'questions',
    senses: [{ text: 'question word "how"', note: 'Both flat hands turn upwards.' }],
    synonyms: ['KAISE', 'KAISE_H'],
    hs: { f: [1, 0, 0, 0, 0], th: 'up' }, loc: 'chest', hands: 'both',
    path: { t: 'up', dx: 0, dy: -18 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'WHICH', en: 'WHICH', hi: 'कौन सा', cat: 'questions',
    senses: [{ text: 'question word "which"', note: 'Both index fingers alternate up and down.' }],
    synonyms: ['KAUN_SA'],
    hs: { f: [0, 2, 2, 2, 0], th: 'out' }, loc: 'neutral', hands: 'both',
    path: { t: 'nod', dx: 0, dy: 13 }, reps: 2, w: 0, status: 'unverified'
  },
  {
    id: 'WHO', en: 'WHO', hi: 'कौन', cat: 'questions',
    senses: [{ text: 'question word "who"', note: 'Index finger circles near the mouth.' }],
    synonyms: ['KAUN'],
    hs: { f: [1, 0, 2, 2, 2], th: 'up' }, loc: 'mouth', hands: 'right',
    path: { t: 'circle', r: 11 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'WHOSE', en: 'WHOSE', hi: 'किसका', cat: 'questions',
    senses: [{ text: 'question word "whose"', note: 'Fist circles near the mouth.' }],
    synonyms: ['KISKA', 'KISKI'],
    hs: { f: [2, 2, 2, 2, 2], th: 'front' }, loc: 'mouth', hands: 'right',
    path: { t: 'circle', r: 11 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'YES_NO', en: 'YES OR NO', hi: 'हाँ या नहीं', cat: 'questions',
    senses: [{ text: 'asking for a yes/no answer', note: 'Both fists turn up and down.' }],
    synonyms: ['YES_OR_NO'],
    hs: { f: [2, 2, 2, 2, 2], th: 'front' }, loc: 'neutral', hands: 'both',
    path: { t: 'nod', dx: 0, dy: 12 }, reps: 2, w: 0, status: 'unverified'
  },

  /* ── PRONOUNS & POSSESSIVES ─────────────────────────────────── */
  {
    id: 'I', en: 'I', hi: 'मैं', cat: 'pronouns',
    senses: [{ text: 'first person singular', note: 'Index points towards the own chest.' }],
    synonyms: ['MAIN', 'SELF'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'chest', hands: 'right',
    path: { t: 'in', dx: 0, dy: 0 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'YOU', en: 'YOU', hi: 'तुम', cat: 'pronouns',
    senses: [{ text: 'second person', note: 'Index points towards the addressee.' }],
    synonyms: ['TUM', 'YOU_PL'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'neutral', hands: 'right',
    path: { t: 'forward', dx: 0, dy: -18 }, reps: 1, w: 14, status: 'unverified'
  },
  {
    id: 'HE', en: 'HE', hi: 'वह', cat: 'pronouns',
    senses: [{ text: 'third person masculine', note: 'Index points to the side.' }],
    synonyms: ['VAH', 'HE_SHE'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'neutral', hands: 'right',
    path: { t: 'side', dx: 20, dy: 0 }, reps: 1, w: 18, status: 'unverified'
  },
  {
    id: 'SHE', en: 'SHE', hi: 'वह', cat: 'pronouns',
    senses: [{ text: 'third person feminine', note: 'Thumb at the cheek, index points outward.' }],
    synonyms: ['VAH_F'],
    hs: { f: [2, 0, 0, 0, 0], th: 'out' }, loc: 'cheek', hands: 'right',
    path: { t: 'side', dx: 20, dy: 0 }, reps: 1, w: 14, status: 'unverified'
  },
  {
    id: 'WE', en: 'WE', hi: 'हम', cat: 'pronouns',
    senses: [{ text: 'first person plural', note: 'Index moves from one shoulder to the other.' }],
    synonyms: ['HUM', 'US_PL'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'shoulder', hands: 'right',
    path: { t: 'arc', dx: 30, dy: 0 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'THEY', en: 'THEY', hi: 'वे', cat: 'pronouns',
    senses: [{ text: 'third person plural', note: 'Index sweeps outwards to both sides.' }],
    synonyms: ['VE', 'THEY_PL'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'neutral', hands: 'right',
    path: { t: 'side', dx: 28, dy: 0 }, reps: 1, w: 18, status: 'unverified'
  },
  {
    id: 'IT', en: 'IT', hi: 'यह', cat: 'pronouns',
    senses: [{ text: 'third person neuter / object', note: 'Index points into neutral space.' }],
    synonyms: ['YEH'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'neutral', hands: 'right',
    path: { t: 'side', dx: 15, dy: 0 }, reps: 1, w: 8, status: 'unverified'
  },
  {
    id: 'MY', en: 'MY', hi: 'मेरा', cat: 'pronouns',
    senses: [{ text: 'first person possessive', note: 'Flat hand taps the own chest.' }],
    synonyms: ['MERA', 'MY_'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'chest', hands: 'right',
    path: { t: 'tap', dx: 0, dy: 6 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'YOUR', en: 'YOUR', hi: 'तुम्हारा', cat: 'pronouns',
    senses: [{ text: 'second person possessive', note: 'Flat hand pushes gently forwards.' }],
    synonyms: ['TUMHARA'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'neutral', hands: 'right',
    path: { t: 'forward', dx: 0, dy: -14 }, reps: 1, w: 12, status: 'unverified'
  },
  {
    id: 'MY_NAME', en: 'MY NAME', hi: 'मेरा नाम', cat: 'pronouns',
    senses: [{ text: 'introducing oneself', note: 'Crossed index fingers tap twice.' }],
    synonyms: ['MERA_NAAM'],
    hs: { f: [2, 0, 0, 2, 2], th: 'folded' }, loc: 'neutral', hands: 'both',
    path: { t: 'tap', dx: 0, dy: 6 }, reps: 2, w: 0, status: 'unverified'
  },
  {
    id: 'NAMES', en: 'NAME', hi: 'नाम', cat: 'pronouns',
    senses: [{ text: 'asking or stating a name', note: 'Two index fingers tap together.' }],
    synonyms: ['NAAM'],
    hs: { f: [2, 0, 0, 2, 2], th: 'folded' }, loc: 'neutral', hands: 'both',
    path: { t: 'tap', dx: 0, dy: 6 }, reps: 2, w: 0, status: 'unverified'
  },
  {
    id: 'WHERE_FROM', en: 'WHERE FROM', hi: 'कहाँ से', cat: 'pronouns',
    senses: [{ text: 'asking about origin', note: 'Index flicks upwards from the chin.' }],
    synonyms: ['KAHAN_SE'],
    hs: { f: [2, 0, 2, 2, 2], th: 'folded' }, loc: 'chin', hands: 'right',
    path: { t: 'up', dx: 0, dy: -18 }, reps: 1, w: 12, status: 'unverified'
  },

  /* ── COMMON VERBS ───────────────────────────────────────────── */
  {
    id: 'GO', en: 'GO', hi: 'जाओ', cat: 'verbs',
    senses: [{ text: 'to go / move away', note: 'Index finger points and pushes forwards.' }],
    synonyms: ['JAAO', 'GOING'],
    hs: { f: [2, 0, 2, 2, 2], th: 'folded' }, loc: 'neutral', hands: 'right',
    path: { t: 'forward', dx: 0, dy: -20 }, reps: 1, w: 12, status: 'unverified'
  },
  {
    id: 'COME', en: 'COME', hi: 'आओ', cat: 'verbs',
    senses: [{ text: 'to come / move closer', note: 'Index finger curls towards the body.' }],
    synonyms: ['AAO'],
    hs: { f: [2, 0, 2, 2, 2], th: 'folded' }, loc: 'neutral', hands: 'right',
    path: { t: 'in', dx: 0, dy: 0 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'EAT', en: 'EAT', hi: 'खाओ', cat: 'verbs',
    senses: [{ text: 'to eat', note: 'Fingertips touch the mouth repeatedly.' }],
    synonyms: ['KHAO', 'EATING', 'FOOD'],
    hs: { f: [1, 1, 1, 1, 1], th: 'o' }, loc: 'mouth', hands: 'right',
    path: { t: 'tap', dx: 0, dy: 6 }, reps: 3, w: 0, status: 'unverified', curve: true
  },
  {
    id: 'DRINK', en: 'DRINK', hi: 'पिओ', cat: 'verbs',
    senses: [{ text: 'to drink', note: 'Curved hand tips towards the mouth.' }],
    synonyms: ['PIYO'],
    hs: { f: [1, 1, 1, 1, 1], th: 'curve' }, loc: 'mouth', hands: 'right',
    path: { t: 'up', dx: 0, dy: -16 }, reps: 2, w: 18, status: 'unverified', curve: true
  },
  {
    id: 'SLEEP', en: 'SLEEP', hi: 'सोना', cat: 'verbs',
    senses: [{ text: 'to sleep', note: 'Open hand droops towards the cheek.' }],
    synonyms: ['SONA', 'SLEEPING'],
    hs: { f: [0, 0, 0, 0, 0], th: 'out' }, loc: 'cheek', hands: 'right',
    path: { t: 'down', dx: 0, dy: 16 }, reps: 1, w: -24, status: 'unverified'
  },
  {
    id: 'WAKE_UP', en: 'WAKE UP', hi: 'जागो', cat: 'verbs',
    senses: [{ text: 'to wake up', note: 'Index and middle finger spring open near the eyes.' }],
    synonyms: ['JAGO'],
    hs: { f: [1, 1, 2, 2, 2], th: 'up' }, loc: 'eye', hands: 'both',
    path: { t: 'up', dx: 0, dy: -16 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'WALK', en: 'WALK', hi: 'चलना', cat: 'verbs',
    senses: [{ text: 'to walk / move on foot', note: 'Flat hands alternate stepping forward.' }],
    synonyms: ['CHALNA', 'WALKING'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'chest', hands: 'both',
    path: { t: 'forward', dx: 0, dy: -14 }, reps: 2, w: 0, status: 'unverified'
  },
  {
    id: 'RUN', en: 'RUN', hi: 'भागना', cat: 'verbs',
    senses: [{ text: 'to run', note: 'Both hands pump alternately like running legs.' }],
    synonyms: ['BHAGNA'],
    hs: { f: [1, 0, 2, 2, 2], th: 'up' }, loc: 'chest', hands: 'both',
    path: { t: 'forward', dx: 0, dy: -18 }, reps: 2, w: 12, status: 'unverified'
  },
  {
    id: 'READ', en: 'READ', hi: 'पढ़ना', cat: 'verbs',
    senses: [{ text: 'to read', note: 'V-fingers sweep across the open palm.' }],
    synonyms: ['PADHNA'],
    hs: { f: [2, 0, 0, 2, 2], th: 'folded' }, loc: 'neutral', hands: 'both',
    path: { t: 'side', dx: 26, dy: 0 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'WRITE', en: 'WRITE', hi: 'लिखना', cat: 'verbs',
    senses: [{ text: 'to write', note: 'Index finger writes on the open palm.' }],
    synonyms: ['LIKHNA'],
    hs: { f: [2, 0, 2, 2, 2], th: 'up' }, loc: 'neutral', hands: 'both',
    path: { t: 'side', dx: 18, dy: 0 }, reps: 1, w: 8, status: 'unverified'
  },
  {
    id: 'LEARN', en: 'LEARN', hi: 'सीखना', cat: 'verbs',
    senses: [{ text: 'to learn / study', note: 'Hand gathers towards the forehead.' }],
    synonyms: ['SIKHNA', 'STUDY'],
    hs: { f: [1, 1, 1, 1, 1], th: 'o' }, loc: 'forehead', hands: 'right',
    path: { t: 'up', dx: 0, dy: -24 }, reps: 1, w: 18, status: 'unverified', oval: true
  },
  {
    id: 'TEACH', en: 'TEACH', hi: 'पढ़ाना', cat: 'verbs',
    senses: [{ text: 'to teach', note: 'Both hands move outwards from the temples.' }],
    synonyms: ['PADHANA'],
    hs: { f: [1, 1, 1, 1, 1], th: 'o' }, loc: 'temple', hands: 'both',
    path: { t: 'arc', dx: 20, dy: 0 }, reps: 1, w: 0, status: 'unverified', oval: true
  },
  {
    id: 'KNOW', en: 'KNOW', hi: 'जानना', cat: 'verbs',
    senses: [{ text: 'to know / be aware of', note: 'Bent hand taps the forehead.' }],
    synonyms: ['JANNA', 'KNOWLEDGE'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'forehead', hands: 'right',
    path: { t: 'tap', dx: 0, dy: 0 }, reps: 1, w: 10, status: 'unverified'
  },
  {
    id: 'UNDERSTAND', en: 'UNDERSTAND', hi: 'समझना', cat: 'verbs',
    senses: [{ text: 'to understand', note: 'Index finger flicks up from the forehead.' }],
    synonyms: ['SAMJHNA', 'UNDERSTANDING'],
    hs: { f: [2, 0, 2, 2, 2], th: 'folded' }, loc: 'forehead', hands: 'right',
    path: { t: 'up', dx: 0, dy: -16 }, reps: 1, w: 8, status: 'unverified'
  },
  {
    id: 'TALK', en: 'TALK', hi: 'बात करना', cat: 'verbs',
    senses: [{ text: 'to talk / speak', note: 'Index finger moves out of the mouth.' }],
    synonyms: ['BAAT_KARNA', 'SPEAK'],
    hs: { f: [2, 0, 2, 2, 2], th: 'folded' }, loc: 'mouth', hands: 'right',
    path: { t: 'forward', dx: 0, dy: -14 }, reps: 2, w: 6, status: 'unverified'
  },
  {
    id: 'SEND', en: 'SEND', hi: 'भेजना', cat: 'verbs',
    senses: [{ text: 'to send / dispatch', note: 'Flat-O hand flicks open and pushes away.' }],
    synonyms: ['BHEJNA'],
    hs: { f: [1, 1, 1, 1, 1], th: 'o' }, loc: 'neutral', hands: 'right',
    path: { t: 'forward', dx: 0, dy: -16 }, reps: 1, w: 12, status: 'unverified', oval: true
  },
  {
    id: 'RECEIVE', en: 'RECEIVE', hi: 'पाना', cat: 'verbs',
    senses: [{ text: 'to receive / take delivery', note: 'Open hands pull inwards.' }],
    synonyms: ['PANA', 'GET'],
    hs: { f: [0, 0, 0, 0, 0], th: 'out' }, loc: 'neutral', hands: 'both',
    path: { t: 'in', dx: 0, dy: 8 }, reps: 1, w: -8, status: 'unverified'
  },
  {
    id: 'GIVE', en: 'GIVE', hi: 'देना', cat: 'verbs',
    senses: [{ text: 'to give / hand over', note: 'Flat-O opens and pushes forwards.' }],
    synonyms: ['DENA'],
    hs: { f: [1, 1, 1, 1, 1], th: 'o' }, loc: 'neutral', hands: 'right',
    path: { t: 'forward', dx: 0, dy: -16 }, reps: 1, w: 12, status: 'unverified', oval: true
  },
  {
    id: 'TAKE', en: 'TAKE', hi: 'लेना', cat: 'verbs',
    senses: [{ text: 'to take / pick up', note: 'Open hand closes into a fist.' }],
    synonyms: ['LENA'],
    hs: { f: [0, 0, 0, 0, 0], th: 'out' }, loc: 'neutral', hands: 'right',
    path: { t: 'squeeze', dx: 0, dy: 0 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'HELP', en: 'HELP', hi: 'मदद करना', cat: 'verbs',
    senses: [{ text: 'to help / assist', note: 'Fist rests on the palm and lifts.' }],
    synonyms: ['MADAD', 'HELPING'],
    hs: { f: [2, 2, 2, 2, 2], th: 'up' }, loc: 'chest', hands: 'both',
    path: { t: 'up', dx: 0, dy: -24 }, reps: 1, w: -16, status: 'unverified'
  },
  {
    id: 'STOP', en: 'STOP', hi: 'रुकना', cat: 'verbs',
    senses: [{ text: 'to stop / halt', note: 'Open hand chops down onto the other palm.' }],
    synonyms: ['RUKNA', 'STOPPING'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'neutral', hands: 'both',
    path: { t: 'chop', dx: 0, dy: 16 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'WAIT', en: 'WAIT', hi: 'रुकना', cat: 'verbs',
    senses: [{ text: 'to wait / stay', note: 'Both hands wiggle in the air.' }],
    synonyms: ['RUKO', 'WAITING'],
    hs: { f: [0, 0, 0, 0, 0], th: 'out' }, loc: 'neutral', hands: 'both',
    path: { t: 'wiggle', dx: 7, dy: 0 }, reps: 3, w: 0, status: 'unverified'
  },
  {
    id: 'WORK', en: 'WORK', hi: 'काम', cat: 'verbs',
    senses: [{ text: 'to work / job', note: 'One fist taps the other wrist.' }],
    synonyms: ['KAAM', 'WORKING'],
    hs: { f: [2, 2, 2, 2, 2], th: 'front' }, loc: 'neutral', hands: 'both',
    path: { t: 'tap', dx: 0, dy: 8 }, reps: 2, w: 0, status: 'unverified'
  },
  {
    id: 'PLAY', en: 'PLAY', hi: 'खेलना', cat: 'verbs',
    senses: [{ text: 'to play / have fun', note: 'Both Y-hands shake lightly.' }],
    synonyms: ['KHELNA'],
    hs: { f: [0, 2, 2, 2, 0], th: 'out' }, loc: 'neutral', hands: 'both',
    path: { t: 'shake', dx: 13, dy: 0 }, reps: 2, w: 0, status: 'unverified'
  },
  {
    id: 'MOVE', en: 'MOVE', hi: 'हिलना', cat: 'verbs',
    senses: [{ text: 'to move / shift', note: 'Both flat-O hands shift sideways.' }],
    synonyms: ['HILNA', 'MOVING'],
    hs: { f: [1, 1, 1, 1, 1], th: 'o' }, loc: 'neutral', hands: 'both',
    path: { t: 'side', dx: 24, dy: 0 }, reps: 1, w: 0, status: 'unverified', oval: true
  },
  {
    id: 'BUY', en: 'BUY', hi: 'खरीदना', cat: 'verbs',
    senses: [{ text: 'to buy', note: 'Hand moves from the palm to the mouth.' }],
    synonyms: ['KHAREEDNA'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'mouth', hands: 'right',
    path: { t: 'up', dx: 0, dy: -18 }, reps: 1, w: 10, status: 'unverified'
  },
  {
    id: 'SIGN', en: 'SIGN (LANGUAGE)', hi: 'साइन लैंग्वेज', cat: 'verbs',
    senses: [{ text: 'to sign / use a sign language', note: 'Index fingers circle around each other.' }],
    synonyms: ['SIGN_LANGUAGE', 'ISL'],
    hs: { f: [0, 0, 2, 2, 2], th: 'out' }, loc: 'neutral', hands: 'both',
    path: { t: 'circle', r: 16 }, reps: 2, w: 0, status: 'unverified'
  },
  {
    id: 'DEAF', en: 'DEAF', hi: 'बहरा', cat: 'verbs',
    senses: [{ text: 'deaf person', note: 'Index touches the ear, then the corner of the mouth.' }],
    synonyms: ['BAHRA', 'DEAFNESS'],
    hs: { f: [2, 0, 2, 2, 2], th: 'folded' }, loc: 'ear', hands: 'right',
    path: { t: 'arc', dx: 0, dy: 26 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'LISTEN', en: 'LISTEN', hi: 'सुनना', cat: 'verbs',
    senses: [{ text: 'to listen', note: 'L-shaped hand cups behind the ear.' }],
    synonyms: ['SUNNA', 'HEAR'],
    hs: { f: [1, 0, 0, 0, 0], th: 'up' }, loc: 'ear', hands: 'right',
    path: { t: 'tap', dx: 0, dy: 0 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'LOOK', en: 'LOOK', hi: 'देखना', cat: 'verbs',
    senses: [{ text: 'to look / see', note: 'V-fingers move from the eyes outwards.' }],
    synonyms: ['DEKHNA', 'SEE'],
    hs: { f: [2, 0, 0, 2, 2], th: 'folded' }, loc: 'eye', hands: 'right',
    path: { t: 'forward', dx: 0, dy: -18 }, reps: 1, w: 8, status: 'unverified'
  },
  {
    id: 'SIT', en: 'SIT', hi: 'बैठना', cat: 'verbs',
    senses: [{ text: 'to sit down', note: 'V-fingers bend down onto the other hand.' }],
    synonyms: ['BAITHNA'],
    hs: { f: [2, 0, 0, 2, 2], th: 'folded' }, loc: 'neutral', hands: 'both',
    path: { t: 'down', dx: 0, dy: 14 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'STAND', en: 'STAND', hi: 'खड़ा होना', cat: 'verbs',
    senses: [{ text: 'to stand up', note: 'V-fingers stand upright on the open palm.' }],
    synonyms: ['KHADA_HONA'],
    hs: { f: [2, 0, 0, 2, 2], th: 'folded' }, loc: 'neutral', hands: 'both',
    path: { t: 'up', dx: 0, dy: -14 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'USE', en: 'USE', hi: 'उपयोग करना', cat: 'verbs',
    senses: [{ text: 'to use / make use of', note: 'Hand circles over the other fist.' }],
    synonyms: ['UPYOG', 'UTILISE'],
    hs: { f: [2, 0, 2, 2, 2], th: 'up' }, loc: 'neutral', hands: 'right',
    path: { t: 'circle', r: 13 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'OPEN', en: 'OPEN', hi: 'खोलना', cat: 'verbs',
    senses: [{ text: 'to open', note: 'Both flat hands swing apart.' }],
    synonyms: ['KHOLNA'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'neutral', hands: 'both',
    path: { t: 'open', dx: 22, dy: 0 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'CLOSE', en: 'CLOSE', hi: 'बंद करना', cat: 'verbs',
    senses: [{ text: 'to close', note: 'Both flat hands swing together.' }],
    synonyms: ['BAND_KARNA', 'SHUT'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'neutral', hands: 'both',
    path: { t: 'in', dx: 0, dy: 0 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'BRUSH_TEETH', en: 'BRUSH TEETH', hi: 'दाँत साफ़ करना', cat: 'verbs',
    senses: [{ text: 'to brush teeth', note: 'Index finger moves across the teeth.' }],
    synonyms: ['DAANT_SAAF'],
    hs: { f: [2, 0, 2, 2, 2], th: 'folded' }, loc: 'mouth', hands: 'right',
    path: { t: 'side', dx: 22, dy: 0 }, reps: 2, w: 6, status: 'unverified'
  },
  {
    id: 'SHOWER', en: 'SHOWER', hi: 'नहाना', cat: 'verbs',
    senses: [{ text: 'to bathe / shower', note: 'Open hand above the head, water falling.' }],
    synonyms: ['NAHANA', 'BATH'],
    hs: { f: [0, 0, 0, 0, 0], th: 'out' }, loc: 'forehead', hands: 'right',
    path: { t: 'down', dx: 0, dy: 20 }, reps: 2, w: 0, status: 'unverified'
  },
  {
    id: 'EAT_DRINK', en: 'FOOD AND DRINK', hi: 'खाना-पीना', cat: 'verbs',
    senses: [{ text: 'eating and drinking', note: 'Combined concept, used in everyday ISL.' }],
    synonyms: ['FOOD_DRINK'],
    hs: { f: [1, 1, 1, 1, 1], th: 'o' }, loc: 'mouth', hands: 'right',
    path: { t: 'tap', dx: 0, dy: 6 }, reps: 2, w: 4, status: 'unverified', curve: true
  },

  /* ── FAMILY & PEOPLE ────────────────────────────────────────── */
  {
    id: 'MOTHER', en: 'MOTHER', hi: 'माँ', cat: 'people',
    senses: [{ text: 'mother', note: 'Thumb touches the chin.' }],
    synonyms: ['MA', 'MAA'],
    hs: { f: [0, 0, 0, 0, 0], th: 'up' }, loc: 'chin', hands: 'right',
    path: { t: 'tap', dx: 0, dy: 0 }, reps: 2, w: 0, status: 'unverified'
  },
  {
    id: 'FATHER', en: 'FATHER', hi: 'पिता', cat: 'people',
    senses: [{ text: 'father', note: 'Thumb touches the forehead.' }],
    synonyms: ['PITA', 'PAPA'],
    hs: { f: [0, 0, 0, 0, 0], th: 'up' }, loc: 'forehead', hands: 'right',
    path: { t: 'tap', dx: 0, dy: 0 }, reps: 2, w: 0, status: 'unverified'
  },
  {
    id: 'SISTER', en: 'SISTER', hi: 'बहन', cat: 'people',
    senses: [{ text: 'sister', note: 'Thumb at the chin, then the other hand.' }],
    synonyms: ['BAHEN', 'BEHEN'],
    hs: { f: [2, 0, 2, 2, 2], th: 'out' }, loc: 'chin', hands: 'both',
    path: { t: 'side', dx: 18, dy: 0 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'BROTHER', en: 'BROTHER', hi: 'भाई', cat: 'people',
    senses: [{ text: 'brother', note: 'Thumb at the forehead, then the other hand.' }],
    synonyms: ['BHAI'],
    hs: { f: [1, 0, 2, 2, 2], th: 'up' }, loc: 'forehead', hands: 'both',
    path: { t: 'side', dx: 18, dy: 0 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'FRIEND', en: 'FRIEND', hi: 'दोस्त', cat: 'people',
    senses: [{ text: 'friend', note: 'Index fingers hook together.' }],
    synonyms: ['DOST'],
    hs: { f: [2, 0, 2, 2, 2], th: 'folded' }, loc: 'neutral', hands: 'both',
    path: { t: 'swap', dx: 0, dy: 8 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'FAMILY', en: 'FAMILY', hi: 'परिवार', cat: 'people',
    senses: [{ text: 'family', note: 'Both hands open outwards from the centre.' }],
    synonyms: ['PARIVAR'],
    hs: { f: [2, 0, 2, 2, 2], th: 'up' }, loc: 'chest', hands: 'both',
    path: { t: 'circle', r: 26 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'CHILD', en: 'CHILD', hi: 'बच्चा', cat: 'people',
    senses: [{ text: 'child', note: 'Flat hand pats downwards at child height.' }],
    synonyms: ['BACHCHA'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'neutral', hands: 'right',
    path: { t: 'down', dx: 0, dy: 12 }, reps: 1, w: -12, status: 'unverified'
  },
  {
    id: 'MAN', en: 'MAN', hi: 'आदमी', cat: 'people',
    senses: [{ text: 'man / male adult', note: 'Thumb at the forehead, then down to the chest.' }],
    synonyms: ['ADMI', 'MALE'],
    hs: { f: [0, 0, 0, 0, 0], th: 'up' }, loc: 'forehead', hands: 'right',
    path: { t: 'down', dx: 0, dy: 18 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'WOMAN', en: 'WOMAN', hi: 'औरत', cat: 'people',
    senses: [{ text: 'woman / female adult', note: 'Thumb at the chin, then down to the chest.' }],
    synonyms: ['AURAT', 'FEMALE'],
    hs: { f: [2, 0, 2, 2, 2], th: 'out' }, loc: 'chin', hands: 'right',
    path: { t: 'down', dx: 0, dy: 18 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'BOY', en: 'BOY', hi: 'लड़का', cat: 'people',
    senses: [{ text: 'boy', note: 'Bent hand taps at the brim of an imaginary cap.' }],
    synonyms: ['LADKA'],
    hs: { f: [1, 0, 0, 0, 0], th: 'up' }, loc: 'forehead', hands: 'right',
    path: { t: 'tap', dx: 0, dy: 0 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'GIRL', en: 'GIRL', hi: 'लड़की', cat: 'people',
    senses: [{ text: 'girl', note: 'Thumb strokes down the side of the cheek.' }],
    synonyms: ['LADKI'],
    hs: { f: [2, 0, 2, 2, 2], th: 'out' }, loc: 'cheek', hands: 'right',
    path: { t: 'down', dx: 0, dy: 12 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'BABY', en: 'BABY', hi: 'बच्चा', cat: 'people',
    senses: [{ text: 'baby / infant', note: 'Arms cradle and rock gently.' }],
    synonyms: ['BABY_H', 'NANA'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'chest', hands: 'both',
    path: { t: 'rock', dx: 9, dy: 7 }, reps: 2, w: 0, status: 'unverified'
  },
  {
    id: 'TEACHER', en: 'TEACHER', hi: 'शिक्षक', cat: 'people',
    senses: [{ text: 'teacher', note: 'Both flat-O hands move out from the temples.' }],
    synonyms: ['SHIKSHK', 'TEACHING'],
    hs: { f: [1, 1, 1, 1, 1], th: 'o' }, loc: 'temple', hands: 'both',
    path: { t: 'arc', dx: 22, dy: 0 }, reps: 1, w: 0, status: 'unverified', oval: true
  },
  {
    id: 'DOCTOR', en: 'DOCTOR', hi: 'डॉक्टर', cat: 'people',
    senses: [{ text: 'doctor / physician', note: 'D-hand taps the wrist.' }],
    synonyms: ['DAKTAR'],
    hs: { f: [2, 0, 0, 2, 2], th: 'folded' }, loc: 'wrist', hands: 'right',
    path: { t: 'tap', dx: 0, dy: 0 }, reps: 2, w: 0, status: 'unverified'
  },
  {
    id: 'FRIENDS', en: 'FRIENDS', hi: 'दोस्तों', cat: 'people',
    senses: [{ text: 'friends (plural)', note: 'Both index fingers touch each other and separate.' }],
    synonyms: ['DOSTON'],
    hs: { f: [2, 0, 2, 2, 2], th: 'folded' }, loc: 'neutral', hands: 'both',
    path: { t: 'open', dx: 20, dy: 0 }, reps: 1, w: 0, status: 'unverified'
  },

  /* ── FOOD & DRINK ───────────────────────────────────────────── */
  {
    id: 'FOOD', en: 'FOOD', hi: 'खाना', cat: 'food',
    senses: [
      { text: 'food in general', note: 'Fingertips tap the mouth.' },
      { text: 'a meal', note: 'Same sign used for "meal" in many Indian languages.' }
    ],
    synonyms: ['KHAANA', 'MEAL', 'FOOD_H'],
    hs: { f: [1, 1, 1, 1, 1], th: 'o' }, loc: 'mouth', hands: 'right',
    path: { t: 'tap', dx: 0, dy: 5 }, reps: 2, w: 0, status: 'unverified', oval: true
  },
  {
    id: 'WATER', en: 'WATER', hi: 'पानी', cat: 'food',
    senses: [{ text: 'water', note: 'W-hand taps the lips.' }],
    synonyms: ['PANI'],
    hs: { f: [2, 0, 0, 2, 2], th: 'folded' }, loc: 'mouth', hands: 'right',
    path: { t: 'tap', dx: 0, dy: 4 }, reps: 2, w: 8, status: 'unverified'
  },
  {
    id: 'MILK', en: 'MILK', hi: 'दूध', cat: 'food',
    senses: [{ text: 'milk', note: 'Fist opens and closes repeatedly.' }],
    synonyms: ['DOODH'],
    hs: { f: [2, 2, 2, 2, 2], th: 'front' }, loc: 'neutral', hands: 'right',
    path: { t: 'squeeze', dx: 0, dy: 9 }, reps: 2, w: 0, status: 'unverified'
  },
  {
    id: 'TEA', en: 'TEA', hi: 'चाय', cat: 'food',
    senses: [{ text: 'tea', note: 'Curved hand mimes holding a cup.' }],
    synonyms: ['CHAY'],
    hs: { f: [1, 1, 1, 1, 1], th: 'curve' }, loc: 'mouth', hands: 'right',
    path: { t: 'up', dx: 0, dy: -14 }, reps: 2, w: 16, status: 'unverified', curve: true
  },
  {
    id: 'RICE', en: 'RICE', hi: 'चावल', cat: 'food',
    senses: [{ text: 'rice', note: 'Fingertips tap together as if grains.' }],
    synonyms: ['CHAVAL'],
    hs: { f: [1, 1, 1, 1, 1], th: 'o' }, loc: 'neutral', hands: 'both',
    path: { t: 'tap', dx: 0, dy: 5 }, reps: 3, w: 0, status: 'unverified', oval: true
  },
  {
    id: 'BREAD', en: 'BREAD', hi: 'रोटी', cat: 'food',
    senses: [{ text: 'bread / roti', note: 'Flat hands slice across each other.' }],
    synonyms: ['ROTI'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'neutral', hands: 'both',
    path: { t: 'side', dx: 24, dy: 0 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'FRUIT', en: 'FRUIT', hi: 'फल', cat: 'food',
    senses: [{ text: 'fruit', note: 'Hand twists at the cheek like an apple.' }],
    synonyms: ['PHAL'],
    hs: { f: [2, 0, 2, 2, 2], th: 'up' }, loc: 'cheek', hands: 'right',
    path: { t: 'circle', r: 10 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'BANANA', en: 'BANANA', hi: 'केला', cat: 'food',
    senses: [{ text: 'banana', note: 'Hand peels downwards.' }],
    synonyms: ['KELA'],
    hs: { f: [2, 0, 2, 2, 2], th: 'out' }, loc: 'cheek', hands: 'both',
    path: { t: 'down', dx: 0, dy: 14 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'SWEET', en: 'SWEET', hi: 'मीठा', cat: 'food',
    senses: [{ text: 'sweet taste', note: 'Fingers brush the chin downwards.' }],
    synonyms: ['MITHA'],
    hs: { f: [2, 0, 0, 0, 0], th: 'up' }, loc: 'chin', hands: 'right',
    path: { t: 'down', dx: 0, dy: 9 }, reps: 1, w: 8, status: 'unverified'
  },
  {
    id: 'HOT', en: 'HOT', hi: 'गरम', cat: 'food',
    senses: [{ text: 'hot (temperature) / spicy', note: 'Curved hand turns away from the mouth.' }],
    synonyms: ['GARAM'],
    hs: { f: [1, 1, 1, 1, 1], th: 'curve' }, loc: 'mouth', hands: 'right',
    path: { t: 'arc', dx: 20, dy: 7 }, reps: 1, w: 0, status: 'unverified', curve: true
  },
  {
    id: 'COLD', en: 'COLD', hi: 'ठंडा', cat: 'food',
    senses: [{ text: 'cold (temperature)', note: 'Fists tremble slightly.' }],
    synonyms: ['THANDA'],
    hs: { f: [2, 2, 2, 2, 2], th: 'front' }, loc: 'chest', hands: 'both',
    path: { t: 'shake', dx: 8, dy: 0 }, reps: 3, w: 0, status: 'unverified'
  },
  {
    id: 'HUNGRY', en: 'HUNGRY', hi: 'भूखा', cat: 'food',
    senses: [{ text: 'hungry', note: 'Curved hand slides down the chest.' }],
    synonyms: ['BHOOKA'],
    hs: { f: [1, 1, 1, 1, 1], th: 'curve' }, loc: 'chest', hands: 'right',
    path: { t: 'down', dx: 0, dy: 20 }, reps: 1, w: 0, status: 'unverified', curve: true
  },
  {
    id: 'COFFEE', en: 'COFFEE', hi: 'कॉफ़ी', cat: 'food',
    senses: [{ text: 'coffee', note: 'Both fists circle as if grinding beans.' }],
    synonyms: ['COFFEE_H'],
    hs: { f: [2, 2, 2, 2, 2], th: 'front' }, loc: 'neutral', hands: 'both',
    path: { t: 'circle', r: 13 }, reps: 2, w: 0, status: 'unverified'
  },
  {
    id: 'ICE_CREAM', en: 'ICE CREAM', hi: 'आइसक्रीम', cat: 'food',
    senses: [{ text: 'ice cream', note: 'Hand licks downwards along the cone.' }],
    synonyms: ['ICE_CREAM_H'],
    hs: { f: [2, 2, 2, 2, 2], th: 'front' }, loc: 'mouth', hands: 'right',
    path: { t: 'down', dx: 0, dy: 16 }, reps: 1, w: 0, status: 'unverified'
  },

  /* ── COLOURS ────────────────────────────────────────────────── */
  {
    id: 'RED', en: 'RED', hi: 'लाल', cat: 'colors',
    senses: [{ text: 'colour red', note: 'Index strokes down from the lips.' }],
    synonyms: ['LAAL'],
    hs: { f: [2, 0, 2, 2, 2], th: 'folded' }, loc: 'mouth', hands: 'right',
    path: { t: 'down', dx: 0, dy: 9 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'BLUE', en: 'BLUE', hi: 'नीला', cat: 'colors',
    senses: [{ text: 'colour blue', note: 'B-hand shakes at the side.' }],
    synonyms: ['NEELA'],
    hs: { f: [0, 0, 0, 0, 0], th: 'out' }, loc: 'neutral', hands: 'right',
    path: { t: 'shake', dx: 9, dy: 0 }, reps: 2, w: 12, status: 'unverified'
  },
  {
    id: 'GREEN', en: 'GREEN', hi: 'हरा', cat: 'colors',
    senses: [{ text: 'colour green', note: 'G-hand shakes at the wrist.' }],
    synonyms: ['HARA'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'neutral', hands: 'right',
    path: { t: 'shake', dx: 10, dy: 0 }, reps: 2, w: 16, status: 'unverified'
  },
  {
    id: 'YELLOW', en: 'YELLOW', hi: 'पीला', cat: 'colors',
    senses: [{ text: 'colour yellow', note: 'Y-hand shakes at the wrist.' }],
    synonyms: ['PILA'],
    hs: { f: [0, 2, 2, 2, 0], th: 'out' }, loc: 'neutral', hands: 'right',
    path: { t: 'shake', dx: 10, dy: 0 }, reps: 2, w: 12, status: 'unverified'
  },
  {
    id: 'WHITE', en: 'WHITE', hi: 'सफ़ेद', cat: 'colors',
    senses: [{ text: 'colour white', note: 'Open hand pulls away from the chest.' }],
    synonyms: ['SAFED'],
    hs: { f: [0, 0, 0, 0, 0], th: 'out' }, loc: 'chest', hands: 'right',
    path: { t: 'forward', dx: 0, dy: -20 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'BLACK', en: 'BLACK', hi: 'काला', cat: 'colors',
    senses: [{ text: 'colour black', note: 'Index strokes across the forehead.' }],
    synonyms: ['KALA'],
    hs: { f: [2, 0, 2, 2, 2], th: 'folded' }, loc: 'forehead', hands: 'right',
    path: { t: 'side', dx: 32, dy: 0 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'BROWN', en: 'BROWN', hi: 'भूरा', cat: 'colors',
    senses: [{ text: 'colour brown', note: 'Hand rubs the chest with a flat palm.' }],
    synonyms: ['BHURA'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'chest', hands: 'right',
    path: { t: 'side', dx: 18, dy: 0 }, reps: 1, w: 0, status: 'unverified'
  },

  /* ── TIME & DAILY LIFE ──────────────────────────────────────── */
  {
    id: 'TODAY', en: 'TODAY', hi: 'आज', cat: 'time',
    senses: [{ text: 'today / this day', note: 'Both hands move downwards.' }],
    synonyms: ['AAJ'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'chest', hands: 'both',
    path: { t: 'down', dx: 0, dy: 16 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'TOMORROW', en: 'TOMORROW', hi: 'कल', cat: 'time',
    senses: [{ text: 'tomorrow', note: 'Index finger moves forward along the cheek.' }],
    synonyms: ['KAL'],
    hs: { f: [2, 0, 2, 2, 2], th: 'folded' }, loc: 'cheek', hands: 'right',
    path: { t: 'forward', dx: 0, dy: -14 }, reps: 1, w: 8, status: 'unverified'
  },
  {
    id: 'YESTERDAY', en: 'YESTERDAY', hi: 'कल', cat: 'time',
    senses: [{ text: 'yesterday', note: 'Index finger moves back along the cheek.' }],
    synonyms: ['KAL_H', 'PARSON'],
    hs: { f: [2, 0, 2, 2, 2], th: 'folded' }, loc: 'cheek', hands: 'right',
    path: { t: 'in', dx: 0, dy: 0 }, reps: 1, w: -8, status: 'unverified'
  },
  {
    id: 'TIME', en: 'TIME', hi: 'समय', cat: 'time',
    senses: [{ text: 'time / clock', note: 'Index taps the wrist.' }],
    synonyms: ['SAMAY', 'CLOCK'],
    hs: { f: [2, 0, 2, 2, 2], th: 'side' }, loc: 'wrist', hands: 'right',
    path: { t: 'tap', dx: 0, dy: 0 }, reps: 2, w: 0, status: 'unverified'
  },
  {
    id: 'DAY', en: 'DAY', hi: 'दिन', cat: 'time',
    senses: [{ text: 'day', note: 'Index arcs downwards like the setting sun.' }],
    synonyms: ['DIN'],
    hs: { f: [2, 0, 2, 2, 2], th: 'side' }, loc: 'neutral', hands: 'right',
    path: { t: 'arc', dx: 18, dy: 13 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'NIGHT', en: 'NIGHT', hi: 'रात', cat: 'time',
    senses: [{ text: 'night', note: 'Bent hand arcs down over the flat arm.' }],
    synonyms: ['RAAT'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'chest', hands: 'both',
    path: { t: 'down', dx: 0, dy: 16 }, reps: 1, w: -18, status: 'unverified'
  },
  {
    id: 'WEEK', en: 'WEEK', hi: 'सप्ताह', cat: 'time',
    senses: [{ text: 'week', note: 'Index taps the back of the other hand.' }],
    synonyms: ['SAPTAH'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'neutral', hands: 'both',
    path: { t: 'tap', dx: 0, dy: 6 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'MONTH', en: 'MONTH', hi: 'महीना', cat: 'time',
    senses: [{ text: 'month', note: 'Index traces a small line along the palm.' }],
    synonyms: ['MAHINA'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'neutral', hands: 'right',
    path: { t: 'side', dx: 14, dy: 0 }, reps: 1, w: 6, status: 'unverified'
  },
  {
    id: 'YEAR', en: 'YEAR', hi: 'साल', cat: 'time',
    senses: [{ text: 'year', note: 'Both fists circle around each other.' }],
    synonyms: ['SAAL'],
    hs: { f: [2, 2, 2, 2, 2], th: 'front' }, loc: 'neutral', hands: 'both',
    path: { t: 'circle', r: 17 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'MORNING', en: 'MORNING', hi: 'सुबह', cat: 'time',
    senses: [{ text: 'morning (the hours)', note: 'Hand lifts from the chest.' }],
    synonyms: ['SUBAH'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'chest', hands: 'right',
    path: { t: 'up', dx: 0, dy: -22 }, reps: 1, w: 14, status: 'unverified'
  },
  {
    id: 'EVENING', en: 'EVENING', hi: 'शाम', cat: 'time',
    senses: [{ text: 'evening', note: 'Hand lowers from the chest.' }],
    synonyms: ['SHAAM'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'chest', hands: 'right',
    path: { t: 'down', dx: 0, dy: 20 }, reps: 1, w: -10, status: 'unverified'
  },

  /* ── PLACES & OBJECTS ───────────────────────────────────────── */
  {
    id: 'HOME', en: 'HOME', hi: 'घर', cat: 'places',
    senses: [{ text: 'home / house', note: 'Hands form the shape of a roof.' }],
    synonyms: ['GHAR', 'HOUSE'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'neutral', hands: 'both',
    path: { t: 'open', dx: 18, dy: 0 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'SCHOOL', en: 'SCHOOL', hi: 'स्कूल', cat: 'places',
    senses: [{ text: 'school', note: 'Hands clap together twice.' }],
    synonyms: ['SCHOOL_H'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'neutral', hands: 'both',
    path: { t: 'tap', dx: 0, dy: 0 }, reps: 2, w: 0, status: 'unverified'
  },
  {
    id: 'WORKPLACE', en: 'OFFICE', hi: 'कार्यालय', cat: 'places',
    senses: [{ text: 'office / workplace', note: 'Both hands form a rectangle.' }],
    synonyms: ['OFFICE', 'KARYALAY'],
    hs: { f: [1, 1, 1, 1, 1], th: 'o' }, loc: 'neutral', hands: 'both',
    path: { t: 'side', dx: 20, dy: 0 }, reps: 1, w: 0, status: 'unverified', oval: true
  },
  {
    id: 'MARKET', en: 'MARKET', hi: 'बाज़ार', cat: 'places',
    senses: [{ text: 'market / shop', note: 'Hands swing outwards from the wrists.' }],
    synonyms: ['BAZAAR', 'SHOP'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'neutral', hands: 'both',
    path: { t: 'wave', dx: 18, dy: 0 }, reps: 2, w: 0, status: 'unverified'
  },
  {
    id: 'HOSPITAL', en: 'HOSPITAL', hi: 'अस्पताल', cat: 'places',
    senses: [{ text: 'hospital / clinic', note: 'H-hand draws a cross on the upper arm.' }],
    synonyms: ['ASPITAL'],
    hs: { f: [2, 0, 0, 2, 2], th: 'folded' }, loc: 'upperarm', hands: 'right',
    path: { t: 'side', dx: 14, dy: 0 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'BOOK', en: 'BOOK', hi: 'किताब', cat: 'places',
    senses: [{ text: 'book', note: 'Both flat palms open like a book.' }],
    synonyms: ['KITAAB'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'neutral', hands: 'both',
    path: { t: 'open', dx: 20, dy: 0 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'PHONE', en: 'PHONE', hi: 'फ़ोन', cat: 'places',
    senses: [{ text: 'phone / mobile', note: 'Y-hand held to the ear.' }],
    synonyms: ['FOON', 'MOBILE'],
    hs: { f: [0, 2, 2, 2, 0], th: 'out' }, loc: 'ear', hands: 'right',
    path: { t: 'tap', dx: 0, dy: 0 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'MONEY', en: 'MONEY', hi: 'पैसा', cat: 'places',
    senses: [{ text: 'money', note: 'Bent-O hand taps the open palm.' }],
    synonyms: ['PAISA', 'RUPEES'],
    hs: { f: [1, 1, 1, 1, 1], th: 'o' }, loc: 'neutral', hands: 'both',
    path: { t: 'tap', dx: 0, dy: 6 }, reps: 2, w: 0, status: 'unverified', oval: true
  },
  {
    id: 'CAR', en: 'CAR', hi: 'गाड़ी', cat: 'places',
    senses: [{ text: 'car / vehicle', note: 'Both fists turn a steering wheel.' }],
    synonyms: ['GAADI', 'VEHICLE'],
    hs: { f: [2, 2, 2, 2, 2], th: 'front' }, loc: 'neutral', hands: 'both',
    path: { t: 'circle', r: 19 }, reps: 2, w: 0, status: 'unverified'
  },
  {
    id: 'MUSIC', en: 'MUSIC', hi: 'संगीत', cat: 'places',
    senses: [{ text: 'music / song', note: 'Flat hand waves like a conductor.' }],
    synonyms: ['SANGEET', 'SONG'],
    hs: { f: [2, 0, 0, 0, 0], th: 'folded' }, loc: 'neutral', hands: 'right',
    path: { t: 'wave', dx: 26, dy: 0 }, reps: 2, w: 0, status: 'unverified'
  },
  {
    id: 'CITY', en: 'CITY', hi: 'शहर', cat: 'places',
    senses: [{ text: 'city / town', note: 'Both hands draw a building outline.' }],
    synonyms: ['SHAHAR', 'TOWN'],
    hs: { f: [2, 0, 2, 2, 2], th: 'up' }, loc: 'neutral', hands: 'both',
    path: { t: 'up', dx: 0, dy: -18 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'PLACE', en: 'PLACE', hi: 'जगह', cat: 'places',
    senses: [{ text: 'place / location', note: 'Both hands come together to mark a spot.' }],
    synonyms: ['JAGAH', 'PLACE_H'],
    hs: { f: [2, 0, 2, 2, 2], th: 'up' }, loc: 'neutral', hands: 'both',
    path: { t: 'in', dx: 0, dy: 0 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'PENCIL', en: 'PENCIL', hi: 'पेंसिल', cat: 'places',
    senses: [{ text: 'pencil', note: 'Index and thumb mime writing.' }],
    synonyms: ['PENCIL_H', 'LIKHNE_KI'],
    hs: { f: [2, 0, 2, 2, 2], th: 'up' }, loc: 'neutral', hands: 'right',
    path: { t: 'side', dx: 16, dy: 0 }, reps: 1, w: 8, status: 'unverified'
  },
  {
    id: 'CHAIR', en: 'CHAIR', hi: 'कुर्सी', cat: 'places',
    senses: [{ text: 'chair', note: 'V-fingers rest on the extended fingers.' }],
    synonyms: ['KURSI'],
    hs: { f: [2, 0, 0, 2, 2], th: 'folded' }, loc: 'neutral', hands: 'both',
    path: { t: 'down', dx: 0, dy: 10 }, reps: 1, w: 0, status: 'unverified'
  },
  {
    id: 'AIR', en: 'AIR', hi: 'हवा', cat: 'places',
    senses: [{ text: 'air / wind', note: 'Both open hands wave gently.' }],
    synonyms: ['HAWA'],
    hs: { f: [0, 0, 0, 0, 0], th: 'out' }, loc: 'neutral', hands: 'both',
    path: { t: 'wave', dx: 20, dy: 0 }, reps: 2, w: 0, status: 'unverified'
  }
];

/* ---------------------------------------------------------------------
   NUMBERS & MANUAL ALPHABET
   Fingerspelling entries carry the same shape/hand data so that they can
   be animated and searched. They are flagged as `letter`/`number` so the
   learner interface can group them separately, and their note reminds
   the learner to confirm the canonical handshape in the official
   dictionary.
   --------------------------------------------------------------------- */
const ISL_FINGERSPELLING = [
  { id: 'A', letter: 'A', f: [2, 2, 2, 2, 2], th: 'side' },
  { id: 'B', letter: 'B', f: [2, 0, 0, 0, 0], th: 'folded' },
  { id: 'C', letter: 'C', f: [1, 1, 1, 1, 1], th: 'curve' },
  { id: 'D', letter: 'D', f: [2, 0, 2, 2, 2], th: 'touch' },
  { id: 'E', letter: 'E', f: [1, 1, 1, 1, 1], th: 'under' },
  { id: 'F', letter: 'F', f: [2, 2, 0, 0, 0], th: 'touch_idx' },
  { id: 'G', letter: 'G', f: [1, 0, 2, 2, 2], th: 'point' },
  { id: 'H', letter: 'H', f: [2, 0, 0, 2, 2], th: 'folded' },
  { id: 'I', letter: 'I', f: [2, 2, 2, 2, 0], th: 'folded' },
  { id: 'J', letter: 'J', f: [2, 2, 2, 2, 0], th: 'folded' },
  { id: 'K', letter: 'K', f: [1, 0, 0, 2, 2], th: 'between' },
  { id: 'L', letter: 'L', f: [1, 0, 2, 2, 2], th: 'up' },
  { id: 'M', letter: 'M', f: [1, 2, 2, 2, 2], th: 'under3' },
  { id: 'N', letter: 'N', f: [1, 2, 2, 2, 2], th: 'under2' },
  { id: 'O', letter: 'O', f: [1, 1, 1, 1, 1], th: 'o' },
  { id: 'P', letter: 'P', f: [1, 0, 2, 2, 2], th: 'point' },
  { id: 'Q', letter: 'Q', f: [2, 0, 2, 2, 2], th: 'point2' },
  { id: 'R', letter: 'R', f: [2, 0, 0, 2, 2], th: 'folded' },
  { id: 'S', letter: 'S', f: [2, 2, 2, 2, 2], th: 'front' },
  { id: 'T', letter: 'T', f: [1, 2, 2, 2, 2], th: 'between_if' },
  { id: 'U', letter: 'U', f: [2, 0, 0, 2, 2], th: 'folded' },
  { id: 'V', letter: 'V', f: [2, 0, 0, 2, 2], th: 'folded' },
  { id: 'W', letter: 'W', f: [2, 0, 0, 0, 2], th: 'folded' },
  { id: 'X', letter: 'X', f: [2, 1, 2, 2, 2], th: 'folded' },
  { id: 'Y', letter: 'Y', f: [0, 2, 2, 2, 0], th: 'out' },
  { id: 'Z', letter: 'Z', f: [2, 0, 2, 2, 2], th: 'folded' }
].map(function (row) {
  return {
    id: 'FS_' + row.id,
    en: row.letter,
    hi: 'हस्तलेखन ' + row.letter,
    cat: 'numbers',
    type: 'letter',
    senses: [{ text: 'fingerspelled letter ' + row.letter, note: 'Manual alphabet used for names and words without a dedicated sign.' }],
    synonyms: [],
    hs: { f: row.f, th: row.th },
    loc: 'neutral',
    hands: 'right',
    path: row.id === 'J' ? { t: 'arc', dx: 26, dy: -16 } : (row.id === 'Z' ? { t: 'z', dx: 24, dy: 16 } : null),
    reps: 1,
    w: 0,
    status: 'unverified',
    spell: true,
    sources: ['islrtc-dictionary', 'signverse-local']
  };
});

const ISL_NUMBERS = [
  { id: 'ONE', digit: '1', f: [2, 0, 2, 2, 2], th: 'folded' },
  { id: 'TWO', digit: '2', f: [2, 0, 0, 2, 2], th: 'folded' },
  { id: 'THREE', digit: '3', f: [2, 0, 0, 0, 2], th: 'up' },
  { id: 'FOUR', digit: '4', f: [2, 0, 0, 0, 0], th: 'folded' },
  { id: 'FIVE', digit: '5', f: [0, 0, 0, 0, 0], th: 'out' },
  { id: 'SIX', digit: '6', f: [0, 2, 2, 2, 0], th: 'out' },
  { id: 'SEVEN', digit: '7', f: [0, 2, 2, 0, 2], th: 'out' },
  { id: 'EIGHT', digit: '8', f: [0, 2, 0, 2, 2], th: 'out' },
  { id: 'NINE', digit: '9', f: [0, 0, 2, 2, 2], th: 'up' },
  { id: 'TEN', digit: '10', f: [2, 2, 2, 2, 2], th: 'up' }
].map(function (row, idx) {
  return {
    id: 'NUM_' + row.id,
    en: row.digit,
    hi: ['एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस'][idx],
    cat: 'numbers',
    type: 'number',
    senses: [{ text: 'number ' + row.digit, note: 'Counting numbers in ISL.' }],
    synonyms: [],
    hs: { f: row.f, th: row.th },
    loc: 'neutral',
    hands: 'right',
    path: null,
    reps: 1,
    w: 0,
    status: 'unverified',
    sources: ['islrtc-dictionary', 'signverse-local']
  };
});

const ISL_ALL_ENTRIES = ISL_LEXICON.concat(ISL_FINGERSPELLING, ISL_NUMBERS);

/* ---------------------------------------------------------------------
   LOOKUP + SEARCH
   --------------------------------------------------------------------- */

/* Emoji used on the chips / cards. Explicit per word, with a category
   fallback for everything that is not listed. */
const ISL_EMOJI = {
  HELLO: '👋', NAMASTE: '🙏', GOODBYE: '👋', GOOD_MORNING: '🌅', GOOD_NIGHT: '🌙',
  HOW_ARE_YOU: '🤗', YES: '✅', NO: '❌', WELCOME: '🤗', EXCUSE_ME: '🙋',
  THANK_YOU: '🙏', DHANYAVAAD: '🙏', SORRY: '😔', PLEASE: '🙏', GOOD: '👍', BAD: '👎',
  SHUKRIYA: '🤝', LOVE: '❤️', HAPPY: '😊', SAD: '😢', ANGRY: '😠', SCARED: '😱',
  EXCITED: '🤩', TIRED: '😴', SURPRISED: '😲', I_LOVE_YOU: '🤟', FUNNY: '😄',
  SHY: '😊', WORRIED: '😰', PROUD: '😌',
  MOTHER: '👩', FATHER: '👨', SISTER: '👧', BROTHER: '👦', FRIEND: '🤝', FAMILY: '👨‍👩‍👧',
  CHILD: '🧒', MAN: '👨', WOMAN: '👩', BOY: '👦', GIRL: '👧', BABY: '👶',
  TEACHER: '👩‍🏫', DOCTOR: '👨‍⚕️', FRIENDS: '👬',
  FOOD: '🍽️', EAT: '🍴', DRINK: '🥤', WATER: '💧', MILK: '🥛', TEA: '☕', RICE: '🍚',
  BREAD: '🥖', FRUIT: '🍎', BANANA: '🍌', SWEET: '🍬', HOT: '🔥', COLD: '🧊',
  HUNGRY: '🤤', COFFEE: '☕', ICE_CREAM: '🍦',
  RED: '🔴', BLUE: '🔵', GREEN: '🟢', YELLOW: '🟡', WHITE: '⚪', BLACK: '⚫', BROWN: '🟤',
  TODAY: '📅', TOMORROW: '⏭️', YESTERDAY: '⏮️', TIME: '⏰', DAY: '🌞', NIGHT: '🌜',
  WEEK: '🗓️', MONTH: '📆', YEAR: '🎊', MORNING: '🌄', EVENING: '🌆',
  HOME: '🏠', SCHOOL: '🏫', WORKPLACE: '🏢', MARKET: '🛒', HOSPITAL: '🏥', BOOK: '📚',
  PHONE: '📱', MONEY: '💰', CAR: '🚗', MUSIC: '🎵', CITY: '🏙️', PLACE: '📍',
  PENCIL: '✏️', CHAIR: '🪑', AIR: '💨',
  GO: '👉', COME: '👈', SLEEP: '😴', WAKE_UP: '⏰', WALK: '🚶', RUN: '🏃', READ: '📖',
  WRITE: '✍️', LEARN: '🎓', TEACH: '👩‍🏫', KNOW: '💡', UNDERSTAND: '🧠', TALK: '💬',
  SEND: '📤', RECEIVE: '📥', GIVE: '🤲', TAKE: '🤏', HELP: '🆘', STOP: '🛑', WAIT: '⏳',
  WORK: '💼', PLAY: '🎮', MOVE: '🔀', BUY: '🛍️', SIGN: '🤟', DEAF: '👂', LISTEN: '👂',
  SIT: '🪑', STAND: '🧍', USE: '🛠️', OPEN: '🔓', CLOSE: '🔒', BRUSH_TEETH: '🪥',
  SHOWER: '🚿', EAT_DRINK: '🍽️', I: '🙋', YOU: '👉', HE: '👉', SHE: '👉', WE: '👥',
  THEY: '👥', IT: '👉', MY: '🙋', YOUR: '👉', MY_NAME: '🪪', NAMES: '🪪', WHERE_FROM: '🧭'
};

const ISLDictionary = (function () {
  const byId = new Map();
  const byEn = new Map();       // normalised english term -> entry
  const byHi = new Map();       // normalised hindi term -> entry
  const bySynonym = new Map();  // normalised synonym -> entry

  function norm(s) {
    return String(s || '').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
  }

  ISL_ALL_ENTRIES.forEach(function (e) {
    e.type = e.type || 'word';
    e.status = e.status || 'unverified';
    e.sources = e.sources && e.sources.length ? e.sources : ['islrtc-dictionary', 'signverse-local'];
    e.variants = e.variants || [];
    e.synonyms = e.synonyms || [];
    e.senses = e.senses && e.senses.length ? e.senses : [{ text: e.en, note: '' }];
    e.reps = e.reps || 1;
    e.hands = e.hands || 'right';
    e.hs = e.hs || { f: [0, 0, 0, 0, 0], th: 'out' };
    e.loc = e.loc || 'neutral';
    e.catLabel = (ISL_CATS.find(function (c) { return c.id === e.cat; }) || {}).label || 'Other';
    byId.set(e.id, e);
    if (!byEn.has(norm(e.en))) byEn.set(norm(e.en), e);
    if (e.hi && !byHi.has(norm(e.hi))) byHi.set(norm(e.hi), e);
    e.synonyms.forEach(function (s) {
      const k = norm(s);
      if (k && !bySynonym.has(k)) bySynonym.set(k, e);
    });
  });

  /** All entries (words first, then letters & numbers). */
  function all() {
    return ISL_ALL_ENTRIES.slice();
  }

  function words() {
    return ISL_LEXICON.slice();
  }

  /** Stable list of the word entries (ids), used by Learn / Quiz. */
  function wordIds() {
    return ISL_LEXICON.map(function (e) { return e.id; });
  }

  /** Emoji for a sign id (explicit map first, category fallback second). */
  function emoji(id) {
    if (ISL_EMOJI[id]) return ISL_EMOJI[id];
    const e = byId.get(id);
    if (e) {
      const cat = ISL_CATS.find(function (c) { return c.id === e.cat; });
      if (cat) return cat.emoji;
    }
    return '🤟';
  }

  /** Learn-sidebar groups, derived from the lexicon. */
  function categoryGroups() {
    const groups = {};
    ISL_LEXICON.forEach(function (e) {
      (groups[e.cat] = groups[e.cat] || []).push(e.id);
    });
    return Object.keys(groups).map(function (cat) {
      const meta = ISL_CATS.find(function (c) { return c.id === cat; }) || { label: cat, emoji: '🤟' };
      return { id: cat, label: meta.emoji + ' ' + meta.label, ids: groups[cat] };
    });
  }

  function byCategory(cat) {
    return ISL_ALL_ENTRIES.filter(function (e) { return e.cat === cat; });
  }

  function get(id) {
    return byId.get(id) || null;
  }

  /** Resolve any surface form (english, hindi or synonym) to an entry. */
  function resolve(term) {
    const k = norm(term);
    if (!k) return null;
    return byEn.get(k) || byHi.get(k) || bySynonym.get(k) || null;
  }

  /** Entries that belong to a variant of `entry` (alternate / regional). */
  function variantsOf(entry) {
    if (!entry) return [];
    const out = [];
    (entry.variants || []).forEach(function (v) {
      const target = byId.get(v.id) || resolve(v.id);
      if (target) out.push({ meta: v, entry: target });
    });
    return out;
  }

  /** Reverse lookup: which entries list `id` as a variant. */
  function variantParents(id) {
    return ISL_ALL_ENTRIES.filter(function (e) {
      return (e.variants || []).some(function (v) { return v.id === id; });
    });
  }

  /**
   * Fast search over english, hindi, synonyms and senses.
   * Returns a scored list; the best match is first.
   */
  function search(query, opts) {
    const options = opts || {};
    const q = norm(query);
    if (!q) {
      const cat = options.category;
      const list = cat ? byCategory(cat) : all();
      return list.map(function (e) { return { entry: e, score: 0, matchedOn: 'all' }; });
    }
    const terms = q.split(' ').filter(Boolean);
    const results = [];
    for (const entry of ISL_ALL_ENTRIES) {
      if (options.category && entry.cat !== options.category) continue;
      if (options.type && entry.type !== options.type) continue;
      let score = 0;
      let matchedOn = null;
      const en = norm(entry.en);
      const hi = norm(entry.hi);
      const syn = entry.synonyms.map(norm);
      const senses = entry.senses.map(function (s) { return norm(s.text); });

      if (en === q) { score += 100; matchedOn = 'en'; }
      if (hi === q) { score += 95; matchedOn = matchedOn || 'hi'; }
      if (syn.indexOf(q) !== -1) { score += 80; matchedOn = matchedOn || 'synonym'; }
      if (senses.indexOf(q) !== -1) { score += 70; matchedOn = matchedOn || 'sense'; }
      if (en.indexOf(q) === 0) { score += 55; matchedOn = matchedOn || 'en'; }
      if (hi.indexOf(q) === 0) { score += 50; matchedOn = matchedOn || 'hi'; }
      if (en.indexOf(q) !== -1) { score += 30; matchedOn = matchedOn || 'en'; }
      if (hi.indexOf(q) !== -1) { score += 28; matchedOn = matchedOn || 'hi'; }
      if (syn.some(function (s) { return s.indexOf(q) !== -1; })) { score += 22; matchedOn = matchedOn || 'synonym'; }
      if (senses.some(function (s) { return s.indexOf(q) !== -1; })) { score += 16; matchedOn = matchedOn || 'sense'; }
      if (!matchedOn) {
        // token level match (e.g. "good morning" for GOOD_MORNING)
        const hit = terms.every(function (t) {
          return en.indexOf(t) !== -1 || hi.indexOf(t) !== -1 ||
            syn.some(function (s) { return s.indexOf(t) !== -1; }) ||
            senses.some(function (s) { return s.indexOf(t) !== -1; });
        });
        if (hit) { score += 12; matchedOn = 'tokens'; }
      }
      if (score > 0) results.push({ entry: entry, score: score, matchedOn: matchedOn });
    }
    results.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.entry.en.localeCompare(b.entry.en);
    });
    return results;
  }

  /** Category list with live counts. */
  function categories() {
    return ISL_CATS.map(function (c) {
      return {
        id: c.id, label: c.label, emoji: c.emoji,
        count: ISL_ALL_ENTRIES.filter(function (e) { return e.cat === c.id; }).length
      };
    });
  }

  /** Verification summary used by the UI badges. */
  function statusOf(entry) {
    const s = entry.status || 'unverified';
    if (s === 'reviewed-3d') {
      return { key: 'reviewed-3d', label: 'Reviewed 3D', tone: 'ok', detail: 'The local 3D animation was reviewed against an ISLRTC reference demonstration.' };
    }
    if (s === 'verified-video') {
      return { key: 'verified-video', label: 'Verified video', tone: 'ok', detail: 'An ISLRTC demonstration video is the reference for this sign.' };
    }
    if (s === 'unavailable') {
      return { key: 'unavailable', label: 'Demonstration unavailable', tone: 'warn', detail: entry.unavailableReason || 'No demonstration is available for this entry yet.' };
    }
    return {
      key: 'unverified', label: 'Unverified approximation', tone: 'warn',
      detail: 'This local animation is an approximation written for SignVerse. It has not been validated against an ISLRTC demonstration video.'
    };
  }

  /**
   * Convert an entry into the shape object understood by the 2D fallback
   * renderer (same format as the legacy sign table).
   */
  function legacyShape(entry) {
    if (!entry) return null;
    const hs = entry.hs || { f: [0, 0, 0, 0, 0], th: 'out' };
    const shape = {
      f: hs.f.slice(),
      th: hs.th,
      w: entry.w || 0,
      hands: entry.hands || 'right',
      type: entry.type === 'letter' ? 'letter' : 'word',
      desc: entry.senses && entry.senses[0] ? entry.senses[0].text : entry.en
    };
    if (entry.path) shape.motion = { t: entry.path.t, dx: entry.path.dx || 0, dy: entry.path.dy || 0, r: entry.path.r || 0 };
    if (entry.curve) shape.curve = true;
    if (entry.oval) shape.oval = true;
    return shape;
  }

  return {
    all: all, words: words, wordIds: wordIds, get: get, resolve: resolve, search: search,
    byCategory: byCategory, categories: categories, variantsOf: variantsOf,
    variantParents: variantParents, statusOf: statusOf, norm: norm,
    legacyShape: legacyShape, emoji: emoji, categoryGroups: categoryGroups
  };
})();

if (typeof window !== 'undefined') window.ISLDictionary = ISLDictionary;
