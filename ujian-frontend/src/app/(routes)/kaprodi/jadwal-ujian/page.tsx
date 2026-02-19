import { getKaprodiJadwalUjian } from "@/actions/kaprodi";
import { Ujian } from "@/types/Ujian";
import { Suspense } from "react";
import { getCurrentUserAction } from "@/actions/auth";
import { getHadirUjian } from "@/actions/daftarHadirUjian";
import Loading from "./loading";
import PageHeader from "@/components/common/PageHeader";
import { FileText } from "lucide-react";
import JadwalUjianTable from "@/components/JadwalUjianTable";

export default async function JadwalUjianPage() {
  const { user } = await getCurrentUserAction();
  const jadwalUjian: Ujian[] = await getKaprodiJadwalUjian();
  const daftarHadir = await getHadirUjian();

  return (
    <div className="p-6">
      <PageHeader
        title="Jadwal Ujian"
        description="Kelola jadwal ujian di sini."
        iconName="FileText"
        variant="emerald"
        className="mb-6"
      />
      <Suspense fallback={<Loading />}>
        <JadwalUjianTable
          jadwalUjian={jadwalUjian}
          daftarHadir={daftarHadir}
          userRole={user?.role}
        />
      </Suspense>
    </div>
  );
}
