"use client";

import { CheckCircle2, CircleHelp, Star, Trophy, XCircle } from "lucide-react";

type InfoCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  description?: string;
};

export function InfoCard({ icon, title, value, description }: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#172554]">
        {icon}
      </div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-1 text-xl font-bold text-slate-800">{value}</p>
      {description && (
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      )}
    </div>
  );
}

type AnswerOptionProps = {
  label: string;
  text: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export function AnswerOption({
  label,
  text,
  selected,
  disabled = false,
  onClick,
}: AnswerOptionProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition ${
        selected
          ? "border-[#172554] bg-blue-50 ring-2 ring-[#172554]/10"
          : "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50"
      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
          selected ? "bg-[#172554] text-white" : "bg-slate-100 text-slate-600"
        }`}
      >
        {label}
      </span>
      <span className="flex-1 pt-1 text-sm leading-6 text-slate-700">
        {text}
      </span>
      {selected && (
        <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#172554]" />
      )}
    </button>
  );
}

type ResultSummaryProps = {
  score: number;
  correct: number;
  incorrect: number;
  total: number;
  xp: number;
  stars: number;
};

export function ResultSummary({
  score,
  correct,
  incorrect,
  total,
  xp,
  stars,
}: ResultSummaryProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-[#172554] p-8 text-center text-white">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
          <Trophy className="h-9 w-9 text-yellow-300" />
        </div>
        <p className="text-sm text-blue-100">Nilai Akhir Sumatif</p>
        <p className="mt-2 text-6xl font-bold">{score}</p>
        <p className="mt-2 text-sm text-blue-100">Dari total 100 poin</p>
        <div className="mt-5 flex justify-center gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Star
              key={index}
              className={`h-7 w-7 ${
                index < stars
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <InfoCard
          icon={<CircleHelp size={20} />}
          title="Total Soal"
          value={String(total)}
        />
        <InfoCard
          icon={<CheckCircle2 size={20} />}
          title="Jawaban Benar"
          value={String(correct)}
        />
        <InfoCard
          icon={<XCircle size={20} />}
          title="Jawaban Salah"
          value={String(incorrect)}
        />
        <InfoCard
          icon={<Trophy size={20} />}
          title="XP Diperoleh"
          value={`${xp} XP`}
        />
      </div>
    </div>
  );
}
