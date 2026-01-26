import { getCurrentUserAction } from "@/actions/auth";
import RekapitulasiNilaiTable from "@/components/sekprodi/rekapitulasi-nilai/rekapitulasiNilaiTable";
import { Suspense } from "react";
import Loading from "./loading";
import PageHeader from "@/components/common/PageHeader";
import { FileText } from "lucide-react";
import { getRekapitulasiNilaiUjian } from "@/actions/beritaUjian";

export default async function RekapitulasiNilaiPage() {
  const { user } = await getCurrentUserAction();
  const ujian = await getRekapitulasiNilaiUjian(user?.prodi?.id);
  return (
    <div className="p-6">
      <PageHeader
        title="Rekapitulasi Nilai"
        description="Daftar Rekapitulasi Nilai Mahasiswa"
        iconName="FileText"
        variant="emerald"
        className="mb-6"
      />
      <Suspense fallback={<Loading />}>
        <RekapitulasiNilaiTable ujian={ujian} user={user ?? undefined} />
      </Suspense>
    </div>
  );
}
