/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";

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
  Eye,
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
import { DataCard } from "@/components/common/DataCard";
import { getPenilaianByUjianId } from "@/actions/penilaian";
import { updateStatusPendaftaranUjian } from "@/actions/pendaftaranUjian";
import { toast } from "sonner";
import { User } from "@/types/Auth";
import { ScrollArea } from "@/components/ui/scroll-area";
// Custom Modal Component for wider layout
const Modal = ({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4 overflow-y-auto">
      <div 
        className="bg-white dark:bg-neutral-900 w-full max-w-[95vw] sm:max-w-[90vw] lg:max-w-7xl rounded-2xl shadow-2xl border dark:border-neutral-800 flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-neutral-800 shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"
          >
            <X size={20} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function RekapitulasiNilaiTable({
  ujian,
  user,
}: {
  ujian: BeritaUjian[];
  user?: User;
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState<BeritaUjian | null>(null);
  const [penilaian, setPenilaian] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Ambil penilaian ketika modal detail dibuka
  useEffect(() => {
    if (openDialog && selected?.id) {
      getPenilaianByUjianId(selected.id).then((data) => setPenilaian(data));
    }
  }, [openDialog, selected?.id]);

  const handleVerifikasi = async (pendaftaranId: number) => {
      try {
          setIsUpdating(true);
          await updateStatusPendaftaranUjian(pendaftaranId, "selesai");
          toast.success("Nilai berhasil diverifikasi dan status ujian selesai.");
          setOpenDialog(false);
          // Optional: You might want to refresh data here using a server action or router.refresh() 
          // if the parent page doesn't automatically revalidate.
          window.location.reload(); 
      } catch (error) {
          toast.error("Gagal memverifikasi nilai.");
          console.error(error);
      } finally {
          setIsUpdating(false);
      }
  };

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
      accessorFn: (row: BeritaUjian) => row.nilaiAkhir ?? "-",
      id: "nilaiAkhir",
      header: "Nilai Rata-rata",
      cell: ({ row }: any) => (
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {row.getValue("nilaiAkhir")}
        </div>
      ),
      size: 130,
    },
    {
      id: "predikat",
      header: "Predikat",
      cell: ({ row }: any) => {
        const nilai = parseFloat(row.getValue("nilaiAkhir")) || 0;
        const huruf = getNilaiHuruf(nilai);
        const colorClass =
          huruf === "A"
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : huruf === "B"
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            : huruf === "C"
            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

        return row.getValue("nilaiAkhir") ? (
          <span
            className={`px-2.5 py-0.5 rounded text-xs font-bold ${colorClass}`}
          >
            {huruf}
          </span>
        ) : (
          <span className="text-gray-400 text-xs">-</span>
        );
      },
      size: 80,
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
          variant="outline"
          size="sm"
          onClick={() => handleDetail(row.original)}
          className="h-8 text-xs font-medium gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
        >
          <Eye size={14} />
          Lihat Penilaian
        </Button>
      ),
      size: 140,
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

  // Modern minimalist penguji rekap with criteria breakdown
  function renderRekapPenilaian() {
    if (!penilaian || penilaian.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 dark:bg-neutral-800/30 rounded-xl border border-dashed border-gray-200 dark:border-neutral-800">
          <div className="text-sm font-medium text-gray-400">
            Belum ada data penilaian.
          </div>
        </div>
      );
    }

    // Grouping by Lecturer
    const pengujiMap: Record<
      number,
      {
        nama: string;
        nidn: string;
        total: number;
        kriteria: { nama: string; nilai: number; bobot: number }[];
      }
    > = {};

    penilaian.forEach((p) => {
      if (!pengujiMap[p.dosenId]) {
        pengujiMap[p.dosenId] = {
          nama: p.dosen?.nama || "-",
          nidn: p.dosen?.nidn || "-",
          total: 0,
          kriteria: [],
        };
      }
      
      const bobot = p.komponenPenilaian?.bobot ?? 0;
      const nilai = p.nilai ?? 0;
      const nilaiBobot = (nilai * bobot) / 100;
      
      pengujiMap[p.dosenId].total += nilaiBobot;
      
      const rawNama = p.komponenPenilaian?.namaKomponen || "Kriteria";
      // Remove suffixes like _1, _2
      const cleanNama = rawNama.replace(/_\d+$/, "").replace(/_/g, " ");

      pengujiMap[p.dosenId].kriteria.push({
        nama: cleanNama,
        nilai: nilai,
        bobot: bobot
      });
    });

    return (
      <div className="grid grid-cols-1 gap-6">
        {Object.values(pengujiMap).map((penguji, idx) => (
          <div
            key={penguji.nidn + idx}
            className="rounded-xl border border-gray-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900 shadow-sm transition-all hover:shadow-md"
          >
            {/* Header Penguji */}
            <div className="bg-gray-50/80 dark:bg-neutral-800/80 border-b border-gray-100 dark:border-neutral-800 p-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white dark:bg-neutral-700 flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-neutral-600 shadow-sm">
                      {penguji.nama.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">{penguji.nama}</h4>
                    <span className="text-xs text-muted-foreground mr-2">NIDN: {penguji.nidn}</span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium border border-blue-100 dark:border-blue-800">
                      Penguji {idx + 1}
                    </span>
                  </div>
               </div>
               <div className="text-right">
                  <div className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Total Nilai</div>
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {penguji.total.toFixed(2)}
                  </div>
               </div>
            </div>

            {/* Criteria List */}
            <div className="p-0">
               <table className="w-full text-sm text-left">
                  <thead className="bg-white dark:bg-neutral-900 text-gray-500 border-b border-gray-100 dark:border-neutral-800">
                    <tr>
                      <th className="px-4 py-3 font-medium text-xs uppercase w-full">Kriteria Penilaian</th>
                      <th className="px-4 py-3 font-medium text-xs uppercase text-center w-20">Bobot</th>
                      <th className="px-4 py-3 font-medium text-xs uppercase text-right w-20">Nilai</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                    {penguji.kriteria.map((k, kIdx) => (
                      <tr key={kIdx} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/50">
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                           {k.nama}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-500 text-xs">
                          {k.bobot}%
                        </td>
                         <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">
                          {k.nilai}
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
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
    <DataCard>
      {/* Custom Wide Modal */}
      <Modal 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        title="Rekapitulasi Nilai & Detail Penilaian"
      >
          {selected && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT COLUMN: Student Info & Summary (3 columns) */}
              <div className="lg:col-span-4 space-y-6">
                 {/* Student Profile Card */}
                 <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-2xl p-6 border border-gray-100 dark:border-neutral-800">
                    <div className="flex flex-col items-center text-center space-y-3 mb-6">
                       <div className="h-20 w-20 rounded-full bg-white dark:bg-neutral-700 flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-blue-400 border-4 border-blue-50 dark:border-neutral-600 shadow-sm">
                          {selected.mahasiswa?.nama?.charAt(0) ?? "?"}
                       </div>
                       <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                            {selected.mahasiswa?.nama ?? "-"}
                          </h3>
                          <p className="text-sm text-gray-500 font-medium">
                            NIM: {selected.mahasiswa?.nim ?? "-"}
                          </p>
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800">
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Judul Penelitian</span>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
                             {selected.judulPenelitian ?? "-"}
                          </p>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800">
                             <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Jenis Ujian</span>
                             <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {selected.jenisUjian?.namaJenis ?? "-"}
                             </span>
                          </div>
                          <div className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800">
                             <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Status</span>
                             <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold capitalize
                                ${selected.hasil?.toLowerCase() === "lulus" ? "bg-green-50 text-green-700" : 
                                  selected.hasil?.toLowerCase() === "tidak lulus" ? "bg-red-50 text-red-700" : "bg-gray-100 text-gray-600"}
                             `}>
                                {selected.hasil ?? "Belum"}
                             </span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Final Score Card */}
                 <div className="rounded-2xl border border-blue-100 dark:border-blue-900/30 p-6 bg-blue-50/30 dark:bg-blue-900/10 space-y-4">
                      
                      {(() => {
                            const pengujiMap: Record<number, { total: number }> = {};
                            penilaian.forEach((p) => {
                              if (!pengujiMap[p.dosenId]) pengujiMap[p.dosenId] = { total: 0 };
                              const bobot = p.komponenPenilaian?.bobot ?? 0;
                              pengujiMap[p.dosenId].total += ((p.nilai ?? 0) * bobot) / 100;
                            });
                            const totalNilai = Object.values(pengujiMap).reduce(
                              (acc, cur) => acc + cur.total,
                              0
                            );
                            const jumlahPenguji = Object.keys(pengujiMap).length || 1;
                            const rataRata = totalNilai / jumlahPenguji;
                            const nilaiHuruf = getNilaiHuruf(rataRata);

                            return (
                              <>
                                <div className="text-center">
                                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Nilai Akhir</span>
                                    <div className="text-5xl font-black text-gray-900 dark:text-white mt-1 mb-2 tracking-tight">
                                       {selected.nilaiAkhir ?? rataRata.toFixed(2)}
                                    </div>
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold shadow-sm
                                          ${nilaiHuruf === 'A' ? 'bg-green-500 text-white' : 
                                            nilaiHuruf === 'B' ? 'bg-blue-500 text-white' :
                                            nilaiHuruf === 'C' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'}
                                    `}>
                                        Predikat: {nilaiHuruf}
                                    </div>
                                 </div>
                                 
                                 <div className="pt-4 border-t border-blue-100 dark:border-blue-800/30 grid grid-cols-2 gap-4 text-center">
                                     <div>
                                        <div className="text-xs text-gray-500 mb-0.5">Total Angka</div>
                                        <div className="font-mono font-bold text-gray-700 dark:text-gray-300">{totalNilai.toFixed(2)}</div>
                                     </div>
                                     <div>
                                        <div className="text-xs text-gray-500 mb-0.5">Rata-rata</div>
                                        <div className="font-mono font-bold text-gray-700 dark:text-gray-300">{rataRata.toFixed(2)}</div>
                                     </div>
                                 </div>
                              </>
                            );
                      })()}
                 </div>

                 {/* Admin Verification Action */}
                 {user?.role === "admin prodi" && selected?.pendaftaranUjian?.id && (
                    <div className="pt-2">
                        <Button 
                            className={`w-full font-bold ${selected.pendaftaranUjian.status === "selesai" || !penilaian || penilaian.length === 0 ? "bg-gray-100 text-gray-400 border border-gray-200" : "bg-emerald-600 hover:bg-emerald-700 text-white"}`}
                            disabled={isUpdating || selected.pendaftaranUjian.status === "selesai" || !penilaian || penilaian.length === 0}
                            onClick={() => selected?.pendaftaranUjian?.id && handleVerifikasi(selected.pendaftaranUjian.id)}
                        >
                            {selected.pendaftaranUjian.status === "selesai" ? "Ujian Selesai (Terverifikasi)" : (!penilaian || penilaian.length === 0) ? "Belum Ada Nilai" : isUpdating ? "Memproses..." : "Verifikasi & Selesaikan Ujian"}
                        </Button>
                        <p className="text-[10px] text-gray-400 text-center mt-2">
                            Tindakan ini akan mengubah status pendaftaran ujian menjadi "Selesai".
                        </p>
                    </div>
                 )}
              </div>

              {/* RIGHT COLUMN: Detailed Assessment (9 columns) */}
              <div className="lg:col-span-8 space-y-5">
                 <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                       <Settings2 size={18} className="text-blue-500" />
                       Detail Penilaian Penguji
                    </h3>
                    <div className="text-xs text-gray-400 bg-gray-50 dark:bg-neutral-800 px-3 py-1.5 rounded-full border">
                       Menampilkan detil nilai per kriteria
                    </div>
                 </div>
                 
                 <div className="space-y-6">
                    {renderRekapPenilaian()}
                 </div>
              </div>
            </div>
          )}
      </Modal>


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
              <DropdownMenuContent align="end" className="w-[200px] p-0">
                <ScrollArea className="max-h-[300px] p-1">
                  <div className="px-2 py-1.5 font-semibold text-xs text-muted-foreground">
                    Jenis Ujian
                  </div>
                  {["all", "proposal", "hasil", "skripsi"].map((opt) => {
                    const isActive = jenisFilter === opt;
                    return (
                      <DropdownMenuItem
                        key={opt}
                        onClick={() => setJenisFilter(opt as any)}
                        className={`flex items-center justify-between gap-2 px-2 py-1.5 text-sm cursor-pointer ${
                          isActive ? "bg-accent text-accent-foreground font-medium" : ""
                        }`}
                      >
                        <span className="capitalize">{opt}</span>
                        {isActive && (
                          <Check size={14} className="text-emerald-600" />
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                  <div className="mt-1 px-2 py-1.5 font-semibold text-xs text-muted-foreground">
                    Hasil
                  </div>
                  {["all", "lulus", "tidak lulus"].map((opt) => {
                    const isActive = hasilFilter === opt;
                    return (
                      <DropdownMenuItem
                        key={opt}
                        onClick={() => setHasilFilter(opt as any)}
                        className={`flex items-center justify-between gap-2 px-2 py-1.5 text-sm cursor-pointer ${
                          isActive ? "bg-accent text-accent-foreground font-medium" : ""
                        }`}
                      >
                        <span className="capitalize">
                          {opt === "all" ? "Semua" : opt}
                        </span>
                        {isActive && (
                          <Check size={14} className="text-emerald-600" />
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                  <div className="mt-1 px-2 py-1.5 font-semibold text-xs text-muted-foreground">
                    Bulan
                  </div>
                  <div className="px-2 pb-1">
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
                      className="w-full px-2 py-1 border rounded text-sm bg-background"
                    />
                  </div>
                  <div className="px-2 py-1.5 font-semibold text-xs text-muted-foreground">
                    Tahun
                  </div>
                  <div className="px-2 pb-2">
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
                      className="w-full px-2 py-1 border rounded text-sm bg-background"
                    />
                  </div>
                </ScrollArea>
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
                             ${
                               ujian.jenisUjian?.namaJenis?.toLowerCase().includes("proposal") ? "bg-blue-100 text-blue-700" :
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
    </DataCard>
  );
}
