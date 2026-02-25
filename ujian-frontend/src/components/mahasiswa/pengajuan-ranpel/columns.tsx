import { ColumnDef } from "@tanstack/react-table";
import { Eye, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { formatDate, getStatusBadgeClass } from "./helpers";
import CatatanViewDialog from "./CatatanViewDialog";

interface BuildColumnsOptions {
  onLihat: (item: PengajuanRanpel) => void;
  onDelete: (item: PengajuanRanpel) => void;
}

export function buildColumns({
  onLihat,
  onDelete,
}: BuildColumnsOptions): ColumnDef<PengajuanRanpel>[] {
  return [
    {
      id: "no",
      header: () => <div className="text-center font-semibold">No</div>,
      size: 50,
      cell: ({ row, table }) => {
        const index =
          (table.getState().pagination?.pageIndex ?? 0) *
            (table.getState().pagination?.pageSize ?? 10) +
          row.index +
          1;
        return <div className="text-center">{index}</div>;
      },
    },
    {
      accessorFn: (row) => row.mahasiswa?.nama ?? "-",
      id: "nama",
      header: () => (
        <div className="whitespace-nowrap font-semibold">Nama Mahasiswa</div>
      ),
      cell: ({ row }) => (
        <div
          className="max-w-[180px] truncate font-medium"
          title={row.getValue("nama")}
        >
          {row.getValue("nama")}
        </div>
      ),
    },
    {
      accessorFn: (row) =>
        row.perbaikanJudul?.judulBaru || row.ranpel?.judulPenelitian || "-",
      id: "judul",
      header: () => (
        <div className="whitespace-nowrap font-semibold">Judul Penelitian</div>
      ),
      cell: ({ row }) => {
        const judul = String(row.getValue("judul") ?? "");
        return (
          <div
            className="max-w-[280px] truncate text-muted-foreground"
            title={judul}
          >
            {judul}
          </div>
        );
      },
    },
    {
      accessorFn: (row) => row.tanggalPengajuan ?? "",
      id: "tanggal",
      header: () => (
        <div className="text-center whitespace-nowrap font-semibold">
          Tgl. Pengajuan
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center whitespace-nowrap">
          {formatDate(row.getValue("tanggal")) ?? "-"}
        </div>
      ),
    },
    {
      id: "tanggalKeputusan",
      header: () => (
        <div
          className="text-center whitespace-nowrap font-semibold"
          title="Tanggal Diterima / Ditolak"
        >
          Tgl. Keputusan
        </div>
      ),
      cell: ({ row }) => {
        const { status, tanggalDiterima, tanggalDitolak } = row.original;
        const dateVal =
          status === "diterima"
            ? tanggalDiterima
            : status === "ditolak"
              ? tanggalDitolak
              : null;
        return (
          <div className="text-center whitespace-nowrap">
            {formatDate(dateVal) ?? "—"}
          </div>
        );
      },
    },
    {
      accessorFn: (row) => row.status ?? "-",
      id: "status",
      header: () => <div className="text-center font-semibold">Status</div>,
      cell: ({ row }) => {
        const s = String(row.getValue("status"));
        return (
          <div className="flex justify-center">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusBadgeClass(s)}`}
            >
              {s}
            </span>
          </div>
        );
      },
    },
    {
      id: "catatan",
      header: () => <div className="text-center font-semibold">Catatan</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <CatatanViewDialog
            keterangan={row.original.keterangan}
            catatanKaprodi={row.original.catatanKaprodi}
          />
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;
        const canDelete = item.status === "menunggu";
        return (
          <div className="flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Buka menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onLihat(item)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Lihat Detail
                </DropdownMenuItem>
                {canDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(item)}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus Pengajuan
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
