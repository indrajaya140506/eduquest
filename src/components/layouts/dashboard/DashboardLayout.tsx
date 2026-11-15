"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Sidebar isOpen={sidebarOpen} />

      {/* Overlay khusus tampilan mobile */}
      {sidebarOpen && (
        <button
          aria-label="Tutup sidebar"
          onClick={toggleSidebar}
          className="fixed inset-0 top-20 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Area konten utama */}
      <div
        className={`min-h-screen transition-[margin] duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        <Navbar onMenuClick={toggleSidebar} sidebarOpen={sidebarOpen} />

        <main className="min-h-screen bg-slate-100 pt-20">
          <div className="min-h-[calc(100vh-144px)] py-8">{children}</div>

          <Footer />
        </main>
      </div>
    </div>
  );
}
