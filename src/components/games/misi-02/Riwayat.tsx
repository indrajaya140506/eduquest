"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ClipboardList,
  Trophy,
  Star,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Loader2,
  BookOpen,
  TrendingUp,
  Award,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface RiwayatPercobaan {
  id: string;
  nilai: number;
  status: string;
  selesai_at: string;
  xp_diperoleh: number;
  materi_id: number;
  reward_claimed: boolean;
  jumlah_benar: number;
  jumlah_salah: number;
  jumlah_bintang: number;
}

interface Props {
  aktivitasId: number;
  materiId: number;
  materiNama: string;
  onBack: () => void;
}

export default function Riwayat({
  aktivitasId,
  materiId,
  materiNama,
  onBack,
}: Props) {
  const supabase = createClient();

  const [riwayat, setRiwayat] = useState<RiwayatPercobaan[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // =========================
  // LOAD SELURUH RIWAYAT
  // =========================
  useEffect(() => {
    let cancelled = false;

    const loadRiwayat = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;
        if (!user) throw new Error("Sesi login tidak ditemukan.");

        const { data: attempts, error } = await supabase
          .from("percobaan_aktivitas")
          .select(
            "id, nilai, status, selesai_at, xp_diperoleh, materi_id, reward_claimed, jumlah_benar, jumlah_salah",
          )
          .eq("user_id", user.id)
          .eq("aktivitas_id", aktivitasId)
          .eq("materi_id", materiId)
          .eq("status", "selesai")
          .order("selesai_at", { ascending: false });

        if (error) throw error;
        if (cancelled) return;

        const attemptList = attempts ?? [];

        // =========================
        // AMBIL BINTANG
        // =========================
        const attemptIds = attemptList.map((item) => item.id);

        let starsMap: Record<string, number> = {};

        if (attemptIds.length > 0) {
          const { data: stars, error: starError } = await supabase
            .from("riwayat_bintang")
            .select("percobaan_id, jumlah_bintang")
            .in("percobaan_id", attemptIds);

          if (starError) throw starError;

          (stars ?? []).forEach((item) => {
            starsMap[String(item.percobaan_id)] = Number(
              item.jumlah_bintang ?? 0,
            );
          });
        }

        if (cancelled) return;

        setRiwayat(
          attemptList.map((item) => ({
            ...item,
            nilai: Number(item.nilai ?? 0),
            xp_diperoleh: Number(item.xp_diperoleh ?? 0),
            jumlah_benar: Number(item.jumlah_benar ?? 0),
            jumlah_salah: Number(item.jumlah_salah ?? 0),
            jumlah_bintang: starsMap[String(item.id)] ?? 0,
          })),
        );
      } catch (error: any) {
        console.error("Gagal mengambil riwayat Formatif:", error);

        if (!cancelled) {
          setErrorMessage(
            error?.message || "Gagal mengambil riwayat pengerjaan.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadRiwayat();

    return () => {
      cancelled = true;
    };
  }, [aktivitasId, materiId]);

  // =========================
  // STATISTIK
  // =========================
  const statistik = useMemo(() => {
    const total = riwayat.length;

    const rataRata =
      total > 0
        ? Math.round(riwayat.reduce((sum, item) => sum + item.nilai, 0) / total)
        : 0;

    const nilaiTertinggi =
      total > 0 ? Math.max(...riwayat.map((item) => item.nilai)) : 0;

    const totalXP = riwayat.reduce((sum, item) => sum + item.xp_diperoleh, 0);

    return {
      total,
      rataRata,
      nilaiTertinggi,
      totalXP,
    };
  }, [riwayat]);

  // =========================
  // FORMAT TANGGAL
  // =========================
  const formatTanggal = (tanggal?: string) => {
    if (!tanggal) return "-";

    return new Date(tanggal).toLocaleString("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-12 text-center">
        <Loader2
          size={30}
          className="mx-auto mb-4 animate-spin text-[#172554]"
        />

        <p className="text-sm text-slate-500">Memuat riwayat formatif...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-10">
      {/* HEADER */}
      <div>
        <button
          onClick={onBack}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#172554]"
        >
          <ChevronLeft size={18} />
          Kembali ke Materi
        </button>

        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#172554]/5 text-[#172554]">
            <ClipboardList size={28} />
          </div>

          <div>
            <h1 className="mt-1 text-2xl font-bold text-slate-800 md:text-3xl">
              Riwayat Formatif
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {materiNama}
            </p>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* STATISTIK */}
      {!errorMessage && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<ClipboardList size={22} />}
            title="Total Percobaan"
            value={statistik.total}
          />

          <StatCard
            icon={<TrendingUp size={22} />}
            title="Rata-rata Nilai"
            value={`${statistik.rataRata}`}
          />

          <StatCard
            icon={<Award size={22} />}
            title="Nilai Tertinggi"
            value={`${statistik.nilaiTertinggi}`}
          />

          <StatCard
            icon={<Trophy size={22} />}
            title="Total XP"
            value={`${statistik.totalXP} XP`}
          />
        </div>
      )}

      {/* RIWAYAT */}
      {!errorMessage && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800">
              Semua Percobaan
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Riwayat pengerjaan formatif pada materi ini.
            </p>
          </div>

          {/* EMPTY STATE */}
          {riwayat.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400">
                <BookOpen size={28} />
              </div>

              <h3 className="mt-4 font-semibold text-slate-700">
                Belum Ada Riwayat
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Kamu belum pernah mengerjakan formatif pada materi ini.
              </p>

              <button
                onClick={onBack}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#172554] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24366f]"
              >
                <ChevronLeft size={17} />
                Kembali ke Materi
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {riwayat.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 p-5 transition hover:border-slate-300 hover:shadow-sm"
                >
                  {/* HEADER CARD */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#172554]/5 text-[#172554]">
                        <ClipboardList size={21} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-800">
                          Percobaan {riwayat.length - index}
                        </h3>

                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                          <CalendarDays size={14} />
                          {formatTanggal(item.selesai_at)}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`rounded-xl px-4 py-2 text-center ${
                        item.nilai >= 75
                          ? "bg-emerald-50 text-emerald-700"
                          : item.nilai >= 60
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      <p className="text-xs">Nilai</p>

                      <p className="text-xl font-bold">{item.nilai}</p>
                    </div>
                  </div>

                  {/* DETAIL */}
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <DetailItem
                      icon={<CheckCircle2 size={17} />}
                      label="Jawaban Benar"
                      value={`${item.jumlah_benar}`}
                      color="text-emerald-600"
                    />

                    <DetailItem
                      icon={<XCircle size={17} />}
                      label="Jawaban Salah"
                      value={`${item.jumlah_salah}`}
                      color="text-rose-600"
                    />

                    <DetailItem
                      icon={<Trophy size={17} />}
                      label="XP"
                      value={`+${item.xp_diperoleh}`}
                      color="text-amber-600"
                    />

                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Star size={17} />
                        <span className="text-xs">Bintang</span>
                      </div>

                      <div className="mt-2 flex gap-0.5">
                        {[1, 2, 3].map((star) => (
                          <Star
                            key={star}
                            size={17}
                            className={
                              star <= item.jumlah_bintang
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* STATUS REWARD */}
                  <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
                    {item.reward_claimed ? (
                      <>
                        <CheckCircle2 size={16} className="text-emerald-500" />

                        <span className="text-xs text-emerald-600">
                          Reward berhasil diklaim pada percobaan ini.
                        </span>
                      </>
                    ) : (
                      <>
                        <Star size={16} className="text-slate-400" />

                        <span className="text-xs text-slate-500">
                          Tidak ada reward tambahan pada percobaan ini.
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =========================
// STAT CARD
// =========================
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

// =========================
// DETAIL ITEM
// =========================
function DetailItem({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className={`flex items-center gap-1.5 ${color}`}>
        {icon}

        <span className="text-xs text-slate-500">{label}</span>
      </div>

      <p className={`mt-2 text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}
