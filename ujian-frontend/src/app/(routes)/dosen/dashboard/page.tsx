import { getCurrentUserAction } from "@/actions/auth";
import { getJadwalUjianDosen } from "@/actions/jadwalUjian";
import { getPengajuanRanpelByDosenPA } from "@/actions/pengajuanRanpel";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DosenDashboardPage() {
  const { user } = await getCurrentUserAction();

  // Fetch Data
  const ranpelList = await getPengajuanRanpelByDosenPA(user?.id);
  const ranpelMenunggu = ranpelList.filter(
    (r) => r.status === "menunggu"
  ).length;

  const jadwalList = await getJadwalUjianDosen(user?.id || 0);
  const jadwalMenguji = jadwalList.length;

  // Helper to format date
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 min-h-screen bg-gray-50/50 dark:bg-neutral-900/20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Selamat Datang, {user?.nama?.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Dashboard Dosen - {user?.email || ""}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 rounded-full shadow-sm border border-gray-100 dark:border-neutral-700">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {today}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Bimbingan Menunggu */}
        <Card className="rounded-2xl border-none shadow-lg shadow-orange-500/10 bg-white dark:bg-neutral-800 relative overflow-hidden group hover:shadow-xl transition-shadow duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ClipboardCheck className="w-24 h-24 text-orange-500" />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Validasi Ranpel
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {ranpelMenunggu}
                </h3>
              </div>
            </div>
            <Link href="/dosen/pengajuan-ranpel">
              <Button
                variant="outline"
                className="w-full justify-between group/btn hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 border-dashed"
              >
                Lihat Pengajuan
                <ClipboardCheck className="w-4 h-4 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Card 2: Jadwal Menguji */}
        <Card className="rounded-2xl border-none shadow-lg shadow-blue-500/10 bg-white dark:bg-neutral-800 relative overflow-hidden group hover:shadow-xl transition-shadow duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar className="w-24 h-24 text-blue-500" />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Jadwal Menguji
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {jadwalMenguji}
                </h3>
              </div>
            </div>
            <Link href="/dosen/jadwal-ujian">
              <Button
                variant="outline"
                className="w-full justify-between group/btn hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 border-dashed"
              >
                Lihat Jadwal
                <LayoutDashboard className="w-4 h-4 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Card 3: Total Bimbingan */}
        <Card className="rounded-2xl border-none shadow-lg shadow-emerald-500/10 bg-white dark:bg-neutral-800 relative overflow-hidden group hover:shadow-xl transition-shadow duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-24 h-24 text-emerald-500" />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Bimbingan
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {ranpelList.length}
                </h3>
              </div>
            </div>
             {/* Using /dosen/pengajuan-ranpel as placeholder for 'List Bimbingan' */}
            <Link href="/dosen/pengajuan-ranpel">
              <Button
                variant="outline"
                className="w-full justify-between group/btn hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 border-dashed"
              >
                Lihat Bimbingan
                <FileText className="w-4 h-4 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-gray-500" />
          Akses Cepat
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dosen/pengajuan-ranpel" className="group">
            <Card className="h-full hover:border-blue-500/50 hover:shadow-md transition-all duration-300 cursor-pointer bg-white dark:bg-neutral-800">
              <CardContent className="p-5 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Validasi Ranpel
                </span>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dosen/jadwal-ujian" className="group">
            <Card className="h-full hover:border-violet-500/50 hover:shadow-md transition-all duration-300 cursor-pointer bg-white dark:bg-neutral-800">
              <CardContent className="p-5 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Jadwal Menguji
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}