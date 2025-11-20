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
  X,
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
import { Card, CardContent } from "@/components/ui/card";

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
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <Card
          className={`relative bg-white dark:bg-[#1f1f1f] rounded-lg shadow-lg p-6 ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-gray-500"
            onClick={onClose}
          >
            <X size={16} />
          </Button>
          <CardContent className="p-4">{children}</CardContent>
        </Card>
      </div>
    );
  }

  const roleLabel = (peran: string) => {
    switch (peran) {
      case "ketua_penguji":
        return "Ketua Penguji";
      case "sekretaris_penguji":
        return "Sekretaris Penguji";
      case "penguji_1":
        return "Penguji I";
      case "penguji_2":
        return "Penguji II";
      default:
        return peran;
    }
  };

  function nilaiAkhirDosen(ujian: Ujian, dosenId: number) {
    const items = penilaianData.filter((p) => p.dosenId === dosenId);
    if (items.length === 0) return null;

    let total = 0;
    items.forEach((p) => {
      total += (p.nilai * (p.komponenPenilaian?.bobot ?? 0)) / 100;
    });
    return Number(total.toFixed(2));
  }

  function getHadirStatus(ujian: Ujian, dosenId: number) {
    return (
      daftarHadir.find(
        (d) =>
          d.dosenId === dosenId &&
          d.ujianId === ujian.id &&
          d.statusKehadiran === "hadir"
      ) !== undefined
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

  // Tambahkan fungsi untuk styling badge status
  function statusBadge(status: string) {
    let color =
      "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700";
    if (status === "dijadwalkan")
      color =
        "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800";
    else if (status === "menunggu")
      color =
        "bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800";
    else if (status === "diterima")
      color =
        "bg-green-100 text-green-700 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800";
    else if (status === "selesai")
      color =
        "bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-800";
    return (
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${color}`}
        style={{ minWidth: 80, textAlign: "center" }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <span className="font-bold text-lg">Jadwal ujian</span>
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 ">
          <div className="flex gap-2 w-full md:w-auto md:ml-auto justify-end">
            <div className="relative w-full max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={16} />
              </span>
              <Input
                placeholder="Search"
                value={filterNama}
                onChange={(e) => setFilterNama(e.target.value)}
                className="pl-10  w-56  text-sm bg-white dark:bg-[#1f1f1f] "
                inputMode="text"
              />
            </div>
            <Popover open={openFilter} onOpenChange={setOpenFilter}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="flex h-9 items-center border  rounded-lg px-4 py-1 bg-white  hover:bg-gray-50  font-medium "
                >
                  <ListFilter size={16} className="mr-2" />
                  Jenis Ujian
                  <ChevronDown size={16} className="ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2 " align="end">
                <div className="flex flex-col gap-1">
                  <Button
                    variant={filterJenis === "all" ? "secondary" : "ghost"}
                    size="sm"
                    className={`justify-start  ${
                      filterJenis === "all" ? "" : ""
                    }`}
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
                      className={`justify-start  ${
                        filterJenis === jenis ? "" : ""
                      }`}
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
            {/* Jadwal Filter: Popover */}
            <Popover open={openJadwalFilter} onOpenChange={setOpenJadwalFilter}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="flex h-9 items-center  rounded-lg px-4 py-1 bg-white  hover:bg-gray-50  font-medium "
                >
                  {filterJadwal === "all" ? "Semua Jadwal" : "Jadwal Saya"}
                  <ChevronDown size={16} className="ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-2 " align="start">
                <div className="flex flex-col gap-1">
                  <Button
                    variant={filterJadwal === "all" ? "secondary" : "ghost"}
                    size="sm"
                    className={`justify-start  ${
                      filterJadwal === "all" ? "" : ""
                    }`}
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
                    className={`justify-start  ${
                      filterJadwal === "mine" ? "" : ""
                    }`}
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
          </div>
        </div>
      </div>

      <div className="border overflow-auto rounded-lg bg-white dark:bg-[#1f1f1f]">
        <Table>
          <TableHeader className="bg-sidebar-accent">
            <TableRow>
              <TableHead className="text-center w-10">No</TableHead>
              <TableHead>Nama Mahasiswa</TableHead>
              <TableHead>Jenis Ujian</TableHead>
              <TableHead>Ruangan</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center  italic py-6">
                  Tidak ada jadwal ujian
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((ujian, idx) => (
                <TableRow
                  key={ujian.id}
                  className="hover:bg-gray-50  transition "
                >
                  <TableCell className="text-center ">
                    {(page - 1) * pageSize + idx + 1}
                  </TableCell>
                  <TableCell className="">
                    {ujian.mahasiswa?.nama ?? "-"}
                  </TableCell>
                  <TableCell className="">
                    <span className="px-2 py-1 rounded  font-medium inline-block bg-blue-50 text-blue-600">
                      {ujian.jenisUjian?.namaJenis ?? "-"}
                    </span>
                  </TableCell>
                  <TableCell className="">
                    {ujian.ruangan.namaRuangan ?? "-"}
                  </TableCell>
                  <TableCell className="max-w-xs ">
                    <div>
                      <div className="font-medium ">
                        {ujian?.hariUjian
                          ? ujian.hariUjian.charAt(0).toUpperCase() +
                            ujian.hariUjian.slice(1)
                          : "-"}
                        <span>, </span>
                        {ujian.jadwalUjian
                          ? ujian.jadwalUjian.split(/[ T]/)[0]
                          : "-"}
                      </div>
                      <div className="  mt-1">
                        {(ujian.waktuMulai?.slice(0, 5) || "-") +
                          " - " +
                          (ujian.waktuSelesai?.slice(0, 5) || "-")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {statusBadge(ujian.pendaftaranUjian.status)}
                  </TableCell>

                  <TableCell className="text-center ">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="p-1 h-7 w-7 mx-auto"
                          aria-label="Aksi"
                        >
                          <MoreHorizontal size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        sideOffset={8}
                        className="w-48 p-1 rounded-lg shadow-lg"
                      >
                        <DropdownMenuItem
                          onClick={() => {
                            setSelected(ujian);
                            setOpenDaftarHadir(true);
                          }}
                          className="w-full flex items-center gap-2  px-3 py-2 rounded-lg"
                        >
                          <Eye size={16} />
                          <span>Lihat Penguji</span>
                        </DropdownMenuItem>
                        {ujian.mahasiswa?.id === userId && (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelected(ujian);
                              setOpenRekapitulasi(true);
                            }}
                            className="w-full flex items-center gap-2  px-3 py-2 rounded-lg"
                          >
                            <IconClipboardText size={16} />
                            <span>Rekapitulasi Nilai</span>
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
                      <div className="space-y-4">
                        <div className="text-center">
                          <h2 className="text-xl font-bold">
                            Rekapitulasi Nilai {ujian.jenisUjian?.namaJenis}
                          </h2>
                        </div>

                        {/* Tabel Rekap */}
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>No.</TableHead>
                              <TableHead>Nama</TableHead>
                              <TableHead>Jabatan</TableHead>
                              <TableHead className="text-center">
                                Nilai
                              </TableHead>
                            </TableRow>
                          </TableHeader>

                          <TableBody>
                            {ujian.penguji.map((p, i) => {
                              const label = roleLabel(p.peran);
                              const nilai = nilaiAkhirDosen(ujian, p.id);

                              return (
                                <TableRow key={p.id}>
                                  <TableCell>{i + 1}</TableCell>
                                  <TableCell>{p.nama}</TableCell>
                                  <TableCell>{label}</TableCell>
                                  <TableCell className="text-center">
                                    {nilai ?? "-"}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>

                        {/* Ringkasan */}
                        {(() => {
                          const nilaiList = ujian.penguji
                            .map((p) => nilaiAkhirDosen(ujian, p.id))
                            .filter((n) => n !== null) as number[];

                          const total = nilaiList.reduce((a, b) => a + b, 0);
                          const avg = nilaiList.length
                            ? total / nilaiList.length
                            : 0;

                          const huruf =
                            avg >= 80
                              ? "A"
                              : avg >= 70
                              ? "B"
                              : avg >= 60
                              ? "C"
                              : avg >= 50
                              ? "D"
                              : "E";

                          return (
                            <div className="flex flex-col gap-2 text-right">
                              <div>Total: {total.toFixed(2)}</div>
                              <div>Rata-rata: {avg.toFixed(2)}</div>
                              <div className="font-bold text-lg">
                                Nilai Huruf: {huruf}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </Modal>

                    {/* Modal Daftar Hadir Ujian */}
                    <Modal
                      open={openDaftarHadir && selected?.id === ujian.id}
                      onClose={() => setOpenDaftarHadir(false)}
                      className="max-w-4xl w-full max-h-[85vh] overflow-y-auto"
                    >
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>NIP/NIDN</TableHead>
                            <TableHead>Jabatan</TableHead>
                            <TableHead className="text-center">
                              Status
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ujian.penguji.map((p) => (
                            <TableRow key={p.id} className="text-left">
                              <TableCell>{p.nama}</TableCell>
                              <TableCell>
                                {p.nip} / {p.nidn}
                              </TableCell>
                              <TableCell>{roleLabel(p.peran)}</TableCell>
                              <TableCell className="text-center">
                                {getHadirStatus(ujian, p.id) ? (
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
                          ))}
                        </TableBody>
                      </Table>
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
        <div className="mt-4 flex justify-end ">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-disabled={page === 1}
                  className={
                    page === 1 ? "pointer-events-none opacity-50 " : ""
                  }
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
      )}
    </div>
  );
}
