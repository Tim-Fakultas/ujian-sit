import { getPenjadwalanUjianByProdi } from "@/actions/jadwalUjian";
import { Ujian } from "@/types/Ujian";
import { Suspense } from "react";
import { getCurrentUserAction } from "@/actions/auth";
import { getHadirUjian } from "@/actions/daftarHadirUjian";
import Loading from "./loading";
import PageHeader from "@/components/common/PageHeader";
import { FileText } from "lucide-react";
import { getDosen } from "@/actions/data-master/dosen";
import { getRuangan } from "@/actions/data-master/ruangan"; // Import getRuangan
import PenjadwalkanUjianTable from "@/components/sekprodi/penjadwalan-ujian/PenjadwalkanUjianTable";

export default async function JadwalUjianPage() {
  const { user } = await getCurrentUserAction();
  const jadwalUjian: Ujian[] =
    user?.prodi?.id !== undefined
      ? await getPenjadwalanUjianByProdi(user.prodi.id)
      : [];
  const ruanganList = await getRuangan();
  const daftarHadir = await getHadirUjian();
  const dosen = await getDosen(user?.prodi?.id);

  return (
    <div className="p-6">
      <PageHeader
        title="Penjadwalan Ujian"
        description="Kelola jadwal ujian di sini."
        iconName="FileText"
        variant="emerald"
        className="mb-6"
      />
      <Suspense fallback={<Loading />}>
        <PenjadwalkanUjianTable
          jadwalUjian={jadwalUjian}
          daftarHadir={daftarHadir}
          dosen={dosen}
          ruanganList={ruanganList}
        />
      </Suspense>
    </div>
  );
}
