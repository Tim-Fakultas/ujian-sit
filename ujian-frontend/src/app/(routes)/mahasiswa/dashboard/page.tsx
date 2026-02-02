import { getCurrentUserAction } from "@/actions/auth";
import { getPendaftaranUjianByMahasiswaId } from "@/actions/pendaftaranUjian";
import { getPengajuanRanpelByMahasiswaId } from "@/actions/pengajuanRanpel";
import { getPerbaikanJudulByMahasiswa } from "@/actions/perbaikanJudul";
import {
  BookOpen,
  Calendar,
  ClipboardList,
  FileText,
  LayoutDashboard,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActionGrid } from "@/components/dashboard/ActionGrid";

export default async function MahasiswaDashboardPage() {
  const { user } = await getCurrentUserAction();
  const mahasiswaId = Number(user?.id);

  // Fetch data
  const [ranpelList, pendaftaranList, perbaikanList] = await Promise.all([
    getPengajuanRanpelByMahasiswaId(mahasiswaId),
    getPendaftaranUjianByMahasiswaId(mahasiswaId),
    getPerbaikanJudulByMahasiswa(mahasiswaId),
  ]);

  // Process data for stats
  const ranpelStatus = ranpelList && ranpelList.length > 0 ? ranpelList[0].status : "Belum Mengajukan";
  const ranpelCount = ranpelList ? ranpelList.length : 0;

  const pendaftaranStatus = pendaftaranList && pendaftaranList.length > 0 ? pendaftaranList[0].status : "Belum Mendaftar";

  const perbaikanStatus = perbaikanList && perbaikanList.length > 0 ? perbaikanList[0].status : "Tidak Ada";


  // Data for Action Grid
  const quickActions = [
    {
      label: "Rancangan Penelitian",
      description: "Ajukan dan pantau status rancangan penelitian skripsi.",
      icon: BookOpen,
      href: "/mahasiswa/pengajuan-ranpel",
      color: "blue" as const,
    },
    {
      label: "Perbaikan Judul",
      description: "Lihat riwayat dan status perbaikan judul.",
      icon: FileText,
      href: "/mahasiswa/perbaikan-judul",
      color: "amber" as const,
    },
    {
      label: "Pendaftaran Ujian",
      description: "Daftar ujian proposal, hasil, atau sidang.",
      icon: ClipboardList,
      href: "/mahasiswa/pendaftaran-ujian",
      color: "emerald" as const,
    },
    {
      label: "Jadwal Ujian",
      description: "Lihat jadwal ujian yang akan datang.",
      icon: Calendar,
      href: "/mahasiswa/jadwal-ujian",
      color: "amber" as const,
    },
    {
      label: "Ujian",
      description: "Akses halaman pelaksanaan ujian.",
      icon: LayoutDashboard,
      href: "/mahasiswa/ujian",
      color: "violet" as const,
    },
  ];

  return (
    <div className="p-6 md:p-8 min-h-screen space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <DashboardHeader
        title={`Assalamu'alaikum, ${user?.nama?.split(" ")[0]}!`}
        subtitle="Selamat datang di Dashboard Mahasiswa. Pantau progres akademikmu di sini."
      />

      {/* Stats Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
          <LayoutDashboard size={18} className="text-primary" />
          Status Proses Akademik
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Status Ranpel"
            value={ranpelStatus}
            icon={BookOpen}
            color="blue"
            label={`${ranpelCount} Pengajuan`}
            className=""
          />
          <StatCard
            title="Status Perbaikan Judul"
            value={perbaikanStatus}
            icon={FileText}
            color="amber"
            className=""
          />
          <StatCard
            title="Status Pendaftaran Ujian"
            value={pendaftaranStatus}
            icon={ClipboardList}
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