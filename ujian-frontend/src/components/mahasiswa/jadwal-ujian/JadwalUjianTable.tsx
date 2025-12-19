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
  Clock,
  MapPin,
  User,
  Check,
} from "lucide-react";
import { IconClipboardText } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

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
import { DataCard } from "@/components/common/DataCard";
import { ScrollArea } from "@/components/ui/scroll-area";
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

  const [openDaftarHadir, setOpenDaftarHadir] = useState(false);
  // State untuk modal detail jadwal ujian
  const [openDetail, setOpenDetail] = useState(false);

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
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Tambahkan state untuk filter status
  const [filterStatus, setFilterStatus] = useState<
    "all" | "selesai" | "dijadwalkan"
  >("all");

  // Jenis ujian statis
  const jenisUjianOptions = ["Ujian Proposal", "Ujian Hasil", "Ujian Skripsi"];

  // Filtered data
  const filteredData = useMemo(() => {
    let data = jadwalUjian;
    if (filterJadwal === "mine" && userId) {
      data = data.filter((ujian) => ujian.mahasiswa?.id === userId);
    }
    // Filter status selesai/dijadwalkan jika dipilih
    if (filterStatus !== "all") {
      data = data.filter(
        (ujian) => ujian.pendaftaranUjian?.status === filterStatus
      );
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
  }, [
    jadwalUjian,
    filterNama,
    filterJenis,
    filterJadwal,
    userId,
    filterStatus,
  ]);

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

  // Ambil penilaian saat modal rekap dibuka
  useEffect(() => {
    // Fetch penilaian untuk seluruh jadwal ujian yang ditampilkan
    Promise.all(
      paginatedData.map((ujian) => getPenilaianByUjianId(ujian.id))
    ).then((results) => {
      // Gabungkan semua penilaian
      setPenilaianData(results.flat());
    });
  }, [paginatedData]);

  function nilaiAkhirTotalUjian(ujian: Ujian) {
    return ujian.nilaiAkhir;
  }

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
    else if (status === "belum diterima")
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
      cell: (info) => {
        const row = info.row.original;
        return (
          <div>
            <div>{row.mahasiswa?.nama ?? "-"}</div>
            <div className="text-xs text-muted-foreground">
              {row.mahasiswa?.nim ?? ""}
            </div>
          </div>
        );
      },
    }),
    // Tambahkan kolom Judul (tampilkan seluruh judul, batasi lebar dengan wrapping)
    columnHelper.accessor((row) => row.judulPenelitian ?? "-", {
      id: "judul",
      header: "Judul",
      cell: (info) => (
        <span
          className="block max-w-[320px] whitespace-normal break-words"
          title={info.getValue()}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor((row) => row.jenisUjian?.namaJenis ?? "-", {
      id: "jenis",
      header: "Jenis Ujian",
      cell: (info) => (
        <span className=" px-2 py-1 rounded font-medium inline-block bg-blue-50 text-blue-600">
          {info.getValue()}
        </span>
      ),
    }),

    // Tambahkan aksi lihat penguji dengan icon Eye di tabel
    columnHelper.display({
      id: "lihatPenguji",
      header: "Penguji",
      cell: (info) => (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Lihat Penguji"
          onClick={() => {
            setSelected(info.row.original);
            setOpenDaftarHadir(true);
          }}
        >
          <Eye size={18} />
        </Button>
      ),
    }),
    columnHelper.display({
      id: "nilaiAkhir",
      header: "Nilai Akhir",
      cell: (info) => {
        const nilai = nilaiAkhirTotalUjian(info.row.original);
        return (
          <div className="text-center w-full">
            {nilai !== null ? nilai : <span className="text-gray-400">-</span>}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "aksi",
      header: "",
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
                {/* Hapus Lihat Penguji di dropdown, karena sudah ada tombol khusus */}
                <DropdownMenuItem
                  onClick={() => {
                    setSelected(ujian);
                    setOpenDetail(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg"
                >
                  <IconClipboardText size={16} />
                  <span>Lihat Detail</span>
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

  // Komponen modal detail jadwal ujian dengan layout lebih bagus
  function JadwalDetailModal({
    ujian,
    open,
    onClose,
  }: {
    ujian: Ujian | null;
    open: boolean;
    onClose: () => void;
  }) {
    if (!open || !ujian) return null;
    return (
      <Modal open={open} onClose={onClose}>
        <div className="w-full max-w-lg">
          <div className="flex items-center gap-2 mb-4">
            <IconClipboardText size={22} className="text-blue-500" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Detail Jadwal Ujian
            </span>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            {/* Judul Penelitian */}
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                Judul Penelitian:
              </span>
              <span className="ml-1 text-gray-900 dark:text-white">
                {ujian.judulPenelitian ?? "-"}
              </span>
            </div>
            {/* Mahasiswa dan NIM */}
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                Mahasiswa:
              </span>
              <span className="ml-1 text-gray-900 dark:text-white">
                {ujian.mahasiswa?.nama ?? "-"}
              </span>
              {ujian.mahasiswa?.nim && (
                <span className="ml-2 text-xs text-muted-foreground">
                  ({ujian.mahasiswa.nim})
                </span>
              )}
            </div>
            {/* Info Ruangan, Hari, Waktu */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  Ruangan:
                </span>
                <span className="ml-1 text-gray-900 dark:text-white">
                  {ujian.ruangan?.namaRuangan ?? "-"}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  Hari:
                </span>
                <span className="ml-1 text-gray-900 dark:text-white">
                  {ujian.hariUjian
                    ? ujian.hariUjian.charAt(0).toUpperCase() +
                      ujian.hariUjian.slice(1)
                    : "-"}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  Waktu:
                </span>
                <span className="ml-1 text-gray-900 dark:text-white">
                  {(ujian.waktuMulai?.slice(0, 5) || "-") +
                    " - " +
                    (ujian.waktuSelesai?.slice(0, 5) || "-")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <DataCard className="w-full max-w-full">
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
            <PopoverContent className="w-[200px] p-0" align="end">
              <ScrollArea className="max-h-[300px] p-1">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Jenis Ujian
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-between h-8 px-2 font-normal ${
                    filterJenis === "all" ? "bg-accent text-accent-foreground font-medium" : ""
                  }`}
                  onClick={() => setFilterJenis("all")}
                >
                  <span className="text-sm">Semua</span>
                  {filterJenis === "all" && <Check size={14} className="ml-auto" />}
                </Button>
                {jenisUjianOptions.map((jenis) => (
                  <Button
                    key={jenis}
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-between h-8 px-2 font-normal ${
                      filterJenis === jenis ? "bg-accent text-accent-foreground font-medium" : ""
                    }`}
                    onClick={() => setFilterJenis(jenis)}
                  >
                    <span className="text-sm">{jenis}</span>
                    {filterJenis === jenis && <Check size={14} className="ml-auto" />}
                  </Button>
                ))}
                
                <div className="my-1 h-px bg-border" />
                
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Jadwal
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-between h-8 px-2 font-normal ${
                    filterJadwal === "all" ? "bg-accent text-accent-foreground font-medium" : ""
                  }`}
                  onClick={() => setFilterJadwal("all")}
                >
                  <span className="text-sm">Semua Jadwal</span>
                  {filterJadwal === "all" && <Check size={14} className="ml-auto" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-between h-8 px-2 font-normal ${
                    filterJadwal === "mine" ? "bg-accent text-accent-foreground font-medium" : ""
                  }`}
                  onClick={() => setFilterJadwal("mine")}
                >
                  <span className="text-sm">Jadwal Saya</span>
                  {filterJadwal === "mine" && <Check size={14} className="ml-auto" />}
                </Button>
              </ScrollArea>
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
        {/* Tabs untuk filter status selesai/dijadwalkan */}
        <div className="flex w-full mt-2">
          <Tabs
            value={filterStatus}
            onValueChange={(v) =>
              setFilterStatus(v as "all" | "selesai" | "dijadwalkan")
            }
          >
            <TabsList className="bg-muted rounded-md p-1 gap-2">
              <TabsTrigger
                value="all"
                className="px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Semua
              </TabsTrigger>
              <TabsTrigger
                value="dijadwalkan"
                className="px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Dijadwalkan
              </TabsTrigger>
              <TabsTrigger
                value="selesai"
                className="px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Selesai
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Table/Card view */}
      {viewMode === "table" ? (
        <TableGlobal table={table} cols={columns} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {paginatedData.map((ujian, idx) => {
            const judul = ujian.judulPenelitian ?? "-";
            const jenis = ujian.jenisUjian?.namaJenis ?? "-";
            const ruangan = ujian.ruangan?.namaRuangan ?? "-";
            const hari = ujian?.hariUjian
              ? ujian.hariUjian.charAt(0).toUpperCase() +
                ujian.hariUjian.slice(1)
              : "-";
            const tanggal = ujian.jadwalUjian
              ? new Date(ujian.jadwalUjian).toLocaleDateString("id-ID", {
                 day: "numeric", month: "short", year: "numeric"
              })
              : "-";
            const waktu =
              (ujian.waktuMulai?.slice(0, 5) || "-") +
              " - " +
              (ujian.waktuSelesai?.slice(0, 5) || "-");
            const status = ujian.pendaftaranUjian?.status ?? "-";
            const nilaiAkhir = nilaiAkhirTotalUjian(ujian);



            // Status badge color logic
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
                {/* Decoration Gradient */}
                <div className={`absolute top-0 right-0 p-4 opacity-5 pointer-events-none`}>
                    <Calendar size={100} />
                </div>
                
                <div className="p-5 flex flex-col gap-4 flex-1 z-10">
                     {/* Header */}
                     <div className="flex justify-between items-start">
                         <div className="flex flex-col gap-1">
                             <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                 {jenis}
                             </span>
                             <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
                                 <Calendar size={13} />
                                 <span>{hari}, {tanggal}</span>
                             </div>
                         </div>
                         <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}>
                             {status}
                         </span>
                     </div>

                     {/* Title */}
                     <h3 className="font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2" title={ujian.judulPenelitian}>
                         {ujian.judulPenelitian || "Judul tidak tersedia"}
                     </h3>

                     {/* Details Grid */}
                     <div className="grid grid-cols-2 gap-3 text-xs mt-1">
                         <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-neutral-800/50 p-2 rounded-lg">
                             <Clock size={14} className="shrink-0 text-blue-500" />
                             <span className="truncate">{waktu}</span>
                         </div>
                         <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-neutral-800/50 p-2 rounded-lg">
                             <MapPin size={14} className="shrink-0 text-red-500" />
                             <span className="truncate">{ruangan}</span>
                         </div>
                         <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-neutral-800/50 p-2 rounded-lg col-span-2">
                             <User size={14} className="shrink-0 text-green-500" />
                             <span className="truncate">Mahasiswa: {ujian.mahasiswa?.nama ?? "-"}</span>
                         </div>
                     </div>
                     
                     {/* Footer: Grade */}
                      <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-100 dark:border-neutral-800">
                        <div className="flex flex-col">
                             <span className="text-[10px] text-gray-400 font-medium">Nilai Akhir</span>
                             <span className="text-sm font-bold text-gray-900 dark:text-white">
                                {nilaiAkhir !== null ? nilaiAkhir : "-"}
                             </span>
                        </div>
                        
                        {/* Actions Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelected(ujian);
                                  setOpenDaftarHadir(true);
                                }}
                                className="cursor-pointer"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                <span>Lihat Penguji</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelected(ujian);
                                  setOpenDetail(true);
                                }}
                                className="cursor-pointer"
                              >
                                <IconClipboardText className="mr-2 h-4 w-4" />
                                <span>Lihat Detail</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                     </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Lihat Penguji */}
      <Modal open={openDaftarHadir} onClose={() => setOpenDaftarHadir(false)}>
        <div className="w-full max-w-md">
          <div className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <Eye size={20} className="text-blue-500" />
            Daftar Penguji
          </div>
          {selected?.penguji && selected.penguji.length > 0 ? (
            <ul className="space-y-3">
              {selected.penguji.map((penguji, idx) => (
                <li
                  key={penguji.id ?? idx}
                  className="flex items-center justify-between bg-gray-50 dark:bg-neutral-800 rounded-lg px-4 py-3 shadow-sm border border-gray-100 dark:border-neutral-700"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {penguji.nama ?? "-"}
                    </span>
                    <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-200 w-fit">
                      {roleLabel(penguji.peran)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getHadirStatus(selected, penguji.id) ? (
                      <span className="inline-flex items-center gap-1 text-green-600 text-xs font-semibold bg-green-50 dark:bg-green-900 px-2 py-1 rounded">
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                        Hadir
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 text-xs font-semibold bg-red-50 dark:bg-red-900 px-2 py-1 rounded">
                        <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                        Tidak Hadir
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-muted-foreground">
              Belum ada data penguji.
            </div>
          )}
        </div>
      </Modal>
      {/* Modal Detail Jadwal Ujian */}
      <JadwalDetailModal
        ujian={selected}
        open={openDetail}
        onClose={() => setOpenDetail(false)}
      />
      {/* Modal Rekapitulasi Nilai dihapus */}
    </DataCard>
  );
}
