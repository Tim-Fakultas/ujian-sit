import { getJadwalUjianByMahasiswaId } from "@/actions/jadwalUjian";
import { getLoggedInUser } from "@/actions/pendaftaranUjian";
import JadwalUjianTable from "@/components/mahasiswa/jadwal-ujian/JadwalUjianTable";
import { Dosen } from "@/types/Dosen";

export default async function JadwalUjianPage() {
  const loggedInUser: Dosen = await getLoggedInUser();
  const jadwalUjian = await getJadwalUjianByMahasiswaId(loggedInUser.id);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Jadwal Ujian</h1>
      <JadwalUjianTable jadwalUjian={jadwalUjian} />
    </div>
  );
}
