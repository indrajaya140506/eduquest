"use client";

import { useEffect, useState } from "react";
import Container from "@/components/layouts/container";

export default function Tentang() {
  const description =
    "EduQuest merupakan platform pembelajaran digital yang dirancang untuk membantu siswa sekolah dasar mengenal tata surya dengan cara yang menarik dan menyenangkan. Melalui materi interaktif, video edukatif, aktivitas pembelajaran, serta evaluasi, siswa dapat memahami berbagai objek di tata surya sekaligus mengembangkan pengetahuan mereka.";

  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      index++;

      setDisplayText(description.slice(0, index));

      if (index >= description.length) {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="bg-[#09090b] py-24">
      <Container>
        <div className="max-w-3xl">
          <h2 className="font-['Poppins',sans-serif] text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Tentang
          </h2>

          <p className="mt-7 min-h-[160px] text-base leading-8 text-slate-400">
            {displayText}
            <span className="ml-1 inline-block h-4 w-[2px] translate-y-[2px] animate-pulse bg-[#8ECAE6]" />
          </p>
        </div>
      </Container>
    </section>
  );
}
