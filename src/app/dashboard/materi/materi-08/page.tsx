"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DashboardContainer from "@/components/layouts/dashboard/DashboardContainer";

export default function Materi09Page() {
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
              Peran Tata Surya dalam Kehidupan
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/75">
              Pahami hubungan Tata Surya dengan kehidupan serta manfaatnya bagi
              manusia.
            </p>
          </div>
        </section>

        {/* VIDEO PEMBELAJARAN */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Video Pembelajaran
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Simak video berikut untuk memahami peran Tata Surya dan manfaatnya
              bagi kehidupan di Bumi.
            </p>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2">
            {/* VIDEO */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-[#101F38] shadow-sm">
              <div className="relative aspect-[3/2]">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube-nocookie.com/embed/LHQmhGu2osg"
                  title="Video Pembelajaran Peran Tata Surya dalam Kehidupan"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>

            {/* INFORMASI VIDEO */}
            <div className="flex flex-col justify-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-lg font-semibold text-[#101F38]">
                Peran Tata Surya bagi Kehidupan
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Kenali bagaimana Matahari, Bumi, dan berbagai benda langit di
                Tata Surya memiliki peran penting dalam mendukung kehidupan,
                menjaga keseimbangan alam, serta memberikan manfaat bagi
                manusia.
              </p>

              <div className="mt-5">
                <p className="text-sm font-semibold text-slate-800">
                  Tujuan Pembelajaran
                </p>

                <ol className="mt-3 space-y-2.5 text-sm text-slate-600">
                  <li className="flex gap-3">
                    <span className="font-semibold text-[#3E729A]">1.</span>
                    <span>
                      Memahami hubungan Tata Surya dengan kehidupan di Bumi.
                    </span>
                  </li>

                  <li className="flex gap-3">
                    <span className="font-semibold text-[#3E729A]">2.</span>
                    <span>
                      Mengetahui manfaat Matahari bagi kehidupan manusia.
                    </span>
                  </li>

                  <li className="flex gap-3">
                    <span className="font-semibold text-[#3E729A]">3.</span>
                    <span>
                      Mengenal peran Tata Surya dalam menjaga keseimbangan alam.
                    </span>
                  </li>
                </ol>
              </div>

              {/* SUMBER VIDEO */}
              <div className="mt-6 flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
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

                <div>
                  <p className="text-xs text-slate-400">Sumber Pembelajaran</p>
                  <p className="text-sm font-semibold text-[#101F38]">
                    YouTube – Video Pembelajaran Tata Surya
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
              Pelajari ringkasan visual mengenai peran Tata Surya dan manfaatnya
              dalam kehidupan.
            </p>
          </div>

          <div
            onClick={() => setIsInfografisOpen(true)}
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <Image
              src="/images/materi/peran tata surya.jpg"
              alt="Infografis Peran Tata Surya dalam Kehidupan"
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

        {/* PENJELASAN MATERI */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Penjelasan Materi
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Mengenal peran Tata Surya dan manfaatnya dalam mendukung kehidupan
              di Bumi.
            </p>
          </div>

          <div className="space-y-4">
            {/* MATAHARI */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <h3 className="text-base font-semibold text-[#101F38]">
                ☀️ Matahari sebagai Sumber Energi
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Matahari merupakan sumber energi utama bagi kehidupan di Bumi.
                Cahaya dan panas Matahari membantu tumbuhan melakukan
                fotosintesis, menjaga suhu Bumi tetap sesuai untuk kehidupan,
                serta mendukung berbagai aktivitas manusia. Energi Matahari juga
                dapat dimanfaatkan sebagai sumber energi listrik melalui panel
                surya.
              </p>
            </div>

            {/* BUMI */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <h3 className="text-base font-semibold text-[#101F38]">
                🌍 Bumi sebagai Tempat Kehidupan
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Bumi memiliki air, udara, suhu, dan lingkungan yang mendukung
                kehidupan makhluk hidup. Pergerakan Bumi menyebabkan terjadinya
                siang dan malam serta perubahan musim yang memengaruhi kehidupan
                manusia, hewan, dan tumbuhan.
              </p>
            </div>

            {/* BULAN */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <h3 className="text-base font-semibold text-[#101F38]">
                🌙 Peran Bulan bagi Bumi
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Bulan merupakan satelit alami Bumi yang memiliki pengaruh
                terhadap pasang surut air laut melalui gaya gravitasi. Perubahan
                fase Bulan juga menjadi salah satu fenomena alam yang dapat
                diamati dan dimanfaatkan manusia dalam berbagai kegiatan.
              </p>
            </div>

            {/* TATA SURYA */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <h3 className="text-base font-semibold text-[#101F38]">
                🪐 Tata Surya dan Keseimbangan Alam
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                Tata Surya merupakan sistem benda langit yang terdiri dari
                Matahari sebagai pusat serta planet dan benda langit lainnya
                yang bergerak dalam orbitnya. Keteraturan pergerakan benda-benda
                langit membentuk sistem yang saling berkaitan dan memungkinkan
                berbagai fenomena alam berlangsung secara teratur.
              </p>
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
              Ringkasan penting mengenai manfaat Tata Surya bagi kehidupan.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-2xl">
                🌌
              </div>

              <div>
                <h3 className="text-base font-semibold text-[#101F38]">
                  Tata Surya dan Kehidupan di Bumi
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Tata Surya memiliki peran penting dalam keberlangsungan
                  kehidupan di Bumi. Matahari menyediakan energi berupa cahaya
                  dan panas, Bumi menjadi tempat hidup berbagai makhluk,
                  sedangkan Bulan memengaruhi pasang surut air laut. Hubungan
                  dan pergerakan benda-benda langit memberikan manfaat serta
                  memengaruhi berbagai proses alam yang mendukung kehidupan
                  manusia.
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
              src="/images/materi/peran tata surya.jpg"
              alt="Infografis Peran Tata Surya dalam Kehidupan"
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
