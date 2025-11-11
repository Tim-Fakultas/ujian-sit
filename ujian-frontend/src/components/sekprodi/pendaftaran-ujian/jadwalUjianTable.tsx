"use client";
import React, { useState, useMemo } from "react";
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
  React.useEffect(() => {
    setPage(1);
  }, [filterNama, filterJenis]);

  // Make sure page is always valid if filteredData changes
  React.useEffect(() => {
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
    <div className="rounded-lg overflow-x-auto text-xs">
      {/* Filter Bar: search dan filter di kanan, filter ada arrow */}
      <div className="flex items-center justify-end gap-2 mb-4">
        <div className="relative w-full max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={16} />
          </span>
          <Input
            placeholder="Search"
            value={filterNama}
            onChange={(e) => setFilterNama(e.target.value)}
            className="pl-10 w-full text-xs placeholder:text-xs"
            inputMode="text"
            style={{ fontSize: "0.75rem" }}
          />
        </div>
        <Popover open={openFilter} onOpenChange={setOpenFilter}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="flex items-center border border-gray-200 rounded-lg px-4 py-1 bg-white text-gray-700 hover:bg-gray-50 text-xs font-medium shadow-sm"
            >
              <ListFilter size={16} className="mr-2" />
              Filters
              <ChevronDown size={16} className="ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2 text-xs" align="end">
            <div className="font-semibold mb-2">Jenis Ujian</div>
            <div className="flex flex-col gap-1">
              <Button
                variant={filterJenis === "all" ? "secondary" : "ghost"}
                size="sm"
                className="justify-start text-xs"
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
                className="justify-start text-xs"
                onClick={() => {
                  setFilterJenis("Ujian Proposal");
                  setOpenFilter(false);
                }}
              >
                Ujian Proposal
              </Button>
              <Button
                variant={filterJenis === "Ujian Hasil" ? "secondary" : "ghost"}
                size="sm"
                className="justify-start text-xs"
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
                className="justify-start text-xs"
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

      <div className="border overflow-auto rounded-sm">
        <Table className="text-xs ">
          <TableHeader>
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
                  className="hover:bg-gray-50 transition text-xs"
                >
                  <TableCell className="text-center text-xs">
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="text-xs">
                    {ujian.mahasiswa.nama}
                  </TableCell>
                  <TableCell className="whitespace-normal break-words max-w-xs text-xs">
                    {ujian.judulPenelitian}
                  </TableCell>
                  <TableCell className="text-xs">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-medium inline-block ${getJenisUjianColor(
                        ujian.jenisUjian.namaJenis
                      )}`}
                    >
                      {ujian.jenisUjian.namaJenis}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs text-xs">
                    <div className="text-xs text-gray-700">
                      <div className="font-medium text-xs">
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
                      <div className="text-xs text-gray-600 mt-1">
                        {(ujian.waktuMulai?.slice(0, 5) || "-") +
                          " - " +
                          (ujian.waktuSelesai?.slice(0, 5) || "-")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    {ujian.ruangan?.namaRuangan || "-"}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-gray-200 text-xs"
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
      <div className="mt-4 flex justify-end text-xs">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-disabled={page === 1}
                className={
                  page === 1
                    ? "pointer-events-none opacity-50 text-xs"
                    : "text-xs"
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPage }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                  className="text-xs"
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
                  page === totalPage
                    ? "pointer-events-none opacity-50 text-xs"
                    : "text-xs"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-3xl p-6 max-h-[90vh] overflow-hidden text-xs">
          <DialogHeader>
            <DialogTitle className="font-semibold mb-2 text-xs">
              Tim Penguji
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[65vh] pr-2 text-xs">
            {selected && (
              <Table className="mb-4 text-xs">
                <TableHeader className="bg-accent text-xs">
                  <TableRow className="text-xs">
                    <TableHead className="text-center w-10 text-xs">
                      No
                    </TableHead>
                    <TableHead className="text-xs">Nama</TableHead>
                    <TableHead className="text-xs">Jabatan</TableHead>
                    <TableHead className="text-xs">Kehadiran</TableHead>
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
                      <TableRow key={i} className="text-xs">
                        <TableCell className="text-center text-xs">
                          {i + 1}
                        </TableCell>
                        <TableCell className="text-xs">
                          {row.dosen?.nama ?? "-"}
                        </TableCell>
                        <TableCell className="text-xs">{row.label}</TableCell>
                        <TableCell className="text-xs">
                          {hadir ? (
                            <span className="inline-block rounded-full bg-green-100 text-green-700 font-semibold text-xs px-3 py-1 border border-green-200">
                              Hadir
                            </span>
                          ) : (
                            <span className="inline-block rounded-full bg-gray-100 text-gray-500 font-semibold text-xs px-3 py-1 border border-gray-200">
                              -
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
          <div className="flex justify-end mt-5 text-xs">
            <Button
              variant="outline"
              onClick={() => setOpenDialog(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100 text-xs"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Daftar Hadir */}
      <Dialog open={openDaftarHadir} onOpenChange={setOpenDaftarHadir}>
        <DialogContent className="sm:max-w-lg p-6 text-xs">
          <DialogHeader>
            <DialogTitle className="font-semibold mb-2 text-xs">
              Formulir Daftar Hadir Ujian Skripsi
            </DialogTitle>
          </DialogHeader>
          {selectedDaftarHadir && (
            <div className="text-xs">
              <div className="mb-4 text-xs">
                <div>
                  <span className="font-medium text-xs">Waktu</span>:{" "}
                  {(selectedDaftarHadir.waktuMulai?.slice(0, 5) || "-") +
                    " - " +
                    (selectedDaftarHadir.waktuSelesai?.slice(0, 5) || "-")}
                </div>
                <div>
                  <span className="font-medium text-xs">Nama Mahasiswa</span>:{" "}
                  {selectedDaftarHadir.mahasiswa?.nama || "-"}
                </div>
                <div>
                  <span className="font-medium text-xs">NIM</span>:{" "}
                  {selectedDaftarHadir.mahasiswa?.nim || "-"}
                </div>
                <div>
                  <span className="font-medium text-xs">Judul Skripsi</span>:{" "}
                  {selectedDaftarHadir.judulPenelitian || "-"}
                </div>
              </div>
              <div className="overflow-x-auto text-xs">
                <table className="w-full border text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-xs">
                      <th className="border px-2 py-1 text-xs">No.</th>
                      <th className="border px-2 py-1 text-xs">Nama</th>
                      <th className="border px-2 py-1 text-xs">NIP/NIDN</th>
                      <th className="border px-2 py-1 text-xs">Jabatan</th>
                      <th className="border px-2 py-1 text-xs">Kehadiran</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-xs">
                      <td className="border px-2 py-1 text-center text-xs">
                        1.
                      </td>
                      <td className="border px-2 py-1 text-xs">
                        {selectedDaftarHadir.ketuaPenguji?.nama ?? "-"}
                      </td>
                      <td className="border px-2 py-1 text-xs">
                        {selectedDaftarHadir.ketuaPenguji?.nip ?? "-"}
                      </td>
                      <td className="border px-2 py-1 text-xs">
                        Ketua Penguji
                      </td>
                      <td className="border px-2 py-1 text-center text-xs">
                        <span className="font-medium text-xs">-</span>
                      </td>
                    </tr>
                    <tr className="text-xs">
                      <td className="border px-2 py-1 text-center text-xs">
                        2.
                      </td>
                      <td className="border px-2 py-1 text-xs">
                        {selectedDaftarHadir.sekretarisPenguji?.nama ?? "-"}
                      </td>
                      <td className="border px-2 py-1 text-xs">
                        {selectedDaftarHadir.sekretarisPenguji?.nip ?? "-"}
                      </td>
                      <td className="border px-2 py-1 text-xs">
                        Sekretaris Penguji
                      </td>
                      <td className="border px-2 py-1 text-center text-xs">
                        <span className="font-medium text-xs">-</span>
                      </td>
                    </tr>
                    <tr className="text-xs">
                      <td className="border px-2 py-1 text-center text-xs">
                        3.
                      </td>
                      <td className="border px-2 py-1 text-xs">
                        {selectedDaftarHadir.penguji1?.nama ?? "-"}
                      </td>
                      <td className="border px-2 py-1 text-xs">
                        {selectedDaftarHadir.penguji1?.nip ?? "-"}
                      </td>
                      <td className="border px-2 py-1 text-xs">Penguji I</td>
                      <td className="border px-2 py-1 text-center text-xs">
                        <span className="font-medium text-xs">-</span>
                      </td>
                    </tr>
                    <tr className="text-xs">
                      <td className="border px-2 py-1 text-center text-xs">
                        4.
                      </td>
                      <td className="border px-2 py-1 text-xs">
                        {selectedDaftarHadir.penguji2?.nama ?? "-"}
                      </td>
                      <td className="border px-2 py-1 text-xs">
                        {selectedDaftarHadir.penguji2?.nip ?? "-"}
                      </td>
                      <td className="border px-2 py-1 text-xs">Penguji II</td>
                      <td className="border px-2 py-1 text-center text-xs">
                        <span className="font-medium text-xs">-</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-5 text-xs">
            <Button
              variant="outline"
              onClick={() => setOpenDaftarHadir(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100 text-xs"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
