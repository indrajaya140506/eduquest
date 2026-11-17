"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import DashboardContainer from "@/components/layouts/dashboard/DashboardContainer";

const materiList = [
  {
    number: "01",
    title: "Sejarah dan Teori Terbentuknya Tata Surya",
    verticalTitle: ["S", "E", "J", "A", "R", "A", "H"],
    description:
      "Pelajari sejarah, asal-usul, serta berbagai teori yang menjelaskan proses terbentuknya Tata Surya.",
    media: "Infografis dan Video YouTube",
    image: "/images/materi/materi-01.jpg",
    href: "/dashboard/materi/materi-01",
  },
  {
    number: "02",
    title: "Mengenal Matahari",
    verticalTitle: ["M", "A", "T", "A", "H", "A", "R", "I"],
    description:
      "Kenali Matahari sebagai pusat Tata Surya, struktur lapisan, karakteristik, dan perannya.",
    media: "Infografis dan Video Pembelajaran",
    image: "/images/materi/materi-02.jpg",
    href: "/dashboard/materi/materi-02",
  },
  {
    number: "03",
    title: "Mengenal Delapan Planet",
    verticalTitle: ["P", "L", "A", "N", "E", "T"],
    description:
      "Jelajahi urutan, karakteristik, dan keunikan delapan planet di Tata Surya.",
    media: "Infografis, Video, dan Model 3D",
    image: "/images/materi/materi-03.jpg",
    href: "/dashboard/materi/materi-03",
  },
  {
    number: "04",
    title: "Benda Langit Lainnya",
    verticalTitle: ["B", "E", "N", "D", "A"],
    description:
      "Kenali satelit, asteroid, komet, meteoroid, dan berbagai benda langit lainnya.",
    media: "Infografis dan Video Pembelajaran",
    image: "/images/materi/materi-04.jpg",
    href: "/dashboard/materi/materi-04",
  },
  {
    number: "05",
    title: "Rotasi dan Revolusi",
    verticalTitle: ["R", "O", "T", "A", "S", "I"],
    description:
      "Pahami pergerakan Bumi dan planet serta pengaruh rotasi dan revolusi terhadap kehidupan.",
    media: "Animasi dan Video Pembelajaran",
    image: "/images/materi/materi-05.jpg",
    href: "/dashboard/materi/materi-05",
  },
  {
    number: "06",
    title: "Fenomena Tata Surya",
    verticalTitle: ["F", "E", "N", "O", "M", "E", "N", "A"],
    description:
      "Pelajari berbagai fenomena alam seperti gerhana Matahari dan gerhana Bulan.",
    media: "Infografis, Animasi, dan Video",
    image: "/images/materi/materi-06.jpg",
    href: "/dashboard/materi/materi-06",
  },
  {
    number: "07",
    title: "Bumi dan Kehidupan",
    verticalTitle: ["B", "U", "M", "I"],
    description:
      "Kenali karakteristik Bumi serta kondisi yang mendukung keberlangsungan kehidupan.",
    media: "Infografis dan Video Pembelajaran",
    image: "/images/materi/materii-07.jpg",
    href: "/dashboard/materi/materi-07",
  },
  {
    number: "08",
    title: "Peran Tata Surya dalam Kehidupan",
    verticalTitle: ["K", "E", "H", "I", "D", "U", "P", "A", "N"],
    description:
      "Pahami hubungan Tata Surya dengan kehidupan serta manfaatnya bagi manusia.",
    media: "Infografis dan Video Pembelajaran",
    image: "/images/materi/materi-08.jpg",
    href: "/dashboard/materi/materi-08",
  },
];

type Materi = (typeof materiList)[number];

function MateriCard({ materi }: { materi: Materi }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileActive, setIsMobileActive] = useState(false);

  const isActive = isHovered || isMobileActive;

  return (
    <article className="group relative w-full">
      {/* DESKTOP CARD */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative hidden h-[320px] overflow-hidden rounded-2xl bg-[#0D1523] lg:block xl:h-[360px]"
      >
        {/* BACKGROUND IMAGE */}
        <Image
          src={materi.image}
          alt={materi.title}
          fill
          sizes="(max-width: 1280px) 50vw, 600px"
          className={`absolute inset-0 object-cover object-left transition-all duration-700 ease-out ${
            isHovered
              ? "scale-[1.02] blur-0 brightness-100 saturate-100"
              : "scale-100 blur-[5px] brightness-50 saturate-[0.65]"
          }`}
        />

        {/* IMAGE GRADIENT */}
        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
          style={{
            background:
              "linear-gradient(90deg, transparent 20%, #0B1220 70%, #0B1220 100%)",
          }}
        />

        {/* RIGHT PANEL */}
        <div
          className={`absolute inset-y-0 right-0 z-10 flex w-[52%] flex-col justify-center overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isHovered
              ? "translate-x-0 bg-[#0B1220]/90"
              : "translate-x-[calc(100%-76px)] bg-[#0B1220]/95"
          }`}
        >
          {/* VERTICAL TITLE */}
          <div
            className={`absolute left-5 top-1/2 z-20 -translate-y-1/2 transition-all duration-500 ${
              isHovered
                ? "pointer-events-none -translate-x-3 opacity-0"
                : "translate-x-0 opacity-100"
            }`}
          >
            <div className="flex flex-col items-center font-mono text-lg font-bold leading-[1.45] tracking-[0.12em] text-white">
              {materi.verticalTitle.map((letter, index) => (
                <span key={index}>{letter}</span>
              ))}
            </div>
          </div>

          {/* HOVER DETAIL */}
          <div
            className={`flex h-full flex-col justify-center overflow-y-auto px-8 py-8 text-right transition-all duration-500 xl:px-10 ${
              isHovered
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0"
            }`}
          >
            <p className="mb-3 font-mono text-[10px] tracking-[0.2em] text-[#8ECAE6]">
              MATERI {materi.number}
            </p>

            <h3 className="text-2xl font-light leading-tight tracking-tight text-white xl:text-3xl">
              {materi.title}
            </h3>

            <p className="mt-4 text-xs leading-6 text-gray-300 xl:text-sm">
              {materi.description}
            </p>

            <div className="mt-5">
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-gray-400">
                Media Pembelajaran
              </p>
              <p className="text-xs text-[#8ECAE6]">{materi.media}</p>
            </div>

            <div className="mt-5 flex justify-end">
              <Link
                href={materi.href}
                className="inline-flex items-center gap-2 text-xs font-medium text-gray-200 transition-colors duration-300 hover:text-[#8ECAE6]"
              >
                Pelajari Materi
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE & TABLET CARD */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileActive(!isMobileActive)}
          aria-expanded={isMobileActive}
          className="relative flex min-h-[200px] w-full items-stretch overflow-hidden bg-[#0D1523] text-left"
        >
          <div className="relative min-h-[200px] flex-1">
            <Image
              src={materi.image}
              alt={materi.title}
              fill
              sizes="100vw"
              className={`object-cover transition-all duration-500 ${
                isMobileActive ? "scale-105 brightness-50" : "brightness-75"
              }`}
            />
          </div>

          <div className="flex w-[58px] shrink-0 flex-col items-center justify-center gap-1 border-l border-white/10 bg-[#0B1220] py-4 font-mono text-xs font-bold text-white">
            {materi.verticalTitle.map((letter, index) => (
              <span key={index}>{letter}</span>
            ))}
          </div>
        </button>

        <div
          className={`grid transition-all duration-500 ${
            isMobileActive
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="bg-gradient-to-br from-[#0B1220] to-[#193552] p-5 text-white">
              <p className="text-[10px] tracking-[0.2em] text-[#8ECAE6]">
                MATERI {materi.number}
              </p>

              <h3 className="mt-3 text-xl font-light">{materi.title}</h3>

              <p className="mt-3 text-xs leading-6 text-slate-300">
                {materi.description}
              </p>

              <p className="mt-4 text-xs text-[#8ECAE6]">{materi.media}</p>

              <Link
                href={materi.href}
                className="mt-5 inline-flex items-center gap-2 text-sm text-white transition-colors hover:text-[#8ECAE6]"
              >
                Pelajari Materi
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function MateriPage() {
  return (
    <main className="min-h-screen bg-white py-8 sm:py-10">
      <DashboardContainer>
        {/* HEADER */}
        <div className="mb-10">
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Materi Pembelajaran
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
            Jelajahi berbagai materi untuk memahami sejarah, karakteristik,
            serta fenomena yang terjadi di Tata Surya.
          </p>
        </div>

        {/* MATERI GRID: 2 COLUMNS */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:gap-6">
          {materiList.map((materi) => (
            <MateriCard key={materi.number} materi={materi} />
          ))}
        </div>
      </DashboardContainer>
    </main>
  );
}
