import { getJadwalUjianByProdiByDosen } from "@/actions/jadwalUjian";
import { getLoggedInUser } from "@/actions/pendaftaranUjian";
import JadwalUjianTable from "@/components/dosen/JadwalUjianTable";
import { Dosen } from "@/types/Dosen";
import { Ujian } from "@/types/Ujian";

export default async function JadwalUjianPage() {
  const loggedInUser: Dosen = await getLoggedInUser();
  const jadwalUjian: Ujian[] = await getJadwalUjianByProdiByDosen({
    prodiId: loggedInUser.prodi.id,
    dosenId: loggedInUser.id,
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Jadwal Ujian</h1>
      <JadwalUjianTable
        jadwalUjian={jadwalUjian}
        currentDosenId={loggedInUser.id}
      />
    </div>
  );
}
