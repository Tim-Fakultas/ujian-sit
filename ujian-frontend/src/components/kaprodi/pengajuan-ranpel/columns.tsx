import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { truncateTitle } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CatatanDialog from "@/components/kaprodi/CatatanDialog";
import { formatDate } from "./helpers";
import { STATUS_BADGE_CLASS } from "./constants";

/**
 * Factory function that builds the column definitions for the pengajuan ranpel table.
 * Accepts callbacks for actions so columns stay decoupled from state.
 */
export function buildColumns(
  onLihat: (item: PengajuanRanpel) => void,
  onStudentClick: (id: number) => void,
): ColumnDef<PengajuanRanpel>[] {
  return [
    {
      id: "no",
      header: () => <div className="text-center">No</div>,
      size: 50,
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination?.pageIndex ?? 0;
        const pageSize = table.getState().pagination?.pageSize ?? 10;
        const index = pageIndex * pageSize + row.index + 1;
        return <div className="text-center">{index}</div>;
      },
    },
    {
      id: "nama",
      accessorFn: (row) => row.mahasiswa?.nama ?? "-",
      header: "Mahasiswa",
      size: 180,
      cell: ({ row }) => {
        const mahasiswa = row.original.mahasiswa;
        return (
          <div
            className="flex flex-col cursor-pointer hover:bg-primary/5 p-1.5 rounded-lg transition-all group border border-transparent hover:border-primary/10"
            onClick={() => mahasiswa?.id && onStudentClick(mahasiswa.id)}
          >
            <span
              className="font-semibold text-sm max-w-[160px] truncate text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors"
              title={mahasiswa?.nama ?? "-"}
            >
              {mahasiswa?.nama ?? "-"}
            </span>
            <span className="text-[11px] font-mono text-muted-foreground group-hover:text-slate-600 dark:group-hover:text-slate-400">
              {mahasiswa?.nim ?? "-"}
            </span>
          </div>
        );
      },
    },
    {
      id: "judul",
      accessorFn: (row) => row.ranpel?.judulPenelitian ?? "-",
      header: "Judul Penelitian",
      size: 250,
      cell: ({ row }) => {
        const judul = row.original.ranpel?.judulPenelitian ?? "-";
        return (
          <div className="max-w-[220px] leading-snug" title={judul}>
            <p className="text-sm font-medium line-clamp-2 text-slate-700 dark:text-slate-300">
              {judul}
            </p>
          </div>
        );
      },
    },
    {
      id: "tanggal",
      accessorFn: (row) => row.tanggalPengajuan ?? "",
      header: () => (
        <div className="text-center font-semibold text-xs uppercase tracking-wider text-slate-500">
          Tgl Pengajuan
        </div>
      ),
      size: 120,
      cell: ({ row }) => (
        <div className="text-center tabular-nums text-sm text-slate-600 dark:text-slate-400">
          {formatDate(row.original.tanggalPengajuan) ?? "-"}
        </div>
      ),
    },
    {
      id: "tanggalKeputusan",
      header: () => (
        <div className="text-center font-semibold text-xs uppercase tracking-wider text-slate-500">
          Tgl Keputusan
        </div>
      ),
      size: 120,
      cell: ({ row }) => {
        const { status, tanggalDiterima, tanggalDitolak } = row.original;
        const dateVal =
          status === "diterima"
            ? tanggalDiterima
            : status === "ditolak"
              ? tanggalDitolak
              : null;
        return (
          <div className="text-center tabular-nums text-sm font-medium text-slate-600 dark:text-slate-400">
            {formatDate(dateVal) ?? "—"}
          </div>
        );
      },
    },
    {
      id: "status",
      accessorFn: (row) => row.status ?? "-",
      header: () => (
        <div className="text-center font-semibold text-xs uppercase tracking-wider text-slate-500">
          Status
        </div>
      ),
      size: 120,
      cell: ({ row }) => {
        const status = (row.original.status || "menunggu").toLowerCase();

        const variants: Record<string, string> = {
          menunggu:
            "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
          diterima:
            "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
          ditolak:
            "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800",
          diverifikasi:
            "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800",
        };

        const cls =
          variants[status] || "bg-slate-50 text-slate-700 border-slate-200";

        return (
          <div className="flex justify-center">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${cls}`}
            >
              {status}
            </span>
          </div>
        );
      },
    },
    {
      id: "catatan",
      header: () => <div className="text-center">Catatan</div>,
      size: 80,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <CatatanDialog pengajuan={row.original} />
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">Aksi</div>,
      size: 70,
      cell: ({ row }) => (
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-500 hover:text-primary"
            onClick={() => onLihat(row.original)}
          >
            <Eye size={18} />
          </Button>
        </div>
      ),
    },
  ];
}
