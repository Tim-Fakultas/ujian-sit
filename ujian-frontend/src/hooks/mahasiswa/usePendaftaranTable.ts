import { useState, useMemo, useEffect } from "react";
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
import { useRouter } from "next/navigation";
import { PendaftaranUjian } from "@/types/PendaftaranUjian";
import { User } from "@/types/Auth";
import { deletePendaftaranUjian } from "@/actions/pendaftaranUjian";
import { showToast } from "@/components/ui/custom-toast";
import { useDebounce } from "@/hooks/use-debounce";

interface UsePendaftaranTableProps {
  data: PendaftaranUjian[];
  user: User | null;
  columns: any[];
}

export function usePendaftaranTable({
  data,
  user,
  columns,
}: UsePendaftaranTableProps) {
  const router = useRouter();

  // -- State --
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [filterJenisUjian, setFilterJenisUjian] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modals
  const [keteranganModal, setKeteranganModal] = useState(false);
  const [keteranganContent, setKeteranganContent] = useState("");
  const [berkasModalOpen, setBerkasModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Selection
  const [selectedPendaftaran, setSelectedPendaftaran] =
    useState<PendaftaranUjian | null>(null);
  const [pendaftaranToDelete, setPendaftaranToDelete] =
    useState<PendaftaranUjian | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Table State
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // -- Filter Logic --
  const filteredData = useMemo(() => {
    return (data || []).filter((pendaftaran) => {
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
  }, [data, debouncedSearchTerm, filterJenisUjian, filterStatus]);

  // -- Handlers --
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

  const handleOpenKeterangan = (content: string) => {
    setKeteranganContent(content);
    setKeteranganModal(true);
  };

  const handleOpenBerkas = (pendaftaran: PendaftaranUjian) => {
    setSelectedPendaftaran(pendaftaran);
    setBerkasModalOpen(true);
  };

  const handleDeleteClick = (pendaftaran: PendaftaranUjian) => {
    setPendaftaranToDelete(pendaftaran);
    setDeleteConfirmOpen(true);
  };

  // -- React Table Instance --
  const table = useReactTable({
    data: filteredData,
    columns,
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

  // Reset page logic
  useEffect(() => {
    try {
      table.setPageIndex?.(0);
    } catch {}
  }, [debouncedSearchTerm, filterStatus, filterJenisUjian, table]);

  return {
    // State
    searchTerm,
    setSearchTerm,
    filterJenisUjian,
    setFilterJenisUjian,
    filterStatus,
    setFilterStatus,
    keteranganModal,
    setKeteranganModal,
    keteranganContent,
    berkasModalOpen,
    setBerkasModalOpen,
    showForm,
    setShowForm,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    selectedPendaftaran,
    pendaftaranToDelete,
    isDeleting,

    // Handlers
    handleDelete,
    handleOpenKeterangan,
    handleOpenBerkas,
    handleDeleteClick,
    setPendaftaranToDelete, // Exposed for dialog cancel

    // Table
    table,
    filteredData,
  };
}
