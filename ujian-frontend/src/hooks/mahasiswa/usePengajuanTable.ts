import { useState, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { deletePengajuanRanpel } from "@/actions/pengajuanRanpel";
import { showToast } from "@/components/ui/custom-toast";

interface UsePengajuanTableProps {
  data: PengajuanRanpel[];
  columns: any[]; // Using any[] for columns dependency, actual type definition stays in component or separate file
}

export function usePengajuanTable({ data, columns }: UsePengajuanTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "all";

  // -- State --
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState(initialStatus);
  const [selectedPengajuan, setSelectedPengajuan] =
    useState<PengajuanRanpel | null>(null);

  // Modals
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Delete specific
  const [pengajuanToDelete, setPengajuanToDelete] =
    useState<PengajuanRanpel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // -- Filter Logic --
  const filteredData = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    return (data || []).filter((p) => {
      const nama = (p.mahasiswa?.nama ?? "").toLowerCase();
      const judul = (p.ranpel?.judulPenelitian ?? "").toLowerCase();
      const status = (p.status ?? "").toLowerCase();
      const tanggal = (p.tanggalPengajuan ?? "").toString().toLowerCase();
      const tanggalDiterima = (p.tanggalDiterima ?? "")
        .toString()
        .toLowerCase();
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

  // -- Handlers --
  const handleLihatClick = useCallback((pengajuan: PengajuanRanpel) => {
    setSelectedPengajuan(pengajuan);
    setIsPdfOpen(true);
  }, []);

  const handleClosePdf = () => {
    setIsPdfOpen(false);
    setSelectedPengajuan(null);
  };

  const handleOpenForm = () => setIsFormOpen(true);
  const handleCloseForm = () => setIsFormOpen(false);

  const handleDeleteClick = useCallback((pengajuan: PengajuanRanpel) => {
    setPengajuanToDelete(pengajuan);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = async () => {
    if (
      !pengajuanToDelete ||
      !pengajuanToDelete.mahasiswa?.id ||
      !pengajuanToDelete.id
    )
      return;

    try {
      setIsDeleting(true);
      await deletePengajuanRanpel(
        pengajuanToDelete.mahasiswa.id,
        pengajuanToDelete.id,
      );
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

  // -- React Table Instance --
  const table = useReactTable({
    data: filteredData,
    columns,
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

  return {
    // State
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    selectedPengajuan,
    isPdfOpen,
    isFormOpen,
    isDeleteDialogOpen,
    isDeleting,

    // Handlers
    handleLihatClick,
    handleClosePdf,
    handleOpenForm,
    handleCloseForm,
    handleDeleteClick,
    handleConfirmDelete,
    setIsDeleteDialogOpen, // Exposed for onOpenChange

    // Table
    table,
    filteredData,
  };
}
