"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DashboardContainer from "@/components/layouts/dashboard/DashboardContainer";

export default function Materi06Page() {
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
              Fenomena Tata Surya
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/75">
              Pelajari berbagai fenomena alam seperti gerhana Matahari dan
              gerhana Bulan serta proses terjadinya melalui visualisasi
              interaktif.
            </p>
          </div>
        </section>

        {/* EKSPLORASI MODEL 3D */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Eksplorasi Fenomena Gerhana
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Amati model tiga dimensi untuk memahami proses terjadinya gerhana
              Matahari dan gerhana Bulan.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* MODEL GERHANA MATAHARI */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-[3/2] bg-[#101F38]">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://sketchfab.com/models/614c00f84b2347cc81dbcf2490a0e1d1/embed?autostart=0&ui_theme=dark"
                  title="Model 3D Gerhana Matahari Cincin"
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  allowFullScreen
                />
              </div>

              <div className="p-5">
                <h3 className="text-base font-semibold text-[#101F38]">
                  Gerhana Matahari Cincin
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Amati posisi Matahari, Bulan, dan Bumi ketika terjadi gerhana
                  Matahari cincin serta bagaimana cahaya Matahari membentuk
                  lingkaran cahaya.
                </p>
              </div>
            </div>

            {/* MODEL GERHANA BULAN */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-[3/2] bg-[#101F38]">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://sketchfab.com/models/85318f00a9794a26a4d3299e02104e78/embed?autostart=0&ui_theme=dark"
                  title="Model 3D Gerhana Bulan"
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  allowFullScreen
                />
              </div>

              <div className="p-5">
                <h3 className="text-base font-semibold text-[#101F38]">
                  Gerhana Bulan
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Pelajari posisi Bumi di antara Matahari dan Bulan serta proses
                  terbentuknya bayangan Bumi yang menutupi Bulan.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Gunakan mouse untuk memutar, memperbesar, dan menjelajahi model 3D.
          </p>
        </section>

        {/* VIDEO PEMBELAJARAN */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Video Pembelajaran
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Simak video berikut untuk mengetahui bagaimana fenomena gerhana
              Matahari dan gerhana Bulan terjadi.
            </p>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2">
            {/* VIDEO */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-[#101F38] shadow-sm">
              <div className="relative aspect-[3/2]">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube-nocookie.com/embed/ueFzgY3i92M"
                  title="Video Pembelajaran Fenomena Tata Surya"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>

            {/* INFORMASI VIDEO */}
            <div className="flex flex-col justify-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-lg font-semibold text-[#101F38]">
                Mengenal Fenomena Gerhana
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Kenali fenomena gerhana Matahari dan gerhana Bulan, mulai dari
                posisi benda langit hingga proses terbentuknya gerhana.
              </p>

              <div className="mt-5">
                <p className="text-sm font-semibold text-slate-800">
                  Tujuan Pembelajaran
                </p>

                <ol className="mt-3 space-y-2.5 text-sm text-slate-600">
                  <li className="flex gap-3">
                    <span className="font-semibold text-[#3E729A]">1.</span>
                    <span>Memahami pengertian gerhana Matahari dan Bulan.</span>
                  </li>

                  <li className="flex gap-3">
                    <span className="font-semibold text-[#3E729A]">2.</span>
                    <span>
                      Mengetahui posisi Matahari, Bumi, dan Bulan saat gerhana.
                    </span>
                  </li>

                  <li className="flex gap-3">
                    <span className="font-semibold text-[#3E729A]">3.</span>
                    <span>
                      Mengenal proses terjadinya berbagai jenis gerhana.
                    </span>
                  </li>
                </ol>
              </div>

              {/* SUMBER VIDEO */}
              <div className="mt-6 flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
                      <rect
                        x="2"
                        y="4"
                        width="20"
                        height="16"
                        rx="5"
                        fill="#FF0000"
                      />
                      <path d="M10 8.5L15.5 12L10 15.5V8.5Z" fill="white" />
                    </svg>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Sumber Pembelajaran</p>
                  <p className="text-sm font-semibold text-[#101F38]">
                    YouTube – Video Pembelajaran Gerhana
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INFOGRAFIS */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Infografis Materi
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Ringkasan visual mengenai fenomena gerhana Matahari dan gerhana
              Bulan.
            </p>
          </div>

          <div
            onClick={() => setIsInfografisOpen(true)}
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <Image
              src="/images/materi/gerhana.jpg"
              alt="Infografis Fenomena Tata Surya"
              width={1200}
              height={800}
              className="h-auto w-full transition duration-300 group-hover:scale-[1.02]"
            />

            <div className="absolute inset-0 flex items-end justify-center bg-black/0 transition group-hover:bg-black/10">
              <span className="mb-4 rounded-lg bg-[#101F38]/90 px-4 py-2 text-xs text-white opacity-0 transition group-hover:opacity-100">
                Klik untuk melihat infografis
              </span>
            </div>
          </div>
        </section>

        {/* KESIMPULAN MATERI */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Kesimpulan Materi
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Ringkasan penting mengenai fenomena gerhana dalam Tata Surya.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-2xl">
                🌘
              </div>

              <div>
                <h3 className="text-base font-semibold text-[#101F38]">
                  Fenomena Gerhana Matahari dan Bulan
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Gerhana merupakan fenomena alam yang terjadi ketika posisi
                  Matahari, Bumi, dan Bulan berada dalam susunan tertentu
                  sehingga terbentuk bayangan yang menutupi sebagian atau
                  seluruh benda langit. Gerhana Matahari terjadi ketika Bulan
                  berada di antara Matahari dan Bumi, sedangkan gerhana Bulan
                  terjadi ketika Bumi berada di antara Matahari dan Bulan.
                  Fenomena ini menunjukkan hubungan pergerakan ketiga benda
                  langit dalam Tata Surya.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* POPUP INFOGRAFIS */}
      {isInfografisOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsInfografisOpen(false)}
        >
          <div className="relative max-h-[90vh] max-w-5xl">
            <Image
              src="/images/materi/gerhana.jpg"
              alt="Infografis Fenomena Tata Surya"
              width={1600}
              height={1200}
              className="max-h-[90vh] w-auto rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </DashboardContainer>
  );
}
