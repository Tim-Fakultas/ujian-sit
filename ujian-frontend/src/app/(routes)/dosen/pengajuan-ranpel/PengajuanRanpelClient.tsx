/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import TableGlobal from "@/components/tableGlobal";
import SearchInput from "@/components/common/Search";
import { useUrlFilter } from "@/hooks/use-url-filter";
import { useDebounce } from "@/hooks/use-debounce";

import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import PDFPreviewModal from "../penilaian-ujian/PDFPreviewModal";
import { Button } from "@/components/ui/button";
import {
  Eye,
  MoreHorizontal,

  Check,
  Settings2,
  Calendar,
  MessageSquareText,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DataCard } from "@/components/common/DataCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { truncateTitle } from "@/lib/utils";
import StudentDetailModal from "@/components/common/StudentDetailModal";

export default function PengajuanRanpelClient({
  pengajuanRanpel,
}: {
  pengajuanRanpel: PengajuanRanpel[];
}) {
  // modal state for PDF preview
  const [selectedPengajuan, setSelectedPengajuan] =
    useState<PengajuanRanpel | null>(null);
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  // modal state for student detail
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  const handleStudentClick = (mahasiswaId: number) => {
    setSelectedStudentId(mahasiswaId);
    setIsStudentModalOpen(true);
  };

  // Controls
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [filterStatus, setFilterStatus] = useUrlFilter("status", "all");
  const [openFilter, setOpenFilter] = useState(false);


  const statusOptions = [
    { value: "all", label: "Semua" },
    { value: "menunggu", label: "Menunggu" },
    { value: "diterima", label: "Diterima" },
    { value: "ditolak", label: "Ditolak" },
    { value: "diverifikasi", label: "Diverifikasi" },
  ];

  // filtered data (global search across nama, judul, status, tanggal)
  const filteredData = useMemo(() => {
    const q = (debouncedSearch || "").trim().toLowerCase();
    return (pengajuanRanpel || []).filter((p) => {
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
  }, [pengajuanRanpel, debouncedSearch, filterStatus]);

  // table state
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // handlers
  const handleLihatClick = React.useCallback((pengajuan: PengajuanRanpel) => {
    setSelectedPengajuan(pengajuan);
    setIsPdfOpen(true);
  }, []);
  const handleClosePdf = () => {
    setIsPdfOpen(false);
    setSelectedPengajuan(null);
  };

  // columns (mirip mahasiswa)
  const cols: ColumnDef<PengajuanRanpel>[] = React.useMemo(
    () => [
      {
        id: "no",
        header: () => <div className="text-center font-semibold">No</div>,
        cell: ({ row, table }) => {
          const index =
            (table.getState().pagination?.pageIndex ?? 0) *
            (table.getState().pagination?.pageSize ?? 10) +
            row.index +
            1;
          return <div className="text-center">{index}</div>;
        },
        size: 50,
      },
      {
        accessorFn: (row) => row.mahasiswa?.nama ?? "-",
        id: "nama",
        header: "Nama",
        cell: ({ row }) => (
          <div
            className="flex flex-col cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors group"
            onClick={() => {
              if (row.original.mahasiswa?.id) {
                handleStudentClick(row.original.mahasiswa.id);
              }
            }}
          >
            <span className="font-medium text-primary group-hover:text-primary/80 transition-colors" title={row.getValue("nama")}>
              {row.getValue("nama")}
            </span>
            <span className="text-xs text-muted-foreground group-hover:text-gray-600">
              {row.original.mahasiswa?.nim ?? "-"}
            </span>
          </div>
        ),
        size: 200,
      },
      {
        accessorFn: (row) => row.ranpel?.judulPenelitian ?? "-",
        id: "judul",
        header: "Judul",
        cell: ({ row }) => {
          const judul = String(row.getValue("judul") ?? "");
          return (
            <div className="line-clamp-1" title={judul}>
              {judul}
            </div>
          );
        },
        size: 300,
      },
      {
        accessorFn: (row) => row.tanggalPengajuan ?? "",
        id: "tanggal",
        header: () => <div className="text-center">Tgl Pengajuan</div>,
        cell: ({ row }) => {
          const val = row.getValue("tanggal") as string;
          try {
            return (
              <div className="text-center">
                {new Date(val).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            );
          } catch {
            return <div className="text-center">{val}</div>;
          }
        },
        size: 150,
      },
      {
        id: "tanggalKeputusan",
        header: () => <div className="text-center">Tgl Keputusan</div>,
        cell: ({ row }) => {
          const status = row.original.status;
          let dateVal = null;

          if (status === "diterima") dateVal = row.original.tanggalDiterima;
          else if (status === "ditolak") dateVal = row.original.tanggalDitolak;

          if (!dateVal) return <div className="text-center">-</div>;

          try {
            return <div className="text-center">{new Date(dateVal).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}</div>;
          } catch {
            return <div className="text-center">-</div>;
          }
        },
        size: 150,
      },
      {
        accessorFn: (row) => row.status ?? "-",
        id: "status",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
          const s = String(row.getValue("status"));
          const cls =
            s === "menunggu"
              ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
              : s === "diterima"
                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                : s === "ditolak"
                  ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                  : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
          return (
            <div className="text-center">
              <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${cls}`}>{s}</span>
            </div>
          );
        },
        size: 120,
      },
      {
        id: "catatan",
        header: () => <div className="text-center">Catatan</div>,
        cell: ({ row }) => {
          const catDosen = row.original.keterangan;
          const catKaprodi = row.original.catatanKaprodi;

          const hasDosen = catDosen && catDosen !== "-" && catDosen.trim() !== "";
          const hasKaprodi = catKaprodi && catKaprodi !== "-" && catKaprodi.trim() !== "";

          if (!hasDosen && !hasKaprodi) return <div className="text-center"><span className="text-muted-foreground">-</span></div>;

          return (
            <div className="flex justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-primary bg-primary/5 hover:bg-primary/10 hover:text-primary rounded-full">
                    <MessageSquareText size={15} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Catatan</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 pt-2">
                    {hasDosen && (
                      <div>
                        <h4 className="font-semibold mb-1.5 text-xs uppercase tracking-wider text-primary flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          Dosen PA
                        </h4>
                        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                          {catDosen}
                        </div>
                      </div>
                    )}
                    {hasKaprodi && (
                      <div>
                        <h4 className="font-semibold mb-1.5 text-xs uppercase tracking-wider text-indigo-600 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                          Kaprodi
                        </h4>
                        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                          {catKaprodi}
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div >
          );
        },
        size: 80,
      },
      {
        id: "actions",
        header: () => <div className="text-center">Aksi</div>,
        enableHiding: false,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="text-center">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 border-primary/20 text-primary hover:bg-primary/5 hover:text-primary dark:border-primary/30"
                onClick={() => handleLihatClick(item)}
                title="Lihat Detail"
              >
                <Eye size={16} />
              </Button>
            </div>
          );
        },
        size: 80,
      },
    ],
    [handleLihatClick]
  );

  const table = useReactTable({
    data: filteredData,
    columns: cols,
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

  // reset page when filters change
  useEffect(() => {
    try {
      table.setPageIndex?.(0);
    } catch { }
  }, [debouncedSearch, filterStatus, table]);

  return (
    <>
      <DataCard className="w-full max-w-full">
        {/* Header controls: search/filter/tabs */}
        <div className="flex items-center gap-2 mb-4 w-full md:justify-end">
          {/* Search input */}
          <SearchInput
            placeholder="Cari Nama, NIM, atau Judul..."
            className="flex-1 w-full md:flex-none md:w-[300px]"
            value={search}
            onChange={setSearch}
            disableUrlParams={true}
          />

          <div className="flex items-center gap-2 shrink-0">
            {/* Filter popover */}
            <Popover open={openFilter} onOpenChange={setOpenFilter}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 flex items-center justify-center rounded-md"
                >
                  <Settings2 size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[200px] p-0">
                <ScrollArea className="max-h-[300px] p-1">
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    Status
                  </div>
                  {statusOptions.map((opt) => (
                    <Button
                      key={opt.value}
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-between h-8 px-2 font-normal ${filterStatus === opt.value
                        ? "bg-accent text-accent-foreground font-medium"
                        : ""
                        }`}
                      onClick={() => setFilterStatus(opt.value)}
                    >
                      <span className="text-sm">{opt.label}</span>
                      {filterStatus === opt.value && (
                        <Check size={14} className="ml-auto" />
                      )}
                    </Button>
                  ))}
                </ScrollArea>
              </PopoverContent>
            </Popover>

          </div>
        </div>

        {/* Table / Card */}
        <div className="w-full">
          <TableGlobal table={table} cols={cols} />
        </div>
      </DataCard>


      {/* PDF Preview Modal */}
      {
        selectedPengajuan && (
          <PDFPreviewModal
            isOpen={isPdfOpen}
            onClose={handleClosePdf}
            pengajuan={selectedPengajuan}
          />
        )
      }

      {/* Student Detail Modal */}
      <StudentDetailModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        mahasiswaId={selectedStudentId}
      />
    </>
  );
}
