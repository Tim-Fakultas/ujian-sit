"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Type untuk data pengajuan
interface PengajuanJudul {
  id: number;
  judul: string;
  keterangan: string;
  tanggalPengajuan: string;
  tanggalDisetujui?: string;
  status: "pending" | "disetujui" | "ditolak";
}

// Dummy data (id dibuat unik)
const dummyData: PengajuanJudul[] = [
  {
    id: 1,
    judul: "Implementasi Machine Learning untuk Prediksi Cuaca",
    keterangan: "Judul sedang direview",
    tanggalPengajuan: "2025-01-10",
    tanggalDisetujui: "2025-01-20",
    status: "disetujui",
  },
  {
    id: 2,
    judul: "Sistem Informasi Akademik Berbasis Cloud",
    keterangan: "Menunggu persetujuan",
    tanggalPengajuan: "2025-02-14",
    status: "pending",
  },
  {
    id: 3,
    judul: "Aplikasi Mobile untuk Manajemen Keuangan Pribadi",
    keterangan: "Draft awal sedang disiapkan",
    tanggalPengajuan: "2025-03-01",
    status: "pending",
  },
  {
    id: 4,
    judul: "Analisis Sentimen pada Media Sosial menggunakan NLP",
    keterangan: "Ditolak karena kurang relevan",
    tanggalPengajuan: "2025-03-12",
    status: "ditolak",
  },
  {
    id: 5,
    judul: "Pengembangan Sistem Absensi Berbasis RFID",
    keterangan: "Judul sedang direview",
    tanggalPengajuan: "2025-03-20",
    status: "pending",
  },
  {
    id: 6,
    judul: "Dashboard Monitoring IoT untuk Smart Home",
    keterangan: "Menunggu persetujuan",
    tanggalPengajuan: "2025-04-02",
    status: "pending",
  },
  {
    id: 7,
    judul: "Optimasi Database dengan Algoritma Indexing",
    keterangan: "Judul sedang direview",
    tanggalPengajuan: "2025-04-10",
    status: "disetujui",
    tanggalDisetujui: "2025-04-18",
  },
];

export default function PengajuanJudulPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = dummyData.filter((item) => {
    const matchSearch =
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      item.keterangan.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" ? true : item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset pagination when search or filter changes
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen p-8">
      {/* Judul Halaman */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-site-header">
          Pengajuan Judul Mahasiswa
        </h1>
        <p className="text-gray-600 mt-1">
          Halaman ini menampilkan daftar judul skripsi yang kamu ajukan.
        </p>
      </div>

      {/* Search + Filter + Tambah */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari judul..."
              className="pl-8 bg-white"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <Select onValueChange={handleFilterChange} defaultValue="all">
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="disetujui">Disetujui</SelectItem>
              <SelectItem value="ditolak">Ditolak</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-site-header hover:bg-[#4e55c4] text-white">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pengajuan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Form Pengajuan Judul</DialogTitle>
              <DialogDescription>
                Isi form berikut untuk mengajukan judul skripsi.
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-4">
              <div>
                <label className="text-sm font-medium">Judul</label>
                <Input placeholder="Masukkan judul skripsi" />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Identifikasi Masalah
                </label>
                <Textarea placeholder="Tuliskan identifikasi masalah..." />
              </div>

              <div>
                <label className="text-sm font-medium">Rumusan Masalah</label>
                <Textarea placeholder="Tuliskan rumusan masalah..." />
              </div>

              <div>
                <label className="text-sm font-medium">Pokok Masalah</label>
                <Textarea placeholder="Tuliskan pokok masalah..." />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Penelitian Sebelumnya
                </label>
                <Textarea placeholder="Tuliskan penelitian sebelumnya..." />
              </div>

              <div>
                <label className="text-sm font-medium">Deskripsi Lengkap</label>
                <Textarea placeholder="Tuliskan deskripsi lengkap..." />
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-site-header hover:bg-[#4e55c4] text-white"
                >
                  Simpan
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="rounded-lg shadow-sm border bg-white  overflow-hidden">
        <Table>
          <TableHeader className="bg-site-header text-white rounded-lg">
            <TableRow>
              <TableHead className="w-12 text-white">No</TableHead>
              <TableHead className="text-white">Judul</TableHead>
              <TableHead className="text-white">Keterangan</TableHead>
              <TableHead className="text-white">Tanggal Pengajuan</TableHead>
              <TableHead className="text-white">Tanggal Disetujui</TableHead>
              <TableHead className="text-white">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((item, idx) => (
                <TableRow key={`${item.id}-${idx}`}>
                  {/* Penomoran konsisten */}
                  <TableCell>{startIndex + idx + 1}</TableCell>
                  <TableCell>{item.judul}</TableCell>
                  <TableCell>{item.keterangan}</TableCell>
                  <TableCell>{item.tanggalPengajuan}</TableCell>
                  <TableCell>{item.tanggalDisetujui || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        item.status === "disetujui"
                          ? "bg-green-100 text-green-700"
                          : item.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page);
                      }}
                      isActive={currentPage === page}
                      className="cursor-pointer"
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
                      handlePageChange(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
