"use client";

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

  return (
    <>
      <StatCards data={pengajuanRanpel} />

      <DataCard>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
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
