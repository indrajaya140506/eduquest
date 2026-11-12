import { Play } from "lucide-react";
import Container from "@/components/layouts/container";

export default function Panduan() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-[#09090b] py-24"
    >
      {/* ANIMASI BINTANG */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 12 }).map((_, index) => (
          <span
            key={index}
            className="absolute h-[3px] w-[3px] animate-pulse rounded-full bg-white shadow-[0_0_8px_#8ECAE6]"
            style={{
              top: `${(index * 37 + 12) % 95}%`,
              left: `${(index * 53 + 8) % 95}%`,
              animationDelay: `${index * 0.25}s`,
              opacity: 0.7,
            }}
          />
        ))}
      </div>

      <Container className="relative z-10">
        <div className="w-full">
          {/* JUDUL DAN GARIS PEMISAH */}
          <div className="flex items-center gap-6">
            <h2 className="shrink-0 font-['Poppins',sans-serif] text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Panduan
            </h2>

            <div className="h-px flex-1 bg-white/15" />
          </div>

          {/* PENJELASAN */}
          <p className="mt-8 max-w-3xl text-base leading-8 text-slate-400">
            Pelajari cara menggunakan EduQuest dan ikuti setiap tahapan
            pembelajaran untuk menjelajahi tata surya dengan lebih mudah,
            interaktif, dan menyenangkan.
          </p>

          {/* VIDEO PLACEHOLDER */}
          <div className="mt-10 flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#8ECAE6]/30 bg-[#8ECAE6]/10 text-[#8ECAE6] transition duration-300 hover:scale-110 hover:bg-[#8ECAE8]/20">
                <Play size={28} fill="currentColor" />
              </div>

              <p className="text-sm text-slate-500">Video panduan EduQuest</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
