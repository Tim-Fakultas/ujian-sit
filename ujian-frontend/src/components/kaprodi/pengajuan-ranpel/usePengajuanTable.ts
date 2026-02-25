"use client";

import * as React from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { FilterState } from "./types";
import { DEFAULT_FILTERS } from "./constants";
import { applyFilters } from "./helpers";
import { buildColumns } from "./columns";


export function usePengajuanTable(pengajuanRanpel: PengajuanRanpel[]) {
  // ── Filter State ──
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const updateFilter = useCallback((partial: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  // ── PDF Preview State ──
  const [selectedPengajuan, setSelectedPengajuan] =
    useState<PengajuanRanpel | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const handleLihat = useCallback((item: PengajuanRanpel) => {
    setSelectedPengajuan(item);
    setIsPdfModalOpen(true);
  }, []);

  const handleClosePdf = useCallback(() => {
    setIsPdfModalOpen(false);
    setSelectedPengajuan(null);
  }, []);

  // ── Student Detail State ──
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null,
  );
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  const handleStudentClick = useCallback((id: number) => {
    setSelectedStudentId(id);
    setIsStudentModalOpen(true);
  }, []);

  // ── Table State ──
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // ── Derived Data ──
  const filteredData = useMemo(
    () => applyFilters(pengajuanRanpel, filters),
    [pengajuanRanpel, filters],
  );

  const columns = useMemo(
    () => buildColumns(handleLihat, handleStudentClick),
    [handleLihat, handleStudentClick],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Reset ke halaman pertama setiap kali filter berubah
  useEffect(() => {
    table.setPageIndex(0);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // filter
    filters,
    updateFilter,
    resetFilters,
    isDatePickerOpen,
    setIsDatePickerOpen,

    // pdf preview
    selectedPengajuan,
    isPdfModalOpen,
    handleClosePdf,

    // student modal
    selectedStudentId,
    isStudentModalOpen,
    setIsStudentModalOpen,

    // table
    table,
    columns,
    filteredData,
  };
}
