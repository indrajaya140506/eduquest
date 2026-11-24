
export const GAME_ACTIVITY_ID = 3;

export const PLANETS = [
  { name: "Mercury", label: "Merkurius", emoji: "☿️", color: "#9CA3AF" },
  { name: "Venus", label: "Venus", emoji: "♀️", color: "#F59E0B" },
  { name: "Earth", label: "Bumi", emoji: "🌎", color: "#3B82F6" },
  { name: "Mars", label: "Mars", emoji: "🔴", color: "#EF4444" },
  { name: "Jupiter", label: "Jupiter", emoji: "🪐", color: "#D97706" },
  { name: "Saturn", label: "Saturnus", emoji: "🪐", color: "#EAB308" },
  { name: "Uranus", label: "Uranus", emoji: "🔵", color: "#06B6D4" },
  { name: "Neptune", label: "Neptunus", emoji: "🔵", color: "#6366F1" },
];

export const PLANET_QUESTIONS = [
  {
    question: "Planet apakah yang paling dekat dengan Matahari?",
    options: ["Venus", "Merkurius", "Mars", "Bumi"],
    answer: 1,
    explanation: "Merkurius merupakan planet terdekat dengan Matahari.",
  },
  {
    question: "Planet terbesar dalam tata surya adalah?",
    options: ["Saturnus", "Neptunus", "Jupiter", "Uranus"],
    answer: 2,
    explanation: "Jupiter adalah planet terbesar dalam tata surya.",
  },
  {
    question: "Planet yang dikenal sebagai Planet Merah adalah?",
    options: ["Venus", "Mars", "Merkurius", "Saturnus"],
    answer: 1,
    explanation: "Mars dikenal sebagai Planet Merah karena permukaannya.",
  },
  {
    question: "Planet yang memiliki cincin paling terkenal adalah?",
    options: ["Bumi", "Mars", "Saturnus", "Merkurius"],
    answer: 2,
    explanation: "Saturnus terkenal dengan sistem cincinnya.",
  },
  {
    question: "Planet tempat manusia tinggal adalah?",
    options: ["Mars", "Venus", "Jupiter", "Bumi"],
    answer: 3,
    explanation: "Bumi adalah planet tempat manusia tinggal.",
  },
  {
    question: "Planet terpanas di tata surya adalah?",
    options: ["Merkurius", "Venus", "Mars", "Jupiter"],
    answer: 1,
    explanation: "Venus memiliki suhu permukaan rata-rata tertinggi.",
  },
  {
    question: "Planet yang berotasi dengan posisi sangat miring adalah?",
    options: ["Uranus", "Mars", "Bumi", "Jupiter"],
    answer: 0,
    explanation: "Uranus memiliki kemiringan sumbu rotasi sekitar 98 derajat.",
  },
  {
    question: "Planet terjauh dari Matahari adalah?",
    options: ["Saturnus", "Uranus", "Neptunus", "Jupiter"],
    answer: 2,
    explanation: "Neptunus adalah planet terjauh dalam tata surya.",
  },
];

export const GAME_CONFIG = {
  maxHealth: 3,
  energyPerCorrect: 25,
  crystalPerCorrect: 1,
  comboBonusAt: 3,
};

export function calculateGameXP(correctAnswers: number) {
  return Math.min(correctAnswers * 20, 160);
}

export function calculateGameStars(correctAnswers: number) {
  if (correctAnswers >= 7) return 3;
  if (correctAnswers >= 4) return 2;
  if (correctAnswers >= 1) return 1;
  return 0;
}
