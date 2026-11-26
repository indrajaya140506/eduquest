"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
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
    image: "/images/uji_pemahaman/diagnostik.jpg",

    route: "/dashboard/diagnostik",
  },
  {
    id: 2,
    title: "Formatif",
    subtitle: "Uji Pemahamanmu",
    description:
      "Evaluasi pemahamanmu terhadap konsep yang telah dipelajari dari 8 materi Tata Surya.",
    icon: BookOpen,
    image: "/images/uji_pemahaman/formatif.jpg",

    route: "/dashboard/formatif",
  },
  {
    id: 3,
    title: "Game",
    subtitle: "bermain sambil belajar",
    description:
      "Jelajahi ruang angkasa melalui permainan interaktif dan selesaikan tantangan seru.",
    icon: Gamepad2,
    image: "/images/uji_pemahaman/game.jpg",

    route: "/dashboard/games",
  },
  {
    id: 4,
    title: "Sumatif",
    subtitle: "Evaluasi Akhir Pembelajaran",
    description:
      "Ukur penguasaanmu terhadap keseluruhan 8 materi Tata Surya melalui evaluasi akhir.",
    icon: GraduationCap,
    image: "/images/uji_pemahaman/sumatif.jpg",

    route: "/dashboard/sumatif",
  },
];

export default function UjiPemahamanPage() {
  const router = useRouter();

  return (
    <DashboardContainer>
      <div className="space-y-8 pb-10">
        {/* HERO SECTION */}
        <section className="w-full rounded-2xl bg-[#101F38] px-6 py-5 sm:px-8 sm:py-6">
          <div className="w-full">
            <h2 className="text-2xl font-semibold text-white">Uji Pemahaman</h2>

            <p className="mt-2 text-sm leading-5 text-slate-300 sm:text-base">
              Ayo uji pemahamanmu sekarang melalui 4 aktivitas yg tersedia!
            </p>
          </div>
        </section>

        {/* ACTIVITY SECTION */}
        <section className="space-y-5">
          <div>
            <h2 className="text-2xl font-semibold text-black">
              Aktivitas Pembelajaran
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Pilih aktivitas dan mulai tingkatkan pemahamanmu mengenai seluruh
              materi Tata Surya.
            </p>
          </div>

          {/* ACTIVITY GRID */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {activities.map((activity) => {
              const Icon = activity.icon;

              return (
                <article
                  key={activity.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50"
                >
                  {/* IMAGE */}
                  <div className="relative h-48 overflow-hidden bg-slate-100 sm:h-52">
                    <img
                      src={activity.image}
                      alt={activity.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#101F38]/75 via-transparent to-transparent" />

                    <div className="absolute bottom-4 left-5">
                      <span className="text-[10px] font-medium tracking-[0.16em] text-blue-200">
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
                      <Icon
                        size={16}
                        strokeWidth={1.8}
                        className="text-[#527BA4]"
                      />

                      <h4 className="text-sm font-semibold text-[#101F38]">
                        {activity.subtitle}
                      </h4>
                    </div>

                    <p className="mt-3 min-h-[48px] text-sm leading-6 text-slate-500">
                      {activity.description}
                    </p>

                    {/* FOOTER */}
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs text-slate-400">
                        Aktivitas {String(activity.id).padStart(2, "0")}
                      </span>

                      <button
                        onClick={() => router.push(activity.route)}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#101F38] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1B3358]"
                      >
                        Mulai Aktivitas
                        <ArrowRight
                          size={15}
                          strokeWidth={1.8}
                          className="transition-transform group-hover:translate-x-1"
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
