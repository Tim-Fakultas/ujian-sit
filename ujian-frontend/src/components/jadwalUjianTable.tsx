/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useMemo, useEffect } from "react";
import TableGlobal from "@/components/tableGlobal";
import { Penguji, Ujian } from "@/types/Ujian";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/custom-toast";
import {
  Eye,
  Search,
  MoreHorizontal,
  Check,
  LayoutGrid,
  List,
  Settings2,
  CalendarClock,
  X,
  Users,
} from "lucide-react";

import { daftarKehadiran } from "@/types/DaftarKehadiran";
import { Input } from "@/components/ui/input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getJenisUjianColor } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { setUjianSelesai, setUjianDijadwalkan } from "@/actions/jadwalUjian";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataCard } from "@/components/common/DataCard";
import { ScrollArea } from "@/components/ui/scroll-area";

/** 🔹 Modal Wrapper (Custom implementation) */
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
      className="fixed inset-0 z-50 dark:bg-neutral-900/80 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`bg-white dark:bg-neutral-900 w-full ${width} mx-4 rounded-xl shadow-2xl border dark:border-neutral-800 animate-in slide-in-from-bottom-4 duration-300 flex flex-col max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-neutral-800 bg-gray-50/50 dark:bg-[#1f1f1f] shrink-0 rounded-t-xl">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onClose}
          >
            <X size={18} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};

export default function JadwalUjianTable({
  jadwalUjian,
  daftarHadir,
}: {
  jadwalUjian: Ujian[];
  daftarHadir: daftarKehadiran[] | null;
}) {
  /* State for detail dialog (modern) */
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<Ujian | null>(null);

  const [openDaftarHadir, setOpenDaftarHadir] = useState(false);
  const [selectedDaftarHadir, setSelectedDaftarHadir] = useState<Ujian | null>(
    null
  );

  const [filterNama, setFilterNama] = useState("");
  const [filterJenis, setFilterJenis] = useState("all");
  const [filterBulan, setFilterBulan] = useState<string>("all");
  const [filterTahun, setFilterTahun] = useState<string>("all");
  const [openFilter, setOpenFilter] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  // daftar ujian yg ditandai selesai (lokal/optimistic)
  const [completedIds, setCompletedIds] = useState<number[]>([]);

  const [sortField, setSortField] = useState<"nama" | "judul" | "waktu" | null>(
    null
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [viewMode, setViewMode] = useState<string>("table");

  // Ubah state statusTab ke "all" | "dijadwalkan" | "selesai"
  const [statusTab, setStatusTab] = useState<"all" | "dijadwalkan" | "selesai">(
    "all"
  );

  const filteredData = useMemo(() => {
    let data = jadwalUjian.filter((ujian) => {
      // Filter status ujian sesuai tab
      if (statusTab === "dijadwalkan") {
        if (
          completedIds.includes(ujian.id) ||
          ujian.pendaftaranUjian.status === "selesai"
        )
          return false;
      } else if (statusTab === "selesai") {
        if (
          !(
            completedIds.includes(ujian.id) ||
            ujian.pendaftaranUjian.status === "selesai"
          )
        )
          return false;
      }

      const matchNama = ujian.mahasiswa.nama
        .toLowerCase()
        .includes(filterNama.toLowerCase());

      const matchJenis =
        filterJenis === "all"
          ? true
          : ujian.jenisUjian.namaJenis === filterJenis;

      const matchBulan =
        filterBulan === "all"
          ? true
          : (() => {
              if (!ujian.jadwalUjian) return false;
              const bulan = String(new Date(ujian.jadwalUjian).getMonth() + 1);
              return bulan === filterBulan;
            })();

      const matchTahun =
        filterTahun === "all"
          ? true
          : (() => {
              if (!ujian.jadwalUjian) return false;
              const tahun = String(new Date(ujian.jadwalUjian).getFullYear());
              return tahun === filterTahun;
            })();

      return matchNama && matchJenis && matchBulan && matchTahun;
    });

    if (sortField) {
      data = [...data].sort((a, b) => {
        if (sortField === "nama") {
          const namaA = a.mahasiswa.nama.toLowerCase();
          const namaB = b.mahasiswa.nama.toLowerCase();
          if (namaA < namaB) return sortOrder === "asc" ? -1 : 1;
          if (namaA > namaB) return sortOrder === "asc" ? 1 : -1;
          return 0;
        }

        if (sortField === "judul") {
          const judulA = (a.judulPenelitian || "").toLowerCase();
          const judulB = (b.judulPenelitian || "").toLowerCase();
          if (judulA < judulB) return sortOrder === "asc" ? -1 : 1;
          if (judulA > judulB) return sortOrder === "asc" ? 1 : -1;
          return 0;
        }

        if (sortField === "waktu") {
          const tglA = new Date(a.jadwalUjian).getTime();
          const tglB = new Date(b.jadwalUjian).getTime();
          if (tglA < tglB) return sortOrder === "asc" ? -1 : 1;
          if (tglA > tglB) return sortOrder === "asc" ? 1 : -1;
          return 0;
        }

        return 0;
      });
    }

    return data;
  }, [
    jadwalUjian,
    filterNama,
    filterJenis,
    filterBulan,
    filterTahun,
    sortField,
    sortOrder,
    statusTab,
    completedIds,
  ]);

  // ===========================================
  // Pagination
  // ===========================================
  const totalPage = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    setPage(1);
  }, [filterNama, filterJenis]);

  useEffect(() => {
    if (page > totalPage) {
      setPage(totalPage || 1);
    }
  }, [totalPage, page]);

  async function handleToggleStatusUjian(ujian: Ujian) {
    try {
      if (completedIds.includes(ujian.id)) {
        await setUjianDijadwalkan(ujian.pendaftaranUjian.id);
        setCompletedIds((prev) => prev.filter((id) => id !== ujian.id));
        showToast.success("Status ujian dikembalikan ke Dijadwalkan");
      } else {
        await setUjianSelesai(ujian.pendaftaranUjian.id);
        setCompletedIds((prev) => [...prev, ujian.id]);
        showToast.success("Berhasil menandai ujian selesai");
      }
    } catch (error) {
      console.error(error);
      showToast.error("Gagal mengubah status ujian");
    }
  }



  // Table columns for TableGlobal
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
        return <div className="text-center">{index}</div>;
      },
      size: 36,
    },
    {
      accessorFn: (row: Ujian) => row.mahasiswa.nama ?? "-",
      id: "nama",
      header: "Nama Mahasiswa",
      cell: ({ row }: any) => (
        <div>
          <div className="font-medium">{row.getValue("nama")}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.mahasiswa.nim}
          </div>
        </div>
      ),
      size: 150,
    },
    {
      id: "waktu",
      header: "Waktu",
      cell: ({ row }: any) => {
        const jadwal = row.original.jadwalUjian;
        const mulai = row.original.waktuMulai?.slice(0, 5);
        const selesai = row.original.waktuSelesai?.slice(0, 5);
        
        if (!jadwal) return <span className="text-gray-400">-</span>;

        return (
          <div className="text-xs">
            <div className="font-medium">
              {new Date(jadwal).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short", 
                year: "numeric"
              })}
            </div>
            <div className="text-muted-foreground">
               {mulai && selesai ? `${mulai} - ${selesai}` : "-"}
            </div>
          </div>
        );
      },
      size: 100,
    },
    {
      id: "ruangan",
      header: "Ruangan",
      cell: ({ row }: any) => (
        <div className="text-xs font-medium">
          {row.original.ruangan?.namaRuangan ?? "-"}
        </div>
      ),
      size: 100,
    },
    {
      accessorFn: (row: Ujian) => row.judulPenelitian ?? "-",
      id: "judul",
      header: "Judul Penelitian",
      cell: ({ row }: any) => (
        <div className="whitespace-pre-line break-words max-w-[200px] text-xs leading-snug">
          {row.getValue("judul")}
        </div>
      ),
      size: 200,
    },
    {
      id: "penguji",
      header: "Penguji",
      cell: ({ row }: any) => {
        const penguji: Penguji[] = row.original.penguji || [];
        if (penguji.length === 0) return <span className="text-gray-400 text-xs">-</span>;
        
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary" size="sm" className="h-7 text-xs gap-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-700">
                <Users size={12} />
                Lihat Penguji
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" align="end">
              <div className="bg-gray-50/50 dark:bg-neutral-800/50 p-3 border-b border-gray-100 dark:border-neutral-800">
                 <h4 className="font-semibold text-xs text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                    <Users size={14} className="text-blue-500" />
                    Tim Penguji
                 </h4>
              </div>
              <div className="p-4 space-y-0">
                {penguji.map((p, idx) => {
                  const roleMap: Record<string, string> = {
                    ketua_penguji: "Ketua Penguji",
                    sekretaris_penguji: "Sekretaris Penguji",
                    penguji_1: "Penguji I",
                    penguji_2: "Penguji II",
                  };
                  const label = roleMap[p.peran] || p.peran;
                  // Cek kehadiran
                  const hadir = daftarHadir?.some(
                    (d) =>
                      d.dosenId === p.id && 
                      d.statusKehadiran === "hadir" &&
                      d.ujianId === row.original.id
                  );

                  return (
                    <div
                      key={idx}
                      className="relative pl-6 pb-4 border-l-2 border-gray-100 dark:border-neutral-800 last:border-0 last:pb-0"
                    >
                      {/* Dot Indicator */}
                      <div
                        className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-neutral-900
                            ${hadir ? "bg-emerald-500" : "bg-gray-300 dark:bg-neutral-600"}
                        `}
                      ></div>
                      
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                          {p.nama ?? "-"}
                        </p>
                        <div className="flex items-center justify-between mt-1 gap-2">
                          <span className="text-xs text-gray-500 capitalize">
                            {label}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border
                              ${
                                hadir
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                                  : "bg-gray-50 text-gray-500 border-gray-100 dark:bg-neutral-800 dark:text-gray-400 dark:border-neutral-700"
                              }
                            `}
                          >
                            {hadir ? "Hadir" : "Belum"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        );
      },
      size: 130,
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
                  // Hindari error TS dengan casting ke any
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
                  // Hindari error TS dengan casting ke any
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
      rows: jadwalUjian.map((item, idx) => ({
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
                  // Hindari error TS dengan casting ke any
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

  return (
    <DataCard>
      {/* Header bar: Search, Filter, View Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 mb-4 w-full">
        <div className="relative flex-1 w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={16} />
          </span>
          <Input
            placeholder="Search"
            value={filterNama}
            onChange={(e) => setFilterNama(e.target.value)}
            className="pl-10 w-full bg-white dark:bg-neutral-800"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Tombol filter Jenis, Bulan, Tahun */}
          <Popover open={openFilter} onOpenChange={setOpenFilter}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 w-9 flex items-center justify-center rounded-md"
              >
                <Settings2 size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 rounded-lg" align="end">
              <ScrollArea className="max-h-[300px] p-1">
                <div className="p-1">
                  <div className="font-semibold text-xs mb-2 text-muted-foreground px-2 pt-1">
                    Jenis Ujian
                  </div>
                  <div className="flex flex-col gap-1 mb-3">
                    {["all", "Ujian Proposal", "Ujian Hasil", "Ujian Skripsi"].map(
                      (item) => (
                        <Button
                          key={item}
                          variant={filterJenis === item ? "secondary" : "ghost"}
                          size="sm"
                          className={`w-full justify-between rounded-md text-left ${
                            filterJenis === item ? "font-semibold bg-accent text-accent-foreground" : ""
                          }`}
                          onClick={() => {
                            setFilterJenis(item);
                            setOpenFilter(false);
                          }}
                        >
                          <span className="text-sm">
                            {item === "all" ? "Semua" : item}
                          </span>
                          {filterJenis === item && (
                            <Check size={14} className="ml-2" />
                          )}
                        </Button>
                      )
                    )}
                  </div>
                  <div className="font-semibold text-xs mb-2 text-muted-foreground px-2">
                    Bulan
                  </div>
                  <div className="flex flex-col gap-1 mb-3 px-2">
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
                  <div className="font-semibold text-xs mb-2 text-muted-foreground px-2">
                    Tahun
                  </div>
                  <div className="flex flex-col gap-1 px-2 pb-2">
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
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>

          <Tabs value={viewMode} onValueChange={setViewMode} className="h-9">
            <TabsList className="rounded-md bg-muted p-1 gap-1 h-9">
              <TabsTrigger
                value="table"
                className="inline-flex items-center gap-2 h-7 px-2 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:text-foreground shadow-sm"
              >
                <LayoutGrid size={16} />
              </TabsTrigger>
              <TabsTrigger
                value="card"
                className="inline-flex items-center gap-2 h-7 px-2 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:text-foreground shadow-sm"
              >
                <List size={16} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
 
      {/* Table/Card View */}
      <Tabs value={viewMode} onValueChange={setViewMode}>
        <TabsContent value="table">
          <TableGlobal table={table} cols={cols} />
        </TabsContent>
        <TabsContent value="card">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedData.length === 0 ? (
              <div className="text-center text-muted-foreground py-12 col-span-full flex flex-col items-center gap-3">
                 <div className="p-4 rounded-full bg-gray-50 dark:bg-neutral-800">
                    <List size={24} className="opacity-50" />
                 </div>
                <p>Tidak ada data ujian yang ditemukan.</p>
              </div>
            ) : (
              paginatedData.map((ujian) => {
                 const isSelesai = completedIds.includes(ujian.id) || ujian.pendaftaranUjian.status === "selesai";
                 const jenisColor = getJenisUjianColor(ujian.jenisUjian.namaJenis); // e.g., bg-blue-100 text-blue-700
                 // Extract base color name from the utility if possible, or fallback to simple mapping for borders


                 return (
                <div
                  key={ujian.id}
                  className={`group relative bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col`}
                >
                  {/* Status Strip if needed, or stick to border-l */}
                  
                  <div className="p-5 flex flex-col gap-4 flex-1">
                    
                    {/* Header: Date & Status */}
                    <div className="flex justify-between items-start">
                       <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                             <CalendarClock size={13} />
                             <span>
                                {ujian.jadwalUjian
                                  ? new Date(ujian.jadwalUjian).toLocaleDateString("id-ID", {
                                      weekday: "short",
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric"
                                    })
                                  : "Belum dijadwalkan"}
                             </span>
                          </div>
                          <div className="text-xs font-medium text-gray-400">
                             {ujian.waktuMulai?.slice(0, 5)} - {ujian.waktuSelesai?.slice(0, 5)} WIB
                          </div>
                       </div>
                       
                       {isSelesai ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                             Selesai
                          </span>
                       ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                             Dijadwalkan
                          </span>
                       )}
                    </div>

                    {/* Content: Title & Name */}
                    <div className="space-y-2">
                       <h3 className="font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2" title={ujian.judulPenelitian}>
                          {ujian.judulPenelitian || "Judul belum tersedia"}
                       </h3>
                       
                       <div className="flex items-center gap-2 pt-1">
                          <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                             {ujian.mahasiswa.nama.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[180px]">
                                {ujian.mahasiswa.nama}
                             </span>
                             <span className="text-[11px] text-gray-400">
                                {ujian.mahasiswa.nim}
                             </span>
                          </div>
                       </div>
                    </div>

                    {/* Exam Type & Room */}
                    <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-100 dark:border-neutral-800">
                       <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${jenisColor}`}>
                          {ujian.jenisUjian.namaJenis}
                       </span>
                       <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                          {ujian.ruangan?.namaRuangan || "Ruangan -"}
                       </span>
                    </div>

                  </div>
                  
                  {/* Actions Footer - Hidden by default, shown on hover or always visible in mobile */}
                  <div className="bg-gray-50/50 dark:bg-neutral-800/50 p-3 flex items-center justify-end border-t border-gray-100 dark:border-neutral-800">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="h-8 text-xs gap-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-700 w-full"
                          >
                            <Users size={14} />
                            Lihat Penguji
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 p-0" align="end">
                          <div className="bg-gray-50/50 dark:bg-neutral-800/50 p-3 border-b border-gray-100 dark:border-neutral-800">
                             <h4 className="font-semibold text-xs text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                                <Users size={14} className="text-blue-500" />
                                Tim Penguji
                             </h4>
                          </div>
                          <div className="p-4 space-y-0">
                            {(ujian.penguji || []).map((p, idx) => {
                              const roleMap: Record<string, string> = {
                                ketua_penguji: "Ketua Penguji",
                                sekretaris_penguji: "Sekretaris Penguji",
                                penguji_1: "Penguji I",
                                penguji_2: "Penguji II",
                              };
                              const label = roleMap[p.peran] || p.peran;
                              // Cek kehadiran
                              const hadir = daftarHadir?.some(
                                (d) =>
                                  d.dosenId === p.id && 
                                  d.statusKehadiran === "hadir" &&
                                  d.ujianId === ujian.id
                              );

                              return (
                                <div
                                  key={idx}
                                  className="relative pl-6 pb-4 border-l-2 border-gray-100 dark:border-neutral-800 last:border-0 last:pb-0"
                                >
                                  {/* Dot Indicator */}
                                  <div
                                    className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white dark:ring-neutral-900
                                        ${hadir ? "bg-emerald-500" : "bg-gray-300 dark:bg-neutral-600"}
                                    `}
                                  ></div>
                                  
                                  <div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                                      {p.nama ?? "-"}
                                    </p>
                                    <div className="flex items-center justify-between mt-1 gap-2">
                                      <span className="text-xs text-gray-500 capitalize">
                                        {label}
                                      </span>
                                      <span
                                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border
                                          ${
                                            hadir
                                              ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                                              : "bg-gray-50 text-gray-500 border-gray-100 dark:bg-neutral-800 dark:text-gray-400 dark:border-neutral-700"
                                          }
                                        `}
                                      >
                                        {hadir ? "Hadir" : "Belum"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </PopoverContent>
                      </Popover>
                  </div>
                </div>
              );
             })
            )}
          </div>
        </TabsContent>
      </Tabs>




    

    </DataCard>
  );
}
