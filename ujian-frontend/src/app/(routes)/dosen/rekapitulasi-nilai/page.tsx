import { getJadwalUjianByProdiByDosen } from "@/actions/jadwalUjian";
import { Ujian } from "@/types/Ujian";
import { Suspense } from "react";
import { getCurrentUserAction } from "@/actions/auth";
import Loading from "./loading";
import PageHeader from "@/components/common/PageHeader";
import { FileText } from "lucide-react";
import RekapitulasiNilaiTable from "@/components/dosen/rekapitulasi-nilai/RekapitulasiNilaiTable";

export default async function RekapitulasiNilaiPage() {
  const { user } = await getCurrentUserAction();
  // TODO: Create/Use specific action for rekapitulasi if needed, or reuse getJadwalUjian
  // Logic in original page:
  /*
    const jadwalUjian: Ujian[] = await getJadwalUjianByProdiByDosen({
    prodiId: user?.prodi?.id,
    dosenId: user?.id,
    });
  */

  const jadwalUjian: Ujian[] = await getJadwalUjianByProdiByDosen({
    prodiId: user?.prodi?.id,
    dosenId: user?.id,
  });

  return (
    <div className="p-6">
      <PageHeader
        title="Rekapitulasi Nilai"
        description="Rekapitulasi nilai ujian mahasiswa bimbingan/ujian anda."
        iconName="FileText"
        variant="amber"
        className="mb-6"
      />
      <Suspense fallback={<Loading />}>
        <RekapitulasiNilaiTable ujian={jadwalUjian} />
      </Suspense>
    </div>
  );
}
