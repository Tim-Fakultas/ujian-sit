/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import { Ujian } from "@/types/Ujian";
import {
  Eye,
  Search,
  MoreHorizontal,
  X,
  LayoutGrid,
  List,
  Settings2,
  Calendar,
} from "lucide-react";
import { IconClipboardText } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// { changed code }
// imports untuk TanStack Table + TableGlobal
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import TableGlobal from "@/components/tableGlobal";
// ...existing code...

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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
        onClick={onClose}
      >
        <Card
          className={`relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 max-w-md w-full ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-900 dark:hover:text-white"
            onClick={onClose}
          >
            <X size={18} />
          </Button>
          <CardContent className="p-6">{children}</CardContent>
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

  // { changed code }
  // TanStack Table column defs menggunakan paginatedData sebagai sumber
  const columnHelper = createColumnHelper<Ujian>();

  const columns = [
    columnHelper.display({
      id: "no",
      header: "No",
      cell: (info) => (page - 1) * pageSize + info.row.index + 1,
    }),
    columnHelper.accessor((row) => row.mahasiswa?.nama ?? "-", {
      id: "nama",
      header: "Nama Mahasiswa",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.jenisUjian?.namaJenis ?? "-", {
      id: "jenis",
      header: "Jenis Ujian",
      cell: (info) => (
        <span className="px-2 py-1 rounded font-medium inline-block bg-blue-50 text-blue-600">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor((row) => row.ruangan?.namaRuangan ?? "-", {
      id: "ruangan",
      header: "Ruangan",
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: "waktu",
      header: "Waktu",
      cell: (info) => {
        const ujian = info.row.original;
        const hari = ujian?.hariUjian
          ? ujian.hariUjian.charAt(0).toUpperCase() + ujian.hariUjian.slice(1)
          : "-";
        const tanggal = ujian.jadwalUjian
          ? ujian.jadwalUjian.split(/[ T]/)[0]
          : "-";
        return (
          <div>
            <div className="font-medium">
              {hari}
              <span>, </span>
              {tanggal}
            </div>
            <div className="mt-1">
              {(ujian.waktuMulai?.slice(0, 5) || "-") +
                " - " +
                (ujian.waktuSelesai?.slice(0, 5) || "-")}
            </div>
          </div>
        );
      },
    }),

    columnHelper.display({
      id: "aksi",
      header: "Aksi",
      cell: (info) => {
        const ujian = info.row.original;
        return (
          <div className="flex items-center justify-center">
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
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg"
                >
                  <Eye size={16} />
                  <span>Lihat Penguji</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  // end changed code

  // Tambahkan state untuk view mode
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  return (
    <div className="border bg-white dark:bg-neutral-900 p-3 sm:p-6 rounded-lg w-full max-w-full">
      {/* Header & Filter Bar */}
      <div className="flex flex-col gap-2  mb-4 w-full">
        <div className="flex flex-row flex-1 items-center gap-2 w-full sm:justify-end">
          {/* Search input di luar filter popover */}
          <div className="relative w-full  sm:max-w-full ">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>
            <Input
              placeholder="Search"
              value={filterNama}
              onChange={(e) => setFilterNama(e.target.value)}
              className="pl-10 w-full text-sm bg-white dark:bg-neutral-900 rounded-md"
              inputMode="text"
            />
          </div>
          {/* Filter popover hanya untuk jenis ujian & jadwal */}
          <Popover open={openFilter} onOpenChange={setOpenFilter}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 p-0 grid place-items-center"
                aria-label="Filter"
                title="Filter"
              >
                <Settings2 size={18} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3" align="end">
              <div className="flex flex-col gap-3">
                {/* Jenis Ujian Filter */}
                <div>
                  <div className="text-xs font-semibold mb-1 text-muted-foreground">
                    Jenis Ujian
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={filterJenis === "all" ? "secondary" : "ghost"}
                      size="sm"
                      className="rounded"
                      onClick={() => setFilterJenis("all")}
                    >
                      Semua
                    </Button>
                    {jenisUjianOptions.map((jenis) => (
                      <Button
                        key={jenis}
                        variant={filterJenis === jenis ? "secondary" : "ghost"}
                        size="sm"
                        className="rounded"
                        onClick={() => setFilterJenis(jenis)}
                      >
                        {jenis}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {/* Tabs Table/Card */}
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as "table" | "card")}
            className="h-9"
          >
            <TabsList className="rounded-md bg-muted p-1 gap-2">
              <TabsTrigger
                value="table"
                className="inline-flex items-center gap-2 h-9 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                aria-label="Table view"
              >
                <span className="hidden sm:inline">
                  <LayoutGrid size={16} />
                </span>
                <span className="sm:hidden">
                  <LayoutGrid size={16} />
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="card"
                className="inline-flex items-center gap-2 h-9 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                aria-label="Card view"
              >
                <span className="hidden sm:inline">
                  <List />
                </span>
                <span className="sm:hidden">
                  <List />
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Table/Card view */}
      {viewMode === "table" ? (
        <TableGlobal table={table} cols={columns} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {paginatedData.map((ujian, idx) => {
            const judul = ujian.judulPenelitian ?? "-";
            const jenis = ujian.jenisUjian?.namaJenis ?? "-";
            const ruangan = ujian.ruangan?.namaRuangan ?? "-";
            const hari = ujian?.hariUjian
              ? ujian.hariUjian.charAt(0).toUpperCase() +
              ujian.hariUjian.slice(1)
              : "-";
            const tanggal = ujian.jadwalUjian
              ? ujian.jadwalUjian.split(/[ T]/)[0]
              : "-";
            const waktu =
              (ujian.waktuMulai?.slice(0, 5) || "-") +
              " - " +
              (ujian.waktuSelesai?.slice(0, 5) || "-");
            const status = ujian.pendaftaranUjian?.status ?? "-";

            // Format Date
            const tanggalObj = ujian.jadwalUjian ? new Date(ujian.jadwalUjian) : null;
            const tanggalStr = tanggalObj ? tanggalObj.toLocaleDateString("id-ID", {
              day: "numeric", month: "short", year: "numeric"
            }) : "-";



            let statusColor = "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
            if (status === "dijadwalkan")
              statusColor = "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
            else if (status === "menunggu")
              statusColor = "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
            else if (status === "belum dijadwalkan")
              statusColor = "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
            else if (status === "selesai")
              statusColor = "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800";


            return (
              <div
                key={ujian.id ?? idx}
                className={`group relative bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col`}
              >
                <div className="p-5 flex flex-col gap-4 flex-1">
                  {/* Header: Date & Status */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      <Calendar size={13} />
                      <span>{hari}, {tanggalStr}</span>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}>
                      {status}
                    </span>
                  </div>

                  {/* Content: Title & Details */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-3" title={judul}>
                      {judul || "Judul tidak tersedia"}
                    </h3>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Jenis</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{jenis}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ruangan</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{ruangan}</span>
                      </div>
                      <div className="flex flex-col gap-1 col-span-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Waktu</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{waktu}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="bg-gray-50/50 dark:bg-neutral-800/50 p-3 flex items-center justify-end border-t border-gray-100 dark:border-neutral-800">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-xs h-8 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        <MoreHorizontal size={14} className="mr-1.5" /> Aksi
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelected(ujian);
                          setOpenDaftarHadir(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 cursor-pointer"
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
                          className="w-full flex items-center gap-2 px-3 py-2 cursor-pointer"
                        >
                          <IconClipboardText size={16} />
                          <span>Rekapitulasi Nilai</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Lihat Penguji */}
      <Modal open={openDaftarHadir} onClose={() => setOpenDaftarHadir(false)}>
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="text-xl font-bold tracking-tight">
              Daftar Penguji
            </div>
          </div>

          {selected?.penguji && selected.penguji.length > 0 ? (
            <div className="space-y-4">
              {selected.penguji.map((penguji, idx) => {
                const isHadir = getHadirStatus(selected, penguji.id);
                return (
                  <div
                    key={penguji.id ?? idx}
                    className="flex items-center gap-4 bg-gray-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-gray-100 dark:border-neutral-800 transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800"
                  >
                    {/* Avatar Placeholder / Initials */}
                    <div className="h-10 w-10 rounded-full bg-white dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-200 shrink-0 shadow-sm">
                      {penguji.nama ? penguji.nama.charAt(0).toUpperCase() : "?"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                        {penguji.nama ?? "-"}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 font-medium border border-blue-100 dark:border-blue-800">
                          {roleLabel(penguji.peran)}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isHadir ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-lg text-xs font-bold border border-green-200 dark:border-green-800/50 shadow-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                          Hadir
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-xs font-bold border border-red-200 dark:border-red-800/50 shadow-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                          Tidak Hadir
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 dark:bg-neutral-800/30 rounded-xl border border-dashed border-gray-200 dark:border-neutral-800">
              <div className="p-3 bg-white dark:bg-neutral-800 rounded-full mb-3 shadow-sm">
                <Eye size={20} className="text-gray-400" />
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-200">Belum ada data penguji</div>
              <div className="text-xs text-gray-500 mt-1">Data penguji belum ditambahkan untuk ujian ini.</div>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal Rekapitulasi Nilai */}
      <Modal open={openRekapitulasi} onClose={() => setOpenRekapitulasi(false)}>
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="text-xl font-bold tracking-tight">
              Rekapitulasi Nilai
            </div>
          </div>

          {loadingPenilaian ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="text-sm text-muted-foreground">Memuat data penilaian...</span>
            </div>
          ) : penilaianData && penilaianData.length > 0 ? (
            <div className="space-y-4">
              {selected?.penguji?.map((penguji, idx) => {
                const nilai = nilaiAkhirDosen(selected, penguji.id);
                const hasNilai = nilai !== null;

                return (
                  <div
                    key={penguji.id ?? idx}
                    className="flex items-center gap-4 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 p-4 rounded-xl shadow-sm relative overflow-hidden group"
                  >
                    {/* Decorative side bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${hasNilai ? 'bg-blue-500' : 'bg-gray-300 dark:bg-neutral-700'}`}></div>

                    <div className="flex-1 pl-2">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                        {penguji.nama ?? "-"}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {roleLabel(penguji.peran)}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-gray-400 mb-0.5 tracking-wider">Nilai Akhir</div>
                      {hasNilai ? (
                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          {nilai}
                        </div>
                      ) : (
                        <div className="text-sm font-medium text-gray-400 italic">
                          Belum dinilai
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Summary Section (Optional) */}
              {selected?.penguji && selected.penguji.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-neutral-800 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Rata-rata Nilai</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {(() => {
                      let total = 0;
                      let count = 0;
                      selected.penguji.forEach(p => {
                        const n = nilaiAkhirDosen(selected, p.id);
                        if (n !== null) {
                          total += n;
                          count++;
                        }
                      });
                      return count > 0 ? (total / count).toFixed(2) : "-";
                    })()}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 dark:bg-neutral-800/30 rounded-xl border border-dashed border-gray-200 dark:border-neutral-800">
              <div className="p-3 bg-white dark:bg-neutral-800 rounded-full mb-3 shadow-sm">
                <IconClipboardText size={20} className="text-gray-400" />
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-200">Belum ada data penilaian</div>
              <div className="text-xs text-gray-500 mt-1">Penilaian belum tersedia untuk ujian ini.</div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
