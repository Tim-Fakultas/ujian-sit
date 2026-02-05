/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { DataTableFilter } from "@/components/data-table/DataTableFilter";
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
import { useRouter, useSearchParams } from "next/navigation";

import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import PDFPreviewModal from "./PDFPreviewModal";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Search,
  Plus,
  Check,
  Settings2,
  Calendar,
  MessageSquareText,
  Trash2,
  X,
  MoreHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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



  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "all";

  // Controls
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState(initialStatus);
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
        header: () => <div className="text-center font-semibold">No</div>,
        cell: ({ row, table }) => {
          // compute index from pagination
          const index =
            (table.getState().pagination?.pageIndex ?? 0) *
            (table.getState().pagination?.pageSize ?? 10) +
            row.index +
            1;
          return <div className="text-center">{index}</div>;
        },
        size: 50,
      },
      {
        accessorFn: (row) => row.mahasiswa?.nama ?? "-",
        id: "nama",
        header: () => (
          <div className="whitespace-nowrap font-semibold">
            <span>Nama Mahasiswa</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="max-w-[180px] truncate font-medium" title={row.getValue("nama")}>
            {row.getValue("nama")}
          </div>
        ),
      },
      {
        accessorFn: (row) => row.perbaikanJudul?.judulBaru || row.ranpel?.judulPenelitian || "-",
        id: "judul",
        header: () => <div className="whitespace-nowrap font-semibold">Judul Penelitian</div>,
        cell: ({ row }) => {
          const judul = String(row.getValue("judul") ?? "");
          return (
            // single-line truncation to keep rows aligned
            <div className="max-w-[280px] truncate text-muted-foreground" title={judul}>
              {judul}
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.tanggalPengajuan ?? "",
        id: "tanggal",
        header: () => <div className="text-center whitespace-nowrap font-semibold">Tgl. Pengajuan</div>,
        cell: ({ row }) => {
          const val = row.getValue("tanggal") as string;
          try {
            return (
              <div className="text-center whitespace-nowrap">
                {new Date(val).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            );
          } catch {
            return <div className="text-center">{val}</div>;
          }
        },
      },
      {
        id: "tanggalKeputusan",
        header: () => (
          <div className="text-center whitespace-nowrap font-semibold" title="Tanggal Diterima / Ditolak">
            Tgl. Keputusan
          </div>
        ),
        cell: ({ row }) => {
          const status = row.original.status;
          let dateVal = null;

          if (status === "diterima") dateVal = row.original.tanggalDiterima;
          else if (status === "ditolak") dateVal = row.original.tanggalDitolak;

          if (!dateVal) return <div className="text-center">-</div>;

          try {
            return (
              <div className="text-center whitespace-nowrap">
                {new Date(dateVal).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            );
          } catch {
            return <div className="text-center">-</div>;
          }
        },
      },
      {
        accessorFn: (row) => row.status ?? "-",
        id: "status",
        header: () => <div className="text-center font-semibold">Status</div>,
        cell: ({ row }) => {
          const s = String(row.getValue("status"));
          const cls =
            s === "menunggu"
              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
              : s === "diterima"
                ? "bg-green-50 text-green-700 border-green-200"
                : s === "ditolak"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-primary/5 text-primary border-primary/20";
          return (
            <div className="flex justify-center">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls} capitalize`}>
                {s}
              </span>
            </div>
          );
        },
      },
      {
        id: "catatan",
        header: () => <div className="text-center font-semibold">Catatan</div>,
        cell: ({ row }) => {
          const catDosen = row.original.keterangan;
          const catKaprodi = row.original.catatanKaprodi;

          const hasDosen = catDosen && catDosen !== "-" && catDosen.trim() !== "";
          const hasKaprodi = catKaprodi && catKaprodi !== "-" && catKaprodi.trim() !== "";

          if (!hasDosen && !hasKaprodi)
            return (
              <div className="text-center">
                <span className="text-muted-foreground">-</span>
              </div>
            );

          return (
            <div className="flex justify-center ">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary bg-primary/5 hover:bg-primary/10 hover:text-primary rounded-full transition-colors"
                  >
                    <MessageSquareText size={15} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-xl max-w-[90%] sm:max-w-lg max-h-[90vh] overflow-y-auto" showCloseButton={false}>
                  <DialogHeader>
                    <div className="flex items-center justify-between">
                      <DialogTitle>Catatan</DialogTitle>
                      <DialogClose asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-muted-foreground hover:text-foreground">
                          <X className="h-4 w-4" />
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogHeader>
                  <div className="space-y-3 pt-2">
                    {hasDosen && (
                      <div>
                        <h4 className="font-semibold mb-1.5 text-xs uppercase tracking-wider text-primary flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
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
            <div className="flex items-center justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleLihatClick(item)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Lihat Detail
                  </DropdownMenuItem>
                  {item.status === "menunggu" && (
                    <DropdownMenuItem
                      onClick={() => handleDeleteClick(item)}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus Pengajuan
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
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
        <DataTableFilter
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search"
          filters={[
            {
              key: "status",
              title: "Status",
              value: filterStatus,
              onChange: setFilterStatus,
              options: statusOptions,
            },
          ]}
          actions={
            <Button
              className="bg-primary hover:bg-primary/80 text-white text-sm px-4 flex items-center justify-center rounded-lg h-9"
              onClick={handleOpenForm}
              title="Tambah pengajuan"
              aria-label="Tambah pengajuan"
            >
              <Plus size={16} />
              <span className="hidden sm:inline ml-2">Tambah Pengajuan</span>
            </Button>
          }
        />

        {/* Table / Card */}
        <div className="w-full">
          <TableGlobal
            table={table}
            cols={cols}
            emptyMessage="Tidak ada data pengajuan rancangan penelitian."
          />
        </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="max-w-4xl w-full bg-white dark:bg-neutral-800 rounded-xl shadow-2xl relative">
            <div className="h-[90vh] w-full rounded-xl overflow-hidden">
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
