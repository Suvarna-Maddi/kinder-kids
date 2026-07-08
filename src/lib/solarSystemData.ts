export type PlanetData = {
  id: string;
  name: string;
  order: number;
  subtitle: string;
  type: string;
  moons: string;
  dayLength: string;
  yearLength: string;
  avgTemp: string;
  description: string;
  funFact: string;
  color: string;
  gradient: string;
  quiz: {
    question: string;
    options: string[];
    correct: string;
  };
};

export const SOLAR_SYSTEM: PlanetData[] = [
  {
    id: "sun",
    name: "Sun",
    order: 0,
    subtitle: "The center of our solar system",
    type: "Yellow Dwarf Star",
    moons: "0",
    dayLength: "27 Earth days",
    yearLength: "N/A",
    avgTemp: "5,500°C / 9,932°F",
    description: "The Sun is a huge ball of hot, glowing gas at the center of our solar system. Its gravity holds everything together, from the biggest planets to the smallest asteroids.",
    funFact: "You could fit over one million Earths inside the Sun!",
    color: "text-kid-yellow",
    gradient: "from-kid-orange to-kid-yellow",
    quiz: {
      question: "What is the Sun?",
      options: ["A Planet", "A Star", "A Moon"],
      correct: "A Star",
    },
  },
  {
    id: "mercury",
    name: "Mercury",
    order: 1,
    subtitle: "1st planet from the Sun",
    type: "Rocky Planet",
    moons: "0",
    dayLength: "59 Earth days",
    yearLength: "88 Earth days",
    avgTemp: "167°C / 333°F",
    description: "Mercury is the smallest planet and the closest one to the Sun. It has a rocky surface covered in craters, just like our Moon.",
    funFact: "Even though it's closest to the Sun, it's not the hottest planet!",
    color: "text-gray-400",
    gradient: "from-gray-400 to-gray-600",
    quiz: {
      question: "Which planet is closest to the Sun?",
      options: ["Earth", "Mars", "Mercury"],
      correct: "Mercury",
    },
  },
  {
    id: "venus",
    name: "Venus",
    order: 2,
    subtitle: "2nd planet from the Sun",
    type: "Rocky Planet",
    moons: "0",
    dayLength: "243 Earth days",
    yearLength: "225 Earth days",
    avgTemp: "464°C / 867°F",
    description: "Venus is Earth's closest planetary neighbor. It is covered in thick, toxic clouds that trap heat, making it the hottest planet in the solar system.",
    funFact: "Venus spins backward compared to most other planets!",
    color: "text-orange-400",
    gradient: "from-orange-300 to-orange-500",
    quiz: {
      question: "Which planet is the hottest in our solar system?",
      options: ["Mercury", "Venus", "Mars"],
      correct: "Venus",
    },
  },
  {
    id: "earth",
    name: "Earth",
    order: 3,
    subtitle: "3rd planet from the Sun",
    type: "Rocky Planet",
    moons: "1",
    dayLength: "24 Hours",
    yearLength: "365 Days",
    avgTemp: "15°C / 59°F",
    description: "Earth is our home planet! It is the only planet we know of that has life. About 71% of Earth is covered with water.",
    funFact: "Earth is sometimes called the Blue Planet.",
    color: "text-kid-blue",
    gradient: "from-kid-blue to-kid-green",
    quiz: {
      question: "Which planet do we live on?",
      options: ["Mars", "Earth", "Jupiter"],
      correct: "Earth",
    },
  },
  {
    id: "mars",
    name: "Mars",
    order: 4,
    subtitle: "4th planet from the Sun",
    type: "Rocky Planet",
    moons: "2",
    dayLength: "24.6 Hours",
    yearLength: "687 Earth days",
    avgTemp: "-65°C / -85°F",
    description: "Mars is a cold desert world. It is called the Red Planet because of rusty iron in the ground. It has seasons, polar ice caps, and weather.",
    funFact: "Mars has the largest volcano in the solar system, Olympus Mons!",
    color: "text-kid-red",
    gradient: "from-kid-red to-orange-600",
    quiz: {
      question: "What is Mars often called?",
      options: ["The Blue Planet", "The Red Planet", "The Hot Planet"],
      correct: "The Red Planet",
    },
  },
  {
    id: "jupiter",
    name: "Jupiter",
    order: 5,
    subtitle: "5th planet from the Sun",
    type: "Gas Giant",
    moons: "95",
    dayLength: "10 Hours",
    yearLength: "12 Earth years",
    avgTemp: "-110°C / -166°F",
    description: "Jupiter is the biggest planet in our solar system! It is a gas giant covered in swirling cloud stripes and massive storms.",
    funFact: "Jupiter's Great Red Spot is a giant storm bigger than Earth!",
    color: "text-orange-300",
    gradient: "from-yellow-600 to-orange-400",
    quiz: {
      question: "Which is the largest planet?",
      options: ["Jupiter", "Saturn", "Earth"],
      correct: "Jupiter",
    },
  },
  {
    id: "saturn",
    name: "Saturn",
    order: 6,
    subtitle: "6th planet from the Sun",
    type: "Gas Giant",
    moons: "146",
    dayLength: "10.7 Hours",
    yearLength: "29 Earth years",
    avgTemp: "-140°C / -220°F",
    description: "Saturn is a gas giant famous for its beautiful, bright rings made of ice and rock. It is the second-largest planet.",
    funFact: "Saturn's rings are as wide as 21 Earths side by side!",
    color: "text-yellow-200",
    gradient: "from-yellow-200 to-yellow-500",
    quiz: {
      question: "Which planet is famous for its bright rings?",
      options: ["Venus", "Jupiter", "Saturn"],
      correct: "Saturn",
    },
  },
  {
    id: "uranus",
    name: "Uranus",
    order: 7,
    subtitle: "7th planet from the Sun",
    type: "Ice Giant",
    moons: "28",
    dayLength: "17 Hours",
    yearLength: "84 Earth years",
    avgTemp: "-195°C / -320°F",
    description: "Uranus is an ice giant. It is very cold and windy, and it has a pale blue color because of the methane gas in its atmosphere.",
    funFact: "Uranus spins on its side like a rolling barrel!",
    color: "text-cyan-300",
    gradient: "from-cyan-300 to-blue-400",
    quiz: {
      question: "Which planet spins on its side?",
      options: ["Mars", "Uranus", "Neptune"],
      correct: "Uranus",
    },
  },
  {
    id: "neptune",
    name: "Neptune",
    order: 8,
    subtitle: "8th planet from the Sun",
    type: "Ice Giant",
    moons: "16",
    dayLength: "16 Hours",
    yearLength: "165 Earth years",
    avgTemp: "-200°C / -330°F",
    description: "Neptune is the farthest planet from the Sun. It is dark, cold, and very windy. It's an ice giant with a bright blue color.",
    funFact: "Winds on Neptune can blow up to 1,200 miles per hour!",
    color: "text-blue-600",
    gradient: "from-blue-500 to-indigo-800",
    quiz: {
      question: "Which planet is farthest from the Sun?",
      options: ["Saturn", "Uranus", "Neptune"],
      correct: "Neptune",
    },
  }
];

export const UNLOCKABLES = [
  { id: "moon", name: "Moon", emoji: "🌙" },
  { id: "asteroids", name: "Asteroids", emoji: "☄" },
  { id: "comets", name: "Comets", emoji: "🌠" },
  { id: "satellites", name: "Satellites", emoji: "🛰" },
  { id: "milkyway", name: "Milky Way Galaxy", emoji: "🌌" },
  { id: "blackhole", name: "Black Holes", emoji: "🕳" },
  { id: "stars", name: "Stars", emoji: "⭐" },
];
