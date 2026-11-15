"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { UserRound, ChevronDown, Menu, X, LogIn, UserPlus } from "lucide-react";

import Container from "@/components/layouts/container";

const navLinks = [
  { label: "Beranda", href: "#home" },
  { label: "Tentang", href: "#about" },
  { label: "Panduan", href: "#how-it-works" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/[0.08] bg-[#09090b]/35 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-2xl backdrop-saturate-150">
      <Container className="flex h-20 items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="-ml-10 flex shrink-0 items-center">
          <Image
            src="/images/eduq.png"
            alt="EduQuest Logo"
            width={350}
            height={125}
            priority
            className="h-[95px] w-auto max-w-none object-contain"
          />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-serif text-sm font-medium text-white transition-colors duration-200 hover:text-[#8ECAE6]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* USER DROPDOWN */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.05] px-3 py-2.5 text-white transition-colors duration-200 hover:border-[#8ECAE6]/50 hover:text-[#8ECAE6] hover:bg-[#8ECAE6]/10"
            aria-label="Menu akun"
            aria-expanded={isProfileOpen}
          >
            <UserRound size={22} />

            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* DROPDOWN MENU */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-48 overflow-hidden rounded-xl border border-[#8ECAE6]/25 bg-[#8ECAE6]/15 p-2 shadow-xl shadow-black/20 backdrop-blur-2xl">
              {/* LOGIN */}
              <Link
                href="/login"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-normal text-white/80 transition-colors duration-200 hover:bg-[#8ECAE6]/10 hover:text-[#8ECAE6]"
              >
                <LogIn size={17} />
                Login
              </Link>

              {/* REGISTER */}
              <Link
                href="/register"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-normal text-white/80 transition-colors duration-200 hover:bg-[#8ECAE6]/10 hover:text-[#8ECAE6]"
              >
                <UserPlus size={17} />
                Register
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition-colors duration-200 hover:bg-[#8ECAE6]/10 hover:text-[#8ECAE6] md:hidden"
          aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </Container>

      {/* MOBILE NAVIGATION */}
      {isOpen && (
        <div className="border-t border-white/10 bg-[#09090b]/90 py-5 shadow-lg backdrop-blur-2xl md:hidden">
          <Container>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-4 py-3 font-serif text-base font-medium text-white transition-colors duration-200 hover:bg-[#8ECAE6]/10 hover:text-[#8ECAE6]"
                >
                  {link.label}
                </Link>
              ))}

              <div className="my-2 border-t border-white/10" />

              {/* LOGIN */}
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-normal text-white/80 transition-colors duration-200 hover:bg-[#8ECAE6]/10 hover:text-[#8ECAE6]"
              >
                <LogIn size={18} />
                Login
              </Link>

              {/* REGISTER */}
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-normal text-white/80 transition-colors duration-200 hover:bg-[#8ECAE6]/10 hover:text-[#8ECAE6]"
              >
                <UserPlus size={18} />
                Register
              </Link>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
