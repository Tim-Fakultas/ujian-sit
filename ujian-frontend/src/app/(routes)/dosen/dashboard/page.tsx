import { getCurrentUserAction } from "@/actions/auth";
import { getJadwalUjianDosen } from "@/actions/jadwalUjian";
import { getPengajuanRanpelByDosenPA } from "@/actions/pengajuanRanpel";
import {
  getDosenBimbinganDetails,
  getDosenByUserId,
} from "@/actions/data-master/dosen";
import {
  Calendar,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { DashboardWelcome } from "@/components/dashboard/DashboardWelcome";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActionGrid } from "@/components/dashboard/ActionGrid";

export default async function DashboardDosenPage() {
  const { user } = await getCurrentUserAction();

  // user.id dari refreshUserAction sudah di-set ke dosen.id (bukan user_id)
  // user.user_id adalah ID di tabel users
  const dosenId = user?.id || 0;
  const userId = (user as any)?.user_id || user?.id || 0;

  // Fetch semua data paralel, dengan error handling per-item
  const [ranpelList, bimbinganDetails, jadwalList] = await Promise.all([
    // Ranpel PA menggunakan user_id (dosen sebagai PA)
    userId
      ? getPengajuanRanpelByDosenPA(userId).catch(() => [])
      : Promise.resolve([]),

    // Bimbingan menggunakan dosen.id
    dosenId
      ? getDosenBimbinganDetails(dosenId).catch(() => null)
      : Promise.resolve(null),

    // Jadwal menguji menggunakan dosen.id
    dosenId
      ? getJadwalUjianDosen(dosenId).catch(() => [])
      : Promise.resolve([]),
  ]);

  const ranpelMenunggu = Array.isArray(ranpelList)
    ? ranpelList.filter((r) => r.status === "menunggu").length
    : 0;

  const mhsBimbinganIds = new Set<number>();
  if (bimbinganDetails) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bimbinganDetails.pembimbing1?.forEach((m: any) =>
      mhsBimbinganIds.add(m.id),
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bimbinganDetails.pembimbing2?.forEach((m: any) =>
      mhsBimbinganIds.add(m.id),
    );
  }
  const totalBimbingan = mhsBimbinganIds.size;
  const jadwalMenguji = Array.isArray(jadwalList) ? jadwalList.length : 0;

  const quickActions = [
    {
      label: "Mahasiswa Bimbingan",
      description: "Lihat daftar mahasiswa bimbingan skripsi.",
      icon: Users,
      href: "/dosen/mahasiswa-bimbingan-skripsi",
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
      {/* Header — baca nama dari localStorage via client component */}
      <DashboardWelcome roleLabel="Dosen" />

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
            value={totalBimbingan}
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
