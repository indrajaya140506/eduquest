"use client";

import type { ReactNode } from "react";
import DashboardContainer from "@/components/layouts/dashboard/DashboardContainer";
import {
  Rocket,
  Zap,
  Trophy,
  Star,
  Sparkles,
  Timer,
  Target,
} from "lucide-react";

export function GameContainer({ children }: { children: ReactNode }) {
  return (
    <DashboardContainer className="relative w-full">
      <div className="relative isolate w-full min-w-0 overflow-hidden bg-[#070C18] text-white">
        {children}
      </div>
    </DashboardContainer>
  );
}

export function SpaceBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#070C18]" />

      <div className="absolute -right-36 -top-36 h-96 w-96 rounded-full bg-cyan-500/[0.05] blur-[100px]" />

      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-indigo-500/[0.05] blur-[100px]" />

      {Array.from({ length: 60 }).map((_, i) => (
        <span
          key={i}
          className="absolute animate-pulse rounded-full bg-white"
          style={{
            left: `${(i * 31 + 9) % 100}%`,
            top: `${(i * 47 + 13) % 100}%`,
            width: i % 7 === 0 ? 2 : 1,
            height: i % 7 === 0 ? 2 : 1,
            opacity: 0.12 + ((i * 11) % 35) / 100,
            animationDelay: `${i % 5}s`,
          }}
        />
      ))}
    </div>
  );
}

export function GameBrand() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-400/15 bg-cyan-400/[.06] text-cyan-300">
        <Rocket size={18} />
      </div>

      <div>
        <p className="text-sm font-bold tracking-[.13em]">EDUQUEST</p>
        <p className="mt-1 text-[9px] tracking-[.2em] text-white/35">
          ASTEROID SURVIVAL
        </p>
      </div>
    </div>
  );
}

export function SurvivalHUD({
  timeLeft,
  xp,
  question,
  totalQuestions,
  wave,
  active,
}: {
  timeLeft: number;
  xp: number;
  question: number;
  totalQuestions: number;
  wave: number;
  active: boolean;
}) {
  const cards = [
    {
      title: "Timer",
      value: `${timeLeft}s`,
      icon: <Timer size={16} />,
      color: timeLeft <= 3 ? "text-rose-400" : "text-cyan-400",
    },
    {
      title: "Total XP",
      value: `${xp} XP`,
      icon: <Zap size={16} />,
      color: "text-amber-300",
    },
    {
      title: "Question",
      value: `${question}/${totalQuestions}`,
      icon: <Target size={16} />,
      color: "text-violet-300",
    },
    {
      title: "Wave",
      value: wave,
      icon: <Sparkles size={16} />,
      color: "text-blue-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border border-white/[.07] bg-white/[.025] p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase tracking-[.16em] text-white/40">
              {card.title}
            </span>
            <span className={card.color}>{card.icon}</span>
          </div>

          <p className={`mt-2 text-lg font-extrabold ${card.color}`}>
            {card.value}
          </p>

          {card.title === "Timer" && (
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  timeLeft <= 3 ? "bg-rose-400" : "bg-cyan-400"
                }`}
                style={{
                  width: `${(timeLeft / 10) * 100}%`,
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function ShipScene({
  lane,
  hit,
  shipY,
  impactKey,
}: {
  lane: number;
  hit: boolean;
  shipY: number;
  impactKey: number;
}) {
  const asteroids = [
    { left: "12%", delay: "0s", duration: "5s", size: "text-2xl" },
    { left: "29%", delay: "1.5s", duration: "6s", size: "text-xl" },
    { left: "48%", delay: "0.7s", duration: "4.5s", size: "text-3xl" },
    { left: "68%", delay: "2s", duration: "5.5s", size: "text-xl" },
    { left: "85%", delay: "0.4s", duration: "6.5s", size: "text-2xl" },
  ];

  return (
    <div
      className={`relative h-[360px] overflow-hidden rounded-2xl border bg-[#0C1425] transition-all duration-300 sm:h-[420px] ${
        hit
          ? "border-rose-400/50 shadow-[inset_0_0_60px_rgba(244,63,94,.2)]"
          : "border-white/[.06]"
      }`}
    >
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_33%,rgba(255,255,255,.08)_33.2%,transparent_33.5%,transparent_66%,rgba(255,255,255,.08)_66.2%,transparent_66.5%)]" />
      </div>

      <div className="absolute inset-0 overflow-hidden">
        {asteroids.map((asteroid, index) => (
          <span
            key={index}
            className={`absolute -top-12 ${asteroid.size} animate-asteroid-fall`}
            style={{
              left: asteroid.left,
              animationDelay: asteroid.delay,
              animationDuration: asteroid.duration,
            }}
          >
            {index % 2 === 0 ? "☄️" : "🪨"}
          </span>
        ))}
      </div>

      <div className="absolute left-4 top-4 z-10">
        <p className="text-[9px] uppercase tracking-[.2em] text-white/35">
          Flight Control
        </p>
        <p className="mt-1 text-xs font-bold text-cyan-300">
          {hit ? "TIME EXPIRED" : "SYSTEM STABLE"}
        </p>
      </div>

      <div className="absolute right-4 top-4 z-10 text-right">
        <p className="text-[9px] uppercase tracking-[.2em] text-white/35">
          Mission XP
        </p>
        <p className="mt-1 text-xs font-bold text-amber-300">
          +20 XP / CORRECT
        </p>
      </div>

      <div
        className={`absolute z-20 flex flex-col items-center transition-all duration-300 ${
          hit ? "animate-ship-hit" : "animate-ship-float"
        }`}
        style={{
          left: `${lane * 33.333 + 16.666}%`,
          bottom: `${shipY}%`,
          transform: "translateX(-50%)",
        }}
      >
        <span className="relative text-5xl drop-shadow-[0_0_18px_rgba(34,211,238,.8)] sm:text-6xl">
          🚀
        </span>

        <div className="h-7 w-2 rounded-full bg-gradient-to-b from-orange-300 to-transparent blur-[2px]" />
      </div>

      {hit && (
        <div
          key={impactKey}
          className="pointer-events-none absolute z-30 grid place-items-center"
          style={{
            left: `${lane * 33.333 + 16.666}%`,
            bottom: `${shipY}%`,
            transform: "translate(-50%, 50%)",
          }}
        >
          <span className="animate-impact text-6xl">💥</span>
        </div>
      )}

      <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-[10px] text-white/40">
        <span>W / A / S / D untuk bergerak</span>
        <span>SPACE untuk tantangan</span>
      </div>
    </div>
  );
}

export function SurvivalReward({ xp, stars }: { xp: number; stars: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[.06] bg-white/[.025] p-4">
      <div>
        <p className="text-[9px] uppercase tracking-[.18em] text-white/40">
          Mission Reward
        </p>
        <p className="mt-1 font-bold text-white">{xp} XP</p>
      </div>

      <div className="text-right">
        <p className="text-[9px] uppercase tracking-[.18em] text-white/40">
          Stars
        </p>

        <div className="mt-1 flex gap-1">
          {Array.from({ length: 3 }).map((_, index) => (
            <Star
              key={index}
              size={16}
              fill={index < stars ? "currentColor" : "none"}
              className={index < stars ? "text-amber-400" : "text-white/15"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
