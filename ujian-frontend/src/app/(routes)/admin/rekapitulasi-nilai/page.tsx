import { getBeritaUjianByLulus } from "@/actions/beritaUjian";
import { getCurrentUserAction } from "@/actions/auth";
import RekapitulasiNilaiTable from "@/components/sekprodi/rekapitulasi-nilai/rekapitulasiNilaiTable";
import { Suspense } from "react";
import Header from "@/components/Header";

export default async function RekapitulasiNilaiPage() {
  const { user } = await getCurrentUserAction();
  const ujian = await getBeritaUjianByLulus(user?.prodi?.id);
  return (
    <div className="p-6">
      <Header
        title="Rekapitulasi Nilai"
        desc="Lihat rekapitulasi nilai ujian di sini."
      />
      <Suspense fallback={<div>Loading...</div>}>
        <RekapitulasiNilaiTable ujian={ujian} />
      </Suspense>
    </div>
  );
}
