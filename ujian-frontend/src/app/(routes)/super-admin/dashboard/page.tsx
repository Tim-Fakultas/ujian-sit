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
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActionGrid } from "@/components/dashboard/ActionGrid";
import { ProdiChart } from "@/components/dashboard/ProdiChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="p-6 md:p-10 min-h-screen space-y-10 max-w-(--breakpoint-2xl) mx-auto animate-fadeIn">
      {/* 1. Header Section - Top Priority */}
      <DashboardHeader
        title="Dashboard Super Admin"
        subtitle="Sistem Informasi Ujian Skripsi Terintegrasi"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Z-Pattern: Critical Stats & Visualizations */}
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Activity size={20} className="text-primary animate-pulse" />
              Statistik Utama
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard
                title="Total Dosen"
                value={totalDosen}
                icon={Users}
                color="blue"
                trend={{ value: "+2", label: "bulan ini", isPositive: true }}
              />
              <StatCard
                title="Total Mahasiswa"
                value={totalMahasiswa}
                icon={GraduationCap}
                color="emerald"
                trend={{ value: "+124", label: "semester ini", isPositive: true }}
              />
              <StatCard
                title="Total Peminatan"
                value={totalPeminatan}
                icon={BookOpen}
                color="violet"
                trend={{ value: "Target: 10", label: "untuk akreditasi", isPositive: true }}
              />
              <StatCard
                title="Total Prodi"
                value={totalProdi}
                icon={Building2}
                color="amber"
                label="Fakultas Sains & Teknologi"
              />
            </div>
          </section>

          {/* 3. Data Visualization - Insight Driven */}
          <ProdiChart />
        </div>

        {/* 4. Sidebar Content / Secondary Info - Right side of Z-pattern */}
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Aktivitas Terbaru
            </h2>
            <Card className="border-border/50">
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                        <Users size={18} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">Dosen Baru Ditambahkan</p>
                        <p className="text-xs text-muted-foreground">Oleh Admin 2j yang lalu</p>
                      </div>
                      <ArrowUpRight size={14} className="text-muted-foreground/50" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      {/* 5. Progressive Disclosure: Access Cepat is kept below the fold */}
      <section className="space-y-6 pt-6 border-t border-border/50">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Manajemen Data Master
          </h2>
          <p className="text-muted-foreground">Kelola seluruh basis data akademik prodi dan fakultas.</p>
        </div>
        <ActionGrid items={quickActions} columns={3} />
      </section>
    </div>
  );
}

