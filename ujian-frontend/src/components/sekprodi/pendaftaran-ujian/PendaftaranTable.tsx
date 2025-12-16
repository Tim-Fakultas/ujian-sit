"use client";

import {
  useState,
  useEffect,
  useActionState,
  useMemo,
} from "react";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


import {
  Search,
  X,
 
  CheckCircle2,
  Settings2,
  List,
  LayoutGrid,
  Eye,
  FileText,
} from "lucide-react";
import { getMahasiswaById } from "@/actions/data-master/mahasiswa";
import { getJenisUjianColor, getStatusColor } from "@/lib/utils";
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
} from "@/components/ui/dialog";

export default function PendaftaranUjianTable({
  pendaftaranUjianList,
}: {
  pendaftaranUjianList: PendaftaranUjian[];
}) {
  const [selected, setSelected] = useState<PendaftaranUjian | null>(null);

  type MahasiswaDetail = {
    id: number | string;
    nama: string;
    pembimbing1?: { id: number | string; nama: string };
    pembimbing2?: { id: number | string; nama: string };
  };

  const [mahasiswaDetail, setMahasiswaDetail] =
    useState<MahasiswaDetail | null>(null);

  
  const [showBerkasModal, setShowBerkasModal] = useState(false);

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
    { value: "ditolak", label: "Ditolak" },
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
  const [filterNama, setFilterNama] = useState("");
  const [filterJenis, setFilterJenis] = useState<string>("all");

  // react-table states (for TableGlobal)
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  // helper: tampilkan label sorting saat ini

  // Filtered data
  const filteredData = useMemo(() => {
    return pendaftaranUjianList.filter((u) => {
      const matchNama = u.mahasiswa.nama
        .toLowerCase()
        .includes(filterNama.toLowerCase());
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
      return matchNama && matchJenis && matchStatus;
    });
  }, [filterNama, filterOption]);

  // Ambil berkas dari pendaftaranUjianList yang cocok dengan mahasiswa & jenis ujian
  const getBerkasForSelected = () => {
    if (!selected) return [];
    // Cari pendaftaran ujian yang cocok
    const found = pendaftaranUjianList.find(
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
        accessorFn: (row) => row.ranpel.judulPenelitian ?? "-",
        id: "judul",
        header: "Judul",
        cell: ({ row }) => (
          <div className="max-w-[180px] truncate">{row.getValue("judul")}</div>
        ),
        size: 200, 
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
          const found = pendaftaranUjianList.find(
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
          const found = pendaftaranUjianList.find(
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
    [pendaftaranUjianList]
  );

  // create react-table instance used by TableGlobal
  const table = useReactTable({
    data: pendaftaranUjianList,
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

  // Add viewMode state
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  
  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow">
      {/* Filter Bar - match admin design */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex flex-row items-center gap-2 w-full">
          {/* Search */}
          <div className="relative flex-1 flex items-center min-w-0">
            <Input
              placeholder="Search"
              value={filterNama}
              onChange={(e) => setFilterNama(e.target.value)}
              className="pl-9 w-full bg-white dark:bg-[#1f1f1f]"
              aria-label="Search"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>
          </div>
          {/* Gabungan filter status/jenis */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-9 px-3 rounded-lg border flex items-center gap-2"
                aria-label="Filter Status/Jenis"
              >
                <Settings2 size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px]">
              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                Status
              </div>
              {statusOptions.map((opt) => (
                <DropdownMenuItem
                  key={"status-" + opt.value}
                  onClick={() =>
                    setFilterOption({ type: "status", value: opt.value })
                  }
                  className="flex items-center justify-between gap-2"
                >
                  <span className="text-sm">{opt.label}</span>
                  {filterOption.type === "status" &&
                    filterOption.value === opt.value && (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    )}
                </DropdownMenuItem>
              ))}
              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-t border-muted">
                Jenis Ujian
              </div>
              {jenisUjianOptions.map((opt) => (
                <DropdownMenuItem
                  key={"jenis-" + opt.value}
                  onClick={() =>
                    setFilterOption({ type: "jenis", value: opt.value })
                  }
                  className="flex items-center justify-between gap-2"
                >
                  <span className="text-sm">{opt.label}</span>
                  {filterOption.type === "jenis" &&
                    filterOption.value === opt.value && (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Tabs for view mode */}
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as "table" | "card")}
          >
            <TabsList>
              <TabsTrigger value="table">
                <LayoutGrid size={16} />
              </TabsTrigger>
              <TabsTrigger value="card">
                <List size={16} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Table/Card View */}
      <Tabs
        value={viewMode}
        onValueChange={(v) => setViewMode(v as "table" | "card")}
      >
        <TabsContent value="table">
          <TableGlobal table={table} cols={cols} />
        </TabsContent>
        <TabsContent value="card">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredData.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 col-span-full">
                Tidak ada data.
              </div>
            ) : (
              filteredData.map((p) => {
                const status =
                  pendaftaranUjianList.find(
                    (p) =>
                      p.mahasiswa.id === p.mahasiswa.id &&
                      p.jenisUjian.id === p.jenisUjian.id
                  )?.status ??
                  p.status   ??
                  "";
                return (
                  <div
                    key={p.id}
                    className="border rounded-lg bg-white dark:bg-neutral-800 shadow-sm flex flex-col"
                  >
                    <div className="p-4 flex flex-col gap-2">
                      <div className="font-semibold text-base leading-tight">
                        {p.mahasiswa.nama}
                      </div>
                      <div className="text-xs text-muted-foreground mb-1 leading-none">
                        {p.mahasiswa.nim}
                      </div>
                      <div>
                        <span className="font-medium block mb-1">Judul:</span>
                        <div className="whitespace-pre-line break-words text-sm leading-relaxed max-h-16 overflow-hidden">
                          {p.ranpel.judulPenelitian}
                        </div>
                      </div>
                      <div className="flex flex-row items-center gap-2 mt-2">
                        <span className="font-medium">Jenis:</span>
                        <span
                          className={`px-2 py-0.5 text-xs rounded font-semibold ${getJenisUjianColor(
                            p.jenisUjian.namaJenis
                          )}`}
                        >
                          {p.jenisUjian.namaJenis}
                        </span>
                      </div>
                      <div className="flex flex-row items-center gap-2">
                        <span className="font-medium">Status:</span>
                        <span
                          className={`px-2 py-0.5 text-xs rounded font-semibold ${getStatusColor(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>

   

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

                {/* Buttons Action in Header */}
                <div className="flex flex-row gap-2">
                   <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all font-medium h-8 text-xs"
                      onClick={async () => {
                        const found = pendaftaranUjianList.find(
                          (p) =>
                            p.mahasiswa.id === selected?.mahasiswa.id &&
                            p.jenisUjian.id === selected?.jenisUjian.id
                        );
                        if (found) {
                          const tId = showToast.loading("Menolak berkas...");
                          try {
                            await updateStatusPendaftaranUjian(found.id, "ditolak");
                            showToast.dismiss(tId);
                            showToast.success("Berkas ditolak");
                            revalidateAction("/sekprodi/daftar-ujian");
                            setShowBerkasModal(false);
                          } catch (error) {
                            showToast.dismiss(tId);
                            showToast.error("Gagal menolak berkas");
                          }
                        } else {
                          showToast.error("Data pendaftaran tidak ditemukan");
                        }
                      }}
                    >
                      Tolak
                    </Button>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200 dark:shadow-none transition-all font-medium h-8 text-xs"
                      onClick={async () => {
                        const found = pendaftaranUjianList.find(
                          (p) =>
                            p.mahasiswa.id === selected?.mahasiswa.id &&
                            p.jenisUjian.id === selected?.jenisUjian.id
                        );
                        if (found) {
                          const tId = showToast.loading("Memverifikasi berkas...");
                          try {
                            await updateStatusPendaftaranUjian(
                              found.id,
                              "belum dijadwalkan"
                            );
                            showToast.dismiss(tId);
                            showToast.success("Berkas terverifikasi");
                            revalidateAction("/sekprodi/daftar-ujian");
                            setShowBerkasModal(false);
                          } catch (error) {
                            showToast.dismiss(tId);
                            showToast.error("Gagal memverifikasi berkas");
                          }
                        } else {
                          showToast.error("Data pendaftaran tidak ditemukan");
                        }
                      }}
                    >
                      Verifikasi
                    </Button>
                </div>
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

          {selected && (
            <>
                <div className="p-6 overflow-y-auto">
                  <div className="space-y-3">
                    {getBerkasForSelected().length > 0 ? (
                      getBerkasForSelected().map((file, idx) => {
                        const apiUrl =
                          process.env.NEXT_PUBLIC_STORAGE_URL || "";
                        const fileUrl = `${apiUrl}/storage/${file.filePath}`;
                        // Tentukan label berdasarkan jenis ujian
                        const jenis =
                          selected.jenisUjian.namaJenis.toLowerCase();
                        let label = "";
                        if (jenis.includes("proposal")) {
                          label =
                            LABELS_PROPOSAL[idx] ||
                            file.namaBerkas ||
                            fileUrl.split("/").pop() ||
                            "";
                        } else if (jenis.includes("hasil")) {
                          label =
                            LABELS_HASIL[idx] ||
                            file.namaBerkas ||
                            fileUrl.split("/").pop() ||
                            "";
                        } else {
                          label =
                            file.namaBerkas || fileUrl.split("/").pop() || "";
                        }
                        return (
                          <div
                            key={file.id ?? idx}
                            className="group flex items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                <FileText size={20} />
                              </div>
                              <div className="min-w-0 flex flex-col gap-0.5">
                                <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 line-clamp-1">
                                  {label}
                                </span>
                                <a
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 truncate max-w-[300px] hover:underline"
                                  title={
                                    file.namaBerkas || fileUrl.split("/").pop()
                                  }
                                >
                                  {file.namaBerkas || fileUrl.split("/").pop()}
                                </a>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-900 dark:text-gray-100 font-medium shrink-0"
                              onClick={() => window.open(fileUrl, "_blank")}
                            >
                              Lihat
                            </Button>
                          </div>
                        );
                      })
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
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Tambahkan mapping label untuk semua jenis berkas proposal & hasil
const LABELS_PROPOSAL = [
  "Transkrip Nilai",
  "Pengesahan Proposal",
  "Surat Keterangan Lulus Plagiasi",
  "Proposal Skripsi",
  "Form Perbaikan Proposal untuk ujian ke-2, 3 dst.",
  "Lulus mata kuliah Metodologi Penelitian (minimal C)",
  "SKS yang telah ditempuh minimal >= 100 sks",
  "IPK >= 2.00",
  "Transkrip nilai sementara yang dilegalisir",
  "Formulir pengajuan judul dan pembimbing skripsi yang telah ditandatangani Koordinator Skripsi dan Ketua Program Studi",
  "Halaman pengesahan proposal skripsi yang di tanda tangani Pembimbing dan Ketua Program Studi",
];

const LABELS_HASIL = [
  "Surat Keterangan Lulus Cek Plagiat",
  "File Hasil Skripsi Lengkap (PDF, email si@radenfatah.ac.id, Nama-NIM-Hasil)",
  "Formulir Perbaikan Proposal Skripsi",
  "Form Perbaikan Hasil untuk ujian ke-2, 3 dst.",
  "Bukti hafalan 10 surat Juz 'Amma",
  "Ijazah SMA/MA",
  "Sertifikat KKN",
  "Bukti hadir dalam seminar proposal",
  "Halaman Pengesahan Skripsi untuk ujian hasil yang ditanda tangani Pembimbing dan Ketua Program Studi",
  "Formulir Mengikuti Ujian Hasil",
  "Bukti pembayaran SPP semester berjalan",
  "KST yang tercantum Skripsi",
  "Transkrip nilai sementara yang dilegalisir",
  "Surat Keterangan Lulus Ujian Seminar Proposal",
  "Bukti lulus ujian BTA (sertifikat BTA)",
  "Bukti lulus TOEFL >= 400",
];
