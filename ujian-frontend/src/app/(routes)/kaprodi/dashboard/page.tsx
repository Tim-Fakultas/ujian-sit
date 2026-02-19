import { getDashboardStats } from "@/actions/kaprodi";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  FileText,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { DashboardWelcome } from "@/components/dashboard/DashboardWelcome";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActionGrid } from "@/components/dashboard/ActionGrid";

export default async function KaprodiDashboardPage() {
  const stats = await getDashboardStats();

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
      label: "Mahasiswa Bimbingan Skripsi",
      description: "Data mahasiswa bimbingan skripsi prodi.",
      icon: Users,
      href: "/kaprodi/mahasiswa-bimbingan-skripsi",
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
      <DashboardWelcome roleLabel="Ketua Prodi" />

      {/* Stats Grid */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
          <LayoutDashboard size={18} className="text-primary" />
          Statistik Program Studi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Ranpel Menunggu"
            value={stats?.pengajuan_menunggu || 0}
            icon={CheckCircle2}
            color="amber"
            className=""
          />
          <StatCard
            title="Ujian Akan Datang"
            value={stats?.ujian_akan_datang || 0}
            icon={Calendar}
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
