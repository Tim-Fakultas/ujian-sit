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
      id: "status",
      header: "Status",
      cell: (info) => statusBadge(info.row.original.pendaftaranUjian.status),
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
                      {ujian.mahasiswa?.id === userId && (
                        <DropdownMenuItem
                          onClick={() => {
                            setSelected(ujian);
                            setOpenRekapitulasi(true);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2"
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
          <div className="text-lg font-semibold mb-2">Daftar Penguji</div>
          {selected?.penguji && selected.penguji.length > 0 ? (
            <ul className="space-y-2">
              {selected.penguji.map((penguji, idx) => (
                <li key={penguji.id ?? idx} className="flex items-center gap-2">
                  <span className="font-medium">{penguji.nama ?? "-"}</span>
                  <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                    {roleLabel(penguji.peran)}
                  </span>
                  {getHadirStatus(selected, penguji.id) ? (
                    <span className="text-green-600 text-xs ml-2">Hadir</span>
                  ) : (
                    <span className="text-red-600 text-xs ml-2">
                      Tidak Hadir
                    </span>
                  )}
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

      {/* Modal Rekapitulasi Nilai */}
      <Modal open={openRekapitulasi} onClose={() => setOpenRekapitulasi(false)}>
        <div>
          <div className="text-lg font-semibold mb-2">Rekapitulasi Nilai</div>
          {loadingPenilaian ? (
            <div className="text-center py-4">Memuat data...</div>
          ) : penilaianData && penilaianData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-3 py-2 border">Penguji</th>
                    <th className="px-3 py-2 border">Peran</th>
                    <th className="px-3 py-2 border">Nilai Akhir</th>
                  </tr>
                </thead>
                <tbody>
                  {selected?.penguji?.map((penguji, idx) => (
                    <tr key={penguji.id ?? idx}>
                      <td className="px-3 py-2 border">
                        {penguji.nama ?? "-"}
                      </td>
                      <td className="px-3 py-2 border">
                        {roleLabel(penguji.peran)}
                      </td>
                      <td className="px-3 py-2 border">
                        {(() => {
                          const nilai = nilaiAkhirDosen(selected, penguji.id);
                          return nilai !== null ? nilai : "-";
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Belum ada data penilaian.
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
