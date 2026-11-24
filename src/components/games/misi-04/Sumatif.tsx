"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Loader2,
  Send,
  Trophy,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AnswerOption, InfoCard, ResultSummary } from "./SumatifComponents";

type PilihanJawaban = {
  id: number;
  label: string;
  teks_jawaban: string;
};

type SumatifQuestion = {
  id: number;
  materi_id: number;
  pertanyaan: string;
  materi?: {
    judul: string;
    urutan: number;
  } | null;
  pilihan_jawaban: PilihanJawaban[];
};

type Props = {
  questions: SumatifQuestion[];
  aktivitasId: number;
};

type ResultData = {
  score: number;
  correct: number;
  incorrect: number;
  total: number;
  xp: number;
  stars: number;
  rewardClaimed: boolean;
};

type PageMode = "intro" | "exam" | "result";

const getReward = (score: number) => {
  let xp = 10;
  let stars = 0;

  if (score >= 90) {
    xp = 60;
    stars = 3;
  } else if (score >= 80) {
    xp = 50;
    stars = 2;
  } else if (score >= 75) {
    xp = 40;
    stars = 2;
  } else if (score >= 70) {
    xp = 40;
    stars = 1;
  } else if (score >= 60) {
    xp = 30;
    stars = 1;
  } else if (score >= 50) {
    xp = 20;
  }

  return { xp, stars };
};

export default function Sumatif({ questions, aktivitasId }: Props) {
  const supabase = useMemo(() => createClient(), []);

  const [mode, setMode] = useState<PageMode>("intro");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<ResultData | null>(null);
  const [startedAt, setStartedAt] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;
  const progress =
    questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  const handleStart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
    setErrorMessage("");
    setStartedAt(new Date().toISOString());
    setMode("exam");
  };

  const handleSelectAnswer = (questionId: number, optionId: number) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Sesi login tidak ditemukan. Silakan login kembali.");
      }

      if (answeredCount !== questions.length) {
        throw new Error("Masih ada soal yang belum dijawab.");
      }

      const { data: answerKeys, error: keyError } = await supabase
        .from("kunci_jawaban")
        .select("soal_id, pilihan_id")
        .in(
          "soal_id",
          questions.map((question) => question.id),
        );

      if (keyError) throw keyError;

      const answerKeyMap = new Map<number, number>(
        (answerKeys ?? []).map((item) => [
          Number(item.soal_id),
          Number(item.pilihan_id),
        ]),
      );

      if (answerKeyMap.size !== questions.length) {
        throw new Error(
          "Kunci jawaban belum lengkap. Silakan hubungi pengelola.",
        );
      }

      let correct = 0;

      const answerRows = questions.map((question) => {
        const selectedOption = answers[question.id];
        const correctOption = answerKeyMap.get(question.id);
        const isCorrect = selectedOption === correctOption;

        if (isCorrect) correct++;

        return {
          soal_id: question.id,
          pilihan_id: selectedOption,
          benar: isCorrect,
        };
      });

      const incorrect = questions.length - correct;
      const score =
        questions.length > 0
          ? Math.round((correct / questions.length) * 100)
          : 0;

      const reward = getReward(score);

      // Cek apakah peserta sudah pernah mendapatkan reward Sumatif.
      const { data: previousReward, error: previousRewardError } =
        await supabase
          .from("percobaan_aktivitas")
          .select("id")
          .eq("user_id", user.id)
          .eq("aktivitas_id", aktivitasId)
          .eq("reward_claimed", true)
          .limit(1)
          .maybeSingle();

      if (previousRewardError) throw previousRewardError;

      const rewardClaimed = !previousReward;
      const xpEarned = rewardClaimed ? reward.xp : 0;
      const starsEarned = rewardClaimed ? reward.stars : 0;

      const finishedAt = new Date().toISOString();

      const { data: attempt, error: attemptError } = await supabase
        .from("percobaan_aktivitas")
        .insert({
          user_id: user.id,
          aktivitas_id: aktivitasId,
          nilai: score,
          jumlah_benar: correct,
          jumlah_salah: incorrect,
          xp_diperoleh: xpEarned,
          reward_claimed: rewardClaimed,
          status: "selesai",
          mulai_at: startedAt ?? finishedAt,
          selesai_at: finishedAt,
        })
        .select("id")
        .single();

      if (attemptError) throw attemptError;

      const rowsToInsert = answerRows.map((row) => ({
        ...row,
        percobaan_id: attempt.id,
        dijawab_at: finishedAt,
      }));

      const { error: answersError } = await supabase
        .from("jawaban_siswa")
        .insert(rowsToInsert);

      if (answersError) throw answersError;

      if (rewardClaimed && xpEarned > 0) {
        const { error: xpError } = await supabase.from("riwayat_xp").insert({
          user_id: user.id,
          percobaan_id: attempt.id,
          jumlah_xp: xpEarned,
          keterangan: `Reward Sumatif dengan nilai ${score}`,
        });

        if (xpError) throw xpError;
      }

      if (rewardClaimed && starsEarned > 0) {
        const { error: starError } = await supabase
          .from("riwayat_bintang")
          .insert({
            user_id: user.id,
            percobaan_id: attempt.id,
            jumlah_bintang: starsEarned,
          });

        if (starError) throw starError;
      }

      setResult({
        score,
        correct,
        incorrect,
        total: questions.length,
        xp: xpEarned,
        stars: starsEarned,
        rewardClaimed,
      });

      setShowConfirmation(false);
      setMode("result");
    } catch (error) {
      console.error("Gagal menyimpan hasil Sumatif:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan hasil Sumatif.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!questions.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-slate-400" />
        <h2 className="font-semibold text-slate-800">
          Soal Sumatif belum tersedia
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Silakan kembali lagi nanti.
        </p>
      </div>
    );
  }

  if (mode === "intro") {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl bg-[#172554] p-8 text-white md:p-10">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <ClipboardCheck className="h-8 w-8" />
          </div>

          <p className="text-sm font-medium text-blue-200">
            Evaluasi Pembelajaran
          </p>
          <h1 className="mt-2 text-3xl font-bold">Sumatif</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100">
            Selesaikan seluruh soal untuk mengukur pemahamanmu terhadap materi
            yang telah dipelajari.
          </p>

          <button
            onClick={handleStart}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#172554] transition hover:bg-blue-50"
          >
            Mulai Sumatif
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <InfoCard
            icon={<BookOpen size={20} />}
            title="Jumlah Soal"
            value={`${questions.length} Soal`}
          />
          <InfoCard
            icon={<Clock3 size={20} />}
            title="Tipe Evaluasi"
            value="Pilihan Ganda"
          />
          <InfoCard
            icon={<Trophy size={20} />}
            title="Reward Maksimal"
            value="60 XP"
            description="Ditambah maksimal 3 bintang"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-800">Petunjuk Pengerjaan</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>
              1. Sumatif terdiri dari {questions.length} soal pilihan ganda.
            </li>
            <li>2. Pilih satu jawaban yang menurutmu paling tepat.</li>
            <li>3. Kamu dapat berpindah soal menggunakan tombol navigasi.</li>
            <li>4. Pastikan semua soal telah dijawab sebelum mengumpulkan.</li>
            <li>5. Nilai akhir dan reward akan dihitung secara otomatis.</li>
          </ul>
        </div>
      </div>
    );
  }

  if (mode === "result" && result) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <p className="text-sm font-medium text-[#172554]">Evaluasi selesai</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-800">
            Hasil Sumatif
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Berikut hasil pengerjaan Sumatif kamu.
          </p>
        </div>

        <ResultSummary {...result} />

        <div
          className={`rounded-2xl border p-5 ${
            result.rewardClaimed
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <div className="flex items-start gap-3">
            <Trophy
              className={`mt-1 h-6 w-6 shrink-0 ${
                result.rewardClaimed ? "text-emerald-600" : "text-amber-600"
              }`}
            />
            <div>
              <h3 className="font-semibold text-slate-800">
                {result.rewardClaimed
                  ? "Reward berhasil diperoleh!"
                  : "Reward Sumatif sudah pernah diperoleh"}
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {result.rewardClaimed
                  ? `Kamu memperoleh ${result.xp} XP dan ${result.stars} bintang.`
                  : "Percobaan ini tetap tersimpan, tetapi XP dan bintang tidak diberikan kembali."}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setMode("intro");
            setAnswers({});
            setCurrentIndex(0);
            setResult(null);
            setErrorMessage("");
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-[#172554] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-900"
        >
          Kembali ke Sumatif
          <ArrowLeft size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#172554]">
            Evaluasi Pembelajaran
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-800">Sumatif</h1>
        </div>

        <div className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-[#172554]">
          Soal {currentIndex + 1} dari {questions.length}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">Progres pengerjaan</span>
          <span className="font-semibold text-[#172554]">
            {answeredCount}/{questions.length} terjawab
          </span>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[#172554] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#172554]">
              Pertanyaan {currentIndex + 1}
            </span>
            <span className="text-xs text-slate-400">Pilih satu jawaban</span>
          </div>

          <h2 className="text-lg font-semibold leading-8 text-slate-800">
            {currentQuestion.pertanyaan}
          </h2>

          <div className="mt-6 space-y-3">
            {currentQuestion.pilihan_jawaban
              .slice()
              .sort((a, b) => a.label.localeCompare(b.label))
              .map((option) => (
                <AnswerOption
                  key={option.id}
                  label={option.label}
                  text={option.teks_jawaban}
                  selected={answers[currentQuestion.id] === option.id}
                  onClick={() =>
                    handleSelectAnswer(currentQuestion.id, option.id)
                  }
                />
              ))}
          </div>

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
            <button
              onClick={() =>
                setCurrentIndex((previous) => Math.max(0, previous - 1))
              }
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft size={17} />
              Sebelumnya
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() =>
                  setCurrentIndex((previous) =>
                    Math.min(questions.length - 1, previous + 1),
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl bg-[#172554] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900"
              >
                Selanjutnya
                <ArrowRight size={17} />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmation(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Selesaikan
                <Send size={17} />
              </button>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-800">Navigasi Soal</h3>
          <p className="mt-1 text-xs text-slate-500">
            Pilih nomor untuk berpindah soal.
          </p>

          <div className="mt-5 grid grid-cols-5 gap-2">
            {questions.map((question, index) => {
              const answered = answers[question.id] !== undefined;
              const active = index === currentIndex;

              return (
                <button
                  key={question.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex h-10 items-center justify-center rounded-lg text-sm font-semibold transition ${
                    active
                      ? "bg-[#172554] text-white ring-2 ring-blue-200"
                      : answered
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <p className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-[#172554]" />
              Soal aktif
            </p>
            <p className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-emerald-100" />
              Sudah dijawab
            </p>
            <p className="flex items-center gap-2">
              <span className="h-3 w-3 rounded bg-slate-100" />
              Belum dijawab
            </p>
          </div>

          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Belum dijawab</p>
            <p className="mt-1 text-2xl font-bold text-slate-800">
              {unansweredCount}
            </p>
          </div>

          <button
            onClick={() => setShowConfirmation(true)}
            className="mt-4 w-full rounded-xl bg-[#172554] px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-900"
          >
            Kumpulkan Jawaban
          </button>
        </aside>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#172554]">
              <ClipboardCheck size={25} />
            </div>

            <h2 className="text-xl font-bold text-slate-800">
              Kumpulkan Jawaban?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Pastikan semua jawaban sudah benar sebelum mengumpulkan Sumatif.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-xs text-emerald-700">Terjawab</p>
                <p className="mt-1 text-2xl font-bold text-emerald-700">
                  {answeredCount}
                </p>
              </div>
              <div className="rounded-xl bg-amber-50 p-4">
                <p className="text-xs text-amber-700">Belum dijawab</p>
                <p className="mt-1 text-2xl font-bold text-amber-700">
                  {unansweredCount}
                </p>
              </div>
            </div>

            {unansweredCount > 0 && (
              <p className="mt-4 text-sm text-red-600">
                Masih ada {unansweredCount} soal yang belum dijawab.
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={loading}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Periksa Lagi
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading || unansweredCount > 0}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#172554] px-4 py-3 text-sm font-semibold text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menyimpan
                  </>
                ) : (
                  <>
                    Kumpulkan
                    <Send size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
