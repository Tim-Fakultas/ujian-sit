/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";

import { BeritaUjian } from "@/types/BeritaUjian";
import {
  X,
  Search,
  MoreHorizontal,
  Check,
  LayoutGrid,
  List,
  Settings2,
  Calendar,
} from "lucide-react";
import { truncateTitle } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableGlobal from "@/components/tableGlobal";
import { getPenilaianByUjianId } from "@/actions/penilaian";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export default function RekapitulasiNilaiTable({
  ujian,
}: {
  ujian: BeritaUjian[];
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState<BeritaUjian | null>(null);
  const [penilaian, setPenilaian] = useState<any[]>([]);

  // Ambil penilaian ketika modal detail dibuka
  useEffect(() => {
    if (openDialog && selected?.id) {
      getPenilaianByUjianId(selected.id).then((data) => setPenilaian(data));
    }
  }, [openDialog, selected?.id]);

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
  const filteredData = ujian.filter((item) => {
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
  useEffect(() => {
    setPage(1);
  }, [search, jenisFilter, hasilFilter, filterBulan, filterTahun]);

  const handleDetail = (ujian: BeritaUjian) => {
    setSelected(ujian);
    setOpenDialog(true);
  };

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
      rows: ujian.map((item, idx) => ({
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
    getPageCount: () => totalPage,
    setPageIndex: (p: number) => setPage(p + 1),
  };

  // Modern minimalist penguji rekap
  function renderRekapPenilaian() {
    if (!penilaian || penilaian.length === 0) {
      return (
        <div className="text-sm text-gray-400 italic">
          Tidak ada data penilaian.
        </div>
      );
    }
    const pengujiMap: Record<
      number,
      { nama: string; nidn: string; total: number }
    > = {};
    penilaian.forEach((p) => {
      if (!pengujiMap[p.dosenId]) {
        pengujiMap[p.dosenId] = {
          nama: p.dosen?.nama || "-",
          nidn: p.dosen?.nidn || "-",
          total: 0,
        };
      }
      const bobot = p.komponenPenilaian?.bobot ?? 0;
      pengujiMap[p.dosenId].total += ((p.nilai ?? 0) * bobot) / 100;
    });

    return (
      <div className="flex flex-col gap-4">
        {Object.values(pengujiMap).map((penguji, idx) => (
          <div
            key={penguji.nidn + idx}
            className="rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-neutral-800 dark:to-neutral-900 border border-gray-100 dark:border-neutral-800 px-6 py-4 flex flex-col gap-1 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-base text-gray-900 dark:text-white">
                {penguji.nama}
              </span>
              <span className="ml-2 text-xs text-gray-400 font-normal">
                NIDN: {penguji.nidn}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500">Total Nilai:</span>
              <span className="font-extrabold text-lg text-blue-600 dark:text-blue-400 tracking-wide">
                {penguji.total.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Helper untuk konversi nilai ke huruf
  function getNilaiHuruf(n: number): string {
    if (n >= 80) return "A";
    if (n >= 70) return "B";
    if (n >= 60) return "C";
    if (n >= 56) return "D";
    return "E";
  }

  return (
    <div className="p-3 sm:p-6 bg-white dark:bg-neutral-900 rounded-2xl border ">
      {/* Detail Modal */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-sm p-0 overflow-hidden h-[90vh]">
          <DialogHeader className="border-b px-6 pt-6 pb-3 bg-gradient-to-br from-gray-50 to-white dark:from-neutral-900 dark:to-neutral-950">
            <DialogTitle className="flex items-center gap-2">
              <span>Rekapitulasi Nilai</span>
            </DialogTitle>
            <DialogDescription>Rekap penilaian penguji</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] px-6 py-4">
            {selected && (
              <div className="flex flex-col gap-5">
                {/* Mahasiswa & NIM */}
                <div>
                  <div className="text-xs text-gray-500 mb-1">Mahasiswa</div>
                  <div className="font-semibold text-lg text-gray-900 dark:text-white">
                    {selected.mahasiswa?.nama ?? "-"}
                  </div>
                  <div className="text-xs text-gray-400">
                    NIM: {selected.mahasiswa?.nim ?? "-"}
                  </div>
                </div>
                {/* Judul */}
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    Judul Penelitian
                  </div>
                  <div className="text-sm font-medium whitespace-pre-line break-words">
                    {selected.judulPenelitian ?? "-"}
                  </div>
                </div>
                {/* Jenis, Nilai Akhir, Hasil */}
                <div className="flex flex-wrap gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Jenis Ujian
                    </div>
                    <span
                      className={`px-2 py-1 rounded font-medium text-xs
                        ${selected.jenisUjian?.namaJenis
                          ?.toLowerCase()
                          .includes("proposal")
                          ? "bg-blue-100 text-blue-700"
                          : selected.jenisUjian?.namaJenis
                            ?.toLowerCase()
                            .includes("hasil")
                            ? "bg-yellow-100 text-yellow-700"
                            : selected.jenisUjian?.namaJenis
                              ?.toLowerCase()
                              .includes("skripsi")
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100"
                        }
                      `}
                    >
                      {selected.jenisUjian?.namaJenis ?? "-"}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Nilai Akhir
                    </div>
                    <span className="font-extrabold text-blue-600 text-lg">
                      {selected.nilaiAkhir ?? "-"}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Hasil</div>
                    {selected.hasil ? (
                      <span
                        className={`px-2 py-1 rounded font-semibold text-xs
                          ${selected.hasil.toLowerCase() === "lulus"
                            ? "bg-green-100 text-green-700"
                            : selected.hasil.toLowerCase() === "tidak lulus"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }
                        `}
                      >
                        {selected.hasil}
                      </span>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
                {/* Rekap Penilaian Penguji */}
                <div>
                  <div className="text-xs text-gray-500 mb-2 font-semibold">
                    Rekap Penilaian Penguji
                  </div>
                  {renderRekapPenilaian()}
                </div>
                {/* Total, Rata-rata, Nilai Huruf */}
                <div className="mt-2 rounded-xl border bg-gray-50 dark:bg-neutral-800 p-4 flex flex-col gap-2">
                  <div className="font-semibold text-xs text-gray-500 mb-1">
                    Rekapitulasi Nilai Akhimmr
                  </div>
                  {(() => {
                    // Hitung total nilai penguji
                    const pengujiMap: Record<number, { total: number }> = {};
                    penilaian.forEach((p) => {
                      if (!pengujiMap[p.dosenId])
                        pengujiMap[p.dosenId] = { total: 0 };
                      const bobot = p.komponenPenilaian?.bobot ?? 0;
                      pengujiMap[p.dosenId].total +=
                        ((p.nilai ?? 0) * bobot) / 100;
                    });
                    const totalNilai = Object.values(pengujiMap).reduce(
                      (acc, cur) => acc + cur.total,
                      0
                    );
                    const jumlahPenguji = Object.keys(pengujiMap).length || 1;
                    const rataRata = totalNilai / jumlahPenguji;
                    const nilaiHuruf = getNilaiHuruf(rataRata);

                    return (
                      <table className="w-full text-sm">
                        <tbody>
                          <tr>
                            <td className="py-1 text-gray-600 dark:text-gray-300">
                              Total Angka Nilai
                            </td>
                            <td className="py-1 font-bold text-right">
                              {totalNilai.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-1 text-gray-600 dark:text-gray-300">
                              Nilai Rata-rata
                            </td>
                            <td className="py-1 font-bold text-right">
                              {rataRata.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-1 text-gray-600 dark:text-gray-300">
                              Nilai Huruf
                            </td>
                            <td className="py-1 font-bold text-right">
                              {nilaiHuruf}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    );
                  })()}
                </div>
                {/* Interval Nilai */}
                <div className="mt-2 rounded-xl border bg-white dark:bg-neutral-900 p-4">
                  <div className="font-semibold text-xs text-gray-500 mb-2">
                    Catatan interval nilai:
                  </div>
                  <table className="text-xs w-full">
                    <tbody>
                      <tr>
                        <td className="pr-2">A</td>
                        <td>: 80.00 – 100</td>
                      </tr>
                      <tr>
                        <td>B</td>
                        <td>: 70.00 – 79.99</td>
                      </tr>
                      <tr>
                        <td>C</td>
                        <td>: 60.00 – 69.99</td>
                      </tr>
                      <tr>
                        <td>D</td>
                        <td>: 56.00 – 59.99</td>
                      </tr>
                      <tr>
                        <td>E</td>
                        <td>: {"<"} 55.99</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </ScrollArea>
          <DialogFooter className="px-6 pb-4 pt-2">
            <DialogClose asChild>
              <Button variant="outline">Tutup</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedData.length > 0 ? (
            paginatedData.map((ujian) => {


              const hasilColor = ujian.hasil?.toLowerCase() === 'lulus'
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200"
                : ujian.hasil?.toLowerCase() === 'tidak lulus'
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200"
                  : "bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-gray-400 border-gray-200";

              return (
                <div
                  key={ujian.id}
                  className={`group relative bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col`}
                >
                  <div className="p-5 flex flex-col gap-4 flex-1">

                    {/* Header: Date & Result */}
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                          <Calendar size={13} />
                          <span>
                            {ujian.jadwalUjian
                              ? new Date(ujian.jadwalUjian).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                              })
                              : "Tgl -"}
                          </span>
                        </div>
                      </div>

                      {ujian.hasil ? (
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${hasilColor}`}>
                          {ujian.hasil}
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Belum Dinilai</span>
                      )}
                    </div>

                    {/* Content: Title & Name */}
                    <div className="space-y-2">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2" title={ujian.judulPenelitian}>
                        {ujian.judulPenelitian || "Judul tidak tersedia"}
                      </h3>

                      <div className="flex items-center gap-2 pt-1">
                        <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                          {ujian.mahasiswa?.nama?.charAt(0) ?? "?"}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[180px]">
                            {ujian.mahasiswa?.nama ?? "-"}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {ujian.mahasiswa?.nim ?? "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Info: Type & Grade */}
                    <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-100 dark:border-neutral-800">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold 
                             ${ujian.jenisUjian?.namaJenis?.toLowerCase().includes("proposal") ? "bg-blue-100 text-blue-700" :
                          ujian.jenisUjian?.namaJenis?.toLowerCase().includes("hasil") ? "bg-yellow-100 text-yellow-700" :
                            ujian.jenisUjian?.namaJenis?.toLowerCase().includes("skripsi") ? "bg-green-100 text-green-700" : "bg-gray-100"
                        }
                        `}>
                        {ujian.jenisUjian?.namaJenis ?? "-"}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Nilai:</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {ujian.nilaiAkhir ?? "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="bg-gray-50/50 dark:bg-neutral-800/50 p-3 flex items-center justify-end border-t border-gray-100 dark:border-neutral-800">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDetail(ujian)}
                      className="text-xs h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                    >
                      <MoreHorizontal size={14} className="mr-1.5" /> Detail
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 gap-3">
              <div className="p-4 rounded-full bg-gray-50 dark:bg-neutral-800">
                <List size={24} className="opacity-50" />
              </div>
              <p className="text-muted-foreground">Tidak ada data rekapitulasi nilai.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
