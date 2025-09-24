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
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { Search, Eye } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// Type data pengajuan
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
    mahasiswa: { nim: "230112233", nama: "Andi Wijaya" },
    judul: "Sistem Rekomendasi Skripsi dengan Machine Learning",
    identifikasi: "Mahasiswa kesulitan menentukan judul skripsi.",
    rumusan: "Bagaimana machine learning dapat membantu rekomendasi judul skripsi?",
    pokok: "Rekomendasi, machine learning, text mining.",
    penelitian: "Penelitian A (2023) menggunakan algoritma content-based filtering.",
    deskripsi: "Penelitian ini membuat sistem rekomendasi judul skripsi berbasis ML.",
    keterangan: "Sudah ACC Dosen PA",
    tanggalPengajuan: "2025-01-18",
    tanggalDisetujui: "2025-02-01",
    status: "disetujui",
  },
  {
    id: 2,
    mahasiswa: { nim: "230445566", nama: "Dewi Lestari" },
    judul: "Aplikasi Web Absensi Mahasiswa Berbasis QR Code",
    identifikasi: "Absensi manual sering terjadi kecurangan.",
    rumusan: "Bagaimana QR Code bisa meningkatkan transparansi absensi?",
    pokok: "Absensi, QR Code, kehadiran mahasiswa.",
    penelitian: "Penelitian sebelumnya membahas absensi biometrik.",
    deskripsi: "Aplikasi web absensi dengan QR Code real-time.",
    keterangan: "Sudah ACC Dosen PA",
    tanggalPengajuan: "2025-01-20",
    tanggalDisetujui: "2025-02-05",
    status: "disetujui",
  },
];

export default function PengajuanJudulKaprodiPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selected, setSelected] = useState<PengajuanJudul | null>(null);
  const [pembimbing1, setPembimbing1] = useState<string>("");
  const [pembimbing2, setPembimbing2] = useState<string>("");

  const filteredData = dummyData.filter((item) => {
    const matchSearch =
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      item.mahasiswa.nama.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      filterStatus === "all" ? true : item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen p-8" >
      {/* Judul Halaman */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#636AE8]">
          Pengajuan Judul Mahasiswa (Kaprodi)
        </h1>
        <p className="text-gray-600 mt-1">
          Halaman ini menampilkan judul skripsi yang sudah di-ACC Dosen PA untuk diproses Kaprodi.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari mahasiswa / judul..."
              className="pl-8 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select onValueChange={setFilterStatus} defaultValue="all">
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="disetujui">Disetujui</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="ditolak">Ditolak</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg shadow-sm border bg-white">
        <Table>
          <TableHeader className="bg-[#636AE8] text-white">
            <TableRow>
              <TableHead className="w-12 text-white">No</TableHead>
              <TableHead className="text-white">Mahasiswa</TableHead>
              <TableHead className="text-white">Judul</TableHead>
              <TableHead className="text-white">Tanggal Pengajuan</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item, idx) => (
                <TableRow key={item.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.mahasiswa.nama}</p>
                      <p className="text-xs text-gray-500">{item.mahasiswa.nim}</p>
                    </div>
                  </TableCell>
                  <TableCell>{item.judul}</TableCell>
                  <TableCell>{item.tanggalPengajuan}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => setSelected(item)}
                    >
                      <Eye className="h-4 w-4" />
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  Tidak ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Dialog Detail */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Detail Pengajuan Judul</DialogTitle>
                <DialogDescription>
                  Informasi lengkap pengajuan judul mahasiswa & penetapan pembimbing.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">NIM Mahasiswa</label>
                  <Input value={selected.mahasiswa.nim} readOnly disabled />
                </div>

                <div>
                  <label className="text-sm font-medium">Nama Mahasiswa</label>
                  <Input value={selected.mahasiswa.nama} readOnly disabled />
                </div>

                <div>
                  <label className="text-sm font-medium">Judul</label>
                  <Input value={selected.judul} readOnly disabled />
                </div>

                <div>
                  <label className="text-sm font-medium">Identifikasi Masalah</label>
                  <Textarea value={selected.identifikasi} readOnly disabled />
                </div>

                <div>
                  <label className="text-sm font-medium">Rumusan Masalah</label>
                  <Textarea value={selected.rumusan} readOnly disabled />
                </div>

                <div>
                  <label className="text-sm font-medium">Pokok Masalah</label>
                  <Textarea value={selected.pokok} readOnly disabled />
                </div>

                <div>
                  <label className="text-sm font-medium">Penelitian Sebelumnya</label>
                  <Textarea value={selected.penelitian} readOnly disabled />
                </div>

                <div>
                  <label className="text-sm font-medium">Deskripsi Lengkap</label>
                  <Textarea value={selected.deskripsi} readOnly disabled />
                </div>

                {/* Select Dosen Pembimbing */}
                <div>
                  <label className="text-sm font-medium">Dosen Pembimbing 1</label>
                  <Select value={pembimbing1} onValueChange={setPembimbing1}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Pilih Dosen Pembimbing 1" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dosen1">Dr. Budi Santoso</SelectItem>
                      <SelectItem value="dosen2">Dr. Siti Aminah</SelectItem>
                      <SelectItem value="dosen3">Dr. Andi Wijaya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Dosen Pembimbing 2</label>
                  <Select value={pembimbing2} onValueChange={setPembimbing2}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Pilih Dosen Pembimbing 2" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dosen1">Dr. Budi Santoso</SelectItem>
                      <SelectItem value="dosen2">Dr. Siti Aminah</SelectItem>
                      <SelectItem value="dosen3">Dr. Andi Wijaya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="flex gap-2">
                <Button className="bg-[#636AE8] hover:bg-[#4e55c4] text-white">
                  Simpan Pembimbing
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
