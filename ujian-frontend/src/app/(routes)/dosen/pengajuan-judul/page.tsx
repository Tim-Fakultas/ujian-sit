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
import { Search, Eye } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconFilter2 } from "@tabler/icons-react";

// Type untuk data pengajuan mahasiswa
interface PengajuanJudul {
  id: number;
  mahasiswa: {
    nim: string;
    nama: string;
  };
  judul: string;
  identifikasi: string;
  rumusan: string;
  pokok: string;
  penelitian: string;
  deskripsi: string;
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
    identifikasi: "Banyak data akademik belum terjamin keamanannya.",
    rumusan: "Bagaimana blockchain bisa menjamin integritas data akademik?",
    pokok: "Keamanan data, efisiensi pencatatan, transparansi.",
    penelitian: "Studi A (2023) membahas blockchain di keuangan.",
    deskripsi:
      "Penelitian ini bertujuan membangun sistem akademik berbasis blockchain.",
    keterangan: "Menunggu review",
    tanggalPengajuan: "2025-01-15",
    status: "pending",
  },
  {
    id: 2,
    mahasiswa: { nim: "23067890", nama: "Siti Aminah" },
    judul: "Aplikasi Mobile untuk Monitoring Kesehatan",
    identifikasi: "Kurangnya aplikasi monitoring kesehatan real-time.",
    rumusan: "Bagaimana membuat aplikasi monitoring kesehatan berbasis IoT?",
    pokok: "Sensor IoT, notifikasi kesehatan, integrasi mobile.",
    penelitian: "Penelitian sebelumnya di bidang wearable devices.",
    deskripsi:
      "Aplikasi ini membantu pasien memonitor kesehatan secara langsung.",
    keterangan: "Judul dalam pertimbangan",
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
        <div className="bg-white rounded border overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No</TableHead>
                <TableHead>Mahasiswa</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead>Tanggal Pengajuan</TableHead>
                <TableHead>Tanggal Disetujui</TableHead>
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
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.mahasiswa.nama}</p>
                        <p className="text-xs text-gray-500">
                          {item.mahasiswa.nim}
                        </p>
                      </div>
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
                    <TableCell>{item.keterangan}</TableCell>
                    <TableCell>{item.tanggalPengajuan}</TableCell>
                    <TableCell>{item.tanggalDisetujui || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${statusColors[item.status]} border-0`}
                      >
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
                  <TableCell colSpan={8} className="text-center py-8">
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
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle>Detail Pengajuan Judul</DialogTitle>
                  <DialogDescription>
                    Informasi lengkap pengajuan judul mahasiswa.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        NIM Mahasiswa
                      </label>
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
                    <label className="text-sm font-medium">Judul</label>
                    <Textarea
                      value={selected.judul}
                      readOnly
                      rows={2}
                      className="mt-1 rounded"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Identifikasi Masalah
                    </label>
                    <Textarea
                      value={selected.identifikasi}
                      readOnly
                      rows={3}
                      className="mt-1 rounded"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Rumusan Masalah
                    </label>
                    <Textarea
                      value={selected.rumusan}
                      readOnly
                      rows={3}
                      className="mt-1 rounded"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Pokok Masalah</label>
                    <Textarea
                      value={selected.pokok}
                      readOnly
                      rows={2}
                      className="mt-1 rounded"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Penelitian Sebelumnya
                    </label>
                    <Textarea
                      value={selected.penelitian}
                      readOnly
                      rows={2}
                      className="mt-1 rounded"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Deskripsi Lengkap
                    </label>
                    <Textarea
                      value={selected.deskripsi}
                      readOnly
                      rows={3}
                      className="mt-1 rounded"
                    />
                  </div>
                </div>

                <DialogFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelected(null)}
                    className="rounded"
                  >
                    Tutup
                  </Button>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded">
                    Terima
                  </Button>
                  <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded">
                    Tolak
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
