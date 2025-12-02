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
import PDFPreviewModal from "./PDFPreviewModal";
import { Button } from "@/components/ui/button";
import {
  Eye,
  ListFilter,
  MoreHorizontal,
  ArrowUpDown,
  LayoutGrid,
  List,
  Check,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { truncateTitle } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function PengajuanRanpelClient({
  pengajuanRanpel,
}: {
  pengajuanRanpel: PengajuanRanpel[];
}) {
  // modal state for PDF preview
  const [selectedPengajuan, setSelectedPengajuan] =
    useState<PengajuanRanpel | null>(null);
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  // Controls
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  const statusOptions = [
    { value: "all", label: "Semua" },
    { value: "menunggu", label: "Menunggu" },
    { value: "diterima", label: "Diterima" },
    { value: "ditolak", label: "Ditolak" },
    { value: "diverifikasi", label: "Diverifikasi" },
  ];

  // filtered data (global search across nama, judul, status, tanggal)
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

  // table state
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // helper label for current sort (small UX nicety)
  const currentSortLabel = React.useMemo(() => {
    if (!sorting?.length) return "Urutkan";
    const s = sorting[0];
    if (s.id === "tanggal")
      return s.desc ? "Tanggal terbaru" : "Tanggal terlama";
    if (s.id === "nama") return s.desc ? "Nama Z–A" : "Nama A–Z";
    return "Urutkan";
  }, [sorting]);

  const handleSortSelect = (value: string) => {
    // value values: tanggal:desc / tanggal:asc / nama:asc / nama:desc / none
    if (value === "none") {
      setSorting([]);
      return;
    }
    const [id, order] = value.split(":");
    setSorting([{ id, desc: order === "desc" }]);
  };

  // sort options for dropdown (tanggal / nama)
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

  // handlers
  const handleLihatClick = React.useCallback((pengajuan: PengajuanRanpel) => {
    setSelectedPengajuan(pengajuan);
    setIsPdfOpen(true);
  }, []);
  const handleClosePdf = () => {
    setIsPdfOpen(false);
    setSelectedPengajuan(null);
  };

  // columns (mirip mahasiswa)
  const cols: ColumnDef<PengajuanRanpel>[] = React.useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => null,
        cell: ({ row }) => null,
        enableSorting: false,
        enableHiding: false,
      },
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
        header: ({ column }) => (
          <div className="flex items-center gap-1">
            <span>Nama Mahasiswa</span>
          </div>
        ),
        cell: ({ row }) => <div>{row.getValue("nama")}</div>,
      },
      {
        accessorFn: (row) => row.ranpel?.judulPenelitian ?? "-",
        id: "judul",
        header: "Judul Penelitian",
        cell: ({ row }) => {
          const judul = String(row.getValue("judul") ?? "");
          return (
            // use single-line truncate to avoid layout overlaps
            <div className="max-w-[48ch] ">{truncateTitle(judul, 40)}</div>
          );
        },
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
        enableHiding: false,
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

  // reset page when filters change
  useEffect(() => {
    try {
      table.setPageIndex?.(0);
    } catch {}
  }, [search, filterStatus]); // eslint-disable-line

  return (
    <>
      {/* buat background container lebih gelap, dan biarkan card di dalam sedikit lebih terang */}
      <div className="bg-white dark:bg-neutral-900 border p-4 md:p-6 rounded-md shadow-sm">
        {/* Header controls: column on mobile, row on desktop (search left, controls right) */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {/* Search - takes available space */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-muted-foreground" />
              </div>
              <Input
                placeholder="Search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full pl-10 bg-white dark:bg-neutral-800"
                aria-label="Search"
              />
            </div>
          </div>

          {/* Controls - align center on desktop; compact on mobile */}
          <div className="flex items-center gap-2 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-9 p-0 grid place-items-center"
                  aria-label="Filter status"
                  title="Filter status"
                >
                  <ListFilter size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[180px]">
                {statusOptions.map((opt) => {
                  const isActive = filterStatus === opt.value;
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
                      {isActive && <Check size={14} />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 flex items-center gap-2"
                  aria-label="Sort"
                  title="Sort"
                >
                  <ArrowUpDown size={14} />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                {sortOptions.map((opt) => {
                  const active = isSortActive(opt.value);
                  return (
                    <DropdownMenuItem
                      key={opt.value}
                      onClick={() => handleSortSelect(opt.value)}
                      className={`flex items-center justify-between gap-2 ${
                        active ? "bg-muted/30" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            opt.value.startsWith("tanggal")
                              ? "bg-gray-400"
                              : "bg-gray-500"
                          }`}
                        />
                        <span className="text-sm">{opt.label}</span>
                      </div>
                      {active && <Check size={14} />}
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuItem
                  onClick={() => handleSortSelect("none")}
                  className="mt-1"
                >
                  Reset sorting
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Tabs
              value={viewMode}
              onValueChange={(v) => setViewMode(v as "table" | "card")}
              className="h-8"
            >
              <TabsList className="rounded-md bg-muted p-1 gap-1">
                <TabsTrigger
                  value="table"
                  className="inline-flex items-center gap-2 flex-none h-7 px-2 text-xs sm:text-sm rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  aria-label="Table view"
                >
                  <LayoutGrid size={16} />
                </TabsTrigger>
                <TabsTrigger
                  value="card"
                  className="inline-flex items-center gap-2 flex-none h-7 px-2 text-xs sm:text-sm rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  aria-label="Card view"
                >
                  <List size={16} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Table / Card atau pesan jika tidak ada data */}
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
              return (
                <div
                  key={key}
                  className="border rounded-lg p-4 bg-white dark:bg-neutral-800 shadow-xs "
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
                        className={`px-2 py-1 rounded text-sm ${
                          status === "menunggu"
                            ? "bg-yellow-100 text-yellow-800"
                            : status === "diterima"
                            ? "bg-green-100 text-green-800"
                            : status === "ditolak"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
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
          isOpen={isPdfOpen}
          onClose={handleClosePdf}
          pengajuan={selectedPengajuan}
        />
      )}
    </>
  );
}
