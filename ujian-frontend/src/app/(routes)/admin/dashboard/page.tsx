import {
  getTotalDosen,
  getTotalJadwalUjian,
  getTotalMahasiswa,
} from "@/actions/dashboard";
import { getCurrentUserAction } from "@/actions/auth";
import {
  Calendar,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Users,
  UserSquare2,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActionGrid } from "@/components/dashboard/ActionGrid";

export default async function AdminDashboardPage() {
  const { user } = await getCurrentUserAction();
  const prodiId = user?.prodi?.id;

  const [totalMahasiswa, totalDosen, totalJadwal] = await Promise.all([
    getTotalMahasiswa(prodiId),
    getTotalDosen(prodiId),
    getTotalJadwalUjian(prodiId),
  ]);

  // Data for Action Grid
  const quickActions = [
    {
      label: "Master Dosen",
      description: "Kelola data dosen program studi.",
      icon: UserSquare2,
      href: "/admin/dosen",
      color: "violet" as const,
    },
    {
      label: "Master Mahasiswa",
      description: "Kelola data mahasiswa program studi.",
      icon: GraduationCap,
      href: "/admin/mahasiswa",
      color: "blue" as const,
    },
    {
      label: "Jadwal Ujian",
      description: "Lihat dan kelola jadwal ujian.",
      icon: Calendar,
      href: "/admin/jadwal-ujian",
      color: "emerald" as const,
    },
    {
      label: "Rekapitulasi Nilai",
      description: "Lihat rekapitulasi nilai ujian mahasiswa.",
      icon: ClipboardList,
      href: "/admin/rekapitulasi-nilai",
      color: "amber" as const,
    },
    {
      label: "Berita Acara",
      description: "Lihat data berita acara ujian.",
      icon: ClipboardList,
      href: "/admin/berita-ujian",
      color: "rose" as const,
    },
  ];

  return (
    <div className="p-6 md:p-8 min-h-screen space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <DashboardHeader
        title={`Selamat Datang, ${user?.nama?.split(" ")[0]}!`}
        subtitle={`Dashboard Admin Prodi ${user?.prodi?.nama_prodi || "Sistem"}`}
      />

      {/* Stats Grid */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
          <LayoutDashboard size={18} className="text-primary" />
          Statistik Program Studi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Mahasiswa"
            value={totalMahasiswa}
            icon={GraduationCap}
            color="blue"
            className=""
          />
          <StatCard
            title="Total Dosen"
            value={totalDosen}
            icon={UserSquare2}
            color="violet"
            className=""
          />
          <StatCard
            title="Jadwal Ujian Aktif"
            value={totalJadwal}
            icon={Calendar}
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