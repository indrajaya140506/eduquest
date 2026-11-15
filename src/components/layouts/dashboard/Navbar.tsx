"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Menu, UserRound } from "lucide-react";
import DashboardContainer from "./DashboardContainer";
import { createClient } from "@/lib/supabase/client";

type NavbarProps = {
  onMenuClick: () => void;
  sidebarOpen: boolean;
};

export default function Navbar({ onMenuClick, sidebarOpen }: NavbarProps) {
  const supabase = createClient();
  const pathname = usePathname();

  // Judul Navbar berdasarkan halaman aktif
  const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/tata-surya": "Tata Surya",
    "/dashboard/materi": "Materi Belajar",
    "/dashboard/kuis": "Kuis",
    "/dashboard/progres": "Progres Belajar",
    "/dashboard/profil": "Profil",
  };

  const pageTitle = pageTitles[pathname] || "Dashboard";

  // Data nama pengguna
  const [userName, setUserName] = useState("Pengguna");

  useEffect(() => {
    async function getUserProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserName(
          user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "Pengguna",
        );
      }
    }

    getUserProfile();

    // Memperbarui nama ketika status autentikasi berubah
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-20 border-b border-slate-200 bg-white transition-[left] duration-300 ${
        sidebarOpen ? "left-0 lg:left-64" : "left-0"
      }`}
    >
      <DashboardContainer className="h-full">
        <div className="flex h-full items-center justify-between">
          {/* KIRI: Toggle Sidebar dan Judul Halaman */}
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

          {/* KANAN: Notifikasi dan Profil Pengguna */}
          <div className="flex shrink-0 items-center gap-4">
            <div className="flex shrink-0 items-center gap-3">
              <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                {userName}
              </span>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-600">
                <UserRound size={19} />
              </div>
            </div>
          </div>
        </div>
      </DashboardContainer>
    </header>
  );
}
