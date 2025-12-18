/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as React from "react";
import { useState, useMemo, useEffect, useRef } from "react";
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
  Search,
  Plus,
  MoreHorizontal,
  LayoutGrid,
  List,
  Check,
  Settings2,
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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

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
  const [openFilter, setOpenFilter] = useState(false);

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
    setIsPdfOpen(true);
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

  // State for ganti judul modal
  const [gantiJudulPengajuan, setGantiJudulPengajuan] =
    useState<PengajuanRanpel | null>(null);
  const [judulBaru, setJudulBaru] = useState("");
  const [fileSurat, setFileSurat] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler for submit ganti judul
  async function handleSubmitGantiJudul(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Implement API call for ganti judul
    // Example: await gantiJudulPengajuanAPI(gantiJudulPengajuan.id, judulBaru, fileSurat)
    setGantiJudulPengajuan(null);
    setJudulBaru("");
    setFileSurat(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    // Show toast or feedback
  }

  // Columns definition
  const cols: ColumnDef<PengajuanRanpel>[] = React.useMemo(
    () => [
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
          return <div>{index}</div>;
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
            <div className="max-w-sm truncate">{judul}</div>
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
                  {item.status === "diterima" && (
                    <DropdownMenuItem
                      onClick={() => setGantiJudulPengajuan(item)}
                    >
                      Ganti Judul
                    </DropdownMenuItem>
                  )}
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

  useEffect(() => {
    try {
      table.setPageIndex?.(0);
    } catch {}
  }, [search, filterStatus, table]);

  return (
    <>
      <div className="bg-white dark:bg-neutral-900 border p-2 sm:p-6 rounded-md shadow-sm w-full max-w-full">
        {/* Header controls: search/filter/add/tabs */}
        <div className="flex flex-row gap-2 mb-4 w-full items-center">
          {/* Search input */}
          <div className="relative min-w-[120px] max-w-full flex-1">
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
            <PopoverContent align="end" className="min-w-[160px] p-2">
              <div className="text-xs font-semibold text-muted-foreground mb-1">
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
          {/* Tombol tambah pengajuan */}
          <Button
            className="w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 flex items-center justify-center rounded-lg h-9"
            onClick={handleOpenForm}
            title="Tambah pengajuan"
            aria-label="Tambah pengajuan"
          >
            <Plus size={16} />
            <span className="hidden sm:inline ml-2">Tambah Pengajuan</span>
          </Button>
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
          // Hapus overflow-x-auto agar table tidak scroll ke samping
          <div className="w-full">
            <TableGlobal table={table} cols={cols} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
            {filteredData.map((item, idx) => {
              const key = (item as any).id ?? idx;
              const nama = item.mahasiswa?.nama ?? "-";
              const judul = item.ranpel?.judulPenelitian ?? "-";
              const tanggal = item.tanggalPengajuan ?? "";
              const status = item.status ?? "-";
              // Status badge style
              const statusClass =
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
                  className="border rounded-lg p-4 bg-white dark:bg-neutral-800 shadow-sm flex flex-col h-full"
                >
                  <div className="flex flex-row flex-wrap justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-muted-foreground mb-1">
                        {new Date(String(tanggal)).toLocaleDateString?.(
                          "id-ID"
                        ) || tanggal}
                      </div>
                      <div className="font-medium break-words max-w-[20ch]">
                        {nama}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2 truncate max-w-[32ch]">
                        {judul}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className={`px-2 py-1 rounded text-sm block ${statusClass}`}
                        style={{ wordBreak: "break-word", maxWidth: "100px" }}
                      >
                        {status}
                      </span>
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
          <div className="max-w-3xl w-full bg-white dark:bg-neutral-800 rounded-xl shadow-2xl relative">
            <div className="h-[90vh] overflow-y-auto w-full rounded-xl">
              {user && (
                <Form 
                    mahasiswaId={user?.id} 
                    onSuccess={handleCloseForm} 
                    onClose={handleCloseForm}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Ganti Judul */}
      {gantiJudulPengajuan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => {
                setGantiJudulPengajuan(null);
                setJudulBaru("");
                setFileSurat(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              ×
            </button>
            <div className="font-semibold text-lg mb-4">
              Ganti Judul Penelitian
            </div>
            <form onSubmit={handleSubmitGantiJudul} className="space-y-4">
              <div>
                <Label className="block text-sm mb-1">Judul Sebelumnya</Label>
                <Input
                  value={gantiJudulPengajuan.ranpel?.judulPenelitian ?? ""}
                  disabled
                  readOnly
                />
              </div>
              <div>
                <Label className="block text-sm mb-1">Judul Setelah</Label>
                <Input
                  value={judulBaru}
                  onChange={(e) => setJudulBaru(e.target.value)}
                  required
                  placeholder="Masukkan judul baru"
                />
              </div>
              <div>
                <Label className="block text-sm mb-1">
                  Upload Surat Perbaikan Judul
                </Label>
                <Input
                  type="file"
                  accept="application/pdf"
                  ref={fileInputRef}
                  onChange={(e) => setFileSurat(e.target.files?.[0] || null)}
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setGantiJudulPengajuan(null);
                    setJudulBaru("");
                    setFileSurat(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  Batal
                </Button>
                <Button type="submit" variant="default">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
