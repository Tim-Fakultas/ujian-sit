import { getJadwalUjianByProdiByDosen } from "@/actions/jadwalUjian";
import { Ujian } from "@/types/Ujian";
import { Suspense } from "react";
import { getCurrentUserAction } from "@/actions/auth";
import Loading from "./loading";
import PageHeader from "@/components/common/PageHeader";
import { FileText } from "lucide-react";
import PenilaianUjianTable from "@/app/(routes)/dosen/penilaian-ujian/PenilaianUjianTable";

export default async function PenilaianUjianPage() {
  const { user } = await getCurrentUserAction();
  const jadwalUjian: Ujian[] = await getJadwalUjianByProdiByDosen({
    prodiId: user?.prodi?.id,
    dosenId: user?.id,
  });

  return (
    <div className="p-6">
      <PageHeader 
        title="Penilaian Ujian" 
        description="Disini anda dapat melakukan penilaian ujian mahasiswa."
        icon={FileText}
        variant="emerald"
        className="mb-6"
      />
      <Suspense fallback={<Loading />}>
        <PenilaianUjianTable jadwalUjian={jadwalUjian} currentDosenId={user?.id} />
      </Suspense>
    </div>
  );
}
