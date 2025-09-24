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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Search, Eye } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// Type untuk data pengajuan mahasiswa
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
    mahasiswa: { nim: "23012345", nama: "Budi Santoso" },
    judul: "Implementasi Blockchain untuk Sistem Akademik",
    identifikasi: "Banyak data akademik belum terjamin keamanannya.",
    rumusan: "Bagaimana blockchain bisa menjamin integritas data akademik?",
    pokok: "Keamanan data, efisiensi pencatatan, transparansi.",
    penelitian: "Studi A (2023) membahas blockchain di keuangan.",
    deskripsi:
      "Penelitian ini bertujuan membangun sistem akademik berbasis blockchain.",
    keterangan: "Menunggu review",
    tanggalPengajuan: "2025-01-15",
    status: "pending",
  },
  {
    id: 2,
    mahasiswa: { nim: "23067890", nama: "Siti Aminah" },
    judul: "Aplikasi Mobile untuk Monitoring Kesehatan",
    identifikasi: "Kurangnya aplikasi monitoring kesehatan real-time.",
    rumusan: "Bagaimana membuat aplikasi monitoring kesehatan berbasis IoT?",
    pokok: "Sensor IoT, notifikasi kesehatan, integrasi mobile.",
    penelitian: "Penelitian sebelumnya di bidang wearable devices.",
    deskripsi:
      "Aplikasi ini membantu pasien memonitor kesehatan secara langsung.",
    keterangan: "Judul dalam pertimbangan",
    tanggalPengajuan: "2025-02-02",
    tanggalDisetujui: "2025-02-10",
    status: "disetujui",
  },
];

export default function PengajuanJudulDosenPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selected, setSelected] = useState<PengajuanJudul | null>(null);

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
          Pengajuan Judul Mahasiswa
        </h1>
        <p className="text-gray-600 mt-1">
          Halaman ini menampilkan seluruh judul skripsi yang diajukan mahasiswa.
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="disetujui">Disetujui</SelectItem>
              <SelectItem value="ditolak">Ditolak</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg shadow-sm border bg-white">
        <Table>
          <TableHeader className=" ">
            <TableRow className="text-white">
              <TableHead className="w-12 ">No</TableHead>
              <TableHead className="">Mahasiswa</TableHead>
              <TableHead className="">Judul</TableHead>
              <TableHead className="">Keterangan</TableHead>
              <TableHead className="">Tanggal Pengajuan</TableHead>
              <TableHead className="">Tanggal Disetujui</TableHead>
              <TableHead className="">Status</TableHead>
              <TableHead className="">Action</TableHead>
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
                      <p className="text-xs text-gray-500">
                        {item.mahasiswa.nim}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{item.judul}</TableCell>
                  <TableCell>{item.keterangan}</TableCell>
                  <TableCell>{item.tanggalPengajuan}</TableCell>
                  <TableCell>{item.tanggalDisetujui || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        item.status === "disetujui"
                          ? "bg-green-100 text-green-700"
                          : item.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
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
                <TableCell colSpan={8} className="text-center text-gray-500">
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
                  Informasi lengkap pengajuan judul mahasiswa.
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
                  <label className="text-sm font-medium">
                    Identifikasi Masalah
                  </label>
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
                  <label className="text-sm font-medium">
                    Penelitian Sebelumnya
                  </label>
                  <Textarea value={selected.penelitian} readOnly disabled />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Deskripsi Lengkap
                  </label>
                  <Textarea value={selected.deskripsi} readOnly disabled />
                </div>
              </div>

              <DialogFooter className="flex gap-2">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  Terima
                </Button>
                <Button className="bg-rose-500 hover:bg-rose-600 text-white">
                  Tolak
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
