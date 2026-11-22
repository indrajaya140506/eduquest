"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DashboardContainer from "@/components/layouts/dashboard/DashboardContainer";

export default function Materi05Page() {
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
              Rotasi dan Revolusi
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/75">
              Pahami pergerakan Bumi dan planet serta pengaruh rotasi dan
              revolusi terhadap kehidupan.
            </p>
          </div>
        </section>

        {/* EKSPLORASI MODEL 3D */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Eksplorasi Rotasi dan Revolusi
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Amati model tiga dimensi untuk memahami pergerakan Bumi, Bulan,
              dan Matahari.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* MODEL 3D BUMI BULAN MATAHARI */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-[3/2] bg-[#101F38]">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://sketchfab.com/models/f0512017c37f4830b7eb068b7f1b1a11/embed?autostart=0&ui_theme=dark"
                  title="Model 3D Earth Moon Sun"
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  allowFullScreen
                />
              </div>

              <div className="p-5">
                <h3 className="text-base font-semibold text-[#101F38]">
                  Bumi, Bulan, dan Matahari
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Amati hubungan posisi Bumi, Bulan, dan Matahari serta
                  bagaimana ketiganya bergerak dalam Tata Surya.
                </p>
              </div>
            </div>

            {/* MODEL 3D ROTASI DAN REVOLUSI */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-[3/2] bg-[#101F38]">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://sketchfab.com/models/597a7387e6e74afca2cf4921005be373/embed?autostart=0&ui_theme=dark"
                  title="Model 3D Rotasi dan Revolusi Bumi dan Bulan"
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  allowFullScreen
                />
              </div>

              <div className="p-5">
                <h3 className="text-base font-semibold text-[#101F38]">
                  Rotasi dan Revolusi Bumi dan Bulan
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Pelajari gerakan rotasi dan revolusi serta hubungan pergerakan
                  Bumi dan Bulan melalui model tiga dimensi.
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
              Simak video berikut untuk memahami rotasi dan revolusi serta
              pengaruhnya terhadap kehidupan sehari-hari.
            </p>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2">
            {/* VIDEO */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-[#101F38] shadow-sm">
              <div className="relative aspect-[3/2]">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube-nocookie.com/embed/PBVEJUabvww"
                  title="Video Pembelajaran Rotasi dan Revolusi"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>

            {/* INFORMASI VIDEO */}
            <div className="flex flex-col justify-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-lg font-semibold text-[#101F38]">
                Memahami Rotasi dan Revolusi Bumi
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Pelajari bagaimana Bumi bergerak pada porosnya dan mengelilingi
                Matahari, serta berbagai fenomena yang terjadi akibat pergerakan
                tersebut.
              </p>

              <div className="mt-5">
                <p className="text-sm font-semibold text-slate-800">
                  Tujuan Pembelajaran
                </p>

                <ol className="mt-3 space-y-2.5 text-sm text-slate-600">
                  <li className="flex gap-3">
                    <span className="font-semibold text-[#3E729A]">1.</span>
                    <span>Memahami pengertian rotasi dan revolusi.</span>
                  </li>

                  <li className="flex gap-3">
                    <span className="font-semibold text-[#3E729A]">2.</span>
                    <span>Mengetahui akibat rotasi dan revolusi Bumi.</span>
                  </li>

                  <li className="flex gap-3">
                    <span className="font-semibold text-[#3E729A]">3.</span>
                    <span>
                      Memahami hubungan pergerakan Bumi, Bulan, dan Matahari.
                    </span>
                  </li>
                </ol>
              </div>

              {/* SUMBER VIDEO */}
              <div className="mt-6 flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#FF0000">
                    <path d="M23.5 6.2a2.9 2.9 0 0 0-2-2C19.7 3.7 12 3.7 12 3.7s-7.7 0-9.5.5a2.9 2.9 0 0 0-2 2C0 8 0 12 0 12s0 4 .5 5.8a2.9 2.9 0 0 0 2 2c1.8.5 9.5.5 9.5.5s7.7 0 9.5-.5a2.9 2.9 0 0 0 2-2C24 16 24 12 24 12s0-4-.5-5.8ZM9.6 15.7V8.3l6.5 3.7-6.5 3.7Z" />
                  </svg>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Sumber Pembelajaran</p>
                  <p className="text-sm font-semibold text-[#101F38]">
                    YouTube – Video Pembelajaran
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
              Ringkasan visual rotasi dan revolusi untuk membantu memahami
              materi.
            </p>
          </div>

          <div
            onClick={() => setIsInfografisOpen(true)}
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <Image
              src="/images/materi/rotasi.png"
              alt="Infografis Rotasi dan Revolusi"
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
              Ringkasan penting tentang pergerakan Bumi dan pengaruhnya.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-2xl">
                🌍
              </div>

              <div>
                <h3 className="text-base font-semibold text-[#101F38]">
                  Pergerakan Bumi dan Pengaruhnya
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Bumi mengalami rotasi, yaitu berputar pada porosnya, dan
                  revolusi, yaitu bergerak mengelilingi Matahari. Rotasi
                  menyebabkan pergantian siang dan malam, sedangkan revolusi
                  Bumi berhubungan dengan pergantian tahun dan perubahan musim.
                  Pergerakan Bumi, Bulan, dan Matahari juga berperan dalam
                  berbagai fenomena alam yang terjadi di Tata Surya.
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
              src="/images/materi/rotasi.png"
              alt="Infografis Rotasi dan Revolusi"
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
