"use client";
import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ujian } from "@/types/Ujian";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Search,
  ChevronDown,
  ChevronDown as ArrowDown,
  ChevronUp as ArrowUp,
  ListFilter,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { daftarKehadiran } from "@/types/DaftarKehadiran";
import { Input } from "@/components/ui/input";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getJenisUjianColor } from "@/lib/utils";

export default function JadwalUjianTable({
  jadwalUjian,
  daftarHadir,
}: {
  jadwalUjian: Ujian[];
  daftarHadir: daftarKehadiran[] | null;
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState<Ujian | null>(null);

  // Tambahan untuk daftar hadir
  const [openDaftarHadir, setOpenDaftarHadir] = useState(false);
  const [selectedDaftarHadir, setSelectedDaftarHadir] = useState<Ujian | null>(
    null
  );

  // State untuk filter
  const [filterNama, setFilterNama] = useState("");
  const [filterJenis, setFilterJenis] = useState("all");
  const [openFilter, setOpenFilter] = useState(false);
  // State untuk pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // State untuk sort
  const [sortField, setSortField] = useState<"nama" | "judul" | "waktu" | null>(
    null
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Jenis ujian statis
  const jenisUjianOptions = ["Ujian Proposal", "Ujian Hasil", "Ujian Skripsi"];

  // Filtered & sorted data
  const filteredData = useMemo(() => {
    let data = jadwalUjian.filter((ujian) => {
      const matchNama = ujian.mahasiswa.nama
        .toLowerCase()
        .includes(filterNama.toLowerCase());
      const matchJenis =
        filterJenis === "all"
          ? true
          : ujian.jenisUjian.namaJenis === filterJenis;
      return matchNama && matchJenis;
    });

    // Sorting
    if (sortField) {
      data = [...data].sort((a, b) => {
        if (sortField === "nama") {
          const namaA = a.mahasiswa.nama.toLowerCase();
          const namaB = b.mahasiswa.nama.toLowerCase();
          if (namaA < namaB) return sortOrder === "asc" ? -1 : 1;
          if (namaA > namaB) return sortOrder === "asc" ? 1 : -1;
          return 0;
        }
        if (sortField === "judul") {
          const judulA = (a.judulPenelitian || "").toLowerCase();
          const judulB = (b.judulPenelitian || "").toLowerCase();
          if (judulA < judulB) return sortOrder === "asc" ? -1 : 1;
          if (judulA > judulB) return sortOrder === "asc" ? 1 : -1;
          return 0;
        }
        if (sortField === "waktu") {
          const tglA = a.jadwalUjian ? new Date(a.jadwalUjian).getTime() : 0;
          const tglB = b.jadwalUjian ? new Date(b.jadwalUjian).getTime() : 0;
          if (tglA < tglB) return sortOrder === "asc" ? -1 : 1;
          if (tglA > tglB) return sortOrder === "asc" ? 1 : -1;
          return 0;
        }
        return 0;
      });
    }

    return data;
  }, [jadwalUjian, filterNama, filterJenis, sortField, sortOrder]);

  // Pagination data
  const totalPage = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // Reset page ke 1 jika filter berubah
  useEffect(() => {
    setPage(1);
  }, [filterNama, filterJenis]);

  // Make sure page is always valid if filteredData changes
  useEffect(() => {
    if (page > totalPage) setPage(totalPage === 0 ? 1 : totalPage);
  }, [totalPage, page]);

  function handleDetail(ujian: Ujian) {
    setSelected(ujian);
    setOpenDialog(true);
  }

  function handleDaftarHadir(ujian: Ujian) {
    setSelectedDaftarHadir(ujian);
    setOpenDaftarHadir(true);
  }

  function cekHadir(dosenId: number) {
    if (!daftarHadir || !daftarHadir.length || !selected) return false;
    return !!daftarHadir.find(
      (d: daftarKehadiran) =>
        d.dosenId === dosenId &&
        d.statusKehadiran === "hadir" &&
        d.ujianId === selected.id
    );
  }

  // Handler untuk klik sort
  function handleSort(field: "nama" | "judul" | "waktu") {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  }

  return (
    <div className="rounded-lg overflow-x-auto p-6 bg-white dark:bg-[#1f1f1f] shadow-sm">
      {/* Bar atas: label kiri dan filter kanan */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="font-semibold text-lg ">Jadwal Ujian</div>
        <div className="flex items-center gap-2">
          <div className="relative w-56">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>
            <Input
              placeholder="Search"
              value={filterNama}
              onChange={(e) => setFilterNama(e.target.value)}
              className="pl-10 w-full bg-white dark:bg-[#2a2a2a] "
            />
          </div>
          <Popover open={openFilter} onOpenChange={setOpenFilter}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="flex h-9 items-center border border-gray-200 rounded-lg px-4 py-1 bg-white  hover:bg-gray-50  font-medium shadow-sm"
              >
                <ListFilter size={16} className="mr-2" />
                Filters
                <ChevronDown size={16} className="ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2 " align="end">
              <div className="font-semibold mb-2">Jenis Ujian</div>
              <div className="flex flex-col gap-1">
                <Button
                  variant={filterJenis === "all" ? "secondary" : "ghost"}
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    setFilterJenis("all");
                    setOpenFilter(false);
                  }}
                >
                  Semua
                </Button>
                <Button
                  variant={
                    filterJenis === "Ujian Proposal" ? "secondary" : "ghost"
                  }
                  size="sm"
                  className="justify-start "
                  onClick={() => {
                    setFilterJenis("Ujian Proposal");
                    setOpenFilter(false);
                  }}
                >
                  Ujian Proposal
                </Button>
                <Button
                  variant={
                    filterJenis === "Ujian Hasil" ? "secondary" : "ghost"
                  }
                  size="sm"
                  className="justify-start "
                  onClick={() => {
                    setFilterJenis("Ujian Hasil");
                    setOpenFilter(false);
                  }}
                >
                  Ujian Hasil
                </Button>
                <Button
                  variant={
                    filterJenis === "Ujian Skripsi" ? "secondary" : "ghost"
                  }
                  size="sm"
                  className="justify-start "
                  onClick={() => {
                    setFilterJenis("Ujian Skripsi");
                    setOpenFilter(false);
                  }}
                >
                  Ujian Skripsi
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="border overflow-auto rounded-lg bg-white dark:bg-[#1f1f1f]">
        <Table>
          <TableHeader className="bg-sidebar-accent">
            <TableRow>
              <TableHead className="text-center w-10">No</TableHead>
              <TableHead>
                <div className="flex items-center gap-1 select-none">
                  Nama Mahasiswa
                  <button
                    type="button"
                    className="ml-1 p-0.5"
                    onClick={() => handleSort("nama")}
                    aria-label="Urutkan Nama Mahasiswa"
                  >
                    {sortField === "nama" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp size={14} className="inline" />
                      ) : (
                        <ArrowDown size={14} className="inline" />
                      )
                    ) : (
                      <ChevronDown size={14} className="inline text-gray-400" />
                    )}
                  </button>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1 select-none">
                  Judul Penelitian
                  <button
                    type="button"
                    className="ml-1 p-0.5"
                    onClick={() => handleSort("judul")}
                    aria-label="Urutkan Judul Penelitian"
                  >
                    {sortField === "judul" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp size={14} className="inline" />
                      ) : (
                        <ArrowDown size={14} className="inline" />
                      )
                    ) : (
                      <ChevronDown size={14} className="inline text-gray-400" />
                    )}
                  </button>
                </div>
              </TableHead>
              <TableHead>Jenis Ujian</TableHead>
              <TableHead>
                <div className="flex items-center gap-1 select-none">
                  Waktu
                  <button
                    type="button"
                    className="ml-1 p-0.5"
                    onClick={() => handleSort("waktu")}
                    aria-label="Urutkan Waktu"
                  >
                    {sortField === "waktu" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp size={14} className="inline" />
                      ) : (
                        <ArrowDown size={14} className="inline" />
                      )
                    ) : (
                      <ChevronDown size={14} className="inline text-gray-400" />
                    )}
                  </button>
                </div>
              </TableHead>
              <TableHead>Ruangan</TableHead>
              <TableHead className="text-center">Penguji</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((ujian, index) => (
                <TableRow
                  key={ujian.id}
                  className="hover:bg-gray-50 transition "
                >
                  <TableCell className="text-center ">
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="">{ujian.mahasiswa.nama}</TableCell>
                  <TableCell className="whitespace-normal break-words max-w-xs ">
                    {ujian.judulPenelitian}
                  </TableCell>
                  <TableCell className="">
                    <Badge
                      className={`px-2 py-1 font-medium inline-block ${getJenisUjianColor(
                        ujian.jenisUjian.namaJenis
                      )}`}
                    >
                      {ujian.jenisUjian.namaJenis}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs ">
                    <div className=" ">
                      <div className="font-medium ">
                        {ujian?.hariUjian
                          ? ujian.hariUjian.charAt(0).toUpperCase() +
                            ujian.hariUjian.slice(1)
                          : "-"}
                        <span>, </span>
                        {ujian.jadwalUjian
                          ? new Date(ujian.jadwalUjian).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )
                          : "-"}
                      </div>
                      <div className="  mt-1">
                        {(ujian.waktuMulai?.slice(0, 5) || "-") +
                          " - " +
                          (ujian.waktuSelesai?.slice(0, 5) || "-")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="">
                    {ujian.ruangan?.namaRuangan || "-"}
                  </TableCell>
                  <TableCell className="text-center ">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-gray-200 "
                      aria-label="Lihat Detail"
                      onClick={() => handleDetail(ujian)}
                    >
                      <Eye size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-gray-500 italic py-6"
                >
                  Tidak ada jadwal ujian tersedia.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-end ">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-disabled={page === 1}
                className={page === 1 ? "pointer-events-none opacity-50 " : ""}
              />
            </PaginationItem>
            {Array.from({ length: totalPage }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                  className=""
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                aria-disabled={page === totalPage}
                className={
                  page === totalPage ? "pointer-events-none opacity-50 " : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-3xl p-6 max-h-[90vh] overflow-hidden ">
          <DialogHeader>
            <DialogTitle className="font-semibold mb-2">
              Tim Penguji
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[65vh] pr-2">
            {selected && (
              <Table className="mb-4">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center w-10 ">No</TableHead>
                    <TableHead className="">Nama</TableHead>
                    <TableHead className="">Jabatan</TableHead>
                    <TableHead className="text-center">Kehadiran</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      label: "Ketua Penguji",
                      dosen: selected.ketuaPenguji,
                    },
                    {
                      label: "Sekretaris Penguji",
                      dosen: selected.sekretarisPenguji,
                    },
                    {
                      label: "Penguji 1",
                      dosen: selected.penguji1,
                    },
                    {
                      label: "Penguji 2",
                      dosen: selected.penguji2,
                    },
                  ].map((row, i) => {
                    const hadir = row.dosen?.id
                      ? cekHadir(row.dosen.id)
                      : false;
                    return (
                      <TableRow key={i} className="">
                        <TableCell className="text-center">{i + 1}</TableCell>
                        <TableCell>{row.dosen?.nama ?? "-"}</TableCell>
                        <TableCell>{row.label}</TableCell>
                        <TableCell className="text-center">
                          {hadir ? (
                            <Badge className="bg-green-100 text-green-700 border border-green-200 text-sm">
                              Hadir
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-500 border border-gray-200 text-sm">
                              -
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
          <div className="flex justify-end mt-5 ">
            <Button
              variant="outline"
              onClick={() => setOpenDialog(false)}
              className="border-gray-300  hover:bg-gray-100 "
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Daftar Hadir */}
      <Dialog open={openDaftarHadir} onOpenChange={setOpenDaftarHadir}>
        <DialogContent className="sm:max-w-lg p-6 ">
          <DialogHeader>
            <DialogTitle className="font-semibold mb-2 ">
              Formulir Daftar Hadir Ujian Skripsi
            </DialogTitle>
          </DialogHeader>
          {selectedDaftarHadir && (
            <div className="">
              <div className="mb-4 ">
                <div>
                  <span className="font-medium ">Waktu</span>:{" "}
                  {(selectedDaftarHadir.waktuMulai?.slice(0, 5) || "-") +
                    " - " +
                    (selectedDaftarHadir.waktuSelesai?.slice(0, 5) || "-")}
                </div>
                <div>
                  <span className="font-medium ">Nama Mahasiswa</span>:{" "}
                  {selectedDaftarHadir.mahasiswa?.nama || "-"}
                </div>
                <div>
                  <span className="font-medium ">NIM</span>:{" "}
                  {selectedDaftarHadir.mahasiswa?.nim || "-"}
                </div>
                <div>
                  <span className="font-medium ">Judul Skripsi</span>:{" "}
                  {selectedDaftarHadir.judulPenelitian || "-"}
                </div>
              </div>
              <div className="overflow-x-auto ">
                <table className="w-full border ">
                  <thead>
                    <tr className="bg-gray-100 ">
                      <th className="border px-2 py-1 ">No.</th>
                      <th className="border px-2 py-1 ">Nama</th>
                      <th className="border px-2 py-1 ">NIP/NIDN</th>
                      <th className="border px-2 py-1 ">Jabatan</th>
                      <th className="border px-2 py-1 ">Kehadiran</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="">
                      <td className="border px-2 py-1 text-center ">1.</td>
                      <td className="border px-2 py-1 ">
                        {selectedDaftarHadir.ketuaPenguji?.nama ?? "-"}
                      </td>
                      <td className="border px-2 py-1 ">
                        {selectedDaftarHadir.ketuaPenguji?.nip ?? "-"}
                      </td>
                      <td className="border px-2 py-1 ">Ketua Penguji</td>
                      <td className="border px-2 py-1 text-center ">
                        <span className="font-medium ">-</span>
                      </td>
                    </tr>
                    <tr className="">
                      <td className="border px-2 py-1 text-center ">2.</td>
                      <td className="border px-2 py-1 ">
                        {selectedDaftarHadir.sekretarisPenguji?.nama ?? "-"}
                      </td>
                      <td className="border px-2 py-1 ">
                        {selectedDaftarHadir.sekretarisPenguji?.nip ?? "-"}
                      </td>
                      <td className="border px-2 py-1 ">Sekretaris Penguji</td>
                      <td className="border px-2 py-1 text-center ">
                        <span className="font-medium ">-</span>
                      </td>
                    </tr>
                    <tr className="">
                      <td className="border px-2 py-1 text-center ">3.</td>
                      <td className="border px-2 py-1 ">
                        {selectedDaftarHadir.penguji1?.nama ?? "-"}
                      </td>
                      <td className="border px-2 py-1 ">
                        {selectedDaftarHadir.penguji1?.nip ?? "-"}
                      </td>
                      <td className="border px-2 py-1 ">Penguji I</td>
                      <td className="border px-2 py-1 text-center ">
                        <span className="font-medium ">-</span>
                      </td>
                    </tr>
                    <tr className="">
                      <td className="border px-2 py-1 text-center ">4.</td>
                      <td className="border px-2 py-1 ">
                        {selectedDaftarHadir.penguji2?.nama ?? "-"}
                      </td>
                      <td className="border px-2 py-1 ">
                        {selectedDaftarHadir.penguji2?.nip ?? "-"}
                      </td>
                      <td className="border px-2 py-1 ">Penguji II</td>
                      <td className="border px-2 py-1 text-center ">
                        <span className="font-medium ">-</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-5 ">
            <Button
              variant="outline"
              onClick={() => setOpenDaftarHadir(false)}
              className="border-gray-300  hover:bg-gray-100 "
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
