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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Plus, Filter, ChevronLeft, ChevronRight } from "lucide-react";

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
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Menunggu:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Ditolak: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  Revisi: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
};

export function TablePengajuan() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const itemsPerPage = 5;

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
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Daftar Pengajuan Skripsi</span>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Tambah Ajuan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Pengajuan Skripsi</DialogTitle>
                <DialogDescription>
                  Form untuk menambah pengajuan skripsi baru akan ditampilkan di
                  sini.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground">
                  Form pengajuan skripsi akan diimplementasikan sesuai kebutuhan
                  sistem.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Search dan Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan nama, judul, atau keterangan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Disetujui">Disetujui</SelectItem>
                <SelectItem value="Menunggu">Menunggu</SelectItem>
                <SelectItem value="Ditolak">Ditolak</SelectItem>
                <SelectItem value="Revisi">Revisi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-foreground/5">
                <TableHead>Nama Mahasiswa</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Keterangan Sekjur</TableHead>
                <TableHead>Tgl Pengajuan</TableHead>
                <TableHead>Tgl Verifikasi</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Tidak ada data yang ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.namaMahasiswa}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={item.judul}>
                        {item.judul}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={item.keteranganSekjur}>
                        {item.keteranganSekjur}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(item.tglPengajuan)}</TableCell>
                    <TableCell>{formatDate(item.tglVerifikasi)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          statusColors[item.status as keyof typeof statusColors]
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Menampilkan {startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, filteredData.length)} dari{" "}
              {filteredData.length} data
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Sebelumnya
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Selanjutnya
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
