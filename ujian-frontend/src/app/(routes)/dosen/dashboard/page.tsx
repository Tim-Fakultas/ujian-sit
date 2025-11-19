import { getCurrentUserAction } from "@/actions/auth";
import { getJadwalUjianByProdiByDosen } from "@/actions/jadwalUjian";
import { getPengajuanRanpelByDosenPA } from "@/actions/pengajuanRanpel";
import { Card, CardContent } from "@/components/ui/card";
// tambahkan ikon untuk visual
import {
  Calendar,
  FileText,
  XCircle,
  Hourglass,
  CheckCircle,
} from "lucide-react";

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
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ringkasan pengajuan dan jadwal ujian Anda
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <div className="text-sm text-muted-foreground">Total Pengajuan</div>
          <div className="text-lg font-semibold text-blue-600">
            {pengajuanRanpel?.length ?? 0}
          </div>
        </div>
      </div>

      {/* Pengajuan Rancangan */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Pengajuan Rancangan
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="min-h-[88px] rounded-xl p-4 flex flex-col justify-between shadow-sm bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border border-blue-500/10">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">Diajukan</div>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                  {pengajuanRanpel?.length ?? 0}
                </div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </CardContent>
          </Card>

          <Card className="min-h-[88px] rounded-xl p-4 flex flex-col justify-between shadow-sm bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border border-blue-500/10">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">Ditolak</div>
                <XCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                  {ditolak}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="min-h-[88px] rounded-xl p-4 flex flex-col justify-between shadow-sm bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border border-blue-500/10">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">Menunggu</div>
                <Hourglass className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                  {menunggu}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="min-h-[88px] rounded-xl p-4 flex flex-col justify-between shadow-sm bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border border-blue-500/10">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Diverifikasi
                </div>
                <CheckCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                  {diverifikasi}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="min-h-[88px] rounded-xl p-4 flex flex-col justify-between shadow-sm bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border border-blue-500/10">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">Diterima</div>
                <CheckCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                  {diterima}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Jadwal Ujian */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Jadwal Ujian
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="min-h-[88px] rounded-xl p-4 flex flex-col justify-between shadow-sm bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border border-blue-500/10">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Jadwal Ujian
                </div>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                  {jadwalUjian?.length ?? 0}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="min-h-[88px] rounded-xl p-4 flex flex-col justify-between shadow-sm bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border border-blue-500/10">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">Selesai</div>
                <CheckCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                  {selesai}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
