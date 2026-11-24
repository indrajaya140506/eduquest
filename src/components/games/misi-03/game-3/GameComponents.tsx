"use client";

import type { ReactNode } from "react";
import DashboardContainer from "@/components/layouts/dashboard/DashboardContainer";
import { Star, Zap, Package, Radio, Timer, CheckCircle2 } from "lucide-react";
import type { Collectible, Point } from "./GameData";

export function GameContainer({ children }: { children: ReactNode }) {
  return (
    <DashboardContainer className="relative w-full">
      <div className="relative isolate min-h-[600px] w-full overflow-hidden bg-[#070C18] text-white">
        {children}
      </div>
    </DashboardContainer>
  );
}

export function SpaceBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#070C18]" />
      <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/[.05] blur-[100px]" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-500/[.05] blur-[100px]" />

      {Array.from({ length: 45 }).map((_, index) => (
        <span
          key={index}
          className="absolute h-1 w-1 rounded-full bg-white/20"
          style={{
            left: `${(index * 37) % 100}%`,
            top: `${(index * 53) % 100}%`,
          }}
        />
      ))}
    </div>
  );
}

export function RescueHUD({
  xp,
  collected,
  generatorActive,
  elapsed,
  answeredQuestions,
  totalQuestions,
}: {
  xp: number;
  collected: number;
  generatorActive: boolean;
  elapsed: number;
  answeredQuestions: number;
  totalQuestions: number;
}) {
  const items = [
    {
      label: "Total XP",
      value: `${xp} XP`,
      icon: <Zap size={16} />,
      color: "text-amber-300",
    },
    {
      label: "Components",
      value: `${collected}/3`,
      icon: <Package size={16} />,
      color: "text-cyan-300",
    },
    {
      label: "Quiz Progress",
      value: `${answeredQuestions}/${totalQuestions}`,
      icon: <CheckCircle2 size={16} />,
      color: "text-violet-300",
    },
    {
      label: "Generator",
      value: generatorActive ? "ONLINE" : "OFFLINE",
      icon: <Radio size={16} />,
      color: generatorActive ? "text-emerald-300" : "text-rose-300",
    },
    {
      label: "Mission Time",
      value: `${Math.floor(elapsed / 60)
        .toString()
        .padStart(2, "0")}:${(elapsed % 60).toString().padStart(2, "0")}`,
      icon: <Timer size={16} />,
      color: "text-blue-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-white/[.07] bg-white/[.025] p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase tracking-wider text-white/40">
              {item.label}
            </span>
            <span className={item.color}>{item.icon}</span>
          </div>

          <p className={`mt-2 text-lg font-black ${item.color}`}>
            {item.value}
          </p>

          {item.label === "Quiz Progress" && (
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-violet-400 transition-all"
                style={{
                  width: `${
                    totalQuestions > 0
                      ? (answeredQuestions / totalQuestions) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function StationMap({
  player,
  collectibles,
  collectedIds,
  generatorActive,
  rescueUnlocked,
  nearby,
}: {
  player: Point;
  collectibles: Collectible[];
  collectedIds: number[];
  generatorActive: boolean;
  rescueUnlocked: boolean;
  nearby: string | null;
}) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-cyan-400/15 bg-[#101D2D] sm:aspect-[16/9]">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(100,180,220,.13) 1px, transparent 1px), linear-gradient(90deg, rgba(100,180,220,.13) 1px, transparent 1px)",
          backgroundSize: "35px 35px",
        }}
      />

      <div className="absolute inset-[3%] rounded-xl border-2 border-slate-500/40" />

      {/* Generator room */}
      <div className="absolute left-[56%] top-[5%] flex h-[26%] w-[29%] flex-col items-center justify-center rounded-xl border border-blue-300/20 bg-blue-950/60">
        <span className="text-2xl">⚡</span>
        <span className="mt-1 text-[9px] font-bold text-blue-200">
          GENERATOR ROOM
        </span>
        <span
          className={`mt-1 text-[8px] ${
            generatorActive ? "text-emerald-300" : "text-rose-300"
          }`}
        >
          {generatorActive ? "ONLINE" : "OFFLINE"}
        </span>
      </div>

      {/* Rescue room */}
      <div
        className={`absolute bottom-[5%] right-[5%] flex h-[25%] w-[27%] flex-col items-center justify-center rounded-xl border ${
          rescueUnlocked
            ? "border-emerald-400/40 bg-emerald-950/50"
            : "border-white/10 bg-slate-900/70"
        }`}
      >
        <span className="text-2xl">{rescueUnlocked ? "🧑‍🚀" : "🔒"}</span>
        <span className="mt-1 text-[9px] font-bold text-white/70">
          RESCUE ROOM
        </span>
        <span className="text-[8px] text-white/40">
          {rescueUnlocked ? "ACCESS GRANTED" : "LOCKED"}
        </span>
      </div>

      {/* Penghalang visual */}
      <div className="absolute left-[39%] top-[15%] h-[22%] w-[5%] rounded bg-slate-600/50" />
      <div className="absolute left-[19%] top-[55%] h-[5%] w-[25%] rounded bg-slate-600/50" />
      <div className="absolute left-[78%] top-[45%] h-[20%] w-[5%] rounded bg-slate-600/50" />

      {/* Collectibles */}
      {collectibles.map((item) => {
        if (collectedIds.includes(item.id)) return null;

        return (
          <div
            key={item.id}
            className="absolute z-10 grid -translate-x-1/2 -translate-y-1/2 place-items-center"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
          >
            <span className="animate-pulse text-2xl drop-shadow-[0_0_12px_rgba(34,211,238,.8)]">
              {item.icon}
            </span>
          </div>
        );
      })}

      {!generatorActive && (
        <div className="absolute left-[70%] top-[18%] -translate-x-1/2 -translate-y-1/2 text-xl">
          🛠️
        </div>
      )}

      {/* Astronaut */}
      <div
        className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-100"
        style={{ left: `${player.x}%`, top: `${player.y}%` }}
      >
        <div className="relative flex flex-col items-center">
          <span className="text-3xl drop-shadow-[0_0_14px_rgba(34,211,238,.8)] sm:text-4xl">
            🧑‍🚀
          </span>
          <span className="mt-0.5 h-1 w-5 rounded-full bg-cyan-300/60 blur-sm" />
        </div>
      </div>

      {nearby && (
        <div className="absolute bottom-3 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-lg border border-cyan-300/30 bg-slate-950/90 px-3 py-2 text-[10px] font-bold text-cyan-200 shadow-lg">
          Tekan E untuk {nearby}
        </div>
      )}

      <div className="absolute left-3 top-3 rounded-lg border border-white/10 bg-slate-950/70 px-2 py-1 text-[9px] text-white/50">
        SPACE STATION · SECTOR 01
      </div>
    </div>
  );
}

export function MissionPanel({
  collected,
  generatorActive,
  rescueUnlocked,
  questionProgress,
  collectibles,
  totalQuestions,
}: {
  collected: number;
  generatorActive: boolean;
  rescueUnlocked: boolean;
  questionProgress: Record<number, number>;
  collectibles: Collectible[];
  totalQuestions: number;
}) {
  const answeredQuestions = Object.values(questionProgress).reduce(
    (total, value) => total + value,
    0,
  );

  const tasks = [
    {
      text: "Kumpulkan 3 komponen perbaikan",
      done: collected >= 3,
    },
    {
      text: "Selesaikan semua soal komponen",
      done: answeredQuestions >= totalQuestions,
    },
    {
      text: "Aktifkan generator stasiun",
      done: generatorActive,
    },
    {
      text: "Buka ruang penyelamatan",
      done: rescueUnlocked,
    },
  ];

  return (
    <div className="rounded-2xl border border-white/[.07] bg-white/[.025] p-4">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[.18em] text-cyan-300">
        Mission Objectives
      </p>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.text} className="flex items-center gap-3">
            <span
              className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] ${
                task.done
                  ? "bg-emerald-400/15 text-emerald-300"
                  : "bg-white/5 text-white/30"
              }`}
            >
              {task.done ? "✓" : "•"}
            </span>

            <span
              className={`text-xs ${
                task.done ? "text-emerald-200" : "text-white/55"
              }`}
            >
              {task.text}
            </span>
          </div>
        ))}
      </div>

      <div className="my-4 border-t border-white/[.07]" />

      <p className="mb-3 text-[10px] font-bold uppercase tracking-[.18em] text-white/40">
        Component Quiz Progress
      </p>

      <div className="space-y-4">
        {collectibles.map((item) => {
          const progress = questionProgress[item.id] ?? 0;
          const total =
            totalQuestions > 0
              ? Math.max(
                  1,
                  // Jumlah soal tiap komponen ditampilkan dari progress yang tersedia.
                  progress,
                )
              : 1;

          const componentDone = collected >= 3 ? progress > 0 : progress >= 4;

          return (
            <div key={item.id}>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-xs font-semibold text-white/70">
                  <span>{item.icon}</span>
                  {item.name}
                </span>

                <span className="text-[10px] tabular-nums text-cyan-300">
                  {progress}/4
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-all ${
                    componentDone ? "bg-emerald-400" : "bg-cyan-400"
                  }`}
                  style={{ width: `${Math.min(100, (progress / 4) * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-[10px] leading-5 text-white/35">
        Selesaikan 4 soal pada setiap komponen untuk memasukkannya ke inventory.
      </p>
    </div>
  );
}

export function RewardPanel({ xp, stars }: { xp: number; stars: number }) {
  return (
    <div className="rounded-2xl border border-amber-400/15 bg-amber-400/[.04] p-5 text-center">
      <p className="text-[10px] font-bold uppercase tracking-[.2em] text-amber-300">
        Mission Reward
      </p>

      <p className="mt-2 text-4xl font-black text-white">{xp} XP</p>

      <div className="mt-3 flex justify-center gap-2">
        {[1, 2, 3].map((value) => (
          <Star
            key={value}
            size={24}
            fill={value <= stars ? "currentColor" : "none"}
            className={value <= stars ? "text-amber-400" : "text-white/15"}
          />
        ))}
      </div>
    </div>
  );
}
