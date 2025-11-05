import RekapitulasiNilaiTable from "@/components/sekprodi/rekapitulasi-nilai/rekapitulasiNilailTable";

export default async function RekapitulasiNilaiPage() {
  return (
    <div className="p-6 max-w-full ">
      <h1 className="text-2xl font-bold mb-2 text-primary">
        Rekapitulasi Nilai
      </h1>
      <p className="mb-8 text-gray-600">
        Halaman rekapitulasi nilai akan segera hadir.
      </p>
      <div className="rounded-lg bg-white shadow p-8 flex items-center justify-center min-h-[220px]">
        <RekapitulasiNilaiTable />
      </div>
    </div>
  );
}
