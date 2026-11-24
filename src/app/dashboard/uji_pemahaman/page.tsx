"use client";

import { useRouter } from "next/navigation";
import {
  Rocket,
  Target,
  ArrowRight,
  Sparkles,
  ClipboardList,
  BookOpen,
  Gamepad2,
  GraduationCap,
} from "lucide-react";
import DashboardContainer from "@/components/layouts/dashboard/DashboardContainer";

const activities = [
  {
    id: 1,
    title: "Diagnostik",
    subtitle: "Kenali Kemampuan Awal",
    description:
      "Uji pengetahuan awalmu mengenai Tata Surya sebelum memulai rangkaian pembelajaran.",
    icon: ClipboardList,
    emoji: "🔭",
    image: "/images/materi/materi-01.jpg",
    color: "bg-indigo-50",
    iconColor: "text-indigo-600",
    tag: "PRE-TEST",
    route: "/dashboard/diagnostik",
  },
  {
    id: 2,
    title: "Formatif",
    subtitle: "Uji Pemahamanmu",
    description:
      "Evaluasi pemahamanmu terhadap konsep yang telah dipelajari dari 8 materi Tata Surya.",
    icon: BookOpen,
    emoji: "📚",
    image: "/images/materi/materi-02.jpg",
    color: "bg-emerald-50",
    iconColor: "text-emerald-600",
    tag: "LEARNING CHECK",
    route: "/dashboard/formatif",
  },
  {
    id: 3,
    title: "Game",
    subtitle: "Jelajahi Tata Surya",
    description:
      "Jelajahi ruang angkasa melalui permainan interaktif dan selesaikan tantangan seru.",
    icon: Gamepad2,
    emoji: "🪐",
    image: "/images/materi/materi-04.jpg",
    color: "bg-amber-50",
    iconColor: "text-amber-600",
    tag: "SPACE ADVENTURE",
    route: "/dashboard/games",
  },
  {
    id: 4,
    title: "Sumatif",
    subtitle: "Evaluasi Akhir Pembelajaran",
    description:
      "Ukur penguasaanmu terhadap keseluruhan 8 materi Tata Surya melalui evaluasi akhir.",
    icon: GraduationCap,
    emoji: "🏆",
    image: "/images/materi/materi-08.jpg",
    color: "bg-rose-50",
    iconColor: "text-rose-600",
    tag: "FINAL ASSESSMENT",
    route: "/dashboard/sumatif",
  },
];

export default function UjiPemahamanPage() {
  const router = useRouter();

  return (
    <DashboardContainer>
      <div className="space-y-8 pb-10">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-3xl bg-[#101F38] px-6 py-8 sm:px-10 sm:py-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute bottom-0 right-24 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            {/* HERO TEXT */}
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Uji Pemahaman
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Jelajahi Tata Surya melalui 8 materi pembelajaran dan ikuti
                berbagai aktivitas untuk menguji, memperkuat, serta mengevaluasi
                pemahamanmu.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#101F38]">
                  <Rocket size={17} />8 Materi Pembelajaran
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white">
                  <Target size={17} />4 Aktivitas Utama
                </div>
              </div>
            </div>

            {/* HERO ILLUSTRATION */}
            <div className="relative flex min-h-[220px] items-center justify-center">
              <div className="absolute h-56 w-56 rounded-full border border-white/10" />
              <div className="absolute h-40 w-40 rounded-full border border-white/10" />
              <div className="absolute h-28 w-28 rounded-full border border-dashed border-white/20" />

              <div className="absolute left-[15%] top-[18%] text-3xl text-white/70">
                ✦
              </div>

              <div className="absolute right-[15%] top-[22%] text-xl text-blue-200">
                ✦
              </div>

              <div className="absolute bottom-[18%] left-[20%] text-xl text-white/60">
                ✦
              </div>

              <div className="z-10 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-orange-500 text-5xl shadow-[0_0_60px_rgba(251,191,36,0.25)]">
                ☀️
              </div>

              <div className="absolute right-[18%] top-[32%] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-300 to-blue-600 text-3xl shadow-lg">
                🌍
              </div>

              <div className="absolute bottom-[20%] left-[18%] flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-300 to-rose-600 text-2xl shadow-lg">
                🪐
              </div>

              <div className="absolute right-[12%] bottom-[14%] text-2xl">
                ☄️
              </div>
            </div>
          </div>
        </section>

        {/* ACTIVITY SECTION */}
        <section className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#101F38]">
              Aktivitas Pembelajaran
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Selesaikan setiap aktivitas untuk memperkuat pemahamanmu mengenai
              seluruh materi Tata Surya.
            </p>
          </div>

          {/* ACTIVITY GRID */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {activities.map((activity) => {
              const Icon = activity.icon;

              return (
                <article
                  key={activity.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_15px_40px_rgba(15,23,42,0.08)]"
                >
                  {/* IMAGE */}
                  <div className="relative h-52 overflow-hidden bg-[#0B1220]">
                    <img
                      src={activity.image}
                      alt={activity.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/80 via-transparent to-[#0B1220]/10" />

                    {/* ICON */}
                    <div
                      className={`absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-xl ${activity.color} text-2xl shadow-sm`}
                    >
                      {activity.emoji}
                    </div>

                    {/* LABEL */}
                    <div className="absolute bottom-4 left-4">
                      <span className="font-mono text-[10px] font-medium tracking-[0.2em] text-cyan-200">
                        {activity.tag}
                      </span>

                      <h3 className="mt-1 text-2xl font-semibold text-white">
                        {activity.title}
                      </h3>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-2">
                      <Icon size={17} className={activity.iconColor} />

                      <p className="text-sm font-semibold text-[#101F38]">
                        {activity.subtitle}
                      </p>
                    </div>

                    <p className="mt-3 min-h-[48px] text-sm leading-6 text-slate-500">
                      {activity.description}
                    </p>

                    {/* FOOTER */}
                    <div className="mt-5 flex items-center justify-end border-t border-slate-100 pt-4">
                      <button
                        onClick={() => router.push(activity.route)}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#101F38] px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-[#1B3358]"
                      >
                        Mulai Aktivitas
                        <ArrowRight
                          size={15}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </DashboardContainer>
  );
}
