import Link from "next/link";
import { ArrowUp, Globe } from "lucide-react";

import Container from "@/components/layouts/container";

const footerLinks = [
  { label: "Beranda", href: "#home" },
  { label: "Tentang", href: "#about" },
  { label: "Panduan", href: "#how-it-works" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#0B1220] text-white">
      {/* DEKORASI BACKGROUND */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-[#8ECAE6]/[0.04] blur-[100px]" />

      <Container className="relative z-10 pt-14 pb-8">
        {/* MAIN FOOTER */}
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-12 md:grid-cols-3 md:gap-10">
          {/* BRAND */}
          <div className="flex flex-col">
            <div className="flex h-12 items-center">
              <Link
                href="/"
                className="font-['Poppins',sans-serif] text-3xl font-bold tracking-tight"
              >
                <span className="text-white">Edu</span>
                <span className="text-[#8ECAE6]">Quest.</span>
              </Link>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Jelajahi keajaiban Tata Surya bersama EduQuest. Belajar mengenal
              planet dan benda langit melalui pengalaman pembelajaran yang
              interaktif dan menyenangkan.
            </p>
          </div>

          {/* NAVIGATION */}
          <div>
            <div className="flex h-12 items-center">
              <h3 className="text-base font-semibold tracking-wide text-white">
                Navigasi
              </h3>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-400">
              Temukan berbagai bagian dan informasi yang tersedia di platform
              EduQuest.
            </p>

            <ul className="mt-5 space-y-4">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-block text-sm text-slate-400 transition duration-200 hover:translate-x-1 hover:text-[#8ECAE6]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* DEVELOPER */}
          <div>
            <div className="flex h-12 items-center">
              <h3 className="text-base font-semibold tracking-wide text-white">
                Pengembang
              </h3>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-400">
              EduQuest dikembangkan sebagai media pembelajaran digital untuk
              membantu pengguna mengenal dan memahami Tata Surya.
            </p>

            <Link
              href="https://indrajaya.my.id"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#8ECAE6] transition duration-200 hover:text-white"
            >
              <Globe size={17} />
              indrajaya.my.id
            </Link>
          </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="flex flex-col items-center justify-between gap-5 pt-7 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-slate-500">
            © 2026 EduQuest. Hak cipta dilindungi.
          </p>

          <p className="text-xs text-slate-500">
            Dibuat dengan penuh dedikasi untuk dunia pendidikan.
          </p>

          <Link
            href="#home"
            aria-label="Kembali ke atas"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition duration-200 hover:border-[#8ECAE6]/40 hover:bg-[#8ECAE6]/10 hover:text-[#8ECAE6]"
          >
            <ArrowUp size={18} />
          </Link>
        </div>
      </Container>
    </footer>
  );
}
