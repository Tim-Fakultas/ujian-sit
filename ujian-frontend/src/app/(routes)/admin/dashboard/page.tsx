import { getCurrentUserAction } from "@/actions/auth";

// Dummy fetchers, replace with actual API calls if available
async function getTotalDosenByProdi(prodiId?: number) {
  const res = await fetch(
    `http://localhost:8000/api/dosen?prodiId=${prodiId}`,
    { cache: "no-store" }
  );
  if (!res.ok) return 0;
  const data = await res.json();
  return data?.data?.length ?? 0;
}
async function getTotalMahasiswaByProdi(prodiId?: number) {
  const res = await fetch(
    `http://localhost:8000/api/mahasiswa?prodiId=${prodiId}`,
    { cache: "no-store" }
  );
  if (!res.ok) return { aktif: 0 };
  const data = await res.json();
  return {
    aktif:
      data?.data?.filter((m: { status: string }) => m.status === "aktif")
        .length ?? 0,
  };
}
async function getTotalPendaftaranUjianByProdi(prodiId?: number) {
  const res = await fetch(
    `http://localhost:8000/api/pendaftaran-ujian?prodiId=${prodiId}`,
    { cache: "no-store" }
  );
  if (!res.ok) return 0;
  const data = await res.json();
  return data?.data?.length ?? 0;
}
async function getTotalJadwalUjianByProdi(prodiId?: number) {
  const res = await fetch(
    `http://localhost:8000/api/jadwal-ujian?prodiId=${prodiId}`,
    { cache: "no-store" }
  );
  if (!res.ok) return 0;
  const data = await res.json();
  return data?.data?.length ?? 0;
}

export default async function AdminDashboardPage() {
  const { user } = await getCurrentUserAction();
  const prodiId = user?.prodi?.id;

  const totalDosen = await getTotalDosenByProdi(prodiId);
  const totalMahasiswa = await getTotalMahasiswaByProdi(prodiId);
  const totalPendaftaranUjian = await getTotalPendaftaranUjianByProdi(prodiId);
  const totalJadwalUjian = await getTotalJadwalUjianByProdi(prodiId);

  return (
    <div className="p-6 flex flex-col min-h-[60vh]">
      <div className="max-w-full">
        <div className="font-semibold text-gray-700 mb-2 text-sm">
          Statistik Prodi
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 min-w-[180px] max-w-[260px] flex flex-col items-start justify-center shadow-sm">
            <span className="text-xs text-gray-500 mb-1">Total Dosen</span>
            <span className="text-2xl font-bold text-blue-700">
              {totalDosen}
            </span>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 min-w-[180px] max-w-[260px] flex flex-col items-start justify-center shadow-sm">
            <span className="text-xs text-gray-500 mb-1">Mahasiswa Aktif</span>
            <span className="text-2xl font-bold text-green-700">
              {totalMahasiswa.aktif}
            </span>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 min-w-[180px] max-w-[260px] flex flex-col items-start justify-center shadow-sm">
            <span className="text-xs text-gray-500 mb-1">
              Pendaftaran Ujian
            </span>
            <span className="text-2xl font-bold text-purple-700">
              {totalPendaftaranUjian}
            </span>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 min-w-[180px] max-w-[260px] flex flex-col items-start justify-center shadow-sm">
            <span className="text-xs text-gray-500 mb-1">Jadwal Ujian</span>
            <span className="text-2xl font-bold text-yellow-700">
              {totalJadwalUjian}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
