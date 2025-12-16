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
import PengajuanUjianForm from "./PengajuanUjianForm";
import { JenisUjian } from "@/types/JenisUjian";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      const matchJudul = pendaftaran.ranpel.judulPenelitian
        .toLowerCase()
        .includes(filterJudul.toLowerCase());
      const matchJenis =
        filterJenisUjian === "all"
          ? true
          : String(pendaftaran.jenisUjian.id) === filterJenisUjian;
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
        accessorFn: (row) => row.ranpel.judulPenelitian ?? "-",
        id: "judul",
        header: () => (
          <div className="flex items-center gap-1 select-none">Judul</div>
        ),
        cell: ({ row }) => (
          <div className="whitespace-pre-line break-words">
            {String(row.getValue("judul") ?? "-")}
          </div>
        ),
      },
      {
        accessorFn: (row) => row.jenisUjian.namaJenis ?? "-",
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
          <div className="flex items-center gap-1 select-none">
            Tanggal Pengajuan
          </div>
        ),
        cell: ({ row }) => {
          const v = String(row.getValue("tanggal") ?? "");
          try {
            return new Date(v).toLocaleDateString("id-ID");
          } catch {
            return v;
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
              className={`px-2 py-1 rounded text-sm ${getStatusColor(s)} ${
                s === "menunggu"
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
        id: "actions",
        cell: ({ row }) => {
          return (
            <div className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-1 h-7 w-7"
                    aria-label="Aksi"
                  >
                    <MoreHorizontal size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/mahasiswa/jadwal-ujian`}
                      className="w-full flex items-center justify-between gap-2 text-sm px-3 py-2"
                    >
                      <span className="flex items-center gap-2">
                        Lihat Jadwal Ujian
                      </span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
    } catch {}
  }, [filterJudul, filterStatus, filterJenisUjian, table]);

  const [showForm, setShowForm] = useState(false);

  // Tabs view mode state
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  // State for popover filter
  const [openFilter, setOpenFilter] = useState(false);

  return (
    <div className="border bg-white dark:bg-neutral-900 p-3 sm:p-6 rounded-lg shadow-sm w-full max-w-full">
      {/* Filter/Search/Add Bar */}
      <div className="flex flex-row items-center gap-2 mb-4 w-full sm:justify-end">
        {/* Search */}
        <div className="relative flex-1 min-w-[120px] max-w-full">
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
          <PopoverContent align="end" className="min-w-[200px]">
            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
              Jenis Ujian
            </div>
            <Button
              variant={filterJenisUjian === "all" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-between"
              onClick={() => setFilterJenisUjian("all")}
            >
              <span className="text-sm">Semua</span>
              {filterJenisUjian === "all" && <Check size={14} />}
            </Button>
            {jenisUjianList.map((jenis) => (
              <Button
                key={jenis.id}
                variant={
                  filterJenisUjian === String(jenis.id) ? "secondary" : "ghost"
                }
                size="sm"
                className="w-full justify-between"
                onClick={() => setFilterJenisUjian(String(jenis.id))}
              >
                <span className="text-sm">{jenis.namaJenis}</span>
                {filterJenisUjian === String(jenis.id) && <Check size={14} />}
              </Button>
            ))}
            <div className="px-2 py-1 mt-2 text-xs font-semibold text-muted-foreground border-t border-muted">
              Status
            </div>
            {statusOptions.map((opt) => (
              <Button
                key={opt.value}
                variant={filterStatus === opt.value ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-between"
                onClick={() => setFilterStatus(opt.value)}
              >
                <span className="text-sm">{opt.label}</span>
                {filterStatus === opt.value && <Check size={14} />}
              </Button>
            ))}
          </PopoverContent>
        </Popover>
        {/* Tabs */}
        <Tabs
          value={viewMode}
          onValueChange={(v) => setViewMode(v as "table" | "card")}
          className="h-8"
        >
          <TabsList className="rounded-md bg-muted p-1 gap-1">
            <TabsTrigger
              value="table"
              className="inline-flex items-center gap-2 h-7 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              aria-label="Table view"
            >
              <LayoutGrid />
            </TabsTrigger>
            <TabsTrigger
              value="card"
              className="inline-flex items-center gap-2 h-7 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              aria-label="Card view"
            >
              <List />
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {/* Tombol pengajuan */}
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 flex items-center gap-2 rounded-lg hidden sm:flex"
          onClick={() => setShowForm(true)}
        >
          <span>Ajukan ujian</span>
          <Plus size={14} />
        </Button>
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-2 flex items-center gap-2 rounded-lg sm:hidden"
          onClick={() => setShowForm(true)}
          aria-label="Ajukan ujian"
        >
          <Plus size={16} />
        </Button>
      </div>

      {/* Popup Modal Form Pengajuan Ujian */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="relative max-w-3xl w-full bg-white dark:bg-[#232323] rounded-xl shadow-2xl overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setShowForm(false)}
              aria-label="Tutup Form"
            >
              <X size={16} />
            </Button>
            <div className="p-4 ">
              <div className="text-lg font-medium mb-2 ">
                Form Pengajuan Ujian
              </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {filteredData.map((item, idx) => {
            const key = item.id ?? idx;
            const judul = item.ranpel.judulPenelitian ?? "-";
            const jenis = item.jenisUjian.namaJenis ?? "-";
            const tanggal = item.tanggalPengajuan ?? "";
            const status = item.status ?? "-";
            // Simulasi data ruangan dan waktu, ganti sesuai kebutuhan
            // Format tanggal
            const tanggalStr = tanggal
              ? new Date(String(tanggal)).toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
              : "-";
            return (
              <div
                key={key}
                className="relative border rounded-xl p-4 bg-white dark:bg-neutral-900 shadow-sm flex flex-col min-h-[220px]"
              >
                {/* Status di kanan atas */}
                <span
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold
                    max-w-[110px] truncate
                    ${getStatusColor(status)} ${
                    status === "menunggu"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : status === "diterima"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : status === "ditolak"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : status === "dijadwalkan"
                      ? "bg-violet-200 text-violet-700 dark:bg-violet-900 dark:text-violet-200"
                      : status === "selesai"
                      ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      : ""
                  }`}
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
                {/* Tanggal di kiri atas */}
                <div className="text-sm text-muted-foreground mb-2">
                  {tanggalStr}
                </div>
                {/* Judul besar, tambahkan mt-2 */}
                <div className="font-bold text-base mt-2 mb-2 whitespace-pre-line break-words">
                  {judul}
                </div>
                {/* Info jenis, ruangan, waktu */}
                <div className="text-sm text-muted-foreground mb-1">
                  Jenis: {jenis}
                </div>
                {/* Tombol aksi di kanan bawah */}
                <div className="absolute bottom-4 right-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="p-2">
                        <MoreHorizontal size={22} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/mahasiswa/jadwal-ujian`}
                          className="w-full flex items-center justify-between gap-2 text-sm px-3 py-2"
                        >
                          <span className="flex items-center gap-2">
                            Lihat Jadwal Ujian
                          </span>
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
      {/* pagination controls are rendered by TableGlobal (previous/next) */}
    </div>
  );
}
