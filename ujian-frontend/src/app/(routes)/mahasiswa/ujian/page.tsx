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
import { Plus, Search, FileText, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";

// Type data ujian
interface Ujian {
  id: number;
  nim: string;
  nama: string;
  waktu: string;
  ruang: string;
  judul: string;
  ketuaPenguji: string;
  sekretarisPenguji: string;
  penguji1: string;
  penguji2: string;
  jenis: "Seminar Proposal" | "Seminar Hasil" | "Seminar Skripsi";
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
    ketuaPenguji: "Dr. Budi Santoso",
    sekretarisPenguji: "Dr. Siti Aminah",
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
    judul:
      "Aplikasi Absensi Mahasiswa Berbasis QR Code dengan Integrasi Sistem Presensi Akademik",
    ketuaPenguji: "Dr. Andi Wijaya",
    sekretarisPenguji: "Dr. Siti Aminah",
    penguji1: "Dr. Budi Santoso",
    penguji2: "Dr. Rina Kurnia",
    jenis: "Seminar Skripsi",
    nilai: "A-",
    status: "selesai",
  },
];

export default function DaftarUjianPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterJenis, setFilterJenis] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selected, setSelected] = useState<Ujian | null>(null);

  const filteredData = dummyData.filter((item) => {
    const matchSearch =
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.nim.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      filterStatus === "all" ? true : item.status === filterStatus;

    const matchJenis =
      filterJenis === "all" ? true : item.jenis === filterJenis;

    return matchSearch && matchStatus && matchJenis;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Simulasi status untuk pengajuan
  const [ujianProposalSelesai] = useState(false); // ubah true untuk test
  const [ujianHasilSelesai] = useState(false);

  return (
    <div className="min-h-screen p-8">
      {/* Judul Page */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-site-header">Daftar Ujian</h1>
        <p className="text-gray-600 mt-1">
          Halaman ini menampilkan daftar ujian seminar proposal, seminar hasil,
          dan skripsi milikmu.
        </p>
      </div>

      {/* Search + Filter + Tombol */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
        <div className="flex w-full gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-8 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Status */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                Semua Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("dijadwalkan")}>
                Dijadwalkan
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("selesai")}>
                Selesai
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filter Jenis */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterJenis("all")}>
                Semua Jenis
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterJenis("Seminar Proposal")}
              >
                Seminar Proposal
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterJenis("Seminar Hasil")}
              >
                Seminar Hasil
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterJenis("Seminar Skripsi")}
              >
                Seminar Skripsi
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Tombol Pengajuan */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-site-header hover:bg-[#4e55c4] text-white">
                <Plus className="h-4 w-4" />
                <span className="hidden md:inline ml-2">Pengajuan</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/mahasiswa/ujian/proposal">Seminar Proposal</Link>
              </DropdownMenuItem>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuItem asChild disabled={!ujianProposalSelesai}>
                      <Link
                        href={
                          ujianProposalSelesai ? "/mahasiswa/ujian/hasil" : "#"
                        }
                      >
                        Seminar Hasil
                      </Link>
                    </DropdownMenuItem>
                  </TooltipTrigger>
                  {!ujianProposalSelesai && (
                    <TooltipContent>
                      <p>Harus menyelesaikan Seminar Proposal dulu</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuItem asChild disabled={!ujianHasilSelesai}>
                      <Link
                        href={
                          ujianHasilSelesai ? "/mahasiswa/ujian/skripsi" : "#"
                        }
                      >
                        Seminar Skripsi
                      </Link>
                    </DropdownMenuItem>
                  </TooltipTrigger>
                  {!ujianHasilSelesai && (
                    <TooltipContent>
                      <p>Harus menyelesaikan Seminar Hasil dulu</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg shadow-sm border bg-white overflow-x-auto">
        <Table>
          <TableHeader className=" bg-white">
            <TableRow>
              <TableHead className="text-neutral-500">No</TableHead>
              <TableHead className="text-neutral-500">NIM</TableHead>
              <TableHead className="text-neutral-500">Nama</TableHead>
              <TableHead className="text-neutral-500">Waktu</TableHead>
              <TableHead className="text-neutral-500">Ruang</TableHead>
              <TableHead className="text-neutral-500">Judul</TableHead>
              <TableHead className="text-neutral-500">Ketua Penguji</TableHead>
              <TableHead className="text-neutral-500">Sekretaris</TableHead>
              <TableHead className="text-neutral-500">Penguji 1</TableHead>
              <TableHead className="text-neutral-500">Penguji 2</TableHead>
              <TableHead className="text-neutral-500">Jenis</TableHead>
              <TableHead className="text-neutral-500">Nilai</TableHead>
              <TableHead className="text-neutral-500">Status</TableHead>
              <TableHead className="text-neutral-500">Action</TableHead>
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
                  {/* Tooltip judul */}
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
                  <TableCell>{item.ketuaPenguji}</TableCell>
                  <TableCell>{item.sekretarisPenguji}</TableCell>
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
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelected(item)}
                      className="flex items-center gap-1"
                    >
                      <FileText className="h-4 w-4" />
                      Detail
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
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                      isActive={currentPage === page}
                      className="cursor-pointer"
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
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Dialog Detail */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Detail Ujian</DialogTitle>
                <DialogDescription>
                  Informasi lengkap mengenai ujian mahasiswa.
                </DialogDescription>
              </DialogHeader>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">NIM</label>
                  <Input value={selected.nim} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Nama</label>
                  <Input value={selected.nama} readOnly />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Judul</label>
                  <Textarea value={selected.judul} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Waktu</label>
                  <Input value={selected.waktu} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Ruang</label>
                  <Input value={selected.ruang} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Ketua Penguji</label>
                  <Input value={selected.ketuaPenguji} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Sekretaris</label>
                  <Input value={selected.sekretarisPenguji} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Penguji 1</label>
                  <Input value={selected.penguji1} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Penguji 2</label>
                  <Input value={selected.penguji2} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Jenis Ujian</label>
                  <Input value={selected.jenis} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Nilai</label>
                  <Input value={selected.nilai || "-"} readOnly />
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Input value={selected.status} readOnly />
                </div>
              </form>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelected(null)}
                >
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
