"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
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
  ChevronDown,
  MoreHorizontal,
  X,
  Check,
  ArrowUpDown,
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

import { ListFilter } from "lucide-react";
import { Ujian } from "@/types/Ujian";
import PengajuanUjianForm from "./PengajuanUjianForm";
import { JenisUjian } from "@/types/JenisUjian";
import Link from "next/link";

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
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterJenisUjian, setFilterJenisUjian] = useState("all");

  //* Status options
  const statusOptions = [
    { value: "all", label: "All" },
    { value: "menunggu", label: "Menunggu" },
    { value: "diterima", label: "Diterima" },
    { value: "ditolak", label: "Ditolak" },
    { value: "dijadwalkan", label: "Dijadwalkan" },
    { value: "selesai", label: "Selesai" },
  ];

  // SORT STATE
  const [sortField, setSortField] = useState<"judul" | "tanggal" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  // react-table states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // SORT HANDLER
  const handleSort = useCallback(
    (field: "judul" | "tanggal") => {
      // compute next order immediately and sync to react-table sorting state
      const nextOrder =
        sortField === field ? (sortOrder === "asc" ? "desc" : "asc") : "asc";
      setSortField(field);
      setSortOrder(nextOrder);
      setSorting([{ id: field, desc: nextOrder === "desc" }]);
    },
    [sortField, sortOrder]
  );

  // FILTERED & SORTED DATA
  const filteredData = useMemo(() => {
    const data = (pendaftaranUjian || []).filter((pendaftaran) => {
      const matchJudul = pendaftaran.ranpel.judulPenelitian
        .toLowerCase()
        .includes(filterJudul.toLowerCase());
      const matchStatus =
        filterStatus === "all" ? true : pendaftaran.status === filterStatus;
      const matchJenis =
        filterJenisUjian === "all"
          ? true
          : String(pendaftaran.jenisUjian.id) === filterJenisUjian;
      return matchJudul && matchStatus && matchJenis;
    });

    // Note: actual sorting will be handled by react-table using `sorting` state.

    return data;
  }, [pendaftaranUjian, filterJudul, filterStatus, filterJenisUjian]);

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
          return <div className="text-center">{index}</div>;
        },
      },
      {
        accessorFn: (row) => row.ranpel.judulPenelitian ?? "-",
        id: "judul",
        header: () => (
          <div className="flex items-center gap-1 select-none">Judul</div>
        ),
        cell: ({ row }) => (
          <div className="whitespace-pre-line break-words max-w-xs">
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
    [handleSort, sortField, sortOrder]
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

  return (
    <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-lg shadow-sm">
      {/* Filter Bar - design like dosen page */}
      <div className="rounded-md  overflow-x-auto mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="relative">
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
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* status filter - compact popover button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 flex items-center gap-2 rounded-md text-sm font-normal shadow-none min-w-[90px]"
                >
                  <span className="flex items-center gap-2">
                    <ListFilter size={16} />
                    Status
                  </span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[180px]">
                {statusOptions.map((opt) => (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => setFilterStatus(opt.value)}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="text-sm">{opt.label}</span>
                    {filterStatus === opt.value && <Check size={14} />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* jenis ujian filter - compact popover */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-9 p-0 grid place-items-center"
                  aria-label="Filter jenis ujian"
                  title="Filter jenis ujian"
                >
                  <ListFilter size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[180px]">
                <DropdownMenuItem
                  onClick={() => setFilterJenisUjian("all")}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="text-sm">Semua</span>
                  {filterJenisUjian === "all" && <Check size={14} />}
                </DropdownMenuItem>
                {jenisUjianList.map((jenis) => (
                  <DropdownMenuItem
                    key={jenis.id}
                    onClick={() => setFilterJenisUjian(String(jenis.id))}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="text-sm">{jenis.namaJenis}</span>
                    {filterJenisUjian === String(jenis.id) && (
                      <Check size={14} />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* sort dropdown (compact) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 flex items-center gap-2"
                  aria-label="Sort"
                  title="Sort"
                >
                  <ArrowUpDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleSort("tanggal")}>
                  Tanggal{" "}
                  {sortField === "tanggal"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("judul")}>
                  Judul{" "}
                  {sortField === "judul"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSorting([]);
                    setSortField(null);
                  }}
                >
                  Reset sorting
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 flex items-center gap-2 rounded-lg"
              onClick={() => setShowForm(true)}
            >
              <span className="mr-6">Ajukan ujian</span>
              <Plus size={14} />
            </Button>
          </div>
        </div>
      </div>
      {/* Popup Modal Form Pengajuan Ujian */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative max-w-3xl w-full bg-white dark:bg-[#232323] rounded-xl shadow-2xl overflow-auto">
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setShowForm(false)}
              aria-label="Tutup Form"
            >
              <X size={16} />
            </button>
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
                />
              )}
            </div>
          </div>
        </div>
      )}

      <TableGlobal table={table} cols={cols} />
      {/* pagination controls are rendered by TableGlobal (previous/next) */}
    </div>
  );
}
