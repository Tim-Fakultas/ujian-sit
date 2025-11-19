import {
  getTotalBeritaUjian,
  getTotalJadwalUjian,
  getTotalPendaftaranUjianMenunggu,
} from "@/actions/dashboard";
import { getCurrentUserAction } from "@/actions/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Hourglass, Newspaper } from "lucide-react";

export default async function DashboardSekprodiPage() {
  const { user } = await getCurrentUserAction();
  const prodiId = user?.prodi?.id;

  const totalJadwalUjian = await getTotalJadwalUjian(prodiId);
  const totalPendaftaranMenunggu = await getTotalPendaftaranUjianMenunggu(
    prodiId
  );
  const totalBeritaUjian = await getTotalBeritaUjian(prodiId);

  return (
    <div className="p-6 flex flex-col min-h-[60vh]">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Statistik Sekprodi
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ringkasan jadwal, pendaftaran menunggu, dan berita ujian
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Total Jadwal Ujian
          </div>
          <div className="text-lg font-semibold text-blue-600">
            {totalJadwalUjian}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="min-h-[88px] rounded-xl p-4 flex flex-col justify-between shadow-sm bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border border-blue-500/10">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Total Jadwal Ujian
              </div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                {totalJadwalUjian}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="min-h-[88px] rounded-xl p-4 flex flex-col justify-between shadow-sm bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border border-blue-500/10">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Pendaftaran Ujian Menunggu
              </div>
              <Hourglass className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                {totalPendaftaranMenunggu}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="min-h-[88px] rounded-xl p-4 flex flex-col justify-between shadow-sm bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border border-blue-500/10">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Berita Ujian</div>
              <Newspaper className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                {totalBeritaUjian}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
