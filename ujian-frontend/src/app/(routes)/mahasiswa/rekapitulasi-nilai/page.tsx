import {  getBeritaUjianByMahasiswa } from "@/actions/beritaUjian";
import { getCurrentUserAction } from "@/actions/auth";
import { Suspense } from "react";
import Loading from "./loading";
import PageHeader from "@/components/common/PageHeader";
import { FileText } from "lucide-react";
import RekapitulasiNilaiTable from "@/components/mahasiswa/rekapitulasi-nilai/RekapitulasiNilaiTable";

export default async function RekapitulasiNilaiPage() {
  const { user } = await getCurrentUserAction();
  const ujian = await getBeritaUjianByMahasiswa(user?.id);
  return (
    <div className="p-6">
      <PageHeader
        title="Rekapitulasi Nilai"
        description="Lihat berita acara ujian di sini."
        icon={FileText}
        variant="emerald"
        className="mb-6"
      />
      <Suspense fallback={<Loading />}>
        <RekapitulasiNilaiTable ujian={ujian} />
      </Suspense>
    </div>
  );
}
