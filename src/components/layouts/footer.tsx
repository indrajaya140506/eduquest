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
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#0B1220] font-serif text-white">
      {/* DEKORASI BACKGROUND */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-[#8ECAE6]/[0.04] blur-[100px]" />

      <Container className="relative z-10 pt-10 pb-6">
        {/* MAIN FOOTER */}
        <div className="grid grid-cols-1 gap-7 border-b border-white/10 pb-8 md:grid-cols-3 md:gap-10">
          {/* BRAND */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold tracking-tight">
                <span className="text-white">Edu</span>
                <span className="text-[#8ECAE6]">Quest.</span>
              </Link>
            </div>

            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
              Jelajahi keajaiban Tata Surya bersama EduQuest. Belajar mengenal
              planet dan benda langit melalui pengalaman pembelajaran yang
              interaktif dan menyenangkan.
            </p>
          </div>

          {/* NAVIGATION */}
          <div className="md:pl-16">
            <div className="flex items-center">
              <h3 className="text-sm font-normal tracking-wide text-white">
                NAVIGASI
              </h3>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Temukan berbagai bagian dan informasi yang tersedia di platform
              EduQuest.
            </p>

            <ul className="mt-3 space-y-2">
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
          <div className="md:pl-6">
            <div className="flex items-center">
              <h3 className="text-sm font-normal tracking-wide text-white">
                PENGEMBANG
              </h3>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              EduQuest dikembangkan sebagai media pembelajaran digital untuk
              membantu pengguna mengenal dan memahami Tata Surya. Eduquest
              dikembangkan oleh :
            </p>

            <Link
              href="https://indrajaya.my.id"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#8ECAE6] transition duration-200 hover:text-white"
            >
              <Globe size={16} />
              indrajaya.my.id
            </Link>
          </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="flex flex-col items-center justify-between gap-4 pt-5 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-slate-500">
            © 2026{" "}
            <span className="font-semibold">
              <span className="text-white">Edu</span>
              <span className="text-[#8ECAE6]">Quest.</span>
            </span>{" "}
            All rights reserved.
          </p>

          <Link
            href="#home"
            aria-label="Kembali ke atas"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition duration-200 hover:border-[#8ECAE6]/40 hover:bg-[#8ECAE6]/10 hover:text-[#8ECAE6]"
          >
            <ArrowUp size={17} />
          </Link>
        </div>
      </Container>
    </footer>
  );
}
