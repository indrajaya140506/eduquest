"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout title="Login" showPlanetPanel>
      <form className="space-y-5 font-serif">
        {/* EMAIL */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Email</label>

          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Masukkan email"
            required
            className="h-12 w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-colors focus:border-[#8ECAE6] placeholder:text-slate-500 [color-scheme:dark]"
          />
        </div>

        {/* PASSWORD */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Password</label>
          <div className="flex h-12 items-center rounded-lg border border-white/10 bg-white/[0.04] px-4 transition-colors focus-within:border-[#8ECAE6]">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              placeholder="Masukkan password"
              required
              className="h-full w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-slate-500
    [-webkit-text-fill-color:white]
    [&:-webkit-autofill]:[box-shadow:inset_0_0_0_1000px_#172b43]
    [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
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

        {/* FORGOT PASSWORD */}
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs text-[#8ECAE6]/80 transition-colors hover:text-[#8ECAE6]"
          >
            Lupa password?
          </Link>
        </div>

        {/* LOGIN BUTTON */}
        <button
          type="submit"
          className="h-12 w-full rounded-lg bg-[#8ECAE6] text-sm font-semibold text-[#09090b] transition-colors hover:bg-[#a8d9ed]"
        >
          Login
        </button>

        {/* REGISTER LINK */}
        <p className="pt-2 text-center text-sm text-slate-400">
          Belum memiliki akun?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#8ECAE6] transition-colors hover:text-white"
          >
            Register
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
