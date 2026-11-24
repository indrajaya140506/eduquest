"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Rocket,
  Trophy,
  RotateCcw,
  Loader2,
  Zap,
  Keyboard,
  Timer,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import {
  SURVIVAL_QUESTIONS,
  GAME_CONFIG,
  GAME_ACTIVITY_ID,
  calculateSurvivalXP,
  calculateSurvivalStars,
} from "./GameData";

import {
  GameContainer,
  SpaceBackground,
  GameBrand,
  SurvivalHUD,
  ShipScene,
  SurvivalReward,
} from "./GameComponents";

type GamePhase = "flight" | "question" | "result";

export default function Game() {
  const supabase = createClient();

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [phase, setPhase] = useState<GamePhase>("flight");

  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);

  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);

  const [xp, setXP] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.questionTime);

  const [lane, setLane] = useState(1);
  const [shipY, setShipY] = useState(15);
  const [hit, setHit] = useState(false);
  const [impactKey, setImpactKey] = useState(0);

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const answerLockedRef = useRef(false);
  const finishLockedRef = useRef(false);

  const questions = SURVIVAL_QUESTIONS;
  const question = questions[qIndex];

  const wave = Math.floor(qIndex / 2) + 1;
  const stars = calculateSurvivalStars(correct);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const answerQuestion = useCallback(
    (index: number) => {
      if (answerLockedRef.current || finished || phase !== "question") {
        return;
      }

      answerLockedRef.current = true;
      stopTimer();

      setAnswer(index);
      setAnswered((value) => value + 1);

      if (index === question.answer) {
        setCorrect((value) => value + 1);

        setXP((value) =>
          Math.min(GAME_CONFIG.maxXP, value + GAME_CONFIG.xpPerCorrect),
        );

        setHit(false);
      } else {
        setHit(true);
        setImpactKey((value) => value + 1);
      }

      setPhase("result");
    },
    [finished, phase, question, stopTimer],
  );

  const startQuestion = useCallback(() => {
    if (!started || finished || phase !== "flight") return;

    answerLockedRef.current = false;
    setAnswer(null);
    setHit(false);
    setTimeLeft(GAME_CONFIG.questionTime);
    setPhase("question");
  }, [started, finished, phase]);

  const nextQuestion = useCallback(() => {
    if (phase !== "result" || saving) return;

    if (qIndex >= questions.length - 1) {
      finishLockedRef.current = true;
      setFinished(true);
      return;
    }

    setQIndex((value) => value + 1);
    setAnswer(null);
    setHit(false);
    setTimeLeft(GAME_CONFIG.questionTime);
    answerLockedRef.current = false;
    setPhase("flight");
  }, [phase, saving, qIndex, questions.length]);

  async function startGame() {
    setSaving(true);
    setSaveError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Sesi login tidak ditemukan. Silakan login kembali.");
      }

      const { data: attempt, error } = await supabase
        .from("percobaan_aktivitas")
        .insert({
          user_id: user.id,
          aktivitas_id: GAME_ACTIVITY_ID,
          nilai: null,
          jumlah_benar: 0,
          jumlah_salah: 0,
          xp_diperoleh: 0,
          status: "berlangsung",
          mulai_at: new Date().toISOString(),
          selesai_at: null,
          reward_claimed: false,
        })
        .select("id")
        .single();

      if (error) throw error;

      setAttemptId(attempt.id);
      setUserId(user.id);

      setStarted(true);
      setFinished(false);
      setPhase("flight");

      setQIndex(0);
      setAnswer(null);
      setCorrect(0);
      setAnswered(0);
      setXP(0);

      setTimeLeft(GAME_CONFIG.questionTime);
      setLane(1);
      setShipY(15);
      setHit(false);
      setImpactKey(0);

      answerLockedRef.current = false;
      finishLockedRef.current = false;

      setSaved(false);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Gagal memulai game.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function finishGame() {
    if (
      !attemptId ||
      !userId ||
      saved ||
      saving ||
      finishLockedRef.current === false
    ) {
      return;
    }

    setSaving(true);
    setSaveError("");

    const wrong = answered - correct;
    const finalScore = answered ? Math.round((correct / answered) * 100) : 0;

    const finalXP = calculateSurvivalXP(correct);
    const finalStars = calculateSurvivalStars(correct);

    try {
      const { error } = await supabase
        .from("percobaan_aktivitas")
        .update({
          nilai: finalScore,
          jumlah_benar: correct,
          jumlah_salah: wrong,
          xp_diperoleh: finalXP,
          status: "selesai",
          selesai_at: new Date().toISOString(),
          reward_claimed: true,
        })
        .eq("id", attemptId)
        .eq("reward_claimed", false);

      if (error) throw error;

      if (finalXP > 0) {
        const { error: xpError } = await supabase.from("riwayat_xp").insert({
          user_id: userId,
          percobaan_id: attemptId,
          jumlah_xp: finalXP,
          keterangan: "Reward Game Asteroid Survival",
        });

        if (xpError) throw xpError;
      }

      if (finalStars > 0) {
        const { error: starError } = await supabase
          .from("riwayat_bintang")
          .insert({
            user_id: userId,
            percobaan_id: attemptId,
            jumlah_bintang: finalStars,
          });

        if (starError) throw starError;
      }

      setSaved(true);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Gagal menyimpan hasil game.",
      );
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (!started || finished || phase !== "question") {
      stopTimer();
      return;
    }

    stopTimer();

    timerRef.current = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          stopTimer();

          // Jawaban timeout diproses satu kali.
          window.setTimeout(() => answerQuestion(-1), 0);

          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return stopTimer;
  }, [started, finished, phase, answerQuestion, stopTimer]);

  useEffect(() => {
    if (finished) {
      void finishGame();
    }
  }, [finished]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();

      if (
        ["arrowleft", "arrowright", "arrowup", "arrowdown", " "].includes(key)
      ) {
        event.preventDefault();
      }

      if (!started || finished) return;

      if (phase === "flight") {
        if (key === "a" || key === "arrowleft") {
          setLane((value) => Math.max(0, value - 1));
        }

        if (key === "d" || key === "arrowright") {
          setLane((value) => Math.min(2, value + 1));
        }

        if (key === "w" || key === "arrowup" || key === " ") {
          setShipY((value) => Math.min(65, value + 5));
          startQuestion();
        }

        if (key === "s" || key === "arrowdown") {
          setShipY((value) => Math.max(5, value - 5));
        }
      }

      if (phase === "result" && (key === "enter" || key === " ")) {
        nextQuestion();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [started, finished, phase, startQuestion, nextQuestion]);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  function reset() {
    stopTimer();

    setStarted(false);
    setFinished(false);
    setPhase("flight");

    setQIndex(0);
    setAnswer(null);

    setCorrect(0);
    setAnswered(0);
    setXP(0);

    setTimeLeft(GAME_CONFIG.questionTime);

    setLane(1);
    setShipY(15);
    setHit(false);
    setImpactKey(0);

    setAttemptId(null);
    setUserId(null);

    setSaving(false);
    setSaveError("");
    setSaved(false);

    answerLockedRef.current = false;
    finishLockedRef.current = false;
  }

  if (finished) {
    const percentage = answered ? Math.round((correct / answered) * 100) : 0;

    const rank =
      percentage >= 90
        ? "S"
        : percentage >= 75
          ? "A"
          : percentage >= 50
            ? "B"
            : "C";

    return (
      <GameContainer>
        <SpaceBackground />

        <div className="relative z-10 mx-auto w-full max-w-2xl p-4 text-center sm:p-8">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-amber-400/20 bg-amber-400/[.06]">
            <Trophy className="text-amber-300" size={30} />
          </div>

          <p className="mt-4 text-[10px] font-bold uppercase tracking-[.2em] text-cyan-300">
            Mission Completed
          </p>

          <h1 className="mt-1 text-3xl font-black">Asteroid Survivor!</h1>

          <p className="mt-2 text-sm text-white/45">
            Kamu berhasil menyelesaikan seluruh tantangan!
          </p>

          <div className="mx-auto mt-5 grid h-20 w-20 place-items-center rounded-2xl border border-amber-400/20 bg-amber-400/[.05] text-4xl font-black text-amber-300">
            {rank}
          </div>

          <p className="mt-2 text-[10px] uppercase tracking-widest text-white/35">
            Survival Rank
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <ResultCard value={xp} label="Total XP" />
            <ResultCard
              value={`${correct}/${questions.length}`}
              label="Correct"
            />
            <ResultCard value={`${percentage}%`} label="Accuracy" />
            <ResultCard value={answered - correct} label="Wrong" />
          </div>

          <div className="mt-4">
            <SurvivalReward xp={xp} stars={stars} />
          </div>

          {saved && (
            <p className="mt-3 text-xs text-emerald-300">
              ✓ XP dan bintang berhasil disimpan.
            </p>
          )}

          {saving && (
            <p className="mt-3 text-xs text-white/50">
              Menyimpan hasil permainan...
            </p>
          )}

          {saveError && (
            <p className="mt-3 rounded-xl border border-red-400/20 bg-red-400/[.04] p-3 text-sm text-red-300">
              {saveError}
            </p>
          )}

          <button
            onClick={reset}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.05] px-5 py-3 text-sm font-bold hover:bg-white/10"
          >
            <RotateCcw size={16} />
            Main Lagi
          </button>
        </div>
      </GameContainer>
    );
  }

  if (!started) {
    return (
      <GameContainer>
        <SpaceBackground />

        <div className="relative z-10 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between gap-3">
            <GameBrand />

            <span className="rounded-full border border-cyan-400/15 bg-cyan-400/[.04] px-3 py-1.5 text-[10px] text-cyan-300">
              MISSION 04
            </span>
          </div>

          <div className="mt-7 grid items-center gap-7 lg:grid-cols-2">
            <section>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-400/[.05] px-3 py-1.5 text-[10px] text-violet-300">
                ☄️ SPACE SURVIVAL MISSION
              </div>

              <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
                Asteroid
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  Survival
                </span>
              </h1>

              <p className="mt-4 max-w-lg text-sm leading-7 text-white/50">
                Kendalikan pesawat antariksa, hindari asteroid, dan selesaikan
                tantangan sebelum waktu habis. Setiap jawaban benar memberikan
                20 XP untuk meningkatkan skor misimu.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "10 Seconds / Question",
                  "20 XP / Correct",
                  "8 Challenges",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-lg border border-white/[.07] bg-white/[.025] px-3 py-2 text-xs text-white/55"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-5 max-w-sm">
                <SurvivalReward xp={GAME_CONFIG.maxXP} stars={3} />
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-white/[.025] p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-bold text-cyan-300">
                  <Keyboard size={16} />
                  KEYBOARD CONTROLS
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-white/50">
                  <p>W / ↑ : Bergerak maju</p>
                  <p>S / ↓ : Bergerak mundur</p>
                  <p>A / ← : Bergerak kiri</p>
                  <p>D / → : Bergerak kanan</p>
                  <p>SPACE : Mulai tantangan</p>
                  <p>ENTER : Lanjutkan misi</p>
                </div>
              </div>

              {saveError && (
                <div className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/[.04] p-3 text-sm text-rose-300">
                  {saveError}
                </div>
              )}

              <button
                disabled={saving}
                onClick={startGame}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-bold shadow-lg shadow-blue-950/20 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 sm:w-auto"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Preparing Mission...
                  </>
                ) : (
                  <>
                    <Rocket size={17} />
                    Launch Survival
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </section>

            <section className="relative flex min-h-[320px] items-center justify-center overflow-hidden">
              <div className="absolute h-64 w-64 rounded-full bg-cyan-500/[.04] blur-[90px]" />
              <div className="absolute h-64 w-64 rounded-full border border-white/[.04]" />
              <div className="absolute h-44 w-44 rounded-full border border-white/[.05]" />
              <div className="absolute h-24 w-24 animate-pulse rounded-full bg-gradient-to-br from-cyan-300 to-blue-950 shadow-[0_0_50px_rgba(34,211,238,.2)]" />
              <div className="absolute animate-bounce text-3xl">☄️</div>
              <div className="absolute left-[18%] top-[28%] text-2xl">🪨</div>
              <div className="absolute right-[18%] top-[60%] text-xl">☄️</div>
              <div className="absolute bottom-[23%] left-[25%] text-xl">🪨</div>

              <div className="absolute bottom-3 flex items-center gap-2 text-[10px] text-white/30">
                <Rocket size={12} />
                Survive the asteroid field
              </div>
            </section>
          </div>
        </div>
      </GameContainer>
    );
  }

  return (
    <GameContainer>
      <SpaceBackground />

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              stopTimer();
              setStarted(false);
              setAnswer(null);
              setQIndex(0);
              setPhase("flight");
            }}
            className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white"
          >
            <ArrowLeft size={14} />
            Exit Mission
          </button>

          <div className="rounded-full border border-violet-400/15 bg-violet-400/[.04] px-3 py-1.5 text-[10px] font-bold text-violet-300">
            ASTEROID SURVIVAL
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[.2em] text-cyan-300">
              Wave {wave}
            </p>

            <h1 className="mt-1 text-xl font-black sm:text-2xl">
              Asteroid Flight
            </h1>
          </div>

          <div className="rounded-xl border border-amber-400/10 bg-amber-400/[.04] px-3 py-2 text-xs font-bold text-amber-300">
            {xp} XP
          </div>
        </div>

        <SurvivalHUD
          timeLeft={timeLeft}
          xp={xp}
          question={qIndex + 1}
          totalQuestions={questions.length}
          wave={wave}
          active={phase === "question"}
        />

        <div className="mt-4">
          <ShipScene
            lane={lane}
            hit={hit}
            shipY={shipY}
            impactKey={impactKey}
          />
        </div>

        {phase === "flight" && (
          <div className="mt-4 rounded-2xl border border-cyan-400/15 bg-cyan-400/[.04] p-5 text-center">
            <Rocket className="mx-auto text-cyan-300" size={30} />

            <h2 className="mt-3 text-lg font-bold">
              Pesawat siap melanjutkan penerbangan
            </h2>

            <p className="mt-2 text-sm text-white/45">
              Tekan W atau SPACE untuk memulai tantangan berikutnya.
            </p>

            <button
              onClick={startQuestion}
              className="mt-4 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-[#07111F] transition hover:bg-cyan-400"
            >
              Mulai Tantangan
            </button>
          </div>
        )}

        {phase === "question" && (
          <div className="mt-4 rounded-2xl border border-white/[.07] bg-[#11182B]/90 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <span className="rounded-lg bg-violet-400/[.08] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-300">
                  Survival Quiz
                </span>

                <p className="mt-2 text-[10px] text-white/35">
                  Question {qIndex + 1} / {questions.length}
                </p>
              </div>

              <div
                className={`flex items-center gap-2 rounded-xl border px-4 py-2 ${
                  timeLeft <= 3
                    ? "border-rose-400/30 bg-rose-400/10 text-rose-300"
                    : "border-cyan-400/20 bg-cyan-400/[.05] text-cyan-300"
                }`}
              >
                <Timer size={16} />
                <span className="text-lg font-black tabular-nums">
                  {timeLeft}s
                </span>
              </div>
            </div>

            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  timeLeft <= 3 ? "bg-rose-400" : "bg-cyan-400"
                }`}
                style={{
                  width: `${(timeLeft / GAME_CONFIG.questionTime) * 100}%`,
                }}
              />
            </div>

            <h2 className="text-base font-bold leading-7 sm:text-lg">
              {question.question}
            </h2>

            <div className="mt-4 space-y-2">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  disabled={answer !== null}
                  onClick={() => answerQuestion(index)}
                  className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[.02] p-3 text-left transition hover:border-cyan-400/30 hover:bg-cyan-400/[.04] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[.04] text-xs font-bold text-white/50">
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span className="flex-1 text-sm">{option}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === "result" && answer !== null && (
          <div
            className={`mt-4 rounded-2xl border p-4 ${
              answer === question.answer
                ? "border-emerald-400/20 bg-emerald-400/[.05]"
                : "border-rose-400/20 bg-rose-400/[.05]"
            }`}
          >
            <div className="flex items-center gap-2">
              {answer === question.answer ? (
                <Check className="text-emerald-300" size={20} />
              ) : (
                <X className="text-rose-300" size={20} />
              )}

              <p
                className={`text-sm font-bold ${
                  answer === question.answer
                    ? "text-emerald-300"
                    : "text-rose-300"
                }`}
              >
                {answer === question.answer
                  ? `Correct! +${GAME_CONFIG.xpPerCorrect} XP`
                  : answer === -1
                    ? "Time is up! +0 XP"
                    : "Incorrect! +0 XP"}
              </p>
            </div>

            <p className="mt-2 text-sm leading-6 text-white/50">
              {question.explanation}
            </p>

            <button
              onClick={nextQuestion}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-bold"
            >
              {qIndex === questions.length - 1 ? (
                <>
                  <Trophy size={16} />
                  Finish Mission
                </>
              ) : (
                <>
                  Continue Flight
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        )}

        <div className="mt-4 rounded-xl border border-white/[.07] bg-white/[.025] p-3">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
            <Keyboard size={14} />
            Flight Controls
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setLane((value) => Math.max(0, value - 1))}
              disabled={lane === 0 || phase !== "flight"}
              className="rounded-xl border border-white/10 bg-white/[.03] p-3 text-xs font-bold disabled:opacity-30"
            >
              ← Left
            </button>

            <button
              onClick={startQuestion}
              disabled={phase !== "flight"}
              className="rounded-xl border border-cyan-400/20 bg-cyan-400/[.05] p-3 text-xs font-bold text-cyan-300 disabled:opacity-30"
            >
              ↑ Forward
            </button>

            <button
              onClick={() => setLane((value) => Math.min(2, value + 1))}
              disabled={lane === 2 || phase !== "flight"}
              className="rounded-xl border border-white/10 bg-white/[.03] p-3 text-xs font-bold disabled:opacity-30"
            >
              Right →
            </button>
          </div>
        </div>

        {saveError && (
          <div className="mt-3 rounded-xl border border-red-400/20 bg-red-400/[.04] p-3 text-sm text-red-300">
            {saveError}
          </div>
        )}
      </div>
    </GameContainer>
  );
}

function ResultCard({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[.025] p-3">
      <p className="text-xl font-bold">{value}</p>
      <p className="text-[9px] text-white/40">{label}</p>
    </div>
  );
}
