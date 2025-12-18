import { getJadwalUjianByProdiByDosen } from "@/actions/jadwalUjian";
import JadwalUjianTable from "@/app/(routes)/dosen/jadwal-ujian/JadwalUjianTable";
import { Ujian } from "@/types/Ujian";
import { Suspense } from "react";
import { getCurrentUserAction } from "@/actions/auth";
import Loading from "./loading";
import PageHeader from "@/components/common/PageHeader";
import { FileText } from "lucide-react";

export default async function JadwalUjianPage() {
  const { user } = await getCurrentUserAction();
  const jadwalUjian: Ujian[] = await getJadwalUjianByProdiByDosen({
    prodiId: user?.prodi?.id,
    dosenId: user?.id,
  });

  return (
    <div className="p-6">
      <PageHeader 
        title="Jadwal Ujian Mahasiswa" 
        description="Disini anda dapat melihat jadwal ujian dan melakukan penilaian."
        icon={FileText}
        variant="emerald"
        className="mb-6"
      />
      <Suspense fallback={<Loading />}>
        <JadwalUjianTable jadwalUjian={jadwalUjian} currentDosenId={user?.id} />
      </Suspense>
    </div>
  );
}
