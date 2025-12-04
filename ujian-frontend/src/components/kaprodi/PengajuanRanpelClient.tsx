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
import PDFPreviewModal from "../dosen/PDFPreviewModal";
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
} from "lucide-react";
import { truncateTitle } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <div className="bg-white dark:bg-neutral-900 p-4 md:p-6 rounded-md shadow-sm">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredData.map((item, idx) => {
              const key = (item as any).id ?? idx;
              const nama = item.mahasiswa?.nama ?? "-";
              const judul = item.ranpel?.judulPenelitian ?? "-";
              const tanggal = item.tanggalPengajuan ?? "";
              const status = item.status ?? "-";
              const colorClass =
                status === "menunggu"
                  ? "bg-yellow-100 text-yellow-800"
                  : status === "diterima"
                  ? "bg-green-100 text-green-800"
                  : status === "ditolak"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800";
              return (
                <div
                  key={key}
                  className="border rounded-lg p-4 bg-white dark:bg-neutral-800 shadow-xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {new Date(String(tanggal)).toLocaleDateString?.(
                          "id-ID"
                        ) || tanggal}
                      </div>
                      <div className="font-medium">{nama}</div>
                      <div className="text-sm text-muted-foreground mt-2">
                        {truncateTitle(String(judul), 80)}
                      </div>
                    </div>
                    <div className="ml-3 text-right">
                      <div
                        className={`px-2 py-1 rounded text-sm ${colorClass}`}
                      >
                        {status}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleLihatClick(item)}
                    >
                      Preview
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
