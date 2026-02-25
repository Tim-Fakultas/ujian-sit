"use client";

import { useMemo, useRef } from "react";
import { Plus } from "lucide-react";
import TableGlobal from "@/components/tableGlobal";
import { DataTableFilter } from "@/components/data-table/DataTableFilter";
import { DataCard } from "@/components/common/DataCard";
import { Button } from "@/components/ui/button";
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

import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePengajuanTable } from "@/hooks/mahasiswa/usePengajuanTable";
import { buildColumns } from "./columns";
import { STATUS_OPTIONS } from "./helpers";
import PDFPreviewModal from "./PDFPreviewModal";
import Form from "./Form";

interface PengajuanTableProps {
  data: PengajuanRanpel[];
  dosenList?: unknown[];
  kaprodi?: { nama: string; nip: string };
}

export default function PengajuanTable({
  data,
  dosenList,
  kaprodi,
}: PengajuanTableProps) {
  const { user } = useAuthStore();

  // We use stable refs for the action handlers so the columns memo
  // can be built once without creating a circular dependency with the hook.
  const onLihatRef = useRef<(item: PengajuanRanpel) => void>(() => {});
  const onDeleteRef = useRef<(item: PengajuanRanpel) => void>(() => {});

  const columns = useMemo(
    () =>
      buildColumns({
        onLihat: (item) => onLihatRef.current(item),
        onDelete: (item) => onDeleteRef.current(item),
      }),
    [],
  );

  const hook = usePengajuanTable({ data, columns });

  // Update refs after hook is initialized so handlers point to the latest version.
  onLihatRef.current = hook.handleLihatClick;
  onDeleteRef.current = hook.handleDeleteClick;

  return (
    <>
      <DataCard className="w-full max-w-full">
        <DataTableFilter
          searchValue={hook.search}
          onSearchChange={hook.setSearch}
          searchPlaceholder="Cari pengajuan..."
          filters={[
            {
              key: "status",
              title: "Status",
              value: hook.filterStatus,
              onChange: hook.setFilterStatus,
              options: STATUS_OPTIONS as unknown as {
                value: string;
                label: string;
              }[],
            },
          ]}
          actions={
            <Button
              className="bg-primary hover:bg-primary/80 text-white text-sm px-4 flex items-center justify-center rounded-lg h-9"
              onClick={hook.handleOpenForm}
              title="Tambah pengajuan"
              aria-label="Tambah pengajuan"
            >
              <Plus size={16} />
              <span className="hidden sm:inline ml-2">Tambah Pengajuan</span>
            </Button>
          }
        />

        <TableGlobal
          table={hook.table}
          cols={columns}
          emptyMessage="Tidak ada data pengajuan rancangan penelitian."
        />
      </DataCard>

      {/* PDF Preview Modal */}
      {hook.selectedPengajuan && (
        <PDFPreviewModal
          isOpen={hook.isPdfOpen}
          onClose={hook.handleClosePdf}
          pengajuan={hook.selectedPengajuan}
          dosenList={dosenList}
          kaprodi={kaprodi}
        />
      )}

      {/* Form Modal (Tambah Pengajuan) */}
      {hook.isFormOpen && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="max-w-4xl w-full bg-white dark:bg-neutral-800 rounded-xl shadow-2xl relative">
            <div className="h-[90vh] w-full rounded-xl overflow-hidden">
              <Form
                mahasiswaId={user.id}
                onSuccess={hook.handleCloseForm}
                onClose={hook.handleCloseForm}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={hook.isDeleteDialogOpen}
        onOpenChange={hook.setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengajuan?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data pengajuan ini akan
              dihapus secara permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={hook.isDeleting}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                hook.handleConfirmDelete();
              }}
              disabled={hook.isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {hook.isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
