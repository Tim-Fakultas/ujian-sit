"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  Filter,
  CalendarDays,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const dataUjian = [
  {
    id: 1,
    nama: "Muhammad Luqman Al-Fauzan",
    nim: "20220001",
    jenis: "Seminar Skripsi",
    judul: "Analisis Sistem Informasi Akademik UIN Raden Fatah",
    tanggal: "2025-10-12",
    hari: "Senin",
    waktuMulai: "2025-10-12T09:00",
    waktuAkhir: "2025-10-12T10:00",
    ruang: "Lab SI 1",
    ketua: "Dr. Ahmad Fauzi",
    sekretaris: "Dr. Siti Rahma",
    penguji1: "Dr. Hendra Setiawan",
    penguji2: "Dr. Intan Melati",
    status: "dijadwalkan",
  },
  {
    id: 2,
    nama: "Dewi Kartika",
    nim: "20220002",
    jenis: "Seminar Hasil",
    judul: "Penerapan IoT pada Green Campus",
    tanggal: "2025-10-13",
    hari: "Selasa",
    waktuMulai: "2025-10-13T10:00",
    waktuAkhir: "2025-10-13T12:00",
    ruang: "Ruang Seminar A",
    ketua: "Dr. Yusuf Maulana",
    sekretaris: "Dr. Lisa Andini",
    penguji1: "Dr. Toni Saputra",
    penguji2: "Dr. Nurul Fadilah",
    status: "selesai",
  },
  {
    id: 3,
    nama: "Andi Pratama",
    nim: "20220003",
    jenis: "Seminar Proposal",
    judul: "Implementasi Machine Learning untuk Prediksi Cuaca",
    tanggal: "2025-10-14",
    hari: "Rabu",
    waktuMulai: "2025-10-14T08:00",
    waktuAkhir: "2025-10-14T09:00",
    ruang: "Lab SI 2",
    ketua: "Dr. Rahman Saputra",
    sekretaris: "Dr. Maya Sari",
    penguji1: "Dr. Budi Santoso",
    penguji2: "Dr. Rina Wati",
    status: "dijadwalkan",
  },
  {
    id: 4,
    nama: "Siti Nurhaliza",
    nim: "20220004",
    jenis: "Seminar Skripsi",
    judul: "Sistem Manajemen Perpustakaan Digital",
    tanggal: "2025-10-15",
    hari: "Kamis",
    waktuMulai: "2025-10-15T13:00",
    waktuAkhir: "2025-10-15T14:00",
    ruang: "Ruang Seminar B",
    ketua: "Dr. Hartono Wijaya",
    sekretaris: "Dr. Indira Sari",
    penguji1: "Dr. Agus Gunawan",
    penguji2: "Dr. Fitri Handayani",
    status: "selesai",
  },
  {
    id: 5,
    nama: "Reza Firmansyah",
    nim: "20220005",
    jenis: "Seminar Proposal",
    judul: "Analisis Big Data untuk E-Commerce",
    tanggal: "2025-10-16",
    hari: "Jumat",
    waktuMulai: "2025-10-16T09:00",
    waktuAkhir: "2025-10-16T10:00",
    ruang: "Lab Data Mining",
    ketua: "Dr. Surya Putra",
    sekretaris: "Dr. Wulan Dari",
    penguji1: "Dr. Hadi Pranoto",
    penguji2: "Dr. Lilis Suryani",
    status: "menunggu",
  },
  {
    id: 6,
    nama: "Nur Aini Safitri",
    nim: "20220006",
    jenis: "Seminar Hasil",
    judul: "Aplikasi Mobile Monitoring Kesehatan",
    tanggal: "2025-10-17",
    hari: "Sabtu",
    waktuMulai: "2025-10-17T10:00",
    waktuAkhir: "2025-10-17T11:00",
    ruang: "Lab Mobile",
    ketua: "Dr. Bambang Riyadi",
    sekretaris: "Dr. Ani Kusuma",
    penguji1: "Dr. Joko Susilo",
    penguji2: "Dr. Ratna Dewi",
    status: "sedang berlangsung",
  },
];

const statusColors: Record<string, string> = {
  menunggu: "bg-amber-50 text-amber-700 border-amber-200",
  dijadwalkan: "bg-blue-50 text-blue-700 border-blue-200",
  "sedang berlangsung": "bg-purple-50 text-purple-700 border-purple-200",
  selesai: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function BeritaAcaraPage() {
  const [search, setSearch] = useState("");
  const [selectedJenis, setSelectedJenis] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  // Get unique exam types for filter options
  const jenisUjianOptions = useMemo(() => {
    const uniqueJenis = [...new Set(dataUjian.map((item) => item.jenis))];
    return uniqueJenis;
  }, []);

  const filteredData = useMemo(() => {
    return dataUjian.filter((item) => {
      const matchesSearch =
        item.nama.toLowerCase().includes(search.toLowerCase()) ||
        item.nim.toLowerCase().includes(search.toLowerCase()) ||
        item.judul.toLowerCase().includes(search.toLowerCase()) ||
        item.hari.toLowerCase().includes(search.toLowerCase()) ||
        item.ruang.toLowerCase().includes(search.toLowerCase());

      const matchesJenis =
        selectedJenis === "all" || item.jenis === selectedJenis;

      const matchesDate = selectedDate === "" || item.tanggal === selectedDate;

      return matchesSearch && matchesJenis && matchesDate;
    });
  }, [search, selectedJenis, selectedDate]);

  const clearDateFilter = () => {
    setSelectedDate("");
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Berita Acara Ujian
              </h1>
              <p className="text-slate-600 mt-1">
                Kelola dan pantau jadwal ujian mahasiswa dengan informasi
                lengkap penguji
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Ujian</p>
                  <p className="text-2xl font-bold">{dataUjian.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Selesai</p>
                  <p className="text-2xl font-bold">
                    {
                      dataUjian.filter((item) => item.status === "selesai")
                        .length
                    }
                  </p>
                </div>
                <Users className="h-8 w-8 text-emerald-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm">Dijadwalkan</p>
                  <p className="text-2xl font-bold">
                    {
                      dataUjian.filter((item) => item.status === "dijadwalkan")
                        .length
                    }
                  </p>
                </div>
                <Clock className="h-8 w-8 text-amber-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Berlangsung</p>
                  <p className="text-2xl font-bold">
                    {
                      dataUjian.filter(
                        (item) => item.status === "sedang berlangsung"
                      ).length
                    }
                  </p>
                </div>
                <MapPin className="h-8 w-8 text-purple-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col gap-4">
            {/* First Row - Search and Type Filter */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Cari mahasiswa, NIM, hari, atau ruangan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="h-5 w-5 text-slate-400" />
                <Select value={selectedJenis} onValueChange={setSelectedJenis}>
                  <SelectTrigger className="w-full sm:w-[180px] h-11 border-slate-300">
                    <SelectValue placeholder="Jenis Ujian" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jenis</SelectItem>
                    {jenisUjianOptions.map((jenis) => (
                      <SelectItem key={jenis} value={jenis}>
                        {jenis}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <CalendarDays className="h-5 w-5 text-slate-400" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-[180px] h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {selectedDate && (
                  <button
                    onClick={clearDateFilter}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                    title="Clear date filter"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Second Row - Status Legend and Active Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Status:</span>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded-full"></div>
                    <span>Dijadwalkan</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-emerald-100 border border-emerald-200 rounded-full"></div>
                    <span>Selesai</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded-full"></div>
                    <span>Berlangsung</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-amber-100 border border-amber-200 rounded-full"></div>
                    <span>Menunggu</span>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                {selectedJenis !== "all" && (
                  <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    <span className="text-blue-700 font-medium text-sm">
                      Jenis: {selectedJenis}
                    </span>
                    <button
                      onClick={() => setSelectedJenis("all")}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {selectedDate && (
                  <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    <span className="text-green-700 font-medium text-sm">
                      Tanggal: {selectedDate}
                    </span>
                    <button
                      onClick={clearDateFilter}
                      className="text-green-500 hover:text-green-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {(selectedJenis !== "all" || selectedDate) && (
                  <button
                    onClick={() => {
                      setSelectedJenis("all");
                      setSelectedDate("");
                    }}
                    className="text-slate-500 hover:text-slate-700 text-sm underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-200">
                  <TableHead className="w-[60px] text-center font-semibold text-slate-700">
                    No
                  </TableHead>
                  <TableHead className="w-[200px] font-semibold text-slate-700">
                    Mahasiswa
                  </TableHead>
                  <TableHead className="w-[120px] font-semibold text-slate-700">
                    Jenis Ujian
                  </TableHead>
                  <TableHead className="w-[220px] font-semibold text-slate-700">
                    Jadwal
                  </TableHead>
                  <TableHead className="w-[120px] font-semibold text-slate-700">
                    Ruangan
                  </TableHead>
                  <TableHead className="w-[160px] font-semibold text-slate-700">
                    Tim Penguji
                  </TableHead>
                  <TableHead className="w-[100px] text-center font-semibold text-slate-700">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, i) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-slate-50/50 transition-colors border-b border-slate-100"
                    >
                      <TableCell className="text-center font-medium text-slate-600">
                        {i + 1}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-900">
                            {item.nama}
                          </div>
                          <div className="text-sm text-slate-500">
                            NIM: {item.nim}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-slate-50 text-slate-700 border-slate-300"
                        >
                          {item.jenis}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-700">
                              {item.hari}, {item.tanggal}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600">
                              {item.waktuMulai.replace("T", " ").slice(11, 16)}–
                              {item.waktuAkhir.replace("T", " ").slice(11, 16)}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-700">{item.ruang}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="text-slate-700">
                            <span className="font-medium">Ketua:</span>{" "}
                            {item.ketua}
                          </div>
                          <div className="text-slate-600">
                            <span className="font-medium">Sekretaris:</span>{" "}
                            {item.sekretaris}
                          </div>
                          <div className="text-slate-600">
                            <span className="font-medium">Penguji:</span>{" "}
                            {item.penguji1}, {item.penguji2}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={`capitalize font-medium px-3 py-1 ${
                            statusColors[item.status]
                          }`}
                        >
                          {item.status.replace("-", " ")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-12 text-slate-500"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Search className="h-12 w-12 text-slate-300" />
                        <div>
                          <p className="font-medium">Tidak ada data ujian</p>
                          <p className="text-sm">
                            Coba ubah kata kunci pencarian
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Tabel ini menampilkan semua jadwal ujian aktif dan selesai dengan
            informasi lengkap penguji dan waktu pelaksanaan.
          </p>
        </div>
      </div>
    </div>
  );
}
