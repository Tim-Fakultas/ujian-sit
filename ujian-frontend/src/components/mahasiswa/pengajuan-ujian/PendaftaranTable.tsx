"use client";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { ColumnFiltersState } from "@tanstack/react-table";
import TableGlobal from "@/components/tableGlobal";
import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Plus,
  Search,
  MoreHorizontal,
  X,
  Check,
  ArrowUpDown,
  LayoutGrid,
  List,
  Settings2,
  Calendar,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { getJenisUjianColor, getStatusColor } from "@/lib/utils";
import { PendaftaranUjian } from "@/types/PendaftaranUjian";
import { User } from "@/types/Auth";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ListFilter } from "lucide-react";
import { Ujian } from "@/types/Ujian";
import PengajuanUjianForm from "./PendaftaranUjianForm";
import { JenisUjian } from "@/types/JenisUjian";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataCard } from "@/components/common/DataCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function PendaftaranTable({
  pendaftaranUjian,
  user,
  jenisUjianList,
  pengajuanRanpel,
  ujian,
}: {
  pendaftaranUjian: PendaftaranUjian[];
  user: User | null;
  jenisUjianList: JenisUjian[];
  pengajuanRanpel: PengajuanRanpel[];
  ujian: Ujian[];
}) {
  //* Filter & Pagination State
  const [filterJudul, setFilterJudul] = useState("");
  // Pisahkan filter jenis dan status
  const [filterJenisUjian, setFilterJenisUjian] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [keteranganModal, setKeteranganModal] = useState(false);
  const [keteranganContent, setKeteranganContent] = useState("");

  // Status options for filtering
  const statusOptions = [
    { value: "all", label: "Semua" },
    { value: "menunggu", label: "Menunggu" },
    { value: "diterima", label: "Diterima" },
    { value: "ditolak", label: "Ditolak" },
    { value: "dijadwalkan", label: "Dijadwalkan" },
    { value: "selesai", label: "Selesai" },
  ];

  // Gabungan status dan jenis ujian untuk filter
  const statusJenisOptions = [
    { value: "all", label: "Semua" },
    ...jenisUjianList.map((jenis) => ({
      value: `jenis-${jenis.id}`,
      label: `Jenis: ${jenis.namaJenis}`,
    })),
    ...statusOptions
      .filter((s) => s.value !== "all")
      .map((s) => ({
        value: `status-${s.value}`,
        label: `Status: ${s.label}`,
      })),
  ];

  // SORT STATE

  // react-table states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // FILTERED & SORTED DATA
  const filteredData = useMemo(() => {
    return (pendaftaranUjian || []).filter((pendaftaran) => {
      const matchJudul = (pendaftaran.judulPenelitian ?? "aa")
        .toLowerCase()
        .includes(filterJudul.toLowerCase());
      const matchJenis =
        filterJenisUjian === "all"
          ? true
          : String(pendaftaran.jenisUjian?.id) === filterJenisUjian;
      const matchStatus =
        filterStatus === "all" ? true : pendaftaran.status === filterStatus;
      return matchJudul && matchJenis && matchStatus;
    });
  }, [pendaftaranUjian, filterJudul, filterJenisUjian, filterStatus]);

  // build react-table columns (used by TableGlobal)
  const cols: ColumnDef<PendaftaranUjian>[] = useMemo(
    () => [
      {
        id: "no",
        header: "No",
        cell: ({ row, table }) => {
          const index =
            (table.getState().pagination?.pageIndex ?? 0) *
            (table.getState().pagination?.pageSize ?? 10) +
            row.index +
            1;
          return <div >{index}</div>;
        },
      },
      {
        accessorFn: (row) => row.judulPenelitian ?? "-",
        id: "judul",
        header: () => (
          <div className="flex items-center gap-1 select-none">Judul</div>
        ),
        cell: ({ row }) => (
          <div className="truncate  max-w-[200px]">
            {String(row.getValue("judul") ?? "-")}
          </div>
        ),
      },
      {
        accessorFn: (row) => row.jenisUjian?.namaJenis ?? "-",
        id: "jenis",
        header: "Jenis Ujian",
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded text-sm font-semibold inline-block
                      ${getJenisUjianColor(String(row.getValue("jenis")))}
                    `}
          >
            {row.getValue("jenis")}
          </span>
        ),
      },
      {
        accessorFn: (row) => row.tanggalPengajuan ?? "",
        id: "tanggal",
        header: () => (
          <div className="flex justify-center items-center gap-1 select-none">
            Tanggal Pengajuan
          </div>
        ),
        cell: ({ row }) => {
          const v = String(row.getValue("tanggal") ?? "");
          try {
            return (
              <div className="text-center">
                {new Date(v).toLocaleDateString("id-ID")}
              </div>
            );
          } catch {
            return <div className="text-center">{v}</div>;
          }
        },
      },
      {
        accessorFn: (row) => row.status ?? "-",
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const s = String(row.getValue("status"));
          return (
            <span
              className={`px-2 py-1 rounded text-sm ${getStatusColor(s)} ${s === "menunggu"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : s === "diterima"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : s === "ditolak"
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : s === "dijadwalkan"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : s === "selesai"
                        ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        : ""
                }`}
            >
              {s}
            </span>
          );
        },
      },
      {
        accessorFn: (row) => row.keterangan ?? "",
        id: "keterangan",
        header: () => (
          <div className="flex justify-center items-center gap-1 select-none ">
            Keterangan
          </div>
        ),
        cell: ({ row }) => {
          const keterangan = String(row.getValue("keterangan") ?? "");
          if (!keterangan) return <p className="text-xs">-</p>;
          return (
            <div className="text-center">
              <Button variant="ghost" size="icon"
                onClick={() => {
                  setKeteranganContent(keterangan);
                  setKeteranganModal(true);
                }}>
                <Eye size={16} />
              </Button>
            </div>
          );
        },
      },

    ],
    []
  );

  // create react-table instance
  const table = useReactTable({
    data: filteredData,
    columns: cols,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Reset page ke 1 jika filter berubah
  useEffect(() => {
    try {
      table.setPageIndex?.(0);
    } catch { }
  }, [filterJudul, filterStatus, filterJenisUjian, table]);

  const [showForm, setShowForm] = useState(false);

  // Tabs view mode state
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  // State for popover filter
  const [openFilter, setOpenFilter] = useState(false);

  return (
    <DataCard className="w-full max-w-full">
      {/* Filter/Search/Add Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 mb-4 w-full">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-muted-foreground" />
          </div>
          <Input
            placeholder="Search"
            value={filterJudul}
            onChange={(e) => setFilterJudul(e.target.value)}
            className="w-full pl-10 bg-white dark:bg-neutral-800"
            aria-label="Search"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Filter popover */}
          <Popover open={openFilter} onOpenChange={setOpenFilter}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 flex items-center justify-center rounded-md"
              >
                <Settings2 size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[200px] p-0">
              <ScrollArea className="max-h-[300px] p-1">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Jenis Ujian
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-between h-8 px-2 font-normal ${filterJenisUjian === "all" ? "bg-accent text-accent-foreground font-medium" : ""
                    }`}
                  onClick={() => setFilterJenisUjian("all")}
                >
                  <span className="text-sm">Semua</span>
                  {filterJenisUjian === "all" && <Check size={14} className="ml-auto" />}
                </Button>
                {jenisUjianList.map((jenis) => (
                  <Button
                    key={jenis.id}
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-between h-8 px-2 font-normal ${filterJenisUjian === String(jenis.id)
                      ? "bg-accent text-accent-foreground font-medium"
                      : ""
                      }`}
                    onClick={() => setFilterJenisUjian(String(jenis.id))}
                  >
                    <span className="text-sm">{jenis.namaJenis}</span>
                    {filterJenisUjian === String(jenis.id) && (
                      <Check size={14} className="ml-auto" />
                    )}
                  </Button>
                ))}
                <div className="my-1 h-px bg-border" />
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Status
                </div>
                {statusOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-between h-8 px-2 font-normal ${filterStatus === opt.value ? "bg-accent text-accent-foreground font-medium" : ""
                      }`}
                    onClick={() => setFilterStatus(opt.value)}
                  >
                    <span className="text-sm">{opt.label}</span>
                    {filterStatus === opt.value && (
                      <Check size={14} className="ml-auto" />
                    )}
                  </Button>
                ))}
              </ScrollArea>
            </PopoverContent>
          </Popover>
          {/* Tabs */}
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as "table" | "card")}
            className="h-9"
          >
            <TabsList className="rounded-md bg-muted p-1 gap-1 h-9">
              <TabsTrigger
                value="table"
                className="inline-flex items-center gap-2 h-7 px-2 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:text-foreground shadow-sm"
                aria-label="Table view"
              >
                <LayoutGrid size={16} />
              </TabsTrigger>
              <TabsTrigger
                value="card"
                className="inline-flex items-center gap-2 h-7 px-2 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:text-foreground shadow-sm"
                aria-label="Card view"
              >
                <List size={16} />
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Tombol pengajuan */}
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 flex items-center gap-2 rounded-lg h-9"
            onClick={() => setShowForm(true)}
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Ajukan Ujian</span>
            <span className="sm:hidden">Ajukan</span>
          </Button>
        </div>
      </div>

      {/* Popup Modal Form Pengajuan Ujian */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="relative max-w-3xl w-full bg-white dark:bg-[#232323] rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full">
              {user && (
                <PengajuanUjianForm
                  user={user}
                  jenisUjianList={jenisUjianList}
                  pengajuanRanpel={pengajuanRanpel}
                  ujian={ujian}
                  onCloseModal={() => {
                    if (showForm) setShowForm(false);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table / Card view */}
      {filteredData.length === 0 ? (
        <div className="p-6 flex flex-col items-center justify-center gap-3">
          <div className="text-sm text-muted-foreground text-center">
            Tidak ada data pengajuan ujian.
          </div>
          <div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setFilterStatus("all");
                setFilterJudul("");
                setFilterJenisUjian("all");
              }}
            >
              Reset filter
            </Button>
          </div>
        </div>
      ) : viewMode === "table" ? (
        <div className="overflow-x-auto w-full">
          <TableGlobal table={table} cols={cols} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredData.map((item, idx) => {
            const key = item.id ?? idx;
            const judul = item.judulPenelitian ?? "-";
            const jenis = item.jenisUjian?.namaJenis ?? "-";
            const tanggal = item.tanggalPengajuan ?? "";
            const status = item.status ?? "-";

            const tanggalStr = tanggal
              ? new Date(String(tanggal)).toLocaleDateString("id-ID", {
                day: "numeric", month: "short", year: "numeric"
              })
              : "-";



            let statusColor = "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
            if (status === "menunggu") statusColor = "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
            else if (status === "diterima") statusColor = "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
            else if (status === "ditolak") statusColor = "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
            else if (status === "dijadwalkan") statusColor = "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800";
            else if (status === "selesai") statusColor = "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700";

            return (
              <div
                key={key}
                className={`group relative bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col`}
              >
                <div className="p-5 flex flex-col gap-4 flex-1">

                  {/* Header: Date & Status */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      <Calendar size={13} />
                      <span>{tanggalStr}</span>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}>
                      {status}
                    </span>
                  </div>

                  {/* Content: Title & Type */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-3" title={judul}>
                      {judul || "Judul tidak tersedia"}
                    </h3>

                    <div className="pt-2">
                      <span className={`px-2 py-1 rounded-md text-[11px] font-semibold 
                                 ${jenis.toLowerCase().includes("proposal") ? "bg-blue-100 text-blue-700" :
                          jenis.toLowerCase().includes("hasil") ? "bg-yellow-100 text-yellow-700" :
                            jenis.toLowerCase().includes("skripsi") ? "bg-green-100 text-green-700" : "bg-gray-100"
                        }
                             `}>
                        {jenis}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="bg-gray-50/50 dark:bg-neutral-800/50 p-3 flex items-center justify-end border-t border-gray-100 dark:border-neutral-800">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-xs h-8 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                        <MoreHorizontal size={14} className="mr-1.5" /> Aksi
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/mahasiswa/jadwal-ujian`}
                          className="w-full flex items-center gap-2 text-sm px-3 py-2 cursor-pointer"
                        >
                          <List size={14} />
                          <span>Lihat Jadwal Ujian</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={keteranganModal} onOpenChange={setKeteranganModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keterangan</DialogTitle>
            <DialogDescription>
              {keteranganContent || "-"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setKeteranganModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DataCard>




  );
}
