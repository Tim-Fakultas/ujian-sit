import { getBeritaUjianByLulus } from "@/actions/beritaUjian";
import { getCurrentUserAction } from "@/actions/auth";
import RekapitulasiNilaiTable from "@/components/sekprodi/rekapitulasi-nilai/rekapitulasiNilaiTable";
import { Suspense } from "react";
import Loading from "./loading";
import Header from "@/components/Header";

export default async function RekapitulasiNilaiPage() {
  const { user } = await getCurrentUserAction();
  const ujian = await getBeritaUjianByLulus(user?.prodi?.id);
  return (
    <div className="p-6">
      <Header
        title="Rekapitulasi Nilai"
        desc="Daftar Rekapitulasi Nilai Mahasiswa"
      />
      <Suspense fallback={<Loading />}>
        <RekapitulasiNilaiTable ujian={ujian} />
      </Suspense>
    </div>
  );
}
