

// ── TYPING ANIMATION ────────────────────────────────────
const TW=['sign 🤙','hello 👋','love ❤️','friend 🤝','good morning ☀️'];
let twi=0,tci=0,tdir=1;
function typeA(){
  const el=document.getElementById('tw'),w=TW[twi];
  if(tdir===1){el.textContent=w.slice(0,++tci);if(tci>=w.length){tdir=-1;setTimeout(typeA,1800);return}}
  else{el.textContent=w.slice(0,--tci);if(tci<=0){tdir=1;twi=(twi+1)%TW.length;setTimeout(typeA,350);return}}
  setTimeout(typeA,tdir===1?85:45);
}
typeA();

// ── SIGN DATA ───────────────────────────────────────────
const S={
  A:{f:[2,2,2,2,2],th:'side',w:0,type:'letter'},
  B:{f:[2,0,0,0,0],th:'folded',w:0,type:'letter'},
  C:{f:[1,1,1,1,1],th:'curve',w:0,type:'letter',curve:true},
  D:{f:[2,0,2,2,2],th:'touch',w:0,type:'letter'},
  E:{f:[1,1,1,1,1],th:'under',w:0,type:'letter'},
  F:{f:[2,2,0,0,0],th:'touch_idx',w:0,type:'letter'},
  G:{f:[1,0,2,2,2],th:'point',w:15,type:'letter'},
  H:{f:[2,0,0,2,2],th:'folded',w:15,type:'letter'},
  I:{f:[2,2,2,2,0],th:'folded',w:0,type:'letter'},
  J:{f:[2,2,2,2,0],th:'folded',w:0,type:'letter',motion:{t:'arc',dx:28,dy:-18}},
  K:{f:[1,0,0,2,2],th:'between',w:0,type:'letter'},
  L:{f:[1,0,2,2,2],th:'up',w:0,type:'letter'},
  M:{f:[1,2,2,2,2],th:'under3',w:0,type:'letter'},
  N:{f:[1,2,2,2,2],th:'under2',w:0,type:'letter'},
  O:{f:[1,1,1,1,1],th:'o',w:0,type:'letter',oval:true},
  P:{f:[1,0,2,2,2],th:'point',w:-30,type:'letter'},
  Q:{f:[2,0,2,2,2],th:'point2',w:-40,type:'letter'},
  R:{f:[2,0,0,2,2],th:'folded',w:0,type:'letter',cross:true},
  S:{f:[2,2,2,2,2],th:'front',w:0,type:'letter'},
  T:{f:[1,2,2,2,2],th:'between_if',w:0,type:'letter'},
  U:{f:[2,0,0,2,2],th:'folded',w:0,type:'letter'},
  V:{f:[2,0,0,2,2],th:'folded',w:0,type:'letter',vsplit:true},
  W:{f:[2,0,0,0,2],th:'folded',w:0,type:'letter'},
  X:{f:[2,1,2,2,2],th:'folded',w:0,type:'letter'},
  Y:{f:[0,2,2,2,0],th:'out',w:0,type:'letter'},
  Z:{f:[2,0,2,2,2],th:'folded',w:0,type:'letter',motion:{t:'z',dx:28,dy:18}},
  HELLO:{f:[2,0,0,0,0],th:'folded',w:22,type:'word',cat:'greet',desc:'Open-hand salute sweeping outward from forehead',motion:{t:'arc',dx:40,dy:-10},hands:'right'},
  HI:{f:[2,0,0,0,0],th:'folded',w:28,type:'word',cat:'greet',desc:'Quick friendly wave from temple',motion:{t:'wave',dx:30,dy:0},hands:'right'},
  BYE:{f:[2,0,0,0,0],th:'folded',w:0,type:'word',cat:'greet',desc:'Wave fingers — goodbye!',motion:{t:'wave',dx:0,dy:18},hands:'right'},
  GOOD_MORNING:{f:[2,0,0,0,0],th:'folded',w:20,type:'word',cat:'greet',desc:'Flat hand sweeps upward like the rising sun',motion:{t:'arc',dx:20,dy:-25},hands:'right'},
  GOOD_NIGHT:{f:[2,0,0,0,0],th:'folded',w:-25,type:'word',cat:'greet',desc:'Fingers bend down like the sun setting',motion:{t:'down',dx:0,dy:22},hands:'right'},
  THANK:{f:[2,0,0,0,0],th:'folded',w:30,type:'word',cat:'greet',desc:'Flat hand moves from chin forward',motion:{t:'forward',dx:0,dy:-28},hands:'right'},
  SORRY:{f:[2,2,2,2,2],th:'front',w:0,type:'word',cat:'greet',desc:'A-hand circles on chest',motion:{t:'circle',r:22},hands:'right'},
  PLEASE:{f:[2,0,0,0,0],th:'folded',w:0,type:'word',cat:'greet',desc:'B-hand rubs circle on chest',motion:{t:'circle',r:18},hands:'right'},
  WELCOME:{f:[2,0,0,0,0],th:'folded',w:15,type:'word',cat:'greet',desc:'Open hand sweeps inward',motion:{t:'arc',dx:-28,dy:0},hands:'right'},
  YES:{f:[2,2,2,2,2],th:'front',w:-10,type:'word',cat:'greet',desc:'S-hand nods like a head saying yes',motion:{t:'nod',dx:0,dy:14},hands:'right'},
  NO:{f:[2,0,0,2,2],th:'side',w:0,type:'word',cat:'greet',desc:'Index and middle snap to thumb',motion:{t:'snap',dx:0,dy:9},hands:'right'},
  HOW_ARE_YOU:{f:[1,0,0,0,0],th:'up',w:0,type:'word',cat:'greet',desc:'Bent hands turn upward — how are you?',motion:{t:'up',dx:0,dy:-20},hands:'both'},
  EXCUSE_ME:{f:[2,0,0,0,0],th:'folded',w:10,type:'word',cat:'greet',desc:'Fingertips brush across palm',motion:{t:'side',dx:28,dy:0},hands:'both'},
  NAME:{f:[2,0,0,2,2],th:'folded',w:0,type:'word',cat:'greet',desc:'H-fingers tap each other',motion:{t:'tap',dx:0,dy:7},hands:'both'},
  LOVE:{f:[2,2,2,2,2],th:'side',w:-15,type:'word',cat:'emotion',desc:'Cross fists over chest — warm hug!',motion:{t:'in',dx:0,dy:18},hands:'both'},
  HAPPY:{f:[2,0,0,0,0],th:'folded',w:0,type:'word',cat:'emotion',desc:'B-hand brushes up on chest — joy rising!',motion:{t:'up',dx:0,dy:-28},hands:'right'},
  SAD:{f:[2,0,0,0,0],th:'folded',w:-20,type:'word',cat:'emotion',desc:'Open hands slide down face — tears',motion:{t:'down',dx:0,dy:28},hands:'both'},
  ANGRY:{f:[1,1,1,1,1],th:'curve',w:0,type:'word',cat:'emotion',desc:'Bent hands pull down from face',motion:{t:'down',dx:0,dy:22},hands:'both'},
  SCARED:{f:[2,2,2,2,2],th:'front',w:0,type:'word',cat:'emotion',desc:'Fists shake in front of chest',motion:{t:'shake',dx:14,dy:0},hands:'both'},
  EXCITED:{f:[1,0,2,2,2],th:'up',w:0,type:'word',cat:'emotion',desc:'Hands brush up on chest — energy!',motion:{t:'circle',r:16},hands:'both'},
  TIRED:{f:[2,0,0,0,0],th:'folded',w:-28,type:'word',cat:'emotion',desc:'Hands drop and rotate — wilting',motion:{t:'down',dx:0,dy:18},hands:'both'},
  GOOD:{f:[2,0,0,0,0],th:'folded',w:30,type:'word',cat:'emotion',desc:'Flat hand from mouth to palm',motion:{t:'forward',dx:0,dy:-18},hands:'right'},
  BAD:{f:[2,0,0,0,0],th:'folded',w:-28,type:'word',cat:'emotion',desc:'Hand flips down from mouth',motion:{t:'flip',dx:0,dy:18},hands:'right'},
  FUNNY:{f:[2,0,0,2,2],th:'folded',w:10,type:'word',cat:'emotion',desc:'U-hand brushes nose twice',motion:{t:'tap',dx:0,dy:5},hands:'right'},
  SURPRISED:{f:[0,0,0,0,0],th:'out',w:0,type:'word',cat:'emotion',desc:'Open hands fly up from cheeks',motion:{t:'up',dx:0,dy:-25},hands:'both'},
  I_LOVE_YOU:{f:[0,0,2,2,0],th:'out',w:0,type:'word',cat:'emotion',desc:'ILY hand — pinky, index, thumb out!',motion:{t:'shake',dx:10,dy:0},hands:'right'},
  BOY:{f:[1,0,0,0,0],th:'up',w:0,type:'word',cat:'people',desc:'Bent hand at brim of imaginary cap',motion:{t:'tap',dx:0,dy:0},hands:'right'},
  GIRL:{f:[2,0,2,2,2],th:'out',w:0,type:'word',cat:'people',desc:'Thumb strokes down side of cheek',motion:{t:'down',dx:0,dy:14},hands:'right'},
  MAN:{f:[0,0,0,0,0],th:'up',w:0,type:'word',cat:'people',desc:'Open hand at forehead then stomach',motion:{t:'down',dx:0,dy:20},hands:'right'},
  WOMAN:{f:[2,0,2,2,2],th:'out',w:0,type:'word',cat:'people',desc:'Thumb strokes from chin to stomach',motion:{t:'down',dx:0,dy:20},hands:'right'},
  BABY:{f:[2,0,0,0,0],th:'folded',w:0,type:'word',cat:'people',desc:'Cradle arms and rock gently',motion:{t:'rock',dx:10,dy:8},hands:'both'},
  CHILD:{f:[2,0,0,0,0],th:'folded',w:-15,type:'word',cat:'people',desc:'Flat hand pats downward — child height',motion:{t:'down',dx:0,dy:14},hands:'right'},
  MOTHER:{f:[0,0,0,0,0],th:'up',w:0,type:'word',cat:'people',desc:'Open-5 thumb taps chin twice',motion:{t:'tap',dx:0,dy:0},hands:'right'},
  FATHER:{f:[0,0,0,0,0],th:'up',w:0,type:'word',cat:'people',desc:'Open-5 thumb taps forehead twice',motion:{t:'tap',dx:0,dy:0},hands:'right'},
  SISTER:{f:[2,0,2,2,2],th:'out',w:0,type:'word',cat:'people',desc:'A-hand at chin then index fingers align',motion:{t:'side',dx:20,dy:0},hands:'right'},
  BROTHER:{f:[1,0,2,2,2],th:'up',w:0,type:'word',cat:'people',desc:'L-hand at forehead then index fingers align',motion:{t:'side',dx:20,dy:0},hands:'right'},
  FRIEND:{f:[2,0,2,2,2],th:'folded',w:0,type:'word',cat:'people',desc:'Index fingers hook together and swap',motion:{t:'swap',dx:0,dy:9},hands:'both'},
  FAMILY:{f:[2,0,2,2,2],th:'up',w:0,type:'word',cat:'people',desc:'F-hands circle outward — family circle',motion:{t:'circle',r:28},hands:'both'},
  TEACHER:{f:[1,1,1,1,1],th:'o',w:0,oval:true,type:'word',cat:'people',desc:'Flat-O hands move out from temples',motion:{t:'arc',dx:22,dy:0},hands:'both'},
  DOCTOR:{f:[2,0,0,2,2],th:'folded',w:0,type:'word',cat:'people',desc:'D-hand taps wrist — checking pulse',motion:{t:'tap',dx:0,dy:0},hands:'right'},
  GRANDMA:{f:[0,0,0,0,0],th:'up',w:0,type:'word',cat:'people',desc:'MOTHER sign bounced forward twice',motion:{t:'arc',dx:18,dy:0},hands:'right'},
  GRANDPA:{f:[0,0,0,0,0],th:'up',w:0,type:'word',cat:'people',desc:'FATHER sign bounced forward twice',motion:{t:'arc',dx:18,dy:0},hands:'right'},
  FOOD:{f:[1,1,1,1,1],th:'o',w:0,oval:true,type:'word',cat:'food',desc:'Fingertips tap mouth — yummy!',motion:{t:'tap',dx:0,dy:5},hands:'right'},
  EAT:{f:[1,1,1,1,1],th:'o',w:0,oval:true,type:'word',cat:'food',desc:'Flat-O taps mouth — nom nom!',motion:{t:'tap',dx:0,dy:7},hands:'right'},
  DRINK:{f:[1,1,1,1,1],th:'curve',w:20,type:'word',cat:'food',desc:'C-hand tilts up to mouth',motion:{t:'up',dx:0,dy:-18},hands:'right'},
  WATER:{f:[2,0,0,2,2],th:'folded',w:10,type:'word',cat:'food',desc:'W-hand taps lips twice',motion:{t:'tap',dx:0,dy:5},hands:'right'},
  MILK:{f:[2,2,2,2,2],th:'front',w:0,type:'word',cat:'food',desc:'Fist squeezes open and closed',motion:{t:'squeeze',dx:0,dy:10},hands:'right'},
  APPLE:{f:[2,0,2,2,2],th:'up',w:0,type:'word',cat:'food',desc:'X-hand twists at cheek',motion:{t:'circle',r:10},hands:'right'},
  BANANA:{f:[2,0,2,2,2],th:'out',w:0,type:'word',cat:'food',desc:'Finger peels downward like a banana',motion:{t:'down',dx:0,dy:16},hands:'both'},
  PIZZA:{f:[2,0,0,2,2],th:'folded',w:10,type:'word',cat:'food',desc:'P-hand makes Z motion',motion:{t:'z',dx:22,dy:16},hands:'right'},
  CAKE:{f:[1,0,2,2,2],th:'up',w:-10,type:'word',cat:'food',desc:'K-hand slides over fist — icing',motion:{t:'down',dx:0,dy:14},hands:'both'},
  ICE_CREAM:{f:[2,2,2,2,2],th:'front',w:0,type:'word',cat:'food',desc:'S-hand licks downward — ice cream cone!',motion:{t:'down',dx:0,dy:18},hands:'right'},
  CHOCOLATE:{f:[1,1,1,1,1],th:'o',w:0,oval:true,type:'word',cat:'food',desc:'C-hand circles over back of other hand',motion:{t:'circle',r:16},hands:'both'},
  COFFEE:{f:[2,2,2,2,2],th:'front',w:0,type:'word',cat:'food',desc:'S-hands circle like grinding coffee',motion:{t:'circle',r:14},hands:'both'},
  HOT:{f:[1,1,1,1,1],th:'curve',w:0,type:'word',cat:'food',desc:'Curved hand rotates away from mouth',motion:{t:'arc',dx:22,dy:8},hands:'right'},
  COLD:{f:[2,2,2,2,2],th:'front',w:0,type:'word',cat:'food',desc:'Fists shiver — brrr!',motion:{t:'shake',dx:8,dy:0},hands:'both'},
  SWEET:{f:[2,0,0,0,0],th:'up',w:0,type:'word',cat:'food',desc:'Fingers brush chin downward — sweet!',motion:{t:'down',dx:0,dy:10},hands:'right'},
  HUNGRY:{f:[1,1,1,1,1],th:'curve',w:0,type:'word',cat:'food',desc:'C-hand slides down chest — empty tummy',motion:{t:'down',dx:0,dy:22},hands:'right'},
  SLEEP:{f:[0,0,0,0,0],th:'out',w:-28,type:'word',cat:'daily',desc:'Open hand droops as eyes close — zzz!',motion:{t:'down',dx:0,dy:18},hands:'right'},
  WAKE_UP:{f:[1,1,2,2,2],th:'up',w:0,type:'word',cat:'daily',desc:'Index and middle spring open near eyes',motion:{t:'up',dx:0,dy:-18},hands:'both'},
  BRUSH_TEETH:{f:[2,0,2,2,2],th:'folded',w:0,type:'word',cat:'daily',desc:'Index brushes across teeth back and forth',motion:{t:'side',dx:24,dy:0},hands:'right'},
  SHOWER:{f:[0,0,0,0,0],th:'out',w:0,type:'word',cat:'daily',desc:'Open hand above head — water falling',motion:{t:'down',dx:0,dy:22},hands:'right'},
  WALK:{f:[2,0,0,0,0],th:'folded',w:0,type:'word',cat:'daily',desc:'Flat hands alternate stepping forward',motion:{t:'forward',dx:0,dy:-16},hands:'both'},
  RUN:{f:[1,0,2,2,2],th:'up',w:15,type:'word',cat:'daily',desc:'L-hands hook and pump — running!',motion:{t:'forward',dx:0,dy:-20},hands:'both'},
  READ:{f:[2,0,0,2,2],th:'folded',w:0,type:'word',cat:'daily',desc:'V-fingers sweep across open palm',motion:{t:'side',dx:28,dy:0},hands:'both'},
  WRITE:{f:[2,0,2,2,2],th:'up',w:10,type:'word',cat:'daily',desc:'Index finger writes on palm',motion:{t:'side',dx:20,dy:0},hands:'both'},
  PLAY:{f:[0,2,2,2,0],th:'out',w:0,type:'word',cat:'daily',desc:'Y-hands shake — let\'s play!',motion:{t:'shake',dx:14,dy:0},hands:'both'},
  WORK:{f:[2,2,2,2,2],th:'front',w:0,type:'word',cat:'daily',desc:'S-hands tap wrists together',motion:{t:'tap',dx:0,dy:9},hands:'both'},
  HOME:{f:[1,1,1,1,1],th:'o',w:0,oval:true,type:'word',cat:'daily',desc:'O-hand at mouth then flat on cheek',motion:{t:'arc',dx:18,dy:0},hands:'right'},
  SCHOOL:{f:[2,0,0,0,0],th:'folded',w:0,type:'word',cat:'daily',desc:'Open hands clap together twice',motion:{t:'tap',dx:0,dy:0},hands:'both'},
  BOOK:{f:[2,0,0,0,0],th:'folded',w:0,type:'word',cat:'daily',desc:'Flat palms open like a book',motion:{t:'open',dx:22,dy:0},hands:'both'},
  PENCIL:{f:[2,0,2,2,2],th:'up',w:10,type:'word',cat:'daily',desc:'Index and thumb hold pencil and write',motion:{t:'side',dx:18,dy:0},hands:'right'},
  PHONE:{f:[0,2,2,2,0],th:'out',w:0,type:'word',cat:'daily',desc:'Y-hand (thumb + pinky) held to ear',motion:{t:'tap',dx:0,dy:0},hands:'right'},
  MUSIC:{f:[2,0,0,0,0],th:'folded',w:0,type:'word',cat:'daily',desc:'Flat hand waves like a conductor',motion:{t:'wave',dx:28,dy:0},hands:'right'},
  CAR:{f:[2,2,2,2,2],th:'front',w:0,type:'word',cat:'daily',desc:'Fists turn steering wheel — vroom!',motion:{t:'circle',r:20},hands:'both'},
  HELP:{f:[2,2,2,2,2],th:'up',w:-18,type:'word',cat:'basics',desc:'Fist on palm lifts upward — helping hand!',motion:{t:'up',dx:0,dy:-28},hands:'both'},
  MORE:{f:[1,1,1,1,1],th:'o',w:0,oval:true,type:'word',cat:'basics',desc:'Flat-O hands tap fingertips — more please!',motion:{t:'tap',dx:18,dy:0},hands:'both'},
  STOP:{f:[2,0,0,0,0],th:'folded',w:0,type:'word',cat:'basics',desc:'Open hand chops down onto palm',motion:{t:'chop',dx:0,dy:18},hands:'both'},
  WAIT:{f:[0,0,0,0,0],th:'out',w:0,type:'word',cat:'basics',desc:'Both hands wiggle — hold on!',motion:{t:'wiggle',dx:7,dy:0},hands:'both'},
  KNOW:{f:[2,0,0,0,0],th:'folded',w:0,type:'word',cat:'basics',desc:'Bent-B taps forehead — I know!',motion:{t:'tap',dx:0,dy:0},hands:'right'},
  UNDERSTAND:{f:[2,0,2,2,2],th:'folded',w:0,type:'word',cat:'basics',desc:'Index flicks up from forehead — lightbulb!',motion:{t:'up',dx:0,dy:-16},hands:'right'},
  COME:{f:[2,0,2,2,2],th:'folded',w:0,type:'word',cat:'basics',desc:'Index finger curls toward yourself',motion:{t:'in',dx:0,dy:0},hands:'right'},
  GO:{f:[2,0,2,2,2],th:'folded',w:15,type:'word',cat:'basics',desc:'Index points and pushes forward',motion:{t:'forward',dx:0,dy:-22},hands:'right'},
  LEARN:{f:[1,1,1,1,1],th:'o',w:20,oval:true,type:'word',cat:'basics',desc:'Fingers gather to forehead — learning!',motion:{t:'up',dx:0,dy:-28},hands:'right'},
  SIGN:{f:[0,0,2,2,2],th:'out',w:0,type:'word',cat:'basics',desc:'Alternating index fingers circle',motion:{t:'circle',r:18},hands:'both'},
  DEAF:{f:[2,0,2,2,2],th:'folded',w:0,type:'word',cat:'basics',desc:'Index touches ear then corner of mouth',motion:{t:'arc',dx:0,dy:28},hands:'right'},
  RED:{f:[2,0,2,2,2],th:'folded',w:0,type:'word',cat:'color',desc:'Index strokes down from lips',motion:{t:'down',dx:0,dy:10},hands:'right'},
  BLUE:{f:[0,0,0,0,0],th:'out',w:15,type:'word',cat:'color',desc:'B-hand shakes at the side',motion:{t:'shake',dx:9,dy:0},hands:'right'},
  GREEN:{f:[2,0,0,2,2],th:'folded',w:20,type:'word',cat:'color',desc:'G-hand shakes at wrist',motion:{t:'shake',dx:11,dy:0},hands:'right'},
  YELLOW:{f:[0,2,2,2,0],th:'out',w:15,type:'word',cat:'color',desc:'Y-hand shakes at wrist',motion:{t:'shake',dx:11,dy:0},hands:'right'},
  WHITE:{f:[0,0,0,0,0],th:'out',w:0,type:'word',cat:'color',desc:'Open hand pulls away from chest',motion:{t:'forward',dx:0,dy:-22},hands:'right'},
  BLACK:{f:[2,0,2,2,2],th:'folded',w:0,type:'word',cat:'color',desc:'Index strokes across forehead',motion:{t:'side',dx:36,dy:0},hands:'right'},
  PURPLE:{f:[2,0,0,2,2],th:'folded',w:15,type:'word',cat:'color',desc:'P-hand shakes at wrist',motion:{t:'shake',dx:11,dy:0},hands:'right'},
  ONE:{f:[2,0,2,2,2],th:'folded',w:0,type:'number',cat:'number',desc:'Index finger points straight up'},
  TWO:{f:[2,0,0,2,2],th:'folded',w:0,type:'number',cat:'number',desc:'Index and middle up — V shape!',vsplit:true},
  THREE:{f:[2,0,0,0,2],th:'up',w:0,type:'number',cat:'number',desc:'Index, middle, ring with thumb'},
  FOUR:{f:[2,0,0,0,0],th:'folded',w:0,type:'number',cat:'number',desc:'Four fingers up, thumb tucked'},
  FIVE:{f:[0,0,0,0,0],th:'out',w:0,type:'number',cat:'number',desc:'All five fingers wide open!'},
  SIX:{f:[0,2,2,2,0],th:'out',w:0,type:'number',cat:'number',desc:'Pinky and thumb touch others'},
  SEVEN:{f:[0,2,2,0,2],th:'out',w:0,type:'number',cat:'number',desc:'Ring and thumb touch'},
  EIGHT:{f:[0,2,0,2,2],th:'out',w:0,type:'number',cat:'number',desc:'Middle and thumb touch'},
  NINE:{f:[0,0,2,2,2],th:'up',w:0,type:'number',cat:'number',desc:'Index bends toward thumb'},
  TEN:{f:[2,2,2,2,2],th:'up',w:0,type:'number',cat:'number',desc:'Thumb up, shake wrist!',motion:{t:'shake',dx:10,dy:0}},
  TIME:{f:[2,0,2,2,2],th:'side',w:0,type:'word',cat:'daily',desc:'Index taps wrist — checking watch',motion:{t:'tap',dx:0,dy:0},hands:'right'},

  // ── QUESTION WORDS ──────────────────────────────────────
  WHAT:{f:[0,0,0,0,0],th:'out',w:0,type:'word',cat:'question',desc:'Index sweeps across fingers of other hand — what?',motion:{t:'side',dx:22,dy:0},hands:'both'},
  WHEN:{f:[2,0,2,2,2],th:'folded',w:0,type:'word',cat:'question',desc:'Index finger circles then taps — when?',motion:{t:'circle',r:12},hands:'right'},
  WHERE:{f:[2,0,2,2,2],th:'folded',w:0,type:'word',cat:'question',desc:'Index shakes side to side — where?',motion:{t:'shake',dx:14,dy:0},hands:'right'},
  WHY:{f:[2,0,0,0,0],th:'folded',w:20,type:'word',cat:'question',desc:'Middle finger bends down from forehead — why?',motion:{t:'down',dx:0,dy:14},hands:'right'},
  HOW:{f:[1,0,0,0,0],th:'up',w:0,type:'word',cat:'question',desc:'Bent hands flip upward together — how?',motion:{t:'up',dx:0,dy:-18},hands:'both'},
  WHICH:{f:[0,2,2,2,0],th:'out',w:0,type:'word',cat:'question',desc:'Y-hands alternate up and down — which one?',motion:{t:'nod',dx:0,dy:14},hands:'both'},
  WHO:{f:[1,0,2,2,2],th:'up',w:0,type:'word',cat:'question',desc:'L-hand circles near mouth — who?',motion:{t:'circle',r:12},hands:'right'},
  WHOM:{f:[1,0,2,2,2],th:'up',w:0,type:'word',cat:'question',desc:'L-hand circles near mouth — whom?',motion:{t:'circle',r:12},hands:'right'},
  WHOSE:{f:[2,2,2,2,2],th:'front',w:0,type:'word',cat:'question',desc:'S-hand circles near mouth — whose?',motion:{t:'circle',r:12},hands:'right'},

  // ── AUXILIARY VERBS ─────────────────────────────────────
  IS:{f:[2,2,2,2,0],th:'folded',w:0,type:'word',cat:'verb',desc:'I-hand moves forward from chin — is',motion:{t:'forward',dx:0,dy:-16},hands:'right'},
  ARE:{f:[2,0,0,0,0],th:'folded',w:15,type:'word',cat:'verb',desc:'R-hand moves forward from lips — are',motion:{t:'forward',dx:0,dy:-16},hands:'right'},
  DO:{f:[1,1,1,1,1],th:'curve',w:0,type:'word',cat:'verb',desc:'Bent hands sweep side to side — do/doing',motion:{t:'side',dx:22,dy:0},hands:'both'},
  DOES:{f:[1,1,1,1,1],th:'curve',w:0,type:'word',cat:'verb',desc:'Bent hands sweep side to side — does',motion:{t:'side',dx:22,dy:0},hands:'both'},
  DID:{f:[1,1,1,1,1],th:'curve',w:-15,type:'word',cat:'verb',desc:'Bent hands sweep and drop — past tense did',motion:{t:'down',dx:0,dy:16},hands:'both'},
  CAN:{f:[2,2,2,2,2],th:'front',w:0,type:'word',cat:'verb',desc:'S-hands push down firmly — can/able',motion:{t:'down',dx:0,dy:16},hands:'both'},
  COULD:{f:[2,2,2,2,2],th:'front',w:-10,type:'word',cat:'verb',desc:'S-hands push down gently — could',motion:{t:'down',dx:0,dy:14},hands:'both'},
  WILL:{f:[2,0,0,0,0],th:'folded',w:15,type:'word',cat:'verb',desc:'Open hand moves forward from cheek — will/future',motion:{t:'forward',dx:0,dy:-20},hands:'right'},
  WOULD:{f:[2,0,0,0,0],th:'folded',w:10,type:'word',cat:'verb',desc:'Open hand moves forward softly — would',motion:{t:'forward',dx:0,dy:-16},hands:'right'},
  SHOULD:{f:[2,2,2,2,2],th:'front',w:0,type:'word',cat:'verb',desc:'S-hand taps wrist — should/must',motion:{t:'tap',dx:0,dy:8},hands:'right'},

  // ── PRONOUNS ─────────────────────────────────────────────
  I:{f:[2,2,2,2,0],th:'folded',w:0,type:'word',cat:'pronoun',desc:'I-hand (pinky up) points to self',motion:{t:'in',dx:0,dy:0},hands:'right'},
  ME:{f:[2,0,2,2,2],th:'folded',w:0,type:'word',cat:'pronoun',desc:'Index finger points to your chest — me',motion:{t:'in',dx:0,dy:0},hands:'right'},
  YOU:{f:[2,0,2,2,2],th:'folded',w:15,type:'word',cat:'pronoun',desc:'Index finger points outward at the person — you',motion:{t:'forward',dx:0,dy:-20},hands:'right'},
  HE:{f:[2,0,2,2,2],th:'folded',w:20,type:'word',cat:'pronoun',desc:'Index points to the side — he',motion:{t:'side',dx:22,dy:0},hands:'right'},
  HIM:{f:[2,0,2,2,2],th:'folded',w:20,type:'word',cat:'pronoun',desc:'Index points to the side — him',motion:{t:'side',dx:22,dy:0},hands:'right'},
  SHE:{f:[2,0,2,2,2],th:'out',w:15,type:'word',cat:'pronoun',desc:'Thumb at cheek then index points out — she',motion:{t:'side',dx:22,dy:0},hands:'right'},
  HER:{f:[2,0,2,2,2],th:'out',w:15,type:'word',cat:'pronoun',desc:'Thumb at cheek then index points out — her',motion:{t:'side',dx:22,dy:0},hands:'right'},
  IT:{f:[2,0,2,2,2],th:'folded',w:10,type:'word',cat:'pronoun',desc:'Index points to a neutral space — it',motion:{t:'side',dx:16,dy:0},hands:'right'},
  WE:{f:[2,0,2,2,2],th:'folded',w:0,type:'word',cat:'pronoun',desc:'Index touches shoulder then swings to other shoulder — we',motion:{t:'arc',dx:30,dy:0},hands:'right'},
  US:{f:[2,0,2,2,2],th:'folded',w:0,type:'word',cat:'pronoun',desc:'U-hand touches shoulder then swings — us',motion:{t:'arc',dx:28,dy:0},hands:'right'},
  THEY:{f:[2,0,2,2,2],th:'folded',w:20,type:'word',cat:'pronoun',desc:'Index sweeps outward to both sides — they',motion:{t:'side',dx:30,dy:0},hands:'right'},
  THEM:{f:[2,0,2,2,2],th:'folded',w:20,type:'word',cat:'pronoun',desc:'Index sweeps outward — them',motion:{t:'side',dx:28,dy:0},hands:'right'},

  // ── POSSESSIVES ──────────────────────────────────────────
  MY:{f:[2,0,0,0,0],th:'folded',w:0,type:'word',cat:'pronoun',desc:'Flat hand presses to own chest — my/mine',motion:{t:'in',dx:0,dy:10},hands:'right'},
  YOUR:{f:[2,0,0,0,0],th:'folded',w:15,type:'word',cat:'pronoun',desc:'Flat hand pushes toward the person — your',motion:{t:'forward',dx:0,dy:-16},hands:'right'},
  HIS:{f:[2,0,0,0,0],th:'folded',w:20,type:'word',cat:'pronoun',desc:'Flat hand pushes to the side — his',motion:{t:'side',dx:22,dy:0},hands:'right'},
  ITS:{f:[2,0,0,0,0],th:'folded',w:10,type:'word',cat:'pronoun',desc:'Flat hand pushes to neutral space — its',motion:{t:'side',dx:18,dy:0},hands:'right'},
  OUR:{f:[1,1,1,1,1],th:'curve',w:0,type:'word',cat:'pronoun',desc:'C-hand sweeps from one shoulder to the other — our',motion:{t:'arc',dx:28,dy:0},hands:'right'},
  THEIR:{f:[2,0,0,0,0],th:'folded',w:20,type:'word',cat:'pronoun',desc:'Flat hand sweeps outward to both sides — their',motion:{t:'side',dx:28,dy:0},hands:'right'},
  MINE:{f:[2,0,0,0,0],th:'folded',w:0,type:'word',cat:'pronoun',desc:'Flat hand presses firmly to chest — mine!',motion:{t:'in',dx:0,dy:12},hands:'right'},
  YOURS:{f:[2,0,0,0,0],th:'folded',w:15,type:'word',cat:'pronoun',desc:'Flat hand pushes firmly toward person — yours',motion:{t:'forward',dx:0,dy:-18},hands:'right'},
  HERS:{f:[2,0,0,0,0],th:'folded',w:18,type:'word',cat:'pronoun',desc:'Flat hand pushes to the side — hers',motion:{t:'side',dx:22,dy:0},hands:'right'},
  OURS:{f:[1,1,1,1,1],th:'curve',w:0,type:'word',cat:'pronoun',desc:'C-hand sweeps from shoulder to shoulder — ours',motion:{t:'arc',dx:28,dy:0},hands:'right'},
  THEIRS:{f:[2,0,0,0,0],th:'folded',w:20,type:'word',cat:'pronoun',desc:'Flat hand sweeps outward — theirs',motion:{t:'side',dx:28,dy:0},hands:'right'},

  // ── ACTION VERBS ─────────────────────────────────────────
  GO:{f:[2,0,2,2,2],th:'folded',w:15,type:'word',cat:'verb',desc:'Index points and pushes forward — go!',motion:{t:'forward',dx:0,dy:-22},hands:'right'},
  COME:{f:[2,0,2,2,2],th:'folded',w:0,type:'word',cat:'verb',desc:'Index curls toward yourself — come here!',motion:{t:'in',dx:0,dy:0},hands:'right'},
  SIT:{f:[2,0,0,2,2],th:'folded',w:0,type:'word',cat:'verb',desc:'V-fingers bend down onto other hand — sit down',motion:{t:'down',dx:0,dy:16},hands:'both'},
  STAND:{f:[2,0,0,2,2],th:'folded',w:0,type:'word',cat:'verb',desc:'V-fingers stand upright on open palm — stand up',motion:{t:'up',dx:0,dy:-16},hands:'both'},
  TALK:{f:[2,0,2,2,2],th:'folded',w:0,type:'word',cat:'verb',desc:'Index taps mouth twice — talking!',motion:{t:'tap',dx:0,dy:5},hands:'right'},
  SAY:{f:[2,0,2,2,2],th:'folded',w:8,type:'word',cat:'verb',desc:'Index circles near mouth — say/saying',motion:{t:'circle',r:10},hands:'right'},
  TELL:{f:[2,0,2,2,2],th:'folded',w:10,type:'word',cat:'verb',desc:'Index sweeps from chin outward — tell',motion:{t:'forward',dx:0,dy:-18},hands:'right'},
  ASK:{f:[2,0,0,0,0],th:'folded',w:-15,type:'word',cat:'verb',desc:'Flat hands come together and bow — ask/request',motion:{t:'down',dx:0,dy:16},hands:'both'},
  ANSWER:{f:[2,0,2,2,2],th:'folded',w:0,type:'word',cat:'verb',desc:'Index fingers from mouth sweep forward — answer',motion:{t:'forward',dx:0,dy:-18},hands:'both'},
  CALL:{f:[0,2,2,2,0],th:'out',w:0,type:'word',cat:'verb',desc:'Y-hand at ear — calling someone',motion:{t:'tap',dx:0,dy:0},hands:'right'},
  SEE:{f:[2,0,0,2,2],th:'folded',w:0,type:'word',cat:'verb',desc:'V-fingers from eyes sweep outward — see',motion:{t:'forward',dx:0,dy:-18},hands:'right'},
  LOOK:{f:[2,0,0,2,2],th:'folded',w:10,type:'word',cat:'verb',desc:'V-fingers point from eyes outward — look',motion:{t:'forward',dx:0,dy:-20},hands:'right'},
  WATCH:{f:[2,0,0,2,2],th:'folded',w:5,type:'word',cat:'verb',desc:'V-fingers sweep toward what you watch — watch',motion:{t:'arc',dx:18,dy:0},hands:'right'},
  HEAR:{f:[2,0,2,2,2],th:'folded',w:0,type:'word',cat:'verb',desc:'Index curls near ear — listening',motion:{t:'circle',r:10},hands:'right'},
  LISTEN:{f:[1,0,0,0,0],th:'up',w:0,type:'word',cat:'verb',desc:'L-hand cups behind ear — listen carefully',motion:{t:'tap',dx:0,dy:0},hands:'right'},
  MAKE:{f:[2,2,2,2,2],th:'front',w:0,type:'word',cat:'verb',desc:'S-hands twist on top of each other — make/create',motion:{t:'circle',r:14},hands:'both'},
  BUILD:{f:[2,0,0,0,0],th:'folded',w:0,type:'word',cat:'verb',desc:'Flat hands stack alternately upward — building up',motion:{t:'up',dx:0,dy:-22},hands:'both'},
  CREATE:{f:[1,1,1,1,1],th:'curve',w:0,type:'word',cat:'verb',desc:'Curved hands open outward — creating something new',motion:{t:'arc',dx:22,dy:0},hands:'both'},
  TRY:{f:[2,2,2,2,2],th:'front',w:0,type:'word',cat:'verb',desc:'T-hands push forward with effort — try!',motion:{t:'forward',dx:0,dy:-18},hands:'both'},
  USE:{f:[2,0,0,0,0],th:'up',w:0,type:'word',cat:'verb',desc:'U-hand circles over other fist — use/using',motion:{t:'circle',r:14},hands:'right'},
  TAKE:{f:[0,0,0,0,0],th:'out',w:0,type:'word',cat:'verb',desc:'Open hand grabs inward — take',motion:{t:'in',dx:0,dy:0},hands:'right'},
  GIVE:{f:[1,1,1,1,1],th:'o',w:15,oval:true,type:'word',cat:'verb',desc:'Flat-O opens and pushes forward — give',motion:{t:'forward',dx:0,dy:-18},hands:'right'},
  BRING:{f:[2,0,0,0,0],th:'folded',w:0,type:'word',cat:'verb',desc:'Open hands move inward toward self — bring',motion:{t:'in',dx:0,dy:0},hands:'both'},
  SEND:{f:[1,1,1,1,1],th:'o',w:15,oval:true,type:'word',cat:'verb',desc:'Flat-O flicks open and pushes away — send',motion:{t:'forward',dx:0,dy:-18},hands:'right'},
  RECEIVE:{f:[0,0,0,0,0],th:'out',w:-10,type:'word',cat:'verb',desc:'Open hands pull inward and close — receive',motion:{t:'in',dx:0,dy:8},hands:'both'},
  OPEN:{f:[2,0,0,0,0],th:'folded',w:0,type:'word',cat:'verb',desc:'Both flat hands swing open — open!',motion:{t:'arc',dx:24,dy:0},hands:'both'},
  CLOSE:{f:[2,0,0,0,0],th:'folded',w:0,type:'word',cat:'verb',desc:'Both flat hands swing together — close',motion:{t:'in',dx:0,dy:0},hands:'both'},
  START:{f:[2,0,2,2,2],th:'up',w:10,type:'word',cat:'verb',desc:'Index twists between fingers — start/begin',motion:{t:'circle',r:12},hands:'right'},
  STOP:{f:[2,0,0,0,0],th:'folded',w:0,type:'word',cat:'verb',desc:'Open hand chops down onto palm — stop!',motion:{t:'chop',dx:0,dy:18},hands:'both'},
  MOVE:{f:[1,1,1,1,1],th:'o',w:0,oval:true,type:'word',cat:'verb',desc:'Bent-O hands shift from one place to another',motion:{t:'side',dx:26,dy:0},hands:'both'},
  TRAVEL:{f:[2,0,0,2,2],th:'folded',w:10,type:'word',cat:'verb',desc:'V-fingers curve and move forward — travelling',motion:{t:'arc',dx:28,dy:-8},hands:'right'},
  WIN:{f:[0,0,0,0,0],th:'out',w:0,type:'word',cat:'verb',desc:'Open hand scoops into a fist — yes, I won!',motion:{t:'up',dx:0,dy:-18},hands:'right'},
  LOSE:{f:[0,0,0,0,0],th:'out',w:-20,type:'word',cat:'verb',desc:'Open hand drops downward — lose',motion:{t:'down',dx:0,dy:20},hands:'right'},
  STUDY:{f:[2,0,0,0,0],th:'folded',w:0,type:'word',cat:'verb',desc:'Open hand waves toward open palm — studying',motion:{t:'wave',dx:18,dy:0},hands:'both'},
  TEACH:{f:[1,1,1,1,1],th:'o',w:0,oval:true,type:'word',cat:'verb',desc:'Flat-O hands move outward from temples',motion:{t:'arc',dx:22,dy:0},hands:'both'},

  // ── NOUNS — PEOPLE & PLACES ───────────────────────────────
  PERSON:{f:[2,0,0,0,0],th:'folded',w:0,type:'word',cat:'noun',desc:'P-hand moves down both sides — person outline',motion:{t:'down',dx:0,dy:22},hands:'both'},
  PLACE:{f:[2,0,2,2,2],th:'up',w:0,type:'word',cat:'noun',desc:'P-hands make a circle and come together — place',motion:{t:'circle',r:20},hands:'both'},
  THING:{f:[2,0,0,0,0],th:'folded',w:15,type:'word',cat:'noun',desc:'Open hand bounces to the right — thing/object',motion:{t:'side',dx:20,dy:0},hands:'right'},
  DAY:{f:[2,0,2,2,2],th:'side',w:0,type:'word',cat:'noun',desc:'Index finger arcs down like the sun setting',motion:{t:'arc',dx:20,dy:15},hands:'right'},
  NIGHT:{f:[2,0,0,0,0],th:'folded',w:-20,type:'word',cat:'noun',desc:'Bent hand arcs downward over flat arm — night',motion:{t:'down',dx:0,dy:18},hands:'both'},
  YEAR:{f:[2,2,2,2,2],th:'front',w:0,type:'word',cat:'noun',desc:'S-hands circle around each other — year',motion:{t:'circle',r:18},hands:'both'},
  OFFICE:{f:[1,1,1,1,1],th:'o',w:0,oval:true,type:'word',cat:'noun',desc:'O-hands make a box shape — office/room',motion:{t:'side',dx:22,dy:0},hands:'both'},
  MARKET:{f:[2,0,0,0,0],th:'folded',w:0,type:'word',cat:'noun',desc:'Flat hands swing out from wrists — market/store',motion:{t:'wave',dx:20,dy:0},hands:'both'},
  HOSPITAL:{f:[2,0,0,2,2],th:'folded',w:0,type:'word',cat:'noun',desc:'H-hand draws a cross on upper arm — hospital',motion:{t:'side',dx:16,dy:0},hands:'right'},
  TABLE:{f:[2,0,0,0,0],th:'folded',w:0,type:'word',cat:'noun',desc:'Flat arm rests on other flat arm — table surface',motion:{t:'tap',dx:0,dy:8},hands:'both'},
  CHAIR:{f:[2,0,0,2,2],th:'folded',w:0,type:'word',cat:'noun',desc:'V-fingers sit on extended fingers — sitting in a chair',motion:{t:'down',dx:0,dy:12},hands:'both'},
  MONEY:{f:[1,1,1,1,1],th:'o',w:0,oval:true,type:'word',cat:'noun',desc:'Bent-O hand taps open palm — money',motion:{t:'tap',dx:0,dy:7},hands:'both'},
  AIR:{f:[0,0,0,0,0],th:'out',w:0,type:'word',cat:'noun',desc:'Open hands wave gently — air/wind',motion:{t:'wave',dx:22,dy:0},hands:'both'},
  PEN:{f:[2,0,2,2,2],th:'up',w:5,type:'word',cat:'noun',desc:'P-hand writes across palm — pen',motion:{t:'side',dx:18,dy:0},hands:'right'},
  COMPUTER:{f:[1,1,1,1,1],th:'o',w:0,oval:true,type:'word',cat:'noun',desc:'C-hand circles near elbow — computer',motion:{t:'circle',r:18},hands:'right'},
};


// ── HAND RENDERER ─────────────────────────────────────
// CRITICAL: All colors are FLAT HEX — no url() references!
const NS='http://www.w3.org/2000/svg';
// Richer skin palette for depth & realism
const SK='#F0956A', SKL='#F9BA90', SKD='#D4612E', SKNL='#FCEAE2', SKS='rgba(160,65,25,0.32)';
const SKHI='#FDDEC8', SKSH='rgba(120,45,10,0.18)', SKJT='#C95A28';
// ENLARGED + SPREAD finger base positions — wider X gaps between fingers
// thumb, index, middle, ring, pinky — spaced further apart for clarity
const FB=[{x:-64,y:-24},{x:-36,y:-58},{x:-8,y:-68},{x:20,y:-60},{x:46,y:-46}];
const FL=[44,76,84,74,58], FW=[16,14,14,13,12];
let speed=3, showMot=true, paused=false;

function setSpd(s,btn){
  speed=s;
  document.querySelectorAll('.sb').forEach(b=>b.classList.remove('act'));
  btn.classList.add('act');
  if(trViewer) trViewer.setSpeed(s);
  if(typeof learnViewer!=='undefined'&&learnViewer) learnViewer.setSpeed(s);
}
function upCnt(){
  const v=document.getElementById('txt').value;
  const r=200-v.length;
  document.getElementById('chl').textContent=r+' left';
  const words=v.trim().split(/\s+/).filter(Boolean).length;
  document.getElementById('long-warn').style.display=words>8?'block':'none';
  /* a new message can be started at any time, even while the previous
     sequence is still playing */
  const cta=document.querySelector('.ctabtn');
  if(cta){cta.classList.remove('busy');}
}

function togglePause(){
  if(!trViewer) return;
  paused=!trViewer.playing;
  trViewer.toggle();
  document.getElementById('pause-btn').textContent=trViewer.playing?'⏸ Pause':'▶ Resume';
}
function skipSign(){
  if(trViewer) trViewer.skip(1);
}

function el(tag,a,p){const e=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(a||{}))e.setAttribute(k,v);if(p)p.appendChild(e);return e}
function lerp(a,b,t){return a+(b-a)*t}

// ── Joint color palette by type ──
// MCP (knuckle at palm)  = green  #22C55E / #15803D
// PIP (middle knuckle)   = blue   #3B82F6 / #1D4ED8
// DIP (upper knuckle)    = purple #A855F7 / #7E22CE
// Fingertip              = red    #EF4444 / #B91C1C
// Thumb IP               = orange #F97316 / #C2410C
const JC={
  mcp:  {fill:'#22C55E', stroke:'#15803D', glow:'rgba(34,197,94,0.25)'},
  pip:  {fill:'#3B82F6', stroke:'#1D4ED8', glow:'rgba(59,130,246,0.25)'},
  dip:  {fill:'#A855F7', stroke:'#7E22CE', glow:'rgba(168,85,247,0.25)'},
  tip:  {fill:'#EF4444', stroke:'#B91C1C', glow:'rgba(239,68,68,0.25)'},
  thumb:{fill:'#F97316', stroke:'#C2410C', glow:'rgba(249,115,22,0.25)'},
};

function drawJointDot(g, x, y, r, type){
  const c=JC[type]||JC.pip;
  // Outer glow ring
  el('circle',{cx:x,cy:y,r:r+4,fill:c.glow,stroke:c.stroke,'stroke-width':'0.6',opacity:'0.7'},g);
  // Main filled dot
  el('circle',{cx:x,cy:y,r:r,fill:c.fill,stroke:c.stroke,'stroke-width':'1.3',opacity:'0.95'},g);
  // Inner white specular highlight
  el('circle',{cx:x-r*.3,cy:y-r*.3,r:r*.35,fill:'rgba(255,255,255,0.75)',stroke:'none'},g);
}

function drawHand(svg,sign,cx,cy,mirX,prog,prev){
  mirX=mirX||1; prog=prog||1;
  const wrist=lerp(prev?prev.w||0:0,sign.w||0,prog);
  const g=el('g',{transform:`translate(${cx},${cy}) scale(${mirX},1) rotate(${wrist})`},svg);

  // ── Drop shadow beneath hand ──
  el('ellipse',{cx:0,cy:52,rx:58,ry:14,fill:'rgba(100,40,10,0.13)'},g);

  // ── Wrist / arm stub ──
  el('rect',{x:-36,y:24,width:72,height:44,rx:17,fill:SKD,stroke:SKS,'stroke-width':'1.4'},g);
  el('path',{d:'M -30 28 Q 0 34 30 28',fill:'none',stroke:'rgba(160,65,25,0.25)','stroke-width':'1.3'},g);
  el('path',{d:'M -26 58 Q 0 66 26 58',fill:'none',stroke:'rgba(160,65,25,0.18)','stroke-width':'1.1'},g);
  el('ellipse',{cx:-7,cy:34,rx:14,ry:5,fill:'rgba(255,220,180,0.22)'},g);

  // ── Palm — wider + taller to match spread fingers ──
  el('path',{d:'M -58 20 C -65 -14 -58 -82 -46 -100 C -28 -118 28 -118 46 -100 C 58 -82 65 -14 58 20 C 38 38 -38 38 -58 20 Z',fill:SK,stroke:SKS,'stroke-width':'1.4'},g);
  // Palm side shading
  el('path',{d:'M -58 20 C -65 -14 -58 -82 -46 -100',fill:'none',stroke:'rgba(150,60,20,0.20)','stroke-width':'3.5','stroke-linecap':'round'},g);
  el('path',{d:'M 58 20 C 65 -14 58 -82 46 -100',fill:'none',stroke:'rgba(150,60,20,0.14)','stroke-width':'3','stroke-linecap':'round'},g);
  // Palm center highlight
  el('ellipse',{cx:0,cy:-38,rx:26,ry:36,fill:'rgba(255,220,190,0.18)'},g);
  // Palm crease lines
  el('path',{d:'M -38 -10 Q -5 -3 34 -17',fill:'none',stroke:'rgba(160,65,25,0.28)','stroke-width':'1.3','stroke-linecap':'round'},g);
  el('path',{d:'M -40 10 Q -2 6 36 -2',fill:'none',stroke:'rgba(160,65,25,0.20)','stroke-width':'1.1','stroke-linecap':'round'},g);
  el('path',{d:'M -12 20 Q 5 -24 10 -82',fill:'none',stroke:'rgba(160,65,25,0.13)','stroke-width':'1.1','stroke-linecap':'round'},g);

  // ── Knuckle bumps (metacarpal heads) ──
  for(let i=1;i<=4;i++){
    const b=FB[i];
    el('ellipse',{cx:b.x,cy:b.y+12,rx:8,ry:6,fill:SKHI,stroke:SKS,'stroke-width':'0.8',opacity:'0.8'},g);
    el('path',{d:`M ${b.x-6} ${b.y+12} Q ${b.x} ${b.y+8} ${b.x+6} ${b.y+12}`,fill:'none',stroke:'rgba(160,65,25,0.25)','stroke-width':'0.9'},g);
    drawJointDot(g, b.x, b.y+12, 5.5, 'mcp');
  }

  const f=sign.f||[0,0,0,0,0];
  drawThumb(g,FB[0],f[0],sign);
  for(let i=1;i<5;i++) drawFinger(g,FB[i],f[i],i,FL[i],FW[i],sign);
  if(sign.curve||sign.oval){
    el('ellipse',{cx:0,cy:-44,rx:sign.curve?65:52,ry:sign.curve?68:56,fill:'none',stroke:'rgba(78,205,196,0.55)','stroke-width':'2.4','stroke-dasharray':'7 5'},g);
  }
}

function drawFinger(g,base,state,fi,flen,fw,sign){
  const ang=state===0?[0,0,0]:state===1?[38,55,55]:[75,88,88];
  const lens=[flen*.38,flen*.32,flen*.30];
  const isCross=(fi===1||fi===2)&&sign.cross, isV=(fi===1||fi===2)&&sign.vsplit;
  // Extra lateral spread: each finger fans slightly outward from center
  const spread=[-10,-4,0,4,10];
  let cum=0,px=base.x,py=base.y+12;
  const cols=[SK,SKL,SKD];
  const joints=[[px,py]];
  for(let ph=0;ph<3;ph++){
    cum+=ang[ph];
    // Lateral spread adds a gentle fan; cross/vsplit override for special signs
    const ox=isCross&&fi===2?11:isV&&fi===1?-11:isV&&fi===2?11:spread[fi]*(ph+1)*0.12;
    const ex=px+Math.sin(cum*Math.PI/180)*flen*.10+ox;
    const ey=py-lens[ph]*Math.cos(cum*Math.PI/180);
    const mx=(px+ex)/2,my=(py+ey)/2,pl=Math.sqrt((ex-px)**2+(ey-py)**2)||1;
    const rot=Math.atan2(ey-py,ex-px)*180/Math.PI+90;
    el('rect',{x:mx-fw/2,y:my-pl/2,width:fw,height:pl+2,rx:fw/2,fill:cols[ph],stroke:SKS,'stroke-width':'0.9',transform:`rotate(${rot},${mx},${my})`},g);
    el('rect',{x:mx+fw/2-3.5,y:my-pl/2+2,width:3,height:Math.max(pl-5,1),rx:1.5,fill:'rgba(150,55,15,0.14)',transform:`rotate(${rot},${mx},${my})`},g);
    if(ph<2){
      el('ellipse',{cx:ex,cy:ey,rx:fw/2+3,ry:fw/2+1.2,fill:cols[ph],stroke:SKJT,'stroke-width':'0.7',opacity:'0.85'},g);
      joints.push([ex,ey]);
    }
    px=ex;py=ey;
  }
  el('ellipse',{cx:px,cy:py,rx:fw/2+2.5,ry:fw/2+3,fill:SKD,stroke:SKJT,'stroke-width':'0.8'},g);
  el('ellipse',{cx:px,cy:py-2.5,rx:fw/2-.5,ry:fw/2+1,fill:SKNL,stroke:'rgba(200,150,140,0.4)','stroke-width':'0.6'},g);
  joints.push([px,py]);

  if(joints[1]) drawJointDot(g, joints[1][0], joints[1][1], 5,   'pip');
  if(joints[2]) drawJointDot(g, joints[2][0], joints[2][1], 4.5, 'dip');
  drawJointDot(g, joints[joints.length-1][0], joints[joints.length-1][1], 3.5, 'tip');
}

function drawThumb(g,base,state,sign){
  const fw=16,tp=sign.th||'side',bx=base.x,by=base.y;
  const m={side:[bx-15,by+26],front:[bx-11,by+24],folded:[bx+17,by+34],up:[bx-22,by-20],
    out:[bx-24,by+16],curve:[bx-17,by+22],o:[bx+4,by+11],oval:[bx+4,by+11],
    touch:[bx+15,by-6],touch_idx:[bx+15,by-6],between:[bx+21,by+17],between_if:[bx+21,by+17],
    under2:[bx+21,by+17],under3:[bx+21,by+17],under:[bx+24,by+23],point:[bx-11,by+15],point2:[bx-11,by+15]};
  const[tx,ty]=m[tp]||[bx-15,by+26];
  let px=bx,py=by+12;
  const joints=[[px,py]];
  for(let ph=0;ph<2;ph++){
    const ex=px+(tx-bx)*(ph+1)/2*.84,ey=py+(ty-by+12)*(ph+1)/2*.84;
    const mx=(px+ex)/2,my=(py+ey)/2,pl=Math.sqrt((ex-px)**2+(ey-py)**2)||1;
    const rot=Math.atan2(ey-py,ex-px)*180/Math.PI+90;
    el('rect',{x:mx-(fw+2)/2,y:my-pl/2,width:fw+3,height:pl+3,rx:(fw+3)/2,fill:ph===0?SK:SKL,stroke:SKS,'stroke-width':'0.9',transform:`rotate(${rot},${mx},${my})`},g);
    if(ph===0){
      el('ellipse',{cx:ex,cy:ey,rx:fw/2+3.5,ry:fw/2+2,fill:SK,stroke:SKJT,'stroke-width':'0.7'},g);
      joints.push([ex,ey]);
    }
    px=ex;py=ey;
  }
  el('ellipse',{cx:px,cy:py,rx:fw/2+3.5,ry:fw/2+4,fill:SKD,stroke:SKJT,'stroke-width':'0.8'},g);
  el('ellipse',{cx:px,cy:py-3,rx:fw/2+.5,ry:fw/2+2,fill:SKNL,stroke:'rgba(200,150,140,0.4)','stroke-width':'0.6'},g);
  joints.push([px,py]);

  if(joints[1]) drawJointDot(g, joints[1][0], joints[1][1], 5.5, 'thumb');
  drawJointDot(g, joints[joints.length-1][0], joints[joints.length-1][1], 4, 'tip');
}

function drawMotion(svg,motion,cx,cy,prog){
  const t=motion.t,mx=cx,my=cy-88;let d='';
  if(['arc','forward','side'].includes(t)){const dx=motion.dx||0,dy=motion.dy||0;d=`M${mx},${my} Q${mx+dx*.5},${my+dy*.5-16} ${mx+dx},${my+dy}`}
  else if(t==='circle'){const r=motion.r||20;d=`M${mx-r},${my} a${r},${r} 0 1,1 ${r*2},0 a${r},${r} 0 1,1 ${-r*2},0`}
  else if(['up','down','flip','chop'].includes(t)){const dy=motion.dy||22;d=`M${mx},${my} L${mx},${my+dy}`}
  else if(['wave','shake','wiggle'].includes(t)){const dx=motion.dx||14;d=`M${mx-dx},${my} Q${mx},${my-9} ${mx+dx},${my}`}
  else if(['tap','nod','snap','rock','squeeze'].includes(t)){const dy=motion.dy||9;d=`M${mx},${my} L${mx},${my+dy}`}
  else if(t==='swap'){d=`M${mx-16},${my} C${mx-16},${my-20} ${mx+16},${my-20} ${mx+16},${my}`}
  else if(t==='in'){d=`M${mx-32},${my} L${mx},${my}`}
  else if(t==='z'){d=`M${mx-13},${my} L${mx+13},${my} L${mx-13},${my+18} L${mx+13},${my+18}`}
  else{d=`M${mx},${my} L${mx+22},${my}`}
  if(!d)return;
  el('path',{d,fill:'none',stroke:'#4ECDC4','stroke-width':'2.5','stroke-dasharray':'7 5',opacity:'0.7','stroke-linecap':'round'},svg);
  const dot=el('circle',{r:'5',fill:'#FF6B6B',opacity:'0.85'},svg);
  try{
    const tp=document.createElementNS(NS,'path');tp.setAttribute('d',d);
    document.body.appendChild(tp);
    const len=tp.getTotalLength();
    const pt=tp.getPointAtLength(len*(prog||1));
    dot.setAttribute('cx',pt.x);dot.setAttribute('cy',pt.y);
    document.body.removeChild(tp);
  }catch(e){dot.setAttribute('cx',mx);dot.setAttribute('cy',my)}
  el('circle',{cx:dot.getAttribute('cx'),cy:dot.getAttribute('cy'),r:'9',fill:'none',stroke:'#FF6B6B','stroke-width':'1.5',opacity:'0.25'},svg);
}

function renderSign(svg,sign,prog,prev){
  svg.innerHTML='';
  prog=prog||1;
  if(mirrorOn){
    const mg=document.createElementNS('http://www.w3.org/2000/svg','g');
    mg.setAttribute('transform','scale(-1,1) translate(-480,0)');
    svg.appendChild(mg);
    if(sign.hands==='both'){drawHand(mg,sign,165,260,-1,prog,prev);drawHand(mg,sign,315,260,1,prog,prev);}
    else{drawHand(mg,sign,240,260,1,prog,prev);if(showMot&&sign.motion)drawMotion(mg,sign.motion,240,260,prog);}
  } else if(sign.hands==='both'){
    drawHand(svg,sign,165,260,-1,prog,prev);
    drawHand(svg,sign,315,260,1,prog,prev);
  } else {
    drawHand(svg,sign,240,260,1,prog,prev);
    if(showMot&&sign.motion) drawMotion(svg,sign.motion,240,260,prog);
  }
}

// ── ANIMATION ENGINE ───────────────────────────────────
// The sign queue now resolves against the ISL lexicon (isl-dictionary.js).
// Tokens keep their display key plus the dictionary entry that carries
// the handshape, the body location and the movement path.
let queue=[];

/**
 * Resolve typed text into sign tokens.
 * Longest-phrase-first so "good morning" matches the GOOD MORNING entry
 * instead of two unrelated words.
 */
function tokenize(txt){
  const toks=[];
  const words=String(txt||'').trim().split(/\s+/).filter(Boolean);
  let i=0;
  while(i<words.length){
    let matched=false;
    for(let span=Math.min(3,words.length-i);span>=1;span--){
      const phrase=words.slice(i,i+span).join(' ');
      const entry=ISLDictionary.resolve(phrase);
      if(entry){
        toks.push({key:entry.en,entry:entry});
        i+=span;matched=true;break;
      }
    }
    if(matched) continue;
    const w=words[i];
    const key=w.toUpperCase();
    const entry=ISLDictionary.get(key)||ISLDictionary.get('FS_'+key);
    if(entry){
      toks.push({key:entry.en,entry:entry});
    } else if(key.length<=4){
      // short unknown word — fingerspell it letter by letter
      let spelled=true;
      for(const ch of key){
        const fs=ISLDictionary.get('FS_'+ch);
        if(!fs){spelled=false;break;}
        toks.push({key:ch,entry:fs,spell:true});
      }
      if(!spelled){
        while(toks.length&&toks[toks.length-1].spell)toks.pop();
        toks.push({key:w,entry:null,missing:true});
      }
    } else {
      toks.push({key:w,entry:null,missing:true});
    }
    i++;
  }
  return toks;
}

/* ── translate stage viewer ─────────────────────────────────── */
let trViewer=null;

function trState(state){
  const fill=document.getElementById('pfill');
  if(fill) fill.style.width=Math.round((state.progress||0)*100)+'%';
  const mode=document.getElementById('tr-mode');
  if(mode){
    const using3d=state.mode==='3d'&&state.preferred!=='2d';
    mode.textContent=using3d?'3D':'2D';
    mode.title=using3d?'Three.js 3D avatar — click to switch':'2D illustration — click to switch to the 3D avatar';
  }
  const pb=document.getElementById('pause-btn');
  if(pb&&pb.style.display!=='none') pb.textContent=state.playing?'⏸ Pause':'▶ Resume';
  const note=document.getElementById('tr-note');
  if(note&&state.entry){
    const st=ISLDictionary.statusOf(state.entry);
    note.textContent=st.key==='unverified'
      ? 'Approximation — not validated against the ISLRTC video'
      : st.label;
  }
}

function getTrViewer(){
  if(trViewer) return trViewer;
  trViewer=new SignViewer.Viewer({
    svg:document.getElementById('hc'),
    host:document.getElementById('tr-3d'),
    stage:document.getElementById('sstage'),
    onState:trState,
    onEnd:function(){
      document.getElementById('cbadge').textContent='Done! 🎉';
      document.getElementById('sstage').classList.remove('play');
      document.getElementById('pause-btn').style.display='none';
      document.getElementById('skip-btn').style.display='none';
      const cta=document.querySelector('.ctabtn');
      if(cta){cta.classList.remove('busy');}
      setP(1);
    },
    onWordChange:function(entry){
      const badge=document.getElementById('cbadge');
      if(badge&&entry) badge.textContent=entry.en.replace(/_/g,' ');
      const idlw=document.getElementById('idlw');
      if(idlw) idlw.style.display='none';
    }
  });
  return trViewer;
}

function startSign(){
  const txt=document.getElementById('txt').value.trim();
  if(!txt) return;
  paused=false;
  queue=tokenize(txt); if(!queue.length) return;
  const signable=queue.filter(function(t){return t.entry;});
  if(!signable.length){
    if(trViewer) trViewer.pause();
    document.getElementById('cbadge').textContent='Not in the offline lexicon';
    document.getElementById('tr-note').textContent='Open the official ISLRTC dictionary for this word (see the Dictionary tab)';
    document.getElementById('idlw').style.display='';
    document.getElementById('sstage').classList.remove('play');
    document.getElementById('pause-btn').style.display='none';
    document.getElementById('skip-btn').style.display='none';
    const cta=document.querySelector('.ctabtn');
    if(cta){cta.classList.remove('busy');}
    setP(0);
    renderQ();
    return;
  }
  if(queue.length>20&&speed<3){setSpd(3,document.querySelectorAll('.sb')[1]);}
  if(queue.length>40&&speed<5){setSpd(5,document.querySelectorAll('.sb')[2]);}
  const cta=document.querySelector('.ctabtn');
  if(cta){cta.classList.add('busy');}
  document.getElementById('idlw').style.display='none';
  document.getElementById('sstage').classList.add('play');
  document.getElementById('pause-btn').style.display='block';
  document.getElementById('pause-btn').textContent='⏸ Pause';
  document.getElementById('skip-btn').style.display='block';
  renderQ(); setP(0);
  const viewer=getTrViewer();
  viewer.setSpeed(speed);
  viewer.playSequence(signable.map(function(t){return t.entry;}),0);
  if(viewer.threeStatus==='idle') viewer.enable3D();
}

function renderQ(){
  const w=document.getElementById('qrow');
  if(!w) return;
  const signable=queue.filter(function(t){return t.entry;});
  const currentIdx=signable.length?signable.findIndex(function(t){return t.entry===(trViewer&&trViewer.current);}):-1;
  if(w.children.length!==queue.length){
    w.innerHTML='';
    const frag=document.createDocumentFragment();
    queue.forEach(function(t,i){
      const c=document.createElement('div');
      c.className='qchip';
      c.textContent=t.key.replace(/_/g,' ');
      if(t.missing){c.classList.add('missing');c.title='Not in the offline ISL lexicon — check the official ISLRTC dictionary';}
      frag.appendChild(c);
    });
    w.appendChild(frag);
  }
  Array.prototype.forEach.call(w.children,function(c,i){
    const tok=queue[i];
    const signIdx=queue.slice(0,i).filter(function(t){return t.entry;}).length;
    c.classList.toggle('act',!!tok.entry&&signIdx===currentIdx);
    c.classList.toggle('dn',!!tok.entry&&currentIdx>=0&&signIdx<currentIdx);
  });
  const prt=document.getElementById('prt');
  if(prt) prt.textContent=signable.length?(Math.max(0,currentIdx)+1)+'/'+signable.length:'';
}


function setP(p){document.getElementById('pfill').style.width=(p*100)+'%'}

function startVoice(){
  const btn=document.getElementById('vbtn');
  if(!('webkitSpeechRecognition' in window||'SpeechRecognition' in window)){
    showToast('Voice input requires Chrome or Edge 🎤','warn');return;
  }
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  const r=new SR();r.lang='en-US';r.interimResults=false;
  btn.classList.add('on');btn.textContent='🔴';
  r.onresult=e=>{document.getElementById('txt').value=e.results[0][0].transcript;upCnt()};
  r.onend=()=>{btn.classList.remove('on');btn.textContent='🎤'};
  r.start();
}

// ── QUIZ ───────────────────────────────────────────────
let qMode='s2w',qC=0,qT=0,qStr=0,qSc=0,qKey='',qLk=false,qCT=null;
const QP=ISLDictionary.words().map(function(e){return e.id;});

function setQM(m,btn){qMode=m;document.querySelectorAll('.qmb').forEach(b=>b.classList.remove('act'));btn.classList.add('act');nextQ()}

function nextQ(){
  if(qCT){clearInterval(qCT);qCT=null;}
  qLk=false;
  document.getElementById('nxtb').style.display='none';
  document.getElementById('hb').style.display='none';
  document.getElementById('qcd').textContent='';
  const starEl=document.getElementById('star-display');
  if(starEl)starEl.style.display='none';
  if(!QP.length) return;
  // Pick a different question from last one
  let newKey=qKey;
  let attempts=0;
  while(newKey===qKey&&attempts<10){newKey=QP[Math.floor(Math.random()*QP.length)];attempts++;}
  qKey=newKey;
  const entry=ISLDictionary.get(qKey);
  if(!entry) return;
  const sign=ISLDictionary.legacyShape(entry);
  // Build options — cap loop to avoid infinite hang if QP is small
  const opts=new Set([qKey]);
  let tries=0;
  while(opts.size<Math.min(4,QP.length)&&tries<50){opts.add(QP[Math.floor(Math.random()*QP.length)]);tries++;}
  const sh=[...opts].sort(()=>Math.random()-.5);
  const svg=document.getElementById('qhc');
  if(!svg) return;
  svg.innerHTML='';
  if(qMode==='s2w'){
    renderSign(svg,sign,1,null);
    document.getElementById('qpro').textContent='👀 What word is this sign?';
    renderOpts(sh);
  }else if(qMode==='w2s'){
    document.getElementById('qpro').textContent='📝 Which sign means: '+qKey.replace(/_/g,' ')+'?';
    document.getElementById('qcd').textContent='3';let cd=3;
    qCT=setInterval(()=>{
      cd--;
      document.getElementById('qcd').textContent=cd>0?cd:'';
      if(cd<=0){clearInterval(qCT);qCT=null;renderSign(svg,sign,1,null);}
    },1000);
    renderOpts(sh);
  }else{
    renderSign(svg,sign,1,null);
    document.getElementById('qpro').textContent='✏️ Type what this sign means:';
    const c=document.getElementById('qopts');c.style.display='block';c.innerHTML='';
    const rw=document.createElement('div');rw.className='sprow';
    rw.innerHTML=`<input class="spin" id="spin" placeholder="Type here…" autocomplete="off"><button class="spck" onclick="chkSpell()">✓ Check</button>`;
    c.appendChild(rw);
    // Attach Enter key immediately — no setTimeout needed
    const si=rw.querySelector('#spin');
    if(si)si.onkeydown=e=>{if(e.key==='Enter')chkSpell();};
  }
}

function renderOpts(keys){
  const c=document.getElementById('qopts');c.style.display='grid';c.innerHTML='';
  keys.forEach(k=>{const b=document.createElement('button');b.className='obtn';b.textContent=k.replace(/_/g,' ');b.onclick=()=>chkAns(k,b);c.appendChild(b)});
}
function chkAns(chosen,btn){
  if(qLk)return;qLk=true;qT++;
  if(qCT){clearInterval(qCT);qCT=null;}  // stop countdown if still running
  const ok=chosen===qKey;
  if(ok){qC++;qStr++;qSc+=10+qStr*2;}else{qStr=0;}
  document.querySelectorAll('.obtn').forEach(b=>{
    b.classList.add('lk');
    if(b.textContent===qKey.replace(/_/g,' ')){b.classList.add('ok');}
    else if(b===btn&&!ok){b.classList.add('ng');}
  });
  shHint(ok);updQ();document.getElementById('nxtb').style.display='block';
  roundTotal++;
  if(ok){roundCorrect++;playCorrect();launchConfetti();mascotReact('correct');addXP(10+qStr*2);}
  else{playWrong();mascotReact('wrong');loseLife();}
  checkBadges();
  if(roundTotal>0&&roundTotal%5===0)showStarRating();
}
function chkSpell(){
  const inp=document.getElementById('spin');if(!inp)return;
  const val=inp.value.trim().toUpperCase().replace(/\s+/g,'_');if(!val)return;
  const ok=val===qKey||val.replace(/_/g,' ')===qKey.replace(/_/g,' ');
  if(!qLk){
    qLk=true;qT++;
    if(ok){qC++;qStr++;qSc+=10+qStr*2;}else{qStr=0;}
    inp.style.borderColor=ok?'var(--grn)':'var(--coral)';inp.disabled=true;
    shHint(ok);updQ();document.getElementById('nxtb').style.display='block';
    roundTotal++;
    if(ok){roundCorrect++;playCorrect();launchConfetti();mascotReact('correct');addXP(12);}
    else{playWrong();mascotReact('wrong');loseLife();}
    checkBadges();
  }
}
function shHint(ok){
  const h=document.getElementById('hb');h.style.display='';h.className='hb '+(ok?'ok':'ng');
  h.textContent=ok?'✅ Correct! +'+(10+(ok?qStr:0)*2):'❌ '+qKey.replace(/_/g,' ');
}
function updQ(){
  document.getElementById('qc').textContent=qC;
  document.getElementById('qt').textContent=qT;
  document.getElementById('qp').textContent=qT>0?Math.round(qC/qT*100)+'%':'—';
  document.getElementById('strn').textContent=qStr;
  document.getElementById('qsc').textContent='Score: '+qSc;
}

// ── LEARN ──────────────────────────────────────────────
// The learn engine now works on the ISL lexicon (isl-dictionary.js).
// Categories are derived from the dictionary so the sidebar, the
// flashcards and the category game always stay in sync with the data.
const ISL_CAT_EMOJI={};
ISL_CATS.forEach(function(c){ISL_CAT_EMOJI[c.id]=c.emoji;});

function islCategoryGroups(){
  return ISLDictionary.categoryGroups();
}

const LK=ISLDictionary.words().map(function(e){return e.id;});
let lIdx=0,selKey='HELLO';

// ── LEARN VIEWER (3D + 2D fallback) ────────────────────
let learnViewer=null;
function getLearnViewer(){
  if(learnViewer) return learnViewer;
  const svg=document.getElementById('lhc');
  learnViewer=new SignViewer.Viewer({
    svg:svg,
    host:document.getElementById('ln-3d'),
    stage:svg?svg.parentNode:null,
    onState:function(state){
      const bar=document.getElementById('ln-fill');
      if(bar) bar.style.width=Math.round((state.progress||0)*100)+'%';
      const mode=document.getElementById('ln-mode');
      if(mode) mode.textContent=state.mode==='3d'?'3D':'2D';
    }
  });
  return learnViewer;
}
if(typeof window!=='undefined'){
  window.getLearnViewer=getLearnViewer;
  Object.defineProperty(window,'learnViewer',{get:function(){return learnViewer;}});
}

function lPlay(){
  const entry=ISLDictionary.get(selKey);if(!entry)return;
  const v=getLearnViewer();
  v.setSequence([entry],0);
  v.show(entry,{autoPlay:true});
  if(v.threeStatus==='idle') v.enable3D();
}
function lPrev(){selLearn(LK[Math.max(0,lIdx-1)])}
function lNext(){selLearn(LK[Math.min(LK.length-1,lIdx+1)])}

// ── TABS ───────────────────────────────────────────────
function swTab(id,btn){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('act'));
  document.querySelectorAll('.nb:not(#dm-btn)').forEach(b=>b.classList.remove('act'));
  document.getElementById('panel-'+id).classList.add('act');
  btn.classList.add('act');
  // Quiz: only load first question if none yet asked
  if(id==='quiz'&&qT===0&&!qKey)nextQ();
  // Learn: only rebuild sidebar if not already built
  if(id==='learn'){
    const sb=document.getElementById('lsb');
    if(!sb.children.length){buildLSB();}
    selLearn(selKey);
    // the 3D avatar is loaded the first time the learner opens this tab
    const lv=getLearnViewer();
    if(lv.threeStatus==='idle') lv.enable3D();
  }
  // Dictionary: the search index is built once, results are re-filtered
  if(id==='dictionary'){
    if(typeof DictionaryUI!=='undefined'&&DictionaryUI) DictionaryUI.refresh();
  }
  // The 3D avatar keeps rendering only while its panel is visible
  if(id!=='translate'&&trViewer) trViewer.pause();
  if(id!=='learn'&&typeof learnViewer!=='undefined'&&learnViewer) learnViewer.pause();
  if(id!=='recognize'&&recRunning) stopRecognizer();
}

// ── STAGE CONTROLS (translate) ─────────────────────────
(function wireStageControls(){
  function bind(){
    const play=document.getElementById('tr-play');
    const replay=document.getElementById('tr-replay');
    const loop=document.getElementById('tr-loop');
    if(play) play.addEventListener('click',function(){
      const v=getTrViewer();
      v.toggle();
      play.textContent=v.playing?'⏸':'▶';
      play.setAttribute('aria-label',v.playing?'Pause the demonstration':'Play the demonstration');
    });
    if(replay) replay.addEventListener('click',function(){ getTrViewer().replay(); });
    if(loop) loop.addEventListener('click',function(){
      const v=getTrViewer();
      v.setLoop(!v.loop);
      loop.setAttribute('aria-pressed',v.loop?'true':'false');
      loop.classList.toggle('on',v.loop);
    });
    const modeBtn=document.getElementById('tr-mode');
    if(modeBtn) modeBtn.addEventListener('click',function(){
      const v=getTrViewer();
      const next=v.preferred==='2d'?'3d':'2d';
      v.setRenderer(next);
      modeBtn.textContent=next==='2d'?'2D':'3D';
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind);
  else bind();
})();

// ── BOOT ───────────────────────────────────────────────
// Pre-load the first quiz question once every script is evaluated.
(function boot(){
  if(typeof nextQ==='function'&&qT===0&&!qKey) nextQ();
})();

// ── DARK MODE ──────────────────────────────────────────
function toggleDark(){
  const isDark=document.body.classList.toggle('dark');
  document.getElementById('dm-btn').textContent=isDark?'☀️':'🌙';
  localStorage.setItem('sv-dark',isDark?'1':'0');
}

