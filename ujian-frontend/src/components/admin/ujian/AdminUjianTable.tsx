/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { getAllDosen } from "@/actions/data-master/dosen";
import { getKomponenPenilaianByUjianByPeran } from "@/actions/data-master/komponenPenilaian";
import { getAllUsers } from "@/actions/user";
import { showToast } from "@/components/ui/custom-toast";

import { Button } from "@/components/ui/button";
import Search from "@/components/common/Search";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Check,
  Settings2,
  Calendar,
  AlertCircle,
  Eye,
  Download,
  List,
  MoreHorizontal,
  FileText,
  FileDown,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Helper untuk konversi nilai ke huruf
function getNilaiHuruf(n: number): string {
  if (n >= 80) return "A";
  if (n >= 70) return "B";
  if (n >= 60) return "C";
  if (n >= 56) return "D";
  return "E";
}

import { downloadBerkasUjian } from "./pdfGenerator";

export default function AdminUjianTable({ ujian }: { ujian: any[] }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [penilaian, setPenilaian] = useState<any[]>([]);

  // State untuk modal catatan
  const [openCatatanDialog, setOpenCatatanDialog] = useState(false);
  const [selectedCatatan, setSelectedCatatan] = useState<string>("");

  // Ambil penilaian ketika modal detail dibuka
  useEffect(() => {
    if (openDialog && selected?.id) {
      getPenilaianByUjianId(selected.id).then((data) => setPenilaian(data));
    }
  }, [openDialog, selected?.id]);

  // Tambah state untuk search
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  // The USER asked to use the "Search which already uses debounce".
  // Looking at /components/common/Search.tsx, it uses 'useUrlSearch' by default OR 'onChange' if 'disableUrlParams' is true.
  // It doesn't seem to have built-in debounce logic for the 'onChange' callback in the provided snippet (Active Document 460).
  // Wait, the USER said "use search that ALREADY uses debounce".
  // Let me re-read Search.tsx content from Step 460.
  // It just calls setUrlSearch or controlledOnChange directly.
  // UseUrlSearch hook likely has debounce or the user implies I should use 'useDebounce' hook here.
  // OR the user considers the Search component to BE the "solution" even if I need to add debounce.
  // Let's check 'use-debounce' hook existence/usage elsewhere (e.g. from JadwalUjianTable in step 365).
  // Step 365 showing JadwalUjianTable uses 'useDebounce'.

  // Let's import useDebounce and apply it to the local search state.
  // Tambah state untuk filter jenis ujian
  const [jenisFilter, setJenisFilter] = useState<
    "all" | "proposal" | "hasil" | "skripsi"
  >("all");

  const [hasilFilter, setHasilFilter] = useState<
    "all" | "lulus" | "tidak lulus"
  >("all");

  const filteredData = ujian.filter((item) => {
    const nama = item.mahasiswa?.nama?.toLowerCase() ?? "";
    const judul = item.judulPenelitian?.toLowerCase() ?? "";
    const q = debouncedSearch.toLowerCase();
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

    return matchSearch && matchJenis && matchHasil;
  });

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPage = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  // Reset page ke 1 saat search atau filter berubah
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, jenisFilter, hasilFilter]);

  const handleDetail = (ujian: any) => {
    setSelected(ujian);
    setOpenDialog(true);
  };
  // PDF download logic moved to pdfGenerator.ts
  const handleDownloadBerkas = async (item: any) => {
    await downloadBerkasUjian(item);
  };

  const handleDownloadJadwalUjian = () => {
    const doc = new jsPDF("l", "mm", "a4");
    let finalY = 15;

    const categories = [
      { key: "proposal", title: "SEMINAR PROPOSAL" },
      { key: "hasil", title: "UJIAN HASIL" },
      { key: "skripsi", title: "UJIAN SKRIPSI" },
    ];

    let hasPrintedAny = false;

    categories.forEach((cat) => {
      const catData = filteredData.filter((u) =>
        u.jenisUjian?.namaJenis?.toLowerCase().includes(cat.key),
      );

      if (catData.length === 0) return;
      hasPrintedAny = true;

      if (finalY > 15) {
        finalY += 15;
        if (finalY > 180) {
          doc.addPage();
          finalY = 15;
        }
      }

      doc.setFontSize(14);
      doc.setFont("times", "bold");
      doc.text(cat.title, 14, finalY);

      doc.setFont("times", "normal");
      doc.setFontSize(10);

      const tableData = catData.map((u, index) => {
        const getPengujiName = (role: string) => {
          const p = u.penguji?.find((px: any) => px.peran === role);
          return p ? p.nama : "";
        };

        return [
          index + 1,
          u.mahasiswa?.nim || "-",
          u.mahasiswa?.nama || "-",
          u.jadwalUjian
            ? `${new Date(u.jadwalUjian).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "numeric",
                year: "numeric",
              })}\n${u.waktuMulai?.slice(0, 5)} s.d ${u.waktuSelesai?.slice(0, 5)}`
            : "Belum dijadwalkan",
          `${u.ruangan?.namaRuangan || "-"}\n(Ruang Ujian)`,
          u.judulPenelitian || "-",
          getPengujiName("ketua_penguji"),
          getPengujiName("sekretaris_penguji"),
          getPengujiName("penguji_1"),
          getPengujiName("penguji_2"),
        ];
      });

      autoTable(doc, {
        head: [
          [
            "NO",
            "NIM",
            "NAMA",
            "WAKTU",
            "Ruang",
            "JUDUL",
            "KETUA PENGUJI",
            "SEKRETARIS PENGUJI",
            "PENGUJI I",
            "PENGUJI II",
          ],
        ],
        body: tableData,
        startY: finalY + 5,
        theme: "grid",
        styles: {
          fontSize: 7,
          cellPadding: 2,
          valign: "middle",
          font: "times",
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
        },
        headStyles: {
          fillColor: [34, 197, 94],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center",
        },
        columnStyles: {
          0: { cellWidth: 8, halign: "center" },
          1: { cellWidth: 20 },
          2: { cellWidth: 40 },
          3: { cellWidth: 25 },
          4: { cellWidth: 15, halign: "center" },
          5: { cellWidth: 45 },
          6: { cellWidth: 28 },
          7: { cellWidth: 28 },
          8: { cellWidth: 28 },
          9: { cellWidth: 28 },
        },
      });

      finalY = (doc as any).lastAutoTable.finalY;
    });

    if (!hasPrintedAny) {
      doc.text("Tidak ada data jadwal ujian.", 14, 15);
    }

    doc.save(`Jadwal_Ujian_${new Date().toLocaleDateString("id-ID")}.pdf`);
  };

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
      accessorFn: (row: any) => row.mahasiswa?.nama ?? "-",
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
      size: 150,
    },
    {
      accessorFn: (row: any) => row.judulPenelitian ?? "-",
      id: "judul",
      header: "Judul",
      cell: ({ row }: any) => (
        <div className="max-w-[300px] text-sm truncate">
          {row.getValue("judul")}
        </div>
      ),
      size: 200,
    },
    {
      accessorFn: (row: any) => row.jenisUjian?.namaJenis ?? "-",
      id: "jenis",
      header: "Jenis",
      cell: ({ row }: any) => {
        const jenis = row.getValue("jenis")?.toLowerCase() ?? "";
        const badgeClass = jenis.includes("proposal")
          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
          : jenis.includes("hasil")
            ? "bg-blue-50 text-blue-700 border-blue-200"
            : "bg-green-50 text-green-700 border-green-200";
        return (
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${badgeClass}`}
          >
            {row.getValue("jenis")}
          </span>
        );
      },
      size: 100,
    },
    {
      accessorFn: (row: any) => row.hasil ?? "-",
      id: "hasil",
      header: "Status",
      cell: ({ row }: any) => {
        const hasil = row.getValue("hasil")?.toLowerCase();
        return (
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(hasil)}`}
          >
            {hasil || "Belum Selesai"}
          </span>
        );
      },
      size: 100,
    },
    {
      id: "aksi",
      header: "Aksi",
      cell: ({ row }: any) => (
        <div className="flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDetail(row.original)}
                  className="h-8 w-8 text-blue-600"
                >
                  <Eye size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Lihat Detail</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDownloadBerkas(row.original)}
                  className="h-8 w-8 text-emerald-600"
                  title="Export Berkas (PDF)"
                >
                  <Download size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download Berkas Lengkap</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
      size: 100,
    },
  ];

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
    getState: () => ({ pagination: { pageIndex: page - 1, pageSize } }),
    getPageCount: () => totalPage,
    setPageIndex: (p: number) => setPage(p + 1),
  };

  return (
    <DataCard>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search
            placeholder="Search mahasiswa or judul..."
            disableUrlParams={true}
            value={search}
            onChange={setSearch}
          />
        </div>
      </div>

      <TableGlobal table={table} cols={cols} />

      {/* Detail Modal */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Detail Penilaian Ujian</DialogTitle>
            <DialogDescription>
              Rincian data mahasiswa dan penilaian dosen.
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg bg-gray-50 dark:bg-neutral-800/50">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">
                    Nama Mahasiswa
                  </p>
                  <p className="font-semibold">
                    {selected.mahasiswa?.nama || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">
                    NIM
                  </p>
                  <p className="font-semibold">
                    {selected.mahasiswa?.nim || "-"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-bold text-gray-500 uppercase">
                    Judul
                  </p>
                  <p className="text-sm italic">
                    "{selected.judulPenelitian || "-"}"
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold border-b pb-1">Penilaian Dosen</h4>
                {penilaian.length === 0 ? (
                  <p className="text-sm italic text-gray-400">
                    Belum ada penilaian.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {/* Grouping penilaian by dosen for display */}
                    {Array.from(new Set(penilaian.map((p) => p.dosenId))).map(
                      (dosenId) => {
                        const dosenPenilaian = penilaian.filter(
                          (p) => p.dosenId === dosenId,
                        );
                        const first = dosenPenilaian[0];
                        const total = dosenPenilaian.reduce(
                          (acc, p) =>
                            acc +
                            (p.nilai * (p.komponenPenilaian?.bobot || 0)) / 100,
                          0,
                        );
                        return (
                          <div
                            key={dosenId}
                            className="border rounded-lg p-3 bg-white dark:bg-neutral-900"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <p className="font-bold text-blue-600">
                                {first.dosen?.nama}
                              </p>
                              <p className="text-sm font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                Total: {total.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-xs space-y-1">
                              {dosenPenilaian.map((p, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between border-b border-dashed py-1 last:border-0"
                                >
                                  <span>
                                    {p.komponenPenilaian?.namaKomponen} (
                                    {p.komponenPenilaian?.bobot}%)
                                  </span>
                                  <span className="font-mono">{p.nilai}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Tutup</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DataCard>
  );
}
