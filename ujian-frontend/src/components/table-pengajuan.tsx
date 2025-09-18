"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

// Mock data untuk demonstrasi
const mockData = [
  {
    id: 1,
    namaMahasiswa: "Ahmad Rizki Pratama",
    judul: "Implementasi Machine Learning untuk Prediksi Cuaca",
    keteranganSekjur: "Disetujui dengan revisi minor",
    tglPengajuan: "2024-01-15",
    tglVerifikasi: "2024-01-20",
    status: "Disetujui",
  },
  {
    id: 2,
    namaMahasiswa: "Siti Nurhaliza",
    judul: "Sistem Informasi Manajemen Perpustakaan Berbasis Web",
    keteranganSekjur: "Perlu perbaikan metodologi",
    tglPengajuan: "2024-01-18",
    tglVerifikasi: null,
    status: "Menunggu",
  },
  {
    id: 3,
    namaMahasiswa: "Budi Santoso",
    judul: "Analisis Keamanan Jaringan dengan Penetration Testing",
    keteranganSekjur: "Ditolak - topik terlalu luas",
    tglPengajuan: "2024-01-12",
    tglVerifikasi: "2024-01-17",
    status: "Ditolak",
  },
  {
    id: 4,
    namaMahasiswa: "Maya Sari Dewi",
    judul: "Pengembangan Aplikasi Mobile untuk E-Commerce",
    keteranganSekjur: "Disetujui tanpa revisi",
    tglPengajuan: "2024-01-22",
    tglVerifikasi: "2024-01-25",
    status: "Disetujui",
  },
  {
    id: 5,
    namaMahasiswa: "Andi Wijaya",
    judul: "Implementasi Blockchain untuk Supply Chain Management",
    keteranganSekjur: "Menunggu review dari pembimbing",
    tglPengajuan: "2024-01-25",
    tglVerifikasi: null,
    status: "Menunggu",
  },
  {
    id: 6,
    namaMahasiswa: "Rina Kartika",
    judul: "Sistem Pakar Diagnosa Penyakit Tanaman",
    keteranganSekjur: "Perlu tambahan referensi",
    tglPengajuan: "2024-01-20",
    tglVerifikasi: null,
    status: "Revisi",
  },
  {
    id: 7,
    namaMahasiswa: "Dedi Kurniawan",
    judul: "Optimasi Database dengan Teknik Indexing",
    keteranganSekjur: "Disetujui dengan catatan",
    tglPengajuan: "2024-01-10",
    tglVerifikasi: "2024-01-15",
    status: "Disetujui",
  },
  {
    id: 8,
    namaMahasiswa: "Lina Marlina",
    judul: "Pengembangan Chatbot Customer Service dengan NLP",
    keteranganSekjur: "Menunggu persetujuan kaprodi",
    tglPengajuan: "2024-01-28",
    tglVerifikasi: null,
    status: "Menunggu",
  },
];

type SkripsiData = (typeof mockData)[0];

const statusColors = {
  Disetujui:
    "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-800",
  Menunggu:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
  Ditolak:
    "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-800",
  Revisi:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800",
};

export function TablePengajuan() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<SkripsiData | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const itemsPerPage = 5;

  const mahasiswa = {
    nama: "Ahmad Rizki Pratama",
    semester: 5, // Ganti dengan semester aktual mahasiswa
  };

  // Logika untuk cek apakah mahasiswa bisa mengajukan
  const canSubmitProposal = mahasiswa.semester >= 5;

  // Filter dan search logic
  const filteredData = useMemo(() => {
    return mockData.filter((item) => {
      const matchesSearch =
        item.namaMahasiswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.keteranganSekjur.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const openDetailDialog = (item: SkripsiData) => {
    setSelectedItem(item);
    setIsDetailDialogOpen(true);
  };

  const hasActiveFilters = searchTerm !== "" || statusFilter !== "all";

  return (
    <TooltipProvider>
      <Card className="w-full border-0">
        <CardHeader className="pb-4">
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Data Pengajuan Judul</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Kelola pengajuan judul skripsi mahasiswa
              </p>
            </div>

            {/* Tombol Tambah Pengajuan dengan kondisi disable */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Link href={canSubmitProposal ? "/mahasiswa/pengajuan" : "#"}>
                    <Button
                      className="gap-2 min-w-fit bg-[#476EAE] hover:bg-[#476EAE]/80 text-white"
                      disabled={!canSubmitProposal}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Tambah Pengajuan</span>
                      <span className="sm:hidden">Tambah</span>
                    </Button>
                  </Link>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {canSubmitProposal
                    ? "Tambah pengajuan judul baru"
                    : `Pengajuan judul hanya tersedia mulai semester 5. Semester saat ini: ${mahasiswa.semester}`}
                </p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search dan Filter */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama, judul, atau keterangan..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                  onClick={clearSearch}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[160px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="Disetujui">Disetujui</SelectItem>
                  <SelectItem value="Menunggu">Menunggu</SelectItem>
                  <SelectItem value="Ditolak">Ditolak</SelectItem>
                  <SelectItem value="Revisi">Revisi</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="px-3"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Hapus semua filter</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Status summary */}
          {hasActiveFilters && (
            <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
              Menampilkan {filteredData.length} dari {mockData.length} data
              {searchTerm && ` untuk "${searchTerm}"`}
              {statusFilter !== "all" && ` dengan status "${statusFilter}"`}
            </div>
          )}

          {/* Table */}
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold w-[60px] text-center">
                      No
                    </TableHead>
                    <TableHead className="font-semibold">Judul</TableHead>
                    <TableHead className="font-semibold">Keterangan</TableHead>
                    <TableHead className="font-semibold">
                      Tanggal Pengajuan
                    </TableHead>
                    <TableHead className="font-semibold">
                      Tanggal Verifikasi
                    </TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold w-[80px]">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-12 text-muted-foreground"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Search className="h-8 w-8 opacity-50" />
                          <p className="font-medium">
                            Tidak ada data yang ditemukan
                          </p>
                          <p className="text-sm">
                            {hasActiveFilters
                              ? "Coba ubah kriteria pencarian atau filter"
                              : "Belum ada pengajuan yang tersedia"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((item, index) => (
                      <TableRow
                        key={item.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="text-center font-medium">
                          {startIndex + index + 1}
                        </TableCell>
                        <TableCell className="max-w-[250px]">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="truncate cursor-help">
                                {item.judul}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="max-w-[300px]"
                            >
                              <p>{item.judul}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="truncate cursor-help">
                                {item.keteranganSekjur}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="max-w-[300px]"
                            >
                              <p>{item.keteranganSekjur}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(item.tglPengajuan)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(item.tglVerifikasi)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              statusColors[
                                item.status as keyof typeof statusColors
                              ]
                            }
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => openDetailDialog(item)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Lihat detail</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-sm text-muted-foreground order-2 sm:order-1">
                Menampilkan {startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, filteredData.length)} dari{" "}
                {filteredData.length} data
              </div>

              <div className="flex items-center gap-2 order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  <span className="hidden sm:inline">Selanjutnya</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        {/* Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-semibold">
                  Detail Pengajuan
                </DialogTitle>
                {selectedItem && (
                  <Badge
                    variant="outline"
                    className={
                      statusColors[
                        selectedItem.status as keyof typeof statusColors
                      ]
                    }
                  >
                    {selectedItem.status}
                  </Badge>
                )}
              </div>
              <DialogDescription className="text-sm text-muted-foreground">
                ID: #{selectedItem?.id.toString().padStart(4, "0")}
              </DialogDescription>
            </DialogHeader>

            {selectedItem && (
              <div className="space-y-6 pt-4">
                {/* Mahasiswa */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Mahasiswa
                  </h4>
                  <p className="text-base font-medium">
                    {selectedItem.namaMahasiswa}
                  </p>
                </div>

                {/* Judul */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Judul Skripsi
                  </h4>
                  <div className="p-3 bg-muted/30 rounded-md border">
                    <p className="text-sm leading-relaxed">
                      {selectedItem.judul}
                    </p>
                  </div>
                </div>

                {/* Keterangan */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Keterangan
                  </h4>
                  <div className="p-3 bg-muted/30 rounded-md border">
                    <p className="text-sm leading-relaxed">
                      {selectedItem.keteranganSekjur}
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Tanggal Pengajuan
                    </h4>
                    <p className="text-sm">
                      {formatDate(selectedItem.tglPengajuan)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Tanggal Verifikasi
                    </h4>
                    <p className="text-sm">
                      {selectedItem.tglVerifikasi
                        ? formatDate(selectedItem.tglVerifikasi)
                        : "Belum diverifikasi"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDetailDialogOpen(false)}
                  >
                    Tutup
                  </Button>
                  <Button size="sm" onClick={() => window.print()}>
                    Cetak
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </Card>
    </TooltipProvider>
  );
}
