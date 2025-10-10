"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, Eye, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Rancangan } from "@/types/Rancangan";
import { PDFDocument } from "@/components/PDFDocument";
import { RancanganPenelitian } from "@/types/RancanganPenelitian";

const statusColors = {
  menunggu: "bg-orange-100 text-orange-700",
  diverifikasi: "bg-green-100 text-green-700",
  diterima: "bg-blue-100 text-blue-700",
  ditolak: "bg-red-100 text-red-700",
};

const statusLabels = {
  menunggu: "Menunggu Persetujuan",
  diverifikasi: "Diverifikasi",
  diterima: "Diterima",
  ditolak: "Ditolak",
};

const rancanganPenelitian: RancanganPenelitian[] = [
  {
    id: 1,
    mahasiswa: { id: 1, nim: "1234567890", nama: "Budi Santoso" },
    judul_penelitian:
      "Analisis Pengaruh Media Sosial terhadap Perilaku Konsumen",
    masalah_dan_penyebab:
      "Banyaknya penggunaan media sosial yang mempengaruhi keputusan pembelian konsumen.",
    alternatif_solusi:
      "Melakukan survei dan wawancara untuk memahami pengaruh media sosial.",
    metode_penelitian: "Metode kuantitatif dengan menggunakan kuesioner.",
    hasil_yang_diharapkan:
      "Memahami sejauh mana media sosial mempengaruhi perilaku konsumen.",
    kebutuhan_data:
      "Data dari pengguna media sosial dan perilaku pembelian mereka.",
    status: "diverifikasi",
    tanggalPengajuan: "2023-10-01",
  },
  {
    id: 2,
    mahasiswa: { id: 2, nim: "0987654321", nama: "Siti Aminah" },
    judul_penelitian: "Studi Efektivitas Pembelajaran Daring di Masa Pandemi",
    masalah_dan_penyebab:
      "Tantangan dalam pembelajaran daring yang mempengaruhi hasil belajar siswa.",
    alternatif_solusi:
      "Menganalisis metode pembelajaran daring yang paling efektif.",
    metode_penelitian: "Metode campuran dengan survei dan wawancara.",
    hasil_yang_diharapkan:
      "Menemukan strategi pembelajaran daring yang efektif.",
    kebutuhan_data:
      "Data dari siswa, guru, dan hasil belajar selama pembelajaran daring.",
    status: "diterima",
    tanggalPengajuan: "2023-09-15",
    keterangan: "Perlu revisi pada bagian metode penelitian.",
    tanggalDiterima: "2023-09-30",
  },
];

export default function DosenPengajuanRanpelPage() {
  
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState<Rancangan | null>(null);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Persetujuan Rancangan Penelitian
            </h1>
            <p className="text-gray-600 mt-1">
              Tinjau dan setujui rancangan penelitian mahasiswa bimbingan Anda
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              className="pl-10 border-gray-200 bg-white rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded border overflow-x-auto">
          <Table className="w-full">
            {/* header */}
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-12">No</TableHead>
                <TableHead className="w-32">Nama Mahasiswa</TableHead>
                <TableHead className="max-w-xs">Judul Penelitian</TableHead>
                <TableHead className="w-28">Tanggal Pengajuan</TableHead>
                <TableHead className="w-20">Status</TableHead>
                <TableHead className="w-12">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            {/* Body */}
            <TableBody>
              {rancanganPenelitian.length > 0 ? (
                rancanganPenelitian.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="text-center">
                      {item.mahasiswa?.nama}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-gray-600">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="truncate cursor-help">
                              {item.judul_penelitian}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-sm">
                            {item.judul_penelitian}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.tanggalPengajuan}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${
                          statusColors[item.status]
                        } border-0 text-xs`}
                      >
                        {statusLabels[item.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelected(item)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Belum ada pengajuan rancangan penelitian.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Preview */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="sm:max-w-6xl max-h-[95vh] overflow-hidden rounded">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle>Preview Rancangan Penelitian</DialogTitle>
                </DialogHeader>

                {/* PDF Preview Container */}
                <div className="bg-gray-100 p-4 rounded-lg max-h-[75vh] overflow-y-auto">
                  <div
                    className="bg-white shadow-2xl mx-auto"
                    style={{ width: "210mm", minHeight: "297mm" }}
                  >
                    <PDFDocument rancangan={selected} id="pdf-content" />
                  </div>
                </div>

                {/* Footer */}
                <DialogFooter className="flex justify-between ">
                  {/* Tombol kiri: Tutup & Download */}
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setSelected(null)}>
                      Tutup
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button className="bg-red-500 hover:bg-red-600 text-white">
                      Tolak
                    </Button>
                    <Button className="bg-green-500 hover:bg-green-600 text-white">
                      Setujui
                    </Button>
                  </div>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
