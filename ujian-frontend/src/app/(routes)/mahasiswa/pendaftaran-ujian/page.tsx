import { getJenisUjian } from "@/actions/jenisUjian";
import {
  getLoggedInUser,
  getPendaftaranUjianByMahasiswaId,
} from "@/actions/pendaftaranUjian";
import { getPengajuanRanpelByMahasiswaIdByStatus } from "@/actions/pengajuanRanpel";
import PendaftaranTable from "@/components/mahasiswa/pengajuan-ujian/PendaftaranTable";
import { MahasiswaUser } from "@/types/Auth";
import { PendaftaranUjianResponse } from "@/types/PendaftaranUjian";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { GraduationCap } from "lucide-react";

export default async function DaftarUjianPage() {
  const loggedInUser: MahasiswaUser = await getLoggedInUser();

  const pendaftaranUjian: PendaftaranUjianResponse = {
    data: await getPendaftaranUjianByMahasiswaId(loggedInUser.id),
  };

  const jenisUjianList = await getJenisUjian();

  const pengajuanRanpel: PengajuanRanpel[] =
    await getPengajuanRanpelByMahasiswaIdByStatus(loggedInUser.id);

  console.log("Pengajuan Ranpel:", pengajuanRanpel);
  return (
    <div className="p-6 space-y-8">
      {/* HEADER SECTION */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-blue-600" />
          Daftar Ujian
        </h1>
      </div>

      <PendaftaranTable
        pendaftaranUjian={pendaftaranUjian}
        loggedInUser={loggedInUser}
        jenisUjianList={jenisUjianList.data}
        pengajuanRanpel={pengajuanRanpel}
      />
    </div>
  );
}
