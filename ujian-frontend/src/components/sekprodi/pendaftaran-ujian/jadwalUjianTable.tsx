/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useMemo, useEffect } from "react";
import TableGlobal from "@/components/tableGlobal";
import { Ujian } from "@/types/Ujian";
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
          {row.getValue("nama")}
          <div className="text-xs text-muted-foreground">
            {row.original.mahasiswa.nim}
          </div>
        </div>
      ),
      size: 120,
    },
    {
      accessorFn: (row: Ujian) => row.judulPenelitian ?? "-",
      id: "judul",
      header: "Judul Penelitian",
      cell: ({ row }: any) => (
        <div className="whitespace-pre-line break-words max-w-sm text-xs">
          {row.getValue("judul")}
        </div>
      ),
      size: 180,
    },
    {
      accessorFn: (row: Ujian) => row.jenisUjian.namaJenis ?? "-",
      id: "jenis",
      header: "Jenis Ujian",
      cell: ({ row }: any) => (
        <span
          className={`px-2 py-1 text-xs rounded font-semibold inline-block ${getJenisUjianColor(
            String(row.getValue("jenis"))
          )}`}
        >
          {row.getValue("jenis")}
        </span>
      ),
      size: 90,
    },
    // Tambahkan kolom Penguji (icon Eye)

    {
      id: "actions",
      header: "",
      cell: ({ row }: any) => {
        const ujian = row.original;
        
        return (
          <div className="flex items-center justify-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Aksi">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="end"
                className="min-w-[140px] py-1"
              >
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedDetail(ujian);
                    setOpenDetailDialog(true);
                  }}
                  className="flex items-center gap-1 px-2 py-1"
                >
                  <Eye size={15} className="mr-1"/>
                  Lihat Detail
                </DropdownMenuItem>
                
                <DropdownMenuItem
                  onClick={() => handleToggleStatusUjian(ujian)}
                  className="flex items-center gap-1 px-2 py-1"
                >
                  {completedIds.includes(ujian.id) ? (
                    <>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 20 20"
                        fill="none"
                        className="mr-1 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="3"
                          y="6"
                          width="14"
                          height="11"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M7 2V6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M13 2V6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      Dijadwalkan
                    </>
                  ) : (
                    <>
                      <Check
                        size={13}
                        className="mr-1 text-emerald-500"
                      />
                      Tandai Selesai
                    </>
                  )}
                </DropdownMenuItem>
             
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      size: 90,
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
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg  border">
      {/* Header bar: Search, Filter, View Mode */}
      <div className="flex items-center sm:justify-end gap-2 mb-2">
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={16} />
          </span>
          <Input
            placeholder="Search"
            value={filterNama}
            onChange={(e) => setFilterNama(e.target.value)}
            className="pl-10 w-full bg-white dark:bg-[#2a2a2a]"
          />
        </div>

        {/* Tombol filter Jenis, Bulan, Tahun */}
        <Popover open={openFilter} onOpenChange={setOpenFilter}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant={filterJenis !== "all" ? "secondary" : "outline"}
              className="h-9 border rounded-lg px-4 py-1 bg-white hover:bg-gray-50 font-medium shadow-sm"
            >
              <Settings2 size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="min-w-[220px] p-0 rounded-lg " align="end">
            <div className="p-3">
              <div className="font-semibold text-xs mb-2 text-muted-foreground">
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
                        filterJenis === item ? "font-semibold" : ""
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
              <div className="font-semibold text-xs mb-2 text-muted-foreground">
                Bulan
              </div>
              <div className="flex flex-col gap-1 mb-3">
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
              <div className="font-semibold text-xs mb-2 text-muted-foreground">
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
            </div>
          </PopoverContent>
        </Popover>

        <Tabs value={viewMode} onValueChange={setViewMode}>
          <TabsList>
            <TabsTrigger value="table">
              <LayoutGrid size={16} />
            </TabsTrigger>
            <TabsTrigger value="card">
              <List size={16} />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
 
      {/* Table/Card View */}
      <Tabs value={viewMode} onValueChange={setViewMode}>
        <TabsContent value="table">
          <TableGlobal table={table} cols={cols} />
        </TabsContent>
        <TabsContent value="card">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {paginatedData.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 col-span-full">
                Tidak ada data.
              </div>
            ) : (
              paginatedData.map((ujian) => (
                <div
                  key={ujian.id}
                  className="border rounded-xl p-5 bg-white dark:bg-neutral-800 shadow flex flex-col gap-3 relative transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-1 mb-2">
                    <div className="font-semibold text-lg text-gray-800 dark:text-gray-100 truncate">
                      {ujian.mahasiswa.nama}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {ujian.mahasiswa.nim}
                    </div>
                  </div>
                  <div className="border-t my-2" />
                  <div className="mb-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                      Judul
                    </div>
                    <div className="whitespace-pre-line break-words text-sm font-medium text-gray-700 dark:text-gray-200 ">
                      {ujian.judulPenelitian}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Jenis:
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs rounded font-semibold ${getJenisUjianColor(
                          ujian.jenisUjian.namaJenis
                        )}`}
                      >
                        {ujian.jenisUjian.namaJenis}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Ruangan:
                      </span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                        {ujian.ruangan?.namaRuangan ?? "-"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Waktu:
                      </span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                        {ujian.hariUjian
                          ? ujian.hariUjian[0].toUpperCase() +
                            ujian.hariUjian.slice(1)
                          : "-"}
                        {", "}
                        {ujian.jadwalUjian
                          ? new Date(ujian.jadwalUjian).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )
                          : "-"}{" "}
                        {ujian.waktuMulai?.slice(0, 5)} -{" "}
                        {ujian.waktuSelesai?.slice(0, 5)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    {/* Tombol lihat penguji (Eye) */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedDetail(ujian);
                        setOpenDetailDialog(true);
                      }}
                      aria-label="Lihat Detail"
                      className="flex items-center gap-2"
                    >
                      <Eye size={16} className="mr-1" />
                      <span>Lihat Detail</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Aksi">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        side="top"
                        align="end"
                        className="min-w-[140px] py-1"
                      >
                        <DropdownMenuItem
                          onClick={() => handleToggleStatusUjian(ujian)}
                          className="flex items-center gap-1 px-2 py-1"
                        >
                          {completedIds.includes(ujian.id) ? (
                            <>
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 20 20"
                                fill="none"
                                className="mr-1 text-blue-500"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="3"
                                  y="6"
                                  width="14"
                                  height="11"
                                  rx="2"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                                <path
                                  d="M7 2V6"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M13 2V6"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </svg>
                              Dijadwalkan
                            </>
                          ) : (
                            <>
                              <Check
                                size={13}
                                className="mr-1 text-emerald-500"
                              />
                              Tandai Selesai
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {completedIds.includes(ujian.id) && (
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800 ml-1">
                        Selesai
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>




      {/* ========== MODAL DETAIL (DESAIN MODERN) ========== */}
      <Modal
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        title="Detail Ujian"
        width="max-w-4xl"
      >
          {selectedDetail && (
            <div className="space-y-6">
              {/* Header Section: Mahasiswa & Waktu */}
              <div className="border-b pb-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-neutral-800 px-2.5 py-1 rounded-md">
                      <CalendarClock size={14} />
                      <span>
                        {selectedDetail.hariUjian
                          ? selectedDetail.hariUjian.charAt(0).toUpperCase() +
                            selectedDetail.hariUjian.slice(1)
                          : "Hari"}
                        ,{" "}
                        {selectedDetail.jadwalUjian
                          ? new Date(selectedDetail.jadwalUjian).toLocaleDateString(
                              "id-ID",
                              { day: "numeric", month: "long", year: "numeric" }
                            )
                          : "-"}
                      </span>
                    </div>
                    <div className="hidden sm:block text-gray-300">|</div>
                    <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-neutral-800 px-2.5 py-1 rounded-md">
                      <LayoutGrid size={14} />
                      <span>
                        {selectedDetail.waktuMulai?.slice(0, 5) ?? "-"} —{" "}
                        {selectedDetail.waktuSelesai?.slice(0, 5) ?? "-"}
                      </span>
                    </div>
                     <div className="hidden sm:block text-gray-300">|</div>
                     <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-neutral-800 px-2.5 py-1 rounded-md">
                        <span className="font-medium">{selectedDetail.ruangan?.namaRuangan ?? "-"}</span>
                     </div>
                  </div>
                  <div>
                     <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase
                          ${getJenisUjianColor(selectedDetail.jenisUjian.namaJenis)}
                        `}
                      >
                        {selectedDetail.jenisUjian.namaJenis}
                      </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {selectedDetail.mahasiswa.nama}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-mono bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-xs">
                      {selectedDetail.mahasiswa.nim}
                    </span>
                    <span>•</span>
                    <span>Mahasiswa</span> 
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
                       Judul Penelitian
                    </h3>
                     <p className="text-base font-medium leading-relaxed text-gray-800 dark:text-gray-200">
                      {selectedDetail.judulPenelitian ?? "-"}
                    </p>
                  </div>

                  {/* Hasil & Nilai Status */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-xl border text-center">
                          <span className="text-xs text-gray-500 uppercase font-semibold">Nilai Akhir</span>
                          <div className="text-3xl font-bold text-emerald-600 mt-1">
                              {selectedDetail.nilaiAkhir ?? "-"}
                          </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-xl border text-center">
                          <span className="text-xs text-gray-500 uppercase font-semibold">Status Pendaftaran</span>
                          <div className="text-lg font-bold mt-2 capitalize text-gray-700 dark:text-gray-200">
                              {selectedDetail.pendaftaranUjian.status}
                          </div>
                      </div>
                   </div>
                   
                    {selectedDetail.keputusan && (
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
                             <span className="text-xs text-blue-600 dark:text-blue-400 uppercase font-semibold">Keputusan Akhir</span>
                              <div className="text-lg font-medium text-blue-900 dark:text-blue-200 mt-1">
                                 {selectedDetail.keputusan.namaKeputusan}
                              </div>
                        </div>
                     )}

                   {/* Catatan */}
                   <div className="bg-white dark:bg-neutral-800 rounded-xl border p-5 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                          Catatan / Revisi
                      </h3>
                      <div className="bg-gray-50 dark:bg-neutral-900/50 p-4 rounded-lg border">
                          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                              {selectedDetail.catatan || "Tidak ada catatan penguji."}
                          </p>
                      </div>
                   </div>

                </div>

                {/* Right Column: Dosen Penguji */}
                <div className="space-y-4">
                    <div className="bg-white dark:bg-neutral-800 rounded-xl border p-5 shadow-sm h-full">
                         <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                              Tim Penguji
                         </h3>
                         <div className="space-y-4">
                            {selectedDetail.penguji.map((p, idx) => {
                                 const roleMap: Record<string, string> = {
                                    ketua_penguji: "Ketua Penguji",
                                    sekretaris_penguji: "Sekretaris Penguji",
                                    penguji_1: "Penguji I",
                                    penguji_2: "Penguji II",
                                  };
                                  const label = roleMap[p.peran] || p.peran;
                                 
                                  const hadir = daftarHadir?.some(
                                    (d) =>
                                      d.dosenId === p.id &&
                                      d.statusKehadiran === "hadir" &&
                                      d.ujianId === selectedDetail.id
                                  );

                                 return (
                                     <div key={idx} className="relative pl-4 border-l-2 border-gray-100 last:border-0 pb-1">
                                         <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-2 ring-white
                                             ${hadir ? 'bg-green-500' : 'bg-gray-300'}
                                         `}></div>
                                         <div>
                                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                                                  {p.nama}
                                              </p>
                                              <div className="flex items-center justify-between mt-1">
                                                  <span className="text-xs text-gray-500 capitalize">{label}</span>
                                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border
                                                      ${hadir 
                                                          ? 'bg-green-50 text-green-700 border-green-100' 
                                                          : 'bg-gray-50 text-gray-600 border-gray-200'}
                                                  `}>
                                                      {hadir ? "Hadir" : "Belum Hadir"}
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
            </div>
          )}
      </Modal>

    </div>
  );
}
