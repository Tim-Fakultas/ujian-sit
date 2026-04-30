import { getDashboardStats } from "@/actions/kaprodi";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  FileText,
  Activity,
  Users,
  Timer,
  Bell,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActionGrid } from "@/components/dashboard/ActionGrid";
import { SubmissionTrendChart } from "@/components/dashboard/SubmissionTrendChart";
import { Card, CardContent } from "@/components/ui/card";

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
      label: "Mahasiswa Bimbingan",
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
    <div className="p-6 md:p-10 min-h-screen space-y-10 max-w-(--breakpoint-2xl) mx-auto animate-fadeIn">
      {/* 1. Header with Role Focus */}
      <DashboardHeader 
        title="Dashboard Ketua Prodi" 
        subtitle="Kelola progres akademik dan ujian skripsi mahasiswa secara efisien."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Left Column: KPIs and Trends */}
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Activity size={20} className="text-primary" />
              Monitoring Cepat
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard
                title="Ranpel Menunggu"
                value={stats?.pengajuan_menunggu || 0}
                icon={Timer}
                color="amber"
                trend={{ value: "+5", label: "sejak kemarin", isPositive: false }}
              />
              <StatCard
                title="Ujian Akan Datang"
                value={stats?.ujian_akan_datang || 0}
                icon={Calendar}
                color="violet"
                label="Dalam 7 hari ke depan"
              />
            </div>
          </section>

          <SubmissionTrendChart />
        </div>

        {/* 3. Right Column: Notifications / Activity */}
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Bell size={20} className="text-rose-500" />
              Notifikasi Penting
            </h2>
            <Card className="border-border/50 overflow-hidden">
               <CardContent className="p-0">
                  <div className="divide-y divide-border/30">
                    <div className="p-4 bg-amber-50/50 dark:bg-amber-900/10 hover:bg-amber-100/50 dark:hover:bg-amber-900/20 transition-colors cursor-pointer">
                        <p className="text-xs font-bold text-amber-600 mb-1 flex items-center gap-1">
                            <Activity size={12} /> PRIORITAS TINGGI
                        </p>
                        <p className="text-sm font-semibold text-foreground">5 Pengajuan Ranpel Lewat Batas Waktu</p>
                        <p className="text-xs text-muted-foreground mt-1">Segera berikan rekomendasi dosen pembimbing.</p>
                    </div>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 hover:bg-muted/30 transition-colors cursor-pointer">
                        <p className="text-sm font-medium text-foreground">Jadwal Ujian Baru Ditentukan</p>
                        <p className="text-xs text-muted-foreground mt-1">Mahasiswa: Ani Wijaya - 14:00 WIB</p>
                      </div>
                    ))}
                  </div>
               </CardContent>
            </Card>
          </section>
        </div>
      </div>

      {/* 4. Action Access - Lower visual priority */}
      <section className="space-y-6 pt-6 border-t border-border/50">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Akses Layanan Prodi
          </h2>
          <p className="text-muted-foreground">Pintasan untuk manajemen skripsi dan mahasiswa.</p>
        </div>
        <ActionGrid items={quickActions} columns={4} />
      </section>
    </div>
  );
}

