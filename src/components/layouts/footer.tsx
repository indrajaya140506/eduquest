import Link from "next/link";
import {
  GraduationCap,
  Facebook,
  Instagram,
  Mail,
  ArrowUp,
} from "lucide-react";

import Container from "@/components/layouts/container";

const footerLinks = [
  { label: "Beranda", href: "#home" },
  { label: "Tentang", href: "#about" },
  { label: "Panduan", href: "#how-it-works" },
];

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white">
      <Container className="pt-16 pb-8">
        {/* MAIN FOOTER */}
        <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-3">
          {/* BRAND */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-950">
                <GraduationCap size={24} />
              </div>

              <span className="text-xl font-bold tracking-tight">
                Edu<span className="text-blue-400">Quest.</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-blue-100/70">
              Jelajahi keajaiban Tata Surya bersama EduQuest. Belajar mengenal
              planet dan benda langit melalui pengalaman pembelajaran yang
              interaktif dan menyenangkan.
            </p>
          </div>

          {/* NAVIGATION */}
          <div>
            <h3 className="text-sm font-bold tracking-wide">Navigasi</h3>

            <ul className="mt-5 space-y-4">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-blue-100/70 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-sm font-bold tracking-wide">
              Jelajahi EduQuest
            </h3>

            <p className="mt-5 text-sm leading-7 text-blue-100/70">
              Mulai perjalananmu untuk mengenal Matahari, delapan planet, dan
              berbagai keajaiban luar angkasa.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-950 transition hover:bg-blue-50"
              >
                Mulai Belajar
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="flex flex-col items-center justify-between gap-5 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-blue-100/60">
            © 2026 EduQuest. All rights reserved.
          </p>

          <p className="text-xs text-blue-100/60">
            Explore the Solar System. Learn Beyond Limits.
          </p>

          <Link
            href="#home"
            aria-label="Kembali ke atas"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-white transition hover:bg-white/10"
          >
            <ArrowUp size={18} />
          </Link>
        </div>
      </Container>
    </footer>
  );
}
