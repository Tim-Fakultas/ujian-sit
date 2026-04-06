"use client";
import { useMemo } from "react";

import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import TableGlobal from "@/components/tableGlobal";
import { DataCard } from "@/components/common/DataCard";
import StudentDetailModal from "@/components/common/StudentDetailModal";
import PDFPreviewModal from "@/app/(routes)/dosen/penilaian-ujian/PDFPreviewModal";

import { usePengajuanTable } from "./usePengajuanTable";
import { SearchInput } from "./SearchInput";
import { FilterPanel } from "./FilterPanel";
import { DatePickerModal } from "./DatePickerModal";
import { EmptyState } from "./EmptyState";
import { StatCards } from "./StatCards";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { STATUS_OPTIONS } from "./constants";

interface PengajuanTableProps {
  pengajuanRanpel: PengajuanRanpel[];
}

export default function PengajuanTable({
  pengajuanRanpel,
}: PengajuanTableProps) {
  const {
    filters,
    updateFilter,
    resetFilters,
    isDatePickerOpen,
    setIsDatePickerOpen,
    selectedPengajuan,
    isPdfModalOpen,
    handleClosePdf,
    selectedStudentId,
    isStudentModalOpen,
    setIsStudentModalOpen,
    table,
    columns,
    filteredData,
  } = usePengajuanTable(pengajuanRanpel);

  // Compute counts for each status
  const counts = useMemo(() => {
    return STATUS_OPTIONS.reduce(
      (acc, opt) => {
        acc[opt.value] = pengajuanRanpel.filter(
          (item) => (item.status ?? "").toLowerCase() === opt.value,
        ).length;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [pengajuanRanpel]);

  return (
    <>
      <StatCards data={pengajuanRanpel} />

      <DataCard>
        {/* Status Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-2 border-b">
          <Tabs
            value={filters.status}
            onValueChange={(v) => updateFilter({ status: v })}
            className="w-full sm:w-auto"
          >
            <TabsList className="bg-slate-100/80 dark:bg-neutral-800/80 p-1 h-auto min-h-[44px] flex-wrap justify-start border-none">
              {STATUS_OPTIONS.map((opt) => (
                <TabsTrigger
                  key={opt.value}
                  value={opt.value}
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900 data-[state=active]:text-primary data-[state=active]:shadow-md transition-all gap-2 min-w-[120px]"
                >
                  {opt.label}
                  <span
                    className={`ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ring-1 ring-inset transition-colors ${
                      filters.status === opt.value
                        ? "bg-primary text-white ring-primary"
                        : "bg-slate-200 dark:bg-neutral-700 text-slate-500 dark:text-neutral-400 ring-slate-300 dark:ring-neutral-600"
                    }`}
                  >
                    {counts[opt.value] ?? 0}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <SearchInput
              value={filters.search}
              onChange={(v) => updateFilter({ search: v })}
            />
            <FilterPanel
              filters={filters}
              onFilterChange={updateFilter}
              onOpenDatePicker={() => setIsDatePickerOpen(true)}
            />
          </div>
        </div>

        {/* Table / Empty State */}
        {filteredData.length === 0 ? (
          <EmptyState onReset={resetFilters} />
        ) : (
          <TableGlobal table={table} cols={columns} />
        )}
      </DataCard>

      {/* Modals */}
      {selectedPengajuan && (
        <PDFPreviewModal
          isOpen={isPdfModalOpen}
          onClose={handleClosePdf}
          pengajuan={selectedPengajuan}
        />
      )}

      <DatePickerModal
        isOpen={isDatePickerOpen}
        dateRange={filters.dateRange}
        onSelect={(range) => updateFilter({ dateRange: range })}
        onClose={() => setIsDatePickerOpen(false)}
      />

      <StudentDetailModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        mahasiswaId={selectedStudentId}
      />
    </>
  );
}
