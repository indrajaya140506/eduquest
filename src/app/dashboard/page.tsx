import DashboardContainer from "@/components/layouts/dashboard/DashboardContainer";

export default function DashboardPage() {
  return (
    <DashboardContainer>
      <section className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="font-serif text-3xl font-semibold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Selamat datang kembali di EduQuest!
        </p>
      </section>
    </DashboardContainer>
  );
}
