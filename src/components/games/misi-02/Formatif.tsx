"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  CircleHelp,
  RotateCcw,
  Send,
  X,
  Play,
  Loader2,
  Star,
  Trophy,
  BookOpen,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// ======================================================
// TYPES
// ======================================================

interface PilihanJawaban {
  id: string | number;
  label: string;
  teks_jawaban: string;
}

interface FormatifQuestion {
  id: string | number;
  materi_id: number;
  pertanyaan: string;
  tipe_soal: string;
  tingkat_kesulitan: string;
  poin: number;
  materi: {
    judul: string;
    urutan: number;
  } | null;
  pilihan_jawaban: PilihanJawaban[];
}

interface Props {
  questions?: FormatifQuestion[];
  aktivitasId: number;
  xpMaksimal: number;
  onOpenHistory?: (materiId: number, materiNama: string) => void;
}

interface Result {
  nilai: number;
  benar: number;
  salah: number;
  poinDidapat: number;
  totalPoin: number;
  xp: number;
  bintang: number;
  rewardClaimed: boolean;
}

interface PreviousAttempt {
  id: string;
  nilai: number;
  status: string;
  selesai_at: string;
  xp_diperoleh: number;
  materi_id: number;
  reward_claimed: boolean;
}

// ======================================================
// COMPONENT
// ======================================================

export default function Formatif({
  questions = [],
  aktivitasId,
  xpMaksimal,
  onOpenHistory,
}: Props) {
  const supabase = createClient();

  // ======================================================
  // DATA MATERI
  // ======================================================

  const safeQuestions = Array.isArray(questions) ? questions : [];

  const materials = useMemo(() => {
    const map = new Map<
      number,
      {
        id: number;
        judul: string;
        urutan: number;
      }
    >();

    safeQuestions.forEach((question) => {
      if (!question.materi_id) return;

      map.set(question.materi_id, {
        id: question.materi_id,
        judul: question.materi?.judul ?? "Materi",
        urutan: question.materi?.urutan ?? 0,
      });
    });

    return Array.from(map.values()).sort((a, b) => a.urutan - b.urutan);
  }, [safeQuestions]);

  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(
    null,
  );

  const selectedMaterial = materials.find(
    (material) => material.id === selectedMaterialId,
  );

  const materialQuestions = useMemo(() => {
    if (selectedMaterialId === null) return [];

    return safeQuestions.filter(
      (question) => Number(question.materi_id) === selectedMaterialId,
    );
  }, [safeQuestions, selectedMaterialId]);

  const totalQuestions = materialQuestions.length;

  // ======================================================
  // STATE
  // ======================================================

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [previousAttempt, setPreviousAttempt] =
    useState<PreviousAttempt | null>(null);
  const [mulaiAt, setMulaiAt] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  // ======================================================
  // PROGRESS
  // ======================================================

  const answeredCount = materialQuestions.filter((question) =>
    Boolean(answers[String(question.id)]),
  ).length;

  const allAnswered = totalQuestions > 0 && answeredCount === totalQuestions;

  const progress =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  const currentQuestion = materialQuestions[currentIndex];

  const selectedAnswer = currentQuestion
    ? answers[String(currentQuestion.id)]
    : undefined;

  const sortedChoices = currentQuestion
    ? [...(currentQuestion.pilihan_jawaban ?? [])].sort((a, b) =>
        a.label.localeCompare(b.label),
      )
    : [];

  // ======================================================
  // XP PER MATERI
  // ======================================================

  const rewardPerMateri = Math.max(
    1,
    Math.floor(xpMaksimal / Math.max(materials.length, 1)),
  );

  // ======================================================
  // CALCULATE REWARD
  // ======================================================

  const calculateReward = (nilai: number, xpDasar: number) => {
    if (nilai >= 90) {
      return {
        xp: xpDasar,
        bintang: 3,
      };
    }

    if (nilai >= 75) {
      return {
        xp: Math.round(xpDasar * 0.75),
        bintang: 2,
      };
    }

    if (nilai >= 60) {
      return {
        xp: Math.round(xpDasar * 0.5),
        bintang: 1,
      };
    }

    return {
      xp: Math.round(xpDasar * 0.25),
      bintang: 0,
    };
  };

  // ======================================================
  // ERROR HANDLING
  // ======================================================

  const getErrorMessage = (error: any) => {
    if (!error) return "Terjadi kesalahan yang tidak diketahui.";

    return (
      error.message ||
      error.details ||
      error.hint ||
      "Terjadi kesalahan pada server."
    );
  };

  // ======================================================
  // LOAD RIWAYAT TERAKHIR
  // ======================================================

  useEffect(() => {
    if (selectedMaterialId === null) {
      setPreviousAttempt(null);
      setResult(null);
      setIsSubmitted(false);
      setIsChecking(false);
      return;
    }

    let cancelled = false;

    const loadPreviousAttempt = async () => {
      setIsChecking(true);
      setErrorMessage("");
      setPreviousAttempt(null);
      setResult(null);
      setIsSubmitted(false);
      setIsStarted(false);
      setAnswers({});
      setCurrentIndex(0);

      try {
        // AUTH
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;
        if (!user) throw new Error("Sesi login tidak ditemukan.");

        // RIWAYAT TERAKHIR
        const { data, error } = await supabase
          .from("percobaan_aktivitas")
          .select(
            "id, nilai, status, selesai_at, xp_diperoleh, materi_id, reward_claimed",
          )
          .eq("user_id", user.id)
          .eq("aktivitas_id", aktivitasId)
          .eq("materi_id", selectedMaterialId)
          .eq("status", "selesai")
          .order("selesai_at", { ascending: false })
          .limit(1);

        if (error) throw error;
        if (cancelled) return;

        const latest = data?.[0] as PreviousAttempt | undefined;

        if (!latest) {
          setPreviousAttempt(null);
          setResult(null);
          return;
        }

        setPreviousAttempt(latest);

        // JAWABAN PERCOBAAN TERAKHIR
        const { data: savedAnswers, error: answerError } = await supabase
          .from("jawaban_siswa")
          .select("soal_id, pilihan_id, benar")
          .eq("percobaan_id", latest.id);

        if (answerError) throw answerError;
        if (cancelled) return;

        // RESTORE JAWABAN
        const savedAnswerMap: Record<string, string> = {};

        (savedAnswers ?? []).forEach((item) => {
          savedAnswerMap[String(item.soal_id)] = String(item.pilihan_id);
        });

        // TOTAL POIN
        const totalPoin = materialQuestions.reduce(
          (sum, question) => sum + Number(question.poin || 0),
          0,
        );

        // JAWABAN BENAR
        const benar = (savedAnswers ?? []).filter(
          (item) => item.benar === true,
        ).length;

        // POIN DIPEROLEH
        const poinDidapat = materialQuestions.reduce((sum, question) => {
          const saved = (savedAnswers ?? []).find(
            (item) => String(item.soal_id) === String(question.id),
          );

          return sum + (saved?.benar === true ? Number(question.poin || 0) : 0);
        }, 0);

        // BINTANG
        const { data: starData, error: starError } = await supabase
          .from("riwayat_bintang")
          .select("jumlah_bintang")
          .eq("percobaan_id", latest.id)
          .maybeSingle();

        if (starError) throw starError;
        if (cancelled) return;

        // SIMPAN HASIL RIWAYAT UNTUK INTRO
        setResult({
          nilai: Number(latest.nilai ?? 0),
          benar,
          salah: Math.max(0, totalQuestions - benar),
          poinDidapat,
          totalPoin,
          xp: Number(latest.xp_diperoleh ?? 0),
          bintang: Number(starData?.jumlah_bintang ?? 0),
          rewardClaimed: latest.reward_claimed === true,
        });

        // TETAP TAMPIL INTRO
        setIsSubmitted(false);
        setIsStarted(false);
      } catch (error: any) {
        if (cancelled) return;

        console.error("Load riwayat Formatif gagal:", {
          message: error?.message,
          code: error?.code,
          details: error?.details,
          hint: error?.hint,
          status: error?.status,
        });

        setErrorMessage(getErrorMessage(error));
        setPreviousAttempt(null);
        setResult(null);
      } finally {
        if (!cancelled) {
          setIsChecking(false);
        }
      }
    };

    loadPreviousAttempt();

    return () => {
      cancelled = true;
    };
  }, [aktivitasId, selectedMaterialId, materialQuestions]);

  // ======================================================
  // START / RETRY
  // ======================================================

  const handleStart = () => {
    setCurrentIndex(0);
    setAnswers({});
    setResult(null);
    setIsSubmitted(false);
    setIsStarted(true);
    setShowConfirmation(false);
    setErrorMessage("");
    setMulaiAt(new Date().toISOString());
  };

  // ======================================================
  // ANSWER
  // ======================================================

  const handleAnswer = (choiceId: string) => {
    if (isSubmitting || isSubmitted || !currentQuestion) return;

    setAnswers((prev) => ({
      ...prev,
      [String(currentQuestion.id)]: String(choiceId),
    }));
  };

  // ======================================================
  // PAGINATION
  // ======================================================

  const handlePrevious = () => {
    if (currentIndex > 0 && !isSubmitting) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1 && !isSubmitting) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // ======================================================
  // SUBMIT FORMATIF
  // ======================================================

  const handleSubmit = async () => {
    if (
      !allAnswered ||
      isSubmitting ||
      isSubmitted ||
      totalQuestions === 0 ||
      selectedMaterialId === null
    ) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // AUTH
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;
      if (!user) throw new Error("Silakan login kembali.");

      const questionIds = materialQuestions.map((question) =>
        String(question.id),
      );

      // KUNCI JAWABAN
      const { data: keys, error: keyError } = await supabase
        .from("kunci_jawaban")
        .select("soal_id, pilihan_id")
        .in("soal_id", questionIds);

      if (keyError) throw keyError;

      const keyMap = new Map<string, string>(
        (keys ?? []).map((item) => [
          String(item.soal_id),
          String(item.pilihan_id),
        ]),
      );

      const missingKeys = questionIds.filter((id) => !keyMap.has(id));

      if (missingKeys.length > 0) {
        throw new Error(
          `Kunci jawaban tidak ditemukan untuk soal: ${missingKeys.join(", ")}`,
        );
      }

      // TOTAL POIN
      const totalPoin = materialQuestions.reduce(
        (sum, question) => sum + Number(question.poin || 0),
        0,
      );

      let poinDidapat = 0;
      let jumlahBenar = 0;

      // EVALUASI JAWABAN
      const answerRecords = materialQuestions.map((question) => {
        const questionId = String(question.id);
        const correctChoice = keyMap.get(questionId);
        const selectedChoice = answers[questionId];

        const isCorrect =
          correctChoice !== undefined &&
          selectedChoice !== undefined &&
          String(selectedChoice) === String(correctChoice);

        if (isCorrect) {
          jumlahBenar++;
          poinDidapat += Number(question.poin || 0);
        }

        return {
          soal_id: questionId,
          pilihan_id: selectedChoice,
          benar: isCorrect,
        };
      });

      const jumlahSalah = totalQuestions - jumlahBenar;

      // NILAI
      const nilai =
        totalPoin > 0 ? Math.round((poinDidapat / totalPoin) * 100) : 0;

      // REWARD
      const reward = calculateReward(nilai, rewardPerMateri);

      // CEK REWARD PER MATERI
      const { data: rewardHistory, error: rewardCheckError } = await supabase
        .from("percobaan_aktivitas")
        .select("id")
        .eq("user_id", user.id)
        .eq("aktivitas_id", aktivitasId)
        .eq("materi_id", selectedMaterialId)
        .eq("reward_claimed", true)
        .limit(1);

      if (rewardCheckError) throw rewardCheckError;

      const isFirstReward = !rewardHistory || rewardHistory.length === 0;

      const xpDiberikan = isFirstReward ? reward.xp : 0;
      const bintangDiberikan = isFirstReward ? reward.bintang : 0;

      const selesaiAt = new Date().toISOString();

      // ======================================================
      // INSERT PERCOBAAN
      // ======================================================

      const { data: percobaan, error: percobaanError } = await supabase
        .from("percobaan_aktivitas")
        .insert({
          user_id: user.id,
          aktivitas_id: aktivitasId,
          materi_id: selectedMaterialId,
          nilai,
          jumlah_benar: jumlahBenar,
          jumlah_salah: jumlahSalah,
          xp_diperoleh: xpDiberikan,
          reward_claimed: isFirstReward,
          status: "selesai",
          mulai_at: mulaiAt || selesaiAt,
          selesai_at: selesaiAt,
        })
        .select("id")
        .single();

      if (percobaanError) throw percobaanError;
      if (!percobaan) throw new Error("Percobaan gagal dibuat.");

      // ======================================================
      // INSERT JAWABAN
      // ======================================================

      const jawabanRecords = answerRecords.map((item) => ({
        percobaan_id: percobaan.id,
        soal_id: item.soal_id,
        pilihan_id: item.pilihan_id,
        benar: item.benar,
        dijawab_at: selesaiAt,
      }));

      const { error: jawabanError } = await supabase
        .from("jawaban_siswa")
        .insert(jawabanRecords);

      if (jawabanError) throw jawabanError;

      // ======================================================
      // INSERT XP
      // ======================================================

      if (xpDiberikan > 0) {
        const { error: xpError } = await supabase.from("riwayat_xp").insert({
          user_id: user.id,
          percobaan_id: percobaan.id,
          jumlah_xp: xpDiberikan,
          keterangan: `Reward Formatif - ${
            selectedMaterial?.judul ?? "Materi"
          }`,
        });

        if (xpError) throw xpError;
      }

      // ======================================================
      // INSERT BINTANG
      // ======================================================

      if (isFirstReward) {
        const { error: starError } = await supabase
          .from("riwayat_bintang")
          .insert({
            user_id: user.id,
            percobaan_id: percobaan.id,
            jumlah_bintang: bintangDiberikan,
          });

        if (starError) throw starError;
      }

      // ======================================================
      // UPDATE PROGRES BELAJAR
      // ======================================================

      const { data: progressData, error: progressCheckError } = await supabase
        .from("progres_belajar")
        .select("id")
        .eq("user_id", user.id)
        .eq("materi_id", selectedMaterialId)
        .maybeSingle();

      if (progressCheckError) throw progressCheckError;

      if (progressData) {
        const { error: updateProgressError } = await supabase
          .from("progres_belajar")
          .update({
            status: "selesai",
            persentase: 100,
            terakhir_dipelajari: selesaiAt,
          })
          .eq("id", progressData.id);

        if (updateProgressError) throw updateProgressError;
      } else {
        const { error: insertProgressError } = await supabase
          .from("progres_belajar")
          .insert({
            user_id: user.id,
            materi_id: selectedMaterialId,
            status: "selesai",
            persentase: 100,
            terakhir_dipelajari: selesaiAt,
          });

        if (insertProgressError) throw insertProgressError;
      }

      // ======================================================
      // HASIL
      // ======================================================

      const finalResult: Result = {
        nilai,
        benar: jumlahBenar,
        salah: jumlahSalah,
        poinDidapat,
        totalPoin,
        xp: xpDiberikan,
        bintang: bintangDiberikan,
        rewardClaimed: isFirstReward,
      };

      setResult(finalResult);

      setPreviousAttempt({
        id: percobaan.id,
        nilai,
        status: "selesai",
        selesai_at: selesaiAt,
        xp_diperoleh: xpDiberikan,
        materi_id: selectedMaterialId,
        reward_claimed: isFirstReward,
      });

      setIsSubmitted(true);
      setShowConfirmation(false);
      setIsStarted(false);
    } catch (error: any) {
      console.error("Submit Formatif gagal:", {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        status: error?.status,
      });

      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (isChecking) {
    return (
      <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <Loader2 className="mx-auto mb-3 animate-spin text-[#172554]" />

        <p className="text-sm text-slate-500">Memeriksa riwayat Formatif...</p>
      </div>
    );
  }

  // ======================================================
  // RESULT PAGE
  // ======================================================

  if (isSubmitted && result) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 pb-10">
        {/* HEADER */}
        <div className="rounded-3xl border border-slate-200 bg-white p-7">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={30} />
          </div>

          <p className="text-sm font-semibold text-emerald-600">
            Formatif Selesai
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-800">
            {selectedMaterial?.judul}
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Kamu telah menyelesaikan latihan pemahaman materi. Berikut hasil
            pengerjaanmu.
          </p>
        </div>

        {/* STATISTIK */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={<ClipboardList size={22} />}
            title="Total Soal"
            value={totalQuestions}
          />

          <StatCard
            icon={<CheckCircle2 size={22} />}
            title="Jawaban Benar"
            value={`${result.benar}/${totalQuestions}`}
          />

          <StatCard
            icon={<GraduationCap size={22} />}
            title="Nilai Formatif"
            value={`${result.nilai}%`}
          />
        </div>

        {/* RINGKASAN */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="mb-5 font-bold text-slate-800">Ringkasan Hasil</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Total poin</p>

              <p className="mt-1 text-2xl font-bold text-slate-800">
                {result.poinDidapat}/{result.totalPoin}
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-5">
              <p className="text-sm text-emerald-600">Benar</p>

              <p className="mt-1 text-2xl font-bold text-emerald-700">
                {result.benar} soal
              </p>
            </div>

            <div className="rounded-2xl bg-rose-50 p-5">
              <p className="text-sm text-rose-600">Salah</p>

              <p className="mt-1 text-2xl font-bold text-rose-700">
                {result.salah} soal
              </p>
            </div>
          </div>
        </div>

        {/* REWARD */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="mb-5 font-bold text-slate-800">Reward Formatif</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-amber-50 p-5">
              <div className="flex items-center gap-2 text-amber-600">
                <Trophy size={22} />
                <span className="text-sm font-medium">XP Diperoleh</span>
              </div>

              <p className="mt-2 text-3xl font-bold text-amber-700">
                +{result.xp} XP
              </p>
            </div>

            <div className="rounded-2xl bg-yellow-50 p-5">
              <div className="flex items-center gap-2 text-yellow-600">
                <Star size={22} />
                <span className="text-sm font-medium">Bintang Diperoleh</span>
              </div>

              <div className="mt-3 flex gap-1">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    size={28}
                    className={
                      star <= result.bintang
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-300"
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          <div
            className={`mt-4 rounded-xl border p-4 text-sm leading-6 ${
              result.rewardClaimed
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            {result.rewardClaimed
              ? "Reward materi berhasil disimpan. XP dan bintang tidak diberikan kembali pada percobaan berikutnya."
              : "Reward materi telah diklaim sebelumnya. Percobaan ini tetap tersimpan sebagai riwayat."}
          </div>
        </div>

        {/* WAKTU PERCOBAAN */}
        {previousAttempt && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <BookOpen size={22} className="text-[#172554]" />

              <div>
                <h2 className="font-bold text-slate-800">Percobaan Terakhir</h2>

                <p className="mt-1 text-sm text-slate-500">
                  {previousAttempt.selesai_at
                    ? new Date(previousAttempt.selesai_at).toLocaleString(
                        "id-ID",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        },
                      )
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* BUTTON */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleStart}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#172554] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24366f]"
          >
            <RotateCcw size={17} />
            Coba Ulang Formatif
          </button>

          <button
            onClick={() => {
              setIsSubmitted(false);
              setIsStarted(false);
              setShowConfirmation(false);
              setErrorMessage("");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[#172554] transition hover:bg-slate-50"
          >
            <ChevronLeft size={17} />
            Kembali ke Menu Materi
          </button>
        </div>

        {/* ERROR */}
        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }

  // ======================================================
  // INTRO PAGE
  // ======================================================

  if (!isStarted) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 pb-10">
        {/* HEADER */}
        <div>
          <p className="mb-2 text-sm text-slate-400">Pembelajaran / Formatif</p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">
            Latihan Pemahaman Materi
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Evaluasi pemahamanmu melalui latihan formatif pada setiap materi.
          </p>
        </div>

        {/* PILIH MATERI */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#172554]/5 text-[#172554]">
            <BookOpen size={28} />
          </div>

          <h2 className="text-xl font-bold text-slate-800">Pilih Materi</h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Pilih materi yang ingin kamu evaluasi pemahamannya.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {materials.map((material, index) => {
              const count = safeQuestions.filter(
                (question) => Number(question.materi_id) === material.id,
              ).length;

              const isSelected = selectedMaterialId === material.id;

              return (
                <button
                  key={material.id}
                  onClick={() => {
                    setSelectedMaterialId(material.id);
                    setCurrentIndex(0);
                    setAnswers({});
                    setResult(null);
                    setIsSubmitted(false);
                    setIsStarted(false);
                    setShowConfirmation(false);
                    setErrorMessage("");
                  }}
                  className={`rounded-2xl border p-5 text-left transition ${
                    isSelected
                      ? "border-[#172554] bg-[#172554]/5 ring-2 ring-[#172554]/5"
                      : "border-slate-200 hover:border-[#172554]/30 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800">
                        {material.judul}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {count} soal formatif
                      </p>
                    </div>

                    <ChevronRight size={20} className="text-slate-400" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* INTRO MATERI */}
        {selectedMaterialId !== null && (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div className="bg-[#172554] p-6 text-white md:p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <ClipboardList size={24} />
              </div>

              <p className="text-sm text-white/60">FORMATIF MATERI</p>

              <h2 className="mt-2 text-xl font-bold md:text-2xl">
                {selectedMaterial?.judul}
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/70">
                Uji pemahamanmu terhadap materi ini dan dapatkan reward
                berdasarkan hasil pengerjaan.
              </p>
            </div>

            <div className="p-6 md:p-8">
              {/* INFO */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <InfoCard
                  icon={<ClipboardList size={20} />}
                  title="Jumlah soal"
                  value={`${totalQuestions} Soal`}
                />

                <InfoCard
                  icon={<GraduationCap size={20} />}
                  title="XP maksimal"
                  value={`${rewardPerMateri} XP`}
                />

                <InfoCard
                  icon={<Star size={20} />}
                  title="Reward"
                  value="Maks. 3 Bintang"
                />
              </div>

              {/* RIWAYAT TERAKHIR */}
              {previousAttempt && (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <CheckCircle2 size={22} />
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-emerald-800">
                        Materi sudah pernah dikerjakan
                      </p>

                      <p className="mt-1 text-sm text-emerald-700">
                        Nilai percobaan terakhir
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-xl bg-white p-4">
                    <div>
                      <p className="text-sm text-slate-500">Nilai terakhir</p>

                      <p className="mt-1 text-2xl font-bold text-[#172554]">
                        {previousAttempt.nilai}/100
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-slate-500">Waktu pengerjaan</p>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {previousAttempt.selesai_at
                          ? new Date(
                              previousAttempt.selesai_at,
                            ).toLocaleDateString("id-ID", {
                              dateStyle: "medium",
                            })
                          : "-"}
                      </p>
                    </div>
                  </div>

                  {/* KE HALAMAN RIWAYAT */}
                  <button
                    onClick={() =>
                      onOpenHistory?.(
                        selectedMaterialId,
                        selectedMaterial?.judul ?? "Materi",
                      )
                    }
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-[#172554] transition hover:bg-emerald-100/50"
                  >
                    <BookOpen size={17} />
                    Lihat Semua Riwayat
                    <ChevronRight size={17} />
                  </button>
                </div>
              )}

              {/* PETUNJUK */}
              <div className="mt-5 rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center gap-2">
                  <CircleHelp size={20} className="text-[#172554]" />

                  <p className="font-semibold text-slate-800">
                    Petunjuk Pengerjaan
                  </p>
                </div>

                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-500">
                  <li>• Kerjakan semua pertanyaan hingga selesai.</li>
                  <li>• Pilih satu jawaban yang paling tepat.</li>
                  <li>• Pastikan semua soal sudah dijawab.</li>
                  <li>• Hasil ditampilkan setelah jawaban dikumpulkan.</li>
                </ul>
              </div>

              {/* MULAI */}
              <button
                onClick={handleStart}
                disabled={materialQuestions.length === 0}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#172554] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#24366f] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Play size={18} />

                {previousAttempt ? "Mulai Percobaan Baru" : "Mulai Formatif"}
              </button>
            </div>
          </div>
        )}

        {/* ERROR */}
        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }

  // ======================================================
  // QUESTION PAGE
  // ======================================================

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-10">
      {/* HEADER */}
      <div>
        <p className="mb-2 text-sm text-slate-400">Pembelajaran / Formatif</p>

        <h1 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">
          {selectedMaterial?.judul}
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Jawablah pertanyaan untuk mengukur pemahamanmu terhadap materi.
        </p>
      </div>

      {/* STATISTIK */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={<ClipboardList size={22} />}
          title="Total Pertanyaan"
          value={totalQuestions}
        />

        <StatCard
          icon={<CheckCircle2 size={22} />}
          title="Telah Dijawab"
          value={`${answeredCount}/${totalQuestions}`}
        />

        <StatCard
          icon={<Trophy size={22} />}
          title="XP Maksimal Materi"
          value={`${rewardPerMateri} XP`}
        />
      </div>

      {/* PROGRESS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-3 flex justify-between text-sm">
          <span className="font-medium text-slate-600">
            Progress pengerjaan
          </span>

          <span className="font-semibold text-[#172554]">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[#172554] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* SOAL */}
      {currentQuestion && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
          {/* NOMOR SOAL */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-xl bg-[#172554]/5 px-3 py-2 text-sm font-semibold text-[#172554]">
              Pertanyaan {currentIndex + 1} dari {totalQuestions}
            </span>

            <span className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-500">
              {currentQuestion.tingkat_kesulitan}
            </span>
          </div>

          {/* MATERI */}
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
            <BookOpen size={16} />
            {currentQuestion.materi?.judul}
          </div>

          {/* PERTANYAAN */}
          <h2 className="mb-8 text-lg font-semibold leading-8 text-slate-800">
            {currentQuestion.pertanyaan}
          </h2>

          {/* PILIHAN */}
          <div className="space-y-3">
            {sortedChoices.map((choice) => {
              const isSelected = String(selectedAnswer) === String(choice.id);

              return (
                <button
                  key={choice.id}
                  onClick={() => handleAnswer(String(choice.id))}
                  disabled={isSubmitting || isSubmitted}
                  className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? "border-[#172554] bg-[#172554]/5 ring-2 ring-[#172554]/10"
                      : "border-slate-200 bg-white hover:border-[#172554]/30 hover:bg-slate-50"
                  } disabled:cursor-not-allowed`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${
                      isSelected
                        ? "bg-[#172554] text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {choice.label}
                  </span>

                  <span className="flex-1 pt-1 text-sm leading-6 text-slate-700">
                    {choice.teks_jawaban}
                  </span>

                  {isSelected && (
                    <CheckCircle2
                      size={20}
                      className="mt-1 shrink-0 text-[#172554]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* NAVIGASI SOAL */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0 || isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft size={18} />
              Sebelumnya
            </button>

            {currentIndex < totalQuestions - 1 ? (
              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-[#172554] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24366f] disabled:opacity-50"
              >
                Selanjutnya
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmation(true)}
                disabled={!allAnswered || isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-[#172554] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24366f] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Selesaikan Formatif
                <Send size={17} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* INFORMASI */}
      <div className="flex gap-3 rounded-2xl border border-[#172554]/10 bg-[#172554]/5 p-5">
        <CircleHelp size={22} className="mt-0.5 shrink-0 text-[#172554]" />

        <div>
          <p className="font-semibold text-[#172554]">Informasi Formatif</p>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Formatif digunakan untuk mengukur pemahamanmu terhadap materi.
            Selesaikan seluruh soal sebelum mengirim jawaban.
          </p>
        </div>
      </div>

      {/* ERROR */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* MODAL KONFIRMASI */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            {/* MODAL HEADER */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#172554]/5 text-[#172554]">
                <CheckCircle2 size={25} />
              </div>

              <button
                onClick={() => setShowConfirmation(false)}
                disabled={isSubmitting}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <h2 className="text-xl font-bold text-slate-800">
              Selesaikan Formatif?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Jawabanmu akan disimpan dan dinilai berdasarkan poin setiap soal.
            </p>

            {/* SUMMARY */}
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-slate-500">Materi</span>

                <span className="text-right font-semibold text-slate-800">
                  {selectedMaterial?.judul}
                </span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-slate-500">Terjawab</span>

                <span className="font-semibold text-slate-800">
                  {answeredCount}/{totalQuestions}
                </span>
              </div>
            </div>

            {/* ERROR MODAL */}
            {errorMessage && (
              <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {errorMessage}
              </p>
            )}

            {/* BUTTON MODAL */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={isSubmitting}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Periksa Kembali
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !allAnswered}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#172554] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#24366f] disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    Ya, Selesaikan
                    <CheckCircle2 size={17} />
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

// ======================================================
// STAT CARD
// ======================================================

function StatCard({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#172554]/5 text-[#172554]">
        {icon}
      </div>

      <p className="text-sm text-slate-500">{title}</p>

      <p className="mt-1 text-2xl font-bold text-slate-800">{value}</p>
    </div>
  );
}

// ======================================================
// INFO CARD
// ======================================================

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-[#172554]">{icon}</div>

      <p className="mt-3 text-sm text-slate-500">{title}</p>

      <p className="mt-1 font-bold text-slate-800">{value}</p>
    </div>
  );
}
