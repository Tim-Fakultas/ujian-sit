import { getJenisUjian } from "@/actions/jenisUjian";
import { getPendaftaranUjianByMahasiswaId } from "@/actions/pendaftaranUjian";
import { getPengajuanRanpelByMahasiswaIdByStatus } from "@/actions/pengajuanRanpel";
import PendaftaranTable from "@/components/mahasiswa/pengajuan-ujian/PendaftaranTable";
import { PendaftaranUjianResponse } from "@/types/PendaftaranUjian";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { GraduationCap } from "lucide-react";
import { Suspense } from "react";
import Loading from "./loading";
import { getCurrentUserAction } from "@/actions/loginAction";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PengajuanUjianForm from "@/components/mahasiswa/pengajuan-ujian/PengajuanUjianForm";
import { DialogTitle } from "@radix-ui/react-dialog";

export default async function DaftarUjianPage() {
  const { user } = await getCurrentUserAction();
  const pendaftaranUjian: PendaftaranUjianResponse = {
    data: await getPendaftaranUjianByMahasiswaId(user?.id || 0),
  };

  const jenisUjianList = await getJenisUjian();

  const pengajuanRanpel: PengajuanRanpel[] =
    await getPengajuanRanpelByMahasiswaIdByStatus(user?.id);

  console.log("Pengajuan Ranpel:", pengajuanRanpel);
  return (
    <div className="p-6 space-y-8">
      {/* HEADER SECTION */}
      <div className="w-full flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            Daftar Ujian
          </h1>
          <p className="text-gray-600">
            Lihat semua pendaftaran ujian yang telah Anda ajukan
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-400 hover:bg-blue-500 text-white">
              <Plus className="mr-2" />
              Pengajuan Ujian
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogTitle className="text-lg font-medium mb-4">
              Form Pengajuan Ujian
            </DialogTitle>
            {user && (
              <PengajuanUjianForm
                user={user}
                jenisUjianList={jenisUjianList.data}
                pengajuanRanpel={pengajuanRanpel}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Suspense fallback={<Loading />}>
        <PendaftaranTable
          pendaftaranUjian={pendaftaranUjian}
          user={user}
          jenisUjianList={jenisUjianList.data}
          pengajuanRanpel={pengajuanRanpel}
        />
      </Suspense>
    </div>
  );
}
