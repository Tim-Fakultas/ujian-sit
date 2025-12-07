import { getJenisUjian } from "@/actions/data-master/jenisUjian";
import { getPendaftaranUjianByMahasiswaId } from "@/actions/pendaftaranUjian";
import { getPengajuanRanpelByMahasiswaIdByStatus } from "@/actions/pengajuanRanpel";
import PendaftaranTable from "@/components/mahasiswa/pengajuan-ujian/PendaftaranTable";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { Suspense } from "react";
import Loading from "./loading";
import { getCurrentUserAction } from "@/actions/auth";
import { getJadwalUjianByMahasiswaIdByHasil } from "@/actions/ujian";
import { Ujian } from "@/types/Ujian";
import { PendaftaranUjian } from "@/types/PendaftaranUjian";
import { JenisUjian } from "@/types/JenisUjian";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";

export default async function DaftarUjianPage() {
  const { user } = await getCurrentUserAction();
  const pendaftaranUjian: PendaftaranUjian[] =
    await getPendaftaranUjianByMahasiswaId(user?.id || 0);

  const _jenisUjianResult = await getJenisUjian();
  const jenisUjianList: JenisUjian[] = Array.isArray(_jenisUjianResult)
    ? _jenisUjianResult
    : _jenisUjianResult && "data" in _jenisUjianResult
    ? (_jenisUjianResult as { data: JenisUjian[] }).data
    : [];

  const pengajuanRanpel: PengajuanRanpel[] =
    await getPengajuanRanpelByMahasiswaIdByStatus(user?.id);

  const ujian: Ujian[] = await getJadwalUjianByMahasiswaIdByHasil(
    user?.id || 0
  );

  return (
    <div className="p-6 space-y-8">
      <Card className="mb-6 dark:bg-neutral-900 bg-white">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Daftar Ujian
            </div>
          </CardTitle>
          <CardDescription>
            Lihat dan kelola pendaftaran ujian Anda di sini.
          </CardDescription>
        </CardHeader>
      </Card>
      <Suspense fallback={<Loading />}>
        <PendaftaranTable
          pendaftaranUjian={pendaftaranUjian}
          user={user}
          jenisUjianList={jenisUjianList}
          pengajuanRanpel={pengajuanRanpel}
          ujian={ujian}
        />
      </Suspense>
    </div>
  );
}
