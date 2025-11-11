/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import { Ujian } from "@/types/Ujian";
import {
  Eye,
  Search,
  ChevronDown,
  ListFilter,
  MoreHorizontal,
} from "lucide-react";
import { IconClipboardText } from "@tabler/icons-react";
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
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";
import { daftarKehadiran } from "@/types/DaftarKehadiran";
import { getPenilaianByUjianId } from "@/actions/penilaian";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface JadwalUjianTableProps {
  jadwalUjian: Ujian[];
  daftarHadir: daftarKehadiran[];
  userId: number | undefined;
}

export default function JadwalUjianTable({
  jadwalUjian,
  daftarHadir,
  userId,
}: JadwalUjianTableProps) {
  const [selected, setSelected] = useState<Ujian | null>(null);

  const [openRekapitulasi, setOpenRekapitulasi] = useState(false);
  const [openDaftarHadir, setOpenDaftarHadir] = useState(false);

  function Modal({
    open,
    onClose,
    children,
    className = "",
  }: {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
  }) {
    if (!open) return null;
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/80"
        onClick={onClose}
      >
        <div
          className={`bg-white rounded shadow-lg p-6 relative ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            &times;
          </Button>
          {children}
        </div>
      </div>
    );
  }

  // Filter & Pagination State
  const [filterNama, setFilterNama] = useState("");
  const [filterJenis, setFilterJenis] = useState("all");
  const [filterJadwal, setFilterJadwal] = useState<"all" | "mine">("all");
  const [openFilter, setOpenFilter] = useState(false);
  const [openJadwalFilter, setOpenJadwalFilter] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Jenis ujian statis
  const jenisUjianOptions = ["Ujian Proposal", "Ujian Hasil", "Ujian Skripsi"];

  // Filtered data
  const filteredData = useMemo(() => {
    let data = jadwalUjian;
    if (filterJadwal === "mine" && userId) {
      data = data.filter((ujian) => ujian.mahasiswa?.id === userId);
    }
    return data.filter((ujian) => {
      const matchNama = ujian.mahasiswa?.nama
        ?.toLowerCase()
        .includes(filterNama.toLowerCase());
      const matchJenis =
        filterJenis === "all"
          ? true
          : ujian.jenisUjian?.namaJenis === filterJenis;
      return matchNama && matchJenis;
    });
  }, [jadwalUjian, filterNama, filterJenis, filterJadwal, userId]);

  // Pagination
  const totalPage = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // Reset page ke 1 jika filter berubah
  useEffect(() => {
    setPage(1);
  }, [filterNama, filterJenis]);

  const [penilaianData, setPenilaianData] = useState<any[]>([]);
  const [loadingPenilaian, setLoadingPenilaian] = useState(false);

  // Ambil penilaian saat modal rekap dibuka
  useEffect(() => {
    if (openRekapitulasi && selected?.id) {
      setLoadingPenilaian(true);
      getPenilaianByUjianId(selected.id)
        .then((data) => setPenilaianData(data))
        .finally(() => setLoadingPenilaian(false));
    }
  }, [openRekapitulasi, selected?.id]);

  return (
    <div>
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        {/* Jadwal Filter: Popover */}
        <Popover open={openJadwalFilter} onOpenChange={setOpenJadwalFilter}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="flex items-center  rounded-lg px-4 py-1 bg-white text-gray-700 hover:bg-gray-50 text-xs font-medium "
            >
              {filterJadwal === "all" ? "Semua Jadwal" : "Jadwal Saya"}
              <ChevronDown size={16} className="ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2 text-xs" align="start">
            <div className="flex flex-col gap-1">
              <Button
                variant={filterJadwal === "all" ? "secondary" : "ghost"}
                size="sm"
                className="justify-start text-xs"
                onClick={() => {
                  setFilterJadwal("all");
                  setOpenJadwalFilter(false);
                }}
              >
                Semua Jadwal
              </Button>
              <Button
                variant={filterJadwal === "mine" ? "secondary" : "ghost"}
                size="sm"
                className="justify-start text-xs"
                onClick={() => {
                  setFilterJadwal("mine");
                  setOpenJadwalFilter(false);
                }}
              >
                Jadwal Saya
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex gap-2 w-full md:w-auto md:ml-auto justify-end">
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
                className="flex items-center border  rounded-lg px-4 py-1 bg-white text-gray-700 hover:bg-gray-50 text-xs font-medium "
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
                {jenisUjianOptions.map((jenis) => (
                  <Button
                    key={jenis}
                    variant={filterJenis === jenis ? "secondary" : "ghost"}
                    size="sm"
                    className="justify-start text-xs"
                    onClick={() => {
                      setFilterJenis(jenis);
                      setOpenFilter(false);
                    }}
                  >
                    {jenis}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="border overflow-auto rounded-sm">
        <Table className="text-xs ">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-10">No</TableHead>
              <TableHead>Nama Mahasiswa</TableHead>
              <TableHead>Jenis Ujian</TableHead>
              <TableHead>Ruangan</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-gray-500 italic py-6"
                >
                  Tidak ada jadwal ujian
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((ujian, idx) => (
                <TableRow
                  key={ujian.id}
                  className="hover:bg-gray-50 transition text-xs"
                >
                  <TableCell className="text-center text-xs">
                    {(page - 1) * pageSize + idx + 1}
                  </TableCell>
                  <TableCell className="text-xs">
                    {ujian.mahasiswa?.nama ?? "-"}
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="px-2 py-1 rounded text-[10px] font-medium inline-block bg-blue-50 text-blue-700">
                      {ujian.jenisUjian?.namaJenis ?? "-"}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs">
                    {ujian.ruangan.namaRuangan ?? "-"}
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
                          ? ujian.jadwalUjian.split(/[ T]/)[0]
                          : "-"}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {(ujian.waktuMulai?.slice(0, 5) || "-") +
                          " - " +
                          (ujian.waktuSelesai?.slice(0, 5) || "-")}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-center text-xs">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Aksi"
                          className="mx-auto"
                        >
                          <MoreHorizontal size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" side="top">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelected(ujian);
                            setOpenDaftarHadir(true);
                          }}
                          className="text-xs"
                        >
                          <Eye size={16} className="mr-2" />
                          Lihat Penguji
                        </DropdownMenuItem>
                        {ujian.mahasiswa?.id === userId && (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelected(ujian);
                              setOpenRekapitulasi(true);
                            }}
                            className="text-xs"
                          >
                            <IconClipboardText size={16} className="mr-2" />
                            Rekapitulasi Nilai
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {/* Modal Rekapitulasi Nilai */}
                    <Modal
                      open={openRekapitulasi && selected?.id === ujian.id}
                      onClose={() => setOpenRekapitulasi(false)}
                      className="max-w-2xl w-full max-h-[85vh] overflow-y-auto"
                    >
                      <div>
                        <h2 className="text-xl font-bold mb-2 text-gray-800">
                          Rekapitulasi Nilai {ujian.jenisUjian?.namaJenis}
                        </h2>
                        <div className="mb-4 mt-2 text-left text-sm text-gray-700">
                          <div>
                            <span className="font-semibold">Hari/Tanggal:</span>{" "}
                            {ujian.hariUjian ?? "-"} /{" "}
                            {ujian.jadwalUjian?.split(/[ T]/)[0] ?? "-"}
                          </div>
                          <div>
                            <span className="font-semibold">Ruangan:</span>{" "}
                            {ujian.ruangan.namaRuangan ?? "-"}
                          </div>
                        </div>
                        {/* Tabel Rekap Nilai */}
                        <div className="overflow-x-auto rounded-lg border border-muted">
                          <Table className="min-w-[500px]">
                            <TableHeader>
                              <TableRow className="bg-muted">
                                <TableHead className="w-10 text-center font-semibold text-gray-700 border-r">
                                  No.
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700 border-r">
                                  Nama
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700 border-r">
                                  Jabatan
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700 text-center">
                                  Angka Nilai
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(() => {
                                const pengujiRows = [
                                  {
                                    no: 1,
                                    jabatan: "Ketua Penguji",
                                    dosen: ujian.ketuaPenguji,
                                  },
                                  {
                                    no: 2,
                                    jabatan: "Sekretaris Penguji",
                                    dosen: ujian.sekretarisPenguji,
                                  },
                                  {
                                    no: 3,
                                    jabatan: "Penguji I",
                                    dosen: ujian.penguji1,
                                  },
                                  {
                                    no: 4,
                                    jabatan: "Penguji II",
                                    dosen: ujian.penguji2,
                                  },
                                ];
                                function nilaiAkhirDosen(dosenId: number) {
                                  const penilaian = penilaianData.filter(
                                    (p) => p.dosenId === dosenId
                                  );
                                  if (penilaian.length === 0) return null;
                                  let total = 0;
                                  penilaian.forEach((p) => {
                                    total +=
                                      (p.nilai *
                                        (p.komponenPenilaian?.bobot ?? 0)) /
                                      100;
                                  });
                                  return Number(total.toFixed(2));
                                }
                                const nilaiList: number[] = [];
                                pengujiRows.forEach((row) => {
                                  if (row.dosen?.id) {
                                    const n = nilaiAkhirDosen(row.dosen.id);
                                    if (n !== null) nilaiList.push(n);
                                  }
                                });
                                const totalNilai = nilaiList.reduce(
                                  (a, b) => a + b,
                                  0
                                );
                                const rata2 =
                                  nilaiList.length > 0
                                    ? totalNilai / nilaiList.length
                                    : 0;
                                function nilaiHuruf(n: number) {
                                  if (n >= 80) return "A";
                                  if (n >= 70) return "B";
                                  if (n >= 60) return "C";
                                  if (n >= 50) return "D";
                                  return "E";
                                }
                                return (
                                  <>
                                    {pengujiRows.map((row, idx) => (
                                      <TableRow
                                        key={idx}
                                        className="border-b last:border-b-0"
                                      >
                                        <TableCell className="text-center border-r">
                                          {row.no}
                                        </TableCell>
                                        <TableCell className="border-r">
                                          {row.dosen?.nama ?? "-"}
                                        </TableCell>
                                        <TableCell className="border-r">
                                          {row.jabatan}
                                        </TableCell>
                                        <TableCell className="text-center">
                                          {row.dosen?.id
                                            ? (() => {
                                                const n = nilaiAkhirDosen(
                                                  row.dosen.id
                                                );
                                                return n !== null ? n : "-";
                                              })()
                                            : "-"}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                    {/* Total Angka Nilai */}
                                    <TableRow className="bg-muted/70 font-semibold">
                                      <TableCell
                                        colSpan={3}
                                        className="text-right border-r"
                                      >
                                        Total Angka Nilai
                                      </TableCell>
                                      <TableCell className="text-center">
                                        {nilaiList.length > 0
                                          ? totalNilai.toFixed(2)
                                          : "-"}
                                      </TableCell>
                                    </TableRow>
                                    {/* Nilai Rata-rata */}
                                    <TableRow className="bg-muted/70 font-semibold">
                                      <TableCell
                                        colSpan={3}
                                        className="text-right border-r"
                                      >
                                        Nilai Rata-rata
                                      </TableCell>
                                      <TableCell className="text-center">
                                        {nilaiList.length > 0
                                          ? rata2.toFixed(2)
                                          : "-"}
                                      </TableCell>
                                    </TableRow>
                                    {/* Nilai Huruf */}
                                    <TableRow className="bg-muted/70 font-semibold">
                                      <TableCell
                                        colSpan={3}
                                        className="text-right border-r"
                                      >
                                        Nilai Huruf
                                      </TableCell>
                                      <TableCell className="text-center">
                                        {nilaiList.length > 0
                                          ? nilaiHuruf(rata2)
                                          : "-"}
                                      </TableCell>
                                    </TableRow>
                                  </>
                                );
                              })()}
                            </TableBody>
                          </Table>
                          {loadingPenilaian && (
                            <div className="text-center py-4 text-gray-500">
                              Memuat data nilai...
                            </div>
                          )}
                          {!loadingPenilaian && penilaianData.length === 0 && (
                            <div className="text-center py-4 text-gray-500">
                              Belum ada data penilaian
                            </div>
                          )}
                        </div>
                      </div>
                    </Modal>

                    {/* Modal Daftar Hadir Ujian */}
                    <Modal
                      open={openDaftarHadir && selected?.id === ujian.id}
                      onClose={() => setOpenDaftarHadir(false)}
                      className="max-w-4xl w-full max-h-[85vh] overflow-y-auto"
                    >
                      <div className="mt-8">
                        <Table className="w-full text-sm border">
                          <TableHeader>
                            <TableRow className="bg-gray-100">
                              <TableHead className="w-8">No.</TableHead>
                              <TableHead>Nama</TableHead>
                              <TableHead>NIP/NIDN</TableHead>
                              <TableHead>Jabatan</TableHead>
                              <TableHead className="text-center">
                                Hadir
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(() => {
                              function getHadirStatus(dosenId?: number) {
                                if (!dosenId) return false;
                                return (
                                  daftarHadir.find(
                                    (d) =>
                                      d.dosenId === dosenId &&
                                      d.ujianId === ujian.id &&
                                      d.statusKehadiran === "hadir"
                                  ) !== undefined
                                );
                              }
                              const pengujiRows = [
                                {
                                  no: 1,
                                  nama: ujian.ketuaPenguji?.nama ?? "-",
                                  nip: ujian.ketuaPenguji?.nip,
                                  nidn: ujian.ketuaPenguji?.nidn,
                                  jabatan: "Ketua Penguji",
                                  dosenId: ujian.ketuaPenguji?.id,
                                },
                                {
                                  no: 2,
                                  nama: ujian.sekretarisPenguji?.nama ?? "-",
                                  nip: ujian.sekretarisPenguji?.nip,
                                  nidn: ujian.sekretarisPenguji?.nidn,
                                  jabatan: "Sekretaris Penguji",
                                  dosenId: ujian.sekretarisPenguji?.id,
                                },
                                {
                                  no: 3,
                                  nama: ujian.penguji1?.nama ?? "-",
                                  nip: ujian.penguji1?.nip,
                                  nidn: ujian.penguji1?.nidn,
                                  jabatan: "Penguji I",
                                  dosenId: ujian.penguji1?.id,
                                },
                                {
                                  no: 4,
                                  nama: ujian.penguji2?.nama ?? "-",
                                  nip: ujian.penguji2?.nip,
                                  nidn: ujian.penguji2?.nidn,
                                  jabatan: "Penguji II",
                                  dosenId: ujian.penguji2?.id,
                                },
                              ];
                              return pengujiRows.map((row, idx) => (
                                <TableRow key={idx}>
                                  <TableCell className="text-left">
                                    {row.no}
                                  </TableCell>
                                  <TableCell className="text-left">
                                    {row.nama}
                                  </TableCell>
                                  <TableCell className="text-left">
                                    {row.nip ?? "-"}
                                    {row.nidn ? ` / ${row.nidn}` : ""}
                                  </TableCell>
                                  <TableCell className="text-left">
                                    {row.jabatan}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {getHadirStatus(row.dosenId) ? (
                                      <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">
                                        Hadir
                                      </span>
                                    ) : (
                                      <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold">
                                        Tidak Hadir
                                      </span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ));
                            })()}
                          </TableBody>
                        </Table>
                      </div>
                    </Modal>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      {totalPage > 1 && (
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
      )}
    </div>
  );
}
