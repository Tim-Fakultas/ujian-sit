/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import TableGlobal from "@/components/tableGlobal";
import { DataTableFilter } from "@/components/common/DataTableFilter";
import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Eye,
  Search,
  ChevronDown,
  ChevronUp,
  ListFilter,
  CheckCircle2,
  X,
  MoreHorizontal,
  ArrowUpDown,
  LayoutGrid,
  List,
  Settings,
  Settings2,
  Calendar,
} from "lucide-react";
import { PendaftaranUjian } from "@/types/PendaftaranUjian";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { getJenisUjianColor, getStatusColor } from "@/lib/utils";
import React, { useState, useTransition, useMemo, useEffect } from "react";
import { updateStatusPendaftaranUjian } from "@/actions/pendaftaranUjian";
import { Input } from "../ui/input";
import revalidateAction from "@/actions/revalidate";
import { showToast } from "@/components/ui/custom-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { DataCard } from "@/components/common/DataCard";

export default function PendaftaranUjianTable({
  pendaftaranUjian,
}: {
  pendaftaranUjian: PendaftaranUjian[];
}) {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<PendaftaranUjian | null>(null);
  const [isPending, startTransition] = useTransition();

  // Filter & Pagination State
  const [filterJenis, setFilterJenis] = useState<
    "all" | "proposal" | "hasil" | "skripsi"
  >("all");
  const [search, setSearch] = useState("");

  // Jenis ujian statis
  const jenisUjianOptions = [
    { label: "Semua", value: "all" },
    { label: "Proposal", value: "proposal" },
    { label: "Hasil", value: "hasil" },
    { label: "Skripsi", value: "skripsi" },
  ];

  // SORT STATE (react-table)
  const [sortField, setSortField] = useState<"judul" | "tanggal" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Sort options (id:order)
  const sortOptions = [
    { value: "tanggal:desc", label: "Tanggal terbaru" },
    { value: "tanggal:asc", label: "Tanggal terlama" },
    { value: "nama:asc", label: "Nama A–Z" },
    { value: "nama:desc", label: "Nama Z–A" },
    { value: "judul:asc", label: "Judul A–Z" },
    { value: "judul:desc", label: "Judul Z–A" },
  ];

  const isSortActive = (val: string) => {
    if (!sorting?.length) return false;
    const s = sorting[0] as any;
    return `${s.id}:${s.desc ? "desc" : "asc"}` === val;
  };

  const handleSortSelect = (value: string) => {
    if (value === "none") {
      setSorting([]);
      setSortField(null);
      return;
    }
    const [id, order] = value.split(":");
    setSorting([{ id, desc: order === "desc" } as any]);
    setSortField(id as any);
    setSortOrder(order === "asc" ? "asc" : "desc");
  };

  // Tabs state
  const [tab, setTab] = useState<
    "all" | "menunggu" | "diterima" | "ditolak" | "dijadwalkan" | "selesai"
  >("all");
  // View mode state
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  // Responsive: cek mobile
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 640 : false;

  // Status options for dropdown
  const statusOptions = [
    { value: "all", label: "Semua" },
    { value: "menunggu", label: "Menunggu" },
    { value: "diterima", label: "Diterima" },
    { value: "ditolak", label: "Ditolak" },
    { value: "dijadwalkan", label: "Dijadwalkan" },
    { value: "selesai", label: "Selesai" },
  ];

  // Gabungkan status dan jenis ujian untuk filter
  const combinedFilterOptions = [
    ...statusOptions.map((opt) => ({
      type: "status",
      value: opt.value,
      label: opt.label,
    })),
    ...jenisUjianOptions.map((opt) => ({
      type: "jenis",
      value: opt.value,
      label: `Jenis: ${opt.label}`,
    })),
  ];

  // State untuk filter gabungan
  const [filterOption, setFilterOption] = useState<{
    type: string;
    value: string;
  }>({
    type: "status",
    value: "all",
  });

  // Update filterJenis dan tab berdasarkan filterOption
  useEffect(() => {
    if (filterOption.type === "status") {
      setTab(filterOption.value as typeof tab);
      setFilterJenis("all");
    } else if (filterOption.type === "jenis") {
      setTab("all");
      setFilterJenis(filterOption.value as typeof filterJenis);
    }
  }, [filterOption]);

  // Filtered & Sorted data (basic filter applied; actual sorting handled by react-table)
  const filteredData = useMemo(() => {
    const data = pendaftaranUjian.filter((item) => {
      const nama = item.mahasiswa?.nama?.toLowerCase() ?? "";
      const judul = item.ranpel?.judulPenelitian?.toLowerCase() ?? "";
      const jenis = item.jenisUjian?.namaJenis?.toLowerCase() ?? "";
      const q = search.toLowerCase();
      const matchSearch = nama.includes(q) || judul.includes(q);

      // Gabungan filter
      let matchStatus = true;
      let matchJenis = true;
      if (filterOption.type === "status" && filterOption.value !== "all") {
        matchStatus = item.status === filterOption.value;
      }
      if (filterOption.type === "jenis" && filterOption.value !== "all") {
        matchJenis = jenis.includes(filterOption.value);
      }
      return matchSearch && matchStatus && matchJenis;
    });
    return data;
  }, [pendaftaranUjian, search, filterOption]);

  const handleDetail = React.useCallback((pendaftaran: PendaftaranUjian) => {
    setSelected(pendaftaran);
    setShowModal(true);
  }, []);

  // build react-table columns (used by TableGlobal)
  const cols: ColumnDef<PendaftaranUjian>[] = useMemo(
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
        header: "Nama Mahasiswa",
        cell: ({ row }) => (
          <div>
            {row.getValue("nama")}
            <div className="text-xs text-muted-foreground">
              {row.original.mahasiswa?.nim ?? "-"}
            </div>
          </div>
        ),
        size: 160, // kurangi lebar kolom nama
      },
      {
        accessorFn: (row) => row.ranpel?.judulPenelitian ?? "-",
        id: "judul",
        header: "Judul",
        cell: ({ row }) => (
          <div className="whitespace-normal break-words max-w-[180px]">
            {row.getValue("judul")}
          </div>
        ),
        size: 200, // kurangi lebar kolom judul
      },
      {
        accessorFn: (row) => row.tanggalPengajuan ?? "",
        id: "tanggal",
        header: () => (
          <div className="flex items-center gap-1 select-none">
            Tanggal Pengajuan
            <button
              type="button"
              className="ml-1 p-0.5"
              onClick={() => {
                const next =
                  sortField === "tanggal"
                    ? sortOrder === "asc"
                      ? "desc"
                      : "asc"
                    : "asc";
                setSortField("tanggal");
                setSortOrder(next);
                setSorting([{ id: "tanggal", desc: next === "desc" }]);
              }}
              aria-label="Urutkan tanggal"
            >
              {sortField === "tanggal" && sortOrder === "asc" ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
          </div>
        ),
        cell: ({ row }) => {
          const v = String(row.getValue("tanggal") ?? "");
          try {
            return new Date(v).toLocaleDateString("id-ID");
          } catch {
            return v;
          }
        },
        size: 110, // kurangi lebar kolom tanggal
      },
      {
        accessorFn: (row) => row.jenisUjian.namaJenis ?? "-",
        id: "jenis",
        header: "Jenis",
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded font-semibold inline-block ${getJenisUjianColor(
              String(row.getValue("jenis"))
            )}`}
          >
            {row.getValue("jenis")}
          </span>
        ),
        size: 110, // kurangi lebar kolom jenis
      },
      {
        accessorFn: (row) => row.status ?? "-",
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const s = String(row.getValue("status"));
          return (
            <span
              className={`px-2 py-1 rounded font-medium ${getStatusColor(s)}`}
            >
              {s}
            </span>
          );
        },
        size: 100, // kurangi lebar kolom status
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const pendaftaran = row.original;
          return (
            <div className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="p-1 h-7 w-7">
                    <MoreHorizontal size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleDetail(pendaftaran)}>
                    <Eye size={16} /> Lihat berkas
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        size: 60, // kurangi lebar kolom aksi
      },
    ],
    [handleDetail, sortField, sortOrder]
  );

  // create react-table instance
  const table = useReactTable({
    data: filteredData,
    columns: cols,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Reset internal table page when filters change
  useEffect(() => {
    try {
      table.setPageIndex?.(0);
    } catch {}
  }, [search, filterJenis, table]);

  async function handleAccept(id: number) {
    try {
      await updateStatusPendaftaranUjian(id, "diterima");
      setShowModal(false);
      // custom sonner toast dengan icon dan teks
      showToast.success("Berhasil", "Pendaftaran ujian berhasil diterima.");
      revalidateAction("admin/pendaftaran-ujian");
    } catch (err) {
      alert("Gagal memperbarui status pendaftaran ujian.");
      console.error(err);
    }
  }

  async function handleReject(id: number) {
    try {
      await updateStatusPendaftaranUjian(id, "ditolak");
      setShowModal(false);
      showToast.error("Ditolak", "Pendaftaran ujian telah ditolak.");
      revalidateAction("admin/pendaftaran-ujian");
    } catch (err) {
      alert("Gagal memperbarui status pendaftaran ujian.");
      console.error(err);
    }
  }

  // State untuk dialog konfirmasi
  const [confirmType, setConfirmType] = useState<null | "accept" | "reject">(
    null
  );

  // Handler tombol ACC/Tolak
  function handleConfirm(type: "accept" | "reject") {
    setConfirmType(type);
  }

  // Handler submit konfirmasi
  function handleConfirmSubmit() {
    if (!selected) return;
    if (confirmType === "accept") {
      startTransition(() => handleAccept(selected.id));
    } else if (confirmType === "reject") {
      startTransition(() => handleReject(selected.id));
    }
    setConfirmType(null);
  }

  return (
    <DataCard>
      {/* Filter bar: gabungan status/jenis, view mode, search, sort */}
      {/* Filter bar: gabungan status/jenis, view mode, search, sort */}
      <DataTableFilter
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search Name or Title..."
        filterGroups={[
          { label: "Status", key: "status", options: statusOptions },
          { label: "Jenis Ujian", key: "jenis", options: jenisUjianOptions },
        ]}
        selectedFilterType={filterOption.type}
        selectedFilterValue={filterOption.value}
        onFilterChange={(type, value) => {
          setFilterOption({ type, value });
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      {/* Table/Card view */}
      {viewMode === "table" ? (
        <TableGlobal table={table} cols={cols} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredData.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-8">
              Tidak ada data.
            </div>
          ) : (
            filteredData.map((item, idx) => {
              const judul = item.ranpel?.judulPenelitian ?? "-";
              const jenis = item.jenisUjian?.namaJenis ?? "-";
              const tanggal = item.tanggalPengajuan ?? "";
              const status = item.status ?? "-";
              const nama = item.mahasiswa?.nama ?? "-";
              const nim = item.mahasiswa?.nim ?? "-";
              
              const tanggalStr = tanggal
                ? new Date(String(tanggal)).toLocaleDateString("id-ID", {
                    day: "numeric", month: "short", year: "numeric"
                  })
                : "-";



              let statusColor = "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
              if (status === "menunggu") statusColor = "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
              else if (status === "diterima") statusColor = "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
              else if (status === "ditolak") statusColor = "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
              else if (status === "dijadwalkan") statusColor = "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800";
              else if (status === "selesai") statusColor = "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-700";


              return (
                <div
                  key={item.id ?? idx}
                  className={`group relative bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col`}
                >
                  <div className="p-5 flex flex-col gap-4 flex-1">
                     
                     {/* Header: Date & Status */}
                     <div className="flex justify-between items-start">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                           <Calendar size={13} />
                           <span>{tanggalStr}</span>
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
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                   {nim}
                                </span>
                             </div>
                          </div>
                     </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="bg-gray-50/50 dark:bg-neutral-800/50 p-3 flex items-center justify-end border-t border-gray-100 dark:border-neutral-800">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-xs h-8 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                          <MoreHorizontal size={14} className="mr-1.5" /> Aksi
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleDetail(item)}>
                          <Eye size={16} /> Lihat berkas
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Pop Up Card Detail */}
      {showModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 ">
          <div className="w-full max-w-3xl bg-white dark:bg-neutral-950 rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b dark:border-neutral-700 gap-4">
              <h3 className="text-lg font-semibold">
                Detail Pendaftaran Ujian
              </h3>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {selected.status === "menunggu" && (
                  <>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleConfirm("reject")}
                    >
                      Tolak
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleConfirm("accept")}
                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      {isPending ? "Proses..." : "Terima"}
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowModal(false);
                    setSelected(null);
                  }}
                  className="h-8 w-8"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>

            {/* Content: left metadata, right files; scrollable */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Metadata */}
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Nama Mahasiswa
                    </div>
                    <div className="font-semibold">
                      {selected.mahasiswa?.nama}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">NIM</div>
                    <div className="font-semibold">
                      {selected.mahasiswa?.nim}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Judul Penelitian
                    </div>
                    <div className="mt-1 border rounded px-3 py-2 text-sm">
                      {selected.ranpel?.judulPenelitian}
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Jenis Ujian
                      </div>
                      <div className="mt-1 text-sm">
                        {selected.jenisUjian?.namaJenis}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Tanggal Pengajuan
                      </div>
                      <div className="mt-1 text-sm">
                        {new Date(selected.tanggalPengajuan).toLocaleDateString(
                          "id-ID"
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div className="mt-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(
                          selected.status
                        )}`}
                      >
                        {selected.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Files list */}
                <div>
                  <div className="text-sm font-semibold mb-3">
                    Berkas Persyaratan
                  </div>
                  <div className="space-y-3">
                    {selected.berkas && selected.berkas.length > 0 ? (
                      selected.berkas.map((file, idx) => {
                        const apiUrl =
                          process.env.NEXT_PUBLIC_STORAGE_URL || "";
                        const fileUrl = `${apiUrl}/storage/${file.filePath}`;
                        let label = "";
                        if (idx === 0) label = "Transkrip Nilai";
                        else if (idx === 1) label = "Pengesahan Proposal";
                        else if (idx === 2)
                          label = "Surat Keterangan Lulus Plagiasi";
                        else if (idx === 3) label = "Proposal Skripsi";
                        else
                          label =
                            file.namaBerkas ?? fileUrl.split("/").pop() ?? "";
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-4 p-3 border rounded-lg bg-white dark:bg-neutral-900"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <Eye
                                size={16}
                                className="text-blue-500 flex-shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="font-medium text-sm">
                                  {label}
                                </div>
                                <a
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 underline truncate block max-w-[220px]"
                                  title={
                                    file.namaBerkas || fileUrl.split("/").pop()
                                  }
                                >
                                  {file.namaBerkas || fileUrl.split("/").pop()}
                                </a>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(fileUrl, "_blank")}
                              >
                                Lihat
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Tidak ada berkas.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      )}

      {/* Dialog Konfirmasi ACC/Tolak */}
      <Dialog
        open={!!confirmType}
        onOpenChange={(open) => !open && setConfirmType(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmType === "accept"
                ? "Konfirmasi Terima Pendaftaran"
                : "Konfirmasi Tolak Pendaftaran"}
            </DialogTitle>
          </DialogHeader>
          <div>
            {confirmType === "accept"
              ? "Apakah Anda yakin ingin menerima pendaftaran ujian ini?"
              : "Apakah Anda yakin ingin menolak pendaftaran ujian ini?"}
          </div>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setConfirmType(null)}>
              Batal
            </Button>
            <Button
              variant={confirmType === "accept" ? "default" : "destructive"}
              onClick={handleConfirmSubmit}
              disabled={isPending}
              className="bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500"
            >
              {confirmType === "accept"
                ? isPending
                  ? "Menyimpan..."
                  : "Terima"
                : isPending
                ? "Menyimpan..."
                : "Tolak"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DataCard>
  );
}
