export const GAME_ACTIVITY_ID = 3;

export const GAME_CONFIG = {
  title: "Space Rescue",
  totalComponents: 3,
  xpPerComponent: 10,
  generatorXP: 30,
  rescueXP: 60,
  maxXP: 120,
};

export type Point = {
  x: number;
  y: number;
};

export type Collectible = {
  id: number;
  name: string;
  description: string;
  x: number;
  y: number;
  icon: string;
};

export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export const INITIAL_PLAYER: Point = {
  x: 10,
  y: 50,
};

export const COLLECTIBLES: Collectible[] = [
  {
    id: 1,
    name: "Energy Cell",
    description: "Baterai untuk memasok energi generator.",
    x: 28,
    y: 23,
    icon: "🔋",
  },
  {
    id: 2,
    name: "Power Cable",
    description: "Kabel penghubung sistem kelistrikan.",
    x: 48,
    y: 75,
    icon: "🔌",
  },
  {
    id: 3,
    name: "Repair Kit",
    description: "Peralatan untuk memperbaiki generator.",
    x: 72,
    y: 28,
    icon: "🧰",
  },
];

export const COLLECTIBLE_QUESTIONS: Record<number, QuizQuestion[]> = {
  1: [
    {
      id: 101,
      question:
        "Planet manakah yang memiliki periode rotasi paling cepat di tata surya?",
      options: ["Bumi", "Jupiter", "Mars", "Venus"],
      answer: 1,
      explanation:
        "Jupiter memiliki rotasi paling cepat. Satu hari di Jupiter berlangsung sekitar 10 jam.",
    },
    {
      id: 102,
      question:
        "Apa nama lapisan Matahari yang terlihat sebagai permukaan bercahaya?",
      options: ["Korona", "Fotosfer", "Kromosfer", "Inti Matahari"],
      answer: 1,
      explanation:
        "Fotosfer merupakan lapisan Matahari yang memancarkan sebagian besar cahaya tampak yang kita lihat.",
    },
    {
      id: 103,
      question: "Apa nama satelit alami terbesar yang mengorbit Jupiter?",
      options: ["Titan", "Europa", "Ganymede", "Callisto"],
      answer: 2,
      explanation:
        "Ganymede merupakan satelit alami terbesar di tata surya, bahkan ukurannya lebih besar daripada Merkurius.",
    },
    {
      id: 104,
      question: "Mengapa planet-planet dapat tetap mengorbit Matahari?",
      options: [
        "Karena tidak memiliki massa",
        "Karena gaya gravitasi Matahari",
        "Karena didorong oleh angin Matahari",
        "Karena tidak mengalami gerakan",
      ],
      answer: 1,
      explanation:
        "Gravitasi Matahari menarik planet, sementara gerak planet membuatnya terus bergerak dalam lintasan orbit.",
    },
  ],

  2: [
    {
      id: 201,
      question:
        "Apa nama gunung berapi terbesar yang diketahui di planet Mars?",
      options: [
        "Mauna Loa",
        "Olympus Mons",
        "Mount Everest",
        "Valles Marineris",
      ],
      answer: 1,
      explanation:
        "Olympus Mons adalah gunung berapi raksasa di Mars dan merupakan gunung berapi terbesar yang diketahui di tata surya.",
    },
    {
      id: 202,
      question: "Mengapa Venus memiliki suhu permukaan yang sangat tinggi?",
      options: [
        "Karena memiliki banyak gunung berapi aktif saja",
        "Karena atmosfernya mengalami efek rumah kaca yang kuat",
        "Karena Venus paling dekat dengan Matahari",
        "Karena tidak memiliki atmosfer",
      ],
      answer: 1,
      explanation:
        "Atmosfer Venus yang sangat tebal dan kaya karbon dioksida menyebabkan efek rumah kaca ekstrem.",
    },
    {
      id: 203,
      question: "Sebagian besar cincin Saturnus tersusun dari material apa?",
      options: [
        "Batu bara dan debu",
        "Gas hidrogen",
        "Es dan pecahan batu",
        "Lava cair",
      ],
      answer: 2,
      explanation:
        "Cincin Saturnus terutama tersusun dari partikel es air, disertai debu dan material berbatu.",
    },
    {
      id: 204,
      question: "Di antara orbit planet manakah sabuk asteroid utama berada?",
      options: [
        "Bumi dan Mars",
        "Mars dan Jupiter",
        "Jupiter dan Saturnus",
        "Venus dan Bumi",
      ],
      answer: 1,
      explanation:
        "Sabuk asteroid utama berada di antara orbit Mars dan Jupiter.",
    },
  ],

  3: [
    {
      id: 301,
      question:
        "Apa nama lapisan atmosfer Bumi tempat sebagian besar fenomena cuaca terjadi?",
      options: ["Stratosfer", "Mesosfer", "Troposfer", "Termosfer"],
      answer: 2,
      explanation:
        "Troposfer adalah lapisan atmosfer paling bawah dan tempat sebagian besar awan serta fenomena cuaca terjadi.",
    },
    {
      id: 302,
      question:
        "Apa yang menyebabkan ekor komet umumnya mengarah menjauhi Matahari?",
      options: [
        "Tarikan gravitasi Bumi",
        "Angin Matahari dan tekanan radiasi Matahari",
        "Putaran planet Jupiter",
        "Medan magnet Saturnus",
      ],
      answer: 1,
      explanation:
        "Angin Matahari dan tekanan radiasi mendorong gas serta debu komet menjauhi Matahari.",
    },
    {
      id: 303,
      question: "Apa keunikan rotasi planet Uranus?",
      options: [
        "Berotasi sangat lambat tanpa bergerak",
        "Berotasi dengan kemiringan sumbu yang sangat ekstrem",
        "Berotasi berlawanan arah dengan semua planet",
        "Tidak memiliki sumbu rotasi",
      ],
      answer: 1,
      explanation:
        "Sumbu rotasi Uranus miring sekitar 98 derajat, sehingga planet ini tampak berputar seperti menggelinding.",
    },
    {
      id: 304,
      question: "Apa nama satelit alami terbesar milik Saturnus?",
      options: ["Titan", "Phobos", "Triton", "Io"],
      answer: 0,
      explanation:
        "Titan adalah satelit terbesar Saturnus dan memiliki atmosfer tebal yang didominasi nitrogen.",
    },
  ],
};

export const REPAIR_QUESTION: QuizQuestion = {
  id: 401,
  question:
    "Generator telah menerima tiga komponen. Apa prinsip yang memungkinkan generator menghasilkan energi listrik?",
  options: [
    "Induksi elektromagnetik",
    "Pembakaran batuan luar angkasa",
    "Pemantulan cahaya Matahari",
    "Penguapan air di ruang hampa",
  ],
  answer: 0,
  explanation:
    "Generator listrik dapat bekerja berdasarkan induksi elektromagnetik, yaitu perubahan fluks magnetik yang menghasilkan gaya gerak listrik.",
};

export function getRandomQuestion(
  collectibleId: number,
  usedQuestionIds: number[] = [],
): QuizQuestion {
  const questions = COLLECTIBLE_QUESTIONS[collectibleId] ?? [];

  const availableQuestions = questions.filter(
    (question) => !usedQuestionIds.includes(question.id),
  );

  const pool = availableQuestions.length > 0 ? availableQuestions : questions;

  return pool[Math.floor(Math.random() * pool.length)];
}

export function calculateGameStars(xp: number) {
  if (xp >= 100) return 3;
  if (xp >= 70) return 2;
  if (xp >= 40) return 1;
  return 0;
}
