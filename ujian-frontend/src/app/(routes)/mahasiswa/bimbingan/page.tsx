"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, Plus, FileText } from "lucide-react";

// Type data bimbingan
interface Bimbingan {
  id: number;
  jenis: "Proposal" | "Skripsi";
  judul: string;
  dospem1: string;
  dospem2: string;
  status: "menunggu" | "diterima" | "ditolak";
  tanggal: string;
}

const dummyData: Bimbingan[] = [
  {
    id: 1,
    jenis: "Proposal",
    judul: "Implementasi Blockchain untuk Sistem Akademik",
    dospem1: "Dr. Budi Santoso",
    dospem2: "Dr. Siti Aminah",
    status: "diterima",
    tanggal: "2025-02-15",
  },
  {
    id: 2,
    jenis: "Skripsi",
    judul: "Aplikasi Absensi Mahasiswa Berbasis QR Code",
    dospem1: "Dr. Siti Aminah",
    dospem2: "Dr. Andi Wijaya",
    status: "menunggu",
    tanggal: "2025-03-01",
  },
];

export default function BimbinganMahasiswaPage() {
  const [selected, setSelected] = useState<Bimbingan | null>(null);

  return (
    <div className="min-h-screen p-8">
      {/* Judul & Deskripsi */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-site-header">
          Bimbingan Mahasiswa
        </h1>
        <p className="text-gray-600 mt-1">
          Halaman untuk pengajuan bimbingan Proposal/Skripsi dengan dosen
          pembimbing.
        </p>
      </div>

      {/* Peringatan */}
      <Alert className="mb-6 bg-yellow-50 border-yellow-300">
        <AlertTitle className="font-semibold text-yellow-800">
          Peringatan
        </AlertTitle>
        <AlertDescription className="text-yellow-700">
          Mahasiswa wajib mengambil Mata Kuliah <b>(Proposal/Skripsi)</b> yang
          akan dibimbingkan.
        </AlertDescription>
      </Alert>

      {/* Tombol + Form */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-site-header hover:bg-[#4e55c4] text-white mb-6">
            <Plus className="mr-2 h-4 w-4" />
            Ajukan Bimbingan
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Form Pengajuan Bimbingan</DialogTitle>
            <DialogDescription>
              Isi form berikut untuk mengajukan bimbingan kepada dosen
              pembimbing.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium">Jenis Bimbingan</label>
              <Select>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Pilih jenis bimbingan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="skripsi">Skripsi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Judul</label>
              <Input placeholder="Masukkan judul" />
            </div>

            <div>
              <label className="text-sm font-medium">Upload File</label>
              <div className="flex items-center gap-2">
                <Input type="file" className="bg-white" />
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-1" />
                  Upload
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Keterangan</label>
              <Textarea placeholder="Tuliskan keterangan tambahan..." />
            </div>

            <div>
              <label className="text-sm font-medium">Dosen Pembimbing 1</label>
              <Select>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Pilih dosen pembimbing 1" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budi">Dr. Budi Santoso</SelectItem>
                  <SelectItem value="siti">Dr. Siti Aminah</SelectItem>
                  <SelectItem value="andi">Dr. Andi Wijaya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Dosen Pembimbing 2</label>
              <Select>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Pilih dosen pembimbing 2" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budi">Dr. Budi Santoso</SelectItem>
                  <SelectItem value="siti">Dr. Siti Aminah</SelectItem>
                  <SelectItem value="andi">Dr. Andi Wijaya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button className="bg-[#636AE8] hover:bg-[#4e55c4] text-white">
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Table List Bimbingan */}
      <div className="rounded-lg shadow-sm border bg-white">
        <Table>
          <TableHeader className="bg-site-header text-white">
            <TableRow>
              <TableHead className="w-12 text-white">No</TableHead>
              <TableHead className="text-white">Jenis</TableHead>
              <TableHead className="text-white">Judul</TableHead>
              <TableHead className="text-white">Dospem 1</TableHead>
              <TableHead className="text-white">Dospem 2</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Tanggal</TableHead>
              <TableHead className="text-white">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyData.map((item, idx) => (
              <TableRow key={item.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{item.jenis}</TableCell>
                <TableCell>{item.judul}</TableCell>
                <TableCell>{item.dospem1}</TableCell>
                <TableCell>{item.dospem2}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                    ${
                      item.status === "diterima"
                        ? "bg-green-100 text-green-700"
                        : item.status === "menunggu"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </TableCell>
                <TableCell>{item.tanggal}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <FileText className="h-4 w-4" />
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
