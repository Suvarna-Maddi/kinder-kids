// Approximate stroke data for capital letters A-Z, viewBox 100x120.
// Each glyph is an ordered list of strokes; every stroke has an SVG path,
// a start point (for the numbered badge), and a short spoken guidance line.
// Not fine calligraphy — these are the geometry of how a child would write
// each letter on a board.

export type Stroke = {
  d: string; // SVG path
  start: [number, number];
  guidance: string;
};

export type Glyph = {
  viewBox: string;
  strokes: Stroke[];
};

export const LETTER_GLYPHS: Record<string, Glyph> = {
  A: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 20 110 L 50 15", start: [20, 110], guidance: "Start at the bottom. Draw up." },
      { d: "M 50 15 L 80 110", start: [50, 15], guidance: "Now go back down to the other side." },
      { d: "M 32 75 L 68 75", start: [32, 75], guidance: "Now draw across the middle." },
    ],
  },
  B: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 25 15 L 25 110", start: [25, 15], guidance: "Draw a line down." },
      {
        d: "M 25 15 Q 80 20 60 60 Q 90 70 60 110 L 25 110",
        start: [25, 15],
        guidance: "Now two bumps on the right.",
      },
    ],
  },
  C: {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 85 30 Q 20 0 15 65 Q 20 130 85 100",
        start: [85, 30],
        guidance: "Curve around like a moon.",
      },
    ],
  },
  D: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 25 15 L 25 110", start: [25, 15], guidance: "Straight line down." },
      {
        d: "M 25 15 Q 90 15 90 62 Q 90 110 25 110",
        start: [25, 15],
        guidance: "Now one big curve.",
      },
    ],
  },
  E: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 25 15 L 25 110", start: [25, 15], guidance: "Draw down." },
      { d: "M 25 15 L 80 15", start: [25, 15], guidance: "Top line." },
      { d: "M 25 62 L 70 62", start: [25, 62], guidance: "Middle line." },
      { d: "M 25 110 L 80 110", start: [25, 110], guidance: "Bottom line." },
    ],
  },
  F: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 25 15 L 25 110", start: [25, 15], guidance: "Draw down." },
      { d: "M 25 15 L 80 15", start: [25, 15], guidance: "Top line." },
      { d: "M 25 62 L 70 62", start: [25, 62], guidance: "Middle line." },
    ],
  },
  G: {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 85 30 Q 20 0 15 65 Q 20 130 85 100 L 85 65 L 55 65",
        start: [85, 30],
        guidance: "Big curve, then a little hook.",
      },
    ],
  },
  H: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 25 15 L 25 110", start: [25, 15], guidance: "Left line down." },
      { d: "M 75 15 L 75 110", start: [75, 15], guidance: "Right line down." },
      { d: "M 25 62 L 75 62", start: [25, 62], guidance: "Line across the middle." },
    ],
  },
  I: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 30 15 L 70 15", start: [30, 15], guidance: "Top line." },
      { d: "M 50 15 L 50 110", start: [50, 15], guidance: "Straight down." },
      { d: "M 30 110 L 70 110", start: [30, 110], guidance: "Bottom line." },
    ],
  },
  J: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 30 15 L 80 15", start: [30, 15], guidance: "Top line." },
      {
        d: "M 65 15 L 65 90 Q 65 115 35 108 Q 20 105 20 90",
        start: [65, 15],
        guidance: "Down and curl at the bottom.",
      },
    ],
  },
  K: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 25 15 L 25 110", start: [25, 15], guidance: "Line down." },
      { d: "M 80 15 L 25 62", start: [80, 15], guidance: "Slant down to the middle." },
      { d: "M 25 62 L 80 110", start: [25, 62], guidance: "Slant down to the bottom." },
    ],
  },
  L: {
    viewBox: "0 0 100 120",
    strokes: [{ d: "M 25 15 L 25 110 L 80 110", start: [25, 15], guidance: "Down, then across." }],
  },
  M: {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 20 110 L 20 15 L 50 75 L 80 15 L 80 110",
        start: [20, 110],
        guidance: "Up, down to the middle, up, then down.",
      },
    ],
  },
  N: {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 20 110 L 20 15 L 80 110 L 80 15",
        start: [20, 110],
        guidance: "Up, diagonal down, up again.",
      },
    ],
  },
  O: {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 50 15 Q 15 15 15 62 Q 15 110 50 110 Q 85 110 85 62 Q 85 15 50 15 Z",
        start: [50, 15],
        guidance: "One big circle.",
      },
    ],
  },
  P: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 25 15 L 25 110", start: [25, 15], guidance: "Line down." },
      { d: "M 25 15 Q 85 15 85 42 Q 85 70 25 70", start: [25, 15], guidance: "Curve at the top." },
    ],
  },
  Q: {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 50 15 Q 15 15 15 62 Q 15 110 50 110 Q 85 110 85 62 Q 85 15 50 15 Z",
        start: [50, 15],
        guidance: "Big circle.",
      },
      { d: "M 60 90 L 90 118", start: [60, 90], guidance: "Little tail." },
    ],
  },
  R: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 25 15 L 25 110", start: [25, 15], guidance: "Line down." },
      { d: "M 25 15 Q 85 15 85 42 Q 85 70 25 70", start: [25, 15], guidance: "Curve at the top." },
      { d: "M 45 70 L 85 110", start: [45, 70], guidance: "Now a leg." },
    ],
  },
  S: {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 85 30 Q 60 5 30 20 Q 5 40 45 60 Q 90 75 70 100 Q 40 120 15 95",
        start: [85, 30],
        guidance: "Curve like a snake.",
      },
    ],
  },
  T: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 15 15 L 85 15", start: [15, 15], guidance: "Top line." },
      { d: "M 50 15 L 50 110", start: [50, 15], guidance: "Down the middle." },
    ],
  },
  U: {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 20 15 L 20 85 Q 20 110 50 110 Q 80 110 80 85 L 80 15",
        start: [20, 15],
        guidance: "Down, curve, up.",
      },
    ],
  },
  V: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 15 15 L 50 110 L 85 15", start: [15, 15], guidance: "Down to the point, then up." },
    ],
  },
  W: {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 10 15 L 30 110 L 50 50 L 70 110 L 90 15",
        start: [10, 15],
        guidance: "Down, up, down, up.",
      },
    ],
  },
  X: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 15 15 L 85 110", start: [15, 15], guidance: "Slant down one way." },
      { d: "M 85 15 L 15 110", start: [85, 15], guidance: "Now the other way." },
    ],
  },
  Y: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 15 15 L 50 60", start: [15, 15], guidance: "Slant down to the middle." },
      { d: "M 85 15 L 50 60", start: [85, 15], guidance: "Other slant meets in the middle." },
      { d: "M 50 60 L 50 110", start: [50, 60], guidance: "Straight down." },
    ],
  },
  Z: {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 15 15 L 85 15 L 15 110 L 85 110",
        start: [15, 15],
        guidance: "Across, diagonal, then across.",
      },
    ],
  },
};

// Digits 0-9 for later phase, defined here so `StrokeWriter` works uniformly.
export const DIGIT_GLYPHS: Record<string, Glyph> = {
  "0": {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 50 15 Q 15 15 15 62 Q 15 110 50 110 Q 85 110 85 62 Q 85 15 50 15 Z",
        start: [50, 15],
        guidance: "One big oval.",
      },
    ],
  },
  "1": {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 30 30 L 55 15 L 55 110",
        start: [30, 30],
        guidance: "A little flag, then straight down.",
      },
      { d: "M 25 110 L 85 110", start: [25, 110], guidance: "Line across the bottom." },
    ],
  },
  "2": {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 15 35 Q 30 5 60 15 Q 90 25 70 55 L 15 110 L 90 110",
        start: [15, 35],
        guidance: "Curve, slant down, line across.",
      },
    ],
  },
  "3": {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 15 30 Q 40 5 70 20 Q 95 40 50 60 Q 100 75 75 105 Q 40 120 15 95",
        start: [15, 30],
        guidance: "Two curves stacked.",
      },
    ],
  },
  "4": {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 65 15 L 15 75 L 90 75", start: [65, 15], guidance: "Slant down and across." },
      { d: "M 70 15 L 70 110", start: [70, 15], guidance: "Straight down." },
    ],
  },
  "5": {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 85 15 L 25 15 L 25 55 Q 55 45 75 65 Q 95 90 65 108 Q 35 115 15 95",
        start: [85, 15],
        guidance: "Line, down, then a curve.",
      },
    ],
  },
  "6": {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 80 20 Q 40 20 25 60 Q 15 110 55 110 Q 90 110 85 80 Q 80 55 45 62 Q 25 68 25 85",
        start: [80, 20],
        guidance: "Curve down and around.",
      },
    ],
  },
  "7": {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 15 15 L 85 15 L 40 110", start: [15, 15], guidance: "Across and slant down." },
    ],
  },
  "8": {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 50 60 Q 20 60 20 35 Q 20 15 50 15 Q 80 15 80 35 Q 80 60 50 60 Q 15 60 15 85 Q 15 110 50 110 Q 85 110 85 85 Q 85 60 50 60",
        start: [50, 60],
        guidance: "Two circles, top and bottom.",
      },
    ],
  },
  "9": {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 80 55 Q 80 25 55 25 Q 25 25 25 50 Q 25 75 55 75 Q 80 75 80 55 L 80 110",
        start: [80, 55],
        guidance: "A circle on top, then down.",
      },
    ],
  },
};

// 4-6 curated words per letter with matching emoji (also used as
// primary imagery until the real PNG pack lands in Phase 4).
export type LetterWord = { word: string; emoji: string };
export const LETTER_WORDS: Record<string, LetterWord[]> = {
  A: [
    { word: "Apple", emoji: "🍎" },
    { word: "Ant", emoji: "🐜" },
    { word: "Aeroplane", emoji: "✈️" },
    { word: "Alligator", emoji: "🐊" },
  ],
  B: [
    { word: "Ball", emoji: "⚽" },
    { word: "Banana", emoji: "🍌" },
    { word: "Bear", emoji: "🐻" },
    { word: "Bee", emoji: "🐝" },
  ],
  C: [
    { word: "Cat", emoji: "🐱" },
    { word: "Car", emoji: "🚗" },
    { word: "Cake", emoji: "🎂" },
    { word: "Cow", emoji: "🐄" },
  ],
  D: [
    { word: "Dog", emoji: "🐶" },
    { word: "Drum", emoji: "🥁" },
    { word: "Duck", emoji: "🦆" },
    { word: "Deer", emoji: "🦌" },
  ],
  E: [
    { word: "Elephant", emoji: "🐘" },
    { word: "Egg", emoji: "🥚" },
    { word: "Eagle", emoji: "🦅" },
    { word: "Eye", emoji: "👁️" },
  ],
  F: [
    { word: "Fish", emoji: "🐟" },
    { word: "Flower", emoji: "🌸" },
    { word: "Fox", emoji: "🦊" },
    { word: "Frog", emoji: "🐸" },
  ],
  G: [
    { word: "Goat", emoji: "🐐" },
    { word: "Grapes", emoji: "🍇" },
    { word: "Ghost", emoji: "👻" },
    { word: "Giraffe", emoji: "🦒" },
  ],
  H: [
    { word: "Horse", emoji: "🐴" },
    { word: "Hat", emoji: "🎩" },
    { word: "House", emoji: "🏠" },
    { word: "Heart", emoji: "❤️" },
  ],
  I: [
    { word: "Ice cream", emoji: "🍦" },
    { word: "Ink", emoji: "🖋️" },
    { word: "Insect", emoji: "🐞" },
    { word: "Island", emoji: "🏝️" },
  ],
  J: [
    { word: "Jar", emoji: "🫙" },
    { word: "Jellyfish", emoji: "🎐" },
    { word: "Jet", emoji: "🛩️" },
    { word: "Juice", emoji: "🧃" },
  ],
  K: [
    { word: "Kangaroo", emoji: "🦘" },
    { word: "Key", emoji: "🔑" },
    { word: "King", emoji: "🤴" },
    { word: "Kite", emoji: "🪁" },
  ],
  L: [
    { word: "Lamp", emoji: "💡" },
    { word: "Leaf", emoji: "🍃" },
    { word: "Lemon", emoji: "🍋" },
    { word: "Lion", emoji: "🦁" },
  ],
  M: [
    { word: "Mango", emoji: "🥭" },
    { word: "Monkey", emoji: "🐵" },
    { word: "Moon", emoji: "🌙" },
    { word: "Mouse", emoji: "🐭" },
  ],
  N: [
    { word: "Nest", emoji: "🪺" },
    { word: "Nose", emoji: "👃" },
    { word: "Notebook", emoji: "📒" },
    { word: "Nut", emoji: "🥜" },
  ],
  O: [
    { word: "Octopus", emoji: "🐙" },
    { word: "Onion", emoji: "🧅" },
    { word: "Orange", emoji: "🍊" },
    { word: "Owl", emoji: "🦉" },
  ],
  P: [
    { word: "Panda", emoji: "🐼" },
    { word: "Penguin", emoji: "🐧" },
    { word: "Pig", emoji: "🐷" },
    { word: "Pizza", emoji: "🍕" },
  ],
  Q: [
    { word: "Quail", emoji: "🐦" },
    { word: "Queen", emoji: "👑" },
    { word: "Question", emoji: "❓" },
    { word: "Quill", emoji: "🪶" },
  ],
  R: [
    { word: "Rabbit", emoji: "🐰" },
    { word: "Ring", emoji: "💍" },
    { word: "Robot", emoji: "🤖" },
    { word: "Rose", emoji: "🌹" },
  ],
  S: [
    { word: "Ship", emoji: "🚢" },
    { word: "Snake", emoji: "🐍" },
    { word: "Star", emoji: "⭐" },
    { word: "Sun", emoji: "☀️" },
  ],
  T: [
    { word: "Tiger", emoji: "🐯" },
    { word: "Train", emoji: "🚂" },
    { word: "Tree", emoji: "🌳" },
    { word: "Turtle", emoji: "🐢" },
  ],
  U: [
    { word: "Umbrella", emoji: "☂️" },
    { word: "Unicorn", emoji: "🦄" },
    { word: "Unicycle", emoji: "🚲" },
    { word: "Uniform", emoji: "👔" },
  ],
  V: [
    { word: "Van", emoji: "🚐" },
    { word: "Vase", emoji: "🏺" },
    { word: "Violin", emoji: "🎻" },
    { word: "Volcano", emoji: "🌋" },
  ],
  W: [
    { word: "Watch", emoji: "⌚" },
    { word: "Water", emoji: "💧" },
    { word: "Whale", emoji: "🐋" },
    { word: "Window", emoji: "🪟" },
  ],
  X: [
    { word: "X-ray", emoji: "🩻" },
    { word: "Xbox", emoji: "🎮" },
    { word: "Xmas tree", emoji: "🎄" },
    { word: "Xylophone", emoji: "🎵" },
  ],
  Y: [
    { word: "Yak", emoji: "🐃" },
    { word: "Yarn", emoji: "🧶" },
    { word: "Yellow", emoji: "💛" },
    { word: "Yolk", emoji: "🍳" },
  ],
  Z: [
    { word: "Zebra", emoji: "🦓" },
    { word: "Zero", emoji: "0️⃣" },
    { word: "Zip", emoji: "🤐" },
    { word: "Zoo", emoji: "🏞️" },
  ],
};

// Distractor pool for "starts with" quizzes — used to pick items that DON'T
// start with the target letter.
export const ALL_WORDS: LetterWord[] = Object.values(LETTER_WORDS).flat();

// -------- Lowercase letters (a-z) --------
// Approximate stroke geometry designed for the same 100x120 viewBox as capitals.
// x-height sits roughly y=50-110; ascenders go up to y~15; descenders reach y~140.
export const LOWERCASE_GLYPHS: Record<string, Glyph> = {
  a: {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 75 65 Q 55 45 35 55 Q 15 65 25 90 Q 35 115 60 105 Q 75 100 75 85 L 75 50 L 75 110",
        start: [75, 65],
        guidance: "Round hump, then a line down.",
      },
    ],
  },
  b: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 30 15 L 30 110", start: [30, 15], guidance: "Tall line down." },
      {
        d: "M 30 80 Q 30 55 55 55 Q 80 55 80 82 Q 80 110 55 110 Q 30 110 30 90",
        start: [30, 80],
        guidance: "Bump on the right.",
      },
    ],
  },
  c: {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 80 65 Q 25 45 20 82 Q 25 118 80 100",
        start: [80, 65],
        guidance: "Curve like a little moon.",
      },
    ],
  },
  d: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 75 15 L 75 110", start: [75, 15], guidance: "Tall line down." },
      {
        d: "M 75 80 Q 75 55 50 55 Q 25 55 25 82 Q 25 110 50 110 Q 75 110 75 90",
        start: [75, 80],
        guidance: "Round bump on the left.",
      },
    ],
  },
  e: {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 25 82 L 78 82 Q 78 55 55 55 Q 25 55 25 82 Q 25 115 65 110 Q 78 108 82 100",
        start: [25, 82],
        guidance: "Little line, then curl around.",
      },
    ],
  },
  f: {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 60 25 Q 45 15 40 30 L 40 110",
        start: [60, 25],
        guidance: "Little hook up top, then down.",
      },
      { d: "M 25 55 L 65 55", start: [25, 55], guidance: "Cross line." },
    ],
  },
  g: {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 75 60 Q 55 45 35 55 Q 15 68 30 90 Q 55 108 75 90 L 75 55",
        start: [75, 60],
        guidance: "Round circle.",
      },
      {
        d: "M 75 90 L 75 128 Q 70 145 45 140 Q 25 138 20 125",
        start: [75, 90],
        guidance: "Then a tail that hangs down.",
      },
    ],
  },
  h: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 25 15 L 25 110", start: [25, 15], guidance: "Tall line down." },
      {
        d: "M 25 70 Q 45 50 65 60 Q 75 65 75 80 L 75 110",
        start: [25, 70],
        guidance: "Curve up, then straight down.",
      },
    ],
  },
  i: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 50 30 L 50 32", start: [50, 30], guidance: "Little dot on top." },
      { d: "M 50 55 L 50 110", start: [50, 55], guidance: "Straight line down." },
    ],
  },
  j: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 55 30 L 55 32", start: [55, 30], guidance: "Dot on top." },
      {
        d: "M 55 55 L 55 120 Q 50 140 30 138 Q 15 135 15 122",
        start: [55, 55],
        guidance: "Down, then curl at the bottom.",
      },
    ],
  },
  k: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 25 15 L 25 110", start: [25, 15], guidance: "Tall line down." },
      { d: "M 75 60 L 30 88", start: [75, 60], guidance: "Slant in." },
      { d: "M 40 82 L 78 110", start: [40, 82], guidance: "Slant out." },
    ],
  },
  l: {
    viewBox: "0 0 100 120",
    strokes: [{ d: "M 50 15 L 50 110", start: [50, 15], guidance: "One tall line down." }],
  },
  m: {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 15 110 L 15 55 Q 30 50 40 60 L 40 110",
        start: [15, 110],
        guidance: "Up, over, down.",
      },
      {
        d: "M 40 60 Q 55 50 70 60 Q 80 65 80 80 L 80 110",
        start: [40, 60],
        guidance: "Second hump.",
      },
    ],
  },
  n: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 25 110 L 25 55", start: [25, 110], guidance: "Line up." },
      {
        d: "M 25 65 Q 45 50 65 60 Q 75 65 75 80 L 75 110",
        start: [25, 65],
        guidance: "Hump over the top.",
      },
    ],
  },
  o: {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 50 55 Q 20 55 20 82 Q 20 110 50 110 Q 80 110 80 82 Q 80 55 50 55 Z",
        start: [50, 55],
        guidance: "One little circle.",
      },
    ],
  },
  p: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 25 55 L 25 140", start: [25, 55], guidance: "Long line down." },
      {
        d: "M 25 65 Q 45 50 65 60 Q 82 70 80 90 Q 75 110 55 108 Q 30 105 25 95",
        start: [25, 65],
        guidance: "Round bump on the right.",
      },
    ],
  },
  q: {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 75 60 Q 55 45 35 55 Q 15 68 25 90 Q 45 110 70 100 L 75 55",
        start: [75, 60],
        guidance: "Little circle.",
      },
      {
        d: "M 75 55 L 75 140 Q 80 145 90 140",
        start: [75, 55],
        guidance: "Down with a small tail.",
      },
    ],
  },
  r: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 30 110 L 30 55", start: [30, 110], guidance: "Line up." },
      { d: "M 30 65 Q 50 50 75 60", start: [30, 65], guidance: "Little curve to the right." },
    ],
  },
  s: {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 75 60 Q 55 48 35 55 Q 15 65 40 78 Q 75 88 75 100 Q 65 115 35 108 Q 22 104 20 95",
        start: [75, 60],
        guidance: "Small snake curve.",
      },
    ],
  },
  t: {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 45 30 L 45 105 Q 50 115 70 110",
        start: [45, 30],
        guidance: "Down, small curl at the bottom.",
      },
      { d: "M 25 55 L 70 55", start: [25, 55], guidance: "Cross line." },
    ],
  },
  u: {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 25 55 L 25 92 Q 25 112 50 110 Q 70 108 75 92 L 75 55",
        start: [25, 55],
        guidance: "Down, curve, up.",
      },
      { d: "M 75 55 L 75 110", start: [75, 55], guidance: "Line down." },
    ],
  },
  v: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 20 55 L 50 110 L 80 55", start: [20, 55], guidance: "Down to the point, then up." },
    ],
  },
  w: {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 10 55 L 28 110 L 50 75 L 72 110 L 90 55",
        start: [10, 55],
        guidance: "Down, up, down, up.",
      },
    ],
  },
  x: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 20 55 L 80 110", start: [20, 55], guidance: "Slant one way." },
      { d: "M 80 55 L 20 110", start: [80, 55], guidance: "Slant the other way." },
    ],
  },
  y: {
    viewBox: "0 0 100 120",
    strokes: [
      { d: "M 20 55 L 50 100", start: [20, 55], guidance: "Slant into the middle." },
      { d: "M 80 55 L 30 140", start: [80, 55], guidance: "Long slant with a tail." },
    ],
  },
  z: {
    viewBox: "0 0 100 120",
    strokes: [
      {
        d: "M 20 55 L 80 55 L 20 110 L 80 110",
        start: [20, 55],
        guidance: "Across, diagonal, across.",
      },
    ],
  },
};

// Lowercase word lists — shifts the array by 2 so lowercase letters have a different primary word.
// For example, 'A' primary is Apple, 'a' primary is Aeroplane.
export const LOWERCASE_WORDS: Record<string, LetterWord[]> = Object.fromEntries(
  Object.entries(LETTER_WORDS).map(([k, words]) => {
    // Shift by 2 to get a different primary word
    const shifted = [...words.slice(2), ...words.slice(0, 2)];
    return [k.toLowerCase(), shifted];
  }),
);
