"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Play } from "lucide-react";
import DashboardContainer from "@/components/layouts/dashboard/DashboardContainer";

const tahapanTataSurya = [
  {
    judul: "Awan Gas dan Debu",
    deskripsi:
      "Tata Surya berawal dari awan besar yang terdiri atas gas dan debu di ruang angkasa. Awan ini menjadi bahan awal pembentukan Matahari dan planet-planet.",
    label: "TAHAP 01",
  },
  {
    judul: "Awan Mulai Menyusut",
    deskripsi:
      "Gaya gravitasi menyebabkan awan gas dan debu menyusut. Material di dalamnya semakin terkumpul dan mulai berputar membentuk struktur seperti piringan.",
    label: "TAHAP 02",
  },
  {
    judul: "Matahari Terbentuk",
    deskripsi:
      "Sebagian besar material berkumpul di bagian pusat. Tekanan dan suhu yang semakin tinggi akhirnya memungkinkan terbentuknya Matahari.",
    label: "TAHAP 03",
  },
  {
    judul: "Planet Mulai Terbentuk",
    deskripsi:
      "Material yang tersisa di sekitar Matahari saling bertabrakan dan bergabung. Gumpalan-gumpalan kecil ini berkembang menjadi benda yang disebut planetesimal.",
    label: "TAHAP 04",
  },
  {
    judul: "Tata Surya Terbentuk",
    deskripsi:
      "Melalui proses yang berlangsung sangat lama, planetesimal berkembang menjadi planet dan benda langit lainnya. Terbentuklah Tata Surya seperti yang kita kenal sekarang.",
    label: "TAHAP 05",
  },
];

export default function Materi01Page() {
  const [tahapAktif, setTahapAktif] = useState(0);
  const [isInfografisOpen, setIsInfografisOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white py-8 sm:py-10">
      {isInfografisOpen && (
        <div
          onClick={() => setIsInfografisOpen(false)}
          className="fixed inset-0 z-[999] flex cursor-pointer items-center justify-center bg-black/80 p-4"
        >
          <div className="relative h-[85vh] w-full max-w-6xl">
            <Image
              src="/images/materi/sejarah-tata-surya.png"
              alt="Infografis Tata Surya"
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
      <DashboardContainer>
        {/* NAVIGASI KEMBALI */}
        <Link
          href="/dashboard/materi"
          className="mb-7 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-[#3E729A]"
        >
          <ArrowLeft size={17} />
          Kembali ke Materi Pembelajaran
        </Link>

        {/* HEADER MATERI */}
        <section className="mb-8 rounded-xl bg-[#101F38] px-5 py-7 sm:px-7">
          <h1 className="text-xl font-semibold text-white sm:text-2xl">
            Sejarah dan Teori Terbentuknya Tata Surya
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Pelajari sejarah dan proses terbentuknya Tata Surya.
          </p>
        </section>

        <div className="space-y-10">
          {/* 01 - INFOGRAFIS DAN INTERAKTIF */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-900">
                Infografis Pembelajaran
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Kenali tahapan proses terbentuknya Tata Surya.
              </p>
            </div>

            <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
              {/* INFOGRAFIS KIRI */}
              <div
                onClick={() => setIsInfografisOpen(true)}
                className="relative aspect-[3/2] w-full cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-[#071426] shadow-sm"
              >
                <Image
                  src="/images/materi/sejarah-tata-surya.png"
                  alt="Infografis proses terbentuknya Tata Surya"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-fill"
                  priority
                />
              </div>

              {/* SIMULASI ANGKASA KANAN */}
              <div
                key={tahapAktif}
                className="group relative aspect-[3/2] w-full overflow-hidden rounded-xl border border-slate-200 bg-[#071426] shadow-sm"
              >
                {/* VISUALISASI RUANG ANGKASA */}
                <div className="cosmic-scene relative flex h-full w-full items-center justify-center overflow-hidden bg-[#071426]">
                  {/* BINTANG */}
                  {Array.from({ length: 55 }).map((_, i) => (
                    <span
                      key={`star-${i}`}
                      className="cosmic-star"
                      style={{
                        left: `${(i * 37 + 13) % 100}%`,
                        top: `${(i * 53 + 7) % 100}%`,
                        animationDelay: `${(i % 7) * 0.4}s`,
                        width: `${i % 5 === 0 ? 3 : 2}px`,
                        height: `${i % 5 === 0 ? 3 : 2}px`,
                      }}
                    />
                  ))}

                  {/* PARTIKEL DEBU */}
                  {Array.from({ length: 40 }).map((_, i) => (
                    <span
                      key={`dust-${i}`}
                      className={`cosmic-dust ${
                        tahapAktif === 0
                          ? "dust-cloud"
                          : tahapAktif === 1
                            ? "dust-collapse"
                            : tahapAktif === 2
                              ? "dust-sun"
                              : "dust-orbit"
                      }`}
                      style={{
                        left: `${(i * 29 + 11) % 100}%`,
                        top: `${(i * 43 + 17) % 100}%`,
                        animationDelay: `${(i % 8) * 0.35}s`,
                      }}
                    />
                  ))}

                  {/* OBJEK ANGKASA */}
                  <div className="relative z-10 flex h-full w-full scale-125 items-center justify-center sm:scale-150">
                    {/* TAHAP 01 */}
                    {tahapAktif === 0 && (
                      <div className="nebula-cloud">
                        <span />
                        <span />
                        <span />
                        <span />
                      </div>
                    )}

                    {/* TAHAP 02 */}
                    {tahapAktif === 1 && (
                      <div className="collapsing-cloud">
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                      </div>
                    )}

                    {/* TAHAP 03 */}
                    {tahapAktif === 2 && (
                      <div className="sun-glow">
                        <div className="sun-core" />
                      </div>
                    )}

                    {/* TAHAP 04 */}
                    {tahapAktif === 3 && (
                      <div className="planet-system">
                        <div className="young-sun" />
                        <span className="young-planet planet-one" />
                        <span className="young-planet planet-two" />
                        <span className="young-planet planet-three" />
                        <span className="young-planet planet-four" />
                      </div>
                    )}

                    {/* TAHAP 05 */}
                    {tahapAktif === 4 && (
                      <div className="solar-system">
                        <div className="solar-orbit orbit-one">
                          <span className="solar-planet mercury" />
                        </div>

                        <div className="solar-orbit orbit-two">
                          <span className="solar-planet venus" />
                        </div>

                        <div className="solar-orbit orbit-three">
                          <span className="solar-planet earth" />
                        </div>

                        <div className="solar-orbit orbit-four">
                          <span className="solar-planet mars" />
                        </div>

                        <div className="solar-orbit orbit-five">
                          <span className="solar-planet jupiter" />
                        </div>

                        <div className="solar-orbit orbit-six">
                          <span className="solar-planet saturn" />
                        </div>

                        <div className="solar-orbit orbit-seven">
                          <span className="solar-planet uranus" />
                        </div>

                        <div className="solar-orbit orbit-eight">
                          <span className="solar-planet neptune" />
                        </div>

                        <div className="solar-center" />
                      </div>
                    )}
                  </div>

                  {/* LABEL SIMULASI */}
                  <div className="absolute bottom-5 left-5 z-20">
                    <p className="mt-1 text-xs text-white/60">
                      {tahapanTataSurya[tahapAktif].label}
                    </p>
                  </div>

                  {/* PAGINATION */}
                  <div className="absolute right-4 top-4 z-40 flex items-center gap-1 rounded-full border border-white/10 bg-[#101F38]/80 p-1.5 backdrop-blur-md">
                    {tahapanTataSurya.map((tahap, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setTahapAktif(index)}
                        aria-label={`Tahap ${index + 1}: ${tahap.judul}`}
                        aria-pressed={tahapAktif === index}
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
                          tahapAktif === index
                            ? "bg-[#8ECAE6] text-[#101F38] shadow-md"
                            : "text-white/70 hover:bg-white/15 hover:text-white"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  {/* KETERANGAN SAAT HOVER */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 translate-y-3 bg-gradient-to-t from-[#071426] via-[#071426]/95 to-transparent px-5 pb-7 pt-20 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 sm:px-7 sm:pb-8">
                    <div className="max-w-lg">
                      <p className="mb-2 text-[10px] font-semibold tracking-[0.25em] text-[#8ECAE6]">
                        {tahapanTataSurya[tahapAktif].label}
                      </p>

                      <h3 className="text-lg font-semibold text-white sm:text-xl">
                        {tahapanTataSurya[tahapAktif].judul}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {tahapanTataSurya[tahapAktif].deskripsi}
                      </p>
                    </div>
                  </div>
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

              <p className="mt-1 text-sm text-slate-500">
                Pelajari proses terbentuknya Tata Surya melalui video.
              </p>
            </div>

            <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2">
              {/* VIDEO YOUTUBE KIRI */}
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl border border-slate-200 bg-[#101F38] shadow-sm">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube-nocookie.com/embed/9hr6w7XF_ds"
                  title="Video Sejarah Terbentuknya Tata Surya"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>

              {/* INFORMASI VIDEO KANAN */}
              <div className="flex flex-col justify-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h3 className="text-xl font-semibold leading-relaxed text-[#101F38]">
                  Sejarah dan Proses Terbentuknya Tata Surya
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  Melalui video ini, kamu dapat mempelajari bagaimana Tata Surya
                  terbentuk dari kumpulan gas dan debu di ruang angkasa hingga
                  berkembang menjadi Matahari, planet, dan berbagai benda langit
                  lainnya.
                </p>

                {/* HAL YANG DIPELAJARI */}
                <div className="mt-6">
                  <p className="text-sm font-semibold text-[#101F38]">
                    Hal yang akan dipelajari:
                  </p>

                  <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
                    <li className="flex items-start gap-3">
                      <span className="font-semibold text-[#3E729A]">1.</span>
                      <span>Asal mula terbentuknya Tata Surya.</span>
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="font-semibold text-[#3E729A]">2.</span>
                      <span>Proses pembentukan Matahari dan planet.</span>
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="font-semibold text-[#3E729A]">3.</span>
                      <span>Perkembangan Tata Surya hingga saat ini.</span>
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
                      aria-label="YouTube"
                    >
                      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
                    </svg>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Sumber Pembelajaran
                    </p>
                    <p className="text-sm font-semibold text-[#101F38]">
                      YouTube – Serial Sisi Terang
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* 03 - DESKRIPSI MATERI */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-900">
                Kesimpulan
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Oke,Setelah kamu mempelajari materi lewat inforafis,animasi
                interaktif sama vidio berikut kesimpulan dari materinya
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
              <div className="max-w-4xl space-y-8">
                {/* APA ITU TATA SURYA */}
                <article className="flex items-start gap-4">
                  <div className="w-12 shrink-0 pt-0.5 text-center text-3xl">
                    ☀️
                  </div>

                  <div className="min-w-0">
                    <h3 className="mb-2 text-base font-semibold text-[#101F38]">
                      Apa Itu Tata Surya?
                    </h3>

                    <p className="text-sm leading-7 text-slate-600">
                      Tata Surya merupakan kumpulan benda langit dengan Matahari
                      sebagai pusatnya. Di dalamnya terdapat delapan planet,
                      satelit alami, asteroid, komet, dan berbagai benda langit
                      lainnya yang bergerak dalam pengaruh gravitasi Matahari.
                    </p>
                  </div>
                </article>

                {/* AWAL MULA TERBENTUK */}
                <article className="flex items-start gap-4">
                  <div className="w-12 shrink-0 pt-0.5 text-center text-3xl">
                    🌌
                  </div>

                  <div className="min-w-0">
                    <h3 className="mb-2 text-base font-semibold text-[#101F38]">
                      Awal Mula Terbentuknya Tata Surya
                    </h3>

                    <p className="text-sm leading-7 text-slate-600">
                      Tata Surya diperkirakan terbentuk sekitar 4,6 miliar tahun
                      yang lalu dari awan besar gas dan debu di ruang angkasa.
                      Karena pengaruh gravitasi, awan tersebut mulai menyusut
                      dan berputar. Sebagian besar material berkumpul di bagian
                      tengah hingga membentuk Matahari, sedangkan material
                      lainnya berkembang menjadi planet dan benda langit
                      lainnya.
                    </p>
                  </div>
                </article>

                {/* TEORI TERBENTUKNYA */}
                <article className="flex items-start gap-4">
                  <div className="w-12 shrink-0 pt-0.5 text-center text-3xl">
                    🪐
                  </div>

                  <div className="min-w-0">
                    <h3 className="mb-2 text-base font-semibold text-[#101F38]">
                      Teori Terbentuknya Tata Surya
                    </h3>

                    <p className="text-sm leading-7 text-slate-600">
                      Para ilmuwan telah mengembangkan berbagai teori untuk
                      menjelaskan asal-usul Tata Surya. Beberapa teori yang
                      dikenal dalam sejarah perkembangan ilmu pengetahuan antara
                      lain teori Nebula, Planetesimal, Pasang Surut, dan Awan
                      Debu. Saat ini, model Nebula Surya menjadi penjelasan
                      ilmiah utama mengenai proses pembentukan Tata Surya.
                    </p>
                  </div>
                </article>

                {/* FAKTA MENARIK */}
                <div className="flex items-start gap-4 rounded-xl bg-[#F0F7FB] p-5">
                  <div className="w-11 shrink-0 pt-0.5 text-center text-2xl">
                    💡
                  </div>

                  <div className="min-w-0">
                    <h3 className="mb-2 text-sm font-semibold text-[#3E729A]">
                      Tahukah Kamu?
                    </h3>

                    <p className="text-sm leading-7 text-slate-600">
                      Tata Surya telah terbentuk sekitar 4,6 miliar tahun yang
                      lalu. Proses pembentukannya berlangsung sangat lama hingga
                      menghasilkan sistem benda langit yang kita kenal sekarang.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </DashboardContainer>
    </main>
  );
}
