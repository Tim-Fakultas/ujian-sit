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

  const [openDaftarHadir, setOpenDaftarHadir] = useState(false);
  const [selectedDaftarHadir, setSelectedDaftarHadir] = useState<Ujian | null>(
    null
  );

  const [filterNama, setFilterNama] = useState("");
  const [filterJenis, setFilterJenis] = useState("all");
  const [openFilter, setOpenFilter] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [sortField, setSortField] = useState<"nama" | "judul" | "waktu" | null>(
    null
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // ===========================================
  // Filter + Sort
  // ===========================================
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
          const tglA = new Date(a.jadwalUjian).getTime();
          const tglB = new Date(b.jadwalUjian).getTime();
          if (tglA < tglB) return sortOrder === "asc" ? -1 : 1;
          if (tglA > tglB) return sortOrder === "asc" ? 1 : -1;
          return 0;
        }

        return 0;
      });
    }

    return data;
  }, [jadwalUjian, filterNama, filterJenis, sortField, sortOrder]);

  // ===========================================
  // Pagination
  // ===========================================
  const totalPage = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    setPage(1);
  }, [filterNama, filterJenis]);

  useEffect(() => {
    if (page > totalPage) {
      setPage(totalPage || 1);
    }
  }, [totalPage, page]);

  // ===========================================
  // Handlers
  // ===========================================
  function handleDetail(ujian: Ujian) {
    setSelected(ujian);
    setOpenDialog(true);
  }

  function handleDaftarHadir(ujian: Ujian) {
    setSelectedDaftarHadir(ujian);
    setOpenDaftarHadir(true);
  }

  function cekHadir(dosenId: number) {
    if (!daftarHadir || !selected) return false;

    return daftarHadir.some(
      (d) =>
        d.dosenId === dosenId &&
        d.statusKehadiran === "hadir" &&
        d.ujianId === selected.id
    );
  }

  function handleSort(field: "nama" | "judul" | "waktu") {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  }

  // ===========================================
  // Render
  // ===========================================
  return (
    <div className="rounded-lg overflow-x-auto p-6 bg-white dark:bg-[#1f1f1f] shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="font-semibold text-lg">Jadwal Ujian</div>

        <div className="flex items-center gap-2">
          <div className="relative w-56">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>
            <Input
              placeholder="Search"
              value={filterNama}
              onChange={(e) => setFilterNama(e.target.value)}
              className="pl-10 w-full bg-white dark:bg-[#2a2a2a]"
            />
          </div>

          {/* Filters */}
          <Popover open={openFilter} onOpenChange={setOpenFilter}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="flex h-9 items-center border border-gray-200 rounded-lg px-4 py-1 bg-white hover:bg-gray-50 font-medium shadow-sm"
              >
                <ListFilter size={16} className="mr-2" />
                Filters
                <ChevronDown size={16} className="ml-2" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-48 p-2" align="end">
              <div className="font-semibold mb-2">Jenis Ujian</div>

              {["all", "Ujian Proposal", "Ujian Hasil", "Ujian Skripsi"].map(
                (item) => (
                  <Button
                    key={item}
                    variant={filterJenis === item ? "secondary" : "ghost"}
                    size="sm"
                    className="justify-start"
                    onClick={() => {
                      setFilterJenis(item);
                      setOpenFilter(false);
                    }}
                  >
                    {item === "all" ? "Semua" : item}
                  </Button>
                )
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Table Jadwal */}
      <div className="border overflow-auto rounded-lg bg-white dark:bg-[#1f1f1f]">
        <Table>
          <TableHeader className="bg-sidebar-accent">
            <TableRow>
              <TableHead className="text-center w-10">No</TableHead>
              <TableHead>
                <div className="flex items-center gap-1 select-none">
                  Nama Mahasiswa
                  <button onClick={() => handleSort("nama")} className="ml-1">
                    {sortField === "nama" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp size={14} />
                      ) : (
                        <ArrowDown size={14} />
                      )
                    ) : (
                      <ChevronDown size={14} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </TableHead>

              <TableHead>
                <div className="flex items-center gap-1 select-none">
                  Judul Penelitian
                  <button onClick={() => handleSort("judul")} className="ml-1">
                    {sortField === "judul" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp size={14} />
                      ) : (
                        <ArrowDown size={14} />
                      )
                    ) : (
                      <ChevronDown size={14} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </TableHead>

              <TableHead>Jenis Ujian</TableHead>

              <TableHead>
                <div className="flex items-center gap-1 select-none">
                  Waktu
                  <button onClick={() => handleSort("waktu")} className="ml-1">
                    {sortField === "waktu" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp size={14} />
                      ) : (
                        <ArrowDown size={14} />
                      )
                    ) : (
                      <ChevronDown size={14} className="text-gray-400" />
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
                <TableRow key={ujian.id}>
                  <TableCell className="text-center">
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>

                  <TableCell>{ujian.mahasiswa.nama}</TableCell>

                  <TableCell className="whitespace-normal break-words max-w-xs">
                    {ujian.judulPenelitian}
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={`px-2 py-1 font-medium inline-block ${getJenisUjianColor(
                        ujian.jenisUjian.namaJenis
                      )}`}
                    >
                      {ujian.jenisUjian.namaJenis}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {ujian.hariUjian
                          ? ujian.hariUjian[0].toUpperCase() +
                            ujian.hariUjian.slice(1)
                          : "-"}
                        ,{" "}
                        {new Date(ujian.jadwalUjian).toLocaleDateString(
                          "id-ID",
                          { day: "numeric", month: "long", year: "numeric" }
                        )}
                      </div>

                      <div className="mt-1">
                        {ujian.waktuMulai.slice(0, 5)} -{" "}
                        {ujian.waktuSelesai.slice(0, 5)}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{ujian.ruangan.namaRuangan}</TableCell>

                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
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
      <div className="mt-4 flex justify-end">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={page === 1 ? "opacity-50 pointer-events-none" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPage }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                className={
                  page === totalPage ? "opacity-50 pointer-events-none" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Dialog Detail Penguji */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-3xl p-6 max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="font-semibold mb-2">
              Tim Penguji
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[65vh] pr-2">
            {selected && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center w-10">No</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Jabatan</TableHead>
                    <TableHead className="text-center">Kehadiran</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {selected.penguji.map((penguji, i) => {
                    const roleMap: Record<string, string> = {
                      ketua_penguji: "Ketua Penguji",
                      sekretaris_penguji: "Sekretaris Penguji",
                      penguji_1: "Penguji 1",
                      penguji_2: "Penguji 2",
                    };

                    const label = roleMap[penguji.peran];

                    return (
                      <TableRow key={penguji.id}>
                        <TableCell className="text-center">{i + 1}</TableCell>
                        <TableCell>{penguji.nama}</TableCell>
                        <TableCell>{label}</TableCell>
                        <TableCell className="text-center">
                          {cekHadir(penguji.id) ? (
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

          <div className="flex justify-end mt-5">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Daftar Hadir */}
      <Dialog open={openDaftarHadir} onOpenChange={setOpenDaftarHadir}>
        <DialogContent className="sm:max-w-lg p-6">
          <DialogHeader>
            <DialogTitle className="font-semibold mb-2">
              Formulir Daftar Hadir Ujian Skripsi
            </DialogTitle>
          </DialogHeader>

          {selectedDaftarHadir && (
            <div>
              <div className="mb-4">
                <div>
                  <span className="font-medium">Waktu</span>:{" "}
                  {selectedDaftarHadir.waktuMulai.slice(0, 5)} -{" "}
                  {selectedDaftarHadir.waktuSelesai.slice(0, 5)}
                </div>

                <div>
                  <span className="font-medium">Nama Mahasiswa</span>:{" "}
                  {selectedDaftarHadir.mahasiswa.nama}
                </div>

                <div>
                  <span className="font-medium">NIM</span>:{" "}
                  {selectedDaftarHadir.mahasiswa.nim}
                </div>

                <div>
                  <span className="font-medium">Judul Skripsi</span>:{" "}
                  {selectedDaftarHadir.judulPenelitian}
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table className="border w-full">
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="border px-2 py-1">No.</TableHead>
                      <TableHead className="border px-2 py-1">Nama</TableHead>
                      <TableHead className="border px-2 py-1">
                        NIP/NIDN
                      </TableHead>
                      <TableHead className="border px-2 py-1">
                        Jabatan
                      </TableHead>
                      <TableHead className="border px-2 py-1 text-center">
                        Kehadiran
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {selectedDaftarHadir.penguji.map((penguji, i) => {
                      const roleMap: Record<string, string> = {
                        ketua_penguji: "Ketua Penguji",
                        sekretaris_penguji: "Sekretaris Penguji",
                        penguji_1: "Penguji I",
                        penguji_2: "Penguji II",
                      };

                      // Cek kehadiran
                      const hadir = daftarHadir?.some(
                        (d) =>
                          d.dosenId === penguji.id &&
                          d.ujianId === selectedDaftarHadir.id &&
                          d.statusKehadiran === "hadir"
                      );

                      return (
                        <TableRow key={penguji.id}>
                          <TableCell className="border px-2 py-1 text-center">
                            {i + 1}
                          </TableCell>

                          <TableCell className="border px-2 py-1">
                            {penguji.nama}
                          </TableCell>

                          <TableCell className="border px-2 py-1">
                            {penguji.nip || penguji.nidn || "-"}
                          </TableCell>

                          <TableCell className="border px-2 py-1">
                            {roleMap[penguji.peran]}
                          </TableCell>

                          <TableCell className="border px-2 py-1 text-center">
                            {hadir ? (
                              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800">
                                Hadir
                              </span>
                            ) : (
                              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800">
                                Tidak Hadir
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
