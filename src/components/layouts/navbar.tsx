"use client";

import Link from "next/link";
import { useState } from "react";
import {
  GraduationCap,
  UserRound,
  ChevronDown,
  Menu,
  X,
  LogIn,
  UserPlus,
} from "lucide-react";

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
    <header className="fixed top-0 z-50 w-full border-b border-white/20 bg-white/60 backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950 text-white">
            <GraduationCap size={23} />
          </div>

          <span className="text-xl font-bold tracking-tight text-blue-950">
            Edu<span className="text-blue-600">Quest.</span>
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* USER DROPDOWN */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/50 px-3 py-2.5 text-blue-950 transition hover:bg-white"
            aria-label="Menu akun"
            aria-expanded={isProfileOpen}
          >
            <UserRound size={20} />
            <ChevronDown
              size={15}
              className={`transition-transform ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-48 overflow-hidden rounded-xl border border-slate-100 bg-white p-2 shadow-xl shadow-slate-200/50">
              <Link
                href="/login"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                <LogIn size={17} />
                Login
              </Link>

              <Link
                href="/register"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
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
          className="flex h-10 w-10 items-center justify-center rounded-xl text-blue-950 transition hover:bg-white/70 md:hidden"
          aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </Container>

      {/* MOBILE NAVIGATION */}
      {isOpen && (
        <div className="border-t border-slate-100/80 bg-white/95 py-5 shadow-lg backdrop-blur-xl md:hidden">
          <Container>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  {link.label}
                </Link>
              ))}

              <div className="my-2 border-t border-slate-100" />

              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50"
              >
                <LogIn size={18} />
                Login
              </Link>

              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50"
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
