"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, FileText, MoreVertical, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

// 🧩 Dummy type
interface Mahasiswa {
  nim: string;
  nama: string;
  prodi: { nama: string };
}

interface PengajuanUjian {
  id: number;
  mahasiswa: Mahasiswa;
  judulSkripsi: string;
  deskripsi: string;
  pembimbing1?: { nama: string };
  pembimbing2?: { nama: string };
  status: string;
  skUjian?: boolean;
}

export default function AdminPengajuanUjianPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selected, setSelected] = useState<PengajuanUjian | null>(null);
  const [pengajuanData, setPengajuanData] = useState<PengajuanUjian[]>([]);
  const router = useRouter();

  // 🧠 Simulasi ambil data dari server
  useEffect(() => {
    const dummy: PengajuanUjian[] = [
      {
        id: 1,
        mahasiswa: {
          nim: "23041450085",
          nama: "Muhammad Luqman Al-Fauzan",
          prodi: { nama: "Sistem Informasi" },
        },
        judulSkripsi:
          "Rancang Bangun Sistem Informasi Akademik Fakultas Berbasis Web",
        deskripsi:
          "Penelitian ini bertujuan untuk mengembangkan sistem akademik terintegrasi untuk Fakultas Sains dan Teknologi.",
        pembimbing1: { nama: "Dr. Fikri Rahman, M.Kom" },
        pembimbing2: { nama: "Mira Andini, S.Kom., M.Kom" },
        status: "disetujui",
        skUjian: false,
      },
      {
        id: 2,
        mahasiswa: {
          nim: "23041450100",
          nama: "Nabila Salsabila",
          prodi: { nama: "Teknik Informatika" },
        },
        judulSkripsi:
          "Implementasi Machine Learning untuk Prediksi Kelulusan Mahasiswa",
        deskripsi:
          "Penelitian ini membahas algoritma ML untuk memprediksi kelulusan mahasiswa berdasarkan data akademik.",
        pembimbing1: { nama: "Dr. Ahmad Fauzi, M.Kom" },
        status: "disetujui",
        skUjian: true,
      },
      {
        id: 3,
        mahasiswa: {
          nim: "23041450105",
          nama: "Rizky Maulana",
          prodi: { nama: "Sistem Informasi" },
        },
        judulSkripsi:
          "Analisis Efektivitas E-Learning Menggunakan Metode TAM (Technology Acceptance Model)",
        deskripsi:
          "Penelitian ini mengevaluasi penerimaan e-learning oleh mahasiswa berdasarkan variabel TAM.",
        pembimbing1: { nama: "Dr. Taufik Rahman, M.Kom" },
        pembimbing2: { nama: "Nurul Fitri, M.Kom" },
        status: "disetujui",
        skUjian: false,
      },
    ];
    setPengajuanData(dummy);
  }, []);

  const handleBuatSKUjian = (item: PengajuanUjian) => {
    // Arahkan ke halaman pembuatan SK (sementara dummy)
    router.push(`/coming-soon?feature=buat-sk-ujian&id=${item.id}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Menunggu</Badge>;
      case "disetujui":
        return <Badge className="bg-green-500 text-white">Disetujui</Badge>;
      case "ditolak":
        return <Badge variant="destructive">Ditolak</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredData = pengajuanData.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.mahasiswa.nama.toLowerCase().includes(q) ||
      item.mahasiswa.nim.toLowerCase().includes(q) ||
      item.judulSkripsi.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Pengajuan Ujian Proposal
          </h1>
          <p className="text-gray-600 mt-1">
            Daftar mahasiswa yang telah disetujui untuk ujian proposal dan
            memerlukan pembuatan SK Ujian.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari nama, NIM, atau judul skripsi..."
              className="pl-10 border-gray-200 bg-white rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded border overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No</TableHead>
                <TableHead>Mahasiswa</TableHead>
                <TableHead>Judul Skripsi</TableHead>
                <TableHead>Pembimbing</TableHead>
                <TableHead>Status SK</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.mahasiswa.nama}</div>
                        <div className="text-sm text-gray-500">
                          {item.mahasiswa.nim}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.mahasiswa.prodi.nama}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help truncate block">
                              {item.judulSkripsi}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-sm">
                            <p>{item.judulSkripsi}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{item.pembimbing1?.nama}</div>
                        {item.pembimbing2 && (
                          <div className="text-sm text-gray-600">
                            {item.pembimbing2.nama}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.skUjian ? (
                        <Badge className="bg-blue-500 text-white">
                          Sudah Dibuat
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Belum Dibuat</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelected(item)}>
                            <Eye className="mr-2 h-4 w-4" /> Detail
                          </DropdownMenuItem>
                          {!item.skUjian && (
                            <DropdownMenuItem
                              onClick={() => handleBuatSKUjian(item)}
                              className="text-blue-600 focus:text-blue-600"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Buat SK Ujian Proposal
                            </DropdownMenuItem>
                          )}
                          {item.skUjian && (
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/coming-soon?feature=lihat-sk`)
                              }
                              className="text-green-600 focus:text-green-600"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              Lihat SK Ujian
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Tidak ada data pengajuan ujian
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm">Tampil:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(v) => {
                  setItemsPerPage(parseInt(v));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20 rounded">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          setCurrentPage(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>

        {/* Dialog Detail */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle>Detail Pengajuan Ujian Proposal</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">NIM</label>
                      <Input
                        value={selected.mahasiswa.nim}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Nama Mahasiswa
                      </label>
                      <Input
                        value={selected.mahasiswa.nama}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Judul Skripsi</label>
                    <Input
                      value={selected.judulSkripsi}
                      readOnly
                      className="mt-1 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Deskripsi</label>
                    <Input
                      value={selected.deskripsi}
                      readOnly
                      className="mt-1 rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        Pembimbing 1
                      </label>
                      <Input
                        value={selected.pembimbing1?.nama || "-"}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Pembimbing 2
                      </label>
                      <Input
                        value={selected.pembimbing2?.nama || "-"}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <div className="mt-1">
                      {getStatusBadge(selected.status)}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelected(null)}>
                    Tutup
                  </Button>
                  {!selected.skUjian && (
                    <Button
                      onClick={() => {
                        setSelected(null);
                        handleBuatSKUjian(selected);
                      }}
                      className="rounded"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Buat SK Ujian Proposal
                    </Button>
                  )}
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
