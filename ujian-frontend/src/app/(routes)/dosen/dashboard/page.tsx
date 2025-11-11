import { getCurrentUserAction } from "@/actions/auth";
import { getJadwalUjianByProdiByDosen } from "@/actions/jadwalUjian";
import { getPengajuanRanpelByDosenPA } from "@/actions/pengajuanRanpel";

export default async function DashboardLayout() {
  const { user } = await getCurrentUserAction();
  const pengajuanRanpel = await getPengajuanRanpelByDosenPA(user?.id);
  const jadwalUjian = await getJadwalUjianByProdiByDosen({
    prodiId: user?.prodi?.id,
    dosenId: user?.id,
  });

  const selesai =
    jadwalUjian?.filter((j) => j.hasil?.toLowerCase() === "lulus").length ?? 0;
  const ditolak =
    pengajuanRanpel?.filter((p) => p.status?.toLowerCase() === "ditolak")
      .length ?? 0;
  const menunggu =
    pengajuanRanpel?.filter((p) => p.status?.toLowerCase() === "menunggu")
      .length ?? 0;
  const diverifikasi =
    pengajuanRanpel?.filter((p) => p.status?.toLowerCase() === "diverifikasi")
      .length ?? 0;
  const diterima =
    pengajuanRanpel?.filter((p) => p.status?.toLowerCase() === "diterima")
      .length ?? 0;

  return (
    <div className="p-6">
      {/* Pengajuan Rancangan */}
      <div className="mb-6">
        <div className="font-semibold text-gray-700 mb-2 text-sm">
          Pengajuan Rancangan
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="min-w-[140px] flex-1 bg-purple-50 border border-purple-200 rounded-xl p-4 flex flex-col items-start justify-center shadow-sm">
            <span className="text-xs text-gray-500 mb-1">Diajukan</span>
            <span className="text-2xl font-bold text-purple-700">
              {pengajuanRanpel?.length ?? 0}
            </span>
          </div>
          <div className="min-w-[140px] flex-1 bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col items-start justify-center shadow-sm">
            <span className="text-xs text-gray-500 mb-1">Ditolak</span>
            <span className="text-2xl font-bold text-blue-700">{ditolak}</span>
          </div>
          <div className="min-w-[140px] flex-1 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex flex-col items-start justify-center shadow-sm">
            <span className="text-xs text-gray-500 mb-1">Menunggu</span>
            <span className="text-2xl font-bold text-yellow-700">
              {menunggu}
            </span>
          </div>
          <div className="min-w-[140px] flex-1 bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col items-start justify-center shadow-sm">
            <span className="text-xs text-gray-500 mb-1">Diverifikasi</span>
            <span className="text-2xl font-bold text-blue-700">
              {diverifikasi}
            </span>
          </div>
          <div className="min-w-[140px] flex-1 bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col items-start justify-center shadow-sm">
            <span className="text-xs text-gray-500 mb-1">Diterima</span>
            <span className="text-2xl font-bold text-blue-700">{diterima}</span>
          </div>
        </div>
      </div>
      {/* Jadwal Ujian */}
      <div>
        <div className="font-semibold text-gray-700 mb-2 text-sm">
          Jadwal Ujian
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="min-w-[140px] flex-1 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex flex-col items-start justify-center shadow-sm">
            <span className="text-xs text-gray-500 mb-1">Jadwal Ujian</span>
            <span className="text-2xl font-bold text-yellow-700">
              {jadwalUjian?.length ?? 0}
            </span>
          </div>
          <div className="min-w-[140px] flex-1 bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col items-start justify-center shadow-sm">
            <span className="text-xs text-gray-500 mb-1">Selesai</span>
            <span className="text-2xl font-bold text-green-700">{selesai}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
