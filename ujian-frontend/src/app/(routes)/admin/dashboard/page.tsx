import { getCurrentUserAction } from "@/actions/auth";

async function getTotalDosenByProdi(prodiId?: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/dosen?prodiId=${prodiId}`, {
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return data?.data?.length ?? 0;
}

async function getTotalMahasiswaByProdi(prodiId?: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${apiUrl}/mahasiswa?prodiId=${prodiId}`, {
    cache: "no-store",
  });
  if (!res.ok) return { aktif: 0 };
  const data = await res.json();
  return {
    aktif:
      data?.data?.filter((m: { status: string }) => m.status === "aktif")
        .length ?? 0,
  };
}

async function getTotalPendaftaranUjianByProdi(prodiId?: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${apiUrl}/pendaftaran-ujian?prodiId=${prodiId}`, {
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return data?.data?.length ?? 0;
}

async function getTotalJadwalUjianByProdi(prodiId?: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${apiUrl}/jadwal-ujian?prodiId=${prodiId}`, {
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return data?.data?.length ?? 0;
}

import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, ClipboardList, Calendar } from "lucide-react";

export default async function AdminDashboardPage() {
  const { user } = await getCurrentUserAction();
  const prodiId = user?.prodi?.id;

  const totalDosen = await getTotalDosenByProdi(prodiId);
  const totalMahasiswa = await getTotalMahasiswaByProdi(prodiId);
  const totalPendaftaranUjian = await getTotalPendaftaranUjianByProdi(prodiId);
  const totalJadwalUjian = await getTotalJadwalUjianByProdi(prodiId);

  return (
    <div className="p-6 flex flex-col min-h-[60vh]">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Statistik Prodi
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ringkasan jumlah dosen, mahasiswa, pendaftaran, dan jadwal ujian
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <div className="text-sm text-muted-foreground">Total Dosen</div>
          <div className="text-lg font-semibold text-blue-500">
            {totalDosen}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="min-h-[88px] rounded-xl p-4 flex flex-col justify-between shadow-sm bg-white/60 dark:bg-[#1f1f1f] backdrop-blur-sm border border-[#1f1f1f]/10">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Total Dosen</div>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-blue-500 dark:text-blue-500">
                {totalDosen}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="min-h-[88px] rounded-xl p-4 flex flex-col justify-between shadow-sm dark:bg-[#1f1f1f] backdrop-blur-sm border border-[#1f1f1f]/10">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Mahasiswa Aktif
              </div>
              <UserCheck className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-blue-500 dark:text-blue-500">
                {totalMahasiswa.aktif}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="min-h-[88px] rounded-xl p-4 flex flex-col justify-between shadow-sm bg-white/60 dark:bg-[#1f1f1f] backdrop-blur-sm border border-[#1f1f1f]/10">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Pendaftaran Ujian
              </div>
              <ClipboardList className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-blue-500 dark:text-blue-500">
                {totalPendaftaranUjian}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="min-h-[88px] rounded-xl p-4 flex flex-col justify-between shadow-sm bg-white/60 dark:bg-[#1f1f1f] backdrop-blur-sm border border-[#1f1f1f]/10">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Jadwal Ujian</div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-blue-500 dark:text-blue-500">
                {totalJadwalUjian}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
