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

import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Eye,
  Search,
  ListFilter,
  ArrowUpDown,
  MoreHorizontal,
  LayoutGrid,
  List,
  Check,
} from "lucide-react";
import { truncateTitle } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PDFPreviewModal from "../../dosen/jadwal-ujian/PDFPreviewModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function PerbaikanJudulTableClient({
  pengajuanRanpel,
}: {
  pengajuanRanpel: PengajuanRanpel[];
}) {
  // preview modal
  const [selectedPengajuan, setSelectedPengajuan] =
    useState<PengajuanRanpel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // view mode + sorting state for react-table
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // controls
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const statusOptions = [
    { value: "all", label: "Semua" },
    { value: "menunggu", label: "Menunggu" },
    { value: "diterima", label: "Diterima" },
    { value: "diverifikasi", label: "Diverifikasi" },
    { value: "ditolak", label: "Ditolak" },
  ];

  const sortOptions = [
    { value: "tanggal:desc", label: "Tanggal terbaru" },
    { value: "tanggal:asc", label: "Tanggal terlama" },
    { value: "nama:asc", label: "Nama A–Z" },
    { value: "nama:desc", label: "Nama Z–A" },
  ];
  const isSortActive = (val: string) => {
    if (!sorting?.length) return false;
    const s = sorting[0] as any;
    return `${s.id}:${s.desc ? "desc" : "asc"}` === val;
  };
  const handleSortSelect = (val: string) => {
    if (val === "none") {
      setSorting([]);
      return;
    }
    const [id, order] = val.split(":");
    setSorting([{ id, desc: order === "desc" }]);
  };

  //* filtered data (global search across nama, judul, status, tanggal)
  const filteredData = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    return (pengajuanRanpel || []).filter((p) => {
      const nama = (p.mahasiswa?.nama ?? "").toLowerCase();
      const judul = (p.ranpel?.judulPenelitian ?? "").toLowerCase();
      const status = (p.status ?? "").toLowerCase();
      const tanggal = (p.tanggalPengajuan ?? "").toString().toLowerCase();
      const statusMatch =
        filterStatus === "all" ? true : status === filterStatus;
      const qEmpty = q === "";
      const matchesQ =
        qEmpty ||
        nama.includes(q) ||
        judul.includes(q) ||
        status.includes(q) ||
        tanggal.includes(q);
      return matchesQ && statusMatch;
    });
  }, [pengajuanRanpel, search, filterStatus]);

  // table state (sorting state already declared above)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // handlers
  const handleLihatClick = React.useCallback((p: PengajuanRanpel) => {
    setSelectedPengajuan(p);
    setIsModalOpen(true);
  }, []);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPengajuan(null);
  };

  // State for detail modal
  const [detailPengajuan, setDetailPengajuan] =
    useState<PengajuanRanpel | null>(null);

  // columns
  const cols: ColumnDef<PengajuanRanpel>[] = useMemo(
    () => [
      {
        id: "no",
        header: "No",
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
          <div className="flex items-center gap-1">
            <span>Nama Mahasiswa</span>
          </div>
        ),
        cell: ({ row }) => {
          const mhs = row.original.mahasiswa;
          return (
            <div>
              <div className="font-medium">{mhs?.nama ?? "-"}</div>
              <div className="text-xs text-muted-foreground">
                {mhs?.nim ?? ""}
              </div>
            </div>
          );
        },
      },
      {
        accessorFn: (row) => row.ranpel?.judulPenelitian ?? "-",
        id: "judul",
        header: "Judul Skripsi",
        cell: ({ row }) => (
          <div className="max-w-[48ch] ">
            {truncateTitle(String(row.getValue("judul")), 40)}
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex justify-center items-center h-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleLihatClick(item)}>
                    <Eye size={14} /> Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDetailPengajuan(item)}>
                    <List size={14} className="mr-2" /> Lihat Detail
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
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

  // reset page when search/filter change
  useEffect(() => {
    try {
      table.setPageIndex?.(0);
    } catch {}
  }, [search, filterStatus]); // eslint-disable-line

  return (
    <>
      <div className="bg-white dark:bg-neutral-900 p-4 md:p-6 rounded-md shadow-sm">
        {/* Header */}

        {/* Controls: search, status filter (with colored dots), sort dropdown, view tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-muted-foreground" />
              </div>
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 bg-white dark:bg-neutral-800"
              />
            </div>
          </div>

          {/* status filter as DropdownMenu with colored dots */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 flex items-center gap-2"
              >
                <ListFilter size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {statusOptions.map((opt) => {
                const color =
                  opt.value === "menunggu"
                    ? "bg-yellow-500"
                    : opt.value === "diterima"
                    ? "bg-green-500"
                    : opt.value === "ditolak"
                    ? "bg-red-500"
                    : opt.value === "diverifikasi"
                    ? "bg-blue-500"
                    : "bg-gray-500";
                const active = filterStatus === opt.value;
                return (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => setFilterStatus(opt.value)}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2 h-2 rounded-full ${color} inline-block`}
                        aria-hidden
                      />
                      <span className="text-sm">{opt.label}</span>
                    </div>
                    {active && <Check size={14} />}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* sort dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 flex items-center gap-2"
              >
                <ArrowUpDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {sortOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => handleSortSelect(opt.value)}
                  className={`flex items-center justify-between gap-2 ${
                    isSortActive(opt.value) ? "bg-muted/30" : ""
                  }`}
                >
                  <span className="text-sm">{opt.label}</span>
                  {isSortActive(opt.value) && <Check size={14} />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={() => handleSortSelect("none")}>
                Reset sorting
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* view tabs */}
          <div>
            <Tabs
              value={viewMode}
              onValueChange={(v) => setViewMode(v as "table" | "card")}
              className="h-8"
            >
              <TabsList className="rounded-md bg-muted p-1 gap-1">
                <TabsTrigger value="table" className="h-7 px-2 rounded-md">
                  <LayoutGrid size={14} />
                </TabsTrigger>
                <TabsTrigger value="card" className="h-7 px-2 rounded-md">
                  <List size={14} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Table or Card view */}
        {filteredData.length === 0 ? (
          <div className="p-6 flex flex-col items-center justify-center gap-3">
            <div className="text-sm text-muted-foreground text-center">
              Tidak ada data pengajuan rancangan penelitian
            </div>
            <div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setFilterStatus("all");
                  setSearch("");
                }}
              >
                Reset filter
              </Button>
            </div>
          </div>
        ) : viewMode === "table" ? (
          <TableGlobal table={table} cols={cols} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredData.map((item, idx) => {
              const key = (item as any).id ?? idx;
              const nama = item.mahasiswa?.nama ?? "-";
              const judul = item.ranpel?.judulPenelitian ?? "-";
              const tanggal = item.tanggalPengajuan ?? "";
              const status = item.status ?? "-";
              const colorClass =
                status === "menunggu"
                  ? "bg-yellow-100 text-yellow-800"
                  : status === "diterima"
                  ? "bg-green-100 text-green-800"
                  : status === "ditolak"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800";
              return (
                <div
                  key={key}
                  className="border rounded-lg p-4 bg-white dark:bg-neutral-800 shadow-xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {new Date(String(tanggal)).toLocaleDateString?.(
                          "id-ID"
                        ) || tanggal}
                      </div>
                      <div className="font-medium">{nama}</div>
                      <div className="text-sm text-muted-foreground mt-2">
                        {truncateTitle(String(judul), 80)}
                      </div>
                    </div>
                    <div className="ml-3 text-right">
                      <div
                        className={`px-2 py-1 rounded text-sm ${colorClass}`}
                      >
                        {status}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleLihatClick(item)}
                    >
                      Preview
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PDF Preview Modal */}
      {selectedPengajuan && (
        <PDFPreviewModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          pengajuan={selectedPengajuan}
        />
      )}

      {/* Modal Detail Perbaikan Judul */}
      <Dialog
        open={!!detailPengajuan}
        onOpenChange={(open) => !open && setDetailPengajuan(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Perbaikan Judul</DialogTitle>
          </DialogHeader>
          {detailPengajuan && (
            <div className="space-y-4">
              <div>
                <Label className="text-xs">Judul Lama</Label>
                <div className="border rounded px-2 py-1 bg-muted">
                  {detailPengajuan.ranpel?.judulPenelitian || "-"}
                </div>
              </div>
              <div>
                <Label className="text-xs">Judul Perbaikan</Label>
                <div className="border rounded px-2 py-1 bg-muted">
                  {detailPengajuan.perbaikanJudul?.judulBaru || "-"}
                </div>
              </div>
              <div>
                <Label className="text-xs">Surat Perbaikan Judul</Label>
                {detailPengajuan.perbaikanJudul?.fileSurat ? (
                  <a
                    href={detailPengajuan.perbaikanJudul.fileSurat}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Lihat Surat
                  </a>
                ) : (
                  <span className="text-muted-foreground">Tidak ada file</span>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Tutup
              </Button>
            </DialogClose>
            <Button type="button" variant="default">
              Verifikasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
