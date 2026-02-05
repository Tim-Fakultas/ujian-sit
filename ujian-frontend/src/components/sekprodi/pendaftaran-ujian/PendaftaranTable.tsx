"use client";

import {
  useState,
  useEffect,
  useActionState,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


import {
  Search,
  X,

  CheckCircle2,
  Settings2,
  List,
  LayoutGrid,
  Eye,
  FileText,
  Pencil,
} from "lucide-react";
import { getMahasiswaById } from "@/actions/data-master/mahasiswa";
import { getJenisUjianColor, getStatusColor, getStorageUrl } from "@/lib/utils";
import revalidateAction from "@/actions/revalidate";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { showToast } from "@/components/ui/custom-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PendaftaranUjian } from "@/types/PendaftaranUjian";
import { ScrollArea } from "@/components/ui/scroll-area";
import { updateStatusPendaftaranUjian } from "@/actions/pendaftaranUjian";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataCard } from "@/components/common/DataCard";
import { getRanpelByMahasiswaId } from "@/actions/rancanganPenelitian";
import { useUrlSearch } from "@/hooks/use-url-search";

export default function PendaftaranUjianTable({
  pendaftaranUjianList,
}: {
  pendaftaranUjianList: PendaftaranUjian[];
}) {
  const router = useRouter();
  const [localData, setLocalData] =
    useState<PendaftaranUjian[]>(pendaftaranUjianList);

  useEffect(() => {
    setLocalData(pendaftaranUjianList);
  }, [pendaftaranUjianList]);

  const [selected, setSelected] = useState<PendaftaranUjian | null>(null);
  const [ranpelId, setRanpelId] = useState<number | null>(0);
  type MahasiswaDetail = {
    id: number | string;
    nama: string;
    pembimbing1?: { id: number | string; nama: string };
    pembimbing2?: { id: number | string; nama: string };
  };

  const [mahasiswaDetail, setMahasiswaDetail] =
    useState<MahasiswaDetail | null>(null);


  const [showBerkasModal, setShowBerkasModal] = useState(false);

  // State for Reject Dialog
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  // State for Edit Keterangan Dialog
  const [showEditKeteranganDialog, setShowEditKeteranganDialog] = useState(false);
  const [editKeterangan, setEditKeterangan] = useState("");
  const [isEditingKeterangan, setIsEditingKeterangan] = useState(false);

  useEffect(() => {
    if (selected) {
      getMahasiswaById(Number(selected.mahasiswa.id)).then((res) =>
        setMahasiswaDetail(res?.data || null)
      );
    }
  }, [selected]);





  // Tutup popup dengan Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    if (selected) {
      window.addEventListener("keydown", onKey);
    }
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  // Jenis ujian statis
  const jenisUjianOptions = [
    { label: "Semua", value: "all" },
    { label: "Ujian Proposal", value: "Ujian Proposal" },
    { label: "Ujian Hasil", value: "Ujian Hasil" },
    { label: "Ujian Skripsi", value: "Ujian Skripsi" },
  ];

  // Status options
  const statusOptions = [
    { value: "all", label: "Semua" },
    { value: "belum dijadwalkan", label: "Belum dijadwalkan" },
    { value: "revisi", label: "Revisi" }, // Replace/Add revisi
    { value: "dijadwalkan", label: "Dijadwalkan" },
    { value: "selesai", label: "Selesai" },
  ];


  // State untuk filter gabungan
  const [filterOption, setFilterOption] = useState<{
    type: string;
    value: string;
  }>({
    type: "status",
    value: "all",
  });

  // Update filterJenis berdasarkan filterOption
  useEffect(() => {
    if (filterOption.type === "status") {
      setFilterJenis("all");
    } else if (filterOption.type === "jenis") {
      setFilterJenis(filterOption.value);
    }
  }, [filterOption]);

  // Filter & Pagination State
  const { search: filterNama, setSearch: setFilterNama } = useUrlSearch();
  const [filterJenis, setFilterJenis] = useState<string>("all");

  // react-table states (for TableGlobal)
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  // helper: tampilkan label sorting saat ini

  // Filtered data
  const filteredData = useMemo(() => {
    return localData.filter((u) => {
      const searchLower = filterNama.toLowerCase();
      const matchSearch =
        (u.mahasiswa.nama && u.mahasiswa.nama.toLowerCase().includes(searchLower)) ||
        (u.mahasiswa.nim && u.mahasiswa.nim.toLowerCase().includes(searchLower)) ||
        (u.judulPenelitian &&
          u.judulPenelitian.toLowerCase().includes(searchLower));

      const matchJenis =
        filterOption.type === "jenis"
          ? filterOption.value === "all"
            ? true
            : u.jenisUjian.namaJenis === filterOption.value
          : true;
      const matchStatus =
        filterOption.type === "status"
          ? filterOption.value === "all"
            ? true
            : u.status === filterOption.value
          : true;
      return matchSearch && matchJenis && matchStatus;
    });
  }, [filterNama, filterOption, localData]);

  // Ambil berkas dari localData yang cocok dengan mahasiswa & jenis ujian
  const getBerkasForSelected = () => {
    if (!selected) return [];
    // Cari pendaftaran ujian yang cocok
    const found = localData.find(
      (p) =>
        p.mahasiswa.id === selected.mahasiswa.id &&
        p.jenisUjian.id === selected.jenisUjian.id
    );
    return found?.berkas ?? [];
  };



  // helper to open modal from table action
  const handleBerkas = (u: PendaftaranUjian) => {
    setSelected(u);
    setShowBerkasModal(true);
  };

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
        size: 40,
      },
      {
        accessorFn: (row) => row.mahasiswa.nama ?? "-",
        id: "nama",
        header: "Nama Mahasiswa",
        cell: ({ row }) => <div>{row.getValue("nama")}</div>,
        size: 160,
      },
      {
        accessorFn: (row) => row.judulPenelitian ?? "-",
        id: "judul",
        header: "Judul",
        cell: ({ row }) => (
          <div className="min-w-[250px] whitespace-normal leading-relaxed py-1">
            {row.getValue("judul")}
          </div>
        ),
        size: 300,
      },
      {
        accessorFn: (row) => row.jenisUjian.namaJenis ?? "-",
        id: "jenis",
        header: "Jenis Ujian",
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 text-sm rounded font-semibold inline-block ${getJenisUjianColor(
              String(row.getValue("jenis"))
            )}`}
          >
            {row.getValue("jenis")}
          </span>
        ),
        size: 110,
      },
      {
        accessorFn: (row) => row.status ?? "-",
        id: "status",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded text-sm ${getStatusColor(
              String(row.getValue("status"))
            )}`}
          >
            {row.getValue("status")}
          </span>
        ),
        size: 100,
      },
      {
        accessorFn: (row) => {
          const found = localData.find(
            (p) =>
              p.mahasiswa.id === row.mahasiswa.id &&
              p.jenisUjian.id === row.jenisUjian.id
          );
          return found?.berkas ?? [];
        },
        id: "berkas",
        header: () => <div className="text-center w-full">Berkas</div>,
        cell: ({ row }) => {
          const u = row.original;
          const found = localData.find(
            (p) =>
              p.mahasiswa.id === u.mahasiswa.id &&
              p.jenisUjian.id === u.jenisUjian.id
          );
          const berkas = found?.berkas ?? [];
          return (
            <div className="flex items-center justify-center gap-2">
              {berkas.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-1"
                  onClick={() => handleBerkas(u)}
                  aria-label="Lihat Berkas"
                >
                  <Eye size={16} />
                </Button>
              )}
            </div>
          );
        },
        size: 80,
      },

    ],
    [localData]
  );

  // create react-table instance used by TableGlobal
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

  return (
    <DataCard>
      <DataTableFilter
        searchValue={filterNama}
        onSearchChange={setFilterNama}
        searchPlaceholder="Search Name, NIM, Title..."
        filterGroups={[
          { label: "Status", key: "status", options: statusOptions },
          { label: "Jenis Ujian", key: "jenis", options: jenisUjianOptions },
        ]}
        selectedFilterType={filterOption.type}
        selectedFilterValue={filterOption.value}
        onFilterChange={(type, value) => {
          setFilterOption({ type, value });
        }}
      />

      {/* Table View Only */}
      <TableGlobal table={table} cols={cols} />



      {/* Modal Berkas */}
      <Dialog
        open={showBerkasModal}
        onOpenChange={(open) => {
          setShowBerkasModal(open);
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden sm:rounded-xl">
          <DialogHeader className="px-6 py-5 border-b bg-white dark:bg-neutral-900 border-gray-100 dark:border-neutral-800 z-10">
            <div className="flex flex-row items-start justify-between gap-4">
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-1">
                  <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Berkas Persyaratan
                  </DialogTitle>
                  {selected && (
                    <div className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {selected.mahasiswa.nama}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-neutral-600" />
                      <span>{selected.jenisUjian.namaJenis}</span>
                    </div>
                  )}
                </div>
                {selected &&
                  selected.status === "revisi" &&
                  selected.keterangan && (
                    <div className="p-3 border rounded-lg bg-orange-50 border-orange-100 dark:bg-orange-900/20 dark:border-orange-900/50">
                      <p className="text-xs font-semibold mb-0.5 text-orange-800 dark:text-orange-300">
                        Catatan Revisi:
                      </p>
                      <p className="text-xs text-orange-700 dark:text-orange-400">
                        {selected.keterangan}
                      </p>
                    </div>
                  )}
              </div>
              <div className="flex items-center gap-2 self-start">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg"
                  onClick={() => setShowBerkasModal(false)}
                >
                  <X size={20} />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Berkas pendaftaran */}
          {selected && (
            <>
              <div className="p-6 overflow-y-auto flex-1 ">
                <div className="space-y-3">
                  {getBerkasForSelected().length > 0 ? (
                    getBerkasForSelected().map((file, idx) => (
                      <div
                        key={file.id ?? idx}
                        className="flex items-center justify-between p-3 rounded-xl border bg-card hover:bg-accent/5 transition-colors"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                            <FileText size={18} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate max-w-[160px]" title={file.namaBerkas}>
                                {file.namaBerkas || "Dokumen"}
                              </p>
                              {(() => {
                                if (!selected) return null;
                                const fileTime = new Date(file.createdAt || file.uploadedAt || "").getTime();
                                const pendaftaranTime = new Date(selected.createdAt).getTime();
                                const isRevision = fileTime - pendaftaranTime > 60 * 1000;
                                if (isRevision) {
                                  return (
                                    <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded border border-orange-200 font-medium shrink-0">
                                      Revisi
                                    </span>
                                  )
                                }
                                return null;
                              })()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString("id-ID") : "-"}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" asChild className="shrink-0">
                          <a
                            href={getStorageUrl(file.filePath)}
                            target="_blank"
                            rel="noreferrer"
                            title="Lihat Berkas"
                          >
                            <Eye size={16} />
                          </a>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
                        <FileText
                          size={24}
                          className="text-gray-400 dark:text-gray-500"
                        />
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Tidak ada berkas
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Mahasiswa belum mengunggah berkas persyaratan.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Buttons Action in Header */}
          <div className="flex flex-row gap-2 relative z-2 bg-white shadow-neutral-800 shadow-lg h-20 dark:bg-neutral-800 p-4 justify-end">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 border-gray-200 hover:bg-gray-50 dark:text-gray-400 dark:border-neutral-700 dark:hover:bg-neutral-800 transition-all font-medium h-10 px-4 text-sm flex items-center gap-1.5 touch-manipulation"
              onClick={() => {
                setEditKeterangan(selected?.keterangan || "");
                setShowEditKeteranganDialog(true);
              }}
            >
              <Pencil size={12} />
              Edit Keterangan
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 dark:border-orange-900/50 dark:text-orange-400 dark:hover:bg-orange-900/20 transition-all font-medium h-10 px-4 text-sm touch-manipulation"
              onClick={() => {
                setShowRejectDialog(true);
              }}
            >
              Minta Revisi
            </Button>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200 dark:shadow-none transition-all font-medium h-10 px-4 text-sm touch-manipulation"
              onClick={async () => {
                const found = localData.find(
                  (p) =>
                    p.mahasiswa.id === selected?.mahasiswa.id &&
                    p.jenisUjian.id === selected?.jenisUjian.id
                );
                if (found) {
                  // Optimistic Update
                  const previousData = [...localData];
                  const newData = localData.map((item) =>
                    item.id === found.id
                      ? { ...item, status: "belum dijadwalkan" }
                      : item
                  );
                  setLocalData(newData);
                  setShowBerkasModal(false);

                  const tId = showToast.loading("Memverifikasi berkas...");
                  try {
                    await updateStatusPendaftaranUjian(
                      found.id,
                      "belum dijadwalkan",
                    );
                    showToast.dismiss(tId);
                    showToast.success(`Berkas berhasil diverifikasi`);
                    await revalidateAction("/sekprodi/pendaftaran-ujian");
                    // router.refresh(); // Removed: causes status to revert due to stale cache
                  } catch (error) {
                    showToast.dismiss(tId);
                    showToast.error("Gagal memverifikasi berkas");
                    setLocalData(previousData); // Revert on failure
                  }
                } else {
                  showToast.error("Data pendaftaran tidak ditemukan");
                }
              }}
            >
              Verifikasi
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Reason Dialog */}
      <Dialog
        open={showRejectDialog}
        onOpenChange={(open) => {
          setShowRejectDialog(open);
          if (!open) {
            setRejectReason("");
            setIsRejecting(false);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Minta Revisi Pendaftaran</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Apakah Anda yakin ingin meminta revisi untuk pendaftaran ini? Silakan masukkan catatan revisi.
            </p>
            <Textarea
              placeholder="Contoh: Berkas proposal belum lengkap..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
              disabled={isRejecting}
            >
              Batal
            </Button>
            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white"
              disabled={!rejectReason.trim() || isRejecting}
              onClick={async () => {
                setIsRejecting(true);
                const found = localData.find(
                  (p) =>
                    p.mahasiswa.id === selected?.mahasiswa.id &&
                    p.jenisUjian.id === selected?.jenisUjian.id
                );

                if (found) {
                  const tId = showToast.loading("Mengirim permintaan revisi...");

                  try {
                    const result = await updateStatusPendaftaranUjian(found.id, "revisi", rejectReason);

                    // Update with actual response from server
                    if (result?.data) {
                      const newData = localData.map((item) =>
                        item.id === found.id
                          ? { ...item, status: result.data.status, keterangan: result.data.keterangan }
                          : item
                      );
                      setLocalData(newData);
                    }

                    // Close modals after successful update
                    setShowRejectDialog(false);
                    setShowBerkasModal(false);

                    showToast.dismiss(tId);
                    showToast.success("Permintaan revisi berhasil dikirim");

                    await revalidateAction("/sekprodi/pendaftaran-ujian");
                  } catch (error) {
                    showToast.dismiss(tId);
                    showToast.error("Gagal mengirim permintaan revisi");
                  } finally {
                    setIsRejecting(false);
                  }
                } else {
                  setIsRejecting(false);
                  setShowRejectDialog(false);
                  showToast.error("Data pendaftaran tidak ditemukan");
                }
              }}
            >
              {isRejecting ? "Mengirim..." : "Kirim Revisi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Keterangan Dialog */}
      <Dialog
        open={showEditKeteranganDialog}
        onOpenChange={(open) => {
          setShowEditKeteranganDialog(open);
          if (!open) {
            setEditKeterangan("");
            setIsEditingKeterangan(false);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Keterangan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ubah keterangan atau alasan penolakan untuk pendaftaran ini.
            </p>
            <Textarea
              placeholder="Masukkan keterangan..."
              value={editKeterangan}
              onChange={(e) => setEditKeterangan(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditKeteranganDialog(false)}
              disabled={isEditingKeterangan}
            >
              Batal
            </Button>
            <Button
              disabled={isEditingKeterangan}
              onClick={async () => {
                setIsEditingKeterangan(true);
                const found = localData.find(
                  (p) =>
                    p.mahasiswa.id === selected?.mahasiswa.id &&
                    p.jenisUjian.id === selected?.jenisUjian.id
                );

                if (found) {
                  // Optimistic Update
                  const previousData = [...localData];
                  const previousSelected = selected ? { ...selected } : null;

                  const newData = localData.map((item) =>
                    item.id === found.id
                      ? { ...item, keterangan: editKeterangan }
                      : item
                  );
                  setLocalData(newData);

                  // Update selected item so modal reflects it if it stays open
                  if (selected) {
                    setSelected({ ...selected, keterangan: editKeterangan });
                  }

                  setShowEditKeteranganDialog(false);

                  const tId = showToast.loading("Menyimpan perubahan...");
                  try {
                    // Update with current status to only change detail
                    await updateStatusPendaftaranUjian(found.id, found.status, editKeterangan);
                    showToast.dismiss(tId);
                    showToast.success("Keterangan berhasil diperbarui");

                    await revalidateAction("/sekprodi/pendaftaran-ujian");
                    // router.refresh(); // Removed: causes status to revert due to stale cache
                  } catch (error) {
                    showToast.dismiss(tId);
                    showToast.error("Gagal menyimpan perubahan");
                    setLocalData(previousData);
                    if (previousSelected) setSelected(previousSelected);
                  } finally {
                    setIsEditingKeterangan(false);
                  }
                } else {
                  setIsEditingKeterangan(false);
                  setShowEditKeteranganDialog(false);
                  showToast.error("Data pendaftaran tidak ditemukan");
                }
              }}
            >
              {isEditingKeterangan ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DataCard >
  );
}


