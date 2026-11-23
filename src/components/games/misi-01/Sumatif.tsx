"use client";

import { useState } from "react";

interface Props {
  onComplete: () => void;
  onReward: (xp: number, stars: number) => void;
}

const questions = [
  {
    question: "Mengapa awan gas dan debu dapat membentuk tata surya?",
    options: [
      "Karena gravitasi",
      "Karena suara",
      "Karena air",
      "Karena cahaya Bulan",
    ],
    answer: 0,
  },
  {
    question: "Apa nama awan gas dan debu tempat tata surya terbentuk?",
    options: ["Nebula", "Atmosfer", "Fotosfer", "Biosfer"],
    answer: 0,
  },
  {
    question: "Berapa perkiraan usia tata surya?",
    options: [
      "4,6 miliar tahun",
      "500 tahun",
      "1 juta tahun",
      "100 miliar tahun",
    ],
    answer: 0,
  },
  {
    question: "Bagian yang menjadi pusat tata surya adalah?",
    options: ["Bumi", "Matahari", "Mars", "Jupiter"],
    answer: 1,
  },
  {
    question: "Materi yang berkumpul di pusat nebula membentuk?",
    options: ["Matahari", "Bulan", "Komet", "Asteroid"],
    answer: 0,
  },
  {
    question: "Materi di sekitar Matahari muda kemudian berkembang menjadi?",
    options: [
      "Planet dan benda tata surya",
      "Galaksi baru",
      "Awan Bumi",
      "Samudra",
    ],
    answer: 0,
  },
  {
    question: "Pembentukan tata surya terjadi melalui?",
    options: [
      "Proses bertahap",
      "Satu kejadian instan",
      "Tanpa perubahan",
      "Proses buatan manusia",
    ],
    answer: 0,
  },
  {
    question: "Apa yang terjadi ketika nebula mengalami kontraksi?",
    options: [
      "Materi berkumpul",
      "Materi menghilang",
      "Gravitasi berhenti",
      "Bintang menjadi air",
    ],
    answer: 0,
  },
  {
    question: "Sumber energi utama di tata surya adalah?",
    options: ["Matahari", "Bulan", "Mars", "Asteroid"],
    answer: 0,
  },
  {
    question: "Salah satu hasil proses pembentukan tata surya adalah?",
    options: [
      "Terbentuknya planet",
      "Hilangnya gravitasi",
      "Bumi tanpa orbit",
      "Tidak ada benda langit",
    ],
    answer: 0,
  },
];

export default function Sumatif({ onComplete, onReward }: Props) {
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
      onReward(15, 1);
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
      <h2 className="text-lg font-semibold">Sumatif</h2>
      <p className="mt-1 text-sm text-gray-500">Evaluasi akhir · 10 soal</p>

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
            ? "Jawaban benar! Kamu mendapatkan 15 XP dan 1 bintang."
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
            ? "Selesaikan Misi"
            : "Soal Berikutnya"}
        </button>
      )}

      <p className="mt-4 text-center text-xs text-gray-400">
        Skor: {score} / {questions.length}
      </p>
    </div>
  );
}
