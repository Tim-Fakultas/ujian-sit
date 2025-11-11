import {
  getTotalBeritaUjian,
  getTotalJadwalUjian,
  getTotalPendaftaranUjianMenunggu,
} from "@/actions/dashboard";
import { getCurrentUserAction } from "@/actions/auth";

export default async function DashboardSekprodiPage() {
  const { user } = await getCurrentUserAction();
  const prodiId = user?.prodi?.id;

  const totalJadwalUjian = await getTotalJadwalUjian(prodiId);
  const totalPendaftaranMenunggu = await getTotalPendaftaranUjianMenunggu(
    prodiId
  );
  const totalBeritaUjian = await getTotalBeritaUjian(prodiId);

  return (
    <div className="p-6  flex flex-col min-h-[60vh]">
      <div className="max-w-full">
        <div className="font-semibold text-gray-700 mb-2 text-sm">
          Statistik Sekprodi
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 min-w-[160px] max-w-[220px] flex flex-col items-start justify-center shadow-sm">
            <span className="text-xs text-gray-500 mb-1">
              Total Jadwal Ujian
            </span>
            <span className="text-2xl font-bold text-yellow-700">
              {totalJadwalUjian}
            </span>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 min-w-[160px] max-w-[220px] flex flex-col items-start justify-center shadow-sm">
            <span className="text-xs text-gray-500 mb-1">
              Pendaftaran Ujian Menunggu
            </span>
            <span className="text-2xl font-bold text-blue-700">
              {totalPendaftaranMenunggu}
            </span>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 min-w-[160px] max-w-[220px] flex flex-col items-start justify-center shadow-sm">
            <span className="text-xs text-gray-500 mb-1">Berita Ujian</span>
            <span className="text-2xl font-bold text-green-700">
              {totalBeritaUjian}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
