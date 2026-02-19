import { useState, useMemo, useCallback } from "react";
import {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useUrlFilter } from "@/hooks/use-url-filter";
import { useDebounce } from "@/hooks/use-debounce";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";

export function usePengajuanRanpelTable(data: PengajuanRanpel[]) {
  // Modal State
  const [selectedPengajuan, setSelectedPengajuan] =
    useState<PengajuanRanpel | null>(null);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null,
  );

  // Search & Filter
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [filterStatus, setFilterStatus] = useUrlFilter("status", "all");
  const [openFilter, setOpenFilter] = useState(false);

  // Table State
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Filter Logic
  const filteredData = useMemo(() => {
    const q = (debouncedSearch || "").trim().toLowerCase();
    return (data || []).filter((p) => {
      const nama = (p.mahasiswa?.nama ?? "").toLowerCase();
      const judul = (p.ranpel?.judulPenelitian ?? "").toLowerCase();
      const status = (p.status ?? "").toLowerCase();
      const tanggal = (p.tanggalPengajuan ?? "").toString().toLowerCase();
      const tanggalDitolak = (p.tanggalDitolak ?? "").toString().toLowerCase();
      const statusMatch =
        filterStatus === "all" ? true : status === filterStatus;
      const nim = (p.mahasiswa?.nim ?? "").toLowerCase();
      const matchSearch =
        q === "" ||
        nama.includes(q) ||
        nim.includes(q) ||
        judul.includes(q) ||
        status.includes(q) ||
        tanggal.includes(q) ||
        tanggalDitolak.includes(q);
      return matchSearch && statusMatch;
    });
  }, [data, debouncedSearch, filterStatus]);

  // Handlers
  const handleLihatClick = useCallback((pengajuan: PengajuanRanpel) => {
    setSelectedPengajuan(pengajuan);
    setIsPdfOpen(true);
  }, []);

  const handleClosePdf = useCallback(() => {
    setIsPdfOpen(false);
    setSelectedPengajuan(null);
  }, []);

  const handleStudentClick = useCallback((mahasiswaId: number) => {
    setSelectedStudentId(mahasiswaId);
    setIsStudentModalOpen(true);
  }, []);

  const handleCloseStudentModal = useCallback(() => {
    setIsStudentModalOpen(false);
  }, []);

  return {
    // Data
    filteredData,

    // State
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    openFilter,
    setOpenFilter,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,

    // Modals
    selectedPengajuan,
    isPdfOpen,
    isStudentModalOpen,
    selectedStudentId,

    // Handlers
    handleLihatClick,
    handleClosePdf,
    handleStudentClick,
    handleCloseStudentModal,
  };
}
