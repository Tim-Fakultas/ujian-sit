import { getHadirUjian } from "@/actions/daftarHadirUjian";
import { getJadwalUjianByMahasiswaId, getJadwalUjianByProdi } from "@/actions/jadwalUjian";
import { getCurrentUserAction } from "@/actions/auth";
import PageHeader from "@/components/common/PageHeader";
import { FileText } from "lucide-react";
import JadwalUjianTable from "@/components/jadwalUjianTable";

export default async function JadwalUjianPage() {
  const { user } = await getCurrentUserAction();
  const jadwalUjian = await getJadwalUjianByMahasiswaId(user?.id || 0);

  const daftarHadir = await getHadirUjian();

  return (
    <div className="p-6">
      <PageHeader
        title="Jadwal Ujian"
        description="Lihat jadwal ujian di sini."
        icon={FileText}
        variant="emerald"
        className="mb-6"
      />
      <JadwalUjianTable
        jadwalUjian={jadwalUjian}
        daftarHadir={daftarHadir}
      />
    </div>
  );
}
