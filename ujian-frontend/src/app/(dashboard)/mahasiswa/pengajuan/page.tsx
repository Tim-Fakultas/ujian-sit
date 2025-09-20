import { TablePengajuan } from "@/components/table-pengajuan";
// import { getPengajuan } from "@/actions/pengajuan";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function MahasiswaPage() {
  //  real data from API
  // const initialData = await getPengajuan();

  const initialData = [
    {
      id: 1,
      mahasiswa: {
        id: 1,
        nama: "Muhammad Abdi",
        nim: "23051450225",
      },
      judul_skripsi: "Analisis Sistem Informasi Akademik",
      keterangan:
        "Judul ini membahas tentang analisis sistem informasi akademik di perguruan tinggi.",
      tanggal_pengajuan: "2023-10-01",
      tanggal_disetujui: null,
      status: "pending" as const,
    },
    {
      id: 1,
      mahasiswa: {
        id: 1,
        nama: "Muhammad Abdi",
        nim: "23051450225",
      },
      judul_skripsi: "Implementasi Sistem Informasi Akademik",
      keterangan:
        "Judul ini membahas tentang implementasi sistem informasi akademik di perguruan tinggi.",
      tanggal_pengajuan: "2023-10-02",
      tanggal_disetujui: null,
      status: "pending" as const,
    },
    {
      id: 1,
      mahasiswa: {
        id: 1,
        nama: "Muhammad Abdi",
        nim: "23051450225",
      },
      judul_skripsi:
        "Pengembangan Aplikasi Mobile untuk Sistem Informasi Akademik",
      keterangan:
        "Judul ini membahas tentang pengembangan aplikasi mobile untuk sistem informasi akademik di perguruan tinggi.",
      tanggal_pengajuan: "2023-10-03",
      tanggal_disetujui: "2025-09-01",
      status: "disetujui" as const,
    },
    {
      id: 1,
      mahasiswa: {
        id: 1,
        nama: "Muhammad Abdi",
        nim: "23051450225",
      },
      judul_skripsi: "Keamanan Data dalam Sistem Informasi Akademik",
      keterangan:
        "Judul ini membahas tentang keamanan data dalam sistem informasi akademik di perguruan tinggi.",
      tanggal_pengajuan: "2023-10-04",
      tanggal_disetujui: null,
      status: "pending" as const,
    },
    {
      id: 1,
      mahasiswa: {
        id: 1,
        nama: "Muhammad Abdi",
        nim: "23051450225",
      },
      judul_skripsi: "Integrasi Sistem Informasi Akademik dengan E-Learning",
      keterangan:
        "Judul ini membahas tentang integrasi sistem informasi akademik dengan platform e-learning di perguruan tinggi.",
      tanggal_pengajuan: "2023-10-05",
      tanggal_disetujui: null,
      status: "pending" as const,
    },
    {
      id: 6,
      mahasiswa: {
        id: 6,
        nama: "Diana Evans",
        nim: "7788990011",
      },
      judul_skripsi: "Analisis Big Data dalam Sistem Informasi Akademik",
      keterangan:
        "Judul ini membahas tentang analisis big data dalam konteks sistem informasi akademik di perguruan tinggi.",
      tanggal_pengajuan: "2023-10-06",
      tanggal_disetujui: null,
      status: "pending" as const,
    },
  ];

  const canSubmitProposal = true;

  return (
    <div className="flex w-full flex-col ">
      <div className="flex flex-col p-6 pb-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
        <h2 className="md:text-xl text-2xl font-semibold">Pengajuan Judul Anda</h2>
        <p className="md:text-xs text-sm text-muted-foreground mt-1">
          Pantau terus ya!
        </p>
          </div>
          {/* Tombol Tambah Pengajuan dengan kondisi disable */}
          <Tooltip>
        <TooltipTrigger asChild>
          <div className="mt-4 md:mt-0 self-start">
            <Link href={canSubmitProposal ? "/mahasiswa/pengajuan/create-pengajuan" : "#"}>
          <Button disabled={!canSubmitProposal}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Tambah Pengajuan</span>
            <span className="sm:hidden text-based">Tambah</span>
          </Button>
            </Link>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {canSubmitProposal
          ? "Tambah pengajuan judul baru"
          : "Pengajuan judul tidak tersedia"}
          </p>
        </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <TablePengajuan initialData={initialData} />;
    </div>
  );
}
