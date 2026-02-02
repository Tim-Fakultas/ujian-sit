import {
  getTotalDosen,
  getTotalMahasiswa,
  getTotalPeminatan,
  getTotalProdi,
} from "@/actions/dashboard";
import {
  BookOpen,
  Building2,
  ClipboardCheck,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Users,
  UserSquare2,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActionGrid } from "@/components/dashboard/ActionGrid";

export default async function SuperAdminDashboardPage() {
  const [totalDosen, totalMahasiswa, totalPeminatan, totalProdi] = await Promise.all([
    getTotalDosen(),
    getTotalMahasiswa(),
    getTotalPeminatan(),
    getTotalProdi(),
  ]);

  // Data for Action Grid
  const quickActions = [
    {
      label: "Master Dosen",
      description: "Kelola data seluruh dosen universitas.",
      icon: Users,
      href: "/super-admin/dosen",
      color: "blue" as const,
    },
    {
      label: "Master Mahasiswa",
      description: "Kelola data seluruh mahasiswa.",
      icon: GraduationCap,
      href: "/super-admin/mahasiswa",
      color: "emerald" as const,
    },
    {
      label: "Data Peminatan",
      description: "Kelola data peminatan skripsi.",
      icon: BookOpen,
      href: "/super-admin/peminatan",
      color: "violet" as const,
    },
    {
      label: "Master Prodi",
      description: "Kelola data program studi.",
      icon: Building2,
      href: "/super-admin/prodi",
      color: "amber" as const,
    },
    {
      label: "Jenis Ujian",
      description: "Kelola master data jenis ujian.",
      icon: ClipboardList,
      href: "/super-admin/jenis-ujian",
      color: "rose" as const,
    },
    {
      label: "Komponen Penilaian",
      description: "Atur komponen penilaian skripsi.",
      icon: ClipboardCheck,
      href: "/super-admin/komponen-penilaian",
      color: "violet" as const,
    },
  ];

  return (
    <div className="p-6 md:p-8 min-h-screen space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <DashboardHeader
        title="Dashboard Super Admin"
        subtitle="Ringkasan data akademik Faculty of Science & Technology"
      />

      {/* Stats Grid */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
          <LayoutDashboard size={18} className="text-primary" />
          Statistik Universitas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Dosen"
            value={totalDosen}
            icon={Users}
            color="blue"
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
            title="Total Peminatan"
            value={totalPeminatan}
            icon={BookOpen}
            color="violet"
            className=""
          />
          <StatCard
            title="Total Prodi"
            value={totalProdi}
            icon={Building2}
            color="amber"
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
