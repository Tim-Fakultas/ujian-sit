import {
  getTotalBeritaUjian,
  getTotalJadwalUjian,
  getTotalPendaftaranUjianMenunggu,
} from "@/actions/dashboard";
import { getCurrentUserAction } from "@/actions/auth";
import {
  Calendar,
  ClipboardCheck,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Hourglass,
  LayoutDashboard,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActionGrid } from "@/components/dashboard/ActionGrid";

export default async function DashboardSekprodiPage() {
  const { user } = await getCurrentUserAction();
  const prodiId = user?.prodi?.id;

  const [totalJadwalUjian, totalPendaftaranMenunggu, totalBeritaUjian] = await Promise.all([
    getTotalJadwalUjian(prodiId),
    getTotalPendaftaranUjianMenunggu(prodiId),
    getTotalBeritaUjian(prodiId),
  ]);

  // Data for Action Grid
  const quickActions = [
    {
      label: "Pendaftaran Ujian",
      description: "Verifikasi pendaftaran ujian mahasiswa.",
      icon: ClipboardCheck,
      href: "/sekprodi/pendaftaran-ujian",
      color: "blue" as const,
    },
    {
      label: "Perbaikan Judul",
      description: "Kelola pengajuan perbaikan judul.",
      icon: FileText,
      href: "/sekprodi/perbaikan-judul",
      color: "amber" as const,
    },
    {
      label: "Penjadwalan Ujian",
      description: "Atur jadwal dan ruangan ujian.",
      icon: Calendar,
      href: "/sekprodi/penjadwalan-ujian",
      color: "violet" as const,
    },
    {
      label: "Jadwal Ujian",
      description: "Lihat jadwal ujian yang aktif.",
      icon: LayoutDashboard,
      href: "/sekprodi/jadwal-ujian",
      color: "violet" as const,
    },
    {
      label: "Berita Acara",
      description: "Kelola berita acara ujian.",
      icon: FileText,
      href: "/sekprodi/berita-ujian",
      color: "emerald" as const,
    },
    {
      label: "Rekap Nilai",
      description: "Lihat rekapitulasi nilai ujian.",
      icon: GraduationCap,
      href: "/sekprodi/rekapitulasi-nilai",
      color: "rose" as const,
    },
  ];

  return (
    <div className="p-6 md:p-8 min-h-screen space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <DashboardHeader
        title={`Selamat Datang, ${user?.nama?.split(" ")[0]}`}
        subtitle={`Dashboard Sekretaris Prodi ${user?.prodi?.nama_prodi || ""}`}
      />

      {/* Stats Grid */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
          <LayoutDashboard size={18} className="text-primary" />
          Statistik Akademik
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Menunggu Verifikasi"
            value={totalPendaftaranMenunggu}
            icon={Hourglass}
            color="amber"
            className=""
          />
          <StatCard
            title="Total Jadwal Ujian"
            value={totalJadwalUjian}
            icon={Calendar}
            color="blue"
            className=""
          />
          <StatCard
            title="Berita Acara"
            value={totalBeritaUjian}
            icon={FileText}
            color="emerald"
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
