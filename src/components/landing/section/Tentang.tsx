"use client";

import { useEffect, useState } from "react";
import Container from "@/components/layouts/container";

export default function Tentang() {
  const description =
    "EduQuest merupakan platform pembelajaran digital yang menghadirkan pengalaman menjelajahi dan memahami tata surya secara interaktif. Melalui materi edukatif, video, visualisasi, dan berbagai aktivitas pembelajaran, pengguna dapat mengenal lebih jauh tentang Matahari, planet, serta berbagai benda langit lainnya. EduQuest hadir untuk siapa saja yang memiliki rasa ingin tahu dan ketertarikan terhadap luasnya alam semesta.";

  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayText === description) {
      timeout = setTimeout(() => setIsDeleting(true), 3500);
    } else if (isDeleting && displayText === "") {
      timeout = setTimeout(() => setIsDeleting(false), 1000);
    } else {
      timeout = setTimeout(
        () => {
          setDisplayText((current) =>
            isDeleting
              ? current.slice(0, -1)
              : description.slice(0, current.length + 1),
          );
        },
        isDeleting ? 40 : 65,
      );
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, description]);

  const planets = [
    {
      name: "Merkurius",
      size: "h-3 w-3",
      style: {
        background:
          "radial-gradient(circle at 30% 30%, #b8b5ae, #77736e 65%, #35332f)",
      },
    },
    {
      name: "Venus",
      size: "h-5 w-5",
      style: {
        background:
          "radial-gradient(circle at 30% 30%, #f3d7a1, #b98b55 65%, #66452d)",
      },
    },
    {
      name: "Bumi",
      size: "h-6 w-6",
      style: {
        background:
          "radial-gradient(circle at 30% 30%, #7db8c9, #28618d 48%, #17304e 85%)",
      },
    },
    {
      name: "Mars",
      size: "h-4 w-4",
      style: {
        background:
          "radial-gradient(circle at 30% 30%, #e5a17e, #a84f35 65%, #57251f)",
      },
    },
    {
      name: "Jupiter",
      size: "h-8 w-8",
      style: {
        background:
          "repeating-linear-gradient(0deg, #a77b5d 0px, #d9b99a 3px, #8f624b 6px, #e0c5a5 9px)",
      },
    },
    {
      name: "Saturnus",
      size: "h-6 w-6",
      style: {
        background:
          "radial-gradient(circle at 30% 30%, #e9d3a3, #b89b6c 65%, #756044)",
      },
    },
    {
      name: "Uranus",
      size: "h-5 w-5",
      style: {
        background:
          "radial-gradient(circle at 30% 30%, #d4e8e6, #91bfc1 65%, #527d83)",
      },
    },
    {
      name: "Neptunus",
      size: "h-6 w-6",
      style: {
        background:
          "radial-gradient(circle at 30% 30%, #779acb, #31558e 65%, #172d53)",
      },
    },
  ];

  return (
    <section
      id="about"
      className="relative scroll-mt-20 overflow-hidden bg-[#09090b] py-24"
    >
      {/* ANIMASI BINTANG */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 12 }).map((_, index) => (
          <span
            key={index}
            className="absolute h-[3px] w-[3px] animate-pulse rounded-full bg-white shadow-[0_0_8px_#8ECAE6]"
            style={{
              top: `${(index * 37 + 12) % 95}%`,
              left: `${(index * 53 + 8) % 95}%`,
              animationDelay: `${index * 0.25}s`,
              opacity: 0.7,
            }}
          />
        ))}
      </div>

      <Container className="relative z-10">
        <div className="w-full">
          {/* JUDUL DAN GARIS PEMISAH */}
          <div className="flex items-center gap-6">
            <h2 className="shrink-0 font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Tentang
            </h2>

            <div className="h-px flex-1 bg-white/15" />
          </div>

          {/* PENJELASAN ANIMASI KETIK */}
          <p
            aria-label={description}
            className="mt-8 min-h-[160px] max-w-4xl font-serif text-base leading-8 text-slate-400"
          >
            {displayText}
            <span className="ml-1 inline-block h-4 w-[2px] translate-y-[2px] animate-pulse bg-[#8ECAE6]" />
          </p>

          {/* ILUSTRASI DELAPAN PLANET */}
          <div className="mt-10 flex flex-wrap items-center gap-7">
            {planets.map((planet) => (
              <div
                key={planet.name}
                title={planet.name}
                className="group flex flex-col items-center gap-3"
              >
                <div className="relative flex h-10 w-10 items-center justify-center transition duration-300 group-hover:-translate-y-2 group-hover:scale-125">
                  <span
                    className={`${planet.size} relative rounded-full shadow-[inset_-3px_-3px_6px_rgba(0,0,0,0.5),0_0_12px_rgba(255,255,255,0.08)]`}
                    style={planet.style}
                  />

                  {planet.name === "Saturnus" && (
                    <span className="absolute h-3 w-10 rotate-[-25deg] rounded-[50%] border-2 border-[#c9b18a]/80" />
                  )}
                </div>

                <span className="text-[10px] text-slate-500 transition group-hover:text-[#8ECAE6]">
                  {planet.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
