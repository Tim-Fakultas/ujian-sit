import { getCurrentUserAction } from "@/actions/auth";
import RekapitulasiNilaiTable from "./rekapitulasiNilaiTable";
import { Suspense } from "react";
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
        description="Lihat rekapitulasi nilai ujian di sini."
        iconName="FileText"
        variant="emerald"
        className="mb-6"
      />
      <Suspense fallback={<div>Loading...</div>}>
        <RekapitulasiNilaiTable ujian={ujian} />
      </Suspense>
    </div>
  );
}
