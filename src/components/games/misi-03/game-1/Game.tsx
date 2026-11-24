"use client";

import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Rocket,
  Star,
  Sparkles,
  Trophy,
  RotateCcw,
  Loader2,
  Zap,
  Gem,
  Heart,
  Shield,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

import {
  PLANETS,
  PLANET_QUESTIONS,
  GAME_CONFIG,
  calculateGameXP,
  calculateGameStars,
  GAME_ACTIVITY_ID,
} from "./GameData";

import {
  GameContainer,
  SpaceBackground,
  RewardPreview,
  PlanetCard,
  GameBrand,
  GameHUD,
  MissionScene,
} from "./GameComponents";

export default function Game() {
  const supabase = createClient();

  const [started, setStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [finished, setFinished] = useState(false);

  // GAME MECHANICS
  const [health, setHealth] = useState(GAME_CONFIG.maxHealth);
  const [energy, setEnergy] = useState(0);
  const [crystals, setCrystals] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [feedbackCorrect, setFeedbackCorrect] = useState<boolean | null>(null);

  // SUPABASE
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  const questions = PLANET_QUESTIONS;
  const currentQuestion = questions[questionIndex];
  const currentPlanet = PLANETS[questionIndex];

  const xp = calculateGameXP(correctAnswers);
  const stars = calculateGameStars(correctAnswers);

  // START GAME
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

      // Reset mechanics
      setHealth(GAME_CONFIG.maxHealth);
      setEnergy(0);
      setCrystals(0);
      setCombo(0);
      setBestCombo(0);
      setCorrectAnswers(0);
      setAnsweredCount(0);
      setQuestionIndex(0);
      setSelectedAnswer(null);
      setFeedbackCorrect(null);
      setFinished(false);
      setSaved(false);

      setStarted(true);
    } catch (error) {
      console.error("Start game error:", error);
      setSaveError(
        error instanceof Error ? error.message : "Gagal memulai permainan.",
      );
    } finally {
      setSaving(false);
    }
  }

  // ANSWER MECHANICS
  function answerQuestion(index: number) {
    if (selectedAnswer !== null || finished) return;

    setSelectedAnswer(index);
    setAnsweredCount((prev) => prev + 1);

    const correct = index === currentQuestion.answer;
    setFeedbackCorrect(correct);

    if (correct) {
      const nextCombo = combo + 1;

      setCorrectAnswers((prev) => prev + 1);
      setCombo(nextCombo);
      setBestCombo((prev) => Math.max(prev, nextCombo));
      setCrystals((prev) => prev + GAME_CONFIG.crystalPerCorrect);
      setEnergy((prev) => Math.min(100, prev + GAME_CONFIG.energyPerCorrect));
    } else {
      setHealth((prev) => Math.max(0, prev - 1));
      setEnergy((prev) => Math.max(0, prev - 10));
      setCombo(0);
    }
  }

  // FINISH GAME
  async function finishGame(
    finalCorrect = correctAnswers,
    finalAnswered = answeredCount,
  ) {
    if (!attemptId || saved || saving) return;

    const finalWrong = finalAnswered - finalCorrect;
    const finalScore =
      finalAnswered > 0 ? Math.round((finalCorrect / finalAnswered) * 100) : 0;

    const finalXP = calculateGameXP(finalCorrect);
    const finalStars = calculateGameStars(finalCorrect);

    setSaving(true);
    setSaveError("");

    try {
      const { error: attemptError } = await supabase
        .from("percobaan_aktivitas")
        .update({
          nilai: finalScore,
          jumlah_benar: finalCorrect,
          jumlah_salah: finalWrong,
          xp_diperoleh: finalXP,
          status: "selesai",
          selesai_at: new Date().toISOString(),
          reward_claimed: true,
        })
        .eq("id", attemptId)
        .eq("reward_claimed", false);

      if (attemptError) throw attemptError;

      if (finalXP > 0 && userId) {
        const { error: xpError } = await supabase.from("riwayat_xp").insert({
          user_id: userId,
          percobaan_id: attemptId,
          jumlah_xp: finalXP,
          keterangan: "Reward Game Planet Explorer",
        });

        if (xpError) throw xpError;
      }

      if (finalStars > 0 && userId) {
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
      setFinished(true);
    } catch (error) {
      console.error("Finish game error:", error);
      setSaveError(
        error instanceof Error ? error.message : "Gagal menyimpan hasil game.",
      );
    } finally {
      setSaving(false);
    }
  }

  // NEXT STAGE
  function nextQuestion() {
    if (selectedAnswer === null || saving) return;

    // HP habis = game over
    if (health <= 0) {
      finishGame(correctAnswers, answeredCount);
      return;
    }

    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setFeedbackCorrect(null);
    } else {
      finishGame(correctAnswers, answeredCount);
    }
  }

  // RESET
  function resetGame() {
    setStarted(false);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setCorrectAnswers(0);
    setAnsweredCount(0);
    setFinished(false);

    setHealth(GAME_CONFIG.maxHealth);
    setEnergy(0);
    setCrystals(0);
    setCombo(0);
    setBestCombo(0);
    setFeedbackCorrect(null);

    setAttemptId(null);
    setUserId(null);
    setSaving(false);
    setSaveError("");
    setSaved(false);
  }

  // RESULT SCREEN
  if (finished) {
    const finalScore =
      answeredCount > 0
        ? Math.round((correctAnswers / answeredCount) * 100)
        : 0;

    const missionRank =
      finalScore >= 90
        ? "S"
        : finalScore >= 75
          ? "A"
          : finalScore >= 50
            ? "B"
            : "C";

    return (
      <GameContainer>
        <SpaceBackground />

        <div className="relative z-10 mx-auto w-full max-w-xl p-5 text-center sm:p-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-400/20 bg-amber-400/10">
            <Trophy size={36} className="text-amber-400" />
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
            Mission Completed
          </p>

          <h1 className="mt-2 text-3xl font-black">
            {health <= 0 ? "Mission Over!" : "Planet Explorer!"}
          </h1>

          <p className="mt-2 text-sm text-white/45">
            {health <= 0
              ? "Nyawamu habis. Perjalanan eksplorasi terhenti."
              : "Kamu berhasil menyelesaikan perjalanan tata surya."}
          </p>

          {/* RANK */}
          <div className="mx-auto mt-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-400/10 to-orange-500/5">
            <span className="text-5xl font-black text-amber-300">
              {missionRank}
            </span>
          </div>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-white/40">
            Mission Rank
          </p>

          {/* STARS */}
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  index < stars
                    ? "bg-amber-400/10 text-amber-400"
                    : "bg-white/5 text-white/20"
                }`}
              >
                <Star
                  size={24}
                  fill={index < stars ? "currentColor" : "none"}
                />
              </div>
            ))}
          </div>

          {/* REWARDS */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.04] p-4">
              <Sparkles className="mx-auto text-amber-400" size={20} />
              <p className="mt-2 text-xl font-black">+{xp}</p>
              <p className="text-[10px] text-white/40">XP</p>
            </div>

            <div className="rounded-2xl border border-yellow-400/10 bg-yellow-400/[0.04] p-4">
              <Star className="mx-auto text-yellow-400" size={20} />
              <p className="mt-2 text-xl font-black">{stars}/3</p>
              <p className="text-[10px] text-white/40">Stars</p>
            </div>

            <div className="rounded-2xl border border-fuchsia-400/10 bg-fuchsia-400/[0.04] p-4">
              <Gem className="mx-auto text-fuchsia-400" size={20} />
              <p className="mt-2 text-xl font-black">{crystals}</p>
              <p className="text-[10px] text-white/40">Crystals</p>
            </div>

            <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] p-4">
              <Zap className="mx-auto text-cyan-400" size={20} />
              <p className="mt-2 text-xl font-black">{bestCombo}×</p>
              <p className="text-[10px] text-white/40">Best Combo</p>
            </div>
          </div>

          {/* SCORE */}
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-white/40">
              Mission Score
            </p>
            <p className="mt-2 text-4xl font-black">
              {correctAnswers}/{answeredCount}
            </p>
            <p className="mt-1 text-sm text-white/40">Jawaban benar</p>

            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all"
                style={{ width: `${finalScore}%` }}
              />
            </div>

            <div className="mt-3 flex justify-between text-xs">
              <span className="text-emerald-300">✓ {correctAnswers} benar</span>
              <span className="text-rose-300">
                ✕ {answeredCount - correctAnswers} salah
              </span>
            </div>
          </div>

          {saved && (
            <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3 text-sm text-emerald-300">
              <Check size={16} className="mr-2 inline" />
              XP dan bintang berhasil disimpan.
            </div>
          )}

          {saveError && (
            <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-300">
              {saveError}
            </div>
          )}

          <button
            onClick={resetGame}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-bold transition hover:bg-white/10"
          >
            <RotateCcw size={16} />
            Main Lagi
          </button>
        </div>
      </GameContainer>
    );
  }

  // LOBBY
  if (!started) {
    return (
      <GameContainer>
        <SpaceBackground />

        <div className="relative z-10 p-5 sm:p-7 lg:p-8">
          <div className="flex items-center justify-between">
            <GameBrand />
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-xs text-cyan-300">
              MISSION 03
            </span>
          </div>

          <div className="mt-8 grid items-center gap-8 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs text-blue-300">
                <Sparkles size={14} />
                SPACE ARCADE MISSION
              </div>

              <h1 className="mt-5 text-4xl font-black leading-tight sm:text-6xl">
                Planet
                <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Explorer
                </span>
              </h1>

              <p className="mt-4 max-w-lg text-sm leading-7 text-white/50">
                Jadilah astronaut, jelajahi planet, kumpulkan crystal,
                pertahankan nyawamu, dan isi energi untuk membuka portal
                galaksi.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {["8 Planet", "3 Lives", "Energy System", "Crystal Hunt"].map(
                  (label) => (
                    <span
                      key={label}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60"
                    >
                      {label}
                    </span>
                  ),
                )}
              </div>

              <div className="mt-6 max-w-sm">
                <RewardPreview xp={160} stars={3} />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-red-400/10 bg-red-400/[0.04] p-3 text-center">
                  <Heart size={17} className="mx-auto text-red-400" />
                  <p className="mt-1 text-xs font-bold">3 Lives</p>
                </div>
                <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/[0.04] p-3 text-center">
                  <Zap size={17} className="mx-auto text-cyan-400" />
                  <p className="mt-1 text-xs font-bold">Energy</p>
                </div>
                <div className="rounded-xl border border-fuchsia-400/10 bg-fuchsia-400/[0.04] p-3 text-center">
                  <Gem size={17} className="mx-auto text-fuchsia-400" />
                  <p className="mt-1 text-xs font-bold">Crystal</p>
                </div>
              </div>

              {saveError && (
                <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-300">
                  {saveError}
                </div>
              )}

              <button
                onClick={startGame}
                disabled={saving}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-sm font-bold shadow-lg shadow-blue-900/20 transition hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 sm:w-auto"
              >
                {saving ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Preparing Mission...
                  </>
                ) : (
                  <>
                    <Rocket size={18} />
                    Mulai Petualangan
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </div>

            {/* SOLAR SYSTEM */}
            <div className="relative flex min-h-[350px] items-center justify-center">
              <div className="absolute h-64 w-64 rounded-full bg-blue-500/10 blur-[90px]" />
              <div className="absolute h-72 w-72 rounded-full border border-white/[0.06]" />
              <div className="absolute h-56 w-56 rounded-full border border-white/[0.07]" />
              <div className="absolute h-40 w-40 rounded-full border border-white/[0.08]" />

              <div className="relative flex h-28 w-28 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 via-blue-500 to-indigo-950 shadow-[0_0_60px_rgba(59,130,246,0.3)]">
                <span className="text-5xl">🌎</span>
              </div>

              {PLANETS.map((planet, index) => {
                const positions = [
                  "top-6 left-1/2 -translate-x-1/2",
                  "right-10 top-16",
                  "right-5 bottom-16",
                  "bottom-5 left-1/2 -translate-x-1/2",
                  "bottom-12 left-10",
                  "left-5 top-1/2 -translate-y-1/2",
                  "left-12 top-12",
                  "right-12 bottom-12",
                ];

                return (
                  <div
                    key={planet.name}
                    className={`absolute ${positions[index]} flex h-9 w-9 animate-pulse items-center justify-center rounded-full`}
                    style={{
                      background: `radial-gradient(circle at 30% 30%, white, ${planet.color}, #111827)`,
                      boxShadow: `0 0 20px ${planet.color}30`,
                    }}
                    title={planet.label}
                  >
                    <span className="text-xs">{planet.emoji}</span>
                  </div>
                );
              })}

              <div className="absolute bottom-2 flex items-center gap-2 text-xs text-white/30">
                <Rocket size={13} />
                Your galaxy awaits
              </div>
            </div>
          </div>
        </div>
      </GameContainer>
    );
  }

  // GAMEPLAY
  return (
    <GameContainer>
      <SpaceBackground />

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* TOP BAR */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              setStarted(false);
              setQuestionIndex(0);
              setCorrectAnswers(0);
              setAnsweredCount(0);
              setSelectedAnswer(null);
              setHealth(GAME_CONFIG.maxHealth);
              setEnergy(0);
              setCrystals(0);
              setCombo(0);
              setBestCombo(0);
              setFeedbackCorrect(null);
            }}
            className="inline-flex items-center gap-2 text-xs text-white/40 transition hover:text-white"
          >
            <ArrowLeft size={15} />
            Exit Mission
          </button>

          <div className="flex items-center gap-2 rounded-full border border-blue-400/10 bg-blue-400/[0.04] px-3 py-1.5">
            <Rocket size={13} className="text-blue-400" />
            <span className="text-[10px] font-bold tracking-wider text-blue-300">
              SPACE MISSION
            </span>
          </div>
        </div>

        {/* MISSION HEADER */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
              Sector {String(questionIndex + 1).padStart(2, "0")}
            </p>
            <h1 className="mt-1 text-xl font-black sm:text-2xl">
              {currentPlanet.label}
            </h1>
          </div>

          <div className="rounded-xl border border-amber-400/10 bg-amber-400/[0.04] px-3 py-2 text-sm font-bold text-amber-300">
            <Sparkles size={14} className="mr-1 inline" />
            {xp} XP
          </div>
        </div>

        {/* HUD */}
        <GameHUD
          health={health}
          maxHealth={GAME_CONFIG.maxHealth}
          energy={energy}
          crystals={crystals}
          combo={combo}
        />

        {/* SCENE */}
        <div className="mt-4">
          <MissionScene
            planet={currentPlanet}
            questionNumber={questionIndex + 1}
            totalQuestions={questions.length}
            isCorrect={feedbackCorrect}
            combo={combo}
            energy={energy}
          />
        </div>

        {/* PLANET ROUTE */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">
              Galactic Route
            </p>
            <p className="text-[10px] text-white/35">
              {questionIndex + 1} / {questions.length} planets
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {PLANETS.map((planet, index) => (
              <PlanetCard
                key={planet.name}
                name={planet.label}
                emoji={planet.emoji}
                color={planet.color}
                active={index === questionIndex}
                completed={index < questionIndex}
              />
            ))}
          </div>
        </div>

        {/* QUESTION */}
        <div className="mt-5 rounded-2xl border border-white/10 bg-[#11182B]/80 p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-lg bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-300">
              Mission Challenge
            </span>
            {combo >= 3 && (
              <span className="animate-pulse rounded-lg bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold text-amber-300">
                🔥 COMBO BONUS
              </span>
            )}
          </div>

          <h2 className="text-lg font-bold leading-7 sm:text-xl">
            {currentQuestion.question}
          </h2>

          {/* OPTIONS */}
          <div className="mt-4 space-y-2.5">
            {currentQuestion.options.map((option, index) => {
              const selected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.answer;
              const showFeedback = selectedAnswer !== null;

              let optionStyle =
                "border-white/10 bg-white/[0.025] hover:border-blue-400/30 hover:bg-blue-400/[0.05]";

              if (showFeedback && isCorrect) {
                optionStyle = "border-emerald-400/40 bg-emerald-400/[0.08]";
              } else if (showFeedback && selected) {
                optionStyle = "border-rose-400/40 bg-rose-400/[0.08]";
              }

              return (
                <button
                  key={index}
                  disabled={showFeedback}
                  onClick={() => answerQuestion(index)}
                  className={`group flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-300 ${optionStyle} ${
                    !showFeedback ? "hover:translate-x-1" : ""
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      showFeedback && isCorrect
                        ? "bg-emerald-400/10 text-emerald-300"
                        : showFeedback && selected
                          ? "bg-rose-400/10 text-rose-300"
                          : "bg-white/5 text-white/40"
                    }`}
                  >
                    {showFeedback && isCorrect ? (
                      <Check size={16} />
                    ) : showFeedback && selected ? (
                      <X size={16} />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </span>

                  <span className="flex-1 text-sm font-medium">{option}</span>

                  {!showFeedback && (
                    <ArrowRight
                      size={15}
                      className="text-white/15 transition group-hover:text-blue-300"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* FEEDBACK */}
        {selectedAnswer !== null && (
          <div
            className={`mt-4 rounded-2xl border p-4 transition-all ${
              feedbackCorrect
                ? "border-emerald-400/20 bg-emerald-400/[0.04]"
                : "border-rose-400/20 bg-rose-400/[0.04]"
            }`}
          >
            <div className="flex items-center gap-2">
              {feedbackCorrect ? (
                <>
                  <Sparkles size={17} className="text-emerald-300" />
                  <p className="text-sm font-bold text-emerald-300">
                    +1 Crystal · Energy Boost!
                  </p>
                </>
              ) : (
                <>
                  <Heart size={17} className="text-rose-300" />
                  <p className="text-sm font-bold text-rose-300">
                    -1 Life · System Damaged!
                  </p>
                </>
              )}
            </div>

            <p className="mt-2 text-sm leading-6 text-white/50">
              {currentQuestion.explanation}
            </p>

            {feedbackCorrect && combo >= 3 && (
              <div className="mt-3 rounded-lg border border-amber-400/20 bg-amber-400/[0.05] p-2.5 text-xs font-bold text-amber-300">
                🔥 {combo} Combo! Pertahankan streak untuk bonus!
              </div>
            )}

            {energy >= 100 && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-cyan-400/[0.05] p-2.5 text-xs font-bold text-cyan-300">
                <Shield size={14} />
                PORTAL CHARGED — Energy penuh!
              </div>
            )}

            {health <= 0 && (
              <div className="mt-3 rounded-lg border border-rose-400/20 bg-rose-400/[0.05] p-2.5 text-xs font-bold text-rose-300">
                ☄️ Semua nyawa habis! Misi akan berakhir.
              </div>
            )}
          </div>
        )}

        {/* ACTION */}
        <button
          disabled={selectedAnswer === null || saving}
          onClick={nextQuestion}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-sm font-bold shadow-lg shadow-blue-950/20 transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving Mission...
            </>
          ) : health <= 0 ? (
            <>
              <Trophy size={16} />
              Mission Over
            </>
          ) : questionIndex === questions.length - 1 ? (
            <>
              Finish Mission
              <Trophy size={16} />
            </>
          ) : energy >= 100 ? (
            <>
              Activate Portal
              <Zap size={16} />
            </>
          ) : (
            <>
              Explore Next Planet
              <ArrowRight size={16} />
            </>
          )}
        </button>

        {saveError && (
          <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/[0.04] p-4 text-sm text-red-300">
            {saveError}
          </div>
        )}
      </div>
    </GameContainer>
  );
}
