"use client";

import { useState } from "react";
import {
  Check,
  X,
  Star,
  Trophy,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Rocket,
  CircleHelp,
  Trash2,
} from "lucide-react";

interface GameProps {
  onComplete?: () => void;
  onReward?: (xp: number, stars: number) => void;
}

const formationSteps = [
  { id: 1, text: "Nebula gas dan debu mulai berkumpul" },
  { id: 2, text: "Gravitasi membentuk awan menjadi berputar" },
  { id: 3, text: "Matahari terbentuk di pusat" },
  { id: 4, text: "Material membentuk planet dan benda langit" },
  { id: 5, text: "Tata surya terbentuk" },
];

const spaceObjects = [
  {
    id: "sun",
    name: "Matahari",
    description: "Bintang yang menjadi pusat tata surya",
    icon: "☀️",
  },
  {
    id: "planet",
    name: "Planet",
    description: "Benda langit yang mengorbit sebuah bintang",
    icon: "🪐",
  },
  {
    id: "asteroid",
    name: "Asteroid",
    description: "Benda berbatu yang mengorbit Matahari",
    icon: "☄️",
  },
  {
    id: "comet",
    name: "Komet",
    description: "Benda langit es dan debu yang dapat membentuk ekor",
    icon: "🌠",
  },
];

const quizQuestions = [
  {
    question: "Apa yang menjadi pusat tata surya kita?",
    options: ["Bumi", "Bulan", "Matahari", "Mars"],
    correctAnswer: 2,
    explanation:
      "Matahari merupakan pusat tata surya dan menjadi pusat orbit planet-planet.",
  },
  {
    question: "Planet manakah yang dikenal sebagai Planet Merah?",
    options: ["Venus", "Mars", "Jupiter", "Saturnus"],
    correctAnswer: 1,
    explanation:
      "Mars dikenal sebagai Planet Merah karena permukaannya mengandung oksida besi.",
  },
  {
    question: "Planet terbesar dalam tata surya adalah ...",
    options: ["Bumi", "Neptunus", "Saturnus", "Jupiter"],
    correctAnswer: 3,
    explanation:
      "Jupiter merupakan planet terbesar di tata surya berdasarkan diameter dan massanya.",
  },
  {
    question: "Benda langit apakah yang memiliki ekor saat mendekati Matahari?",
    options: ["Asteroid", "Komet", "Planet", "Satelit"],
    correctAnswer: 1,
    explanation:
      "Komet dapat membentuk ekor gas dan debu saat mendekati Matahari.",
  },
  {
    question: "Apa yang menyebabkan planet tetap mengorbit Matahari?",
    options: [
      "Cahaya Matahari",
      "Angin Matahari",
      "Gaya gravitasi",
      "Suhu planet",
    ],
    correctAnswer: 2,
    explanation:
      "Gaya gravitasi Matahari menjaga planet-planet tetap berada pada orbitnya.",
  },
];

function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function StageHeading({
  number,
  title,
  subtitle,
}: {
  number: number;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
        {number}
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function Feedback({
  success,
  title,
  message,
}: {
  success: boolean;
  title: string;
  message: string;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${success ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${success ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}
        >
          {success ? <Check size={16} /> : <CircleHelp size={16} />}
        </div>
        <div>
          <p
            className={`text-sm font-semibold ${success ? "text-emerald-800" : "text-amber-800"}`}
          >
            {title}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{message}</p>
        </div>
      </div>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export default function Game({ onComplete, onReward }: GameProps) {
  const [stage, setStage] = useState(0);
  const [shuffledSteps] = useState(() => shuffleArray(formationSteps));
  const [shuffledObjects] = useState(() => shuffleArray(spaceObjects));

  // Stage 1: Cosmic Order
  const [orderSlots, setOrderSlots] = useState<(number | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);
  const [orderChecked, setOrderChecked] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [draggedStep, setDraggedStep] = useState<number | null>(null);

  // Stage 2: Object matching
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [matchChecked, setMatchChecked] = useState(false);
  const [matchSuccess, setMatchSuccess] = useState(false);
  const [draggedObject, setDraggedObject] = useState<string | null>(null);

  // Stage 3: Quiz
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  // Completion state
  const [finished, setFinished] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [earnedStars, setEarnedStars] = useState(0);

  const currentQuestion = quizQuestions[quizIndex];

  // Stage 1 actions
  function handleOrderDrop(slotIndex: number) {
    if (draggedStep === null || orderChecked) return;
    setOrderSlots((previous) => {
      const next = [...previous];
      const oldIndex = next.indexOf(draggedStep);
      const targetItem = next[slotIndex];
      if (oldIndex !== -1) next[oldIndex] = null;
      next[slotIndex] = draggedStep;
      if (targetItem !== null && oldIndex !== -1) next[oldIndex] = targetItem;
      return next;
    });
    setDraggedStep(null);
  }

  function removeOrderItem(slotIndex: number) {
    if (orderChecked) return;
    setOrderSlots((previous) => {
      const next = [...previous];
      next[slotIndex] = null;
      return next;
    });
  }

  function checkOrder() {
    const isCorrect = formationSteps.every(
      (step, index) => orderSlots[index] === step.id,
    );
    setOrderChecked(true);
    setOrderSuccess(isCorrect);
  }

  function retryOrder() {
    setOrderSlots([null, null, null, null, null]);
    setOrderChecked(false);
    setOrderSuccess(false);
  }

  // Stage 2 actions
  function handleMatchDrop(targetId: string) {
    if (!draggedObject || matchChecked) return;
    setMatches((previous) => {
      const next = { ...previous };
      Object.keys(next).forEach((key) => {
        if (next[key] === draggedObject) delete next[key];
      });
      next[targetId] = draggedObject;
      return next;
    });
    setDraggedObject(null);
  }

  function removeMatch(targetId: string) {
    if (matchChecked) return;
    setMatches((previous) => {
      const next = { ...previous };
      delete next[targetId];
      return next;
    });
  }

  function checkMatches() {
    const isCorrect = spaceObjects.every(
      (object) => matches[object.id] === object.id,
    );
    setMatchChecked(true);
    setMatchSuccess(isCorrect);
  }

  function retryMatches() {
    setMatches({});
    setMatchChecked(false);
    setMatchSuccess(false);
  }

  // Stage 3 actions
  function answerQuiz(index: number) {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === currentQuestion.correctAnswer)
      setQuizScore((score) => score + 1);
  }

  function finishGame() {
    // quizScore sudah mencakup jawaban terakhir karena tombol selesai ditekan setelah memilih jawaban.
    const xp = 20 + quizScore * 10;
    const stars = quizScore >= 4 ? 3 : quizScore >= 2 ? 2 : 1;
    setFinished(true);
    setEarnedXP(xp);
    setEarnedStars(stars);
    onReward?.(xp, stars);
  }

  function nextQuestion() {
    if (selectedAnswer === null) return;
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex((index) => index + 1);
      setSelectedAnswer(null);
    } else {
      finishGame();
    }
  }

  function resetGame() {
    setStage(0);
    setOrderSlots([null, null, null, null, null]);
    setOrderChecked(false);
    setOrderSuccess(false);
    setMatches({});
    setMatchChecked(false);
    setMatchSuccess(false);
    setQuizIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setFinished(false);
    setEarnedXP(0);
    setEarnedStars(0);
    setDraggedStep(null);
    setDraggedObject(null);
  }

  // Finished screen. This remains inside the dashboard's existing parent container.
  if (finished) {
    return (
      <div className="w-full space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-50">
            <Trophy size={36} className="text-amber-500" />
          </div>
          <div className="mt-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Mission Completed
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Cosmic Mission Selesai!
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Kamu berhasil menyelesaikan seluruh tantangan Planet Puzzle. Terus
              tingkatkan pengetahuanmu tentang tata surya!
            </p>
          </div>
          <div className="mt-7 flex justify-center gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${index < earnedStars ? "bg-amber-100 text-amber-500" : "bg-slate-100 text-slate-300"}`}
              >
                <Star
                  size={24}
                  fill={index < earnedStars ? "currentColor" : "none"}
                />
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
              <Sparkles className="mx-auto text-amber-500" size={22} />
              <p className="mt-2 text-2xl font-bold text-slate-900">
                +{earnedXP} XP
              </p>
              <p className="mt-1 text-xs text-slate-500">XP diperoleh</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
              <Star className="mx-auto text-amber-500" size={22} />
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {earnedStars}/3
              </p>
              <p className="mt-1 text-xs text-slate-500">Bintang diperoleh</p>
            </div>
          </div>
          <div className="mt-5 rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-medium text-slate-600">
              Hasil Cosmic Quiz
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {quizScore} / {quizQuestions.length}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Jawaban benar dari total pertanyaan
            </p>
          </div>
          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={resetGame}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <RotateCcw size={16} /> Main Lagi
            </button>
            <button
              type="button"
              onClick={onComplete}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Kembali ke Mission Hub <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    // IMPORTANT: no dashboard/sidebar/navbar wrapper here. Game uses the parent dashboard container width.
    <div className="w-full space-y-5">
      {/* Game header and progress */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Rocket size={23} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Misi 01
            </p>
            <h1 className="mt-1 text-xl font-bold text-slate-900">
              Planet Puzzle
            </h1>
          </div>
          <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
            <Sparkles size={14} className="mr-1 inline" />
            {20 + quizScore * 10} XP
          </div>
        </div>
        <div className="mt-5">
          <div className="mb-2 flex justify-between text-xs font-medium text-slate-500">
            <span>Progress Misi</span>
            <span>{stage + 1} / 3</span>
          </div>
          <div className="flex gap-2">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className={`h-2 flex-1 rounded-full ${item <= stage ? "bg-slate-900" : "bg-slate-100"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* STAGE 1 — COSMIC ORDER */}
      {stage === 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <StageHeading
            number={1}
            title="Cosmic Order"
            subtitle="Susun tahapan pembentukan tata surya secara berurutan."
          />
          <div className="mb-5 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
            Seret setiap tahapan ke kotak urutan yang benar.
          </div>
          <div className="space-y-2">
            {orderSlots.map((slot, index) => {
              const selectedStep = formationSteps.find(
                (step) => step.id === slot,
              );
              const isCorrect =
                orderChecked && slot === formationSteps[index].id;
              const isWrong = orderChecked && slot !== formationSteps[index].id;
              return (
                <div
                  key={index}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleOrderDrop(index)}
                  className={`flex min-h-[68px] items-center gap-3 rounded-xl border-2 border-dashed p-3 transition ${isCorrect ? "border-emerald-300 bg-emerald-50" : isWrong ? "border-red-200 bg-red-50" : "border-slate-200 bg-slate-50"}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-white text-slate-400"}`}
                  >
                    {index + 1}
                  </div>
                  {selectedStep ? (
                    <div className="flex flex-1 items-center justify-between gap-2">
                      <p className="text-sm font-medium text-slate-700">
                        {selectedStep.text}
                      </p>
                      {!orderChecked && (
                        <button
                          type="button"
                          onClick={() => removeOrderItem(index)}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                          aria-label="Hapus urutan"
                        >
                          <X size={16} />
                        </button>
                      )}
                      {orderChecked && (
                        <div
                          className={
                            isCorrect ? "text-emerald-600" : "text-red-500"
                          }
                        >
                          {isCorrect ? <Check size={18} /> : <X size={18} />}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">
                      Seret tahapan ke sini
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          {!orderChecked && (
            <div className="mt-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Tahapan Tersedia
              </p>
              <div className="space-y-2">
                {shuffledSteps.map((step) => {
                  const isUsed = orderSlots.includes(step.id);
                  return (
                    <div
                      key={step.id}
                      draggable={!isUsed}
                      onDragStart={() => setDraggedStep(step.id)}
                      onDragEnd={() => setDraggedStep(null)}
                      className={`flex items-center gap-3 rounded-xl border p-3 transition ${isUsed ? "border-slate-100 bg-slate-50 opacity-40" : "cursor-grab border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 active:cursor-grabbing"}`}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <Rocket size={15} />
                      </div>
                      <p className="text-sm font-medium text-slate-700">
                        {step.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {orderChecked && (
            <div className="mt-5">
              <Feedback
                success={orderSuccess}
                title={orderSuccess ? "Urutan berhasil!" : "Urutan belum tepat"}
                message={
                  orderSuccess
                    ? "Kamu berhasil menyusun proses pembentukan tata surya dengan benar."
                    : "Pelajari kembali urutan pembentukan tata surya, kemudian ulangi tantangan."
                }
              />
            </div>
          )}
          <div className="mt-5 space-y-3">
            {!orderChecked ? (
              <PrimaryButton
                onClick={checkOrder}
                disabled={orderSlots.some((slot) => slot === null)}
              >
                Periksa Jawaban <ArrowRight size={16} />
              </PrimaryButton>
            ) : orderSuccess ? (
              <PrimaryButton onClick={() => setStage(1)}>
                Lanjut ke Stage 2 <ArrowRight size={16} />
              </PrimaryButton>
            ) : (
              <PrimaryButton onClick={retryOrder}>
                <RotateCcw size={16} /> Coba Lagi
              </PrimaryButton>
            )}
          </div>
        </section>
      )}

      {/* STAGE 2 — MATCH THE OBJECT */}
      {stage === 1 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <StageHeading
            number={2}
            title="Match the Object"
            subtitle="Cocokkan objek luar angkasa dengan deskripsi yang tepat."
          />
          <div className="mb-5 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
            Seret objek langit ke deskripsi yang sesuai.
          </div>
          {!matchChecked && (
            <div className="mb-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Objek Langit
              </p>
              <div className="grid grid-cols-2 gap-3">
                {shuffledObjects.map((object) => {
                  const isUsed = Object.values(matches).includes(object.id);
                  return (
                    <div
                      key={object.id}
                      draggable={!isUsed}
                      onDragStart={() => setDraggedObject(object.id)}
                      onDragEnd={() => setDraggedObject(null)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition ${isUsed ? "border-slate-100 bg-slate-50 opacity-40" : "cursor-grab border-slate-200 bg-white hover:bg-slate-50 active:cursor-grabbing"}`}
                    >
                      <span className="text-3xl">{object.icon}</span>
                      <span className="text-sm font-semibold text-slate-700">
                        {object.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Deskripsi
            </p>
            <div className="space-y-3">
              {spaceObjects.map((object) => {
                const matchedObject = spaceObjects.find(
                  (item) => item.id === matches[object.id],
                );
                const isCorrect =
                  matchChecked && matches[object.id] === object.id;
                const isWrong =
                  matchChecked && matches[object.id] !== object.id;
                return (
                  <div
                    key={object.id}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => handleMatchDrop(object.id)}
                    className={`flex min-h-[80px] items-center gap-3 rounded-xl border-2 border-dashed p-3 transition ${isCorrect ? "border-emerald-300 bg-emerald-50" : isWrong ? "border-red-200 bg-red-50" : "border-slate-200 bg-slate-50"}`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-xl">
                      {object.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm leading-6 text-slate-700">
                        {object.description}
                      </p>
                      {matchedObject && (
                        <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-semibold text-slate-600">
                          {matchedObject.icon} {matchedObject.name}
                        </div>
                      )}
                    </div>
                    {!matchChecked && matchedObject && (
                      <button
                        type="button"
                        onClick={() => removeMatch(object.id)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                        aria-label="Hapus pasangan"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                    {matchChecked && (
                      <div
                        className={
                          isCorrect ? "text-emerald-600" : "text-red-500"
                        }
                      >
                        {isCorrect ? <Check size={18} /> : <X size={18} />}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {matchChecked && (
            <div className="mt-5">
              <Feedback
                success={matchSuccess}
                title={
                  matchSuccess
                    ? "Semua pasangan benar!"
                    : "Masih ada pasangan yang salah"
                }
                message={
                  matchSuccess
                    ? "Kamu berhasil mengenali seluruh objek langit."
                    : "Periksa karakteristik setiap objek langit dan coba ulangi."
                }
              />
            </div>
          )}
          <div className="mt-5 space-y-3">
            {!matchChecked ? (
              <PrimaryButton
                onClick={checkMatches}
                disabled={Object.keys(matches).length !== spaceObjects.length}
              >
                Periksa Pasangan <ArrowRight size={16} />
              </PrimaryButton>
            ) : matchSuccess ? (
              <PrimaryButton onClick={() => setStage(2)}>
                Lanjut ke Stage 3 <ArrowRight size={16} />
              </PrimaryButton>
            ) : (
              <PrimaryButton onClick={retryMatches}>
                <RotateCcw size={16} /> Coba Lagi
              </PrimaryButton>
            )}
          </div>
        </section>
      )}

      {/* STAGE 3 — COSMIC QUIZ */}
      {stage === 2 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <StageHeading
            number={3}
            title="Cosmic Quiz"
            subtitle="Uji pemahamanmu tentang tata surya."
          />
          {/* Quiz progress */}
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
              <span>Pertanyaan {quizIndex + 1}</span>
              <span>{quizQuestions.length} Pertanyaan</span>
            </div>
            <div className="flex gap-2">
              {quizQuestions.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 flex-1 rounded-full ${index <= quizIndex ? "bg-slate-900" : "bg-slate-100"}`}
                />
              ))}
            </div>
          </div>
          {/* Question */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Pertanyaan
            </p>
            <h3 className="mt-2 text-base font-semibold leading-7 text-slate-900">
              {currentQuestion.question}
            </h3>
          </div>
          {/* Answer options */}
          <div className="mt-4 space-y-2">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              const showResult = selectedAnswer !== null;
              let optionStyle = "border-slate-200 bg-white hover:bg-slate-50";
              if (showResult && isCorrect)
                optionStyle = "border-emerald-300 bg-emerald-50";
              else if (showResult && isSelected)
                optionStyle = "border-red-300 bg-red-50";
              else if (isSelected)
                optionStyle = "border-slate-400 bg-slate-100";
              return (
                <button
                  key={index}
                  type="button"
                  disabled={selectedAnswer !== null}
                  onClick={() => answerQuiz(index)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left shadow-sm transition ${optionStyle} disabled:cursor-default`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${showResult && isCorrect ? "bg-emerald-100 text-emerald-600" : showResult && isSelected ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-500"}`}
                  >
                    {showResult && isCorrect ? (
                      <Check size={16} />
                    ) : showResult && isSelected ? (
                      <X size={16} />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </div>
                  <span className="flex-1 text-sm font-medium leading-5 text-slate-700">
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
          {/* Feedback */}
          {selectedAnswer !== null && (
            <div className="mt-4">
              <Feedback
                success={selectedAnswer === currentQuestion.correctAnswer}
                title={
                  selectedAnswer === currentQuestion.correctAnswer
                    ? "Jawaban benar!"
                    : "Jawaban belum tepat"
                }
                message={currentQuestion.explanation}
              />
            </div>
          )}
          {/* Next question */}
          <div className="mt-5">
            <PrimaryButton
              onClick={nextQuestion}
              disabled={selectedAnswer === null}
            >
              {quizIndex === quizQuestions.length - 1
                ? "Selesaikan Misi"
                : "Pertanyaan Selanjutnya"}{" "}
              <ArrowRight size={16} />
            </PrimaryButton>
          </div>
        </section>
      )}
    </div>
  );
}
