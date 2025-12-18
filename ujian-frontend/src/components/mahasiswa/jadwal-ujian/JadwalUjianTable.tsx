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
                {/* Jadwal Filter */}
                <div>
                  <div className="text-xs font-semibold mb-1 text-muted-foreground">
                    Jadwal
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={filterJadwal === "all" ? "secondary" : "ghost"}
                      size="sm"
                      className="rounded"
                      onClick={() => setFilterJadwal("all")}
                    >
                      Semua Jadwal
                    </Button>
                    <Button
                      variant={filterJadwal === "mine" ? "secondary" : "ghost"}
                      size="sm"
                      className="rounded"
                      onClick={() => setFilterJadwal("mine")}
                    >
                      Jadwal Saya
                    </Button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
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
            const nilaiAkhir = nilaiAkhirTotalUjian(ujian);
            return (
              <div
                key={ujian.id ?? idx}
                className="border rounded-lg p-4 bg-white dark:bg-neutral-800 shadow-sm flex flex-col h-full relative"
              >
                {/* Status badge kanan atas */}
                <div className="absolute top-4 right-4">
                  {statusBadge(status)}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-muted-foreground">
                    {hari}, {tanggal}
                  </div>
                  <div className="font-semibold text-base break-words whitespace-pre-line my-2">
                    {judul}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Jenis: {jenis}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Ruangan: {ruangan}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Waktu: {waktu}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Nilai Akhir:{" "}
                    {nilaiAkhir !== null ? (
                      <span className="font-semibold ">{nilaiAkhir}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelected(ujian);
                          setOpenDaftarHadir(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2"
                      >
                        <Eye size={16} />
                        <span>Lihat Penguji</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelected(ujian);
                          setOpenDetail(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2"
                      >
                        <IconClipboardText size={16} />
                        <span>Lihat Detail</span>
                      </DropdownMenuItem>
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
    </div>
  );
}
