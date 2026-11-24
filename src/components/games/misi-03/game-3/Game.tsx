"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Keyboard,
  Loader2,
  Pause,
  Play,
  Radio,
  RotateCcw,
  Trophy,
  X,
  Zap,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import {
  GAME_ACTIVITY_ID,
  GAME_CONFIG,
  INITIAL_PLAYER,
  COLLECTIBLES,
  COLLECTIBLE_QUESTIONS,
  REPAIR_QUESTION,
  calculateGameStars,
  type Point,
  type QuizQuestion,
} from "./GameData";

import {
  GameContainer,
  SpaceBackground,
  RescueHUD,
  StationMap,
  MissionPanel,
  RewardPanel,
} from "./GameComponents";

type GameStatus = "intro" | "playing" | "paused" | "completed";
type MessageType = "info" | "success" | "error";

type ActiveQuestion = {
  question: QuizQuestion;
  collectibleId: number;
  questionNumber: number;
  totalQuestions: number;
};

export default function Game() {
  const supabase = createClient();

  const [status, setStatus] = useState<GameStatus>("intro");
  const [player, setPlayer] = useState<Point>(INITIAL_PLAYER);

  const [collectedIds, setCollectedIds] = useState<number[]>([]);
  const [generatorActive, setGeneratorActive] = useState(false);
  const [repairOpen, setRepairOpen] = useState(false);
  const [rescueUnlocked, setRescueUnlocked] = useState(false);

  // Menyimpan jumlah soal yang sudah dijawab benar untuk setiap komponen.
  const [questionProgress, setQuestionProgress] = useState<
    Record<number, number>
  >({
    1: 0,
    2: 0,
    3: 0,
  });

  const [activeQuestion, setActiveQuestion] = useState<ActiveQuestion | null>(
    null,
  );
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState("");
  const [answerCorrect, setAnswerCorrect] = useState<boolean | null>(null);

  const [repairSelected, setRepairSelected] = useState<number | null>(null);
  const [repairFeedback, setRepairFeedback] = useState("");
  const [repairCorrect, setRepairCorrect] = useState<boolean | null>(null);

  const [xp, setXP] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const [message, setMessage] = useState(
    "Jelajahi stasiun dan kumpulkan komponen perbaikan.",
  );
  const [messageType, setMessageType] = useState<MessageType>("info");

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const finishStartedRef = useRef(false);
  const positionRef = useRef<Point>(INITIAL_PLAYER);
  const interactionLockRef = useRef(false);

  const collected = collectedIds.length;
  const stars = calculateGameStars(xp);

  const totalAnswered = Object.values(questionProgress).reduce(
    (total, value) => total + value,
    0,
  );

  const totalCollectibleQuestions = Object.values(COLLECTIBLE_QUESTIONS).reduce(
    (total, questions) => total + questions.length,
    0,
  );

  const nearby = (() => {
    if (rescueUnlocked && distance(player, { x: 84, y: 82 }) < 12) {
      return "menyelamatkan kru";
    }

    if (
      !generatorActive &&
      collectedIds.length === GAME_CONFIG.totalComponents &&
      distance(player, { x: 70, y: 18 }) < 13
    ) {
      return "memperbaiki generator";
    }

    const item = COLLECTIBLES.find(
      (entry) =>
        !collectedIds.includes(entry.id) && distance(player, entry) < 11,
    );

    return item ? `menjawab soal ${item.name}` : null;
  })();

  const setPosition = useCallback((next: Point) => {
    positionRef.current = next;
    setPlayer(next);
  }, []);

  const showMessage = useCallback(
    (text: string, type: MessageType = "info") => {
      setMessage(text);
      setMessageType(type);
    },
    [],
  );

  const closeQuestion = useCallback(() => {
    setActiveQuestion(null);
    setSelectedAnswer(null);
    setAnswerFeedback("");
    setAnswerCorrect(null);
  }, []);

  // Membuka soal sesuai urutan bank soal komponen.
  const openCollectibleQuestion = useCallback(
    (collectibleId: number) => {
      const questions = COLLECTIBLE_QUESTIONS[collectibleId] ?? [];
      const progress = questionProgress[collectibleId] ?? 0;

      if (progress >= questions.length) {
        showMessage("Semua soal komponen ini sudah diselesaikan.", "info");
        return;
      }

      const question = questions[progress];

      if (!question) {
        showMessage("Soal belum tersedia untuk komponen ini.", "error");
        return;
      }

      setActiveQuestion({
        question,
        collectibleId,
        questionNumber: progress + 1,
        totalQuestions: questions.length,
      });

      setSelectedAnswer(null);
      setAnswerFeedback("");
      setAnswerCorrect(null);
    },
    [questionProgress, showMessage],
  );

  // Memeriksa jawaban soal komponen.
  const answerCollectibleQuestion = useCallback(
    (index: number) => {
      if (!activeQuestion || answerCorrect === true) return;

      const question = activeQuestion.question;
      setSelectedAnswer(index);

      if (index === question.answer) {
        setAnswerCorrect(true);
        setAnswerFeedback(`Benar! ${question.explanation}`);

        showMessage(
          `Jawaban soal ${activeQuestion.questionNumber} benar!`,
          "success",
        );
      } else {
        setAnswerCorrect(false);
        setAnswerFeedback(`Belum tepat. ${question.explanation}`);

        showMessage(
          "Jawaban belum tepat. Pelajari penjelasannya dan coba lagi.",
          "error",
        );
      }
    },
    [activeQuestion, answerCorrect, showMessage],
  );

  // Melanjutkan ke soal berikutnya atau mengambil komponen.
  const continueAfterCorrectAnswer = useCallback(() => {
    if (!activeQuestion || answerCorrect !== true) return;

    const { collectibleId, questionNumber, totalQuestions } = activeQuestion;

    const nextProgress = questionNumber;

    setQuestionProgress((previous) => ({
      ...previous,
      [collectibleId]: nextProgress,
    }));

    // Jika masih ada soal, tampilkan soal berikutnya.
    if (questionNumber < totalQuestions) {
      const nextQuestion =
        COLLECTIBLE_QUESTIONS[collectibleId]?.[questionNumber];

      if (!nextQuestion) {
        closeQuestion();
        return;
      }

      setActiveQuestion({
        question: nextQuestion,
        collectibleId,
        questionNumber: questionNumber + 1,
        totalQuestions,
      });

      setSelectedAnswer(null);
      setAnswerFeedback("");
      setAnswerCorrect(null);

      showMessage(
        `Soal ${questionNumber} selesai. Lanjutkan ke soal ${questionNumber + 1}.`,
        "success",
      );

      return;
    }

    // Semua soal komponen selesai. Komponen baru bisa diambil.
    const collectible = COLLECTIBLES.find((item) => item.id === collectibleId);

    if (!collectible) {
      closeQuestion();
      return;
    }

    setCollectedIds((previous) =>
      previous.includes(collectibleId)
        ? previous
        : [...previous, collectibleId],
    );

    setXP((previous) =>
      Math.min(GAME_CONFIG.maxXP, previous + GAME_CONFIG.xpPerComponent),
    );

    showMessage(
      `${collectible.name} berhasil dikumpulkan! +${GAME_CONFIG.xpPerComponent} XP`,
      "success",
    );

    closeQuestion();
  }, [activeQuestion, answerCorrect, closeQuestion, showMessage]);

  // Interaksi objek di dalam stasiun.
  const interact = useCallback(() => {
    if (
      status !== "playing" ||
      repairOpen ||
      activeQuestion ||
      interactionLockRef.current
    ) {
      return;
    }

    const current = positionRef.current;

    const item = COLLECTIBLES.find(
      (entry) =>
        !collectedIds.includes(entry.id) && distance(current, entry) < 11,
    );

    if (item) {
      interactionLockRef.current = true;
      openCollectibleQuestion(item.id);

      window.setTimeout(() => {
        interactionLockRef.current = false;
      }, 250);

      return;
    }

    if (
      collectedIds.length === GAME_CONFIG.totalComponents &&
      !generatorActive &&
      distance(current, { x: 70, y: 18 }) < 13
    ) {
      setRepairOpen(true);
      setRepairSelected(null);
      setRepairFeedback("");
      setRepairCorrect(null);
      return;
    }

    if (rescueUnlocked && distance(current, { x: 84, y: 82 }) < 12) {
      setStatus("completed");
      showMessage("Seluruh kru berhasil diselamatkan!", "success");
      return;
    }

    showMessage("Tidak ada objek yang bisa digunakan di dekatmu.", "error");
  }, [
    status,
    repairOpen,
    activeQuestion,
    collectedIds,
    generatorActive,
    rescueUnlocked,
    openCollectibleQuestion,
    showMessage,
  ]);

  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      if (status !== "playing" || repairOpen || activeQuestion) return;

      const current = positionRef.current;

      const next = {
        x: clamp(current.x + dx, 5, 95),
        y: clamp(current.y + dy, 8, 92),
      };

      setPosition(next);
    },
    [status, repairOpen, activeQuestion, setPosition],
  );

  // Memulai permainan dan membuat percobaan di Supabase.
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

      positionRef.current = INITIAL_PLAYER;
      setPlayer(INITIAL_PLAYER);

      setCollectedIds([]);
      setQuestionProgress({ 1: 0, 2: 0, 3: 0 });

      setGeneratorActive(false);
      setRepairOpen(false);
      setRescueUnlocked(false);

      closeQuestion();

      setRepairSelected(null);
      setRepairFeedback("");
      setRepairCorrect(null);

      setXP(0);
      setElapsed(0);

      setSaved(false);
      setSaveError("");

      finishStartedRef.current = false;
      interactionLockRef.current = false;

      setStatus("playing");

      showMessage(
        "Misi dimulai. Cari tiga komponen dan selesaikan seluruh tantangan!",
        "info",
      );
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Gagal memulai misi.",
      );
    } finally {
      setSaving(false);
    }
  }

  // Soal generator. Jawaban salah tidak menutup modal.
  const answerRepair = (index: number) => {
    setRepairSelected(index);

    if (index === REPAIR_QUESTION.answer) {
      setRepairCorrect(true);
      setRepairFeedback(`Benar! ${REPAIR_QUESTION.explanation}`);

      setGeneratorActive(true);
      setRescueUnlocked(true);

      setXP((previous) =>
        Math.min(GAME_CONFIG.maxXP, previous + GAME_CONFIG.generatorXP),
      );

      showMessage(
        `Generator berhasil diperbaiki! +${GAME_CONFIG.generatorXP} XP. Ruang penyelamatan terbuka.`,
        "success",
      );
    } else {
      setRepairCorrect(false);
      setRepairFeedback(`Belum tepat. ${REPAIR_QUESTION.explanation}`);

      showMessage(
        "Jawaban belum tepat. Coba kembali untuk memperbaiki generator.",
        "error",
      );
    }
  };

  const continueAfterRepair = () => {
    if (!repairCorrect) return;
    setRepairOpen(false);
    setRepairSelected(null);
    setRepairFeedback("");
    setRepairCorrect(null);
  };

  // Timer misi.
  useEffect(() => {
    if (status !== "playing" || repairOpen || activeQuestion) return;

    const interval = window.setInterval(() => {
      setElapsed((previous) => previous + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [status, repairOpen, activeQuestion]);

  // Kontrol keyboard.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();

      if (
        ["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)
      ) {
        event.preventDefault();
      }

      if (
        key === "escape" &&
        status === "playing" &&
        !repairOpen &&
        !activeQuestion
      ) {
        setStatus("paused");
        return;
      }

      if (key === "e") {
        interact();
        return;
      }

      if (status !== "playing" || repairOpen || activeQuestion) return;

      const step = event.shiftKey ? 4 : 2.5;

      if (key === "w" || key === "arrowup") movePlayer(0, -step);
      if (key === "s" || key === "arrowdown") movePlayer(0, step);
      if (key === "a" || key === "arrowleft") movePlayer(-step, 0);
      if (key === "d" || key === "arrowright") movePlayer(step, 0);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status, repairOpen, activeQuestion, interact, movePlayer]);

  // Menyimpan hasil misi ke Supabase satu kali.
  useEffect(() => {
    if (status !== "completed" || !attemptId || !userId) return;
    if (finishStartedRef.current) return;

    finishStartedRef.current = true;

    async function saveResult() {
      setSaving(true);
      setSaveError("");

      const finalXP = Math.min(GAME_CONFIG.maxXP, xp + GAME_CONFIG.rescueXP);

      const finalStars = calculateGameStars(finalXP);

      try {
        const { error } = await supabase
          .from("percobaan_aktivitas")
          .update({
            nilai: 100,
            jumlah_benar: totalAnswered + 1,
            jumlah_salah: 0,
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
            keterangan: "Reward Game Space Rescue",
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
        finishStartedRef.current = false;

        setSaveError(
          error instanceof Error
            ? error.message
            : "Gagal menyimpan hasil misi.",
        );
      } finally {
        setSaving(false);
      }
    }

    void saveResult();
  }, [status, attemptId, userId, xp, supabase, totalAnswered]);

  function resetGame() {
    positionRef.current = INITIAL_PLAYER;
    setPlayer(INITIAL_PLAYER);

    setCollectedIds([]);
    setQuestionProgress({ 1: 0, 2: 0, 3: 0 });

    setGeneratorActive(false);
    setRepairOpen(false);
    setRescueUnlocked(false);

    closeQuestion();

    setRepairSelected(null);
    setRepairFeedback("");
    setRepairCorrect(null);

    setXP(0);
    setElapsed(0);

    setAttemptId(null);
    setUserId(null);

    setSaved(false);
    setSaveError("");

    setMessage("Jelajahi stasiun dan kumpulkan komponen perbaikan.");
    setMessageType("info");

    setStatus("intro");

    finishStartedRef.current = false;
    interactionLockRef.current = false;
  }

  const finalXP = Math.min(GAME_CONFIG.maxXP, xp + GAME_CONFIG.rescueXP);

  // Halaman pembuka.
  if (status === "intro") {
    return (
      <GameContainer>
        <SpaceBackground />

        <div className="relative z-10 p-5 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl border border-cyan-400/20 bg-cyan-400/[.06] text-cyan-300">
              <Radio size={21} />
            </div>

            <div>
              <p className="text-sm font-black tracking-[.15em]">EDUQUEST</p>
              <p className="text-[9px] tracking-[.2em] text-white/35">
                SPACE RESCUE
              </p>
            </div>
          </div>

          <div className="mt-10 grid items-center gap-8 lg:grid-cols-2">
            <section>
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/[.05] px-3 py-1.5 text-[10px] font-bold text-cyan-300">
                MISSION 03 · EXPLORATION
              </span>

              <h1 className="mt-5 text-5xl font-black leading-tight sm:text-6xl">
                SPACE
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  RESCUE
                </span>
              </h1>

              <p className="mt-5 max-w-lg text-sm leading-7 text-white/50">
                Stasiun luar angkasa mengalami kerusakan. Jelajahi stasiun,
                kumpulkan komponen, jawab tantangan tentang tata surya, perbaiki
                generator, dan selamatkan kru.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-2">
                <IntroStat value="03" label="Components" />
                <IntroStat value="13" label="Questions" />
                <IntroStat value="01" label="Rescue" />
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[.025] p-4">
                <p className="mb-3 flex items-center gap-2 text-xs font-bold text-cyan-300">
                  <Keyboard size={15} />
                  GAME CONTROLS
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs text-white/50">
                  <p>WASD / Arrow — Bergerak</p>
                  <p>E — Interaksi</p>
                  <p>Shift — Bergerak cepat</p>
                  <p>Esc — Pause</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-cyan-400/10 bg-cyan-400/[.03] p-3">
                <p className="text-xs leading-6 text-cyan-200/70">
                  💡 Selesaikan seluruh soal pada setiap komponen sebelum bisa
                  mengambilnya. Jawaban salah harus dicoba kembali.
                </p>
              </div>

              {saveError && (
                <p className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/[.05] p-3 text-sm text-rose-300">
                  {saveError}
                </p>
              )}

              <button
                onClick={startGame}
                disabled={saving}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-cyan-950/30 hover:brightness-110 disabled:opacity-50 sm:w-auto"
              >
                {saving ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Preparing Mission...
                  </>
                ) : (
                  <>
                    <Play size={17} />
                    START MISSION
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </section>

            <section className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-3xl border border-cyan-400/10 bg-[#101D2D]">
              <div className="absolute h-64 w-64 rounded-full bg-cyan-400/[.08] blur-[80px]" />

              <div className="relative text-center">
                <div className="text-8xl drop-shadow-[0_0_35px_rgba(34,211,238,.5)]">
                  🧑‍🚀
                </div>

                <p className="mt-5 text-xs font-bold tracking-[.2em] text-cyan-300">
                  ASTRONAUT READY
                </p>

                <p className="mt-2 text-[10px] text-white/35">
                  Your crew needs you.
                </p>
              </div>
            </section>
          </div>
        </div>
      </GameContainer>
    );
  }

  // Halaman hasil permainan.
  if (status === "completed") {
    return (
      <GameContainer>
        <SpaceBackground />

        <div className="relative z-10 mx-auto max-w-xl p-5 text-center sm:p-8">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-emerald-400/20 bg-emerald-400/[.06] text-emerald-300">
            <Trophy size={30} />
          </div>

          <p className="mt-5 text-[10px] font-bold uppercase tracking-[.2em] text-emerald-300">
            Mission Completed
          </p>

          <h1 className="mt-2 text-4xl font-black">Crew Rescued!</h1>

          <p className="mt-3 text-sm leading-6 text-white/45">
            Kamu berhasil memperbaiki generator dan menyelamatkan seluruh kru
            stasiun luar angkasa.
          </p>

          <div className="mt-7">
            <RewardPanel xp={finalXP} stars={calculateGameStars(finalXP)} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <IntroStat value={`${collected}/3`} label="Components" />

            <IntroStat
              value={`${Math.floor(elapsed / 60)
                .toString()
                .padStart(2, "0")}:${(elapsed % 60)
                .toString()
                .padStart(2, "0")}`}
              label="Mission Time"
            />
          </div>

          <div className="mt-3 rounded-xl border border-white/10 bg-white/[.025] p-3">
            <p className="text-xs text-white/50">
              Soal komponen selesai: {totalAnswered}/{totalCollectibleQuestions}
            </p>
          </div>

          {saving && (
            <p className="mt-4 text-xs text-white/50">
              Menyimpan hasil permainan...
            </p>
          )}

          {saved && (
            <p className="mt-4 text-xs text-emerald-300">
              ✓ XP dan bintang berhasil disimpan.
            </p>
          )}

          {saveError && (
            <p className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/[.05] p-3 text-sm text-rose-300">
              {saveError}
            </p>
          )}

          <button
            onClick={resetGame}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3.5 text-sm font-bold"
          >
            <RotateCcw size={16} />
            Main Lagi
          </button>
        </div>
      </GameContainer>
    );
  }

  // Tampilan permainan utama.
  return (
    <GameContainer>
      <SpaceBackground />

      <div className="relative z-10 space-y-4 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-cyan-300">
              Mission 03
            </p>
            <h1 className="mt-1 text-xl font-black">Space Rescue</h1>
          </div>

          <button
            onClick={() =>
              setStatus(status === "paused" ? "playing" : "paused")
            }
            disabled={Boolean(activeQuestion) || repairOpen}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-4 py-2.5 text-xs font-bold text-white/70 disabled:opacity-30"
          >
            {status === "paused" ? <Play size={15} /> : <Pause size={15} />}
            {status === "paused" ? "Resume" : "Pause"}
          </button>
        </div>

        <RescueHUD
          xp={xp}
          collected={collected}
          generatorActive={generatorActive}
          elapsed={elapsed}
          answeredQuestions={totalAnswered}
          totalQuestions={totalCollectibleQuestions}
        />

        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <section>
            <StationMap
              player={player}
              collectibles={COLLECTIBLES}
              collectedIds={collectedIds}
              generatorActive={generatorActive}
              rescueUnlocked={rescueUnlocked}
              nearby={status === "playing" ? nearby : null}
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/[.07] bg-white/[.025] p-3">
              <p className="text-xs text-white/45">{message}</p>

              <span
                className={`text-[10px] font-bold uppercase ${
                  messageType === "success"
                    ? "text-emerald-300"
                    : messageType === "error"
                      ? "text-rose-300"
                      : "text-cyan-300"
                }`}
              >
                {messageType}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                onClick={() => movePlayer(0, -5)}
                disabled={
                  status !== "playing" || Boolean(activeQuestion) || repairOpen
                }
                className="rounded-xl border border-white/10 bg-white/[.04] p-3 text-xs font-bold disabled:opacity-30"
              >
                ↑
              </button>

              <button
                onClick={interact}
                disabled={
                  status !== "playing" || Boolean(activeQuestion) || repairOpen
                }
                className="rounded-xl border border-cyan-400/20 bg-cyan-400/[.08] p-3 text-xs font-bold text-cyan-300 disabled:opacity-30"
              >
                E · INTERACT
              </button>

              <button
                onClick={() => movePlayer(0, 5)}
                disabled={
                  status !== "playing" || Boolean(activeQuestion) || repairOpen
                }
                className="rounded-xl border border-white/10 bg-white/[.04] p-3 text-xs font-bold disabled:opacity-30"
              >
                ↓
              </button>

              <button
                onClick={() => movePlayer(-5, 0)}
                disabled={
                  status !== "playing" || Boolean(activeQuestion) || repairOpen
                }
                className="rounded-xl border border-white/10 bg-white/[.04] p-3 text-xs font-bold disabled:opacity-30"
              >
                ← LEFT
              </button>

              <div className="grid place-items-center rounded-xl border border-white/5 bg-white/[.02] text-[10px] text-white/30">
                MOVE
              </div>

              <button
                onClick={() => movePlayer(5, 0)}
                disabled={
                  status !== "playing" || Boolean(activeQuestion) || repairOpen
                }
                className="rounded-xl border border-white/10 bg-white/[.04] p-3 text-xs font-bold disabled:opacity-30"
              >
                RIGHT →
              </button>
            </div>
          </section>

          <aside className="space-y-3">
            <MissionPanel
              collected={collected}
              generatorActive={generatorActive}
              rescueUnlocked={rescueUnlocked}
              questionProgress={questionProgress}
              collectibles={COLLECTIBLES}
              totalQuestions={totalCollectibleQuestions}
            />

            <div className="rounded-2xl border border-white/[.07] bg-white/[.025] p-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[.18em] text-white/40">
                Inventory
              </p>

              <div className="space-y-2">
                {COLLECTIBLES.map((item) => {
                  const hasItem = collectedIds.includes(item.id);
                  const progress = questionProgress[item.id] ?? 0;
                  const total = COLLECTIBLE_QUESTIONS[item.id]?.length ?? 0;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-xl bg-white/[.03] p-2.5"
                    >
                      <span className="text-xl">{item.icon}</span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold">
                          {item.name}
                        </p>
                        <p className="text-[9px] text-white/35">
                          {hasItem ? "Collected" : `Quiz ${progress}/${total}`}
                        </p>
                      </div>

                      {hasItem && (
                        <Check size={15} className="text-emerald-300" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[.03] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                Field Guide
              </p>

              <p className="mt-2 text-xs leading-6 text-white/45">
                Dekati komponen dan tekan E. Jawab semua soal dengan benar
                sebelum komponen masuk inventory. Setelah tiga komponen
                terkumpul, perbaiki generator dan selamatkan kru.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Modal pause */}
      {status === "paused" && (
        <div className="absolute inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111827] p-6 text-center">
            <Pause className="mx-auto text-cyan-300" size={32} />
            <h2 className="mt-3 text-xl font-black">Mission Paused</h2>
            <p className="mt-2 text-sm text-white/45">
              Misi dihentikan sementara.
            </p>

            <button
              onClick={() => setStatus("playing")}
              className="mt-5 w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-bold text-slate-950"
            >
              Resume Mission
            </button>
          </div>
        </div>
      )}

      {/* Modal soal komponen */}
      {activeQuestion && (
        <div className="absolute inset-0 z-[60] grid place-items-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-lg rounded-2xl border border-cyan-400/20 bg-[#111827] p-5 shadow-2xl shadow-cyan-950/30 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-lg bg-cyan-400/10 px-3 py-1.5 text-[10px] font-bold tracking-wider text-cyan-300">
                SOLAR SYSTEM CHALLENGE
              </span>

              <button
                onClick={closeQuestion}
                className="rounded-lg p-1 text-white/40 transition hover:bg-white/5 hover:text-white"
                aria-label="Tutup soal"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl border border-cyan-400/15 bg-cyan-400/[.06] text-2xl">
                {
                  COLLECTIBLES.find(
                    (item) => item.id === activeQuestion.collectibleId,
                  )?.icon
                }
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white">
                  {
                    COLLECTIBLES.find(
                      (item) => item.id === activeQuestion.collectibleId,
                    )?.name
                  }
                </p>

                <p className="mt-1 text-[10px] text-white/40">
                  Soal {activeQuestion.questionNumber} dari{" "}
                  {activeQuestion.totalQuestions}
                </p>
              </div>

              <span className="text-xs font-black text-cyan-300">
                {activeQuestion.questionNumber}/{activeQuestion.totalQuestions}
              </span>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all"
                style={{
                  width: `${
                    (activeQuestion.questionNumber /
                      activeQuestion.totalQuestions) *
                    100
                  }%`,
                }}
              />
            </div>

            <div className="mt-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                Question
              </p>

              <h2 className="mt-2 text-lg font-bold leading-7 text-white">
                {activeQuestion.question.question}
              </h2>
            </div>

            <div className="mt-5 space-y-2">
              {activeQuestion.question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectOption =
                  answerCorrect === true &&
                  index === activeQuestion.question.answer;

                return (
                  <button
                    key={option}
                    onClick={() => answerCollectibleQuestion(index)}
                    disabled={answerCorrect === true}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition ${
                      isCorrectOption
                        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                        : isSelected && answerCorrect === false
                          ? "border-rose-400/40 bg-rose-400/10 text-rose-200"
                          : "border-white/10 bg-white/[.03] text-white/75 hover:border-cyan-400/30 hover:bg-cyan-400/[.05]"
                    }`}
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white/5 text-[10px] font-bold text-cyan-300">
                      {String.fromCharCode(65 + index)}
                    </span>

                    <span className="flex-1 pt-0.5">{option}</span>

                    {isCorrectOption && (
                      <Check size={17} className="shrink-0 text-emerald-300" />
                    )}
                  </button>
                );
              })}
            </div>

            {answerFeedback && (
              <div
                className={`mt-5 rounded-xl border p-4 ${
                  answerCorrect
                    ? "border-emerald-400/20 bg-emerald-400/[.06]"
                    : "border-rose-400/20 bg-rose-400/[.06]"
                }`}
              >
                <p
                  className={`text-xs font-bold ${
                    answerCorrect ? "text-emerald-300" : "text-rose-300"
                  }`}
                >
                  {answerCorrect ? "✓ Jawaban benar!" : "✕ Jawaban belum tepat"}
                </p>

                <p className="mt-2 text-xs leading-6 text-white/65">
                  {answerFeedback}
                </p>
              </div>
            )}

            {answerCorrect === true && (
              <button
                onClick={continueAfterCorrectAnswer}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3.5 text-sm font-black text-white transition hover:brightness-110"
              >
                {activeQuestion.questionNumber === activeQuestion.totalQuestions
                  ? "Ambil Komponen"
                  : "Lanjut Soal Berikutnya"}
                <ArrowRight size={17} />
              </button>
            )}

            {answerCorrect === false && (
              <button
                onClick={() => {
                  setSelectedAnswer(null);
                  setAnswerFeedback("");
                  setAnswerCorrect(null);
                }}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-400"
              >
                Coba Jawab Lagi
                <ArrowRight size={17} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal perbaikan generator */}
      {repairOpen && (
        <div className="absolute inset-0 z-[60] grid place-items-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-lg rounded-2xl border border-cyan-400/20 bg-[#111827] p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-cyan-400/10 px-3 py-1.5 text-[10px] font-bold text-cyan-300">
                GENERATOR REPAIR
              </span>

              <button
                onClick={() => {
                  if (!repairCorrect) setRepairOpen(false);
                }}
                disabled={repairCorrect === true}
                className="text-white/40 hover:text-white disabled:opacity-30"
                aria-label="Tutup soal generator"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-5 text-center text-4xl">⚡</div>

            <h2 className="mt-3 text-center text-xl font-black">
              Perbaiki Generator
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/50">
              {REPAIR_QUESTION.question}
            </p>

            <div className="mt-5 space-y-2">
              {REPAIR_QUESTION.options.map((option, index) => (
                <button
                  key={option}
                  onClick={() => answerRepair(index)}
                  disabled={repairCorrect === true}
                  className={`w-full rounded-xl border p-3 text-left text-sm transition disabled:cursor-not-allowed ${
                    repairSelected === index && repairCorrect
                      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                      : repairSelected === index && repairCorrect === false
                        ? "border-rose-400/40 bg-rose-400/10 text-rose-200"
                        : "border-white/10 bg-white/[.03] hover:border-cyan-400/30 hover:bg-cyan-400/[.05]"
                  }`}
                >
                  <span className="mr-3 font-bold text-cyan-300">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>

            {repairFeedback && (
              <div
                className={`mt-5 rounded-xl border p-4 ${
                  repairCorrect
                    ? "border-emerald-400/20 bg-emerald-400/[.06]"
                    : "border-rose-400/20 bg-rose-400/[.06]"
                }`}
              >
                <p
                  className={`text-xs font-bold ${
                    repairCorrect ? "text-emerald-300" : "text-rose-300"
                  }`}
                >
                  {repairCorrect
                    ? "✓ Generator berhasil diperbaiki!"
                    : "✕ Jawaban belum tepat"}
                </p>

                <p className="mt-2 text-xs leading-6 text-white/65">
                  {repairFeedback}
                </p>
              </div>
            )}

            {repairCorrect && (
              <button
                onClick={continueAfterRepair}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3.5 text-sm font-black text-white"
              >
                Lanjutkan Misi
                <Check size={17} />
              </button>
            )}

            {repairCorrect === false && (
              <button
                onClick={() => {
                  setRepairSelected(null);
                  setRepairFeedback("");
                  setRepairCorrect(null);
                }}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3.5 text-sm font-bold text-slate-950"
              >
                Coba Jawab Lagi
                <ArrowRight size={17} />
              </button>
            )}
          </div>
        </div>
      )}
    </GameContainer>
  );
}

function IntroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[.025] p-3">
      <p className="text-xl font-black">{value}</p>
      <p className="mt-1 text-[9px] uppercase tracking-wider text-white/40">
        {label}
      </p>
    </div>
  );
}

function distance(a: Point, b: Point) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
