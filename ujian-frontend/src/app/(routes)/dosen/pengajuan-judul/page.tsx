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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Eye, MoreVertical } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Type untuk data pengajuan mahasiswa
interface PengajuanJudul {
  id: number;
  mahasiswa: {
    nim: string;
    nama: string;
  };
  judul: string;
  keterangan: string;
  tanggalPengajuan: string;
  tanggalDisetujui?: string;
  status: "pending" | "disetujui" | "ditolak";
}

const dummyData: PengajuanJudul[] = [
  {
    id: 1,
    mahasiswa: { nim: "23012345", nama: "Budi Santoso" },
    judul: "Implementasi Blockchain untuk Sistem Akademik",
    keterangan:
      "Penelitian ini bertujuan membangun sistem akademik berbasis blockchain untuk menjamin keamanan dan integritas data akademik.",
    tanggalPengajuan: "2025-01-15",
    status: "pending",
  },
  {
    id: 2,
    mahasiswa: { nim: "23067890", nama: "Siti Aminah" },
    judul: "Aplikasi Mobile untuk Monitoring Kesehatan",
    keterangan:
      "Aplikasi ini membantu pasien memonitor kesehatan secara real-time menggunakan teknologi IoT dan notifikasi mobile.",
    tanggalPengajuan: "2025-02-02",
    tanggalDisetujui: "2025-02-10",
    status: "disetujui",
  },
];

export default function PengajuanJudulDosenPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selected, setSelected] = useState<PengajuanJudul | null>(null);

  const filteredData = dummyData.filter((item) => {
    const matchSearch =
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      item.mahasiswa.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.mahasiswa.nim.toLowerCase().includes(search.toLowerCase());
    const matchStatus = activeTab === "all" ? true : item.status === activeTab;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    disetujui: "bg-green-100 text-green-700",
    ditolak: "bg-red-100 text-red-700",
  };

  const statusLabels = {
    pending: "Menunggu",
    disetujui: "Disetujui",
    ditolak: "Ditolak",
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Pengajuan Judul Mahasiswa
          </h1>
          <p className="text-gray-600 mt-1">
            Halaman ini menampilkan seluruh judul skripsi yang diajukan
            mahasiswa.
          </p>
        </div>

        {/* Pencarian */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari mahasiswa / judul..."
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
              Menunggu ({dummyData.filter((i) => i.status === "pending").length}
              )
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

        {/* Tabel */}
        <div className="bg-white rounded border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-16">No</TableHead>
                <TableHead className="w-1/4">Mahasiswa</TableHead>
                <TableHead className="w-2/5">Judul</TableHead>
                <TableHead className="w-32">Tanggal Pengajuan</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="w-20">Action</TableHead>
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
                        <p className="font-medium">{item.mahasiswa.nama}</p>
                        <p className="text-xs text-gray-500">
                          {item.mahasiswa.nim}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="line-clamp-2 cursor-help">
                              {item.judul}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-sm">
                            {item.judul}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{item.tanggalPengajuan}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${statusColors[item.status]} border-0`}
                      >
                        {statusLabels[item.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-md">
                          <DropdownMenuItem
                            onClick={() => setSelected(item)}
                            className="cursor-pointer"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          {item.status === "pending" && (
                            <>
                              <DropdownMenuItem className="cursor-pointer text-green-600">
                                Terima
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer text-red-600">
                                Tolak
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Tidak ada data pengajuan judul
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
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>

        {/* Dialog Detail */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto rounded-lg">
            {selected && (
              <>
                <DialogHeader className="space-y-2 pb-4 border-b">
                  <DialogTitle className="text-xl font-semibold">
                    Preview Pengajuan Judul
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Preview dokumen pengajuan judul skripsi mahasiswa.
                  </DialogDescription>
                </DialogHeader>

                {/* PDF-like content */}
                <div className="bg-white p-8 space-y-6 text-sm leading-relaxed">
                  {/* Header */}
                  <div className="text-center space-y-2 border-b pb-6">
                    <h1 className="text-lg font-bold uppercase">
                      FORMULIR PENGAJUAN JUDUL SKRIPSI
                    </h1>
                    <p className="text-gray-600">
                      Program Studi Teknik Informatika
                    </p>
                  </div>

                  {/* Student Info */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex">
                        <span className="w-32 font-medium">NIM</span>
                        <span className="mr-2">:</span>
                        <span>{selected.mahasiswa.nim}</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 font-medium">Nama Mahasiswa</span>
                        <span className="mr-2">:</span>
                        <span>{selected.mahasiswa.nama}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex">
                        <span className="w-32 font-medium">
                          Tanggal Pengajuan
                        </span>
                        <span className="mr-2">:</span>
                        <span>{selected.tanggalPengajuan}</span>
                      </div>
                      <div className="flex">
                        <span className="w-32 font-medium">Status</span>
                        <span className="mr-2">:</span>
                        <Badge
                          className={`${
                            statusColors[selected.status]
                          } border-0`}
                        >
                          {statusLabels[selected.status]}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-base mb-3 border-l-4 border-blue-500 pl-3">
                        Judul Skripsi
                      </h3>
                      <div className="bg-gray-50 p-4 rounded border-l-4 border-gray-300">
                        <p className="text-justify leading-relaxed">
                          {selected.judul}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-base mb-3 border-l-4 border-blue-500 pl-3">
                        Keterangan
                      </h3>
                      <div className="bg-gray-50 p-4 rounded border-l-4 border-gray-300">
                        <p className="text-justify leading-relaxed">
                          {selected.keterangan}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-6 border-t mt-8">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-center mb-16">Mahasiswa,</p>
                        <div className="text-center border-t border-black pt-2">
                          <p className="font-medium">
                            {selected.mahasiswa.nama}
                          </p>
                          <p className="text-sm text-gray-600">
                            NIM: {selected.mahasiswa.nim}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-center mb-16">Dosen Pembimbing,</p>
                        <div className="text-center border-t border-black pt-2">
                          <p className="font-medium">___________________</p>
                          <p className="text-sm text-gray-600">
                            NIP: ___________________
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="flex justify-between pt-6 border-t bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
                  <Button
                    variant="outline"
                    onClick={() => setSelected(null)}
                    className="rounded-md"
                  >
                    Tutup
                  </Button>
                  {selected.status === "pending" && (
                    <div className="flex gap-2">
                      <Button className="bg-red-500 hover:bg-red-600 text-white rounded-md">
                        Tolak
                      </Button>
                      <Button className="bg-green-500 hover:bg-green-600 text-white rounded-md">
                        Terima
                      </Button>
                    </div>
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
