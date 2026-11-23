"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Gamepad2,
  ClipboardCheck,
  Star,
  Trophy,
} from "lucide-react";

import DashboardContainer from "@/components/layouts/dashboard/DashboardContainer";
import Diagnostik from "./Diagnostik";
import Game from "./Game";
import Formatif from "./Formatif";
import Sumatif from "./Sumatif";

type Stage = "hub" | "diagnostik" | "game" | "formatif" | "sumatif";

export default function GameMisi() {
  const [stage, setStage] = useState<Stage>("hub");
  const [xp, setXp] = useState(0);
  const [stars, setStars] = useState(0);

  const backToHub = () => setStage("hub");

  const activities = [
    {
      title: "Diagnostik",
      subtitle: "Tes pengetahuan awal",
      description: "Uji pengetahuanmu sebelum memulai misi.",
      total: "5 Soal",
      icon: Brain,
      iconStyle: "bg-blue-50 text-blue-600",
      stage: "diagnostik" as Stage,
    },
    {
      title: "Game",
      subtitle: "Cosmic Ladder",
      description: "Jelajahi tata surya melalui permainan ular tangga kosmik.",
      total: "Board Game",
      icon: Gamepad2,
      iconStyle: "bg-amber-50 text-amber-600",
      stage: "game" as Stage,
    },
    {
      title: "Formatif",
      subtitle: "Latihan pemahaman",
      description: "Latih pemahamanmu dengan soal dan feedback langsung.",
      total: "10 Soal",
      icon: ClipboardCheck,
      iconStyle: "bg-emerald-50 text-emerald-600",
      stage: "formatif" as Stage,
    },
    {
      title: "Sumatif",
      subtitle: "Evaluasi akhir",
      description: "Uji pemahamanmu mengenai asal mula tata surya.",
      total: "10 Soal",
      icon: Trophy,
      iconStyle: "bg-purple-50 text-purple-600",
      stage: "sumatif" as Stage,
    },
  ];

  return (
    <DashboardContainer>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <button
            onClick={() =>
              stage === "hub" ? window.history.back() : backToHub()
            }
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            {stage === "hub" ? "Kembali" : "Menu Misi"}
          </button>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-sm font-medium text-amber-500">
              <Star size={17} />
              {stars}
            </span>
            <span className="text-sm font-semibold text-blue-600">{xp} XP</span>
          </div>
        </div>

        {/* MISSION TITLE */}
        <div>
          <p className="text-sm font-medium tracking-wide text-blue-600">
            EDUQUEST · MISSION 01
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Asal Mula Tata Surya
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Pilih aktivitas untuk memulai petualanganmu.
          </p>
        </div>

        {/* MENU AKTIVITAS */}
        {stage === "hub" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {activities.map((activity) => {
              const Icon = activity.icon;

              return (
                <button
                  key={activity.stage}
                  onClick={() => setStage(activity.stage)}
                  className="rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:border-gray-300 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${activity.iconStyle}`}
                    >
                      <Icon size={22} />
                    </div>
                    <span className="rounded-lg bg-gray-50 px-2.5 py-1 text-xs text-gray-500">
                      {activity.total}
                    </span>
                  </div>

                  <h2 className="mt-4 font-semibold text-gray-900">
                    {activity.title}
                  </h2>

                  <p className="mt-1 text-sm font-medium text-gray-600">
                    {activity.subtitle}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {activity.description}
                  </p>

                  <div className="mt-4 flex items-center justify-end text-sm font-medium text-[#14243D]">
                    Mulai Aktivitas
                    <ArrowRight size={16} className="ml-1.5" />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* DIAGNOSTIK */}
        {stage === "diagnostik" && <Diagnostik onComplete={backToHub} />}

        {/* GAME */}
        {stage === "game" && (
          <Game
            onComplete={backToHub}
            onReward={(earnedXP, earnedStars) => {
              setXp((prev) => prev + earnedXP);
              setStars((prev) => prev + earnedStars);
            }}
          />
        )}

        {/* FORMATIF */}
        {stage === "formatif" && (
          <Formatif
            onComplete={backToHub}
            onReward={(earnedXP, earnedStars) => {
              setXp((prev) => prev + earnedXP);
              setStars((prev) => prev + earnedStars);
            }}
          />
        )}

        {/* SUMATIF */}
        {stage === "sumatif" && (
          <Sumatif
            onComplete={backToHub}
            onReward={(earnedXP, earnedStars) => {
              setXp((prev) => prev + earnedXP);
              setStars((prev) => prev + earnedStars);
            }}
          />
        )}
      </div>
    </DashboardContainer>
  );
}
