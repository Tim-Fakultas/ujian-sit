/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";

import { BeritaUjian } from "@/types/BeritaUjian";
import {
  X,
  Search,
  MoreHorizontal,
  Check,

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
import SearchInput from "@/components/common/Search";
import { useUrlFilter } from "@/hooks/use-url-filter";
import { useDebounce } from "@/hooks/use-debounce";

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

  // Search state managed locally with debounce
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 300);

  // Filter states managed by URL
  // Note: we cast the return string to the specific union type
  const [jenisFilter, setJenisFilter] = useUrlFilter("jenis", "all") as [
    "all" | "proposal" | "hasil" | "skripsi",
    (val: string) => void,
    boolean
  ];

  const [hasilFilter, setHasilFilter] = useUrlFilter("hasil", "all") as [
    "all" | "lulus" | "tidak lulus",
    (val: string) => void,
    boolean
  ];

  const [filterBulan, setFilterBulan] = useUrlFilter("bulan", "all");
  const [filterTahun, setFilterTahun] = useUrlFilter("tahun", "all");

  // Filter data berdasarkan search, jenis ujian, hasil, bulan, tahun
  const filteredData = ujian.filter((item) => {
    const nama = item.mahasiswa?.nama?.toLowerCase() ?? "";
    const judul = item.judulPenelitian?.toLowerCase() ?? "";
    const searchLower = (debouncedQ || "").toLowerCase();
    const matchSearch = nama.includes(searchLower) || judul.includes(searchLower);

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
  }, [debouncedQ, jenisFilter, hasilFilter, filterBulan, filterTahun]);

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
          ? "bg-primary/10 text-primary"
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
              <span className="font-extrabold text-lg text-primary dark:text-primary tracking-wide">
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
                          ? "bg-primary/10 text-primary"
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
                    <span className="font-extrabold text-primary text-lg">
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

        <div className="flex w-full md:w-auto items-center gap-2 sm:gap-2">
          <div className="relative flex-1 md:w-[300px] md:flex-none">
            <SearchInput
              placeholder="Search"
              className="w-full"
              value={q}
              onChange={setQ}
              disableUrlParams={true}
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


        </div>
        {/* Tabs for view mode */}
      </div>

      {/* Table Mode */}
      <TableGlobal table={table} cols={cols} />

    </div>
  );
}
