"use client";

import dynamic from "next/dynamic";

const PlanetGallery3D = dynamic(
  () => import("@/components/layouts/dashboard/PlanetGallery3D"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[480px] items-center justify-center rounded-2xl bg-[#050B19] text-sm text-white">
        Memuat Tata Surya...
      </div>
    ),
  },
);

export default function PlanetGalleryLoader() {
  return <PlanetGallery3D />;
}
