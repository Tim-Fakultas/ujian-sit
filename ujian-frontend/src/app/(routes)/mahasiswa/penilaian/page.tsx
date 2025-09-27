"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
import { Button } from "@/components/ui/button";
import { Search, Eye } from "lucide-react";

// Type data penilaian
interface Penilaian {
  id: number;
  nim: string;
  nama: string;
  tanggal: string;
  judul: string;
  ketua: { nama: string; nilai: number };
  sekretaris: { nama: string; nilai: number };
  penguji1: { nama: string; nilai: number };
  penguji2: { nama: string; nilai: number };
  total: number;
  rata: number;
  huruf: string;
}

const dummyData: Penilaian[] = [
  {
    id: 1,
    nim: "230112233",
    nama: "Andi Wijaya",
    tanggal: "Senin, 10 Maret 2025",
    judul: "Implementasi Blockchain untuk Sistem Akademik",
    ketua: { nama: "Dr. Budi Santoso", nilai: 85 },
    sekretaris: { nama: "Dr. Siti Aminah", nilai: 80 },
    penguji1: { nama: "Dr. Andi Wijaya", nilai: 82 },
    penguji2: { nama: "Dr. Rina Kurnia", nilai: 84 },
    total: 331,
    rata: 82.75,
    huruf: "A",
  },
  {
    id: 2,
    nim: "230445566",
    nama: "Dewi Lestari",
    tanggal: "Rabu, 12 Maret 2025",
    judul: "Aplikasi Absensi Mahasiswa Berbasis QR Code",
    ketua: { nama: "Dr. Siti Aminah", nilai: 75 },
    sekretaris: { nama: "Dr. Budi Santoso", nilai: 72 },
    penguji1: { nama: "Dr. Rina Kurnia", nilai: 74 },
    penguji2: { nama: "Dr. Andi Wijaya", nilai: 70 },
    total: 291,
    rata: 72.75,
    huruf: "B",
  },
];

export default function PenilaianPage() {
  const [search, setSearch] = useState("");
  const [filterNilai, setFilterNilai] = useState("all");
  const [selected, setSelected] = useState<Penilaian | null>(null);

  const filteredData = dummyData.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.nim.toLowerCase().includes(search.toLowerCase()) ||
      item.judul.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filterNilai === "all" ? true : item.huruf === filterNilai;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen p-8 bg-[#f2f2fd]">
      {/* Judul & Deskripsi */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-site-header">Penilaian Ujian</h1>
        <p className="text-gray-600 mt-1">
          Halaman ini menampilkan penilaian hasil ujian seminar / skripsi kamu.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari NIM / Nama / Judul..."
            className="pl-8 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select onValueChange={setFilterNilai} defaultValue="all">
          <SelectTrigger className="w-[150px] bg-white">
            <SelectValue placeholder="Filter nilai" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="A">A</SelectItem>
            <SelectItem value="B">B</SelectItem>
            <SelectItem value="C">C</SelectItem>
            <SelectItem value="D">D</SelectItem>
            <SelectItem value="E">E</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table Penilaian */}
      <div className="rounded-lg shadow-sm border bg-white overflow-x-auto mb-6">
        <Table>
          <TableHeader className="bg-site-header text-white">
            <TableRow>
              <TableHead className="text-white">No</TableHead>
              <TableHead className="text-white">NIM</TableHead>
              <TableHead className="text-white">Nama</TableHead>
              <TableHead className="text-white">Hari/Tanggal</TableHead>
              <TableHead className="text-white">Judul</TableHead>
              <TableHead className="text-white">Total</TableHead>
              <TableHead className="text-white">Rata-rata</TableHead>
              <TableHead className="text-white">Huruf</TableHead>
              <TableHead className="text-white">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, idx) => (
              <TableRow key={item.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{item.nim}</TableCell>
                <TableCell>{item.nama}</TableCell>
                <TableCell>{item.tanggal}</TableCell>
                <TableCell>{item.judul}</TableCell>
                <TableCell>{item.total}</TableCell>
                <TableCell>{item.rata.toFixed(2)}</TableCell>
                <TableCell className="font-bold">{item.huruf}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => setSelected(item)}
                  >
                    <Eye className="h-4 w-4" /> Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-gray-500">
                  Tidak ada data penilaian
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog Detail */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Formulir Rekapitulasi Nilai</DialogTitle>
                <DialogDescription>
                  Detail penilaian ujian seminar / skripsi.
                </DialogDescription>
              </DialogHeader>

              {/* Identitas */}
              <div className="mb-4 space-y-1 text-sm">
                <p>
                  <b>Hari/Tanggal:</b> {selected.tanggal}
                </p>
                <p>
                  <b>Nama/NIM:</b> {selected.nama} / {selected.nim}
                </p>
                <p>
                  <b>Judul Proposal:</b> {selected.judul}
                </p>
              </div>

              {/* Tabel Rekap */}
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader className="bg-site-header text-white">
                    <TableRow>
                      <TableHead className="text-white">No</TableHead>
                      <TableHead className="text-white">Nama</TableHead>
                      <TableHead className="text-white">Jabatan</TableHead>
                      <TableHead className="text-white">Angka Nilai</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>1</TableCell>
                      <TableCell>{selected.ketua.nama}</TableCell>
                      <TableCell>Ketua Penguji</TableCell>
                      <TableCell>{selected.ketua.nilai}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2</TableCell>
                      <TableCell>{selected.sekretaris.nama}</TableCell>
                      <TableCell>Sekretaris Penguji</TableCell>
                      <TableCell>{selected.sekretaris.nilai}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>3</TableCell>
                      <TableCell>{selected.penguji1.nama}</TableCell>
                      <TableCell>Penguji I</TableCell>
                      <TableCell>{selected.penguji1.nilai}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>4</TableCell>
                      <TableCell>{selected.penguji2.nama}</TableCell>
                      <TableCell>Penguji II</TableCell>
                      <TableCell>{selected.penguji2.nilai}</TableCell>
                    </TableRow>
                    <TableRow className="font-semibold bg-gray-50">
                      <TableCell colSpan={3} className="text-right">
                        Total Angka Nilai
                      </TableCell>
                      <TableCell>{selected.total}</TableCell>
                    </TableRow>
                    <TableRow className="font-semibold bg-gray-50">
                      <TableCell colSpan={3} className="text-right">
                        Nilai Rata-rata
                      </TableCell>
                      <TableCell>{selected.rata.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow className="font-semibold bg-gray-100">
                      <TableCell colSpan={3} className="text-right">
                        Nilai Huruf
                      </TableCell>
                      <TableCell>{selected.huruf}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Tutup
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
