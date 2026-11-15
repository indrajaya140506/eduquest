import DashboardContainer from "@/components/layouts/dashboard/DashboardContainer";
import PlanetGalleryLoader from "@/components/layouts/dashboard/PlanetGalleryLoader";

const objectives = [
  "Memahami sejarah dan teori terbentuknya Tata Surya.",
  "Mengenal Matahari sebagai pusat Tata Surya.",
  "Mengidentifikasi anggota Tata Surya, termasuk planet, satelit, asteroid, dan komet.",
  "Mengetahui urutan serta karakteristik delapan planet.",
  "Memahami perbedaan planet dalam dan planet luar.",
  "Mempelajari rotasi dan revolusi serta pengaruhnya terhadap kehidupan.",
  "Mengenal fenomena alam seperti gerhana Matahari dan gerhana Bulan.",
  "Memahami peran Tata Surya dalam kehidupan di Bumi.",
];

export default function TujuanPembelajaranPage() {
  return (
    <DashboardContainer>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <section>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Tujuan Pembelajaran
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Pelajari susunan Tata Surya, karakteristik planet, dan
            pergerakannya.
          </p>
        </section>

        {/* Planet 3D Section */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
          <div className="mb-6 text-center">
            <h3 className="mt-2 text-xl font-semibold text-slate-900">
              Mengenal Planet
            </h3>
          </div>

          <PlanetGalleryLoader />

          <p className="mt-4 text-center text-xs text-slate-400">
            Urutan planet berdasarkan jaraknya dari Matahari
          </p>
        </section>

        {/* Learning Objectives */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
          <h3 className="mt-2 text-xl font-semibold text-slate-900">
            Apa yang Akan Kamu Pelajari?
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Setelah mengikuti pembelajaran EduQuest, kamu diharapkan mampu:
          </p>

          <div className="mt-6 space-y-4">
            {objectives.map((objective, index) => (
              <div
                key={index}
                className="flex items-start gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
              >
                <span className="text-sm font-semibold text-[#397B9A]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p className="text-sm leading-6 text-slate-600">{objective}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardContainer>
  );
}
