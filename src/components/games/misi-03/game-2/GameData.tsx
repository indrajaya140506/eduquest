export const GAME_ACTIVITY_ID = 3;

export type SurvivalQuestion = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export const GAME_CONFIG = {
  questionTime: 10,
  xpPerCorrect: 20,
  maxXP: 160,
};

export const SURVIVAL_QUESTIONS: SurvivalQuestion[] = [
  {
    question: "Di manakah sebagian besar asteroid dalam tata surya berada?",
    options: [
      "Di antara Mars dan Jupiter",
      "Di antara Bumi dan Venus",
      "Di sekitar Matahari",
      "Di luar orbit Neptunus",
    ],
    answer: 0,
    explanation:
      "Sebagian besar asteroid berada di sabuk asteroid utama, yaitu wilayah antara orbit Mars dan Jupiter.",
  },
  {
    question: "Planet manakah yang dikenal sebagai Planet Merah?",
    options: ["Venus", "Mars", "Jupiter", "Merkurius"],
    answer: 1,
    explanation:
      "Mars disebut Planet Merah karena permukaannya mengandung oksida besi yang memberikan warna kemerahan.",
  },
  {
    question:
      "Apa yang menyebabkan planet tetap berada dalam orbit mengelilingi Matahari?",
    options: [
      "Gaya magnet",
      "Gaya listrik",
      "Gaya gravitasi",
      "Angin matahari",
    ],
    answer: 2,
    explanation:
      "Gravitasi Matahari menjaga planet dan benda langit lainnya tetap berada dalam orbitnya.",
  },
  {
    question: "Planet terbesar dalam tata surya adalah ...",
    options: ["Saturnus", "Neptunus", "Bumi", "Jupiter"],
    answer: 3,
    explanation: "Jupiter merupakan planet terbesar dalam tata surya.",
  },
  {
    question:
      "Apa nama benda langit yang memasuki atmosfer dan tampak bercahaya?",
    options: ["Meteor", "Asteroid", "Komet", "Satelit"],
    answer: 0,
    explanation:
      "Meteor adalah fenomena cahaya yang terjadi ketika meteoroid memasuki atmosfer dan mengalami pemanasan.",
  },
  {
    question: "Apa fungsi utama pakaian antariksa bagi astronaut?",
    options: [
      "Mempercepat perjalanan",
      "Melindungi tubuh dan menyediakan oksigen",
      "Menghasilkan gravitasi",
      "Mengendalikan pesawat",
    ],
    answer: 1,
    explanation:
      "Pakaian antariksa melindungi astronaut dari kondisi ekstrem dan menyediakan oksigen.",
  },
  {
    question: "Planet manakah yang terkenal memiliki cincin paling jelas?",
    options: ["Mars", "Venus", "Saturnus", "Merkurius"],
    answer: 2,
    explanation:
      "Saturnus memiliki sistem cincin yang jelas dan tersusun dari partikel es, debu, serta batuan.",
  },
  {
    question: "Apa yang dimaksud dengan asteroid?",
    options: [
      "Bintang yang sedang meledak",
      "Planet yang kehilangan atmosfer",
      "Awan gas di luar angkasa",
      "Benda berbatu kecil yang mengorbit Matahari",
    ],
    answer: 3,
    explanation:
      "Asteroid merupakan benda kecil berbatu yang mengorbit Matahari.",
  },
];

export function calculateSurvivalXP(correct: number) {
  return correct * GAME_CONFIG.xpPerCorrect;
}

export function calculateSurvivalStars(correct: number) {
  if (correct >= 7) return 3;
  if (correct >= 5) return 2;
  if (correct >= 3) return 1;
  return 0;
}
