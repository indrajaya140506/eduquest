"use client";

import { useEffect, useState } from "react";
import Container from "@/components/layouts/container";

export default function Hero() {
  const words = ["Platform media", "pembelajaran", "tata surya"];
  const fullText = words.join(" ");

  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayText === fullText) {
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && displayText === "") {
      timeout = setTimeout(() => setIsDeleting(false), 500);
    } else {
      timeout = setTimeout(
        () => {
          setDisplayText((current) =>
            isDeleting
              ? current.slice(0, -1)
              : fullText.slice(0, current.length + 1),
          );
        },
        isDeleting ? 65 : 110,
      );
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting]);

  const firstLine = displayText.slice(0, 14);
  const secondLine = displayText.slice(15, 27);
  const thirdLine = displayText.slice(28);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-[#09090b]"
    >
      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-[#8ECAE6]/[0.025] blur-[130px]" />

      {/* SPACE DECORATION */}
      {/* SPACE DECORATION */}
      <div className="space-decoration pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <div className="moon" />

        <span className="star star-1" />
        <span className="star star-2" />
        <span className="star star-3" />
        <span className="star star-4" />
        <span className="star star-5" />
        <span className="star star-6" />
        <span className="star star-7" />
        <span className="star star-8" />
        <span className="star star-9" />
        <span className="star star-10" />

        <span className="shooting-star shooting-star-1" />
        <span className="shooting-star shooting-star-2" />
      </div>

      <Container className="relative">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2">
          {/* HERO TEXT */}
          <div className="flex flex-col items-start">
            <h1
              aria-label="Platform media pembelajaran tata surya"
              className="font-serif text-[clamp(1.6rem,3.6vw,2.9rem)] font-semibold leading-[1.4] tracking-tight text-[#D1D5DB]"
            >
              {/* BARIS 1 */}
              <span className="block h-[1.4em] whitespace-nowrap">
                {firstLine}
                {displayText.length <= 14 && (
                  <span className="ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.05em] animate-pulse bg-[#8ECAE6]" />
                )}
              </span>

              {/* BARIS 2 */}
              <span className="block h-[1.4em] whitespace-nowrap text-[#8ECAE6]">
                {secondLine}
                {displayText.length > 14 && displayText.length <= 27 && (
                  <span className="ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.05em] animate-pulse bg-[#8ECAE6]" />
                )}
              </span>

              {/* BARIS 3 */}
              <span className="block h-[1.4em] whitespace-nowrap">
                {thirdLine}
                {displayText.length > 27 && (
                  <span className="ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.05em] animate-pulse bg-[#8ECAE6]" />
                )}
              </span>
            </h1>
          </div>

          {/* SOLAR SYSTEM ANIMATION */}
          <div className="solar-system">
            <div className="sun">
              <div className="sun-glow" />
            </div>

            <div className="orbit orbit-one">
              <div className="planet mercury" />
            </div>

            <div className="orbit orbit-two">
              <div className="planet venus" />
            </div>

            <div className="orbit orbit-three">
              <div className="planet earth">
                <span />
              </div>
            </div>

            <div className="orbit orbit-four">
              <div className="planet mars" />
            </div>

            <div className="orbit orbit-five">
              <div className="planet jupiter" />
            </div>

            <div className="orbit orbit-six">
              <div className="planet saturn">
                <span />
              </div>
            </div>

            <div className="orbit orbit-seven">
              <div className="planet uranus" />
            </div>

            <div className="orbit orbit-eight">
              <div className="planet neptune" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
