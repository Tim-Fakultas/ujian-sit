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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Eye } from "lucide-react";
import { IconFilter2 } from "@tabler/icons-react";

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

const gradeColors: Record<string, string> = {
  A: "bg-green-100 text-green-800",
  B: "bg-blue-100 text-blue-800",
  C: "bg-yellow-100 text-yellow-800",
  D: "bg-orange-100 text-orange-800",
  E: "bg-red-100 text-red-800",
};

export default function PenilaianPage() {
  const [search, setSearch] = useState("");
  const [filterNilai, setFilterNilai] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
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

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Penilaian Ujian
          </h1>
          <p className="text-gray-600 mt-1">
            Lihat hasil penilaian ujian seminar dan skripsi Anda
          </p>
        </div>

        {/* Search & Filter */}
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
          <Select value={filterNilai} onValueChange={setFilterNilai}>
            <SelectTrigger className="w-42 bg-white rounded">
              <IconFilter2 className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter nilai" />
            </SelectTrigger>
            <SelectContent className="rounded">
              <SelectItem value="all">Semua Nilai</SelectItem>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="C">C</SelectItem>
              <SelectItem value="D">D</SelectItem>
              <SelectItem value="E">E</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table Penilaian */}
        <div className="bg-white rounded border overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No</TableHead>
                <TableHead>NIM</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Hari/Tanggal</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Rata-rata</TableHead>
                <TableHead>Huruf</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length > 0 ? (
                currentData.map((item, idx) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">
                      {startIndex + idx + 1}
                    </TableCell>
                    <TableCell>{item.nim}</TableCell>
                    <TableCell>{item.nama}</TableCell>
                    <TableCell>{item.tanggal}</TableCell>
                    <TableCell className="max-w-md truncate text-gray-600">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="truncate cursor-help">
                              {item.judul}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-sm">
                            {item.judul}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{item.total}</TableCell>
                    <TableCell>{item.rata.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${
                          gradeColors[item.huruf]
                        } border-0 font-bold`}
                      >
                        {item.huruf}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelected(item)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    Tidak ada data penilaian
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Footer Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm">Tampil per halaman:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(v) => {
                  setItemsPerPage(parseInt(v));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20 rounded">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded">
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {totalPages > 1 && (
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
                          className="rounded"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={currentPage === page}
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
            )}
          </div>
        </div>

        {/* Dialog Detail */}
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle>Formulir Rekapitulasi Nilai</DialogTitle>
                  <DialogDescription>
                    Detail penilaian ujian seminar / skripsi.
                  </DialogDescription>
                </DialogHeader>

                {/* Identitas */}
                <div className="mb-4 space-y-2 text-sm bg-gray-50 p-4 rounded">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <p>
                      <span className="font-semibold">Hari/Tanggal:</span>{" "}
                      {selected.tanggal}
                    </p>
                    <p>
                      <span className="font-semibold">NIM:</span> {selected.nim}
                    </p>
                  </div>
                  <p>
                    <span className="font-semibold">Nama:</span> {selected.nama}
                  </p>
                  <p>
                    <span className="font-semibold">Judul Proposal:</span>{" "}
                    {selected.judul}
                  </p>
                </div>

                {/* Tabel Rekap */}
                <div className="rounded border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">No</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Jabatan</TableHead>
                        <TableHead className="text-center">
                          Angka Nilai
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-center">1</TableCell>
                        <TableCell>{selected.ketua.nama}</TableCell>
                        <TableCell>Ketua Penguji</TableCell>
                        <TableCell className="text-center font-semibold">
                          {selected.ketua.nilai}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-center">2</TableCell>
                        <TableCell>{selected.sekretaris.nama}</TableCell>
                        <TableCell>Sekretaris Penguji</TableCell>
                        <TableCell className="text-center font-semibold">
                          {selected.sekretaris.nilai}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-center">3</TableCell>
                        <TableCell>{selected.penguji1.nama}</TableCell>
                        <TableCell>Penguji I</TableCell>
                        <TableCell className="text-center font-semibold">
                          {selected.penguji1.nilai}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-center">4</TableCell>
                        <TableCell>{selected.penguji2.nama}</TableCell>
                        <TableCell>Penguji II</TableCell>
                        <TableCell className="text-center font-semibold">
                          {selected.penguji2.nilai}
                        </TableCell>
                      </TableRow>
                      <TableRow className="font-semibold bg-gray-50">
                        <TableCell colSpan={3} className="text-right">
                          Total Angka Nilai
                        </TableCell>
                        <TableCell className="text-center">
                          {selected.total}
                        </TableCell>
                      </TableRow>
                      <TableRow className="font-semibold bg-gray-50">
                        <TableCell colSpan={3} className="text-right">
                          Nilai Rata-rata
                        </TableCell>
                        <TableCell className="text-center">
                          {selected.rata.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow className="font-semibold bg-gray-100">
                        <TableCell colSpan={3} className="text-right">
                          Nilai Huruf
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={`${
                              gradeColors[selected.huruf]
                            } border-0`}
                          >
                            {selected.huruf}
                          </Badge>
                        </TableCell>
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
    </div>
  );
}
