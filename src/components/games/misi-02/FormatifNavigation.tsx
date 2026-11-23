"use client";

import { useState } from "react";
import Formatif from "@/components/games/misi-02/Formatif";
import Riwayat from "@/components/games/misi-02/Riwayat";

interface FormatifNavigationProps {
  questions: any[];
  aktivitasId: number;
  xpMaksimal: number;
}

export default function FormatifNavigation({
  questions,
  aktivitasId,
  xpMaksimal,
}: FormatifNavigationProps) {
  const [halaman, setHalaman] = useState<"formatif" | "riwayat">("formatif");

  const [materiTerpilih, setMateriTerpilih] = useState<{
    id: number;
    nama: string;
  } | null>(null);

  const bukaRiwayat = (materiId: number, materiNama: string) => {
    setMateriTerpilih({
      id: materiId,
      nama: materiNama,
    });

    setHalaman("riwayat");
  };

  const kembaliKeFormatif = () => {
    setHalaman("formatif");
  };

  return (
    <>
      {halaman === "riwayat" && materiTerpilih ? (
        <Riwayat
          aktivitasId={aktivitasId}
          materiId={materiTerpilih.id}
          materiNama={materiTerpilih.nama}
          onBack={kembaliKeFormatif}
        />
      ) : (
        <Formatif
          questions={questions}
          aktivitasId={aktivitasId}
          xpMaksimal={xpMaksimal}
          onOpenHistory={bukaRiwayat}
        />
      )}
    </>
  );
}
