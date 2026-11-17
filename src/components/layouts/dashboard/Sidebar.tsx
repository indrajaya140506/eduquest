import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Target,
  BookOpen,
  ClipboardCheck,
  ChartNoAxesColumnIncreasing,
  UserRound,
} from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
};

const menus = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Tujuan Pembelajaran",
    href: "/dashboard/tujuan-pembelajaran",
    icon: Target,
  },
  { label: "Materi Belajar", href: "/dashboard/materi", icon: BookOpen },
  { label: "Kuis", href: "/dashboard/kuis", icon: ClipboardCheck },
  {
    label: "Progres Belajar",
    href: "/dashboard/progres",
    icon: ChartNoAxesColumnIncreasing,
  },
  { label: "Profil", href: "/dashboard/profil", icon: UserRound },
];

export default function Sidebar({ isOpen }: SidebarProps) {
  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-50 w-64 border-r border-white/10 bg-[#101F38] px-5 pt-1 pb-6 font-[var(--font-poppins)] text-white transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* LOGO */}
      <div className="mb-4">
        <div className="flex justify-start px-2">
          <Link href="/dashboard" aria-label="EduQuest Dashboard">
            <Image
              src="/images/eduq.png"
              alt="EduQuest Logo"
              width={220}
              height={90}
              priority
              className="h-auto w-48 -translate-x-2 object-contain"
            />
          </Link>
        </div>

        <div className="mt-2 px-2 text-left font-[var(--font-poppins)]">
          <p className="text-lg font-normal leading-snug text-white">
            Dashboard,
          </p>
          <p className="text-lg font-normal leading-snug text-white">
            Platform Media
          </p>
          <p className="text-lg font-normal leading-snug text-white">
            Pembelajaran
          </p>
          <p className="text-lg font-normal leading-snug text-white">
            Tata Surya
          </p>
        </div>
      </div>

      <nav className="space-y-1">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <Link
              key={menu.label}
              href={menu.href}
              className="flex items-center gap-3 rounded-lg px-2 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-gradient-to-r hover:from-[#8ECAE6]/20 hover:to-transparent hover:text-[#8ECAE6]"
            >
              <Icon
                size={20}
                strokeWidth={2.2}
                className="text-white drop-shadow-[0_0_3px_rgba(142,202,230,0.35)]"
              />
              {menu.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
