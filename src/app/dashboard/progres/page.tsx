import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import DashboardContainer from "@/components/layouts/dashboard/DashboardContainer";
import {
  Zap,
  Star,
  Brain,
  BookOpen,
  Gamepad2,
  GraduationCap,
  Clock,
  History,
  ChevronDown,
  Activity as ActivityIcon,
} from "lucide-react";

export const instant = false;

type Activity = {
  id: number;
  nama: string;
  slug: string;
};

type Material = {
  id: number;
  judul: string;
  urutan: number;
};

type Attempt = {
  id: string;
  user_id: string;
  aktivitas_id: number;
  materi_id: number | null;
  nilai: number | null;
  status: string | null;
  mulai_at: string | null;
  selesai_at: string | null;
};

type XPHistory = {
  percobaan_id: string | null;
  jumlah_xp: number;
};

type StarHistory = {
  percobaan_id: string | null;
  jumlah_bintang: number;
};

const ACTIVITY_CATEGORIES = [
  {
    key: "diagnostik",
    title: "Diagnostik",
    description: "Riwayat tes diagnostik",
    icon: Brain,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    key: "formatif",
    title: "Formatif",
    description: "Riwayat latihan formatif",
    icon: BookOpen,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    key: "game",
    title: "Game",
    description: "Riwayat permainan",
    icon: Gamepad2,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-100",
  },
  {
    key: "sumatif",
    title: "Sumatif",
    description: "Riwayat evaluasi sumatif",
    icon: GraduationCap,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
  },
];

function formatDate(date: string | null) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

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

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center">
      <History className="mx-auto h-7 w-7 text-slate-300" />
      <p className="mt-2 text-sm text-slate-500">{message}</p>
    </div>
  );
}

export default async function ProgresBelajarPage() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // =========================================
  // AMBIL RIWAYAT PERCOBAAN USER
  // =========================================

  const [attemptResult, activityResult, xpResult, starResult] =
    await Promise.all([
      supabase
        .from("percobaan_aktivitas")
        .select(
          "id, user_id, aktivitas_id, materi_id, nilai, status, mulai_at, selesai_at",
        )
        .eq("user_id", user.id)
        .eq("status", "selesai")
        .order("selesai_at", { ascending: false }),

      supabase.from("aktivitas_belajar").select("id, nama, slug"),

      supabase
        .from("riwayat_xp")
        .select("percobaan_id, jumlah_xp")
        .eq("user_id", user.id),

      supabase
        .from("riwayat_bintang")
        .select("percobaan_id, jumlah_bintang")
        .eq("user_id", user.id),
    ]);

  const attempts: Attempt[] = attemptResult.data ?? [];
  const activities: Activity[] = activityResult.data ?? [];
  const xpHistory: XPHistory[] = xpResult.data ?? [];
  const starHistory: StarHistory[] = starResult.data ?? [];

  // =========================================
  // AMBIL NAMA MATERI SESUAI PERCOBAAN
  // =========================================

  const materialIds = [
    ...new Set(
      attempts
        .map((attempt) => attempt.materi_id)
        .filter((id): id is number => id !== null),
    ),
  ];

  let materials: Material[] = [];

  if (materialIds.length > 0) {
    const materialResult = await supabase
      .from("materi")
      .select("id, judul, urutan")
      .in("id", materialIds);

    materials = materialResult.data ?? [];
  }

  // =========================================
  // TOTAL XP DAN BINTANG
  // =========================================

  const totalXP = xpHistory.reduce((total, item) => total + item.jumlah_xp, 0);

  const totalStars = starHistory.reduce(
    (total, item) => total + item.jumlah_bintang,
    0,
  );

  // =========================================
  // MAP DATA
  // =========================================

  const activityMap = new Map(
    activities.map((activity) => [activity.id, activity]),
  );

  const materialMap = new Map(
    materials.map((material) => [material.id, material]),
  );

  const xpMap = new Map<string, number>();
  const starMap = new Map<string, number>();

  xpHistory.forEach((item) => {
    if (!item.percobaan_id) return;

    xpMap.set(
      item.percobaan_id,
      (xpMap.get(item.percobaan_id) ?? 0) + item.jumlah_xp,
    );
  });

  starHistory.forEach((item) => {
    if (!item.percobaan_id) return;

    starMap.set(
      item.percobaan_id,
      (starMap.get(item.percobaan_id) ?? 0) + item.jumlah_bintang,
    );
  });

  // =========================================
  // KELOMPOKKAN RIWAYAT BERDASARKAN AKTIVITAS
  // =========================================

  const groupedAttempts = ACTIVITY_CATEGORIES.map((category) => {
    const categoryAttempts = attempts.filter((attempt) => {
      const activity = activityMap.get(attempt.aktivitas_id);

      return getCategory(activity?.slug, activity?.nama) === category.key;
    });

    const categoryXP = categoryAttempts.reduce(
      (total, attempt) => total + (xpMap.get(attempt.id) ?? 0),
      0,
    );

    const categoryStars = categoryAttempts.reduce(
      (total, attempt) => total + (starMap.get(attempt.id) ?? 0),
      0,
    );

    return {
      ...category,
      attempts: categoryAttempts,
      totalXP: categoryXP,
      totalStars: categoryStars,
    };
  });

  // =========================================
  // UI
  // =========================================

  return (
    <DashboardContainer>
      <div className="space-y-6 pb-10 pt-4">
        {/* HEADER */}
        <section>
          <p className="text-sm font-medium text-blue-600">
            Dashboard Pembelajaran
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            Progres Belajar
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Lihat pencapaian dan riwayat perjalanan belajarmu di EduQuest.
          </p>
        </section>

        {/* TOTAL XP & BINTANG */}
        <section className="grid gap-4 sm:grid-cols-2">
          {/* TOTAL XP */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#142C52] to-[#326FBB] p-5 text-white shadow-sm sm:p-6">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />

            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <Zap className="h-6 w-6 text-amber-300" />
              </div>

              <div>
                <p className="text-sm text-blue-100">Total XP Terkumpul</p>

                <h2 className="mt-1 text-3xl font-bold sm:text-4xl">
                  {formatNumber(totalXP)}
                  <span className="ml-2 text-base font-medium text-blue-100">
                    XP
                  </span>
                </h2>
              </div>
            </div>
          </div>

          {/* TOTAL BINTANG */}
          <div className="relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm sm:p-6">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-100/50" />

            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                <Star className="h-6 w-6 fill-amber-400 text-amber-500" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Total Bintang Terkumpul
                </p>

                <h2 className="mt-1 text-3xl font-bold text-slate-800 sm:text-4xl">
                  {formatNumber(totalStars)}
                  <span className="ml-2 text-base font-medium text-amber-500">
                    Bintang
                  </span>
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* RIWAYAT AKTIVITAS */}
        <section className="space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <ActivityIcon className="h-5 w-5 text-blue-600" />

              <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                Riwayat Aktivitas
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Rekap reward dan riwayat pengerjaan setiap aktivitas.
            </p>
          </div>

          <div className="space-y-3">
            {groupedAttempts.map((category) => {
              const Icon = category.icon;

              return (
                <details
                  key={category.key}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md"
                >
                  {/* HEADER KATEGORI */}
                  <summary className="flex cursor-pointer list-none items-center gap-3 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${category.bg}`}
                    >
                      <Icon className={`h-5 w-5 ${category.color}`} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-800">
                        {category.title}
                      </h3>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {category.attempts.length} aktivitas selesai
                      </p>
                    </div>

                    {/* TOTAL REWARD KATEGORI */}
                    <div className="hidden items-center gap-2 sm:flex">
                      <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-600">
                        {category.totalXP} XP
                      </span>

                      <span className="rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-600">
                        ⭐ {category.totalStars}
                      </span>
                    </div>

                    <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                  </summary>

                  {/* DETAIL RIWAYAT */}
                  <div className="border-t border-slate-100">
                    {/* REWARD MOBILE */}
                    <div className="flex flex-wrap gap-2 px-4 pt-4 sm:hidden">
                      <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                        {category.totalXP} XP
                      </span>

                      <span className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600">
                        ⭐ {category.totalStars} Bintang
                      </span>
                    </div>

                    {category.attempts.length === 0 ? (
                      <div className="p-4">
                        <EmptyState
                          message={`Belum ada riwayat ${category.title.toLowerCase()}.`}
                        />
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {category.attempts.map((attempt) => {
                          const activity = activityMap.get(
                            attempt.aktivitas_id,
                          );

                          const material = attempt.materi_id
                            ? materialMap.get(attempt.materi_id)
                            : undefined;

                          const xp = xpMap.get(attempt.id) ?? 0;
                          const stars = starMap.get(attempt.id) ?? 0;

                          return (
                            <div
                              key={attempt.id}
                              className="flex items-start gap-3 p-4 sm:p-5"
                            >
                              {/* ICON */}
                              <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${category.bg}`}
                              >
                                <Icon className={`h-5 w-5 ${category.color}`} />
                              </div>

                              {/* NAMA MATERI & DETAIL */}
                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm font-semibold leading-relaxed text-slate-800">
                                  {material?.judul ??
                                    activity?.nama ??
                                    category.title}
                                </h4>

                                <p className="mt-1 text-xs text-slate-500">
                                  {activity?.nama ?? category.title}
                                </p>

                                <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                                  <Clock className="h-3.5 w-3.5" />
                                  {formatDate(attempt.selesai_at)}
                                </p>

                                {/* NILAI */}
                                {attempt.nilai !== null && (
                                  <div className="mt-2 inline-flex rounded-md bg-slate-50 px-2.5 py-1 text-xs text-slate-600">
                                    Nilai:{" "}
                                    <span className="ml-1 font-semibold">
                                      {attempt.nilai}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* XP & BINTANG PER PERCOBAAN */}
                              <div className="flex shrink-0 flex-col items-end gap-1.5">
                                {xp > 0 && (
                                  <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
                                    <Zap className="h-3.5 w-3.5" />+{xp} XP
                                  </span>
                                )}

                                {stars > 0 && (
                                  <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">
                                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                                    +{stars}
                                  </span>
                                )}

                                {xp === 0 && stars === 0 && (
                                  <span className="text-xs text-slate-400">
                                    Tanpa reward
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        </section>
      </div>
    </DashboardContainer>
  );
}
