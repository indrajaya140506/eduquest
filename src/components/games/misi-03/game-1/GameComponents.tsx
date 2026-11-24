"use client";

import type { ReactNode } from "react";
import DashboardContainer from "@/components/layouts/dashboard/DashboardContainer";
import { Rocket, Sparkles, Star, Heart, Zap, Gem } from "lucide-react";
import { PLANETS } from "./GameData";

/* =========================================================
   GAME CONTAINER — DASHBOARD LAYOUT
========================================================= */

export function GameContainer({ children }: { children: ReactNode }) {
  return (
    <DashboardContainer className="relative w-full">
      <div className="relative isolate w-full min-w-0 overflow-hidden bg-[#080D1B] text-white">
        {children}
      </div>
    </DashboardContainer>
  );
}

/* =========================================================
   SPACE BACKGROUND
========================================================= */

export function SpaceBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#080D1B]" />

      {/* Ambient Glow */}
      <div className="absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-blue-500/[0.045] blur-[100px]" />

      <div className="absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-cyan-500/[0.035] blur-[100px]" />

      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/[0.02] blur-[120px]" />

      {/* Stars */}
      {Array.from({ length: 45 }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${(i * 37 + 7) % 100}%`,
            top: `${(i * 53 + 11) % 100}%`,
            width: i % 5 === 0 ? "2px" : "1px",
            height: i % 5 === 0 ? "2px" : "1px",
            opacity: 0.12 + ((i * 13) % 45) / 100,
          }}
        />
      ))}
    </div>
  );
}

/* =========================================================
   GAME BRAND
========================================================= */

export function GameBrand() {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/[0.08] text-blue-400">
        <Rocket size={18} />
      </div>

      <div className="min-w-0 leading-tight">
        <p className="text-sm font-bold tracking-[0.12em] text-white">
          EDUQUEST
        </p>

        <p className="mt-1 text-[9px] font-medium tracking-[0.2em] text-white/35">
          PLANET EXPLORER
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   REWARD PREVIEW
========================================================= */

export function RewardPreview({ xp, stars }: { xp: number; stars: number }) {
  return (
    <div className="flex w-full min-w-0 items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-4 sm:px-5">
      {/* XP */}
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
          Mission Reward
        </p>

        <div className="mt-2 flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-400/[0.08]">
            <Sparkles size={14} className="text-cyan-400" />
          </div>

          <span className="text-lg font-bold tracking-tight text-white">
            {xp} <span className="text-xs font-medium text-white/40">XP</span>
          </span>
        </div>
      </div>

      {/* Stars */}
      <div className="shrink-0">
        <p className="text-right text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
          Max Stars
        </p>

        <div className="mt-2 flex justify-end gap-1">
          {Array.from({ length: stars }).map((_, i) => (
            <Star
              key={i}
              size={17}
              className="text-amber-400"
              fill="currentColor"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PLANET CARD
========================================================= */

export function PlanetCard({
  name,
  emoji,
  color,
  active,
  completed = false,
}: {
  name: string;
  emoji: string;
  color: string;
  active: boolean;
  completed?: boolean;
}) {
  return (
    <div
      className={`group flex min-w-0 flex-col items-center justify-center gap-2 rounded-xl border px-1.5 py-3 transition-all duration-300 sm:px-2 ${
        active
          ? "border-white/[0.12] bg-white/[0.045]"
          : "border-white/[0.035] bg-transparent hover:bg-white/[0.02]"
      }`}
    >
      {/* Planet */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 sm:h-9 sm:w-9 ${
          active ? "scale-110" : "group-hover:scale-105"
        }`}
        style={{
          backgroundColor: `${color}15`,
          border: `1px solid ${color}35`,
          boxShadow: active ? `0 0 20px ${color}15` : "none",
        }}
      >
        {completed ? (
          <span className="text-xs font-bold text-emerald-400">✓</span>
        ) : (
          <span className="text-sm">{emoji}</span>
        )}
      </div>

      {/* Name */}
      <span
        className={`max-w-full truncate text-[9px] font-medium transition-colors ${
          active ? "text-white/85" : "text-white/35"
        }`}
        title={name}
      >
        {name}
      </span>
    </div>
  );
}

/* =========================================================
   GAME HUD
========================================================= */

export function GameHUD({
  health,
  maxHealth,
  energy,
  crystals,
  combo,
}: {
  health: number;
  maxHealth: number;
  energy: number;
  crystals: number;
  combo: number;
}) {
  return (
    <div className="grid w-full min-w-0 grid-cols-2 gap-3 sm:grid-cols-4">
      {/* LIVES */}
      <div className="min-w-0 rounded-xl border border-white/[0.055] bg-white/[0.015] px-3 py-3">
        <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-white/35">
          Lives
        </p>

        <div className="mt-2.5 flex items-center gap-1.5">
          {Array.from({ length: maxHealth }).map((_, i) => (
            <Heart
              key={i}
              size={16}
              className={`transition-colors ${
                i < health ? "text-rose-400" : "text-white/[0.12]"
              }`}
              fill={i < health ? "currentColor" : "none"}
            />
          ))}
        </div>
      </div>

      {/* ENERGY */}
      <div className="min-w-0 rounded-xl border border-white/[0.055] bg-white/[0.015] px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-white/35">
            Energy
          </p>
          <Zap size={13} className="shrink-0 text-cyan-400" />
        </div>

        <p className="mt-1.5 text-sm font-bold text-white">{energy}%</p>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-500"
            style={{
              width: `${Math.max(0, Math.min(100, energy))}%`,
            }}
          />
        </div>
      </div>

      {/* CRYSTALS */}
      <div className="min-w-0 rounded-xl border border-white/[0.055] bg-white/[0.015] px-3 py-3">
        <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-white/35">
          Crystal
        </p>

        <div className="mt-2.5 flex items-center gap-2">
          <Gem size={16} className="shrink-0 text-violet-400" />
          <span className="text-sm font-bold text-white">{crystals}</span>
        </div>
      </div>

      {/* COMBO */}
      <div
        className={`min-w-0 rounded-xl border px-3 py-3 transition-all ${
          combo >= 3
            ? "border-amber-400/[0.15] bg-amber-400/[0.035]"
            : "border-white/[0.055] bg-white/[0.015]"
        }`}
      >
        <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-white/35">
          Combo
        </p>

        <div className="mt-2.5 flex items-center gap-2">
          <Sparkles
            size={16}
            className={combo >= 3 ? "text-amber-400" : "text-white/30"}
          />

          <span
            className={`text-sm font-bold ${
              combo >= 3 ? "text-amber-400" : "text-white"
            }`}
          >
            {combo}x
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MISSION SCENE
========================================================= */

export function MissionScene({
  planet,
  questionNumber,
  totalQuestions,
  isCorrect,
  combo,
  energy,
}: {
  planet: (typeof PLANETS)[number];
  questionNumber: number;
  totalQuestions: number;
  isCorrect: boolean | null;
  combo: number;
  energy: number;
}) {
  return (
    <div className="relative flex min-h-[240px] w-full min-w-0 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.055] bg-[#0C1425] sm:min-h-[300px] lg:min-h-[340px]">
      {/* Ambient Planet Glow */}
      <div
        className="absolute h-56 w-56 rounded-full blur-[90px] opacity-[0.16] transition-colors duration-700 sm:h-72 sm:w-72"
        style={{ backgroundColor: planet.color }}
      />

      {/* Orbit */}
      <div className="absolute h-40 w-40 rounded-full border border-white/[0.035] sm:h-52 sm:w-52" />

      <div className="absolute h-56 w-56 rounded-full border border-white/[0.025] sm:h-64 sm:w-64" />

      {/* Planet */}
      <div
        className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full transition-all duration-500 sm:h-36 sm:w-36"
        style={{
          background: `radial-gradient(circle at 30% 25%, #ffffff55, ${planet.color} 35%, #080D1B 100%)`,
          boxShadow: `0 0 60px ${planet.color}20`,
        }}
      >
        <span className="select-none text-5xl sm:text-6xl">{planet.emoji}</span>
      </div>

      {/* Astronaut */}
      <div className="absolute bottom-5 left-5 select-none text-2xl opacity-80 sm:bottom-7 sm:left-7 sm:text-3xl">
        🚀
      </div>

      {/* Planet Information */}
      <div className="absolute left-4 top-4 z-10 sm:left-6 sm:top-6">
        <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/30">
          Exploring
        </p>

        <p className="mt-1 text-xs font-semibold text-white/75">
          {planet.label}
        </p>
      </div>

      {/* Progress */}
      <div className="absolute right-4 top-4 z-10 text-right sm:right-6 sm:top-6">
        <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/30">
          Progress
        </p>

        <p className="mt-1 text-xs font-semibold text-white/75">
          {questionNumber}/{totalQuestions}
        </p>
      </div>

      {/* Feedback */}
      {isCorrect !== null && (
        <div
          className={`absolute inset-0 z-20 flex items-center justify-center ${
            isCorrect ? "bg-emerald-400/[0.035]" : "bg-rose-400/[0.035]"
          }`}
        >
          <div
            className={`flex flex-wrap items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold shadow-lg backdrop-blur-sm sm:px-4 ${
              isCorrect
                ? "border-emerald-400/[0.15] bg-[#0C1425]/95 text-emerald-400"
                : "border-rose-400/[0.15] bg-[#0C1425]/95 text-rose-400"
            }`}
          >
            <span>{isCorrect ? "✓" : "✕"}</span>

            <span>{isCorrect ? "Correct" : "Incorrect"}</span>

            {isCorrect && combo >= 3 && (
              <span className="border-l border-white/10 pl-2 text-amber-400">
                {combo}x Combo
              </span>
            )}
          </div>
        </div>
      )}

      {/* Energy */}
      <div className="absolute bottom-5 right-5 z-10 flex items-center gap-1.5 sm:bottom-7 sm:right-7">
        <Zap size={12} className="text-cyan-400" />

        <span className="text-[10px] font-medium text-white/35">
          {energy}% energy
        </span>
      </div>
    </div>
  );
}
