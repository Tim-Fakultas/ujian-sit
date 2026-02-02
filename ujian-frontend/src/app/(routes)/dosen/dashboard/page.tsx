import { getCurrentUserAction } from "@/actions/auth";
import { getJadwalUjianDosen } from "@/actions/jadwalUjian";
import { getPengajuanRanpelByDosenPA } from "@/actions/pengajuanRanpel";
import {
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActionGrid } from "@/components/dashboard/ActionGrid";

export default async function DashboardDosenPage() {
  const { user } = await getCurrentUserAction();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dosenId = (user as any)?.dosen?.id;

  // Fetch Data
  const ranpelList = await getPengajuanRanpelByDosenPA(user?.id);
  const ranpelMenunggu = ranpelList.filter(
    (r) => r.status === "menunggu"
  ).length;

  const jadwalList = await getJadwalUjianDosen(user?.id || 0);
  const jadwalMenguji = jadwalList.length;

  // Data for Action Grid
  const quickActions = [
    {
      label: "Mahasiswa Bimbingan",
      description: "Lihat daftar mahasiswa bimbingan skripsi.",
      icon: Users,
      href: "/dosen/mahasiswa-bimbingan",
      color: "emerald" as const,
    },
    {
      label: "Rancangan Penelitian",
      description: "Validasi pengajuan rancangan penelitian.",
      icon: ClipboardCheck,
      href: "/dosen/pengajuan-ranpel",
      color: "blue" as const,
    },
    {
      label: "Perbaikan Judul",
      description: "Riwayat perbaikan judul mahasiswa.",
      icon: FileText,
      href: "/dosen/riwayat-judul",
      color: "amber" as const,
    },
    {
      label: "Jadwal Ujian",
      description: "Jadwal dimana Anda ditugaskan menguji.",
      icon: Calendar,
      href: "/dosen/jadwal-ujian",
      color: "violet" as const,
    },
    {
      label: "Penilaian Ujian",
      description: "Input nilai ujian mahasiswa.",
      icon: ClipboardCheck,
      href: "/dosen/penilaian-ujian",
      color: "rose" as const,
    },
    {
      label: "Rekap Nilai",
      description: "Rekapitulasi nilai ujian mahasiswa.",
      icon: GraduationCap,
      href: "/dosen/rekapitulasi-nilai",
      color: "blue" as const,
    },
  ];

  return (
    <div className="p-6 md:p-8 min-h-screen space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <DashboardHeader
        title={`Selamat Datang, ${user?.nama?.split(" ")[0]}`}
        subtitle={`Dashboard Dosen - ${user?.email || ""}`}
      />

      {/* Stats Grid */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
          <LayoutDashboard size={18} className="text-primary" />
          Statistik Dosen
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Validasi Ranpel"
            value={ranpelMenunggu}
            icon={ClipboardCheck}
            color="amber"
            className=""
          />
          <StatCard
            title="Jadwal Menguji"
            value={jadwalMenguji}
            icon={Calendar}
            color="blue"
            className=""
          />
          <StatCard
            title="Total Bimbingan"
            value={ranpelList.length}
            icon={Users}
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