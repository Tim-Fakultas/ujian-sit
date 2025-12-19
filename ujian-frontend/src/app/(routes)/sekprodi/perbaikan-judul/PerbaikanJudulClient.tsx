/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  Calendar,
  Check,
  LayoutGrid,
  List,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import PDFPreviewModal from "@/components/mahasiswa/pengajuan-ranpel/PDFPreviewModal";

interface PerbaikanJudulClientProps {
  pengajuanRanpel: PengajuanRanpel[];
}

export default function PerbaikanJudulClient({
  pengajuanRanpel,
}: PerbaikanJudulClientProps) {
  const [data, setData] = useState<PengajuanRanpel[]>(pengajuanRanpel);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  // Modal states
  const [selectedPengajuan, setSelectedPengajuan] =
    useState<PengajuanRanpel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailPengajuan, setDetailPengajuan] =
    useState<PengajuanRanpel | null>(null);

  const statusOptions = [
    { value: "all", label: "Semua Status" },
    { value: "menunggu", label: "Menunggu" },
    { value: "diterima", label: "Diterima" },
    { value: "ditolak", label: "Ditolak" },
    { value: "diverifikasi", label: "Diverifikasi" },
  ];

  const sortOptions = [
    { value: "date-desc", label: "Terbaru" },
    { value: "date-asc", label: "Terlama" },
    { value: "name-asc", label: "Nama (A-Z)" },
    { value: "name-desc", label: "Nama (Z-A)" },
  ];

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    let result = [...data];

    // Search
    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.mahasiswa?.nama?.toLowerCase().includes(lower) ||
          item.ranpel?.judulPenelitian?.toLowerCase().includes(lower) ||
          item.mahasiswa?.nim?.includes(lower)
      );
    }

    // Filter Status
    if (filterStatus !== "all") {
      result = result.filter((item) => item.status === filterStatus);
    }

    return result;
  }, [data, search, filterStatus]);

  // Sorting Handler
  const handleSortSelect = (val: string) => {
    switch (val) {
      case "date-desc":
        setSorting([{ id: "tanggalPengajuan", desc: true }]);
        break;
      case "date-asc":
        setSorting([{ id: "tanggalPengajuan", desc: false }]);
        break;
      case "name-asc":
        setSorting([{ id: "mahasiswa_nama", desc: false }]);
        break;
      case "name-desc":
        setSorting([{ id: "mahasiswa_nama", desc: true }]);
        break;
      case "none":
        setSorting([]);
        break;
    }
  };

  const isSortActive = (val: string) => {
    if (val === "none" && sorting.length === 0) return true;
    if (val === "date-desc" && sorting[0]?.id === "tanggalPengajuan" && sorting[0]?.desc)
      return true;
    if (val === "date-asc" && sorting[0]?.id === "tanggalPengajuan" && !sorting[0]?.desc)
      return true;
    if (val === "name-asc" && sorting[0]?.id === "mahasiswa_nama" && !sorting[0]?.desc)
      return true;
    if (val === "name-desc" && sorting[0]?.id === "mahasiswa_nama" && sorting[0]?.desc)
      return true;
    return false;
  };

  // Actions
  const handleLihatClick = (item: PengajuanRanpel) => {
    setSelectedPengajuan(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPengajuan(null);
    setIsModalOpen(false);
  };

  const handleDetail = (item: PengajuanRanpel) => {
    setDetailPengajuan(item);
  };

  // Columns Configuration
  const cols = useMemo<ColumnDef<PengajuanRanpel>[]>(
    () => [
      {
        id: "no",
        header: "No",
        cell: ({ row, table }) =>
          (table.getState().pagination.pageIndex ) *
            table.getState().pagination.pageSize +
          row.index +
          1,
        size: 50,
      },
      {
        accessorFn: (row) => row.tanggalPengajuan,
        id: "tanggalPengajuan",
        header: "Tanggal",
        cell: ({ getValue }) => {
          const val = getValue() as string;
          if (!val) return "-";
          return new Date(val).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
        },
        size: 120,
      },
      {
        accessorFn: (row) => row.mahasiswa?.nama,
        id: "mahasiswa_nama",
        header: "Mahasiswa",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.mahasiswa?.nama}</div>
            <div className="text-xs text-muted-foreground">
              {row.original.mahasiswa?.nim}
            </div>
          </div>
        ),
        size: 180,
      },
      {
        accessorFn: (row) => row.ranpel?.judulPenelitian,
        id: "judul",
        header: "Judul",
        cell: ({ row }) => (
           <div className="max-w-[250px] line-clamp-2" title={row.original.ranpel?.judulPenelitian}>
                {row.original.ranpel?.judulPenelitian}
           </div>
        ),
        size: 250,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const color =
            status === "menunggu"
              ? "bg-yellow-100 text-yellow-800"
              : status === "diterima"
              ? "bg-green-100 text-green-800"
              : status === "ditolak"
              ? "bg-red-100 text-red-800"
              : status === "diverifikasi"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800";

          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${color}`}
            >
              {status}
            </span>
          );
        },
        size: 100,
      },
      {
        id: "aksi",
        header: "Aksi",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLihatClick(row.original)}
              className="h-8 w-8 p-0"
              title="Preview PDF"
            >
              <Eye size={14} />
            </Button>
            {/* Example action: Detail Perbaikan if logic exists */}
            {row.original.perbaikanJudul && (
                 <Button
                    variant="default"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => handleDetail(row.original)}
                 >
                    Detail
                 </Button>
            )}
          </div>
        ),
        size: 100,
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns: cols,
    state: {
      sorting,
      columnFilters: [],
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari mahasiswa atau judul..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 flex items-center gap-2"
              >
                <ListFilter size={16} />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] p-0">
              <ScrollArea className="max-h-[300px] p-1">
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
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort Dropdown */}
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
            <DropdownMenuContent align="end" className="w-[200px] p-0">
              <ScrollArea className="max-h-[300px] p-1">
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
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode Tabs */}
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as "table" | "card")}
            className="h-9"
          >
            <TabsList className="h-9 p-1 bg-muted/50 rounded-lg">
              <TabsTrigger
                value="table"
                className="h-7 px-2.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <LayoutGrid size={14} />
              </TabsTrigger>
              <TabsTrigger
                value="card"
                className="h-7 px-2.5 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <List size={14} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      {filteredData.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center gap-3 border rounded-xl bg-gray-50/50 dark:bg-neutral-900/10 border-dashed">
          <div className="text-sm text-muted-foreground text-center">
            Tidak ada data pengajuan rancangan penelitian
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setFilterStatus("all");
              setSearch("");
            }}
          >
            Reset Filter
          </Button>
        </div>
      ) : viewMode === "table" ? (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border shadow-sm items-center">
             <TableGlobal table={table} cols={cols} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredData.map((item, idx) => {
            const key = (item as any).id ?? idx;
            const nama = item.mahasiswa?.nama ?? "-";
            const judul = item.ranpel?.judulPenelitian ?? "-";
            const tanggal = item.tanggalPengajuan ?? "";
            const status = item.status ?? "-";
            
            const statusColor =
                status === "menunggu" ? "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800" :
                status === "diterima" ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800" :
                status === "ditolak" ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800" :
                status === "diverifikasi" ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" :
                "bg-gray-100 text-gray-800 border-gray-200 dark:bg-neutral-800 dark:text-gray-400";


            return (
                <div
                  key={key}
                  className={`group relative bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col`}
                >
                  <div className="p-5 flex flex-col gap-4 flex-1">
                     
                     {/* Header: Date & Status */}
                     <div className="flex justify-between items-start">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                           <Calendar size={13} />
                           <span>
                             {new Date(String(tanggal)).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                             })}
                           </span>
                        </div>
                        
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}>
                           {status}
                        </span>
                     </div>

                     {/* Content: Title & Name */}
                     <div className="space-y-2">
                          <h3 className="font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-3" title={judul}>
                             {judul || "Judul tidak tersedia"}
                          </h3>
                          
                          <div className="flex items-center gap-2 pt-1 border-t border-gray-50 dark:border-neutral-800 mt-2">
                             <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 mt-2">
                                {nama.charAt(0)}
                             </div>
                             <div className="flex flex-col mt-2">
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[180px]">
                                   {nama}
                                </span>
                             </div>
                          </div>
                     </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="bg-gray-50/50 dark:bg-neutral-800/50 p-3 flex items-center justify-end border-t border-gray-100 dark:border-neutral-800">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleLihatClick(item)}
                      className="text-xs h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                    >
                      <Eye size={14} className="mr-1.5" /> Preview
                    </Button>
                    {item.perbaikanJudul && (
                         <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-8 text-gray-600 hover:text-gray-900 ml-2"
                            onClick={() => handleDetail(item)}
                         >
                            Detail
                         </Button>
                    )}
                  </div>
                </div>
            );
          })}
        </div>
      )}

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
                <div className="border rounded px-2 py-1 bg-muted/50 text-sm">
                  {detailPengajuan.ranpel?.judulPenelitian || "-"}
                </div>
              </div>
              <div>
                <Label className="text-xs">Judul Perbaikan</Label>
                <div className="border rounded px-2 py-1 bg-muted/50 text-sm">
                  {detailPengajuan.perbaikanJudul?.judulBaru || "-"}
                </div>
              </div>
              <div>
                <Label className="text-xs">Surat Perbaikan Judul</Label>
                <div className="mt-1">
                {detailPengajuan.perbaikanJudul?.fileSurat ? (
                  <a
                    href={detailPengajuan.perbaikanJudul.fileSurat}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    Lihat Surat
                  </a>
                ) : (
                  <span className="text-muted-foreground text-sm">Tidak ada file</span>
                )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Tutup
              </Button>
            </DialogClose>
            {/* Logic verifikasi belum ada, jadi hanya tombol tutup/verifikasi placeholder */}
            <Button type="button" variant="default" disabled title="Fungsi belum  implementasi">
              Verifikasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
