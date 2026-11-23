import DashboardContainer from "@/components/layouts/dashboard/DashboardContainer";

const objectives = [
  "Memahami sejarah dan teori terbentuknya Tata Surya.",
  "Mengenal Matahari sebagai pusat Tata Surya.",
  "Mengidentifikasi anggota Tata Surya, termasuk planet, satelit, asteroid, dan komet.",
  "Mengetahui urutan serta karakteristik delapan planet.",
  "Memahami perbedaan planet dalam dan planet luar.",
  "Mempelajari rotasi dan revolusi serta pengaruhnya terhadap kehidupan.",
  "Mempelajari peran bumi dan kehidupan.",
  "Memahami peran Tata Surya dalam kehidupan di Bumi.",
];

export default function TujuanPembelajaranPage() {
  return (
    <DashboardContainer>
      <div className="space-y-6 pb-8">
        {/* HEADER */}
        {/* HEADER */}
        <section className="mb-6 rounded-xl border border-[#101F38] bg-[#101F38] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-white">
            Tujuan Pembelajaran
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-white/75">
            Pelajari susunan Tata Surya, karakteristik planet, dan
            pergerakannya.
          </p>
        </section>

        {/* PLANET 3D & LEARNING OBJECTIVES */}
        <section className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          {/* LEFT - PLANET 3D */}
          <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 lg:min-h-[620px]">
            {/* HEADER */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-900">
                Mengenal Tata Surya
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Jelajahi objek Tata Surya melalui visualisasi tiga dimensi yang
                interaktif.
              </p>
            </div>

            {/* 3D OBJECT */}
            <div className="flex flex-1 items-center justify-center">
              <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-[#101F38]">
                <iframe
                  title="Model 3D Tata Surya"
                  src="https://sketchfab.com/models/e8df134d9a974fb99b14f75eab705117/embed?autostart=0&ui_theme=dark"
                  className="aspect-square w-full"
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  allowFullScreen
                />
              </div>
            </div>

            {/* FOOTER */}
            <p className="mt-5 text-center text-xs leading-5 text-slate-400">
              Putar model untuk mengamati susunan dan karakteristik planet dalam
              Tata Surya.
            </p>
          </div>

          {/* RIGHT - LEARNING OBJECTIVES */}
          <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 lg:min-h-[620px]">
            {/* HEADER */}
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                Apa yang Akan Kamu Pelajari?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Setelah mengikuti pembelajaran EduQuest, kamu diharapkan mampu:
              </p>
            </div>

            {/* OBJECTIVES LIST */}
            <div className="mt-6 flex flex-1 flex-col justify-between gap-3">
              {objectives.map((objective, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg border border-slate-100 p-3 transition-colors hover:bg-slate-50"
                >
                  {/* NUMBER */}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#101F38] text-xs font-semibold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* TEXT */}
                  <p className="text-sm leading-6 text-slate-600">
                    {objective}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </DashboardContainer>
  );
}
