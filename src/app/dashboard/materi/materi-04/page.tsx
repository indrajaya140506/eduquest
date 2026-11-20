"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DashboardContainer from "@/components/layouts/dashboard/DashboardContainer";

export default function Materi04Page() {
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
              Benda Langit Lainnya
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/75">
              Kenali satelit, asteroid, komet, meteoroid, dan berbagai benda
              langit lainnya yang menjadi bagian dari Tata Surya.
            </p>
          </div>
        </section>

        {/* 01 - EKSPLORASI 3D */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Eksplorasi Benda Langit
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Jelajahi berbagai benda langit melalui model 3D interaktif dan
              amati bentuk serta karakteristiknya.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
            {/* ASTEROID 3D */}
            <div>
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl border border-slate-200 bg-[#101F38] shadow-sm">
                <iframe
                  title="Model 3D Asteroid Field"
                  className="h-full w-full"
                  src="https://sketchfab.com/models/24572b5eec404dd7888a76098054cd7a/embed?autostart=0&ui_theme=dark"
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  allowFullScreen
                />
              </div>

              <div className="mt-3">
                <h3 className="text-base font-semibold text-[#101F38]">
                  Asteroid
                </h3>
              </div>
            </div>

            {/* KOMET 3D */}
            <div>
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl border border-slate-200 bg-[#101F38] shadow-sm">
                <iframe
                  title="Model 3D Bagian-bagian Komet"
                  className="h-full w-full"
                  src="https://sketchfab.com/models/fc0f8e88db8b46b286c223c1f5b578a0/embed?autostart=0&ui_theme=dark"
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  allowFullScreen
                />
              </div>

              <div className="mt-3">
                <h3 className="text-base font-semibold text-[#101F38]">
                  Komet
                </h3>
              </div>
            </div>
          </div>
        </section>

        {/* 02 - VIDEO PEMBELAJARAN */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Video Pembelajaran
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Pelajari berbagai benda langit lainnya melalui video berikut.
            </p>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2">
            {/* VIDEO */}
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl border border-slate-200 bg-[#101F38] shadow-sm">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube-nocookie.com/embed/j8b3IkIi6_s"
                title="Video Pembelajaran Benda Langit Lainnya"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            {/* INFORMASI VIDEO */}
            <div className="flex flex-col justify-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-xl font-semibold leading-relaxed text-[#101F38]">
                Mengenal Benda Langit Selain Planet
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Selain Matahari dan planet, Tata Surya juga memiliki berbagai
                benda langit lainnya, seperti satelit, asteroid, komet,
                meteoroid, meteor, dan meteorit. Benda-benda tersebut memiliki
                bentuk, ukuran, serta karakteristik yang berbeda dan menjadi
                bagian penting dalam dinamika Tata Surya.
              </p>

              <div className="mt-6">
                <p className="text-sm font-semibold text-[#101F38]">
                  Hal yang akan dipelajari:
                </p>

                <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
                  <li className="flex gap-3">
                    <span className="font-semibold text-[#3E729A]">1.</span>
                    Mengenal satelit alami dan buatan.
                  </li>

                  <li className="flex gap-3">
                    <span className="font-semibold text-[#3E729A]">2.</span>
                    Memahami karakteristik asteroid dan komet.
                  </li>

                  <li className="flex gap-3">
                    <span className="font-semibold text-[#3E729A]">3.</span>
                    Mengetahui perbedaan meteoroid, meteor, dan meteorit.
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
                    YouTube – Kenapa Sih ??
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
                🌌
              </div>

              <div className="min-w-0">
                <h3 className="mb-2 text-base font-semibold text-[#101F38]">
                  Beragam Benda di Tata Surya
                </h3>

                <p className="text-sm leading-7 text-slate-600">
                  Tata Surya tidak hanya terdiri dari Matahari dan delapan
                  planet, tetapi juga berbagai benda langit lainnya, seperti
                  satelit, asteroid, komet, dan meteoroid. Setiap benda memiliki
                  karakteristik serta pergerakan yang berbeda. Asteroid umumnya
                  tersusun dari batuan dan logam, komet terdiri dari es, debu,
                  serta material lainnya, sedangkan meteoroid merupakan benda
                  kecil yang berada di ruang angkasa. Semua benda tersebut
                  menjadi bagian dari sistem Tata Surya yang luas dan menarik
                  untuk dipelajari.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardContainer>
  );
}
