"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  MoreHorizontal,
  FileText,
  Search,
  Filter,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  CalendarDays,
  MapPin,
  User,
} from "lucide-react";

// === Dummy Data ===
const dataRuangan = [
  { id: 1, nama: "Lab SI 1" },
  { id: 2, nama: "Lab SI 2" },
  { id: 3, nama: "Ruang Seminar A" },
];

const dataDosen = [
  "Dr. Hendra Setiawan",
  "Dr. Intan Melati",
  "Dr. Toni Saputra",
  "Dr. Nurul Fadilah",
];

const dataAwal = [
  {
    id: 1,
    nama: "Muhammad Luqman Al-Fauzan",
    judul: "Analisis Sistem Informasi Akademik UIN Raden Fatah",
    jenis: "Skripsi",
    tanggalPengajuan: "2025-10-02",
    status: "menunggu",
    pembimbing1: "Dr. Ahmad Fauzi",
    pembimbing2: "Dr. Siti Rahma",
    ruang: "",
    waktuMulai: "",
    waktuAkhir: "",
    hari: "",
    penguji1: "",
    penguji2: "",
  },
  {
    id: 2,
    nama: "Dewi Kartika",
    judul: "Penerapan IoT pada Green Campus",
    jenis: "Seminar Hasil",
    tanggalPengajuan: "2025-09-29",
    status: "dijadwalkan",
    pembimbing1: "Dr. Yusuf Maulana",
    pembimbing2: "Dr. Lisa Andini",
    ruang: "Lab SI 1",
    waktuMulai: "2024-12-20T09:00",
    waktuAkhir: "2024-12-20T11:00",
    hari: "Jumat",
    penguji1: "Dr. Hendra Setiawan",
    penguji2: "Dr. Toni Saputra",
  },
  {
    id: 3,
    nama: "Ahmad Rizki",
    judul: "Machine Learning untuk Prediksi Akademik",
    jenis: "Skripsi",
    tanggalPengajuan: "2025-09-25",
    status: "selesai",
    pembimbing1: "Dr. Intan Melati",
    pembimbing2: "Dr. Nurul Fadilah",
    ruang: "Ruang Seminar A",
    waktuMulai: "2024-12-15T13:00",
    waktuAkhir: "2024-12-15T14:00",
    hari: "Minggu",
    penguji1: "Dr. Hendra Setiawan",
    penguji2: "Dr. Yusuf Maulana",
  },
];

// Enhanced status styles
const statusConfig: Record<
  string,
  { label: string; className: string; icon: any }
> = {
  menunggu: {
    label: "Menunggu",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: AlertCircle,
  },
  dijadwalkan: {
    label: "Dijadwalkan",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Calendar,
  },
  "sedang berlangsung": {
    label: "Sedang Berlangsung",
    className: "bg-green-50 text-green-700 border-green-200",
    icon: Clock,
  },
  selesai: {
    label: "Selesai",
    className: "bg-gray-50 text-gray-700 border-gray-200",
    icon: CheckCircle,
  },
};

export default function JadwalSekprodiPage() {
  const [data, setData] = useState(dataAwal);
  const [filteredData, setFilteredData] = useState(dataAwal);
  const [selected, setSelected] = useState<any | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jadwal, setJadwal] = useState({
    ruangan: "",
    waktuMulai: "",
    waktuAkhir: "",
    hari: "",
    tanggal: "",
    penguji1: "",
    penguji2: "",
  });

  // Statistics calculation
  const statistics = {
    total: data.length,
    menunggu: data.filter((d) => d.status === "menunggu").length,
    dijadwalkan: data.filter((d) => d.status === "dijadwalkan").length,
    selesai: data.filter((d) => d.status === "selesai").length,
  };

  // Filter and search functionality
  useEffect(() => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.judul.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    setFilteredData(filtered);
  }, [data, searchTerm, statusFilter]);

  // === Hitung waktu otomatis ===
  const hitungDurasi = (startTime: string, jenis: string) => {
    if (!startTime) return "";
    const start = new Date(startTime);
    const end = new Date(startTime);
    const durasi = jenis.toLowerCase().includes("hasil") ? 2 : 1;
    end.setHours(start.getHours() + durasi);
    const hariList = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    return {
      waktuAkhir: end.toISOString().slice(0, 16),
      hari: hariList[start.getDay()],
      tanggal: start.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
  };

  const handleWaktuMulai = (value: string) => {
    if (!selected) return;
    const result = hitungDurasi(value, selected.jenis);
    setJadwal({
      ...jadwal,
      waktuMulai: value,
      waktuAkhir: result.waktuAkhir,
      hari: result.hari,
      tanggal: result.tanggal,
    });
  };

  const handleSave = () => {
    const updated = data.map((mhs) =>
      mhs.id === selected.id
        ? {
            ...mhs,
            ruang: jadwal.ruangan,
            waktuMulai: jadwal.waktuMulai,
            waktuAkhir: jadwal.waktuAkhir,
            hari: jadwal.hari,
            penguji1: jadwal.penguji1,
            penguji2: jadwal.penguji2,
            status: "dijadwalkan",
          }
        : mhs
    );
    setData(updated);
    setIsScheduleOpen(false);
    setJadwal({
      ruangan: "",
      waktuMulai: "",
      waktuAkhir: "",
      hari: "",
      tanggal: "",
      penguji1: "",
      penguji2: "",
    });
  };

  // === Update Status Otomatis ===
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) =>
        prev.map((m) => {
          if (!m.waktuMulai || !m.waktuAkhir) return m;
          const now = new Date();
          const start = new Date(m.waktuMulai);
          const end = new Date(m.waktuAkhir);

          let status = m.status;
          if (now >= start && now <= end) status = "sedang berlangsung";
          else if (now > end) status = "selesai";

          return { ...m, status };
        })
      );
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <di v>
              <h1 className="text-3xl font-bold text-gray-900">
                Penjadwalan Ujian
              </h1>
              <p className="text-gray-600 mt-2">
                Kelola dan pantau jadwal ujian mahasiswa secara terpusat
              </p>
            </di>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm font-medium">
                {filteredData.length} dari {data.length} ujian
              </Badge>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">
                    Total Ujian
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {statistics.total}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-sm font-medium">Menunggu</p>
                  <p className="text-2xl font-bold text-amber-900">
                    {statistics.menunggu}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 text-sm font-medium">
                    Dijadwalkan
                  </p>
                  <p className="text-2xl font-bold text-emerald-900">
                    {statistics.dijadwalkan}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Selesai</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistics.selesai}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari nama mahasiswa atau judul..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 h-4 w-4" />
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                  className="w-48"
                >
                  <SelectTrigger className="border-gray-200">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="menunggu">Menunggu</SelectItem>
                    <SelectItem value="dijadwalkan">Dijadwalkan</SelectItem>
                    <SelectItem value="sedang berlangsung">
                      Sedang Berlangsung
                    </SelectItem>
                    <SelectItem value="selesai">Selesai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="border-b border-gray-200">
                  <TableHead className="text-center w-[60px] font-semibold">
                    No
                  </TableHead>
                  <TableHead className="font-semibold">Mahasiswa</TableHead>
                  <TableHead className="font-semibold">Jenis</TableHead>
                  <TableHead className="font-semibold max-w-[250px]">
                    Judul
                  </TableHead>
                  <TableHead className="font-semibold">
                    Tanggal Pengajuan
                  </TableHead>
                  <TableHead className="font-semibold">Jadwal</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-center w-[80px] font-semibold">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((m, i) => {
                  const StatusIcon =
                    statusConfig[m.status]?.icon || AlertCircle;
                  return (
                    <TableRow
                      key={m.id}
                      className="hover:bg-gray-50/50 border-b border-gray-100"
                    >
                      <TableCell className="text-center text-gray-500 font-medium">
                        {i + 1}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-900">
                            {m.nama}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-xs font-medium"
                        >
                          {m.jenis}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[250px]">
                        <p
                          className="font-medium text-gray-900 truncate"
                          title={m.judul}
                        >
                          {m.judul}
                        </p>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {m.tanggalPengajuan}
                      </TableCell>
                      <TableCell>
                        {m.waktuMulai ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <CalendarDays className="h-3 w-3 text-gray-400" />
                              <span>{m.hari}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span>{m.waktuMulai?.replace("T", " ")}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span>{m.ruang}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Belum dijadwalkan
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            statusConfig[m.status]?.className
                          } border px-2 py-1 text-xs font-medium`}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[m.status]?.label || m.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                            >
                              <MoreHorizontal className="h-4 w-4 text-gray-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuItem
                              onClick={() => setSelected(m)}
                              className="cursor-pointer"
                            >
                              <FileText className="mr-2 h-4 w-4 text-gray-600" />
                              Lihat Detail
                            </DropdownMenuItem>
                            {m.status === "menunggu" && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelected(m);
                                  setIsScheduleOpen(true);
                                }}
                                className="cursor-pointer"
                              >
                                <Calendar className="mr-2 h-4 w-4 text-blue-600" />
                                Jadwalkan Ujian
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* === Dialog Detail === */}
        <Dialog
          open={!!selected && !isScheduleOpen}
          onOpenChange={() => setSelected(null)}
        >
          <DialogContent className="sm:max-w-3xl max-h-[80vh] flex flex-col">
            {selected && (
              <>
                <DialogHeader className="pb-4 flex-shrink-0">
                  <DialogTitle className="text-xl font-bold text-gray-900">
                    Detail Ujian Mahasiswa
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Informasi lengkap mengenai ujian yang dijadwalkan
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 overflow-y-auto flex-1 pr-2">
                  {/* Student Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Nama Mahasiswa
                        </label>
                        <p className="mt-1 text-gray-900 font-medium">
                          {selected.nama}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700">
                          Jenis Ujian
                        </label>
                        <p className="mt-1">
                          <Badge variant="outline" className="font-medium">
                            {selected.jenis}
                          </Badge>
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="text-sm font-semibold text-gray-700">
                        Judul Skripsi
                      </label>
                      <p className="mt-1 text-gray-900">{selected.judul}</p>
                    </div>
                  </div>

                  {/* Examiners */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border border-blue-200 bg-blue-50/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-blue-700">
                          Tim Pembimbing
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <p className="text-xs text-blue-600 font-medium">
                            Ketua Penguji
                          </p>
                          <p className="text-sm text-gray-900">
                            {selected.pembimbing1}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-blue-600 font-medium">
                            Sekretaris Penguji
                          </p>
                          <p className="text-sm text-gray-900">
                            {selected.pembimbing2}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-green-200 bg-green-50/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-green-700">
                          Tim Penguji
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <p className="text-xs text-green-600 font-medium">
                            Penguji 1
                          </p>
                          <p className="text-sm text-gray-900">
                            {selected.penguji1 || "Belum ditentukan"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-green-600 font-medium">
                            Penguji 2
                          </p>
                          <p className="text-sm text-gray-900">
                            {selected.penguji2 || "Belum ditentukan"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Schedule Info */}
                  <Card className="border border-gray-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Informasi Jadwal
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Ruangan
                          </p>
                          <p className="text-sm text-gray-900">
                            {selected.ruang || "Belum ditentukan"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Hari
                          </p>
                          <p className="text-sm text-gray-900">
                            {selected.hari || "Belum ditentukan"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Waktu Mulai
                          </p>
                          <p className="text-sm text-gray-900">
                            {selected.waktuMulai?.replace("T", " ") ||
                              "Belum ditentukan"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Waktu Selesai
                          </p>
                          <p className="text-sm text-gray-900">
                            {selected.waktuAkhir?.replace("T", " ") ||
                              "Belum ditentukan"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Status Ujian
                          </p>
                          <Badge
                            className={`mt-1 ${
                              statusConfig[selected.status]?.className
                            } border`}
                          >
                            {React.createElement(
                              statusConfig[selected.status]?.icon ||
                                AlertCircle,
                              { className: "h-3 w-3 mr-1" }
                            )}
                            {statusConfig[selected.status]?.label ||
                              selected.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 font-medium">
                            Tanggal Pengajuan
                          </p>
                          <p className="text-sm text-gray-900">
                            {selected.tanggalPengajuan}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <DialogFooter className="pt-4 flex-shrink-0">
                  <Button variant="outline" onClick={() => setSelected(null)}>
                    Tutup
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* === Dialog Jadwalkan Ujian === */}
        <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Jadwalkan Ujian
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Tentukan ruangan, waktu, dan penguji untuk ujian mahasiswa
              </DialogDescription>
            </DialogHeader>

            {selected && (
              <div className="space-y-6">
                {/* Student info banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900">
                    {selected.nama}
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">{selected.jenis}</p>
                </div>

                <div className="space-y-4">
                  {/* Ruangan */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pilih Ruangan
                    </label>
                    <Select
                      value={jadwal.ruangan}
                      onValueChange={(v) =>
                        setJadwal({ ...jadwal, ruangan: v })
                      }
                    >
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Pilih ruangan ujian" />
                      </SelectTrigger>
                      <SelectContent>
                        {dataRuangan.map((r) => (
                          <SelectItem key={r.id} value={r.nama}>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              {r.nama}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Waktu Mulai */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Waktu Mulai Ujian
                    </label>
                    <Input
                      type="datetime-local"
                      value={jadwal.waktuMulai}
                      onChange={(e) => handleWaktuMulai(e.target.value)}
                      className="border-gray-300"
                    />
                    {jadwal.waktuAkhir && (
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700">
                          <strong>Jadwal:</strong> {jadwal.hari},{" "}
                          {jadwal.tanggal}
                        </p>
                        <p className="text-sm text-green-700">
                          <strong>Selesai:</strong>{" "}
                          {jadwal.waktuAkhir.replace("T", " ")}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Penguji */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tim Penguji Tambahan
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Select
                        value={jadwal.penguji1}
                        onValueChange={(v) =>
                          setJadwal({ ...jadwal, penguji1: v })
                        }
                      >
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="Penguji 1" />
                        </SelectTrigger>
                        <SelectContent>
                          {dataDosen.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={jadwal.penguji2}
                        onValueChange={(v) =>
                          setJadwal({ ...jadwal, penguji2: v })
                        }
                      >
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="Penguji 2" />
                        </SelectTrigger>
                        <SelectContent>
                          {dataDosen.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Existing examiners info */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-600 mb-2">
                      Tim Pembimbing (Otomatis):
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Ketua:</span>{" "}
                        {selected.pembimbing1}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Sekretaris:</span>{" "}
                        {selected.pembimbing2}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsScheduleOpen(false);
                  setJadwal({
                    ruangan: "",
                    waktuMulai: "",
                    waktuAkhir: "",
                    hari: "",
                    tanggal: "",
                    penguji1: "",
                    penguji2: "",
                  });
                }}
              >
                Batal
              </Button>
              <Button
                onClick={handleSave}
                disabled={
                  !jadwal.ruangan ||
                  !jadwal.waktuMulai ||
                  !jadwal.penguji1 ||
                  !jadwal.penguji2
                }
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Simpan Jadwal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
