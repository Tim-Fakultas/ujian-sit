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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Search, Eye, FileText, MoreVertical } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { IconFilter2 } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Calculator } from "lucide-react";

interface Ujian {
  id: number;
  nim: string;
  nama: string;
  waktu: string;
  ruang: string;
  judul: string;
  ketua: string;
  sekretaris: string;
  penguji1: string;
  penguji2: string;
  jenis: string;
  nilai?: string;
  status: "pending" | "dijadwalkan" | "selesai";
}

const dummyData: Ujian[] = [
  {
    id: 1,
    nim: "230112233",
    nama: "Andi Wijaya",
    waktu: "2025-03-10 09:00",
    ruang: "Ruang A101",
    judul: "Implementasi Blockchain untuk Sistem Akademik",
    ketua: "Dr. Budi Santoso",
    sekretaris: "Dr. Siti Aminah",
    penguji1: "Dr. Andi Wijaya",
    penguji2: "Dr. Rina Kurnia",
    jenis: "Seminar Proposal",
    nilai: "-",
    status: "dijadwalkan",
  },
  {
    id: 2,
    nim: "230445566",
    nama: "Dewi Lestari",
    waktu: "2025-03-15 13:00",
    ruang: "Ruang B202",
    judul: "Aplikasi Absensi Mahasiswa Berbasis QR Code",
    ketua: "Dr. Andi Wijaya",
    sekretaris: "Dr. Siti Aminah",
    penguji1: "Dr. Budi Santoso",
    penguji2: "Dr. Rina Kurnia",
    jenis: "Seminar Skripsi",
    nilai: "A-",
    status: "selesai",
  },
];

// -------------------- Data Penilaian --------------------
interface Kriteria {
  id: number;
  kriteria: string;
  indikator: string;
  bobot: number;
  skor: number;
}

const initialKriteria: Kriteria[] = [
  {
    id: 1,
    kriteria: "Efektivitas Pendahuluan",
    indikator:
      "Ketajaman latar belakang, rumusan masalah, tujuan penelitian, kebaruan, kesesuaian tema",
    bobot: 20,
    skor: 0,
  },
  {
    id: 2,
    kriteria: "Motivasi pada Penelitian",
    indikator: "Pengembangan IPTEK, pembangunan, kelembagaan",
    bobot: 15,
    skor: 0,
  },
  {
    id: 3,
    kriteria: "Literatur Review",
    indikator: "Referensi Jurnal (70%), kedalaman tinjauan pustaka (30%)",
    bobot: 15,
    skor: 0,
  },
  {
    id: 4,
    kriteria: "Metodologi",
    indikator: "Ketepatan desain, instrumen, analisis data",
    bobot: 15,
    skor: 0,
  },
  {
    id: 5,
    kriteria: "Sikap/Presentasi",
    indikator: "Sistematika, logis, percaya diri, kemampuan menjawab",
    bobot: 35,
    skor: 0,
  },
  {
    id: 6,
    kriteria: "Sikap/Presentasi",
    indikator: "Sistematika, logis, percaya diri, kemampuan menjawab",
    bobot: 35,
    skor: 0,
  },
  {
    id: 7,
    kriteria: "Sikap/Presentasi",
    indikator: "Sistematika, logis, percaya diri, kemampuan menjawab",
    bobot: 35,
    skor: 0,
  },
  {
    id: 8,
    kriteria: "Sikap/Presentasi",
    indikator: "Sistematika, logis, percaya diri, kemampuan menjawab",
    bobot: 35,
    skor: 0,
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-gray-100 text-gray-800",
  dijadwalkan: "bg-yellow-100 text-yellow-800",
  selesai: "bg-green-100 text-green-800",
};

const statusLabels: Record<string, string> = {
  pending: "Menunggu",
  dijadwalkan: "Dijadwalkan",
  selesai: "Selesai",
};

// -------------------- Komponen Utama --------------------
export default function UjianDosenPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filterJenis, setFilterJenis] = useState<string>("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [selectedDetail, setSelectedDetail] = useState<Ujian | null>(null);
  const [selectedPenilaian, setSelectedPenilaian] = useState<Ujian | null>(
    null
  );
  const [rows, setRows] = useState(initialKriteria);

  // Filter data
  const filteredData = dummyData.filter((item) => {
    const matchSearch =
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.nim.toLowerCase().includes(search.toLowerCase());
    const matchStatus = activeTab === "all" ? true : item.status === activeTab;
    const matchJenis =
      filterJenis === "all" ? true : item.jenis === filterJenis;
    return matchSearch && matchStatus && matchJenis;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Perhitungan total nilai
  const handleSkorChange = (id: number, value: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, skor: value === "" ? 0 : Number(value) } : row
      )
    );
  };
  const total = rows.reduce(
    (acc, row) => acc + (row.skor * row.bobot) / 100,
    0
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold ">Jadwal Ujian</h1>
          <p className=" mt-1">
            Halaman ini menampilkan jadwal ujian di mana Anda bertugas sebagai
            penguji
          </p>
        </div>

        {/* Search and Filters */}
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
          <Select value={filterJenis} onValueChange={setFilterJenis}>
            <SelectTrigger className="w-42 bg-white rounded">
              <IconFilter2 className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter jenis ujian" />
            </SelectTrigger>
            <SelectContent className="rounded">
              <SelectItem value="all">Semua Jenis</SelectItem>
              <SelectItem value="Seminar Proposal">Seminar Proposal</SelectItem>
              <SelectItem value="Seminar Skripsi">Seminar Skripsi</SelectItem>
              <SelectItem value="Ujian Komprehensif">
                Ujian Komprehensif
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded border ${
                activeTab === "all"
                  ? "bg-blue-100 border-blue-300 text-blue-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Semua ({dummyData.length})
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-3 py-1.5 rounded border ${
                activeTab === "pending"
                  ? "bg-blue-100 border-blue-300 text-blue-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Menunggu ({dummyData.filter((i) => i.status === "pending").length}
              )
            </button>
            <button
              onClick={() => setActiveTab("dijadwalkan")}
              className={`px-3 py-1.5 rounded border ${
                activeTab === "dijadwalkan"
                  ? "bg-blue-100 border-blue-300 text-blue-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Dijadwalkan (
              {dummyData.filter((i) => i.status === "dijadwalkan").length})
            </button>
            <button
              onClick={() => setActiveTab("selesai")}
              className={`px-3 py-1.5 rounded border ${
                activeTab === "selesai"
                  ? "bg-blue-100 border-blue-300 text-blue-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Selesai ({dummyData.filter((i) => i.status === "selesai").length})
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-16">No</TableHead>
                <TableHead className="min-w-40">Nama Mahasiswa</TableHead>
                <TableHead className="min-w-24">Ruang</TableHead>
                <TableHead className="min-w-90">Judul</TableHead>
                <TableHead className="min-w-32">Jenis Ujian</TableHead>
                <TableHead className="min-w-24">Status</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length > 0 ? (
                currentData.map((item, idx) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">
                      {startIndex + idx + 1}
                    </TableCell>
                    <TableCell className="font-medium">{item.nama}</TableCell>
                    <TableCell className="text-sm">{item.ruang}</TableCell>

                    {/* Tooltip untuk Judul */}
                    <TableCell className="max-w-md">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="block truncate cursor-help text-gray-700 hover:text-gray-900">
                              {item.judul}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-sm">
                            {item.judul}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {item.jenis}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${
                          statusColors[item.status]
                        } border-0 text-xs`}
                      >
                        {statusLabels[item.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-blue-100"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={() => setSelectedDetail(item)}
                            className="cursor-pointer"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSelectedPenilaian(item)}
                            className="cursor-pointer"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Buka Penilaian
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Tidak ada data ujian
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
        <Dialog
          open={!!selectedDetail}
          onOpenChange={() => setSelectedDetail(null)}
        >
          <DialogContent className="sm:max-w-2xl rounded-lg max-h-[90vh] overflow-y-auto">
            {selectedDetail && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Detail Ujian
                  </DialogTitle>
                  <DialogDescription>
                    Informasi lengkap terkait ujian mahasiswa.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Informasi Mahasiswa */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-medium text-blue-900">
                        Informasi Mahasiswa
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            NIM
                          </Label>
                          <div className="mt-1 px-3 py-2 bg-gray-50 rounded-md border text-sm font-mono">
                            {selectedDetail.nim}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Nama Mahasiswa
                          </Label>
                          <div className="mt-1 px-3 py-2 bg-gray-50 rounded-md border text-sm font-medium">
                            {selectedDetail.nama}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Judul Penelitian
                        </Label>
                        <div className="mt-1 px-3 py-2 bg-gray-50 rounded-md border text-sm leading-relaxed">
                          {selectedDetail.judul}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Informasi Jadwal */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-medium text-green-900">
                        Jadwal Ujian
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Waktu
                          </Label>
                          <div className="mt-1 px-3 py-2 bg-gray-50 rounded-md border text-sm">
                            {new Date(selectedDetail.waktu).toLocaleDateString(
                              "id-ID",
                              {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Ruang
                          </Label>
                          <div className="mt-1 px-3 py-2 bg-gray-50 rounded-md border text-sm font-medium">
                            {selectedDetail.ruang}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Jenis Ujian
                          </Label>
                          <div className="mt-1">
                            <Badge variant="outline" className="px-3 py-1">
                              {selectedDetail.jenis}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Status
                          </Label>
                          <div className="mt-1">
                            <Badge
                              className={`${
                                statusColors[selectedDetail.status]
                              } border-0 px-3 py-1`}
                            >
                              {statusLabels[selectedDetail.status]}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tim Penguji */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-medium text-purple-900">
                        Tim Penguji
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm font-medium text-blue-900">
                            Ketua Penguji
                          </span>
                          <span className="text-sm text-blue-700">
                            {selectedDetail.ketua}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium text-green-900">
                            Sekretaris
                          </span>
                          <span className="text-sm text-green-700">
                            {selectedDetail.sekretaris}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <span className="text-sm font-medium text-orange-900">
                            Penguji 1
                          </span>
                          <span className="text-sm text-orange-700">
                            {selectedDetail.penguji1}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <span className="text-sm font-medium text-red-900">
                            Penguji 2
                          </span>
                          <span className="text-sm text-red-700">
                            {selectedDetail.penguji2}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Hasil Penilaian */}
                  {selectedDetail.nilai && selectedDetail.nilai !== "-" && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-medium text-green-900">
                          Hasil Penilaian
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-700 mb-1">
                            {selectedDetail.nilai}
                          </div>
                          <div className="text-sm text-green-600">
                            Nilai Akhir
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    onClick={() => setSelectedDetail(null)}
                    variant="outline"
                    className="px-6"
                  >
                    Tutup
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedDetail(null);
                      setSelectedPenilaian(selectedDetail);
                    }}
                    className="px-6 bg-blue-600 hover:bg-blue-700"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Buka Penilaian
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog Penilaian */}
        <Dialog
          open={!!selectedPenilaian}
          onOpenChange={() => setSelectedPenilaian(null)}
        >
          <DialogContent className="sm:max-w-7xl max-h-[95vh] overflow-y-auto rounded-lg">
            {selectedPenilaian && (
              <>
                <DialogHeader className="pb-4">
                  <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Form Penilaian Ujian
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Berikan penilaian sesuai kriteria yang telah ditentukan.
                    Semua kriteria harus diisi.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Info Mahasiswa Card */}
                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-medium text-blue-900">
                        Informasi Mahasiswa
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            NIM
                          </Label>
                          <div className="mt-1 px-3 py-2 bg-white rounded-md border border-gray-200 text-sm font-mono">
                            {selectedPenilaian.nim}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">
                            Nama Mahasiswa
                          </Label>
                          <div className="mt-1 px-3 py-2 bg-white rounded-md border border-gray-200 text-sm">
                            {selectedPenilaian.nama}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Judul Penelitian
                        </Label>
                        <div className="mt-1 px-3 py-2 bg-white rounded-md border border-gray-200 text-sm leading-relaxed">
                          {selectedPenilaian.judul}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Form Penilaian */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        Kriteria Penilaian
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {rows.map((row, index) => (
                          <div
                            key={row.id}
                            className="border rounded-lg p-4 bg-gray-50/50"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <div className="flex-1 space-y-3">
                                <div>
                                  <h4 className="font-medium text-gray-900 mb-1">
                                    {row.kriteria}
                                  </h4>
                                  <p className="text-sm text-gray-600 leading-relaxed">
                                    {row.indikator}
                                  </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">
                                      Bobot
                                    </Label>
                                    <div className="mt-1 px-3 py-2 bg-white rounded-md border border-gray-200 text-sm font-semibold text-center">
                                      {row.bobot}%
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">
                                      Skor (0-100){" "}
                                      <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                      type="number"
                                      min={0}
                                      max={100}
                                      value={String(row.skor)}
                                      onChange={(e) =>
                                        handleSkorChange(row.id, e.target.value)
                                      }
                                      className="mt-1 text-center font-medium"
                                      placeholder="0"
                                    />
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">
                                      Nilai Akhir
                                    </Label>
                                    <div
                                      className={`mt-1 px-3 py-2 rounded-md border text-sm font-bold text-center ${
                                        row.skor > 0
                                          ? "bg-green-50 border-green-200 text-green-700"
                                          : "bg-gray-50 border-gray-200 text-gray-500"
                                      }`}
                                    >
                                      {((row.skor * row.bobot) / 100).toFixed(
                                        2
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Summary Card */}
                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-900">
                            Total Skor Akhir
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-green-700">
                          {total.toFixed(2)}
                        </div>
                      </div>

                      <Separator className="my-4 bg-green-200" />

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-medium text-gray-600">Grade</div>
                          <div className="text-lg font-bold text-gray-900">
                            {total >= 80
                              ? "A"
                              : total >= 70
                              ? "B"
                              : total >= 60
                              ? "C"
                              : total >= 50
                              ? "D"
                              : "E"}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-gray-600">
                            Status
                          </div>
                          <div
                            className={`text-lg font-bold ${
                              total >= 60 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {total >= 60 ? "Lulus" : "Tidak Lulus"}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-gray-600">
                            Kriteria Dinilai
                          </div>
                          <div className="text-lg font-bold text-gray-900">
                            {rows.filter((r) => r.skor > 0).length}/
                            {rows.length}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-gray-600">
                            Progress
                          </div>
                          <div className="text-lg font-bold text-blue-600">
                            {Math.round(
                              (rows.filter((r) => r.skor > 0).length /
                                rows.length) *
                                100
                            )}
                            %
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Validation Alert */}
                  {rows.some((r) => r.skor === 0) && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                      <p className="text-sm text-amber-700">
                        Masih ada {rows.filter((r) => r.skor === 0).length}{" "}
                        kriteria yang belum dinilai. Pastikan semua kriteria
                        sudah diisi sebelum menyimpan.
                      </p>
                    </div>
                  )}
                </div>

                <DialogFooter className="pt-6 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedPenilaian(null)}
                    className="px-6"
                  >
                    Batal
                  </Button>
                  <Button
                    disabled={rows.some((r) => r.skor === 0)}
                    className="px-6 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Simpan Penilaian
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
