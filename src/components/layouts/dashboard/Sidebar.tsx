import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Orbit,
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
  { label: "Tata Surya", href: "/dashboard/tata-surya", icon: Orbit },
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
      className={`fixed top-0 bottom-0 left-0 z-50 w-64 border-r border-white/10 bg-[#09090b] px-5 pt-1 pb-6 font-sans text-white transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* LOGO */}
      <div className="mb-7 flex items-center justify-center">
        <Link href="/dashboard" aria-label="EduQuest Dashboard">
          <Image
            src="/images/eduq.png"
            alt="EduQuest Logo"
            width={220}
            height={90}
            priority
            className="h-auto w-48 object-contain"
          />
        </Link>
      </div>

      {/* MENU */}
      <p className="mb-5 font-sans text-xs font-semibold tracking-widest text-white/50">
        MENU UTAMA
      </p>

      <nav className="space-y-2 font-sans">
        {menus.map((menu, index) => {
          const Icon = menu.icon;

          return (
            <Link
              key={menu.label}
              href={menu.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                index === 0
                  ? "bg-[#8ECAE6]/10 text-[#8ECAE6]"
                  : "text-white hover:bg-white/5 hover:text-[#8ECAE6]"
              }`}
            >
              <Icon size={19} />
              {menu.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
