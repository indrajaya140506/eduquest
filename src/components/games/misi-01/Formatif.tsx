"use client";

import { useState } from "react";

interface Props {
  onComplete: () => void;
  onReward: (xp: number, stars: number) => void;
}

const questions = [
  {
    question: "Tata surya terbentuk dari?",
    options: ["Awan gas dan debu", "Air laut", "Batu di Bumi", "Cahaya Bulan"],
    answer: 0,
  },
  {
    question: "Awan pembentuk tata surya disebut?",
    options: ["Nebula", "Atmosfer", "Fotosfer", "Magnetosfer"],
    answer: 0,
  },
  {
    question: "Apa yang menyebabkan awan gas dan debu berkumpul?",
    options: ["Angin", "Gravitasi", "Cahaya", "Suhu"],
    answer: 1,
  },
  {
    question: "Sebagian besar materi berkumpul membentuk?",
    options: ["Bumi", "Mars", "Matahari", "Bulan"],
    answer: 2,
  },
  {
    question: "Planet terbentuk dari materi yang berada?",
    options: [
      "Di sekitar Matahari muda",
      "Di luar galaksi",
      "Di dalam Bulan",
      "Di atmosfer Bumi",
    ],
    answer: 0,
  },
  {
    question: "Tata surya terbentuk sekitar?",
    options: [
      "1 juta tahun lalu",
      "4,6 miliar tahun lalu",
      "100 tahun lalu",
      "10 miliar tahun lalu",
    ],
    answer: 1,
  },
  {
    question: "Proses berkumpulnya materi dipengaruhi?",
    options: ["Gravitasi", "Suara", "Listrik rumah", "Air"],
    answer: 0,
  },
  {
    question: "Matahari terbentuk pada bagian?",
    options: ["Tepi nebula", "Pusat nebula", "Luar galaksi", "Orbit Bumi"],
    answer: 1,
  },
  {
    question: "Materi sisa pembentukan tata surya membentuk?",
    options: ["Planet dan benda langit", "Gedung", "Laut", "Awan Bumi"],
    answer: 0,
  },
  {
    question: "Pembentukan tata surya berlangsung?",
    options: [
      "Secara bertahap",
      "Dalam satu detik",
      "Tanpa gravitasi",
      "Setelah Bumi modern",
    ],
    answer: 0,
  },
];

export default function Formatif({ onComplete, onReward }: Props) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const current = questions[index];
  const correct = selected === current.answer;

  const handleAnswer = () => {
    if (selected === null || answered) return;

    setAnswered(true);

    if (correct) {
      setScore((prev) => prev + 1);
      onReward(10, 1);
    }
  };

  const nextQuestion = () => {
    if (index < questions.length - 1) {
      setIndex((prev) => prev + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      onComplete();
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <h2 className="text-lg font-semibold">Formatif</h2>
      <p className="mt-1 text-sm text-gray-500">Evaluasi permainan · 10 soal</p>

      <div className="mt-5 h-2 rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>

      <h3 className="mt-6 font-medium">
        {index + 1}. {current.question}
      </h3>

      <div className="mt-4 space-y-2">
        {current.options.map((option, i) => (
          <button
            key={i}
            disabled={answered}
            onClick={() => setSelected(i)}
            className={`w-full rounded-xl border p-3 text-left text-sm ${
              selected === i
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {answered && (
        <div
          className={`mt-4 rounded-xl p-3 text-sm ${
            correct ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {correct
            ? "Jawaban benar! Kamu mendapatkan 10 XP dan 1 bintang."
            : `Jawaban kurang tepat. Jawaban yang benar: ${current.options[current.answer]}`}
        </div>
      )}

      {!answered ? (
        <button
          disabled={selected === null}
          onClick={handleAnswer}
          className="mt-6 w-full rounded-xl bg-[#14243D] py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          Periksa Jawaban
        </button>
      ) : (
        <button
          onClick={nextQuestion}
          className="mt-6 w-full rounded-xl bg-[#14243D] py-3 text-sm font-semibold text-white"
        >
          {index === questions.length - 1
            ? "Lanjut ke Sumatif"
            : "Soal Berikutnya"}
        </button>
      )}

      <p className="mt-4 text-center text-xs text-gray-400">
        Skor: {score} / {questions.length}
      </p>
    </div>
  );
}
