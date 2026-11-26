"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import DashboardContainer from "@/components/layouts/dashboard/DashboardContainer";
import { createClient } from "@/lib/supabase/client";

type Activity = {
  id: number;
  nama: string;
  slug: string;
};

type Attempt = {
  id: string;
  aktivitas_id: number;
  status: string | null;
};

type HistoryItem = {
  percobaan_id: string | null;
  jumlah_xp?: number;
  jumlah_bintang?: number;
};

type ActivityStat = {
  xp: number;
  stars: number;
  count: number;
};

type ActivityCategory = {
  key: string;
  title: string;
  description: string;
};

const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  {
    key: "diagnostik",
    title: "Diagnostik",
    description: "Tes kemampuan awal",
  },
  {
    key: "formatif",
    title: "Formatif",
    description: "Latihan dan pemahaman materi",
  },
  {
    key: "game",
    title: "Game",
    description: "Aktivitas belajar interaktif",
  },
  {
    key: "sumatif",
    title: "Sumatif",
    description: "Evaluasi hasil pembelajaran",
  },
];

const EMPTY_STATS: Record<string, ActivityStat> = {
  diagnostik: { xp: 0, stars: 0, count: 0 },
  formatif: { xp: 0, stars: 0, count: 0 },
  game: { xp: 0, stars: 0, count: 0 },
  sumatif: { xp: 0, stars: 0, count: 0 },
};

function formatNumber(value: number) {
  return value.toLocaleString("id-ID");
}

function getCategory(slug?: string | null, name?: string | null) {
  const text = `${slug ?? ""} ${name ?? ""}`.toLowerCase();

  if (text.includes("diagnostik")) return "diagnostik";
  if (text.includes("formatif")) return "formatif";
  if (text.includes("sumatif")) return "sumatif";

  if (
    text.includes("game") ||
    text.includes("permainan") ||
    text.includes("gamifikasi")
  ) {
    return "game";
  }

  return null;
}

export default function DashboardPage() {
  const supabase = useMemo(() => createClient(), []);

  const [userName, setUserName] = useState("Pengguna");
  const [totalXP, setTotalXP] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [activityStats, setActivityStats] =
    useState<Record<string, ActivityStat>>(EMPTY_STATS);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        setUserName("Pengguna");
        setTotalXP(0);
        setTotalStars(0);
        setActivityStats({ ...EMPTY_STATS });
        return;
      }

      const [xpResult, starResult, attemptResult, activityResult] =
        await Promise.all([
          supabase
            .from("riwayat_xp")
            .select("jumlah_xp, percobaan_id")
            .eq("user_id", user.id),

          supabase
            .from("riwayat_bintang")
            .select("jumlah_bintang, percobaan_id")
            .eq("user_id", user.id),

          supabase
            .from("percobaan_aktivitas")
            .select("id, aktivitas_id, status")
            .eq("user_id", user.id)
            .eq("status", "selesai"),

          supabase.from("aktivitas_belajar").select("id, nama, slug"),
        ]);

      if (xpResult.error) throw xpResult.error;
      if (starResult.error) throw starResult.error;
      if (attemptResult.error) throw attemptResult.error;
      if (activityResult.error) throw activityResult.error;

      setUserName(
        user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Pengguna",
      );

      const xpHistory = (xpResult.data || []) as HistoryItem[];
      const starHistory = (starResult.data || []) as HistoryItem[];
      const attempts = (attemptResult.data || []) as Attempt[];
      const activities = (activityResult.data || []) as Activity[];

      // Total XP dan bintang seluruh aktivitas pengguna
      const xpTotal = xpHistory.reduce(
        (total, item) => total + Number(item.jumlah_xp || 0),
        0,
      );

      const starTotal = starHistory.reduce(
        (total, item) => total + Number(item.jumlah_bintang || 0),
        0,
      );

      setTotalXP(xpTotal);
      setTotalStars(starTotal);

      // Hubungkan aktivitas dengan percobaan yang sudah selesai
      const activityMap = new Map(
        activities.map((activity) => [activity.id, activity]),
      );

      const attemptCategoryMap = new Map<string, string>();

      const stats: Record<string, ActivityStat> = {
        diagnostik: { xp: 0, stars: 0, count: 0 },
        formatif: { xp: 0, stars: 0, count: 0 },
        game: { xp: 0, stars: 0, count: 0 },
        sumatif: { xp: 0, stars: 0, count: 0 },
      };

      attempts.forEach((attempt) => {
        const activity = activityMap.get(attempt.aktivitas_id);

        const category = getCategory(activity?.slug, activity?.nama);

        if (category) {
          attemptCategoryMap.set(attempt.id, category);
          stats[category].count += 1;
        }
      });

      // Kelompokkan riwayat XP berdasarkan kategori aktivitas
      xpHistory.forEach((item) => {
        if (!item.percobaan_id) return;

        const category = attemptCategoryMap.get(item.percobaan_id);

        if (category) {
          stats[category].xp += Number(item.jumlah_xp || 0);
        }
      });

      // Kelompokkan riwayat bintang berdasarkan kategori aktivitas
      starHistory.forEach((item) => {
        if (!item.percobaan_id) return;

        const category = attemptCategoryMap.get(item.percobaan_id);

        if (category) {
          stats[category].stars += Number(item.jumlah_bintang || 0);
        }
      });

      setActivityStats(stats);
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err instanceof Error ? err.message : "Gagal mengambil data dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const totalActivities = Object.values(activityStats).reduce(
    (total, item) => total + item.count,
    0,
  );

  // Skala XP dan bintang dihitung terpisah agar keduanya terlihat jelas.
  const maxXP = Math.max(
    ...Object.values(activityStats).map((item) => item.xp),
    1,
  );

  const maxStars = Math.max(
    ...Object.values(activityStats).map((item) => item.stars),
    1,
  );

  return (
    <DashboardContainer>
      <div className="space-y-6 pb-10">
        {/* HEADER */}
        <section className="relative overflow-hidden rounded-2xl bg-[#111827] px-6 py-7 text-white shadow-sm sm:px-8">
          <div className="relative z-10">
            <p className="text-sm text-slate-300">Selamat datang kembali,</p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              {loading ? "Memuat..." : userName}
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
              Terus tingkatkan kemampuanmu dan kumpulkan pencapaian baru bersama
              EduQuest.
            </p>
          </div>

          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-2 -top-10 h-44 w-44 rounded-full border border-white/10" />
        </section>

        {/* ERROR */}
        {error && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p>{error}</p>

            <button
              onClick={loadDashboard}
              className="shrink-0 font-medium hover:underline"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* TOTAL XP DAN BINTANG */}
        <section className="grid gap-4 sm:grid-cols-2">
          {/* XP */}
          <div className="rounded-2xl border border-blue-100 bg-[#F3F7FC] p-6">
            <p className="text-sm font-medium text-slate-500">
              Total XP Terkumpul
            </p>

            <div className="mt-3 flex items-end gap-2">
              <h2 className="text-4xl font-semibold tracking-tight text-[#234A75]">
                {loading ? "..." : formatNumber(totalXP)}
              </h2>

              <span className="mb-1 text-sm font-medium text-[#527BA4]">
                XP
              </span>
            </div>

            <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-blue-100">
              <div className="h-full w-2/3 rounded-full bg-[#477EAE]" />
            </div>
          </div>

          {/* BINTANG */}
          <div className="rounded-2xl border border-amber-100 bg-[#FFFBF2] p-6">
            <p className="text-sm font-medium text-slate-500">
              Total Bintang Terkumpul
            </p>

            <div className="mt-3 flex items-end gap-2">
              <h2 className="text-4xl font-semibold tracking-tight text-[#9A7130]">
                {loading ? "..." : formatNumber(totalStars)}
              </h2>

              <span className="mb-1 text-sm font-medium text-[#B18A49]">
                Bintang
              </span>
            </div>

            <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-amber-100">
              <div className="h-full w-2/3 rounded-full bg-[#C9A45F]" />
            </div>
          </div>
        </section>

        {/* GRAFIK AKTIVITAS BELAJAR */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          {/* JUDUL GRAFIK */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Aktivitas Belajar
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Perolehan XP dan bintang dari setiap aktivitas.
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-xs text-slate-500">Aktivitas selesai</p>

              <p className="mt-0.5 text-lg font-semibold text-slate-800">
                {loading ? "..." : formatNumber(totalActivities)}
              </p>
            </div>
          </div>

          {/* LEGENDA */}
          <div className="mt-7 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-[#4C83B5]" />
              <span className="text-xs font-medium text-slate-600">XP</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-[#D4AE68]" />
              <span className="text-xs font-medium text-slate-600">
                Bintang
              </span>
            </div>
          </div>

          {/* AREA GRAFIK */}
          {loading ? (
            <div className="flex h-64 items-center justify-center text-sm text-slate-400">
              Memuat grafik aktivitas...
            </div>
          ) : (
            <div className="mt-5">
              <div className="relative h-[245px] border-b border-slate-200">
                {/* GARIS BANTU */}
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-0">
                  <div className="border-t border-dashed border-slate-100" />
                  <div className="border-t border-dashed border-slate-100" />
                  <div className="border-t border-dashed border-slate-100" />
                  <div className="border-t border-dashed border-slate-100" />
                </div>

                {/* BATANG GRAFIK */}
                <div className="relative z-10 grid h-full grid-cols-4 gap-2 sm:gap-6">
                  {ACTIVITY_CATEGORIES.map((category) => {
                    const stat = activityStats[category.key] || {
                      xp: 0,
                      stars: 0,
                      count: 0,
                    };

                    const xpHeight =
                      stat.xp > 0 ? Math.max((stat.xp / maxXP) * 190, 5) : 3;

                    const starHeight =
                      stat.stars > 0
                        ? Math.max((stat.stars / maxStars) * 190, 5)
                        : 3;

                    const isActive = hoveredCategory === category.key;

                    return (
                      <div
                        key={category.key}
                        className="group relative flex min-w-0 flex-col justify-end"
                        onMouseEnter={() => setHoveredCategory(category.key)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        onFocus={() => setHoveredCategory(category.key)}
                        onBlur={() => setHoveredCategory(null)}
                        tabIndex={0}
                        role="button"
                        aria-label={`${category.title}: ${formatNumber(stat.xp)} XP dan ${formatNumber(stat.stars)} bintang`}
                      >
                        {/* TOOLTIP */}
                        <div
                          className={`pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-30 w-[155px] -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-3 shadow-lg transition-all duration-150 ${
                            isActive
                              ? "visible translate-y-0 opacity-100"
                              : "invisible translate-y-2 opacity-0"
                          }`}
                        >
                          <p className="mb-2 text-xs font-semibold text-slate-800">
                            {category.title}
                          </p>

                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-slate-500">XP</span>
                            <span className="text-sm font-semibold text-[#477EAE]">
                              {formatNumber(stat.xp)}
                            </span>
                          </div>

                          <div className="mt-1 flex items-center justify-between gap-2">
                            <span className="text-xs text-slate-500">
                              Bintang
                            </span>
                            <span className="text-sm font-semibold text-[#B18A49]">
                              {formatNumber(stat.stars)}
                            </span>
                          </div>

                          <div className="mt-2 border-t border-slate-100 pt-2">
                            <p className="text-[11px] text-slate-400">
                              {formatNumber(stat.count)} aktivitas selesai
                            </p>
                          </div>
                        </div>

                        {/* DUA BATANG */}
                        <div className="flex h-full items-end justify-center gap-2 pb-0">
                          <div
                            className="w-[22%] max-w-[34px] rounded-t-md bg-[#4C83B5] transition-all duration-300 group-hover:bg-[#315F8C]"
                            style={{ height: `${xpHeight}px` }}
                            title={`XP: ${formatNumber(stat.xp)}`}
                          />

                          <div
                            className="w-[22%] max-w-[34px] rounded-t-md bg-[#D4AE68] transition-all duration-300 group-hover:bg-[#B9914E]"
                            style={{ height: `${starHeight}px` }}
                            title={`Bintang: ${formatNumber(stat.stars)}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* LABEL EMPAT AKTIVITAS */}
              <div className="grid grid-cols-4 gap-2 pt-3 sm:gap-6">
                {ACTIVITY_CATEGORIES.map((category) => {
                  const stat = activityStats[category.key];

                  return (
                    <button
                      key={category.key}
                      type="button"
                      onMouseEnter={() => setHoveredCategory(category.key)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      onFocus={() => setHoveredCategory(category.key)}
                      onBlur={() => setHoveredCategory(null)}
                      className={`rounded-lg px-1 py-2 text-center transition ${
                        hoveredCategory === category.key
                          ? "bg-slate-50"
                          : "bg-transparent"
                      }`}
                    >
                      <p className="text-xs font-semibold text-slate-700 sm:text-sm">
                        {category.title}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400 sm:text-xs">
                        {formatNumber(stat.count)} aktivitas
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-400">
              Berdasarkan riwayat XP dan bintang aktivitas selesai.
            </p>

            <button
              onClick={loadDashboard}
              disabled={loading}
              className="text-xs font-medium text-[#397B9A] transition hover:text-[#285B73] disabled:opacity-50"
            >
              {loading ? "Memuat..." : "Perbarui data"}
            </button>
          </div>
        </section>
      </div>
    </DashboardContainer>
  );
}
