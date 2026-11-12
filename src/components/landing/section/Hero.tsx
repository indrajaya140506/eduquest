import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react";
import Container from "@/components/layouts/container";

export default function Hero() {
  return (
    <section
      id="home"
      className="flex min-h-[85vh] items-center bg-white pt-24 pb-16"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              <GraduationCap size={17} />
              Platform Pembelajaran Digital
            </div>

            <h1 className="text-4xl leading-tight font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Belajar Lebih Mudah,
              <span className="text-blue-600"> Berkembang Lebih Jauh.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-slate-500 sm:text-lg">
              Jelajahi pengalaman belajar yang lebih menarik melalui materi
              interaktif, video pembelajaran, dan aktivitas edukatif dalam satu
              platform.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
              >
                Mulai Belajar
                <ArrowRight size={18} />
              </Link>

              <Link
                href="#about"
                className="rounded-xl border border-slate-200 px-6 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-3 text-sm text-slate-500">
              <BookOpen size={19} className="text-blue-600" />
              Belajar interaktif, kapan saja dan di mana saja.
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-blue-100 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-indigo-100 blur-3xl" />

            <div className="relative rounded-3xl border border-slate-100 bg-slate-50 p-6 shadow-xl shadow-slate-200/50 sm:p-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Welcome to
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    EduQuest
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
                  <GraduationCap size={26} />
                </div>
              </div>

              <div className="mt-10 rounded-2xl bg-blue-600 p-6 text-white">
                <p className="text-sm text-blue-100">Your Learning Journey</p>
                <h3 className="mt-2 text-2xl font-bold">
                  Learn. Explore. Grow.
                </h3>
                <p className="mt-3 text-sm leading-6 text-blue-100">
                  Temukan cara baru untuk memahami setiap materi dan kembangkan
                  kemampuanmu.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white p-4">
                  <BookOpen className="text-blue-600" size={24} />
                  <p className="mt-3 font-semibold text-slate-800">Materi</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Belajar lebih terarah
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <GraduationCap className="text-blue-600" size={24} />
                  <p className="mt-3 font-semibold text-slate-800">Evaluasi</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Ukur hasil belajarmu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
