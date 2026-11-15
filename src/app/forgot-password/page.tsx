"use client";

import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Lupa Password">
      <form className="space-y-5 font-serif">
        <p className="text-center text-sm leading-relaxed text-slate-400">
          Masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan
          untuk mengatur ulang password Anda.
        </p>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Email</label>

          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Masukkan email"
            required
            className="h-12 w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors focus:border-[#8ECAE6] placeholder:text-slate-500"
          />
        </div>

        <button
          type="submit"
          className="h-12 w-full rounded-lg bg-[#8ECAE6] text-sm font-semibold text-[#09090b] transition-colors hover:bg-[#a8d9ed]"
        >
          Kirim Link Reset Password
        </button>

        <p className="pt-2 text-center text-sm text-slate-400">
          Ingat password Anda?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#8ECAE6] transition-colors hover:text-white"
          >
            Kembali ke Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
