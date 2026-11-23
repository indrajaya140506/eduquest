import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardContainer from "@/components/layouts/dashboard/DashboardContainer";
import Diagnostik from "@/components/games/misi-01/Diagnostik";

async function DiagnostikContent() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: aktivitas, error: aktivitasError } = await supabase
    .from("aktivitas_belajar")
    .select("id, nama, slug")
    .eq("slug", "diagnostik")
    .single();

  if (aktivitasError || !aktivitas) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700">
        Aktivitas Diagnostik tidak ditemukan.
      </div>
    );
  }

  const { data: questions, error: questionsError } = await supabase
    .from("bank_soal")
    .select(
      `
      id,
      materi_id,
      pertanyaan,
      materi (judul, urutan),
      pilihan_jawaban (id, label, teks_jawaban)
    `,
    )
    .eq("aktivitas_id", aktivitas.id)
    .eq("aktif", true)
    .order("id", { ascending: true });

  if (questionsError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        Gagal memuat soal Diagnostik.
      </div>
    );
  }

  if (!questions?.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
        Soal Diagnostik belum tersedia.
      </div>
    );
  }

  return <Diagnostik questions={questions as any} aktivitasId={aktivitas.id} />;
}

export default function DiagnostikPage() {
  return (
    <DashboardContainer>
      <Suspense
        fallback={
          <div className="mx-auto max-w-6xl animate-pulse space-y-4">
            <div className="h-10 w-1/3 rounded-xl bg-slate-200" />
            <div className="h-28 rounded-2xl bg-slate-200" />
            <div className="h-64 rounded-2xl bg-slate-200" />
          </div>
        }
      >
        <DiagnostikContent />
      </Suspense>
    </DashboardContainer>
  );
}
