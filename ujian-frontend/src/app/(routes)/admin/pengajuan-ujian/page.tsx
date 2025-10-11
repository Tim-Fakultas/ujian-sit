"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
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
import { Search, FileText, Filter, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconFilter2 } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";

// ---------------- DUMMY DATA ----------------
const pengajuanUjianData = [
  {
    id: 1,
    nim: "23041450085",
    nama: "Muhammad Luqman Al-Fauzan",
    judul: "Analisis Sistem Informasi Akademik Berbasis Web",
    jenis: "Seminar Proposal",
    pembimbing1: "Dr. Siti Rahmah, M.Kom",
    pembimbing2: "Ir. Ahmad Syukri, M.T",
    tanggalPengajuan: "2025-09-22",
    status: "pending",
  },
  {
    id: 2,
    nim: "23041450020",
    nama: "Rahma Aulia",
    judul: "Implementasi Machine Learning untuk Prediksi Nilai Mahasiswa",
    jenis: "Seminar Hasil",
    pembimbing1: "Dr. M. Iqbal, M.Kom",
    pembimbing2: "Rizky Ananda, M.T",
    tanggalPengajuan: "2025-09-18",
    status: "didaftarkan",
  },
  {
    id: 3,
    nim: "23041450123",
    nama: "Andi Setiawan",
    judul: "Sistem Rekomendasi Buku Perpustakaan Menggunakan NLP",
    jenis: "Ujian Skripsi",
    pembimbing1: "Dr. Taufik Rahman, M.Kom",
    pembimbing2: "Yuliana Pratiwi, M.T",
    tanggalPengajuan: "2025-09-10",
    status: "terdaftar",
  },
];

// ---------------- STATUS LABELS & COLORS ----------------
const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  didaftarkan: "bg-blue-100 text-blue-700",
  terdaftar: "bg-green-100 text-green-700",
};

const statusLabels: Record<string, string> = {
  pending: "Menunggu",
  didaftarkan: "Sudah didaftarkan",
  terdaftar: "terdaftar",
};

// ---------------- MAIN COMPONENT ----------------
export default function AdminDaftarUjianPage() {
  const [search, setSearch] = useState("");
  const [examTypeFilter, setExamTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filter data
  const filteredData = pengajuanUjianData.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.judul.toLowerCase().includes(search.toLowerCase());
    const matchJenis =
      examTypeFilter === "all" ? true : item.jenis === examTypeFilter;
    const matchStatus =
      statusFilter === "all" ? true : item.status === statusFilter;
    return matchSearch && matchJenis && matchStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Daftar Pengajuan Ujian
            </h1>
            <p className="text-gray-500 mt-1">
              Kelola dan lihat pengajuan ujian yang masuk
            </p>
          </div>
        </div>

        {/* Filter dan Search */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 " />
            <Input
              placeholder="Cari nama atau judul skripsi"
              className="pl-10 border-gray-200 bg-white rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={examTypeFilter} onValueChange={setExamTypeFilter}>
              <SelectTrigger className="w-44 bg-white rounded">
                <IconFilter2 className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter jenis ujian" />
              </SelectTrigger>
              <SelectContent className="rounded">
                <SelectItem value="all">Semua Jenis</SelectItem>
                <SelectItem value="Seminar Proposal">
                  Seminar Proposal
                </SelectItem>
                <SelectItem value="Seminar Hasil">Seminar Hasil</SelectItem>
                <SelectItem value="Ujian Skripsi">Ujian Skripsi</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44 bg-white rounded">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent className="rounded">
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="didaftarkan">didaftarkan</SelectItem>
                <SelectItem value="terdaftar">terdaftar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabel */}
        <div className="bg-white rounded border">
          <Table className="text-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] text-center">No</TableHead>
                <TableHead className="w-[180px]">Nama Mahasiswa</TableHead>
                <TableHead className="max-w-[250px]">Judul</TableHead>
                <TableHead className="w-[140px]">Jenis Ujian</TableHead>
                <TableHead className="w-[140px]">Tanggal</TableHead>
                <TableHead className="w-[120px] text-center">Status</TableHead>
                <TableHead className="w-[70px] text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell className="text-center">
                      {startIndex + index + 1}
                    </TableCell>

                    <TableCell>
                      <div className="font-medium leading-tight truncate">
                        {item.nama}
                      </div>
                    </TableCell>

                    <TableCell className="max-w-[250px] truncate text-gray-700">
                      {item.judul}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        {item.jenis}
                      </Badge>
                    </TableCell>

                    <TableCell>{item.tanggalPengajuan}</TableCell>

                    <TableCell className="text-center">
                      <Badge
                        className={`${
                          statusColors[item.status]
                        } border-0 text-xs px-2 py-0.5`}
                      >
                        {statusLabels[item.status]}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-gray-100"
                          >
                            <MoreHorizontal className="h-4 w-4 text-gray-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 rounded"
                        >
                          <DropdownMenuItem onClick={() => setSelected(item)}>
                            <FileText className="h-4 w-4 mr-2 text-gray-600" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={
                              item.status === "didaftarkan" ||
                              item.status === "terdaftar"
                            }
                            onClick={() =>
                              alert(
                                `Buat SK Pengajuan Ujian untuk ${item.nama}`
                              )
                            }
                          >
                            <FileText className="h-4 w-4 mr-2 text-blue-600" />
                            Buat SK Pengajuan
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    Tidak ada pengajuan ujian
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Dialog Detail */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="sm:max-w-2xl rounded">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle>Detail Pengajuan Ujian</DialogTitle>
                  <DialogDescription>
                    Informasi lengkap mahasiswa yang mengajukan ujian
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">NIM</label>
                      <Input
                        value={selected.nim}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Nama</label>
                      <Input
                        value={selected.nama}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Judul Skripsi</label>
                    <Textarea
                      value={selected.judul}
                      readOnly
                      rows={3}
                      className="mt-1 rounded"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Jenis Ujian</label>
                      <Input
                        value={selected.jenis}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Tanggal Pengajuan
                      </label>
                      <Input
                        value={selected.tanggalPengajuan}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        Pembimbing 1
                      </label>
                      <Input
                        value={selected.pembimbing1}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Pembimbing 2
                      </label>
                      <Input
                        value={selected.pembimbing2}
                        readOnly
                        className="mt-1 rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <div className="mt-1">
                      <Badge
                        className={`${statusColors[selected.status]} border-0`}
                      >
                        {statusLabels[selected.status]}
                      </Badge>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelected(null)}>
                    Tutup
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
