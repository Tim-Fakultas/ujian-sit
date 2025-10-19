import {
  getLoggedInUser,
  getPendaftaranUjianByProdi,
} from "@/actions/pendaftaranUjian";
import PendaftaranUjianTable from "@/components/admin/PendaftaranUjianTable";
import { MahasiswaUser } from "@/types/Auth";
import { PendaftaranUjian } from "@/types/PendaftaranUjian";

export default async function PendaftaranUjianPage() {
  const loggedInUser: MahasiswaUser = await getLoggedInUser();
  const pendaftaranUjian: PendaftaranUjian[] = await getPendaftaranUjianByProdi(
    loggedInUser?.prodi.id
  );
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pendaftaran Ujian</h1>
      <PendaftaranUjianTable
        pendaftaranUjian={pendaftaranUjian}
        loggedInUser={loggedInUser}
      />
    </div>
  );
}
