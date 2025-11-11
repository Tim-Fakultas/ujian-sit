import { getHadirUjian } from "@/actions/daftarHadirUjian";
import { getJadwalUjianByProdi } from "@/actions/jadwalUjian";
import { getCurrentUserAction } from "@/actions/auth";
import JadwalUjianTable from "@/components/mahasiswa/jadwal-ujian/JadwalUjianTable";

export default async function JadwalUjianPage() {
  const { user } = await getCurrentUserAction();
  const jadwalUjian = await getJadwalUjianByProdi(user?.prodi?.id || 0);

  const daftarHadir = await getHadirUjian();

  return (
    <div className="p-6">
      <JadwalUjianTable
        jadwalUjian={jadwalUjian}
        daftarHadir={daftarHadir}
        userId={user?.id}
      />
    </div>
  );
}
