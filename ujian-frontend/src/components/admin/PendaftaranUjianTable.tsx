/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import TableGlobal from "@/components/tableGlobal";
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
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

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

  // Filtered & Sorted data (basic filter applied; actual sorting handled by react-table)
  const filteredData = useMemo(() => {
    const data = pendaftaranUjian.filter((item) => {
      const nama = item.mahasiswa?.nama?.toLowerCase() ?? "";
      const judul = item.ranpel?.judulPenelitian?.toLowerCase() ?? "";
      const jenis = item.jenisUjian?.namaJenis?.toLowerCase() ?? "";
      const q = search.toLowerCase();
      const matchSearch = nama.includes(q) || judul.includes(q);
      let matchJenis = true;
      if (filterJenis !== "all") {
        matchJenis = jenis.includes(filterJenis);
      }
      return matchSearch && matchJenis;
    });
    return data;
  }, [pendaftaranUjian, search, filterJenis]);

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
        cell: ({ row }) => <div>{row.getValue("nama")}</div>,
      },
      {
        accessorFn: (row) => row.ranpel?.judulPenelitian ?? "-",
        id: "judul",
        header: "Judul",
        cell: ({ row }) => (
          <div className="whitespace-normal break-words max-w-sm">
            {row.getValue("judul")}
          </div>
        ),
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
                    <Eye size={16} /> Lihat Detail
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
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
      toast(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="text-emerald-500" size={18} />
          <div>
            <div className="font-semibold">Berhasil</div>
            <div className="">Pendaftaran ujian berhasil diterima.</div>
          </div>
        </div>
      );
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
      toast(
        <div className="flex items-center gap-2">
          <X className="text-rose-500" size={18} />
          <div>
            <div className="font-semibold">Ditolak</div>
            <div className="">Pendaftaran ujian telah ditolak.</div>
          </div>
        </div>
      );
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
    <div className=" dark:bg-neutral-900 p-6 rounded-lg bg-white">
      <div className="flex items-center gap-2 justify-between mb-4">
        <div className="flex items-center gap-3 w-full ">
          {/* search (full width) */}
          <div className="relative flex-1 flex items-center gap-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full bg-white dark:bg-[#2a2a2a] "
            />
          </div>

          {/* filter jenis (shadcn DropdownMenu) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 px-4 py-1 rounded-lg font-medium border transition flex items-center gap-2"
              >
                <span className="flex items-center gap-2">
                  <ListFilter size={16} />
                  {
                    jenisUjianOptions.find((opt) => opt.value === filterJenis)
                      ?.label
                  }
                </span>
                <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px]">
              {jenisUjianOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() =>
                    setFilterJenis(opt.value as typeof filterJenis)
                  }
                  className="flex items-center justify-between gap-2"
                >
                  <span className="text-sm">{opt.label}</span>
                  {filterJenis === opt.value && (
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* sort dropdown (shadcn DropdownMenu) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 px-3 py-1 rounded-lg font-medium border transition flex items-center gap-2"
                title="Sort"
              >
                <ArrowUpDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {sortOptions.map((opt) => {
                const active = isSortActive(opt.value);
                return (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => handleSortSelect(opt.value)}
                    className={`flex items-center justify-between gap-2 ${
                      active ? "bg-muted/20" : ""
                    }`}
                  >
                    <span className="text-sm">{opt.label}</span>
                    {active && (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    )}
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuItem onClick={() => handleSortSelect("none")}>
                Reset sorting
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* TableGlobal replaces manual Table & pagination */}
      <TableGlobal table={table} cols={cols} />

      {/* Pop Up Card Detail */}
      {showModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 ">
          <div className="w-full max-w-3xl bg-white dark:bg-neutral-950 rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b dark:border-neutral-700">
              <h3 className="text-lg font-semibold">
                Detail Pendaftaran Ujian
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowModal(false);
                    setSelected(null);
                  }}
                  className="px-3 py-1"
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
                        const fileUrl = `http://localhost:8000/storage/${file.filePath}`;
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

            {/* Footer actions */}
            <div className="border-t px-6 py-4 flex flex-col sm:flex-row gap-3 sm:justify-end sm:items-center">
              <div className="flex gap-2 w-full sm:w-auto">
                {selected.status === "menunggu" && (
                  <>
                    <Button
                      variant="destructive"
                      disabled={isPending}
                      onClick={() => handleConfirm("reject")}
                      className="w-full sm:w-auto"
                    >
                      Tolak
                    </Button>
                    <Button
                      variant="default"
                      disabled={isPending}
                      onClick={() => handleConfirm("accept")}
                      className="w-full sm:w-auto bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      {isPending ? "Menyimpan..." : "Terima"}
                    </Button>
                  </>
                )}
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
    </div>
  );
}
