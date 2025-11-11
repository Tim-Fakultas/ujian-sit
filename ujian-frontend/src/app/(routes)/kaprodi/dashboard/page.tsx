import { getCurrentUserAction } from "@/actions/auth";
import { getPengajuanRanpelByProdi } from "@/actions/pengajuanRanpel";

export default async function KaprodiDashboard() {
  const { user } = await getCurrentUserAction();
  const pengajuanRanpel = await getPengajuanRanpelByProdi(user?.prodi?.id);

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
    <div className="w-full p-6 flex min-h-[60vh] flex-col gap-6">
      <div className="max-w-full">
        <div className="font-semibold text-gray-700 mb-2 text-sm">
          Pengajuan Rancangan
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="min-w-[120px] flex-1 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex flex-col items-start justify-center shadow-sm">
            <span className="text-xs text-gray-500 mb-1">Menunggu</span>
            <span className="text-2xl font-bold text-yellow-700">
              {menunggu}
            </span>
          </div>
          <div className="min-w-[120px] flex-1 bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col items-start justify-center shadow-sm">
            <span className="text-xs text-gray-500 mb-1">Diverifikasi</span>
            <span className="text-2xl font-bold text-blue-700">
              {diverifikasi}
            </span>
          </div>
          <div className="min-w-[120px] flex-1 bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col items-start justify-center shadow-sm">
            <span className="text-xs text-gray-500 mb-1">Diterima</span>
            <span className="text-2xl font-bold text-blue-700">{diterima}</span>
          </div>
          <div className="min-w-[120px] flex-1 bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col items-start justify-center shadow-sm">
            <span className="text-xs text-gray-500 mb-1">Ditolak</span>
            <span className="text-2xl font-bold text-red-700">{ditolak}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
