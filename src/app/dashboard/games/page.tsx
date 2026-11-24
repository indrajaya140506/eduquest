import Link from "next/link";
import { Rocket, ArrowRight, Lock } from "lucide-react";
import DashboardContainer from "@/components/layouts/dashboard/DashboardContainer";

const games = [
  {
    number: "01",
    title: "Planet Explorer",
    description: "Jelajahi planet dan uji pengetahuanmu tentang tata surya.",
    href: "/dashboard/games/game-1",
    available: true,
    icon: "🌌",
  },
  {
    number: "02",
    title: "Asteroid Quiz",
    description: "Jawab pertanyaan dengan cepat dan hindari asteroid.",
    href: "/dashboard/games/game-2",
    available: true,
    icon: "☄️",
  },
  {
    number: "03",
    title: "Space Mission",
    description: "Selesaikan tantangan untuk menuntaskan misi luar angkasa.",
    href: "/dashboard/games/game-3",
    available: false,
    icon: "🚀",
  },
];

export default function GamesPage() {
  return (
    <DashboardContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Games</h1>
          <p className="mt-1 text-sm text-slate-500">
            Jelajahi game edukasi dan kumpulkan reward selama belajar.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {games.map((game) => (
            <div
              key={game.number}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-44 items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900">
                <span className="text-6xl transition group-hover:scale-110">
                  {game.icon}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wider text-slate-400">
                    GAME {game.number}
                  </span>

                  {game.available ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                      Available
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-400">
                      Coming Soon
                    </span>
                  )}
                </div>

                <h2 className="mt-3 text-lg font-bold text-slate-900">
                  {game.title}
                </h2>

                <p className="mt-2 min-h-[44px] text-sm leading-6 text-slate-500">
                  {game.description}
                </p>

                <div className="mt-5">
                  {game.available ? (
                    <Link
                      href={game.href}
                      className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      <Rocket size={16} />
                      Mainkan Game
                      <ArrowRight size={16} />
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-400"
                    >
                      <Lock size={15} />
                      Belum Tersedia
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardContainer>
  );
}
