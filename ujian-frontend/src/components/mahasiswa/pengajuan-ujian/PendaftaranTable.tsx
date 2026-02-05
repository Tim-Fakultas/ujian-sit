"use client";
import { useState, useMemo, useEffect } from "react";
import { DataTableFilter } from "@/components/data-table/DataTableFilter";
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
  MoreHorizontal,
  Eye,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { getJenisUjianColor, getStatusColor, truncateTitle, getStorageUrl } from "@/lib/utils";
import { PendaftaranUjian } from "@/types/PendaftaranUjian";
import { User } from "@/types/Auth";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";

import { Ujian } from "@/types/Ujian";
import PengajuanUjianForm from "./PendaftaranUjianForm";
import { JenisUjian } from "@/types/JenisUjian";
import { deletePendaftaranUjian } from "@/actions/pendaftaranUjian";
import InlineBerkasModal from "./InlineBerkasModal";
import { showToast } from "@/components/ui/custom-toast";
import { useRouter } from "next/navigation";

import { DataCard } from "@/components/common/DataCard";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useDebounce } from "@/hooks/use-debounce";

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
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Pisahkan filter jenis dan status
  const [filterJenisUjian, setFilterJenisUjian] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [keteranganModal, setKeteranganModal] = useState(false);
  const [keteranganContent, setKeteranganContent] = useState("");

  const [berkasModalOpen, setBerkasModalOpen] = useState(false);
  const [selectedPendaftaran, setSelectedPendaftaran] = useState<PendaftaranUjian | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pendaftaranToDelete, setPendaftaranToDelete] = useState<PendaftaranUjian | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();


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



  const handleDelete = async () => {
    if (!pendaftaranToDelete || !user) return;

    setIsDeleting(true);
    try {
      await deletePendaftaranUjian(user.id, pendaftaranToDelete.id);
      showToast.success("Pendaftaran ujian berhasil dihapus");
      setDeleteConfirmOpen(false);
      setPendaftaranToDelete(null);
      router.refresh();
    } catch (error) {
      console.error("Error deleting pendaftaran:", error);
      showToast.error("Gagal menghapus pendaftaran ujian");
    } finally {
      setIsDeleting(false);
    }
  };

  // FILTERED & SORTED DATA
  const filteredData = useMemo(() => {
    return (pendaftaranUjian || []).filter((pendaftaran) => {
      const matchJudul = (pendaftaran.judulPenelitian ?? "")
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase());
      const matchJenis =
        filterJenisUjian === "all"
          ? true
          : String(pendaftaran.jenisUjian?.id) === filterJenisUjian;
      const matchStatus =
        filterStatus === "all" ? true : pendaftaran.status === filterStatus;
      return matchJudul && matchJenis && matchStatus;
    });
  }, [pendaftaranUjian, debouncedSearchTerm, filterJenisUjian, filterStatus]);

  // build react-table columns (used by TableGlobal)
  const cols: ColumnDef<PendaftaranUjian>[] = useMemo(
    () => [
      {
        id: "no",
        header: () => <div className="text-center">No</div>,
        cell: ({ row, table }) => {
          const index =
            (table.getState().pagination?.pageIndex ?? 0) *
            (table.getState().pagination?.pageSize ?? 10) +
            row.index +
            1;
          return <div className="text-center font-medium">{index}</div>;
        },
      },
      {
        accessorFn: (row) => row.judulPenelitian ?? "-",
        id: "judul",
        header: () => (
          <div className="flex items-center gap-1 select-none">Judul</div>
        ),
        cell: ({ row }) => {
          const judul = String(row.getValue("judul") ?? "-");
          return (
            <div className="min-w-[300px] text-left" title={judul}>
              {truncateTitle(judul, 50)}
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.jenisUjian?.namaJenis ?? "-",
        id: "jenis",
        header: () => <div className="text-center">Jenis Ujian</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold inline-block
                        ${getJenisUjianColor(String(row.getValue("jenis")))}
                      `}
            >
              {row.getValue("jenis")}
            </span>
          </div>
        ),
      },
      {
        accessorFn: (row) => row.tanggalPengajuan ?? "",
        id: "tanggal",
        header: () => (
          <div className="text-center select-none">
            Tanggal Pengajuan
          </div>
        ),
        cell: ({ row }) => {
          const v = String(row.getValue("tanggal") ?? "");
          try {
            return (
              <div className="text-center">
                {new Date(v).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
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
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
          const s = String(row.getValue("status"));
          return (
            <div className="text-center">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(s)} ${s === "menunggu"
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
                  : s === "diterima"
                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                    : s === "ditolak"
                      ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                      : s === "dijadwalkan"
                        ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                        : s === "selesai"
                          ? "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
                          : ""
                  }`}
              >
                {s}
              </span>
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.keterangan ?? "",
        id: "keterangan",
        header: () => (
          <div className="text-center select-none">
            Keterangan
          </div>
        ),
        cell: ({ row }) => {
          const keterangan = String(row.getValue("keterangan") ?? "");
          if (!keterangan || keterangan === "-") return <div className="text-center text-muted-foreground text-xs">-</div>;
          return (
            <div className="text-center">
              <Button variant="ghost" size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
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
      {
        id: "aksi",
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => {
          const pendaftaran = row.original;
          const status = String(pendaftaran.status || "").toLowerCase();
          const canEdit = status === "menunggu" || status === "revisi";

          return (
            <div className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedPendaftaran(pendaftaran);
                      setBerkasModalOpen(true);
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Lihat Berkas
                  </DropdownMenuItem>
                  {status === "menunggu" && (
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                      onClick={() => {
                        setPendaftaranToDelete(pendaftaran);
                        setDeleteConfirmOpen(true);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus Pendaftaran
                    </DropdownMenuItem>
                  )}
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
    } catch { }
  }, [debouncedSearchTerm, filterStatus, filterJenisUjian, table]);

  const [showForm, setShowForm] = useState(false);


  // State for popover filter
  const [openFilter, setOpenFilter] = useState(false);

  return (
    <DataCard className="w-full max-w-full">

      <DataTableFilter
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Cari judul..."
        filters={[
          {
            key: "jenis",
            title: "Jenis Ujian",
            value: filterJenisUjian,
            onChange: setFilterJenisUjian,
            options: [
              { value: "all", label: "Semua" },
              ...jenisUjianList.map((jenis) => ({
                value: String(jenis.id),
                label: jenis.namaJenis,
              })),
            ],
          },
        ]}
        actions={
          <Button
            className="bg-primary hover:bg-primary/80 text-white text-sm px-4 flex items-center gap-2 rounded-lg h-9"
            onClick={() => setShowForm(true)}
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Ajukan Ujian</span>
            <span className="sm:hidden">Ajukan</span>
          </Button>
        }
      />

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
            Belum ada pendaftaran ujian
          </div>
          <div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setFilterStatus("all");
                setSearchTerm("");
                setFilterJenisUjian("all");
              }}
            >
              Reset filter
            </Button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <TableGlobal table={table} cols={cols} emptyMessage="Belum ada pendaftaran ujian." />
        </div>
      )}

      <Dialog open={keteranganModal} onOpenChange={setKeteranganModal}>
        <DialogContent className="max-w-[90%] sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Keterangan</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <div className="bg-slate-50 dark:bg-slate-900 p-3 sm:p-4 rounded-lg border text-xs sm:text-sm leading-relaxed text-gray-700 dark:text-gray-300 break-words">
              {keteranganContent || "-"}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pendaftaran ujian untuk{" "}
              <strong>{pendaftaranToDelete?.judulPenelitian}</strong>?
              <br />
              <br />
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setPendaftaranToDelete(null);
              }}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <InlineBerkasModal
        open={berkasModalOpen}
        onOpenChange={setBerkasModalOpen}
        pendaftaran={selectedPendaftaran}
        mahasiswaId={user?.id || 0}
      />
    </DataCard >




  );
}
