"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DashboardContainer from "@/components/layouts/dashboard/DashboardContainer";

export default function Materi03Page() {
  const [isInfografisOpen, setIsInfografisOpen] = useState(false);

  return (
    <DashboardContainer className="py-6 sm:py-8">
      <div className="space-y-8">
        {/* HEADER MATERI */}
        <section>
          <Link
            href="/dashboard/materi"
            className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-[#3E729A]"
          >
            <ArrowLeft size={16} />
            Kembali ke Materi Pembelajaran
          </Link>

          <div className="rounded-xl bg-[#101F38] p-6 text-white sm:p-8">
            <h1 className="text-xl font-semibold sm:text-2xl">
              Mengenal Delapan Planet
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/75">
              Mengenal delapan planet dalam Tata Surya, memahami urutannya dari
              Matahari, serta mempelajari karakteristik unik setiap planet.
            </p>
          </div>
        </section>

        {/* 01 - INFOGRAFIS & TATA SURYA 3D */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Eksplorasi Tata Surya
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Amati infografis dan jelajahi model Tata Surya dalam bentuk 3D.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
            {/* INFOGRAFIS */}
            <div>
              <div
                onClick={() => setIsInfografisOpen(true)}
                className="relative aspect-[3/2] w-full cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm"
              >
                <Image
                  src="/images/materi/tata-surya.jpg"
                  alt="Infografis Mengenal Delapan Planet"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                  priority
                />

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-sm font-medium text-white">
                    Infografis Delapan Planet
                  </p>
                  <p className="mt-1 text-xs text-white/75">
                    Klik gambar untuk melihat lebih jelas
                  </p>
                </div>
              </div>
            </div>

            {/* MODEL TATA SURYA 3D */}
            <div>
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl border border-slate-200 bg-[#101F38] shadow-sm">
                <iframe
                  title="Model 3D Tata Surya"
                  className="h-full w-full"
                  src="https://sketchfab.com/models/e8df134d9a974fb99b14f75eab705117/embed?autostart=0&ui_theme=dark"
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

        {/* POPUP INFOGRAFIS */}
        {isInfografisOpen && (
          <div
            onClick={() => setIsInfografisOpen(false)}
            className="fixed inset-0 z-[999] flex cursor-pointer items-center justify-center bg-black/80 p-4"
          >
            <div className="relative h-[85vh] w-full max-w-6xl">
              <Image
                src="/images/materi/tata-surya.jpg"
                alt="Infografis Mengenal Delapan Planet"
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
        )}

        {/* 02 - VIDEO PEMBELAJARAN */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Video Pembelajaran
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Yuk, kenali seluruh planet dalam Tata Surya melalui video berikut.
            </p>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2">
            {/* VIDEO */}
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl border border-slate-200 bg-[#101F38] shadow-sm">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube-nocookie.com/embed/KSzdqXMswaE"
                title="Semua Planet di Tata Surya Dijelaskan"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            {/* INFORMASI VIDEO */}
            <div className="flex flex-col justify-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-xl font-semibold leading-relaxed text-[#101F38]">
                Mengenal Semua Planet di Tata Surya
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Tata Surya memiliki delapan planet yang mengelilingi Matahari.
                Setiap planet memiliki ukuran, kondisi, susunan, dan
                karakteristik yang berbeda. Melalui video ini, kita dapat
                mengenal lebih dekat keunikan setiap planet.
              </p>

              <div className="mt-6">
                <p className="text-sm font-semibold text-[#101F38]">
                  Hal yang akan dipelajari:
                </p>

                <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
                  <li className="flex gap-3">
                    <span className="font-semibold text-[#3E729A]">1.</span>
                    Mengenal urutan delapan planet dari Matahari.
                  </li>

                  <li className="flex gap-3">
                    <span className="font-semibold text-[#3E729A]">2.</span>
                    Memahami karakteristik unik setiap planet.
                  </li>

                  <li className="flex gap-3">
                    <span className="font-semibold text-[#3E729A]">3.</span>
                    Mengetahui perbedaan planet dalam dan planet luar.
                  </li>
                </ul>
              </div>

              {/* SUMBER VIDEO */}
              <div className="mt-6 flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-7 w-7"
                    fill="#FF0033"
                  >
                    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.3V8.7l5.8 3.3-5.8 3.3Z" />
                  </svg>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Sumber Pembelajaran</p>
                  <p className="text-sm font-semibold text-[#101F38]">
                    YouTube – Sekilat info
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 - KESIMPULAN MATERI */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Kesimpulan Materi
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Ringkasan dari materi yang telah dipelajari.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 shrink-0 pt-0.5 text-center text-3xl">
                🪐
              </div>

              <div className="min-w-0">
                <h3 className="mb-2 text-base font-semibold text-[#101F38]">
                  Delapan Planet dalam Tata Surya
                </h3>

                <p className="text-sm leading-7 text-slate-600">
                  Tata Surya memiliki delapan planet yang mengelilingi Matahari,
                  yaitu Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus,
                  dan Neptunus. Setiap planet memiliki karakteristik yang
                  berbeda. Empat planet pertama merupakan planet dalam yang
                  berukuran relatif kecil dan berbatu, sedangkan empat planet
                  berikutnya merupakan planet luar yang berukuran lebih besar.
                  Dengan mempelajari planet-planet tersebut, kita dapat memahami
                  keunikan dan keteraturan Tata Surya tempat Bumi berada.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardContainer>
  );
}
