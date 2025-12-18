/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import TableGlobal from "@/components/tableGlobal";

import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import PDFPreviewModal from "../../app/(routes)/dosen/jadwal-ujian/PDFPreviewModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Eye,
  Search,
  ListFilter,
  ArrowUpDown,
  MoreHorizontal,
  LayoutGrid,
  List,
  Check,
  Calendar,
} from "lucide-react";
import { truncateTitle } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataCard } from "@/components/common/DataCard";

export default function PengajuanTableClient({
  pengajuanRanpel,
}: {
  pengajuanRanpel: PengajuanRanpel[];
}) {
  // preview modal
  const [selectedPengajuan, setSelectedPengajuan] =
    useState<PengajuanRanpel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // view mode + sorting state for react-table
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // controls
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const statusOptions = [
    { value: "all", label: "Semua" },
    { value: "menunggu", label: "Menunggu" },
    { value: "diterima", label: "Diterima" },
    { value: "diverifikasi", label: "Diverifikasi" },
    { value: "ditolak", label: "Ditolak" },
  ];

  const sortOptions = [
    { value: "tanggal:desc", label: "Tanggal terbaru" },
    { value: "tanggal:asc", label: "Tanggal terlama" },
    { value: "nama:asc", label: "Nama A–Z" },
    { value: "nama:desc", label: "Nama Z–A" },
  ];
  const isSortActive = (val: string) => {
    if (!sorting?.length) return false;
    const s = sorting[0] as any;
    return `${s.id}:${s.desc ? "desc" : "asc"}` === val;
  };
  const handleSortSelect = (val: string) => {
    if (val === "none") {
      setSorting([]);
      return;
    }
    const [id, order] = val.split(":");
    setSorting([{ id, desc: order === "desc" }]);
  };

  //* filtered data (global search across nama, judul, status, tanggal)
  const filteredData = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    return (pengajuanRanpel || []).filter((p) => {
      const nama = (p.mahasiswa?.nama ?? "").toLowerCase();
      const judul = (p.ranpel?.judulPenelitian ?? "").toLowerCase();
      const status = (p.status ?? "").toLowerCase();
      const tanggal = (p.tanggalPengajuan ?? "").toString().toLowerCase();
      const statusMatch =
        filterStatus === "all" ? true : status === filterStatus;
      const qEmpty = q === "";
      const matchesQ =
        qEmpty ||
        nama.includes(q) ||
        judul.includes(q) ||
        status.includes(q) ||
        tanggal.includes(q);
      return matchesQ && statusMatch;
    });
  }, [pengajuanRanpel, search, filterStatus]);

  // table state (sorting state already declared above)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // handlers
  const handleLihatClick = React.useCallback((p: PengajuanRanpel) => {
    setSelectedPengajuan(p);
    setIsModalOpen(true);
  }, []);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPengajuan(null);
  };

  // columns
  const cols: ColumnDef<PengajuanRanpel>[] = useMemo(
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
        accessorFn: (row) => row.mahasiswa?.nama ?? "-",
        id: "nama",
        header: () => (
          <div className="flex items-center gap-1">
            <span>Nama Mahasiswa</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{String(row.getValue("nama"))}</div>
        ),
      },
      {
        accessorFn: (row) => row.ranpel?.judulPenelitian ?? "-",
        id: "judul",
        header: "Judul Rancangan Penelitian",
        cell: ({ row }) => (
          <div className="max-w-[48ch] ">
            {truncateTitle(String(row.getValue("judul")), 40)}
          </div>
        ),
      },
      {
        accessorFn: (row) => row.tanggalPengajuan ?? "",
        id: "tanggal",
        header: "Tanggal Pengajuan",
        cell: ({ row }) => {
          const val = row.getValue("tanggal") as string;
          try {
            return new Date(val).toLocaleDateString("id-ID");
          } catch {
            return val;
          }
        },
      },
      {
        accessorFn: (row) => row.status ?? "-",
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const s = String(row.getValue("status"));
          const cls =
            s === "menunggu"
              ? "bg-yellow-100 text-yellow-800"
              : s === "diterima"
              ? "bg-green-100 text-green-800"
              : s === "ditolak"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800";
          return (
            <span className={`px-2 py-1 rounded text-sm ${cls}`}>{s}</span>
          );
        },
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleLihatClick(item)}>
                    <Eye size={14} /> Preview
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [handleLihatClick]
  );

  const table = useReactTable({
    data: filteredData,
    columns: cols,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // reset page when search/filter change
  useEffect(() => {
    try {
      table.setPageIndex?.(0);
    } catch {}
  }, [search, filterStatus]); // eslint-disable-line

  return (
    <>
      <DataCard>
        {/* Header */}

        {/* Controls: search, status filter (with colored dots), sort dropdown, view tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-muted-foreground" />
              </div>
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 bg-white dark:bg-neutral-800"
              />
            </div>
          </div>

          {/* status filter as DropdownMenu with colored dots */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 flex items-center gap-2"
              >
                <ListFilter size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {statusOptions.map((opt) => {
                const color =
                  opt.value === "menunggu"
                    ? "bg-yellow-500"
                    : opt.value === "diterima"
                    ? "bg-green-500"
                    : opt.value === "ditolak"
                    ? "bg-red-500"
                    : opt.value === "diverifikasi"
                    ? "bg-blue-500"
                    : "bg-gray-500";
                const active = filterStatus === opt.value;
                return (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => setFilterStatus(opt.value)}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2 h-2 rounded-full ${color} inline-block`}
                        aria-hidden
                      />
                      <span className="text-sm">{opt.label}</span>
                    </div>
                    {active && <Check size={14} />}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* sort dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 flex items-center gap-2"
              >
                <ArrowUpDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {sortOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => handleSortSelect(opt.value)}
                  className={`flex items-center justify-between gap-2 ${
                    isSortActive(opt.value) ? "bg-muted/30" : ""
                  }`}
                >
                  <span className="text-sm">{opt.label}</span>
                  {isSortActive(opt.value) && <Check size={14} />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={() => handleSortSelect("none")}>
                Reset sorting
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* view tabs */}
          <div>
            <Tabs
              value={viewMode}
              onValueChange={(v) => setViewMode(v as "table" | "card")}
              className="h-8"
            >
              <TabsList className="rounded-md bg-muted p-1 gap-1">
                <TabsTrigger value="table" className="h-7 px-2 rounded-md">
                  <LayoutGrid size={14} />
                </TabsTrigger>
                <TabsTrigger value="card" className="h-7 px-2 rounded-md">
                  <List size={14} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Table or Card view */}
        {filteredData.length === 0 ? (
          <div className="p-6 flex flex-col items-center justify-center gap-3">
            <div className="text-sm text-muted-foreground text-center">
              Tidak ada data pengajuan rancangan penelitian.
            </div>
            <div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setFilterStatus("all");
                  setSearch("");
                }}
              >
                Reset filter
              </Button>
            </div>
          </div>
        ) : viewMode === "table" ? (
          <TableGlobal table={table} cols={cols} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredData.map((item, idx) => {
              const key = (item as any).id ?? idx;
              const nama = item.mahasiswa?.nama ?? "-";
              const judul = item.ranpel?.judulPenelitian ?? "-";
              const tanggal = item.tanggalPengajuan ?? "";
              const status = item.status ?? "-";
              
              const statusColor =
                status === "menunggu" ? "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800" :
                status === "diterima" ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800" :
                status === "ditolak" ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800" :
                status === "diverifikasi" ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" :
                "bg-gray-100 text-gray-800 border-gray-200 dark:bg-neutral-800 dark:text-gray-400";



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
                           <span>
                             {new Date(String(tanggal)).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                             })}
                           </span>
                        </div>
                        
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}>
                           {status}
                        </span>
                     </div>

                     {/* Content: Title & Name */}
                     <div className="space-y-2">
                          <h3 className="font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-3" title={judul}>
                             {judul || "Judul tidak tersedia"}
                          </h3>
                          
                          <div className="flex items-center gap-2 pt-1 border-t border-gray-50 dark:border-neutral-800 mt-2">
                             <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 mt-2">
                                {nama.charAt(0)}
                             </div>
                             <div className="flex flex-col mt-2">
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[180px]">
                                   {nama}
                                </span>
                             </div>
                          </div>
                     </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="bg-gray-50/50 dark:bg-neutral-800/50 p-3 flex items-center justify-end border-t border-gray-100 dark:border-neutral-800">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleLihatClick(item)}
                      className="text-xs h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                    >
                      <Eye size={14} className="mr-1.5" /> Preview
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DataCard>

      {/* PDF Preview Modal */}
      {selectedPengajuan && (
        <PDFPreviewModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          pengajuan={selectedPengajuan}
        />
      )}
    </>
  );
}
