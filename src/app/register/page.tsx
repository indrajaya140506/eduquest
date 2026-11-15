"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <AuthLayout title="Register" showPlanetPanel>
      <form className="space-y-5 font-serif">
        {/* NAMA LENGKAP */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300">
            Nama Lengkap
          </label>
          <input
            type="text"
            name="fullName"
            autoComplete="name"
            placeholder="Masukkan nama lengkap"
            required
            className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors focus:border-[#8ECAE6] placeholder:text-slate-500"
          />
        </div>

        {/* EMAIL */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300">Email</label>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Masukkan email"
            required
            className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors focus:border-[#8ECAE6] placeholder:text-slate-500 [color-scheme:dark]"
          />
        </div>

        {/* PASSWORD */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300">Password</label>
          <div className="flex h-11 items-center rounded-lg border border-white/10 bg-white/[0.04] px-4 transition-colors focus-within:border-[#8ECAE6]">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              placeholder="Buat password"
              required
              minLength={6}
              className="h-full w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 text-slate-500 transition-colors hover:text-[#8ECAE6]"
              aria-label={
                showPassword ? "Sembunyikan password" : "Tampilkan password"
              }
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        {/* KONFIRMASI PASSWORD */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300">
            Konfirmasi Password
          </label>
          <div className="flex h-11 items-center rounded-lg border border-white/10 bg-white/[0.04] px-4 transition-colors focus-within:border-[#8ECAE6]">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Ulangi password"
              required
              minLength={6}
              className="h-full w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="ml-2 text-slate-500 transition-colors hover:text-[#8ECAE6]"
              aria-label={
                showConfirmPassword
                  ? "Sembunyikan password"
                  : "Tampilkan password"
              }
            >
              {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        {/* REGISTER BUTTON */}
        <button
          type="submit"
          className="h-12 w-full rounded-lg bg-[#8ECAE6] text-sm font-semibold text-[#09090b] transition-colors hover:bg-[#a8d9ed]"
        >
          Register
        </button>

        {/* LOGIN LINK */}
        <p className="pt-1 text-center text-sm text-slate-400">
          Sudah memiliki akun?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#8ECAE6] transition-colors hover:text-white"
          >
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
