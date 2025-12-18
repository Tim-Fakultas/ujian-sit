/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";

import { BeritaUjian } from "@/types/BeritaUjian";
import { Button } from "../../ui/button";
import {
  X,
  Search,
  MoreHorizontal,
  Check,
  LayoutGrid,
  List,
  Settings2,
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
} from "lucide-react";
import { truncateTitle } from "@/lib/utils";
import { daftarKehadiran } from "@/types/DaftarKehadiran";

import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableGlobal from "@/components/tableGlobal";

export default function BeritaAcaraUjianTable({
  beritaUjian,
  daftarKehadiran,
}: {
  beritaUjian: BeritaUjian[];
  daftarKehadiran: daftarKehadiran[];
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState<BeritaUjian | null>(null);

  // Tambah state untuk search
  const [search, setSearch] = useState("");
  // Tambah state untuk filter jenis ujian
  const [jenisFilter, setJenisFilter] = useState<
    "all" | "proposal" | "hasil" | "skripsi"
  >("all");

  const [hasilFilter, setHasilFilter] = useState<
    "all" | "lulus" | "tidak lulus"
  >("all");

  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  // Tambah state untuk filter bulan dan tahun
  const [filterBulan, setFilterBulan] = useState<string>("all");
  const [filterTahun, setFilterTahun] = useState<string>("all");

  // Filter data berdasarkan search, jenis ujian, hasil, bulan, tahun
  const filteredData = beritaUjian.filter((item) => {
    const nama = item.mahasiswa?.nama?.toLowerCase() ?? "";
    const judul = item.judulPenelitian?.toLowerCase() ?? "";
    const q = search.toLowerCase();
    const matchSearch = nama.includes(q) || judul.includes(q);

    let matchJenis = true;
    if (jenisFilter !== "all") {
      const jenis = item.jenisUjian?.namaJenis?.toLowerCase() ?? "";
      matchJenis = jenis.includes(jenisFilter);
    }

    let matchHasil = true;
    if (hasilFilter !== "all") {
      matchHasil = (item.hasil?.toLowerCase() ?? "") === hasilFilter;
    }

    // Filter bulan
    let matchBulan = true;
    if (filterBulan !== "all") {
      if (!item.jadwalUjian) matchBulan = false;
      else {
        const bulan = String(new Date(item.jadwalUjian).getMonth() + 1);
        matchBulan = bulan === filterBulan;
      }
    }
    // Filter tahun
    let matchTahun = true;
    if (filterTahun !== "all") {
      if (!item.jadwalUjian) matchTahun = false;
      else {
        const tahun = String(new Date(item.jadwalUjian).getFullYear());
        matchTahun = tahun === filterTahun;
      }
    }
    return matchSearch && matchJenis && matchHasil && matchBulan && matchTahun;
  });

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPage = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Reset page ke 1 saat search atau filter berubah
  React.useEffect(() => {
    setPage(1);
  }, [search, jenisFilter, hasilFilter, filterBulan, filterTahun]);

  const handleDetail = (ujian: BeritaUjian) => {
    setSelected(ujian);
    setOpenDialog(true);
  };

  const getStatusHadir = (dosenId?: number) => {
    if (!dosenId) return null;
    const kehadiran = daftarKehadiran.find((d) => d.dosenId === dosenId);
    return kehadiran?.statusKehadiran ?? null;
  };

  /** 🔹 Modal Wrapper */
  const Modal = ({
    open,
    onClose,
    children,
    title,
    width = "max-w-3xl",
  }: {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    width?: string;
  }) => {
    if (!open) return null;
    return (
      <div
        className="fixed inset-0 z-50 dark:bg-neutral-900 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className={`bg-white dark:bg-neutral-900 w-full ${width} mx-4 rounded-xl shadow-xl border animate-in slide-in-from-bottom duration-200 flex flex-col max-h-[90vh]`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-xl dark:bg-[#1f1f1f] shrink-0">
            <h2 className="text-lg font-semibold dark:text-white">{title}</h2>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 "
              onClick={onClose}
            >
              <X size={18} />
            </Button>
          </div>
          <div className="p-6 space-y-6 overflow-y-auto">{children}</div>
        </div>
      </div>
    );
  };

  // helper: kapitalisasi huruf pertama (untuk nama hari seperti "rabu" -> "Rabu")
  function capitalize(s?: string) {
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // Kolom untuk TableGlobal
  const cols = [
    {
      id: "no",
      header: "No",
      cell: ({ row, table }: any) => {
        const index =
          (table.getState().pagination?.pageIndex ?? 0) *
            (table.getState().pagination?.pageSize ?? 10) +
          row.index +
          1;
        return <div>{index}</div>;
      },
      size: 36,
    },
    {
      accessorFn: (row: BeritaUjian) => row.mahasiswa?.nama ?? "-",
      id: "mahasiswa",
      header: "Mahasiswa",
      cell: ({ row }: any) => (
        <div>
          {row.getValue("mahasiswa")}
          <br />
          <span className="text-xs text-gray-500">
            {row.original.mahasiswa?.nim ?? "-"}
          </span>
        </div>
      ),
      size: 120,
    },
    {
      accessorFn: (row: BeritaUjian) => row.judulPenelitian ?? "-",
      id: "judul",
      header: "Judul",
      cell: ({ row }: any) => (
        <div className="whitespace-pre-line break-words max-w-[240px] text-xs">
          {row.getValue("judul")}
        </div>
      ),
      size: 180,
    },
    {
      accessorFn: (row: BeritaUjian) => row.jenisUjian?.namaJenis ?? "-",
      id: "jenis",
      header: "Jenis",
      cell: ({ row }: any) => {
        const jenis = row.getValue("jenis")?.toLowerCase() ?? "";
        const badgeClass = jenis.includes("proposal")
          ? "bg-blue-100 text-blue-700"
          : jenis.includes("hasil")
          ? "bg-yellow-100 text-yellow-700"
          : jenis.includes("skripsi")
          ? "bg-green-100 text-green-700"
          : "bg-gray-100";
        return (
          <span className={`px-2 py-1 rounded font-medium ${badgeClass}`}>
            {row.getValue("jenis")}
          </span>
        );
      },
      size: 90,
    },
    // {
    //   accessorFn: (row: BeritaUjian) => row.nilaiAkhir ?? "-",
    //   id: "nilaiAkhir",
    //   header: "Nilai Akhir",
    //   cell: ({ row }: any) => (
    //     <div className="text-center">{row.getValue("nilaiAkhir")}</div>
    //   ),
    //   size: 70,
    // },
    // {
    //   accessorFn: (row: BeritaUjian) => row.hasil ?? "-",
    //   id: "hasil",
    //   header: "Hasil",
    //   cell: ({ row }: any) => {
    //     const hasil = row.getValue("hasil")?.toLowerCase();
    //     const badgeClass =
    //       hasil === "lulus"
    //         ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
    //         : hasil === "tidak lulus"
    //         ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
    //         : "bg-gray-100 dark:bg-gray-800 dark:text-gray-200";
    //     return hasil && hasil !== "-" ? (
    //       <span className={`px-2 py-1 rounded font-semibold ${badgeClass}`}>
    //         {row.getValue("hasil")}
    //       </span>
    //     ) : (
    //       "-"
    //     );
    //   },
    //   size: 70,
    // },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }: any) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDetail(row.original)}
          className="hover:bg-gray-200"
        >
          <MoreHorizontal size={16} />
        </Button>
      ),
      size: 60,
    },
  ];

  // TableGlobal setup
  const table = {
    getRowModel: () => ({
      rows: paginatedData.map((item, idx) => ({
        id: item.id,
        index: idx,
        original: item,
        getVisibleCells: () =>
          cols.map((col) => ({
            id: col.id,
            column: { columnDef: col },
            getContext: () => ({
              row: {
                index: idx,
                original: item,
                getValue: (key: string) => {
                  if (col.accessorFn) return col.accessorFn(item);
                  // Hindari akses dinamis ke properti tanpa index signature
                  return (item as any)[key];
                },
              },
              table,
            }),
          })),
        getIsSelected: () => false,
      })),
    }),
    getHeaderGroups: () => [
      {
        id: "main",
        headers: cols.map((col) => ({
          id: col.id,
          isPlaceholder: false,
          column: { columnDef: col },
          getContext: () => ({ table }),
        })),
      },
    ],
    previousPage: () => setPage((p) => Math.max(1, p - 1)),
    nextPage: () => setPage((p) => Math.min(totalPage, p + 1)),
    getCanPreviousPage: () => page > 1,
    getCanNextPage: () => page < totalPage,
    getPageCount: () => totalPage,
    setPageIndex: (index: number) => setPage(index + 1),
    getFilteredRowModel: () => ({
      rows: filteredData.map((item, idx) => ({
        id: item.id,
        index: idx,
        original: item,
        getVisibleCells: () =>
          cols.map((col) => ({
            id: col.id,
            column: { columnDef: col },
            getContext: () => ({
              row: {
                index: idx,
                original: item,
                getValue: (key: string) => {
                  if (col.accessorFn) return col.accessorFn(item);
                  // Hindari akses dinamis ke properti tanpa index signature
                  return (item as any)[key];
                },
              },
              table,
            }),
          })),
        getIsSelected: () => false,
      })),
    }),
    getPreFilteredRowModel: () => ({
      rows: beritaUjian.map((item, idx) => ({
        id: item.id,
        index: idx,
        original: item,
        getVisibleCells: () =>
          cols.map((col) => ({
            id: col.id,
            column: { columnDef: col },
            getContext: () => ({
              row: {
                index: idx,
                original: item,
                getValue: (key: string) => {
                  if (col.accessorFn) return col.accessorFn(item);
                  // Hindari akses dinamis ke properti tanpa index signature
                  return (item as any)[key];
                },
              },
              table,
            }),
          })),
        getIsSelected: () => false,
      })),
    }),
    getState: () => ({
      pagination: { pageIndex: page - 1, pageSize },
    }),
  };

  return (
    <div className="p-3 sm:p-6 bg-white dark:bg-neutral-900 rounded-lg border">
      {/* Search, Filter, and Tabs in one row (tabs below on mobile) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end sm:gap-4 gap-2 mb-4">
        {/* Search and Filter */}

        <div className="flex w-full  items-center gap-2 sm:gap-2">
          <div className="relative w-full ">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>
            <Input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg pl-10 pr-3 py-2 w-full bg-white dark:bg-neutral-800 text-sm"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 grid place-items-center"
                  aria-label="Filter status"
                  title="Filter status"
                >
                  <Settings2 size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[220px] p-3">
                <div className="mb-2 font-semibold text-xs text-muted-foreground">
                  Jenis Ujian
                </div>
                {["all", "proposal", "hasil", "skripsi"].map((opt) => {
                  const isActive = jenisFilter === opt;
                  return (
                    <DropdownMenuItem
                      key={opt}
                      onClick={() => setJenisFilter(opt as any)}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="text-sm">{opt}</span>
                      {isActive && (
                        <Check size={14} className="text-emerald-600" />
                      )}
                    </DropdownMenuItem>
                  );
                })}
                <div className="mt-3 font-semibold text-xs text-muted-foreground">
                  Hasil
                </div>
                {["all", "lulus", "tidak lulus"].map((opt) => {
                  const isActive = hasilFilter === opt;
                  return (
                    <DropdownMenuItem
                      key={opt}
                      onClick={() => setHasilFilter(opt as any)}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="text-sm capitalize">
                        {opt === "all" ? "Semua" : opt}
                      </span>
                      {isActive && (
                        <Check size={14} className="text-emerald-600" />
                      )}
                    </DropdownMenuItem>
                  );
                })}
                <div className="mt-3 font-semibold text-xs text-muted-foreground">
                  Bulan
                </div>
                <div className="flex flex-col gap-1 mb-2">
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={filterBulan === "all" ? "" : filterBulan}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFilterBulan(val === "" ? "all" : val);
                    }}
                    placeholder="Bulan (1-12)"
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
                <div className="font-semibold text-xs text-muted-foreground">
                  Tahun
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="number"
                    min={2000}
                    max={2100}
                    value={filterTahun === "all" ? "" : filterTahun}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFilterTahun(val === "" ? "all" : val);
                    }}
                    placeholder="Tahun"
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="">
            <Tabs
              value={viewMode}
              onValueChange={(v) => setViewMode(v as any)}
              className="sm:mb-0 h-9"
            >
              <TabsList>
                <TabsTrigger value="table">
                  <LayoutGrid size={16} />
                </TabsTrigger>
                <TabsTrigger value="card">
                  <List />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        {/* Tabs for view mode */}
      </div>

      {/* Table Mode */}
      {viewMode === "table" && <TableGlobal table={table} cols={cols} />}

      {/* Card Mode */}
      {viewMode === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedData.length > 0 ? (
            paginatedData.map((ujian) => (
              <div
                key={ujian.id}
                className="border rounded-lg bg-white dark:bg-neutral-800 shadow-xs p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">
                      {ujian.mahasiswa?.nama ?? "-"}
                    </div>
                    <span className="text-xs text-gray-500">
                      {ujian.mahasiswa.nim ?? "-"}
                    </span>
                  </div>
                  <div className="mb-2 text-sm font-medium">
                    {truncateTitle(ujian.judulPenelitian ?? "-", 50)}
                  </div>
                  <div className="mb-2">
                    <span
                      className={`px-2 py-1 rounded font-medium text-xs
                        ${
                          ujian.jenisUjian?.namaJenis
                            ?.toLowerCase()
                            .includes("proposal")
                            ? "bg-blue-100 text-blue-700"
                            : ujian.jenisUjian?.namaJenis
                                ?.toLowerCase()
                                .includes("hasil")
                            ? "bg-yellow-100 text-yellow-700"
                            : ujian.jenisUjian?.namaJenis
                                ?.toLowerCase()
                                .includes("skripsi")
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100"
                        }
                      `}
                    >
                      {ujian.jenisUjian?.namaJenis ?? "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs">Nilai Akhir:</span>
                    <span className="font-bold">{ujian.nilaiAkhir ?? "-"}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs">Hasil:</span>
                    {ujian.hasil ? (
                      <span
                        className={`px-2 py-1 rounded font-semibold text-xs
                          ${
                            ujian.hasil.toLowerCase() === "lulus"
                              ? "bg-green-100 text-green-700"
                              : ujian.hasil.toLowerCase() === "tidak lulus"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }
                        `}
                      >
                        {ujian.hasil}
                      </span>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDetail(ujian)}
                    className="hover:bg-gray-200"
                  >
                    <MoreHorizontal size={16} />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 italic py-6">
              Tidak ada berita acara ujian
            </div>
          )}
        </div>
      )}

      {/* ========== MODAL DETAIL (DESAIN MODERN) ========== */}
      <Modal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        title="Detail Berita Acara Ujian"
        width="max-w-4xl"
      >
        {selected && (
          <div className="space-y-6">
            {/* Header Section: Mahasiswa & Waktu */}
            <div className="border-b pb-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-neutral-800 px-2.5 py-1 rounded-md">
                    <Calendar size={14} />
                    <span>
                      {selected.hariUjian
                        ? capitalize(selected.hariUjian)
                        : "Hari"}
                      ,{" "}
                      {selected.jadwalUjian
                        ? new Date(selected.jadwalUjian).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "long", year: "numeric" }
                          )
                        : "-"}
                    </span>
                  </div>
                  <div className="hidden sm:block text-gray-300">|</div>
                  <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-neutral-800 px-2.5 py-1 rounded-md">
                    <Clock size={14} />
                    <span>
                      {selected.waktuMulai?.slice(0, 5) ?? "-"} —{" "}
                      {selected.waktuSelesai?.slice(0, 5) ?? "-"}
                    </span>
                  </div>
                   <div className="hidden sm:block text-gray-300">|</div>
                   <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-neutral-800 px-2.5 py-1 rounded-md">
                      <MapPin size={14} />
                      <span className="font-medium">{selected.ruangan?.namaRuangan ?? "-"}</span>
                   </div>
                </div>
                <div>
                   <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase
                        ${
                          selected.jenisUjian?.namaJenis
                            ?.toLowerCase()
                            .includes("proposal")
                            ? "bg-blue-50 text-blue-700 border border-blue-100"
                            : selected.jenisUjian?.namaJenis
                                ?.toLowerCase()
                                .includes("hasil")
                            ? "bg-yellow-50 text-yellow-700 border border-yellow-100"
                            : selected.jenisUjian?.namaJenis
                                ?.toLowerCase()
                                .includes("skripsi")
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : "bg-gray-100 border border-gray-200"
                        }
                      `}
                    >
                      {selected.jenisUjian?.namaJenis ?? "-"}
                    </span>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {selected.mahasiswa?.nama ?? "-"}
                </h2>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-mono bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-xs">
                    {selected.mahasiswa?.nim ?? "-"}
                  </span>
                  <span>•</span>
                  <span>{selected.mahasiswa?.prodi?.namaProdi ?? "Teknologi Informasi"}</span>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Details */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Judul Penelitian */}
                <div className="bg-white dark:bg-neutral-800 rounded-xl border p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Search size={14} /> Judul Penelitian
                  </h3>
                   <p className="text-base font-medium leading-relaxed text-gray-800 dark:text-gray-200">
                    {selected.judulPenelitian ?? "-"}
                  </p>
                </div>

                {/* Hasil & Nilai */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-xl border text-center">
                        <span className="text-xs text-gray-500 uppercase font-semibold">Nilai Akhir</span>
                        <div className="text-3xl font-bold text-emerald-600 mt-1">
                            {selected.nilaiAkhir ?? "-"}
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-xl border text-center">
                        <span className="text-xs text-gray-500 uppercase font-semibold">Hasil Ujian</span>
                        <div className={`text-xl font-bold mt-2 capitalize ${
                             selected.hasil?.toLowerCase() === 'lulus' ? 'text-green-600' : 
                             selected.hasil?.toLowerCase() === 'tidak lulus' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                            {selected.hasil ?? "-"}
                        </div>
                    </div>
                 </div>

                 {/* Keputusan (Full Width) */}
                 {selected.keputusan && (
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
                         <span className="text-xs text-blue-600 dark:text-blue-400 uppercase font-semibold">Keputusan Akhir</span>
                          <div className="text-lg font-medium text-blue-900 dark:text-blue-200 mt-1">
                             {selected.keputusan.namaKeputusan}
                          </div>
                    </div>
                 )}

                 {/* Catatan */}
                 <div className="bg-white dark:bg-neutral-800 rounded-xl border p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <FileText size={14} /> Catatan / Revisi
                    </h3>
                    <div className="bg-gray-50 dark:bg-neutral-900/50 p-4 rounded-lg border">
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {selected.catatan || "Tidak ada catatan penguji."}
                        </p>
                    </div>
                 </div>

              </div>

              {/* Right Column: Dosen Penguji */}
              <div className="space-y-4">
                  <div className="bg-white dark:bg-neutral-800 rounded-xl border p-5 shadow-sm h-full">
                       <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <User size={14} /> Tim Penguji
                       </h3>
                       <div className="space-y-4">
                          {selected.penguji.map((p, idx) => {
                               const status = getStatusHadir(p.id);
                               const isHadir = status === 'hadir';
                               const isIzin = status === 'izin';
                               
                               return (
                                   <div key={idx} className="relative pl-4 border-l-2 border-gray-100 last:border-0 pb-1">
                                       <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-2 ring-white
                                           ${isHadir ? 'bg-green-500' : isIzin ? 'bg-yellow-500' : 'bg-gray-300'}
                                       `}></div>
                                       <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                                                {p.nama}
                                            </p>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-xs text-gray-500 capitalize">{p.peran.replace(/_/g, " ")}</span>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border
                                                    ${isHadir 
                                                        ? 'bg-green-50 text-green-700 border-green-100' 
                                                        : isIzin
                                                        ? 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                                        : 'bg-gray-50 text-gray-600 border-gray-200'}
                                                `}>
                                                    {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Belum Isi"}
                                                </span>
                                            </div>
                                       </div>
                                   </div>
                               )
                          })}
                       </div>
                  </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end pt-4 border-t mt-4">
              <Button onClick={() => setOpenDialog(false)}>
                Tutup
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
