/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  Check,
  Settings2,
  Calendar,
  AlertCircle,
  Eye,
  Download,
  List,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import TableGlobal from "@/components/tableGlobal";
import { getStatusColor } from "@/lib/utils";
import { DataCard } from "@/components/common/DataCard";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Ujian } from "@/types/Ujian";
import { BeritaUjian } from "@/types/BeritaUjian";
import { useNilaiUjianTable } from "@/hooks/mahasiswa/useNilaiUjianTable";
import { getNilaiHuruf } from "@/utils/mahasiswa/pdfUtils";

export default function NilaiUjianTable({ ujian }: { ujian: Ujian[] }) {
  const hook = useNilaiUjianTable(ujian);

  // Helper untuk render rekap (karena dipakai di modal)
  // Bisa dipindahkan ke component terpisah jika mau, tapi ok di sini sementara
  // Logic render sama dengan sebelumnya, hanya data dari hook.penilaian

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
        <div className=" max-w-[200px] text-sm truncate">
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
          ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
          : jenis.includes("hasil")
            ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
            : jenis.includes("skripsi")
              ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
              : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${badgeClass}`}
          >
            {row.getValue("jenis")}
          </span>
        );
      },
      size: 90,
    },
    {
      accessorFn: (row: BeritaUjian) => row.nilaiAkhir ?? 0,
      id: "nilaiAkhir",
      header: () => <div className="text-center">Nilai Akhir</div>,
      cell: ({ row }: any) => (
        <div className="flex items-center justify-center gap-1.5 font-medium">
          <span>{Number(row.getValue("nilaiAkhir") || 0).toFixed(2)}</span>

          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <div className="cursor-help text-gray-400 hover:text-primary transition-colors">
                  <AlertCircle size={14} />
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-xl p-3 rounded-xl">
                <div className="flex flex-col gap-1 text-xs">
                  <span className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                    Skala Nilai
                  </span>
                  <div className="grid grid-cols-[20px_1fr] gap-x-2 gap-y-1">
                    <span className="font-semibold text-green-600">A</span>{" "}
                    <span className="text-gray-500">: 80 – 100</span>
                    <span className="font-semibold text-blue-600">B</span>{" "}
                    <span className="text-gray-500">: 70 – 79.99</span>
                    <span className="font-semibold text-yellow-600">
                      C
                    </span>{" "}
                    <span className="text-gray-500">: 60 – 69.99</span>
                    <span className="font-semibold text-orange-600">
                      D
                    </span>{" "}
                    <span className="text-gray-500">: 56 – 59.99</span>
                    <span className="font-semibold text-red-600">E</span>{" "}
                    <span className="text-gray-500">: &lt; 56</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
      size: 100,
    },

    {
      accessorFn: (row: BeritaUjian) => row.hasil ?? "-",
      id: "hasil",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }: any) => {
        const hasil = row.getValue("hasil")?.toLowerCase();
        return hasil && hasil !== "" ? (
          <div className="flex items-center justify-center">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(
                hasil,
              )}`}
            >
              {hasil}
            </span>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
      size: 100,
    },
    {
      accessorFn: (row: BeritaUjian) => row.catatan ?? "-",
      id: "catatan",
      header: () => <div className="text-center">Catatan</div>,
      cell: ({ row }: any) => {
        const catatan = row.getValue("catatan");
        if (!catatan || catatan === "-")
          return (
            <div className="flex justify-center">
              <span className="text-gray-400">-</span>
            </div>
          );

        return (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                // hook handler
                hook.setSelectedCatatan(catatan);
                hook.setOpenCatatanDialog(true);
              }}
              className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <Eye size={16} />
            </Button>
          </div>
        );
      },
      size: 80,
    },
    {
      id: "aksi",
      header: () => <div className="text-center">Aksi</div>,
      cell: ({ row }: any) => {
        const item = row.original;

        return (
          <div className="flex justify-center items-center gap-1">
            {/* Tombol Detail */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      hook.handleDetail(item);
                    }}
                    className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <Eye size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Lihat Detail</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
      size: 100,
    },
  ];

  // TableGlobal config
  const tableConfig = {
    getRowModel: () => ({
      rows: hook.paginatedData.map((item, idx) => ({
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
                  if (col.accessorFn) return (col.accessorFn as any)(item);
                  return (item as any)[key];
                },
              },
              table: tableConfig,
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
          getContext: () => ({ table: tableConfig }),
        })),
      },
    ],
    // Pagination handlers from hook
    previousPage: () => hook.setPage((p) => Math.max(1, p - 1)),
    nextPage: () => hook.setPage((p) => Math.min(hook.totalPage, p + 1)),
    getCanPreviousPage: () => hook.page > 1,
    getCanNextPage: () => hook.page < hook.totalPage,
    getFilteredRowModel: () => ({
      rows: hook.filteredData.map((item, idx) => ({
        // simplified mock
        id: item.id,
        index: idx,
        original: item,
      })),
    }),
    getPreFilteredRowModel: () => ({
      rows: ujian.map((item, idx) => ({
        id: item.id,
        index: idx,
        original: item,
      })),
    }),
    getState: () => ({
      pagination: { pageIndex: hook.page - 1, pageSize: hook.pageSize },
    }),
    getPageCount: () => hook.totalPage,
    setPageIndex: (p: number) => hook.setPage(p + 1),
  };

  return (
    <DataCard>
      {/* Detail Modal */}
      <Dialog open={hook.openDialog} onOpenChange={hook.setOpenDialog}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[90vh]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-50 dark:border-neutral-800 flex items-center justify-between shrink-0 bg-white dark:bg-neutral-900">
            <div>
              <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
                Rekapitulasi Hasil Ujian
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Rincian penilaian dan status kelulusan mahasiswa.
              </DialogDescription>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {hook.selected && (
              <div className="p-6 space-y-8">
                {/* 1. Hero Card */}
                <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/50 p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                    <div className="flex items-center gap-5">
                      <div className="h-16 w-16 rounded-full bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 flex items-center justify-center shrink-0">
                        <span className="font-bold text-2xl text-primary">
                          {hook.selected.mahasiswa?.nama?.charAt(0) ?? "M"}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            Mahasiswa
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                          {hook.selected.mahasiswa?.nama ?? "-"}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                          NIM: {hook.selected.mahasiswa?.nim ?? "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                        Status Kelulusan
                      </span>
                      {(() => {
                        const affectedExams = [
                          "seminar proposal",
                          "ujian hasil",
                          "ujian skripsi",
                        ];
                        const currentExamType =
                          hook.selected.jenisUjian?.namaJenis?.toLowerCase() ||
                          "";
                        const isExamRuleActive = affectedExams.some((t) =>
                          currentExamType.includes(t),
                        );

                        const hasScoreBelowThreshold = hook.penilaian.some(
                          (p: any) => (p.nilai ?? 0) <= 60,
                        );
                        const forcedFail =
                          isExamRuleActive && hasScoreBelowThreshold;

                        let displayStatus =
                          hook.selected.hasil ?? "Belum Ada Hasil";
                        if (forcedFail) displayStatus = "TIDAK LULUS";

                        return (
                          <span
                            className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize border shadow-sm
                                ${getStatusColor(displayStatus)}
                             `}
                          >
                            {displayStatus}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* 2. Main Content Stack */}
                <div className="flex flex-col gap-8">
                  {/* Exam Details */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">
                        <span className="p-1.5 rounded-md bg-gray-100 dark:bg-neutral-800 text-gray-500">
                          <List size={14} />
                        </span>
                        Judul Penelitian
                      </h4>
                      <div className="p-4 bg-gray-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800 rounded-xl">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed italic text-center sm:text-left">
                          "{hook.selected.judulPenelitian ?? "-"}"
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-gray-400 uppercase">
                          Jenis Ujian
                        </div>
                        <div
                          className={`inline-flex items-center px-4 py-3 rounded-xl text-sm font-bold border gap-2 w-full justify-center sm:justify-start
                                ${
                                  hook.selected.jenisUjian?.namaJenis
                                    ?.toLowerCase()
                                    .includes("proposal")
                                    ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
                                    : hook.selected.jenisUjian?.namaJenis
                                          ?.toLowerCase()
                                          .includes("hasil")
                                      ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800"
                                      : "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800"
                                }`}
                        >
                          <Settings2 size={16} />
                          {hook.selected.jenisUjian?.namaJenis ?? "-"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-gray-400 uppercase">
                          Tanggal Ujian
                        </div>
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-sm font-medium text-gray-700 dark:text-gray-300 w-full justify-center sm:justify-start">
                          <Calendar size={16} className="text-gray-400" />
                          {hook.selected.jadwalUjian
                            ? new Date(
                                hook.selected.jadwalUjian,
                              ).toLocaleDateString("id-ID", {
                                dateStyle: "full",
                              })
                            : "-"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Score Card Section */}
                  <div>
                    <div className="rounded-3xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 shadow-sm">
                      {(() => {
                        const pengujiMap: Record<number, { total: number }> =
                          {};
                        hook.penilaian.forEach((p) => {
                          if (!pengujiMap[p.dosenId])
                            pengujiMap[p.dosenId] = { total: 0 };
                          const bobot = p.komponenPenilaian?.bobot ?? 0;
                          pengujiMap[p.dosenId].total +=
                            ((p.nilai ?? 0) * bobot) / 100;
                        });
                        const totalNilai = Object.values(pengujiMap).reduce(
                          (acc, cur) => acc + cur.total,
                          0,
                        );
                        const jumlahPenguji =
                          Object.keys(pengujiMap).length || 1;
                        const rataRata = totalNilai / jumlahPenguji;

                        // Rule Check
                        const affectedExams = [
                          "seminar proposal",
                          "ujian hasil",
                          "ujian skripsi",
                        ];
                        const currentExamType =
                          hook.selected.jenisUjian?.namaJenis?.toLowerCase() ||
                          "";
                        const isExamRuleActive = affectedExams.some((t) =>
                          currentExamType.includes(t),
                        );
                        const hasScoreBelowThreshold = hook.penilaian.some(
                          (p: any) => (p.nilai ?? 0) <= 60,
                        );
                        const forcedFail =
                          isExamRuleActive && hasScoreBelowThreshold;

                        let nilaiHuruf = getNilaiHuruf(rataRata);
                        if (forcedFail) nilaiHuruf = "E";

                        return (
                          <div className="flex flex-col sm:flex-row items-center justify-around gap-8">
                            <div className="relative shrink-0">
                              {/* Grade Circle */}
                              <div
                                className={`w-32 h-32 rounded-full flex items-center justify-center text-7xl font-black shadow-xl ring-4 ring-white dark:ring-neutral-800
                                              ${
                                                nilaiHuruf === "A"
                                                  ? "bg-emerald-500 text-white"
                                                  : nilaiHuruf === "B"
                                                    ? "bg-blue-500 text-white"
                                                    : nilaiHuruf === "C"
                                                      ? "bg-amber-500 text-white"
                                                      : "bg-red-500 text-white"
                                              }
                                           `}
                              >
                                {nilaiHuruf}
                              </div>
                              {/* Score Label */}
                              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-base font-bold px-4 py-1.5 rounded-full shadow-lg border border-gray-100 dark:border-neutral-700 whitespace-nowrap">
                                {hook.selected.nilaiAkhir ?? "0.0"}
                              </div>
                            </div>

                            <div className="w-full sm:w-auto flex-1 max-w-sm space-y-4 text-center sm:text-left">
                              <div>
                                <h5 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-1">
                                  Hasil Akhir
                                </h5>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Mahasiswa memperoleh predikat{" "}
                                  <strong className="text-gray-900 dark:text-white">
                                    {nilaiHuruf}
                                  </strong>{" "}
                                  dengan nilai rata-rata{" "}
                                  <strong className="text-gray-900 dark:text-white">
                                    {rataRata.toFixed(2)}
                                  </strong>
                                  .
                                </p>
                                {forcedFail && (
                                  <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium bg-red-50 dark:bg-red-900/10 p-2 rounded-lg border border-red-100 dark:border-red-900/20">
                                    Status: TIDAK LULUS (Terdapat nilai kriteria
                                    ≤ 60)
                                  </p>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col p-3 bg-gray-50 dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-neutral-800">
                                  <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">
                                    Total Nilai
                                  </span>
                                  <span className="font-mono font-bold text-gray-800 dark:text-gray-200 text-xl">
                                    {totalNilai.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex flex-col p-3 bg-gray-50 dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-neutral-800">
                                  <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">
                                    Rata-rata
                                  </span>
                                  <span className="font-mono font-bold text-gray-800 dark:text-gray-200 text-xl">
                                    {rataRata.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer with Actions */}
          <div className="p-4 border-t border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900 flex justify-end gap-3 shrink-0">
            <DialogClose asChild>
              <Button variant="outline">Tutup</Button>
            </DialogClose>

            <Button
              disabled={
                hook.selected?.pendaftaranUjian?.status !== "selesai" ||
                hook.selected?.hasil?.toLowerCase() !== "lulus"
              }
              onClick={() =>
                hook.selected && hook.handleDownloadSuratLulus(hook.selected)
              }
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm shadow-blue-500/20"
            >
              <Download size={16} />
              Surat Keterangan Lulus
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Catatan */}
      <Dialog
        open={hook.openCatatanDialog}
        onOpenChange={hook.setOpenCatatanDialog}
      >
        <DialogContent className="max-w-md bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-xl shadow-2xl p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="p-2 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                <AlertCircle size={18} />
              </span>
              Catatan / Revisi Penguji
            </DialogTitle>
          </DialogHeader>

          <div className="bg-gray-50 dark:bg-neutral-800/50 p-4 rounded-xl border border-gray-100 dark:border-neutral-800">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {hook.selectedCatatan}
            </p>
          </div>

          <DialogFooter className="mt-6">
            <Button
              onClick={() => hook.setOpenCatatanDialog(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search, Filter, and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end sm:gap-4 gap-2 mb-4">
        <div className="flex w-full items-center gap-2 sm:gap-2">
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>
            <Input
              type="text"
              placeholder="Search"
              value={hook.search}
              onChange={(e) => hook.setSearch(e.target.value)}
              className="border rounded-lg pl-10 pr-3 py-2 w-full bg-white dark:bg-neutral-800 text-sm"
            />
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  onClick={hook.handleDownloadRekapNilai}
                  className="h-9 px-3 gap-2 bg-primary hover:bg-primary/80 text-white shadow-sm shadow-primary/20 border-0"
                  title="Download Rekap Nilai Skripsi"
                >
                  <Download size={16} />
                  <span className="sr-only sm:not-sr-only">Rekap</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download Rekap Nilai Skripsi</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex items-center gap-2 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 grid place-items-center bg-white dark:bg-neutral-800"
                  aria-label="Filter status"
                  title="Filter status"
                >
                  <Settings2 size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] p-0">
                <ScrollArea className="max-h-[300px] p-1">
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    Jenis Ujian
                  </div>
                  {["all", "proposal", "hasil", "skripsi"].map((opt) => {
                    const isActive = hook.jenisFilter === opt;
                    return (
                      <DropdownMenuItem
                        key={opt}
                        onClick={() => hook.setJenisFilter(opt as any)}
                        className={`flex items-center justify-between text-sm px-2 py-1.5 cursor-pointer ${
                          isActive
                            ? "bg-accent text-accent-foreground font-medium"
                            : ""
                        }`}
                      >
                        <span className="capitalize">
                          {opt === "all" ? "Semua" : opt}
                        </span>
                        {isActive && <Check size={14} />}
                      </DropdownMenuItem>
                    );
                  })}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <TableGlobal
        table={tableConfig}
        cols={cols}
        emptyMessage="Belum ada data nilai ujian."
      />
    </DataCard>
  );
}
