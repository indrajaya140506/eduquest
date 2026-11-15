"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <AuthLayout title="Buat Password Baru">
      <form className="space-y-5">
        <p className="text-center text-sm leading-relaxed text-slate-400">
          Silakan buat password baru untuk akun EduQuest Anda. Pastikan password
          mudah diingat dan tetap aman.
        </p>

        {/* PASSWORD BARU */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">
            Password Baru
          </label>

          <div className="flex h-12 items-center rounded-lg border border-white/10 bg-white/[0.04] px-4 transition-colors focus-within:border-[#8ECAE6]">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              placeholder="Masukkan password baru"
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
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">
            Konfirmasi Password Baru
          </label>

          <div className="flex h-12 items-center rounded-lg border border-white/10 bg-white/[0.04] px-4 transition-colors focus-within:border-[#8ECAE6]">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Ulangi password baru"
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

        {/* RESET PASSWORD BUTTON */}
        <button
          type="submit"
          className="h-12 w-full rounded-lg bg-[#8ECAE6] text-sm font-semibold text-[#09090b] transition-colors hover:bg-[#a8d9ed]"
        >
          Simpan Password Baru
        </button>

        {/* BACK TO LOGIN */}
        <p className="pt-2 text-center text-sm text-slate-400">
          Ingat password Anda?{" "}
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
