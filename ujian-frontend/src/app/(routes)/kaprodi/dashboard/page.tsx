import { getCurrentUserAction } from "@/actions/auth";
import {
  getTotalDosen,
  getTotalMahasiswa,
  getTotalPengajuanRanpelMenunggu,
} from "@/actions/dashboard";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Users,
  GraduationCap,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActionGrid } from "@/components/dashboard/ActionGrid";
import { getDisplayName } from "@/lib/utils";

export default async function KaprodiDashboardPage() {
  const { user } = await getCurrentUserAction();
  const prodiId = user?.prodi?.id;

  // Fetch Data Parallel
  const [totalRanpelMenunggu, totalMahasiswa, totalDosen] = await Promise.all([
    getTotalPengajuanRanpelMenunggu(prodiId),
    getTotalMahasiswa(prodiId),
    getTotalDosen(prodiId),
  ]);

  // Data for Action Grid
  const quickActions = [
    {
      label: "Rancangan Penelitian",
      description: "Validasi pengajuan judul mahasiswa.",
      icon: BookOpen,
      href: "/kaprodi/pengajuan-ranpel",
      color: "blue" as const,
    },
    {
      label: "Jadwal Ujian",
      description: "Pantau jadwal ujian skripsi.",
      icon: Calendar,
      href: "/kaprodi/jadwal-ujian",
      color: "violet" as const,
    },
    {
      label: "Mahasiswa Bimbingan",
      description: "Data mahasiswa bimbingan prodi.",
      icon: Users,
      href: "/kaprodi/mahasiswa-bimbingan",
      color: "emerald" as const,
    },
    {
      label: "Riwayat Judul",
      description: "Riwayat perubahan judul skripsi.",
      icon: FileText,
      href: "/kaprodi/riwayat-judul",
      color: "amber" as const,
    },
  ];

  return (
    <div className="p-6 md:p-8 min-h-screen space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <DashboardHeader
        title={`Selamat Datang, ${getDisplayName(user?.nama)}`}
        subtitle={`Dashboard Ketua Prodi ${user?.prodi?.nama || "Informatika"}`}
      />

      {/* Stats Grid */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
          <LayoutDashboard size={18} className="text-primary" />
          Statistik Program Studi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Ranpel Menunggu"
            value={totalRanpelMenunggu}
            icon={CheckCircle2}
            color="amber"
            className=""
          />
          <StatCard
            title="Total Mahasiswa"
            value={totalMahasiswa}
            icon={GraduationCap}
            color="emerald"
            className=""
          />
          <StatCard
            title="Total Dosen"
            value={totalDosen}
            icon={Users}
            color="violet"
            className=""
          />
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Akses Cepat
        </h2>
        <ActionGrid items={quickActions} columns={4} />
      </section>
    </div>
  );
}
