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
import { Search, Eye, FileText } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
];

// -------------------- Komponen Utama --------------------
export default function UjianDosenPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
    const matchStatus =
      filterStatus === "all" ? true : item.status === filterStatus;
    return matchSearch && matchStatus;
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
    <div className="min-h-screen p-8" >
      {/* Judul Page */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-side-header">Daftar Ujian Saya</h1>
        <p className="text-gray-600 mt-1">
          Halaman ini menampilkan daftar ujian di mana Anda bertugas sebagai
          penguji.
        </p>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari NIM / Nama / Judul..."
              className="pl-8 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg shadow-sm border bg-white overflow-x-auto">
        <Table>
          <TableHeader className="bg-side-header ">
            <TableRow>
              <TableHead className="text-neutral-900">No</TableHead>
              <TableHead className="text-neutral-900">NIM</TableHead>
              <TableHead className="text-neutral-900">Nama</TableHead>
              <TableHead className="text-neutral-900">Waktu</TableHead>
              <TableHead className="text-neutral-900">Ruang</TableHead>
              <TableHead className="text-neutral-900">Judul</TableHead>
              <TableHead className="text-neutral-900">Ketua Penguji</TableHead>
              <TableHead className="text-neutral-900">Sekretaris</TableHead>
              <TableHead className="text-neutral-900">Penguji 1</TableHead>
              <TableHead className="text-neutral-900">Penguji 2</TableHead>
              <TableHead className="text-neutral-900">Jenis</TableHead>
              <TableHead className="text-neutral-900">Nilai</TableHead>
              <TableHead className="text-neutral-900">Status</TableHead>
              <TableHead className="text-neutral-900">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((item, idx) => (
                <TableRow key={item.id}>
                  <TableCell>{startIndex + idx + 1}</TableCell>
                  <TableCell>{item.nim}</TableCell>
                  <TableCell>{item.nama}</TableCell>
                  <TableCell>{item.waktu}</TableCell>
                  <TableCell>{item.ruang}</TableCell>

                  {/* Tooltip untuk Judul */}
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="truncate max-w-[200px] inline-block cursor-help">
                            {item.judul}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{item.judul}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>

                  <TableCell>{item.ketua}</TableCell>
                  <TableCell>{item.sekretaris}</TableCell>
                  <TableCell>{item.penguji1}</TableCell>
                  <TableCell>{item.penguji2}</TableCell>
                  <TableCell>{item.jenis}</TableCell>
                  <TableCell>{item.nilai || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        item.status === "selesai"
                          ? "bg-green-100 text-green-700"
                          : item.status === "dijadwalkan"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDetail(item)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      Detail
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPenilaian(item)}
                      className="flex items-center gap-1"
                    >
                      <FileText className="h-4 w-4" />
                      Penilaian
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={14} className="text-center text-gray-500">
                  Tidak ada data ujian
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
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
                      isActive={currentPage === page}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
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
        </div>
      )}

      {/* Dialog Detail */}
      <Dialog
        open={!!selectedDetail}
        onOpenChange={() => setSelectedDetail(null)}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedDetail && (
            <>
              <DialogHeader>
                <DialogTitle>Detail Ujian</DialogTitle>
                <DialogDescription>
                  Informasi lengkap terkait ujian mahasiswa.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">NIM</label>
                  <Input value={selectedDetail.nim} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Nama</label>
                  <Input value={selectedDetail.nama} readOnly />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Judul</label>
                  <Input value={selectedDetail.judul} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Waktu</label>
                  <Input value={selectedDetail.waktu} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Ruang</label>
                  <Input value={selectedDetail.ruang} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Ketua</label>
                  <Input value={selectedDetail.ketua} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Sekretaris</label>
                  <Input value={selectedDetail.sekretaris} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Penguji 1</label>
                  <Input value={selectedDetail.penguji1} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Penguji 2</label>
                  <Input value={selectedDetail.penguji2} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Jenis</label>
                  <Input value={selectedDetail.jenis} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Nilai</label>
                  <Input value={selectedDetail.nilai || "-"} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Input value={selectedDetail.status} readOnly />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => setSelectedDetail(null)}
                  variant="outline"
                >
                  Tutup
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
        <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
          {selectedPenilaian && (
            <>
              <DialogHeader>
                <DialogTitle>Form Penilaian Ujian</DialogTitle>
                <DialogDescription>
                  Berikan penilaian sesuai kriteria di bawah ini.
                </DialogDescription>
              </DialogHeader>

              {/* Info Mahasiswa */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium">NIM</label>
                  <Input value={selectedPenilaian.nim} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Mahasiswa</label>
                  <Input value={selectedPenilaian.nama} readOnly />
                </div>
                <div className="md:col-span-3">
                  <label className="text-sm font-medium">Judul</label>
                  <Input value={selectedPenilaian.judul} readOnly />
                </div>
              </div>

              {/* Tabel Penilaian */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kriteria</TableHead>
                    <TableHead>Indikator</TableHead>
                    <TableHead className="w-24">Bobot (%)</TableHead>
                    <TableHead className="w-24">Skor</TableHead>
                    <TableHead className="w-32">Bobot * Skor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.kriteria}</TableCell>
                      <TableCell>{row.indikator}</TableCell>
                      <TableCell>{row.bobot}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={String(row.skor)}
                          onChange={(e) =>
                            handleSkorChange(row.id, e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {((row.skor * row.bobot) / 100).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} className="font-bold text-right">
                      Skor Akhir
                    </TableCell>
                    <TableCell className="font-bold">
                      {total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSelectedPenilaian(null)}
                >
                  Batal
                </Button>
                <Button>Simpan Penilaian</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
