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
import { useRouter } from "next/navigation";

import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import PDFPreviewModal from "./PDFPreviewModal";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Search,
  Plus,
  LayoutGrid,
  List,
  Check,
  Settings2,
  Calendar,
  MessageSquareText,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Form from "./Form";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { DataCard } from "@/components/common/DataCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { deletePengajuanRanpel } from "@/actions/pengajuanRanpel";
import { showToast } from "@/components/ui/custom-toast";

export default function PengajuanTableClient({
  data,
}: {
  data: PengajuanRanpel[];
}) {
  const router = useRouter();
  const [selectedPengajuan, setSelectedPengajuan] =
    useState<PengajuanRanpel | null>(null);

  // separate modal states: pdf preview, delete confirmation, and form modal
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Delete state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pengajuanToDelete, setPengajuanToDelete] = useState<PengajuanRanpel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      const tanggalDiterima = (p.tanggalDiterima ?? "").toString().toLowerCase();
      const tanggalDitolak = (p.tanggalDitolak ?? "").toString().toLowerCase();
      const statusMatch =
        filterStatus === "all" ? true : status === filterStatus;

      const qEmpty = q === "";
      const matchesQ =
        qEmpty ||
        nama.includes(q) ||
        judul.includes(q) ||
        status.includes(q) ||
        tanggal.includes(q) ||
        tanggalDiterima.includes(q) ||
        tanggalDitolak.includes(q);
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

  const handleDeleteClick = React.useCallback((pengajuan: PengajuanRanpel) => {
    setPengajuanToDelete(pengajuan);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = async () => {
    if (!pengajuanToDelete || !pengajuanToDelete.mahasiswa?.id || !pengajuanToDelete.id) return;

    try {
      setIsDeleting(true);
      await deletePengajuanRanpel(pengajuanToDelete.mahasiswa.id, pengajuanToDelete.id);
      showToast.success("Pengajuan berhasil dihapus");
      router.refresh();
      setIsDeleteDialogOpen(false);
      setPengajuanToDelete(null);
    } catch (error) {
      console.error(error);
      showToast.error("Gagal menghapus pengajuan");
    } finally {
      setIsDeleting(false);
    }
  };

  const { user } = useAuthStore();


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
        cell: ({ row }) => (
          <div className="max-w-[150px] truncate" title={row.getValue("nama")}>
            {row.getValue("nama")}
          </div>
        ),
      },
      {
        accessorFn: (row) => row.perbaikanJudul?.judulBaru || row.ranpel?.judulPenelitian || "-",
        id: "judul",
        header: "Judul Penelitian",
        cell: ({ row }) => {
          const judul = String(row.getValue("judul") ?? "");
          return (
            // single-line truncation to keep rows aligned
            <div className="max-w-[250px] truncate" title={judul}>
              {judul}
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.tanggalPengajuan ?? "",
        id: "tanggal",
        header: () => <div className="text-center">Tanggal Pengajuan</div>,
        cell: ({ row }) => {
          const val = row.getValue("tanggal") as string;
          try {
            return (
              <div className="text-center">
                {new Date(val).toLocaleDateString("id-ID")}
              </div>
            );
          } catch {
            return <div className="text-center">{val}</div>;
          }
        },
      },
      {
        id: "tanggalKeputusan",
        header: "Tanggal Diterima / Ditolak",
        cell: ({ row }) => {
          const status = row.original.status;
          let dateVal = null;

          if (status === "diterima") dateVal = row.original.tanggalDiterima;
          else if (status === "ditolak") dateVal = row.original.tanggalDitolak;

          if (!dateVal) return "-";

          try {
            return new Date(dateVal).toLocaleDateString("id-ID");
          } catch {
            return "-";
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
        id: "catatan",
        header: () => <div className="text-center">Catatan</div>,
        cell: ({ row }) => {
          const catDosen = row.original.keterangan;
          const catKaprodi = row.original.catatanKaprodi;

          const hasDosen = catDosen && catDosen !== "-" && catDosen.trim() !== "";
          const hasKaprodi = catKaprodi && catKaprodi !== "-" && catKaprodi.trim() !== "";

          if (!hasDosen && !hasKaprodi) return <div className="text-center"><span className="text-muted-foreground">-</span></div>;

          return (
            <div className="flex justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 bg-blue-50/50 hover:bg-blue-100 hover:text-blue-700 rounded-full">
                    <MessageSquareText size={15} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Catatan</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 pt-2">
                    {hasDosen && (
                      <div>
                        <h4 className="font-semibold mb-1.5 text-xs uppercase tracking-wider text-blue-600 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                          Dosen PA
                        </h4>
                        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                          {catDosen}
                        </div>
                      </div>
                    )}
                    {hasKaprodi && (
                      <div>
                        <h4 className="font-semibold mb-1.5 text-xs uppercase tracking-wider text-indigo-600 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                          Kaprodi
                        </h4>
                        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                          {catKaprodi}
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center justify-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600"
                onClick={() => handleLihatClick(item)}
                title="Lihat Detail"
              >
                <Eye size={18} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                onClick={() => handleDeleteClick(item)}
                title="Hapus Pengajuan"
              >
                <Trash2 size={18} />
              </Button>
            </div>
          );
        },
      },
    ],
    [handleLihatClick, handleDeleteClick]
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
    } catch { }
  }, [search, filterStatus, table]);

  return (
    <>
      <DataCard className="w-full max-w-full">
        {/* Header controls: search/filter/add/tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 mb-4 w-full">
          {/* Search input */}
          <div className="relative flex-1 w-full">
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
              onValueChange={(v) => setViewMode(v as any)}
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
            {/* Tombol tambah pengajuan */}
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 flex items-center justify-center rounded-lg h-9"
              onClick={handleOpenForm}
              title="Tambah pengajuan"
              aria-label="Tambah pengajuan"
            >
              <Plus size={16} />
              <span className="hidden sm:inline ml-2">Tambah Pengajuan</span>
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
          // Hapus overflow-x-auto agar table tidak scroll ke samping
          <div className="w-full">
            <TableGlobal table={table} cols={cols} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
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
                  <div className="bg-gray-50/50 dark:bg-neutral-800/50 p-3 flex items-center justify-end border-t border-gray-100 dark:border-neutral-800 gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleLihatClick(item)}
                      className="text-xs h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                    >
                      <Eye size={14} className="mr-1.5" /> Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteClick(item)}
                      className="text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                    >
                      <Trash2 size={14} className="mr-1.5" /> Hapus
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

      {/* Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengajuan?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data pengajuan ini akan dihapus secara permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  );
}
