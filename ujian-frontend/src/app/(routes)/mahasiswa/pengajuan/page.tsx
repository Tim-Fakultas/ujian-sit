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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

// Type untuk data pengajuan
interface PengajuanJudul {
  id: number;
  judul: string;
  keterangan: string;
  tanggalPengajuan: string;
  tanggalDisetujui?: string;
  status: "pending" | "disetujui" | "ditolak";
}

// Dummy data (jangan diubah)
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

const statusColors = {
  pending: "bg-orange-100 text-orange-700",
  disetujui: "bg-green-100 text-green-700",
  ditolak: "bg-red-100 text-red-700",
};

const statusLabels = {
  pending: "Pending",
  disetujui: "Disetujui",
  ditolak: "Ditolak",
};

export default function PengajuanJudulPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredData = dummyData.filter((item) => {
    const matchSearch =
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      item.keterangan.toLowerCase().includes(search.toLowerCase());
    const matchStatus = activeTab === "all" ? true : item.status === activeTab;
    return matchSearch && matchStatus;
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
              Pengajuan Judul Mahasiswa
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola dan pantau pengajuan judul skripsi Anda
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Pengajuan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl h-[90vh] overflow-y-auto rounded">
              <DialogHeader>
                <DialogTitle>Form Pengajuan Judul</DialogTitle>
                <DialogDescription>
                  Isi form berikut untuk mengajukan judul skripsi.
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Judul</label>
                  <Input
                    placeholder="Masukkan judul skripsi"
                    className="rounded"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Identifikasi Masalah
                  </label>
                  <Textarea
                    placeholder="Tuliskan identifikasi masalah..."
                    className="rounded"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Rumusan Masalah</label>
                  <Textarea
                    placeholder="Tuliskan rumusan masalah..."
                    className="rounded"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Pokok Masalah</label>
                  <Textarea
                    placeholder="Tuliskan pokok masalah..."
                    className="rounded"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Penelitian Sebelumnya
                  </label>
                  <Textarea
                    placeholder="Tuliskan penelitian sebelumnya..."
                    className="rounded"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Deskripsi Lengkap
                  </label>
                  <Textarea
                    placeholder="Tuliskan deskripsi lengkap..."
                    className="rounded"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" className="rounded">
                    Simpan
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              className="pl-10 border-gray-200 bg-white rounded"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded border ${
                activeTab === "all"
                  ? "bg-gray-100 border-gray-300 text-gray-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Semua ({dummyData.length})
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-3 py-1.5 rounded border ${
                activeTab === "pending"
                  ? "bg-gray-100 border-gray-300 text-gray-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Pending ({dummyData.filter((i) => i.status === "pending").length})
            </button>
            <button
              onClick={() => setActiveTab("disetujui")}
              className={`px-3 py-1.5 rounded border ${
                activeTab === "disetujui"
                  ? "bg-gray-100 border-gray-300 text-gray-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Disetujui (
              {dummyData.filter((i) => i.status === "disetujui").length})
            </button>
            <button
              onClick={() => setActiveTab("ditolak")}
              className={`px-3 py-1.5 rounded border ${
                activeTab === "ditolak"
                  ? "bg-gray-100 border-gray-300 text-gray-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Ditolak ({dummyData.filter((i) => i.status === "ditolak").length})
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded border overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead>Tanggal Pengajuan</TableHead>
                <TableHead>Tanggal Disetujui</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="max-w-md truncate text-gray-600">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="truncate cursor-help">
                              {item.judul}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-sm">
                            {item.judul}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="max-w-md truncate text-gray-600">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="truncate cursor-help">
                              {item.keterangan}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-sm">
                            {item.keterangan}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{item.tanggalPengajuan}</TableCell>
                    <TableCell>{item.tanggalDisetujui || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${statusColors[item.status]} border-0`}
                      >
                        {statusLabels[item.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Tidak ada data pengajuan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Footer Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm">Tampil per halaman:</span>
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
                <SelectContent className="rounded">
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
                          className="rounded"
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
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
