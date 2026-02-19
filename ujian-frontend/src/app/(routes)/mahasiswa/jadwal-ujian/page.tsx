import { getHadirUjian } from "@/actions/daftarHadirUjian";
import {
  getJadwalUjianByMahasiswaId,
} from "@/actions/jadwalUjian";
import { getCurrentUserAction } from "@/actions/auth";
import PageHeader from "@/components/common/PageHeader";
import JadwalUjianTable from "@/components/JadwalUjianTable";

export default async function JadwalUjianPage() {
  const { user } = await getCurrentUserAction();
  const jadwalUjian = await getJadwalUjianByMahasiswaId(user?.id || 0);

  const daftarHadir = await getHadirUjian();

  return (
    <div className="p-6">
      <PageHeader
        title="Jadwal Ujian"
        description="Lihat jadwal ujian di sini."
        iconName="FileText"
        variant="blue"
        className="mb-6"
      />
      <JadwalUjianTable
        jadwalUjian={jadwalUjian}
        daftarHadir={daftarHadir}
        userRole={user?.role}
      />
    </div>
  );
}
