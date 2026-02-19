import { getCurrentUserAction } from "@/actions/auth";
import { getPendaftaranUjianByMahasiswaId } from "@/actions/pendaftaranUjian";
import { getPengajuanRanpelByMahasiswaId } from "@/actions/pengajuanRanpel";
import { getPerbaikanJudulByMahasiswa } from "@/actions/perbaikanJudul";
import {
  BookOpen,
  Calendar,
  ClipboardList,
  Edit,
  FileText,
  LayoutDashboard,
} from "lucide-react";
import { DashboardWelcome } from "@/components/dashboard/DashboardWelcome";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActionGrid } from "@/components/dashboard/ActionGrid";

export default async function MahasiswaDashboardPage() {
  // Ambil user dari cookie (di-set saat login, berisi data lengkap)
  const { user } = await getCurrentUserAction();
  const mahasiswaId = Number(user?.id);

  // Fetch data dengan error handling
  const [ranpelList, pendaftaranList, perbaikanList, jadwalList] =
    await Promise.all([
      mahasiswaId
        ? getPengajuanRanpelByMahasiswaId(mahasiswaId).catch(() => [])
        : Promise.resolve([]),
      mahasiswaId
        ? getPendaftaranUjianByMahasiswaId(mahasiswaId).catch(() => [])
        : Promise.resolve([]),
      mahasiswaId
        ? getPerbaikanJudulByMahasiswa(mahasiswaId).catch(() => [])
        : Promise.resolve([]),
      mahasiswaId
        ? import("@/actions/ujian")
            .then((mod) => mod.getJadwalUjianByMahasiswaIdByHasil(mahasiswaId))
            .catch(() => [])
        : Promise.resolve([]),
    ]);

  // Process data for stats
  const ranpelStatus =
    ranpelList && ranpelList.length > 0
      ? ranpelList[0].status
      : "Belum Mengajukan";
  const ranpelCount = ranpelList ? ranpelList.length : 0;

  const pendaftaranStatus =
    pendaftaranList && pendaftaranList.length > 0
      ? pendaftaranList[0].status
      : "Belum Mendaftar";
  const jadwalCount = jadwalList ? jadwalList.length : 0;

  const perbaikanStatus =
    perbaikanList && perbaikanList.length > 0
      ? perbaikanList[0].status
      : "Tidak Ada";

  // Data for Action Grid
  const quickActions = [
    {
      label: "Pengajuan Rancangan Penelitian",
      description: "Ajukan and pantau status rancangan penelitian skripsi.",
      icon: BookOpen,
      href: "/mahasiswa/pengajuan-ranpel",
      color: "blue" as const,
    },
    {
      label: "Perbaikan Judul",
      description: "Lihat riwayat dan status perbaikan judul.",
      icon: Edit,
      href: "/mahasiswa/perbaikan-judul",
      color: "amber" as const,
    },
    {
      label: "Pendaftaran Ujian",
      description: "Daftar ujian proposal, hasil, atau sidang.",
      icon: ClipboardList,
      href: "/mahasiswa/pendaftaran-ujian",
      color: "violet" as const,
    },
    {
      label: "Jadwal Ujian",
      description: "Lihat jadwal ujian yang akan datang.",
      icon: Calendar,
      href: "/mahasiswa/jadwal-ujian",
      color: "slate" as const,
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
      {/* Header — baca nama dari localStorage via client component */}
      <DashboardWelcome
        greeting="Assalamu'alaikum"
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
            title="Ujian Akan Datang"
            value={jadwalCount > 0 ? `${jadwalCount} Jadwal` : "Tidak Ada"}
            icon={Calendar}
            color="emerald"
            label={pendaftaranStatus}
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
