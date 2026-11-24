"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, UserRound, LogOut, Loader2, X } from "lucide-react";

import DashboardContainer from "./DashboardContainer";
import { createClient } from "@/lib/supabase/client";

type NavbarProps = {
  onMenuClick: () => void;
  sidebarOpen: boolean;
};

export default function Navbar({ onMenuClick, sidebarOpen }: NavbarProps) {
  const supabase = useMemo(() => createClient(), []);
  const pathname = usePathname();
  const router = useRouter();

  const [userName, setUserName] = useState("Pengguna");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Judul halaman
  const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/tata-surya": "Tata Surya",
    "/dashboard/materi": "Materi Belajar",
    "/dashboard/kuis": "Kuis",
    "/dashboard/progres": "Progres Belajar",
    "/dashboard/profil": "Profil",
    "/dashboard/tujuan-pembelajaran": "Tujuan Pembelajaran",
  };

  const pageTitle = pageTitles[pathname] || "Dashboard";

  // Mengambil informasi pengguna
  useEffect(() => {
    let mounted = true;

    async function getUserProfile() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!mounted || error) return;

      if (user) {
        setUserName(
          user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "Pengguna",
        );
      } else {
        setUserName("Pengguna");
      }
    }

    getUserProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        setUserName(
          session.user.user_metadata?.full_name ||
            session.user.email?.split("@")[0] ||
            "Pengguna",
        );
      } else {
        setUserName("Pengguna");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Reset modal dan loading ketika berpindah halaman
  useEffect(() => {
    setShowLogoutConfirm(false);
    setLoggingOut(false);
  }, [pathname]);

  // Membuka konfirmasi logout
  const openLogoutConfirm = () => {
    setLoggingOut(false);
    setShowLogoutConfirm(true);
  };

  // Menutup konfirmasi logout
  const closeLogoutConfirm = () => {
    if (loggingOut) return;

    setShowLogoutConfirm(false);
  };

  // Proses logout
  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setShowLogoutConfirm(false);
      setLoggingOut(false);
      setUserName("Pengguna");

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Gagal logout:", error);

      setLoggingOut(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 right-0 z-30 h-20 border-b border-slate-200 bg-white transition-[left] duration-300 ${
          sidebarOpen ? "left-0 lg:left-64" : "left-0"
        }`}
      >
        <DashboardContainer className="h-full">
          <div className="flex h-full items-center justify-between">
            {/* Bagian kiri */}
            <div className="flex items-center gap-3">
              <button
                onClick={onMenuClick}
                aria-label="Toggle sidebar"
                className="shrink-0 text-slate-700 transition hover:text-[#397B9A]"
              >
                <Menu size={22} />
              </button>

              <h1 className="font-sans text-xl font-semibold text-slate-900">
                {pageTitle}
              </h1>
            </div>

            {/* Bagian kanan */}
            <div className="flex shrink-0 items-center gap-4">
              {/* Profil pengguna */}
              <div className="flex shrink-0 items-center gap-3">
                <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                  {userName}
                </span>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-600">
                  <UserRound size={19} />
                </div>
              </div>

              {/* Pembatas */}
              <div className="h-8 w-px bg-slate-200" />

              {/* Tombol logout */}
              <button
                onClick={openLogoutConfirm}
                aria-label="Logout"
                title="Logout"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-500"
              >
                <LogOut size={19} />
              </button>
            </div>
          </div>
        </DashboardContainer>
      </header>

      {/* Modal konfirmasi logout */}
      {showLogoutConfirm && (
        <div
          onClick={closeLogoutConfirm}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-[3px]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[380px] rounded-2xl bg-white p-6 shadow-2xl"
          >
            {/* Tombol tutup */}
            <button
              onClick={closeLogoutConfirm}
              disabled={loggingOut}
              aria-label="Tutup modal"
              className="absolute right-4 top-4 text-slate-400 transition hover:text-slate-700 disabled:opacity-40"
            >
              <X size={19} />
            </button>

            {/* Ikon logout */}
            <div className="mb-5 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                <LogOut size={25} />
              </div>
            </div>

            {/* Judul */}
            <h2 className="mb-2 text-center text-lg font-semibold text-slate-900">
              Konfirmasi Logout
            </h2>

            {/* Deskripsi */}
            <p className="mb-7 text-center text-sm leading-relaxed text-slate-500">
              Apakah kamu yakin ingin keluar dari akun? Kamu perlu login kembali
              untuk mengakses dashboard.
            </p>

            {/* Tombol aksi */}
            <div className="flex gap-3">
              <button
                onClick={closeLogoutConfirm}
                disabled={loggingOut}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Batal
              </button>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-80"
              >
                {loggingOut ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Keluar...
                  </>
                ) : (
                  <>
                    <LogOut size={16} />
                    Ya, Logout
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
