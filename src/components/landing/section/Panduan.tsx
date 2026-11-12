import {
  UserRound,
  ClipboardCheck,
  BookOpen,
  PlayCircle,
  Gamepad2,
  Trophy,
} from "lucide-react";
import Container from "@/components/layouts/container";

const steps = [
  {
    number: "01",
    icon: UserRound,
    title: "Buat Akun",
    description:
      "Daftar akun dan masuk ke platform EduQuest untuk memulai pembelajaran.",
  },
  {
    number: "02",
    icon: ClipboardCheck,
    title: "Tes Diagnostik",
    description:
      "Kerjakan tes awal untuk mengetahui pemahaman sebelum mempelajari materi.",
  },
  {
    number: "03",
    icon: BookOpen,
    title: "Pelajari Materi",
    description: "Baca dan pahami materi pembelajaran yang telah disediakan.",
  },
  {
    number: "04",
    icon: PlayCircle,
    title: "Tonton Video",
    description: "Perdalam pemahaman melalui video pembelajaran yang menarik.",
  },
  {
    number: "05",
    icon: Gamepad2,
    title: "Aktivitas Interaktif",
    description:
      "Ikuti aktivitas edukatif untuk menguji pemahaman secara langsung.",
  },
  {
    number: "06",
    icon: Trophy,
    title: "Evaluasi Hasil",
    description:
      "Kerjakan tes akhir dan lihat hasil serta perkembangan belajarmu.",
  },
];

export default function Panduan() {
  return (
    <section id="how-it-works" className="bg-white py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Panduan Penggunaan
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Mulai Belajar dalam 6 Langkah
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-500">
            Ikuti alur pembelajaran EduQuest untuk mendapatkan pengalaman
            belajar yang lebih terarah dan menyenangkan.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative rounded-2xl border border-slate-100 bg-white p-7 transition hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Icon size={24} />
                  </div>

                  <span className="text-3xl font-bold text-slate-100">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
