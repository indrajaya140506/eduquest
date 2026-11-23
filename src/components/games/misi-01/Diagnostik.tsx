"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface PilihanJawaban {
  id: string;
  label: string;
  teks_jawaban: string;
}

interface DiagnostikQuestion {
  id: string;
  materi_id: number;
  pertanyaan: string;
  materi: {
    judul: string;
    urutan: number;
  } | null;
  pilihan_jawaban: PilihanJawaban[];
}

interface Props {
  questions?: DiagnostikQuestion[];
  aktivitasId: number;
}

interface HasilMateri {
  total: number;
  benar: number;
}

export default function Diagnostik({ questions = [], aktivitasId }: Props) {
  const supabase = createClient();

  const safeQuestions = Array.isArray(questions) ? questions : [];
  const totalQuestions = safeQuestions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [previousAttempt, setPreviousAttempt] = useState<any>(null);

  const [result, setResult] = useState<{
    nilai: number;
    benar: number;
    salah: number;
    materi: Record<string, HasilMateri>;
  } | null>(null);

  const [mulaiAt, setMulaiAt] = useState("");

  const answeredCount = Object.keys(answers).length;

  const progress =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  // CEK PERCOBAAN TERAKHIR
  useEffect(() => {
    const checkPreviousAttempt = async () => {
      setIsChecking(true);
      setErrorMessage("");

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          setErrorMessage("Sesi login tidak ditemukan.");
          setPreviousAttempt(null);
          return;
        }

        const { data, error } = await supabase
          .from("percobaan_aktivitas")
          .select("id, nilai, status, selesai_at")
          .eq("user_id", user.id)
          .eq("aktivitas_id", aktivitasId)
          .eq("status", "selesai")
          .order("selesai_at", { ascending: false })
          .limit(1);

        if (error) {
          console.error("Error riwayat diagnostik:", error.message);
          setPreviousAttempt(null);
        } else {
          setPreviousAttempt(data?.[0] ?? null);
        }
      } catch (error) {
        console.error("Gagal memeriksa percobaan:", error);
        setPreviousAttempt(null);
      } finally {
        setIsChecking(false);
      }
    };

    checkPreviousAttempt();
  }, [aktivitasId]);

  const currentQuestion = safeQuestions[currentIndex];

  const selectedAnswer = currentQuestion
    ? answers[String(currentQuestion.id)]
    : undefined;

  const sortedChoices = currentQuestion
    ? [...(currentQuestion.pilihan_jawaban ?? [])].sort((a, b) =>
        a.label.localeCompare(b.label),
      )
    : [];

  // MULAI / ULANG DIAGNOSTIK
  const handleStart = () => {
    setCurrentIndex(0);
    setAnswers({});
    setResult(null);
    setIsSubmitted(false);
    setShowConfirmation(false);
    setErrorMessage("");
    setMulaiAt(new Date().toISOString());
    setIsStarted(true);
  };

  // PILIH JAWABAN
  const handleAnswer = (choiceId: string) => {
    if (isSubmitting || isSubmitted || !currentQuestion) return;

    setAnswers((prev) => ({
      ...prev,
      [String(currentQuestion.id)]: String(choiceId),
    }));
  };

  // PAGINATION
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

  // SUBMIT KE SUPABASE
  // SUBMIT KE SUPABASE
  const handleSubmit = async () => {
    if (
      answeredCount !== totalQuestions ||
      isSubmitting ||
      isSubmitted ||
      totalQuestions === 0
    ) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Silakan login kembali.");
      }

      // ID SOAL
      const questionIds = safeQuestions.map((q) => String(q.id));

      console.log("ID SOAL DARI COMPONENT:", questionIds);

      // AMBIL KUNCI JAWABAN
      const { data: keys, error: keyError } = await supabase
        .from("kunci_jawaban")
        .select("soal_id, pilihan_id")
        .in("soal_id", questionIds);

      if (keyError) {
        console.error("ERROR QUERY KUNCI:", keyError);
        throw new Error(`Gagal mengambil kunci jawaban: ${keyError.message}`);
      }

      console.log("DATA KUNCI DARI SUPABASE:", keys);

      // MAP KUNCI JAWABAN
      const keyMap = new Map<string, string>(
        (keys ?? []).map((item) => [
          String(item.soal_id),
          String(item.pilihan_id),
        ]),
      );

      console.log("HASIL KEY MAP:", Array.from(keyMap.entries()));

      // VALIDASI KUNCI JAWABAN
      const missingKeys = questionIds.filter(
        (questionId) => !keyMap.has(questionId),
      );

      if (missingKeys.length > 0) {
        console.error("SOAL TANPA KUNCI JAWABAN:", missingKeys);

        throw new Error(
          `Kunci jawaban tidak ditemukan untuk ${missingKeys.length} soal (ID: ${missingKeys.join(", ")}). Data database ditemukan, tetapi tidak terbaca oleh aplikasi. Periksa RLS dan SELECT policy tabel kunci_jawaban.`,
        );
      }

      // HITUNG NILAI DAN RINGKASAN MATERI
      const materialResults: Record<string, HasilMateri> = {};

      const answerRecords = safeQuestions.map((question) => {
        const questionId = String(question.id);

        const name = question.materi?.judul ?? "Materi tidak diketahui";

        // KUNCI JAWABAN DARI DATABASE
        const correctChoice = keyMap.get(questionId);

        // JAWABAN YANG DIPILIH SISWA
        const selectedChoice = answers[questionId];

        if (!materialResults[name]) {
          materialResults[name] = {
            total: 0,
            benar: 0,
          };
        }

        materialResults[name].total += 1;

        // PERBANDINGAN ID PILIHAN
        const isCorrect =
          correctChoice !== undefined &&
          selectedChoice !== undefined &&
          String(selectedChoice) === String(correctChoice);

        if (isCorrect) {
          materialResults[name].benar += 1;
        }

        return {
          soal_id: questionId,
          pilihan_id: selectedChoice,
          benar: isCorrect,
        };
      });

      // TOTAL NILAI
      const jumlahBenar = answerRecords.filter((item) => item.benar).length;

      const jumlahSalah = totalQuestions - jumlahBenar;

      const nilai = Math.round((jumlahBenar / totalQuestions) * 100);

      const selesaiAt = new Date().toISOString();

      // INSERT PERCOBAAN
      const { data: percobaan, error: percobaanError } = await supabase
        .from("percobaan_aktivitas")
        .insert({
          user_id: user.id,
          aktivitas_id: aktivitasId,
          nilai,
          jumlah_benar: jumlahBenar,
          jumlah_salah: jumlahSalah,
          xp_diperoleh: 0,
          status: "selesai",
          mulai_at: mulaiAt || selesaiAt,
          selesai_at: selesaiAt,
        })
        .select("id")
        .single();

      if (percobaanError) {
        console.error("ERROR INSERT PERCOBAAN:", percobaanError);

        throw new Error(`Gagal menyimpan percobaan: ${percobaanError.message}`);
      }

      if (!percobaan) {
        throw new Error("Data percobaan tidak berhasil dibuat.");
      }

      console.log("PERCOBAAN BERHASIL DISIMPAN:", percobaan);

      // INSERT JAWABAN SISWA
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

      if (jawabanError) {
        console.error("ERROR INSERT JAWABAN SISWA:", jawabanError);

        throw new Error(
          `Gagal menyimpan jawaban siswa: ${jawabanError.message}`,
        );
      }

      console.log("JAWABAN SISWA BERHASIL DISIMPAN:", jawabanRecords);

      // TAMPILKAN HASIL
      setResult({
        nilai,
        benar: jumlahBenar,
        salah: jumlahSalah,
        materi: materialResults,
      });

      setIsSubmitted(true);
      setShowConfirmation(false);
      setIsStarted(false);

      // UPDATE PERCOBAAN TERAKHIR
      setPreviousAttempt({
        id: percobaan.id,
        nilai,
        status: "selesai",
        selesai_at: selesaiAt,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Submit diagnostik gagal:", error.message);
        console.error("Stack:", error.stack);
      } else {
        console.error(
          "Submit diagnostik gagal:",
          JSON.stringify(error, null, 2),
        );
      }

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan jawaban ke database. Periksa Console.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // LOADING
  if (isChecking) {
    return (
      <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <Loader2 className="mx-auto mb-3 animate-spin text-[#172554]" />
        <p className="text-sm text-slate-500">
          Memeriksa riwayat Diagnostik...
        </p>
      </div>
    );
  }

  // HALAMAN HASIL
  if (isSubmitted && result) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 pb-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-7">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={30} />
          </div>

          <p className="text-sm font-semibold text-emerald-600">
            Diagnostik Selesai
          </p>

          <h1 className="mt-2 text-2xl font-bold text-slate-800">
            Pemahaman Awal Tata Surya
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Hasil ini menjadi gambaran awal pemahamanmu sebelum memulai
            pembelajaran di EduQuest.
          </p>
        </div>

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
            title="Pemahaman Awal"
            value={`${result.nilai}%`}
          />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="mb-5 font-bold text-slate-800">Hasil per Materi</h2>

          <div className="space-y-5">
            {Object.entries(result.materi).map(([name, item], index) => {
              const percentage = item.total
                ? Math.round((item.benar / item.total) * 100)
                : 0;

              return (
                <div key={name}>
                  <div className="mb-2 flex justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-600">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm font-medium text-slate-700">
                        {name}
                      </span>
                    </div>

                    <span className="text-sm font-semibold text-[#172554]">
                      {item.benar}/{item.total} · {percentage}%
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#172554]"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-[#172554]/10 bg-[#172554]/5 p-5">
          <p className="font-semibold text-[#172554]">
            Tentang hasil Diagnostik
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Ini merupakan pemetaan pemahaman awal, bukan nilai akhir. Hasil
            Diagnostik tidak memberikan XP atau bintang.
          </p>
        </div>

        <button
          onClick={() => {
            setIsSubmitted(false);
            setIsStarted(false);
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[#172554] transition hover:bg-slate-50"
        >
          <RotateCcw size={17} />
          Kembali
        </button>
      </div>
    );
  }

  // ==================================================
  // HALAMAN AWAL / MULAI ULANG
  // ==================================================

  if (!isStarted) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 pb-10">
        <div>
          <p className="mb-2 text-sm text-slate-400">
            Uji Pemahaman / Diagnostik
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">
            Diagnostik Pemahaman Awal
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Kenali sejauh mana pemahamanmu mengenai Tata Surya.
          </p>
        </div>

        {previousAttempt ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#172554]/5 text-[#172554]">
              <GraduationCap size={28} />
            </div>

            <p className="text-sm font-medium text-[#172554]">
              Diagnostik telah dikerjakan
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-800">
              Hasil Percobaan Terakhir
            </h2>

            <div className="mt-6 rounded-2xl bg-[#172554] p-6 text-white">
              <p className="text-sm text-white/70">Pemahaman awal</p>

              <p className="mt-1 text-4xl font-bold">
                {previousAttempt.nilai ?? 0}%
              </p>

              <p className="mt-2 text-sm text-white/60">
                {previousAttempt.selesai_at
                  ? new Date(previousAttempt.selesai_at).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )
                  : "Percobaan sebelumnya"}
              </p>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-500">
              Kamu dapat mengerjakan ulang Diagnostik untuk mengukur
              perkembangan pemahaman. Percobaan sebelumnya akan tetap tersimpan.
            </p>

            <button
              onClick={handleStart}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#172554] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#24366f]"
            >
              <RotateCcw size={18} />
              Mulai Ulang Diagnostik
            </button>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#172554]/5 text-[#172554]">
              <ClipboardList size={28} />
            </div>

            <h2 className="text-xl font-bold text-slate-800">
              Mulai Diagnostik
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Terdapat {totalQuestions} pertanyaan untuk mengetahui pemahaman
              awalmu. Jawablah berdasarkan pengetahuan yang kamu miliki.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <InfoCard title="Jumlah soal" value={`${totalQuestions} soal`} />
              <InfoCard title="Penilaian" value="Pemahaman awal" />
              <InfoCard title="Reward" value="Tanpa XP & bintang" />
            </div>

            <button
              onClick={handleStart}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#172554] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#24366f]"
            >
              <Play size={18} />
              Mulai Diagnostik
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }

  // ==================================================
  // HALAMAN PENGERJAAN
  // ==================================================

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-10">
      <div>
        <p className="mb-2 text-sm text-slate-400">
          Uji Pemahaman / Diagnostik
        </p>

        <h1 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">
          Diagnostik Pemahaman Awal
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Jawablah sesuai pengetahuan yang kamu miliki.
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
          icon={<GraduationCap size={22} />}
          title="Jenis Aktivitas"
          value="Pemahaman Awal"
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

      {/* QUESTION */}
      {currentQuestion && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-xl bg-[#172554]/5 px-3 py-2 text-sm font-semibold text-[#172554]">
              Pertanyaan {currentIndex + 1} dari {totalQuestions}
            </span>

            <span className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-500">
              Materi {currentQuestion.materi?.urutan ?? "-"}
            </span>
          </div>

          <p className="mb-3 text-sm font-medium text-slate-500">
            {currentQuestion.materi?.judul ?? "Materi"}
          </p>

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
                  className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? "border-[#172554] bg-[#172554]/5 ring-2 ring-[#172554]/10"
                      : "border-slate-200 bg-white hover:border-[#172554]/30 hover:bg-slate-50"
                  }`}
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

          {/* PAGINATION */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft size={18} />
              Sebelumnya
            </button>

            {currentIndex !== totalQuestions - 1 ? (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-xl bg-[#172554] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24366f]"
              >
                Selanjutnya
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={() => setShowConfirmation(true)}
                disabled={answeredCount !== totalQuestions}
                className="inline-flex items-center gap-2 rounded-xl bg-[#172554] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24366f] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Selesaikan Diagnostik
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
          <p className="font-semibold text-[#172554]">Informasi Diagnostik</p>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Diagnostik digunakan untuk mengetahui pemahaman awal. Tidak ada XP,
            bintang, maupun feedback benar atau salah selama pengerjaan.
          </p>
        </div>
      </div>

      {/* ERROR */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* MODAL */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#172554]/5 text-[#172554]">
                <CheckCircle2 size={25} />
              </div>

              <button
                onClick={() => setShowConfirmation(false)}
                disabled={isSubmitting}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <h2 className="text-xl font-bold text-slate-800">
              Selesaikan Diagnostik?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Seluruh jawaban akan disimpan sebagai percobaan baru. Riwayat
              sebelumnya tetap tersimpan.
            </p>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Terjawab</span>
                <span className="font-semibold text-slate-800">
                  {answeredCount}/{totalQuestions}
                </span>
              </div>
            </div>

            {errorMessage && (
              <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {errorMessage}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={isSubmitting}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Periksa Kembali
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#172554] px-4 py-3 text-sm font-semibold text-white hover:bg-[#24366f] disabled:opacity-60"
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

// STAT CARD
function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
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

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="mt-1 text-sm font-semibold text-[#172554]">{value}</p>
    </div>
  );
}
