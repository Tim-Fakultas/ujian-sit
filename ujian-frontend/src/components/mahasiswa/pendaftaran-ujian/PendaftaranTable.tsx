"use client";
import React, { useMemo } from "react";
import { DataTableFilter } from "@/components/data-table/DataTableFilter";
import { Button } from "@/components/ui/button";
import TableGlobal from "@/components/tableGlobal";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, MoreHorizontal, Eye, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { getJenisUjianColor, getStatusColor, truncateTitle } from "@/lib/utils";
import { PendaftaranUjian } from "@/types/PendaftaranUjian";
import { User } from "@/types/Auth";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";

import { Ujian } from "@/types/Ujian";
import PengajuanUjianForm from "./PendaftaranUjianForm";
import { JenisUjian } from "@/types/JenisUjian";
import InlineBerkasModal from "./InlineBerkasModal";

import { DataCard } from "@/components/common/DataCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePendaftaranTable } from "@/hooks/mahasiswa/usePendaftaranTable";

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
  const statusOptions = [
    { value: "all", label: "Semua" },
    { value: "menunggu", label: "Menunggu" },
    { value: "diterima", label: "Diterima" },
    { value: "ditolak", label: "Ditolak" },
    { value: "dijadwalkan", label: "Dijadwalkan" },
    { value: "selesai", label: "Selesai" },
  ];

  // Columns definition
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
          <div className="text-center select-none">Tanggal Pengajuan</div>
        ),
        cell: ({ row }) => {
          const v = String(row.getValue("tanggal") ?? "");
          try {
            return (
              <div className="text-center">
                {new Date(v).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
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
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(
                  s,
                )} ${
                  s === "menunggu"
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
        header: () => <div className="text-center select-none">Keterangan</div>,
        cell: ({ row }) => {
          const keterangan = String(row.getValue("keterangan") ?? "");
          if (!keterangan || keterangan === "-")
            return (
              <div className="text-center text-muted-foreground text-xs">-</div>
            );
          return (
            <div className="text-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => hook.handleOpenKeterangan(keterangan)}
              >
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
                    onClick={() => hook.handleOpenBerkas(pendaftaran)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Lihat Berkas
                  </DropdownMenuItem>
                  {status === "menunggu" && (
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                      onClick={() => hook.handleDeleteClick(pendaftaran)}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const hook = usePendaftaranTable({
    data: pendaftaranUjian,
    user,
    columns: cols,
  });

  return (
    <DataCard className="w-full max-w-full">
      <DataTableFilter
        searchValue={hook.searchTerm}
        onSearchChange={hook.setSearchTerm}
        searchPlaceholder="Cari judul..."
        filters={[
          {
            key: "jenis",
            title: "Jenis Ujian",
            value: hook.filterJenisUjian,
            onChange: hook.setFilterJenisUjian,
            options: [
              { value: "all", label: "Semua" },
              ...jenisUjianList.map((jenis) => ({
                value: String(jenis.id),
                label: jenis.namaJenis,
              })),
            ],
          },
          {
            key: "status",
            title: "Status",
            value: hook.filterStatus,
            onChange: hook.setFilterStatus,
            options: statusOptions,
          },
        ]}
        actions={
          <Button
            className="bg-primary hover:bg-primary/80 text-white text-sm px-4 flex items-center gap-2 rounded-lg h-9"
            onClick={() => hook.setShowForm(true)}
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Ajukan Ujian</span>
            <span className="sm:hidden">Ajukan</span>
          </Button>
        }
      />

      {/* Popup Modal Form Pengajuan Ujian */}
      {hook.showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => hook.setShowForm(false)}
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
                  onCloseModal={() => hook.setShowForm(false)}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table / Card view */}
      {hook.filteredData.length === 0 ? (
        <div className="p-6 flex flex-col items-center justify-center gap-3">
          <div className="text-sm text-muted-foreground text-center">
            Belum ada pendaftaran ujian
          </div>
          <div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                hook.setFilterStatus("all");
                hook.setSearchTerm("");
                hook.setFilterJenisUjian("all");
              }}
            >
              Reset filter
            </Button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <TableGlobal
            table={hook.table}
            cols={cols}
            emptyMessage="Belum ada pendaftaran ujian."
          />
        </div>
      )}

      {/* Modal Keterangan */}
      <Dialog
        open={hook.keteranganModal}
        onOpenChange={hook.setKeteranganModal}
      >
        <DialogContent className="max-w-[90%] sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              Keterangan
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <div className="bg-slate-50 dark:bg-slate-900 p-3 sm:p-4 rounded-lg border text-xs sm:text-sm leading-relaxed text-gray-700 dark:text-gray-300 break-words">
              {hook.keteranganContent || "-"}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Konfirmasi Hapus */}
      <Dialog
        open={hook.deleteConfirmOpen}
        onOpenChange={hook.setDeleteConfirmOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pendaftaran ujian untuk{" "}
              <strong>{hook.pendaftaranToDelete?.judulPenelitian}</strong>?
              <br />
              <br />
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                hook.setDeleteConfirmOpen(false);
                hook.setPendaftaranToDelete(null);
              }}
              disabled={hook.isDeleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={hook.handleDelete}
              disabled={hook.isDeleting}
            >
              {hook.isDeleting ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <InlineBerkasModal
        open={hook.berkasModalOpen}
        onOpenChange={hook.setBerkasModalOpen}
        pendaftaran={hook.selectedPendaftaran}
        mahasiswaId={user?.id || 0}
      />
    </DataCard>
  );
}
