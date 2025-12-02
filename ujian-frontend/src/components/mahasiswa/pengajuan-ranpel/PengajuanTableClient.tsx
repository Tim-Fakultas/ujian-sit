/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
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
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  ListFilter,
  MoreHorizontal,
  ArrowUpDown,
  LayoutGrid,
  List,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Form from "./Form";
import { useAuthStore } from "@/stores/useAuthStore";

type SortKey = "no" | "nama" | "judul" | "tanggal";
type SortOrder = "asc" | "desc";

export default function PengajuanTableClient({
  data,
}: {
  data: PengajuanRanpel[];
}) {
  const [selectedPengajuan, setSelectedPengajuan] =
    useState<PengajuanRanpel | null>(null);
  // separate modal states: pdf preview and form modal
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // view mode: table or card (like dosen)
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  // Controls
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "menunggu", label: "Menunggu" },
    { value: "diterima", label: "Diterima" },
    { value: "ditolak", label: "Ditolak" },
    { value: "diverifikasi", label: "Diverifikasi" },
  ];

  // Filtered data (global search across nama, judul, status, tanggal)
  const filteredData = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    return (data || []).filter((p) => {
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
  }, [data, search, filterStatus]);

  // Table state
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // handlers for preview modal passed into column cell
  const handleLihatClick = React.useCallback((pengajuan: PengajuanRanpel) => {
    setSelectedPengajuan(pengajuan);
    setIsPdfOpen(true); // open PDF preview only
  }, []);
  const handleClosePdf = () => {
    setIsPdfOpen(false);
    setSelectedPengajuan(null);
  };
  const handleOpenForm = () => {
    setIsFormOpen(true);
  };
  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const { user } = useAuthStore();

  // Columns definition
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
          // compute index from pagination
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
            <ArrowUpDown size={16} />
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
            // single-line truncation to keep rows aligned
            <div className="max-w-[48ch] truncate">{judul}</div>
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

  // keep previous behavior: reset page when filters change
  useEffect(() => {
    // if using internal pagination, you can reset page index here via table.setPageIndex(0)
    // but TableGlobal uses table controls; ensure page reset if necessary
    try {
      table.setPageIndex?.(0);
    } catch {}
  }, [search, filterStatus]); // eslint-disable-line

  return (
    <>
      {/* container lebih gelap di dark mode; card di dalam dibuat lebih terang */}
      <div className="bg-white dark:bg-neutral-900 p-4 md:p-6 rounded-md shadow-sm overflow-x-auto">
        {/* Header controls: search left, controls right */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
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
              />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* popover and controls */}
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
              <DropdownMenuContent align="end" className="min-w-[180px]">
                {statusOptions.map((opt) => {
                  const isActive = filterStatus === opt.value;
                  return (
                    <DropdownMenuItem
                      key={opt.value}
                      onClick={() => setFilterStatus(opt.value)}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="text-sm">{opt.label}</span>
                      {isActive && <Check size={14} />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Tabs to switch view (table / card) */}
            <Tabs
              value={viewMode}
              onValueChange={(v) => setViewMode(v as any)}
              className="h-8"
            >
              <TabsList className="rounded-md bg-muted p-1 gap-1">
                <TabsTrigger
                  value="table"
                  className="inline-flex items-center gap-2 h-7 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  aria-label="Table view"
                >
                  <LayoutGrid size={16} />
                </TabsTrigger>
                <TabsTrigger
                  value="card"
                  className="inline-flex items-center gap-2 h-7 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  aria-label="Card view"
                >
                  <List size={16} />
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              className="bg-blue-500 hover:bg-blue-500 text-white text-sm px-4 flex items-center gap-2 rounded-lg"
              onClick={handleOpenForm}
            >
              Tambah pengajuan
              <Plus size={14} />
            </Button>
          </div>
        </div>

        {/* Table / Card */}
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
                  /* buat card lebih terang dari background gelap */
                  className="border rounded-lg p-4 bg-white dark:bg-neutral-800 shadow-sm "
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {new Date(String(tanggal)).toLocaleDateString?.(
                          "id-ID"
                        ) || tanggal}
                      </div>
                      <div className="font-medium">{nama}</div>
                      <div className="text-sm text-muted-foreground mt-2 truncate max-w-[36ch]">
                        {judul}
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

      {/* Card Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6">
          <div className="max-w-3xl w-full bg-white dark:bg-[#232323] rounded-xl shadow-2xl relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-900 dark:hover:text-white"
              onClick={handleCloseForm}
            >
              ✕
            </Button>
            <div className="p-6 h-[90vh] overflow-y-auto w-full">
              {user && (
                <Form mahasiswaId={user?.id} onSuccess={handleCloseForm} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
