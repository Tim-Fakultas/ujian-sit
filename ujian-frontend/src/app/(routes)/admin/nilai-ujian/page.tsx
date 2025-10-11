"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Download,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  ChevronDown,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface NilaiUjian {
  id: number;
  nim: string;
  nama: string;
  judul: string;
  jenis: string;
  nilai: number;
  status: "Lulus" | "Tidak Lulus" | "Menunggu";
  tanggal: string;
  penguji: string;
  ketuaPenguji: string;
  sekretarisPenguji: string;
  penguji1: string;
  penguji2: string;
}

const dataDummy: NilaiUjian[] = [
  {
    id: 1,
    nim: "230112233",
    nama: "Andi Wijaya",
    judul: "Sistem Informasi Manajemen Perpustakaan Berbasis Web",
    jenis: "Seminar Proposal",
    nilai: 85,
    status: "Lulus",
    tanggal: "2025-03-10 09:00",
    penguji: "Dr. Budi Santoso",
    ketuaPenguji: "Dr. Budi Santoso",
    sekretarisPenguji: "Dr. Siti Aminah",
    penguji1: "Dr. Ahmad Rahman",
    penguji2: "Dr. Dewi Lestari",
  },
  {
    id: 2,
    nim: "230445566",
    nama: "Dewi Lestari",
    judul: "Aplikasi Mobile Learning untuk Pembelajaran Bahasa Inggris",
    jenis: "Seminar Skripsi",
    nilai: 58,
    status: "Tidak Lulus",
    tanggal: "2025-03-15 13:00",
    penguji: "Dr. Siti Aminah",
    ketuaPenguji: "Dr. Siti Aminah",
    sekretarisPenguji: "Dr. Budi Santoso",
    penguji1: "Dr. Andi Wijaya",
    penguji2: "Dr. Ahmad Rahman",
  },
  {
    id: 3,
    nim: "230778899",
    nama: "Ahmad Rahman",
    judul: "Implementasi Machine Learning untuk Prediksi Cuaca",
    jenis: "Seminar Hasil",
    nilai: 0,
    status: "Menunggu",
    tanggal: "2025-03-20 10:00",
    penguji: "Dr. Andi Wijaya",
    ketuaPenguji: "Dr. Andi Wijaya",
    sekretarisPenguji: "Dr. Dewi Lestari",
    penguji1: "Dr. Budi Santoso",
    penguji2: "Dr. Siti Aminah",
  },
  {
    id: 4,
    nim: "230334455",
    nama: "Sari Indah",
    judul: "Sistem Pakar Diagnosa Penyakit Tanaman Padi",
    jenis: "Seminar Proposal",
    nilai: 78,
    status: "Lulus",
    tanggal: "2025-03-12 14:00",
    penguji: "Dr. Budi Santoso",
    ketuaPenguji: "Dr. Budi Santoso",
    sekretarisPenguji: "Dr. Ahmad Rahman",
    penguji1: "Dr. Dewi Lestari",
    penguji2: "Dr. Siti Aminah",
  },
  {
    id: 5,
    nim: "230556677",
    nama: "Rizki Pratama",
    judul: "E-Commerce Platform untuk UMKM Berbasis Laravel",
    jenis: "Seminar Skripsi",
    nilai: 72,
    status: "Lulus",
    tanggal: "2025-03-18 11:00",
    penguji: "Dr. Ahmad Rahman",
    ketuaPenguji: "Dr. Ahmad Rahman",
    sekretarisPenguji: "Dr. Siti Aminah",
    penguji1: "Dr. Budi Santoso",
    penguji2: "Dr. Andi Wijaya",
  },
  {
    id: 6,
    nim: "230667788",
    nama: "Maya Sari",
    judul:
      "Analisis Sentimen Media Sosial Menggunakan Natural Language Processing",
    jenis: "Seminar Hasil",
    nilai: 82,
    status: "Lulus",
    tanggal: "2025-03-22 09:30",
    penguji: "Dr. Dewi Lestari",
    ketuaPenguji: "Dr. Dewi Lestari",
    sekretarisPenguji: "Dr. Budi Santoso",
    penguji1: "Dr. Ahmad Rahman",
    penguji2: "Dr. Siti Aminah",
  },
  {
    id: 7,
    nim: "230889900",
    nama: "Bayu Adi",
    judul: "Sistem Monitoring Kualitas Air Berbasis IoT",
    jenis: "Seminar Proposal",
    nilai: 55,
    status: "Tidak Lulus",
    tanggal: "2025-03-25 15:00",
    penguji: "Dr. Siti Aminah",
    ketuaPenguji: "Dr. Siti Aminah",
    sekretarisPenguji: "Dr. Andi Wijaya",
    penguji1: "Dr. Budi Santoso",
    penguji2: "Dr. Ahmad Rahman",
  },
  {
    id: 8,
    nim: "230990011",
    nama: "Lina Kartika",
    judul: "Aplikasi Augmented Reality untuk Edukasi Sejarah Indonesia",
    jenis: "Seminar Skripsi",
    nilai: 0,
    status: "Menunggu",
    tanggal: "2025-03-28 13:30",
    penguji: "Dr. Budi Santoso",
    ketuaPenguji: "Dr. Budi Santoso",
    sekretarisPenguji: "Dr. Dewi Lestari",
    penguji1: "Dr. Siti Aminah",
    penguji2: "Dr. Ahmad Rahman",
  },
  {
    id: 9,
    nim: "230123456",
    nama: "Doni Setiawan",
    judul: "Blockchain Technology untuk Supply Chain Management",
    jenis: "Seminar Hasil",
    nilai: 88,
    status: "Lulus",
    tanggal: "2025-03-30 10:15",
    penguji: "Dr. Ahmad Rahman",
    ketuaPenguji: "Dr. Ahmad Rahman",
    sekretarisPenguji: "Dr. Andi Wijaya",
    penguji1: "Dr. Dewi Lestari",
    penguji2: "Dr. Budi Santoso",
  },
  {
    id: 10,
    nim: "230234567",
    nama: "Fitri Amelia",
    judul: "Sistem Informasi Geografis untuk Pemetaan Daerah Rawan Bencana",
    jenis: "Seminar Proposal",
    nilai: 76,
    status: "Lulus",
    tanggal: "2025-04-02 08:00",
    penguji: "Dr. Siti Aminah",
    ketuaPenguji: "Dr. Siti Aminah",
    sekretarisPenguji: "Dr. Budi Santoso",
    penguji1: "Dr. Ahmad Rahman",
    penguji2: "Dr. Dewi Lestari",
  },
  {
    id: 11,
    nim: "230345678",
    nama: "Rudi Hermawan",
    judul: "Game Edukasi Matematika untuk Anak Sekolah Dasar",
    jenis: "Seminar Skripsi",
    nilai: 64,
    status: "Tidak Lulus",
    tanggal: "2025-04-05 14:30",
    penguji: "Dr. Andi Wijaya",
    ketuaPenguji: "Dr. Andi Wijaya",
    sekretarisPenguji: "Dr. Ahmad Rahman",
    penguji1: "Dr. Siti Aminah",
    penguji2: "Dr. Dewi Lestari",
  },
  {
    id: 12,
    nim: "230456789",
    nama: "Sinta Maharani",
    judul: "Deep Learning untuk Deteksi Kanker Payudara pada Citra Mammografi",
    jenis: "Seminar Hasil",
    nilai: 91,
    status: "Lulus",
    tanggal: "2025-04-08 11:45",
    penguji: "Dr. Dewi Lestari",
    ketuaPenguji: "Dr. Dewi Lestari",
    sekretarisPenguji: "Dr. Siti Aminah",
    penguji1: "Dr. Budi Santoso",
    penguji2: "Dr. Ahmad Rahman",
  },
  {
    id: 13,
    nim: "230567890",
    nama: "Agus Supriyanto",
    judul: "Sistem Manajemen Inventori Gudang Berbasis RFID",
    jenis: "Seminar Proposal",
    nilai: 0,
    status: "Menunggu",
    tanggal: "2025-04-10 09:00",
    penguji: "Dr. Budi Santoso",
    ketuaPenguji: "Dr. Budi Santoso",
    sekretarisPenguji: "Dr. Andi Wijaya",
    penguji1: "Dr. Dewi Lestari",
    penguji2: "Dr. Ahmad Rahman",
  },
  {
    id: 14,
    nim: "230678901",
    nama: "Nita Permata",
    judul: "Chatbot Customer Service Menggunakan Algoritma NLP",
    jenis: "Seminar Skripsi",
    nilai: 79,
    status: "Lulus",
    tanggal: "2025-04-12 15:15",
    penguji: "Dr. Ahmad Rahman",
    ketuaPenguji: "Dr. Ahmad Rahman",
    sekretarisPenguji: "Dr. Dewi Lestari",
    penguji1: "Dr. Siti Aminah",
    penguji2: "Dr. Budi Santoso",
  },
  {
    id: 15,
    nim: "230789012",
    nama: "Hendro Saputra",
    judul: "Aplikasi Virtual Reality untuk Terapi Rehabilitasi Medis",
    jenis: "Seminar Hasil",
    nilai: 52,
    status: "Tidak Lulus",
    tanggal: "2025-04-15 13:00",
    penguji: "Dr. Siti Aminah",
    ketuaPenguji: "Dr. Siti Aminah",
    sekretarisPenguji: "Dr. Budi Santoso",
    penguji1: "Dr. Andi Wijaya",
    penguji2: "Dr. Dewi Lestari",
  },
  {
    id: 16,
    nim: "230890123",
    nama: "Ratna Sari",
    judul: "Sistem Prediksi Harga Saham Menggunakan Time Series Analysis",
    jenis: "Seminar Proposal",
    nilai: 84,
    status: "Lulus",
    tanggal: "2025-04-18 10:30",
    penguji: "Dr. Andi Wijaya",
    ketuaPenguji: "Dr. Andi Wijaya",
    sekretarisPenguji: "Dr. Ahmad Rahman",
    penguji1: "Dr. Budi Santoso",
    penguji2: "Dr. Siti Aminah",
  },
  {
    id: 17,
    nim: "230901234",
    nama: "Fajar Ramadhan",
    judul: "Cloud Computing Infrastructure untuk Startup Technology",
    jenis: "Seminar Skripsi",
    nilai: 0,
    status: "Menunggu",
    tanggal: "2025-04-20 14:00",
    penguji: "Dr. Dewi Lestari",
    ketuaPenguji: "Dr. Dewi Lestari",
    sekretarisPenguji: "Dr. Siti Aminah",
    penguji1: "Dr. Ahmad Rahman",
    penguji2: "Dr. Andi Wijaya",
  },
  {
    id: 18,
    nim: "230012345",
    nama: "Eka Putri",
    judul: "Sistem Keamanan Jaringan Menggunakan Intrusion Detection System",
    jenis: "Seminar Hasil",
    nilai: 75,
    status: "Lulus",
    tanggal: "2025-04-22 11:15",
    penguji: "Dr. Budi Santoso",
    ketuaPenguji: "Dr. Budi Santoso",
    sekretarisPenguji: "Dr. Andi Wijaya",
    penguji1: "Dr. Dewi Lestari",
    penguji2: "Dr. Siti Aminah",
  },
  {
    id: 19,
    nim: "230123457",
    nama: "Yoga Pratama",
    judul: "Aplikasi Smart Home Automation Berbasis Arduino dan Android",
    jenis: "Seminar Proposal",
    nilai: 69,
    status: "Tidak Lulus",
    tanggal: "2025-04-25 12:30",
    penguji: "Dr. Ahmad Rahman",
    ketuaPenguji: "Dr. Ahmad Rahman",
    sekretarisPenguji: "Dr. Dewi Lestari",
    penguji1: "Dr. Siti Aminah",
    penguji2: "Dr. Budi Santoso",
  },
  {
    id: 20,
    nim: "230234568",
    nama: "Indira Sari",
    judul: "Data Mining untuk Analisis Perilaku Konsumen E-Commerce",
    jenis: "Seminar Skripsi",
    nilai: 87,
    status: "Lulus",
    tanggal: "2025-04-28 16:00",
    penguji: "Dr. Siti Aminah",
    ketuaPenguji: "Dr. Siti Aminah",
    sekretarisPenguji: "Dr. Budi Santoso",
    penguji1: "Dr. Andi Wijaya",
    penguji2: "Dr. Ahmad Rahman",
  },
];

export default function NilaiAdminModern() {
  const [search, setSearch] = useState("");
  const [filterJenis, setFilterJenis] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NilaiUjian | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = dataDummy.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.nim.includes(search);
    const matchJenis = filterJenis === "all" || item.jenis === filterJenis;
    const matchStatus = filterStatus === "all" || item.status === filterStatus;
    return matchSearch && matchJenis && matchStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Lulus":
        return "bg-green-500";
      case "Tidak Lulus":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  const isFiltered = filterJenis !== "all" || filterStatus !== "all";

  const resetFilters = () => {
    setFilterJenis("all");
    setFilterStatus("all");
  };

  // Pagination logic
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filtered.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  // Reset to first page when filters change
  const handleFilterChange = (type: string, value: string) => {
    setCurrentPage(1);
    if (type === "jenis") {
      setFilterJenis(value);
    } else if (type === "status") {
      setFilterStatus(value);
    }
  };

  const handleSearchChange = (value: string) => {
    setCurrentPage(1);
    setSearch(value);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Rekap Nilai Mahasiswa
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Daftar nilai hasil ujian mahasiswa berdasarkan jenis ujian.
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              {/* Filter */}
              <DropdownMenu open={showFilters} onOpenChange={setShowFilters}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Jenis Ujian
                      </label>
                      <Select
                        value={filterJenis}
                        onValueChange={(value) =>
                          handleFilterChange("jenis", value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Jenis Ujian" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Jenis</SelectItem>
                          <SelectItem value="Seminar Proposal">
                            Seminar Proposal
                          </SelectItem>
                          <SelectItem value="Seminar Hasil">
                            Seminar Hasil
                          </SelectItem>
                          <SelectItem value="Seminar Skripsi">
                            Seminar Skripsi
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Status
                      </label>
                      <Select
                        value={filterStatus}
                        onValueChange={(value) =>
                          handleFilterChange("status", value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Status</SelectItem>
                          <SelectItem value="Lulus">Lulus</SelectItem>
                          <SelectItem value="Tidak Lulus">
                            Tidak Lulus
                          </SelectItem>
                          <SelectItem value="Menunggu">Menunggu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          {/* Filter Indicator */}
          {isFiltered && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>Filter aktif:</span>
              <div className="flex items-center gap-2">
                {filterJenis !== "all" && (
                  <Badge variant="secondary" className="text-xs">
                    {filterJenis}
                  </Badge>
                )}
                {filterStatus !== "all" && (
                  <Badge variant="secondary" className="text-xs">
                    {filterStatus}
                  </Badge>
                )}
                <Button
                  onClick={resetFilters}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3 mr-1" />
                  Reset
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-16">No</TableHead>
                <TableHead>NIM</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Jenis Ujian</TableHead>
                <TableHead>Nilai</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Penguji</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-500 ">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="font-mono text-gray-600">
                      {item.nim}
                    </TableCell>
                    <TableCell className="font-medium">{item.nama}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {item.jenis}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-gray-800">
                      {item.nilai > 0 ? item.nilai : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${getStatusColor(
                            item.status
                          )}`}
                        ></span>
                        <span className="text-sm">{item.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      {item.penguji}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(item.tanggal).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => setSelectedItem(item)}
                          >
                            <Eye className="h-4 w-4" />
                            Lihat Detail
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Detail Ujian</DialogTitle>
                            <DialogDescription>
                              Informasi lengkap ujian mahasiswa
                            </DialogDescription>
                          </DialogHeader>
                          {selectedItem && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-500">
                                    NIM
                                  </label>
                                  <p className="font-mono">
                                    {selectedItem.nim}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">
                                    Nama
                                  </label>
                                  <p className="font-medium">
                                    {selectedItem.nama}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">
                                  Judul
                                </label>
                                <p className="text-sm leading-relaxed">
                                  {selectedItem.judul}
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-500">
                                    Jenis Ujian
                                  </label>
                                  <p>{selectedItem.jenis}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">
                                    Nilai
                                  </label>
                                  <p className="font-semibold">
                                    {selectedItem.nilai > 0
                                      ? selectedItem.nilai
                                      : "-"}
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-500">
                                    Status
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`h-2 w-2 rounded-full ${getStatusColor(
                                        selectedItem.status
                                      )}`}
                                    ></span>
                                    <span className="text-sm">
                                      {selectedItem.status}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">
                                    Tanggal
                                  </label>
                                  <p className="text-sm">
                                    {new Date(
                                      selectedItem.tanggal
                                    ).toLocaleDateString("id-ID", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                              </div>
                              <div className="border-t pt-4">
                                <h4 className="font-medium mb-3">
                                  Tim Penguji
                                </h4>
                                <div className="space-y-3">
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">
                                      Ketua Penguji
                                    </label>
                                    <p className="text-sm">
                                      {selectedItem.ketuaPenguji}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">
                                      Sekretaris Penguji
                                    </label>
                                    <p className="text-sm">
                                      {selectedItem.sekretarisPenguji}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">
                                      Penguji 1
                                    </label>
                                    <p className="text-sm">
                                      {selectedItem.penguji1}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">
                                      Penguji 2
                                    </label>
                                    <p className="text-sm">
                                      {selectedItem.penguji2}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-6 text-gray-500"
                  >
                    Tidak ada data nilai ditemukan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Tampilkan</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-700">
              dari {totalItems} data
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Halaman {currentPage} dari {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(pageNumber)}
                    className="h-8 w-8 p-0"
                  >
                    {pageNumber}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
