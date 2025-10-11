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
  FileText,
  Filter,
  CalendarDays,
  X,
  CheckCircle,
  XCircle,
  Award,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const dataBeritaUjian = [
  {
    id: 1,
    nama: "Muhammad Luqman Al-Fauzan",
    nim: "20220001",
    jenis: "Seminar Skripsi",
    judul: "Analisis Sistem Informasi Akademik UIN Raden Fatah",
    tanggal: "2025-10-08",
    hari: "Selasa",
    waktuMulai: "2025-10-08T09:00",
    waktuAkhir: "2025-10-08T10:00",
    ruang: "Lab SI 1",
    ketua: "Dr. Ahmad Fauzi",
    sekretaris: "Dr. Siti Rahma",
    penguji1: "Dr. Hendra Setiawan",
    penguji2: "Dr. Intan Melati",
    statusKelulusan: "lulus",
    nilai: 88,
    grade: "A-",
    catatan: "Presentasi sangat baik, metodologi penelitian tepat",
  },
  {
    id: 2,
    nama: "Dewi Kartika",
    nim: "20220002",
    jenis: "Seminar Hasil",
    judul: "Penerapan IoT pada Green Campus",
    tanggal: "2025-10-07",
    hari: "Senin",
    waktuMulai: "2025-10-07T10:00",
    waktuAkhir: "2025-10-07T12:00",
    ruang: "Ruang Seminar A",
    ketua: "Dr. Yusuf Maulana",
    sekretaris: "Dr. Lisa Andini",
    penguji1: "Dr. Toni Saputra",
    penguji2: "Dr. Nurul Fadilah",
    statusKelulusan: "lulus",
    nilai: 92,
    grade: "A",
    catatan: "Penelitian inovatif dengan implementasi yang sangat baik",
  },
  {
    id: 3,
    nama: "Andi Pratama",
    nim: "20220003",
    jenis: "Seminar Proposal",
    judul: "Implementasi Machine Learning untuk Prediksi Cuaca",
    tanggal: "2025-10-06",
    hari: "Minggu",
    waktuMulai: "2025-10-06T08:00",
    waktuAkhir: "2025-10-06T09:00",
    ruang: "Lab SI 2",
    ketua: "Dr. Rahman Saputra",
    sekretaris: "Dr. Maya Sari",
    penguji1: "Dr. Budi Santoso",
    penguji2: "Dr. Rina Wati",
    statusKelulusan: "tidak lulus",
    nilai: 65,
    grade: "C+",
    catatan: "Perlu perbaikan pada metodologi dan landasan teori",
  },
  {
    id: 4,
    nama: "Siti Nurhaliza",
    nim: "20220004",
    jenis: "Seminar Skripsi",
    judul: "Sistem Manajemen Perpustakaan Digital",
    tanggal: "2025-10-05",
    hari: "Sabtu",
    waktuMulai: "2025-10-05T13:00",
    waktuAkhir: "2025-10-05T14:00",
    ruang: "Ruang Seminar B",
    ketua: "Dr. Hartono Wijaya",
    sekretaris: "Dr. Indira Sari",
    penguji1: "Dr. Agus Gunawan",
    penguji2: "Dr. Fitri Handayani",
    statusKelulusan: "lulus",
    nilai: 85,
    grade: "B+",
    catatan: "Sistem sudah berjalan baik, dokumentasi lengkap",
  },
  {
    id: 5,
    nama: "Reza Firmansyah",
    nim: "20220005",
    jenis: "Seminar Hasil",
    judul: "Analisis Big Data untuk E-Commerce",
    tanggal: "2025-10-04",
    hari: "Jumat",
    waktuMulai: "2025-10-04T09:00",
    waktuAkhir: "2025-10-04T10:00",
    ruang: "Lab Data Mining",
    ketua: "Dr. Surya Putra",
    sekretaris: "Dr. Wulan Dari",
    penguji1: "Dr. Hadi Pranoto",
    penguji2: "Dr. Lilis Suryani",
    statusKelulusan: "lulus",
    nilai: 90,
    grade: "A-",
    catatan: "Analisis data sangat mendalam dan hasil implementasi memuaskan",
  },
  {
    id: 6,
    nama: "Nur Aini Safitri",
    nim: "20220006",
    jenis: "Seminar Proposal",
    judul: "Aplikasi Mobile Monitoring Kesehatan",
    tanggal: "2025-10-03",
    hari: "Kamis",
    waktuMulai: "2025-10-03T10:00",
    waktuAkhir: "2025-10-03T11:00",
    ruang: "Lab Mobile",
    ketua: "Dr. Bambang Riyadi",
    sekretaris: "Dr. Ani Kusuma",
    penguji1: "Dr. Joko Susilo",
    penguji2: "Dr. Ratna Dewi",
    statusKelulusan: "tidak lulus",
    nilai: 68,
    grade: "C+",
    catatan:
      "Konsep baik namun perlu pendalaman pada aspek teknis implementasi",
  },
  {
    id: 7,
    nama: "Fadhil Rahman",
    nim: "20220007",
    jenis: "Seminar Skripsi",
    judul: "Sistem Keamanan Jaringan dengan AI",
    tanggal: "2025-10-02",
    hari: "Rabu",
    waktuMulai: "2025-10-02T14:00",
    waktuAkhir: "2025-10-02T15:00",
    ruang: "Lab Jaringan",
    ketua: "Dr. Eko Prasetyo",
    sekretaris: "Dr. Dini Anggraini",
    penguji1: "Dr. Rudi Hermawan",
    penguji2: "Dr. Sari Indah",
    statusKelulusan: "lulus",
    nilai: 95,
    grade: "A",
    catatan: "Penelitian sangat inovatif dengan tingkat keamanan tinggi",
  },
];

const statusKelulusanColors: Record<string, string> = {
  lulus: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "tidak lulus": "bg-red-50 text-red-700 border-red-200",
};

const gradeColors: Record<string, string> = {
  A: "bg-green-100 text-green-800 border-green-300",
  "A-": "bg-green-50 text-green-700 border-green-200",
  "B+": "bg-blue-100 text-blue-800 border-blue-300",
  B: "bg-blue-50 text-blue-700 border-blue-200",
  "B-": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "C+": "bg-orange-100 text-orange-800 border-orange-300",
  C: "bg-red-100 text-red-800 border-red-300",
};

export default function BeritaUjianPage() {
  const [search, setSearch] = useState("");
  const [selectedJenis, setSelectedJenis] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  // Get unique exam types for filter options
  const jenisUjianOptions = useMemo(() => {
    const uniqueJenis = [...new Set(dataBeritaUjian.map((item) => item.jenis))];
    return uniqueJenis;
  }, []);

  const filteredData = useMemo(() => {
    return dataBeritaUjian.filter((item) => {
      const matchesSearch =
        item.nama.toLowerCase().includes(search.toLowerCase()) ||
        item.nim.toLowerCase().includes(search.toLowerCase()) ||
        item.judul.toLowerCase().includes(search.toLowerCase()) ||
        item.hari.toLowerCase().includes(search.toLowerCase()) ||
        item.ruang.toLowerCase().includes(search.toLowerCase());

      const matchesJenis =
        selectedJenis === "all" || item.jenis === selectedJenis;

      const matchesStatus =
        selectedStatus === "all" || item.statusKelulusan === selectedStatus;

      const matchesDate = selectedDate === "" || item.tanggal === selectedDate;

      return matchesSearch && matchesJenis && matchesStatus && matchesDate;
    });
  }, [search, selectedJenis, selectedStatus, selectedDate]);

  const clearDateFilter = () => {
    setSelectedDate("");
  };

  // Calculate statistics
  const totalUjian = dataBeritaUjian.length;
  const lulusCount = dataBeritaUjian.filter(
    (item) => item.statusKelulusan === "lulus"
  ).length;
  const tidakLulusCount = dataBeritaUjian.filter(
    (item) => item.statusKelulusan === "tidak lulus"
  ).length;
  const rataRataNilai =
    dataBeritaUjian.reduce((sum, item) => sum + item.nilai, 0) / totalUjian;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <FileText className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Berita Acara Ujian
              </h1>
              <p className="text-slate-600 mt-1">
                Laporan hasil ujian mahasiswa yang telah selesai dilaksanakan
                dengan status kelulusan dan nilai
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Ujian</p>
                  <p className="text-2xl font-bold">{totalUjian}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Lulus</p>
                  <p className="text-2xl font-bold">{lulusCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Tidak Lulus</p>
                  <p className="text-2xl font-bold">{tidakLulusCount}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Rata-rata Nilai</p>
                  <p className="text-2xl font-bold">
                    {rataRataNilai.toFixed(1)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col gap-4">
            {/* First Row - Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Cari mahasiswa, NIM, atau judul..."
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
                <Award className="h-5 w-5 text-slate-400" />
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full sm:w-[180px] h-11 border-slate-300">
                    <SelectValue placeholder="Status Kelulusan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="lulus">Lulus</SelectItem>
                    <SelectItem value="tidak lulus">Tidak Lulus</SelectItem>
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

              {selectedStatus !== "all" && (
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                  <span className="text-green-700 font-medium text-sm">
                    Status: {selectedStatus}
                  </span>
                  <button
                    onClick={() => setSelectedStatus("all")}
                    className="text-green-500 hover:text-green-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {selectedDate && (
                <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  <span className="text-purple-700 font-medium text-sm">
                    Tanggal: {selectedDate}
                  </span>
                  <button
                    onClick={clearDateFilter}
                    className="text-purple-500 hover:text-purple-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {(selectedJenis !== "all" ||
                selectedStatus !== "all" ||
                selectedDate) && (
                <button
                  onClick={() => {
                    setSelectedJenis("all");
                    setSelectedStatus("all");
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
                  <TableHead className="w-[200px] font-semibold text-slate-700">
                    Jadwal & Lokasi
                  </TableHead>
                  <TableHead className="w-[160px] font-semibold text-slate-700">
                    Tim Penguji
                  </TableHead>
                  <TableHead className="w-[120px] text-center font-semibold text-slate-700">
                    Nilai & Grade
                  </TableHead>
                  <TableHead className="w-[120px] text-center font-semibold text-slate-700">
                    Status
                  </TableHead>
                  <TableHead className="w-[200px] font-semibold text-slate-700">
                    Catatan
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
                          <div
                            className="text-xs text-slate-400 max-w-[180px] truncate"
                            title={item.judul}
                          >
                            {item.judul}
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
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600">{item.ruang}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-xs">
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
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-slate-900">
                            {item.nilai}
                          </div>
                          <Badge
                            className={`font-bold ${
                              gradeColors[item.grade] ||
                              "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {item.grade}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={`capitalize font-medium px-3 py-1 ${
                            statusKelulusanColors[item.statusKelulusan]
                          }`}
                        >
                          {item.statusKelulusan === "lulus" ? (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Lulus
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <XCircle className="h-3 w-3" />
                              Tidak Lulus
                            </div>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-slate-600 max-w-[180px]">
                          {item.catatan}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-12 text-slate-500"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Search className="h-12 w-12 text-slate-300" />
                        <div>
                          <p className="font-medium">
                            Tidak ada data berita ujian
                          </p>
                          <p className="text-sm">
                            Coba ubah kata kunci pencarian atau filter
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
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-sm text-emerald-700 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Tabel ini menampilkan berita acara ujian yang telah selesai
            dilaksanakan dengan informasi kelulusan, nilai, dan catatan dari tim
            penguji.
          </p>
        </div>
      </div>
    </div>
  );
}
