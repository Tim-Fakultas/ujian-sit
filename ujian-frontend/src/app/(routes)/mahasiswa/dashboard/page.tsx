import { getCurrentUserAction } from "@/actions/auth";
import { getPengajuanRanpelByMahasiswaId } from "@/actions/pengajuanRanpel";
import { Card, CardContent } from "@/components/ui/card";

export default async function DashboardMahasiswa() {
  const { user } = await getCurrentUserAction();
  const pengajuanRanpel = await getPengajuanRanpelByMahasiswaId(user?.id);

  const menunggu =
    pengajuanRanpel?.filter((p) => p.status?.toLowerCase() === "menunggu")
      .length ?? 0;
  const diverifikasi =
    pengajuanRanpel?.filter((p) => p.status?.toLowerCase() === "diverifikasi")
      .length ?? 0;
  const diterima =
    pengajuanRanpel?.filter((p) => p.status?.toLowerCase() === "diterima")
      .length ?? 0;
  const ditolak =
    pengajuanRanpel?.filter((p) => p.status?.toLowerCase() === "ditolak")
      .length ?? 0;

  return (
    <div className="p-6">
      <div className="max-w-full">
        <div className="font-semibold  mb-2 text-sm">Pengajuan Rancangan</div>
        <div className="flex flex-wrap gap-4">
          <Card className="min-w-[120px] flex-1 rounded-xl p-4 shadow-sm">
            <CardContent className="flex flex-col items-start justify-center p-0">
              <span className="text-xs mb-1 ">Menunggu</span>
              <span className="text-2xl font-bold">{menunggu}</span>
            </CardContent>
          </Card>

          <Card className="min-w-[120px] flex-1  rounded-xl p-4 shadow-sm">
            <CardContent className="flex flex-col items-start justify-center p-0">
              <span className="text-xs  mb-1">Diverifikasi</span>
              <span className="text-2xl font-bold ">{diverifikasi}</span>
            </CardContent>
          </Card>

          <Card className="min-w-[120px] flex-1  rounded-xl p-4 shadow-sm">
            <CardContent className="flex flex-col items-start justify-center p-0">
              <span className="text-xs  mb-1">Diterima</span>
              <span className="text-2xl font-bold ">{diterima}</span>
            </CardContent>
          </Card>

          <Card className="min-w-[120px] flex-1  rounded-xl p-4 shadow-sm">
            <CardContent className="flex flex-col items-start justify-center p-0">
              <span className="text-xs  mb-1">Ditolak</span>
              <span className="text-2xl font-bold ">{ditolak}</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
