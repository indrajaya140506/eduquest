import { BookOpen, Target, Lightbulb, GraduationCap } from "lucide-react";
import Container from "@/components/layouts/container";

const highlights = [
  {
    icon: BookOpen,
    title: "Materi Interaktif",
    description:
      "Pelajari materi melalui penjelasan yang mudah dipahami dan menarik.",
  },
  {
    icon: Lightbulb,
    title: "Pengalaman Belajar",
    description:
      "Temukan pengalaman belajar melalui video dan aktivitas edukatif.",
  },
  {
    icon: Target,
    title: "Evaluasi Terarah",
    description: "Ukur pemahaman melalui latihan dan evaluasi pembelajaran.",
  },
];

export default function Tentang() {
  return (
    <section id="about" className="bg-slate-50 py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Tentang EduQuest
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Belajar Bukan Sekadar Membaca
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-500">
            EduQuest merupakan platform pembelajaran digital yang dirancang
            untuk menghadirkan pengalaman belajar lebih menarik melalui materi,
            video, aktivitas interaktif, dan evaluasi dalam satu tempat.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-100 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Icon size={24} />
                </div>

                <h3 className="mt-6 text-lg font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
