import { getDosen } from "@/actions/dosen";
import {
  getLoggedInUser,
  getPendaftaranUjianDiterimaByProdi,
} from "@/actions/pendaftaranUjian";
import PendaftaranUjianTable from "@/components/sekprodi/pendaftaran-ujian/PendaftaranTable";
import { DosenResponse } from "@/types/Dosen";
import { PendaftaranUjian } from "@/types/PendaftaranUjian";

export default async function PendaftaranUjianPage() {
  const loggedInUser = await getLoggedInUser();
  const pendaftaranUjian: PendaftaranUjian[] =
    await getPendaftaranUjianDiterimaByProdi(loggedInUser?.prodi.id);

  const dosen: DosenResponse = await getDosen(loggedInUser?.prodi.id);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar ujian</h1>
      <PendaftaranUjianTable
        pendaftaranUjian={pendaftaranUjian}
        dosen={dosen}
      />
    </div>
  );
}
