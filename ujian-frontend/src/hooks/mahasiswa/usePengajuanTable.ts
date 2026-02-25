import { useState, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  type ColumnDef,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";

import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { deletePengajuanRanpel } from "@/actions/pengajuanRanpel";
import { showToast } from "@/components/ui/custom-toast";

interface UsePengajuanTableProps {
  data: PengajuanRanpel[];
  /**
   * Column definitions are passed in from the component so the hook
   * remains decoupled from rendering concerns.
   */
  columns?: ColumnDef<PengajuanRanpel>[];
}

/** Checks if a field value matches the search query. */
function matchesQuery(
  value: string | null | undefined,
  query: string,
): boolean {
  return (value ?? "").toLowerCase().includes(query);
}

export function usePengajuanTable({
  data,
  columns = [],
}: UsePengajuanTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") ?? "all";

  // ── Search & filter state ──────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState(initialStatus);

  // ── Modal state ────────────────────────────────────────────────────────────
  const [selectedPengajuan, setSelectedPengajuan] =
    useState<PengajuanRanpel | null>(null);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // ── Delete state ───────────────────────────────────────────────────────────
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pengajuanToDelete, setPengajuanToDelete] =
    useState<PengajuanRanpel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Table sorting / visibility state ──────────────────────────────────────
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // ── Derived / filtered data ────────────────────────────────────────────────
  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();

    return (data ?? []).filter((p) => {
      const statusMatch =
        filterStatus === "all" ||
        (p.status ?? "").toLowerCase() === filterStatus;

      if (!statusMatch) return false;
      if (!q) return true;

      return (
        matchesQuery(p.mahasiswa?.nama, q) ||
        matchesQuery(p.ranpel?.judulPenelitian, q) ||
        matchesQuery(p.status, q) ||
        matchesQuery(p.tanggalPengajuan, q) ||
        matchesQuery(p.tanggalDiterima, q) ||
        matchesQuery(p.tanggalDitolak, q)
      );
    });
  }, [data, search, filterStatus]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleLihatClick = useCallback((pengajuan: PengajuanRanpel) => {
    setSelectedPengajuan(pengajuan);
    setIsPdfOpen(true);
  }, []);

  const handleClosePdf = useCallback(() => {
    setIsPdfOpen(false);
    setSelectedPengajuan(null);
  }, []);

  const handleOpenForm = useCallback(() => setIsFormOpen(true), []);
  const handleCloseForm = useCallback(() => setIsFormOpen(false), []);

  const handleDeleteClick = useCallback((pengajuan: PengajuanRanpel) => {
    setPengajuanToDelete(pengajuan);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    const target = pengajuanToDelete;
    if (!target?.mahasiswa?.id || !target?.id) return;

    setIsDeleting(true);
    try {
      await deletePengajuanRanpel(target.mahasiswa.id, target.id);
      showToast.success("Pengajuan berhasil dihapus");
      router.refresh();
      setIsDeleteDialogOpen(false);
      setPengajuanToDelete(null);
    } catch (error) {
      console.error("[usePengajuanTable] Delete error:", error);
      showToast.error("Gagal menghapus pengajuan");
    } finally {
      setIsDeleting(false);
    }
  }, [pengajuanToDelete, router]);

  // ── Table instance ─────────────────────────────────────────────────────────
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
    // Filter state
    search,
    setSearch,
    filterStatus,
    setFilterStatus,

    // Modal state
    selectedPengajuan,
    isPdfOpen,
    isFormOpen,

    // Delete state
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isDeleting,

    // Handlers
    handleLihatClick,
    handleClosePdf,
    handleOpenForm,
    handleCloseForm,
    handleDeleteClick,
    handleConfirmDelete,

    // Table
    table,
    filteredData,
  };
}
