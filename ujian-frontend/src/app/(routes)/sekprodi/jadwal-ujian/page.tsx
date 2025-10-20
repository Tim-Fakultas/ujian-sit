import { getJadwalaUjianByProdi } from "@/actions/jadwalUjian";
import { getLoggedInUser } from "@/actions/pendaftaranUjian";
import JadwalUjianTable from "@/components/sekprodi/pendaftaran-ujian/jadwalUjianTable";
import { Ujian } from "@/types/Ujian";

export default async function JadwalUjianPage() {
  const loggedInUser = await getLoggedInUser();
  const jadwalUjian: Ujian[] = await getJadwalaUjianByProdi(
    loggedInUser?.prodi.id
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Jadwal Ujian</h1>
      <JadwalUjianTable jadwalUjian={jadwalUjian} />
    </div>
  );
}
