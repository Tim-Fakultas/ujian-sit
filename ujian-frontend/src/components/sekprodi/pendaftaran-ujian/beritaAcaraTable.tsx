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
          className={`bg-white dark:bg-neutral-900 w-full ${width} mx-4 rounded-xl shadow-xl border animate-in slide-in-from-bottom duration-200 overflow-y-auto max-h-[90vh]`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-xl dark:bg-[#1f1f1f]">
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
          <div className="p-6 space-y-6">{children}</div>
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

      {/* ========== MODAL DETAIL (DESAIN DITINGKATKAN) ========== */}
      <Modal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        title="Detail Berita Acara Ujian"
        width="max-w-4xl"
      >
        {selected && (
          <div className="space-y-6">
            {/* header ringkas */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-sm text-muted-foreground">
                  {selected.hariUjian ? capitalize(selected.hariUjian) : "Hari"}
                  ,{" "}
                  <span className="font-medium">
                    {selected.jadwalUjian
                      ? new Date(selected.jadwalUjian).toLocaleDateString(
                          "id-ID",
                          { day: "numeric", month: "long", year: "numeric" }
                        )
                      : "-"}
                  </span>
                </div>
                <div className="mt-2 text-lg font-semibold">
                  {selected.mahasiswa?.nama ?? "-"}
                </div>
                <div className="text-sm text-muted-foreground">
                  NIM: {selected.mahasiswa?.nim ?? "-"}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="inline-flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Jenis Ujian
                  </span>
                  <span className="px-2 py-1 text-sm rounded bg-muted/30 font-medium">
                    {selected.jenisUjian?.namaJenis ?? "-"}
                  </span>
                </div>
                <div className="mt-3 text-sm text-muted-foreground ">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      Ruangan:
                    </span>{" "}
                    {selected.ruangan?.namaRuangan ?? "-"}
                  </div>
                  <div className="mt-1">
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      Waktu:
                    </span>{" "}
                    {selected.waktuMulai?.slice(0, 5) ?? "-"} —{" "}
                    {selected.waktuSelesai?.slice(0, 5) ?? "-"}
                  </div>
                </div>
              </div>
            </div>

            {/* Responsive grid for modal detail */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Main: Judul & keputusan */}
              <div className="lg:col-span-2 space-y-4">
                <div className="border rounded-lg p-4 bg-white dark:bg-neutral-800 shadow-sm">
                  <h3 className="text-sm text-muted-foreground">
                    Judul Penelitian
                  </h3>
                  <p className="mt-2 text-sm font-semibold whitespace-pre-wrap break-words leading-relaxed">
                    {selected.judulPenelitian ?? "-"}
                  </p>
                </div>

                <div className="border rounded-lg p-4 bg-white dark:bg-neutral-800 h-35 shadow-sm">
                  <h3 className="text-sm text-muted-foreground">Keputusan</h3>
                  <div className="mt-3">
                    {selected.jenisUjian?.namaJenis
                      ?.toLowerCase()
                      .includes("proposal") ? (
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded font-semibold ${
                            selected?.hasil?.toLowerCase() === "lulus"
                              ? "bg-green-100 text-green-700"
                              : selected?.hasil?.toLowerCase() === "tidak lulus"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {selected?.hasil?.toUpperCase() || "lulus"}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm font-medium">
                          {selected.keputusan?.namaKeputusan ??
                            (selected as any)?.keputusan ??
                            "-"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Penguji & kehadiran */}
              <div className="space-y-4 w-full">
                <div className="border rounded-lg p-3 bg-white dark:bg-neutral-800 shadow-sm w-full">
                  <h4 className="text-sm text-muted-foreground mb-3">
                    Penguji
                  </h4>
                  <div className="space-y-3">
                    {selected.penguji.map((row, i) => {
                      // { changed code }
                      // gunakan id untuk lookup status
                      const status = getStatusHadir(row.id);
                      const badge =
                        status === "hadir"
                          ? "bg-green-100 text-green-700"
                          : status === "izin"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700";
                      return (
                        <div
                          key={row.id ?? i}
                          className="flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              {/* tampilkan status di atas nama */}
                              <div className="mb-1">
                                <span
                                  className={`px-2 py-0.5 text-xs rounded-full font-medium ${badge}`}
                                >
                                  {status === "hadir"
                                    ? "Hadir"
                                    : status === "izin"
                                    ? "Izin"
                                    : "Tidak Hadir"}
                                </span>
                              </div>
                              <div className="text-sm font-medium">
                                {row.nama ?? "-"}
                              </div>
                            </div>
                          </div>
                          <div></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Catatan / Daftar Revisi (card tersendiri, tampil di bawah grid) */}
              <div className="lg:col-span-3">
                <div className="border rounded-lg p-4 bg-white dark:bg-neutral-800 shadow-sm">
                  <h4 className="text-sm text-muted-foreground mb-2">
                    Catatan / Daftar Revisi Penguji
                  </h4>
                  <div className="overflow-hidden">
                    <Textarea
                      className="w-full min-h-[120px] resize-none bg-transparent"
                      defaultValue={selected.catatan ?? "Tidak ada catatan."}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* actions */}
            <div className="flex justify-end pt-6 border-t mt-6">
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Tutup
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
