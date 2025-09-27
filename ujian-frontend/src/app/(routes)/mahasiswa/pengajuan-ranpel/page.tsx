"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, Eye, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IconFilter2 } from "@tabler/icons-react";

// Type data rancangan
interface Rancangan {
  id: number;
  nama: string;
  judul: string;
  tanggalDiajukan: string;
  tanggalDiverifikasi?: string;
  status: "pending" | "disetujui" | "ditolak";
  masalah: string;
  solusi: string;
  hasil: string;
  kebutuhan: string;
  metode: string;
}

const dummyData: Rancangan[] = [
  {
    id: 1,
    nama: "Andi Wijaya",
    judul: "Implementasi Blockchain untuk Sistem Akademik",
    tanggalDiajukan: "2025-03-01",
    tanggalDiverifikasi: "2025-03-05",
    status: "disetujui",
    masalah: "Keamanan data akademik masih lemah.",
    solusi: "Menggunakan blockchain untuk integritas data.",
    hasil: "Sistem lebih transparan dan aman.",
    kebutuhan: "Data mahasiswa, data nilai, data kehadiran.",
    metode: "Studi literatur, prototype, pengujian sistem.",
  },
  {
    id: 2,
    nama: "Dewi Lestari",
    judul: "Aplikasi Absensi Mahasiswa Berbasis QR Code",
    tanggalDiajukan: "2025-03-02",
    status: "pending",
    masalah: "Absensi manual rawan kecurangan.",
    solusi: "Menggunakan QR Code untuk validasi kehadiran.",
    hasil: "Absensi lebih cepat dan transparan.",
    kebutuhan: "Data mahasiswa, data jadwal kuliah.",
    metode: "Studi kasus, pengembangan aplikasi, uji coba.",
  },
  {
    id: 3,
    nama: "Budi Santoso",
    judul: "Sistem Informasi Manajemen Perpustakaan Berbasis Web",
    tanggalDiajukan: "2025-03-03",
    tanggalDiverifikasi: "2025-03-07",
    status: "ditolak",
    masalah: "Pengelolaan buku masih manual dan tidak efisien.",
    solusi: "Membuat sistem informasi berbasis web.",
    hasil: "Pengelolaan perpustakaan lebih efisien.",
    kebutuhan: "Data buku, data anggota perpustakaan.",
    metode: "Analisis sistem, perancangan database, implementasi.",
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

export default function DaftarRancanganPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selected, setSelected] = useState<Rancangan | null>(null);

  const filteredData = dummyData.filter((item) => {
    const matchSearch =
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      item.nama.toLowerCase().includes(search.toLowerCase());
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
              Daftar Rancangan Penelitian
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola dan pantau rancangan penelitian Anda
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Rancangan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded">
              <DialogHeader>
                <DialogTitle>Form Rancangan Penelitian</DialogTitle>
              </DialogHeader>
              <form className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nama Mahasiswa</label>
                  <Input placeholder="Nama mahasiswa" className="mt-1 rounded" />
                </div>
                <div>
                  <label className="text-sm font-medium">Judul Penelitian</label>
                  <Input placeholder="Judul penelitian" className="mt-1 rounded" />
                </div>
                <div>
                  <label className="text-sm font-medium">Masalah & Penyebab</label>
                  <Textarea placeholder="Tuliskan masalah..." className="mt-1 rounded" />
                </div>
                <div>
                  <label className="text-sm font-medium">Alternatif Solusi</label>
                  <Textarea placeholder="Tuliskan alternatif solusi..." className="mt-1 rounded" />
                </div>
                <div>
                  <label className="text-sm font-medium">Hasil yang Diharapkan</label>
                  <Textarea placeholder="Tuliskan hasil yang diharapkan..." className="mt-1 rounded" />
                </div>
                <div>
                  <label className="text-sm font-medium">Kebutuhan Data</label>
                  <Textarea placeholder="Tuliskan kebutuhan data..." className="mt-1 rounded" />
                </div>
                <div>
                  <label className="text-sm font-medium">Metode Pelaksanaan</label>
                  <Textarea placeholder="Tuliskan metode pelaksanaan..." className="mt-1 rounded" />
                </div>
                <DialogFooter>
                  <Button className="rounded">Submit</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              className="pl-10 border-gray-200 bg-white rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              Disetujui ({dummyData.filter((i) => i.status === "disetujui").length})
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
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No</TableHead>
                <TableHead>Nama Mahasiswa</TableHead>
                <TableHead>Judul Penelitian</TableHead>
                <TableHead>Tanggal Diajukan</TableHead>
                <TableHead>Tanggal Diverifikasi</TableHead>
                <TableHead>Status</TableHead>
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
                    <TableCell>{item.nama}</TableCell>
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
                    <TableCell>{item.tanggalDiajukan}</TableCell>
                    <TableCell>{item.tanggalDiverifikasi || "-"}</TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[item.status]} border-0`}>
                        {statusLabels[item.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelected(item)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Tidak ada data rancangan
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
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>

        {/* Detail Dialog */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle>Detail Rancangan Penelitian</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Nama</label>
                      <Input value={selected.nama} readOnly className="mt-1 rounded" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <div className="mt-1">
                        <Badge className={`${statusColors[selected.status]} border-0`}>
                          {statusLabels[selected.status]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Judul</label>
                    <Textarea value={selected.judul} readOnly className="mt-1 rounded" rows={2} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Tanggal Diajukan</label>
                      <Input value={selected.tanggalDiajukan} readOnly className="mt-1 rounded" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tanggal Diverifikasi</label>
                      <Input value={selected.tanggalDiverifikasi || "-"} readOnly className="mt-1 rounded" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Masalah & Penyebab</label>
                    <Textarea value={selected.masalah} readOnly rows={3} className="mt-1 rounded" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Alternatif Solusi</label>
                    <Textarea value={selected.solusi} readOnly rows={2} className="mt-1 rounded" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Hasil yang Diharapkan</label>
                    <Textarea value={selected.hasil} readOnly rows={2} className="mt-1 rounded" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Kebutuhan Data</label>
                    <Textarea value={selected.kebutuhan} readOnly rows={2} className="mt-1 rounded" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Metode Pelaksanaan</label>
                    <Textarea value={selected.metode} readOnly rows={2} className="mt-1 rounded" />
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
