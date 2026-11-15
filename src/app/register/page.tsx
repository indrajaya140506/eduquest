"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const supabase = createClient();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const fullName = String(formData.get("fullName") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (!fullName) {
      setError("Nama lengkap wajib diisi.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sesuai.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal terdiri dari 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      // Registrasi berhasil, pengguna harus Login secara manual.
      setMessage(
        "Registrasi berhasil! Silakan Login menggunakan akun yang sudah dibuat.",
      );

      form.reset();
    } catch {
      setError("Terjadi kesalahan. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Register" showPlanetPanel>
      <form onSubmit={handleRegister} className="space-y-5 font-serif">
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

        {/* STATUS MESSAGE */}
        {error && (
          <p className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        {message && (
          <p className="rounded-lg border border-[#8ECAE6]/20 bg-[#8ECAE6]/10 px-3 py-2 text-sm text-[#8ECAE6]">
            {message}
          </p>
        )}

        {/* REGISTER BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-lg bg-[#8ECAE6] text-sm font-semibold text-[#09090b] transition-colors hover:bg-[#a8d9ed] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Register"}
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
