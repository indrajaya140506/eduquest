import Image from "next/image";
import type { ReactNode } from "react";
import Container from "@/components/layouts/container";

type AuthLayoutProps = {
  title: string;
  children: ReactNode;
  showPlanetPanel?: boolean;
};

export default function AuthLayout({
  title,
  children,
  showPlanetPanel = false,
}: AuthLayoutProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090b] py-10">
      {/* ANIMATED BACKGROUND STARS */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {Array.from({ length: 90 }).map((_, i) => (
          <span
            key={i}
            className="absolute animate-pulse rounded-full bg-white"
            style={{
              width: `${i % 7 === 0 ? 3 : 2}px`,
              height: `${i % 7 === 0 ? 3 : 2}px`,
              top: `${(i * 37) % 100}%`,
              left: `${(i * 61) % 100}%`,
              opacity: 0.2 + (i % 5) * 0.12,
              animationDuration: `${2 + (i % 5)}s`,
              animationDelay: `${(i % 7) * 0.4}s`,
            }}
          />
        ))}
      </div>

      <Container>
        <div
          className={`relative mx-auto w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#122337] shadow-[0_15px_60px_rgba(0,0,0,0.4)] ${
            showPlanetPanel
              ? "max-w-5xl lg:grid lg:grid-cols-2"
              : "max-w-[420px]"
          }`}
        >
          {/* PLANET PANEL */}
          {showPlanetPanel && (
            <div className="relative hidden min-h-[510px] items-center justify-center overflow-hidden bg-[#071522] lg:flex">
              {/* BACKGROUND GLOW */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.12),transparent_65%)]" />

              {/* STARS */}
              {Array.from({ length: 55 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: `${i % 5 === 0 ? 3 : 2}px`,
                    height: `${i % 5 === 0 ? 3 : 2}px`,
                    top: `${(i * 37) % 100}%`,
                    left: `${(i * 61) % 100}%`,
                    opacity: 0.2 + (i % 5) * 0.12,
                  }}
                />
              ))}

              {/* EARTH */}
              <div className="relative z-10 h-[310px] w-[310px]">
                {/* ATMOSPHERE GLOW */}
                <div className="absolute inset-[-30px] rounded-full bg-sky-400/15 blur-[45px]" />

                {/* EARTH IMAGE */}
                <Image
                  src="/images/earth.png"
                  alt="Planet Bumi"
                  fill
                  priority
                  sizes="310px"
                  className="animate-[spin_90s_linear_infinite] object-contain drop-shadow-[0_0_18px_rgba(56,189,248,0.18)]"
                />
              </div>
            </div>
          )}

          {/* ORGANIC CURVED DIVIDER */}
          {showPlanetPanel && (
            <svg
              className="pointer-events-none absolute left-1/2 top-0 z-20 hidden h-full w-[220px] -translate-x-1/2 lg:block"
              viewBox="0 0 220 570"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="
                  M110 0
                  C110 100 145 145 175 220
                  C205 300 195 365 155 425
                  C120 480 115 525 130 570
                  L220 570
                  L220 0
                  Z
                "
                fill="#122337"
              />
            </svg>
          )}

          {/* AUTH FORM */}
          <div className="relative z-30 flex min-h-[570px] w-full items-center justify-center px-7 py-10 sm:px-10">
            <div className="w-full max-w-[420px]">
              {/* LOGO */}
              <div className="mb-5 flex justify-center">
                <Image
                  src="/images/eduq.png"
                  alt="EduQuest"
                  width={250}
                  height={90}
                  priority
                  className="h-auto w-[145px] object-contain"
                />
              </div>

              {/* TITLE */}
              <h1 className="mb-8 text-center font-['Poppins',sans-serif] text-2xl font-semibold tracking-tight text-white">
                {title}
              </h1>

              {children}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
