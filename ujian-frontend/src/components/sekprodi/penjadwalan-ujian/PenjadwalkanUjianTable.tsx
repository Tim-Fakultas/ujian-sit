/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useMemo, useEffect } from "react";
import TableGlobal from "@/components/tableGlobal";
import { DataTableFilter } from "@/components/common/DataTableFilter";
import { Ujian } from "@/types/Ujian";
import { DosenCombobox } from "@/components/common/DosenCombobox";
import { RuanganCombobox } from "@/components/common/RuanganCombobox";
import { Button } from "@/components/ui/button";
import {
  Eye,
  MoreHorizontal,
  Check,
  LayoutGrid,
  List,
  Settings2,
  CalendarClock,
  ArrowLeftRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { daftarKehadiran } from "@/types/DaftarKehadiran";
import { Input } from "@/components/ui/input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getJenisUjianColor, getStatusColor } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,

} from "@/components/ui/dropdown-menu";
import {
  setUjianSelesai,
  setUjianDijadwalkan,
  setUjianBelumDijadwalkan,
  getPreviousUjian,
} from "@/actions/jadwalUjian";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataCard } from "@/components/common/DataCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useActionState, useTransition } from "react";
import { jadwalkanUjianAction } from "@/actions/jadwalUjian";
import revalidateAction from "@/actions/revalidate";
import { showToast } from "@/components/ui/custom-toast";
import { getMahasiswaById } from "@/actions/data-master/mahasiswa";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { Dosen } from "@/types/Dosen";
import { Ruangan } from "@/types/Ruangan";

export default function PenjadwalkanUjianTable({
  jadwalUjian,
  daftarHadir,
  dosen,
  ruanganList,
}: {
  jadwalUjian: Ujian[];
  daftarHadir: daftarKehadiran[] | null;
  dosen: Dosen[];
  ruanganList: Ruangan[];
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState<Ujian | null>(null);

  // Tambahkan state untuk dialog detail ujian
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<Ujian | null>(null);

  const [openDaftarHadir, setOpenDaftarHadir] = useState(false);
  const [selectedDaftarHadir, setSelectedDaftarHadir] = useState<Ujian | null>(
    null
  );



  // --- Start Logic Modal Jadwal (from PendaftaranTable) ---
  type MahasiswaDetail = {
    id: number | string;
    nama: string;
    pembimbing1?: { id: number | string; nama: string };
    pembimbing2?: { id: number | string; nama: string };
  };

  const [mahasiswaDetail, setMahasiswaDetail] =
    useState<MahasiswaDetail | null>(null);
  const [penguji1, setPenguji1] = useState<number | null>(null);
  const [penguji2, setPenguji2] = useState<number | null>(null);
  const [ketuaPenguji, setKetuaPenguji] = useState<number | null>(null);
  const [sekretarisPenguji, setSekretarisPenguji] = useState<number | null>(null);
  const [ruangan, setRuangan] = useState<string>("");
  const [waktuMulai, setWaktuMulai] = useState("");
  const [waktuSelesai, setWaktuSelesai] = useState("");
  const [showJadwalModal, setShowJadwalModal] = useState(false);

  useEffect(() => {
    if (selected) {
      getMahasiswaById(Number(selected.mahasiswa.id)).then((res) =>
        setMahasiswaDetail(res?.data || null)
      );
    }
  }, [selected]);

  type JadwalkanUjianState = {
    success: boolean;
    message: string;
  };

  const jadwalkanUjianReducer = async (
    state: JadwalkanUjianState,
    formData: FormData
  ): Promise<JadwalkanUjianState> => {
    const result = await jadwalkanUjianAction(formData);
    revalidateAction("/sekprodi/penjadwalan-ujian");
    return {
      success: result?.success ?? false,
      message:
        result && "message" in result && typeof result.message === "string"
          ? result.message
          : "",
    };
  };

  const [state, formAction] = useActionState(jadwalkanUjianReducer, {
    success: false,
    message: "",
  });

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!state) return;
    (async () => {
      if (state.success) {
        showToast.success("Ujian berhasil dijadwalkan!");
        setShowJadwalModal(false);
        // Jangan reset selected disini jika digunakan untuk modal lain, tapi karena modal jadwal menutup, aman.
        // setSelected(null);
      } else if (state.message) {
        showToast.error(state.message);
      }
    })();
  }, [state]);


  useEffect(() => {
    // Hanya jalankan logika jika modal jadwal terbuka dan data 'selected' tersedia
    if (!showJadwalModal || !selected?.mahasiswa?.id) return;

    const init = async () => {
      try {
        // Mengambil ID mahasiswa secara dinamis dari baris yang diklik
        const mahasiswaId = Number(selected.mahasiswa.id);

        // Memanggil action untuk mendapatkan riwayat Ujian Proposal yang sudah Lulus
        const history = await getPreviousUjian(mahasiswaId);

        if (Array.isArray(history) && history.length > 0) {
          // history[0] adalah hasil filter Ujian Proposal dari server action
          const prevProposal = history[0];

          if (prevProposal.penguji) {
            // Mencari penguji berdasarkan peran (role) yang ada di data JSON
            const p1 = prevProposal.penguji.find(p => p.peran === "penguji_1");
            const p2 = prevProposal.penguji.find(p => p.peran === "penguji_2");
            const ketua = prevProposal.penguji.find(p => p.peran === "ketua_penguji");
            const sekre = prevProposal.penguji.find(p => p.peran === "sekretaris_penguji");

            // Mengisi state ID untuk value pada Combobox
            if (p1) setPenguji1(Number(p1.id));
            if (p2) setPenguji2(Number(p2.id));
            if (ketua) setKetuaPenguji(Number(ketua.id));
            if (sekre) setSekretarisPenguji(Number(sekre.id));


            console.log(`Berhasil memuat penguji proposal untuk mahasiswa ID: ${mahasiswaId}`);
          }
        }
      } catch (err) {
        console.error("Gagal memuat history ujian:", err);
      }
    };

    init();
    // Dependency array memastikan data diperbarui setiap kali modal dibuka atau baris dipilih
  }, [showJadwalModal, selected]);
  const handleJadwal = (u: Ujian) => {
    setSelected(u);
    setShowJadwalModal(true);
  };
  // --- End Logic Modal Jadwal ---

  const [filterNama, setFilterNama] = useState("");
  const [filterJenis, setFilterJenis] = useState("all");
  const [openFilter, setOpenFilter] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  // daftar ujian yg ditandai selesai (lokal/optimistic)
  const [completedIds, setCompletedIds] = useState<number[]>([]);

  const [sortField, setSortField] = useState<"nama" | "judul" | "waktu" | null>(
    null
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [viewMode, setViewMode] = useState<string>("table");

  // Ubah state statusTab ke "all" | "dijadwalkan" | "selesai" | "belum_dijadwalkan"
  const [statusTab, setStatusTab] = useState<
    "all" | "dijadwalkan" | "selesai" | "belum_dijadwalkan"
  >("all");

  const filteredData = useMemo(() => {
    let data = jadwalUjian.filter((ujian) => {
      // Filter status ujian sesuai tab
      if (statusTab === "dijadwalkan") {
        if (
          completedIds.includes(ujian.id) ||
          ujian.pendaftaranUjian.status === "selesai"
        )
          return false;
      } else if (statusTab === "selesai") {
        if (
          !(
            completedIds.includes(ujian.id) ||
            ujian.pendaftaranUjian.status === "selesai"
          )
        )
          return false;
      } else if (statusTab === "belum_dijadwalkan") {
        if (
          ujian.pendaftaranUjian.status === "dijadwalkan" ||
          ujian.pendaftaranUjian.status === "selesai" ||
          completedIds.includes(ujian.id)
        ) {
          return false;
        }
      }

      const matchNama = ujian.mahasiswa.nama
        .toLowerCase()
        .includes(filterNama.toLowerCase());

      const matchJenis =
        filterJenis === "all"
          ? true
          : ujian.jenisUjian.namaJenis === filterJenis;

      return matchNama && matchJenis;
    });

    if (sortField) {
      data = [...data].sort((a, b) => {
        if (sortField === "nama") {
          const namaA = a.mahasiswa.nama.toLowerCase();
          const namaB = b.mahasiswa.nama.toLowerCase();
          if (namaA < namaB) return sortOrder === "asc" ? -1 : 1;
          if (namaA > namaB) return sortOrder === "asc" ? 1 : -1;
          return 0;
        }

        if (sortField === "judul") {
          const judulA = (a.judulPenelitian || "").toLowerCase();
          const judulB = (b.judulPenelitian || "").toLowerCase();
          if (judulA < judulB) return sortOrder === "asc" ? -1 : 1;
          if (judulA > judulB) return sortOrder === "asc" ? 1 : -1;
          return 0;
        }

        if (sortField === "waktu") {
          const tglA = new Date(a.jadwalUjian).getTime();
          const tglB = new Date(b.jadwalUjian).getTime();
          if (tglA < tglB) return sortOrder === "asc" ? -1 : 1;
          if (tglA > tglB) return sortOrder === "asc" ? 1 : -1;
          return 0;
        }

        return 0;
      });
    }

    return data;
  }, [
    jadwalUjian,
    filterNama,
    filterJenis,
    sortField,
    sortOrder,
    statusTab,
    completedIds,
  ]);

  // ===========================================
  // Pagination
  // ===========================================
  const totalPage = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    setPage(1);
  }, [filterNama, filterJenis]);

  useEffect(() => {
    if (page > totalPage) {
      setPage(totalPage || 1);
    }
  }, [totalPage, page]);

  async function handleToggleStatusUjian(ujian: Ujian) {
    try {
      if (completedIds.includes(ujian.id)) {
        await setUjianDijadwalkan(ujian.pendaftaranUjian.id);
        setCompletedIds((prev) => prev.filter((id) => id !== ujian.id));
        showToast.success("Status ujian dikembalikan ke Dijadwalkan");
      } else {
        await setUjianSelesai(ujian.pendaftaranUjian.id);
        setCompletedIds((prev) => [...prev, ujian.id]);
        showToast.success("Berhasil menandai ujian selesai");
      }
    } catch (error) {
      console.error(error);
      showToast.error("Gagal mengubah status ujian");
    }
  }

  async function handleStatusChange(
    ujian: Ujian,
    status: "belum dijadwalkan" | "dijadwalkan" | "selesai"
  ) {
    try {
      if (status === "belum dijadwalkan") {
        await setUjianBelumDijadwalkan(ujian.pendaftaranUjian.id);
        // Remove from completed if needed
        setCompletedIds((prev) => prev.filter((id) => id !== ujian.id));
        showToast.success("Status diubah menjadi Belum Dijadwalkan");
      } else if (status === "dijadwalkan") {
        await setUjianDijadwalkan(ujian.pendaftaranUjian.id);
        setCompletedIds((prev) => prev.filter((id) => id !== ujian.id));
        showToast.success("Status diubah menjadi Dijadwalkan");
      } else if (status === "selesai") {
        await setUjianSelesai(ujian.pendaftaranUjian.id);
        if (!completedIds.includes(ujian.id)) {
          setCompletedIds((prev) => [...prev, ujian.id]);
        }
        showToast.success("Status diubah menjadi Selesai");
      }
    } catch (error) {
      console.error(error);
      showToast.error("Gagal mengubah status ujian");
    }
  }

  function cekHadir(dosenId: number) {
    if (!daftarHadir || !selected) return false;

    return daftarHadir.some(
      (d) =>
        d.dosenId === dosenId &&
        d.statusKehadiran === "hadir" &&
        d.ujianId === selected.id
    );
  }

  // Table columns for TableGlobal
  const cols = [
    {
      id: "no",
      header: "No",
      cell: ({ row, table }: any) => {
        const index =
          (table.getState().pagination?.pageIndex ?? 0) *
          (table.getState().pagination?.pageSize ?? 10) +
          row.index +
          1;
        return <div className="text-center">{index}</div>;
      },
      size: 36,
    },
    {
      accessorFn: (row: Ujian) => row.mahasiswa.nama ?? "-",
      id: "nama",
      header: "Nama Mahasiswa",
      cell: ({ row }: any) => (
        <div>
          {row.getValue("nama")}
          <div className="text-xs  text-muted-foreground">
            {row.original.mahasiswa.nim}
          </div>
        </div>
      ),
      size: 10,
    },
    {
      accessorFn: (row: Ujian) => row.judulPenelitian ?? "-",
      id: "judul",
      header: "Judul Penelitian",
      cell: ({ row }: any) => (
        <div className="text-sm  max-w-[180px] truncate">
          {row.getValue("judul")}
        </div>
      ),
      size: 180,
    },
    {
      accessorFn: (row: Ujian) => row.jenisUjian.namaJenis ?? "-",
      id: "jenis",
      header: "Jenis Ujian",
      cell: ({ row }: any) => (
        <span
          className={`text-xs  text-sm rounded font-semibold inline-block ${getJenisUjianColor(
            String(row.getValue("jenis"))
          )}`}
        >
          {row.getValue("jenis")}
        </span>
      ),
      size: 90,
    },
    {
      accessorFn: (row: Ujian) => row.pendaftaranUjian?.status ?? "-",
      id: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <span
          className={`text-xs px-2 py-1 text-sm rounded font-semibold inline-block ${getStatusColor(
            String(row.getValue("status"))
          )}`}
        >
          {row.getValue("status")}
        </span>
      ),
      size: 100,
    },

    {
      id: "actions",
      header: "",
      cell: ({ row }: any) => {
        const ujian = row.original;
        const isSelesai =
          completedIds.includes(ujian.id) ||
          ujian.pendaftaranUjian.status === "selesai";
        return (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleJadwal(ujian)}
              className="hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 gap-1.5 px-2"
              aria-label={
                isSelesai || ujian.pendaftaranUjian.status === "dijadwalkan"
                  ? "Edit Jadwal"
                  : "Jadwalkan"
              }
            >
              <CalendarClock size={14} />
              <span className="text-xs font-medium">
                {isSelesai || ujian.pendaftaranUjian.status === "dijadwalkan"
                  ? "Edit"
                  : "Jadwalkan"}
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                  title="Ubah Status Manual"
                >
                  <ArrowLeftRight size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-gray-50 dark:bg-neutral-800/50 mb-1 rounded-sm">
                  Ubah Status ke:
                </div>
                <DropdownMenuItem
                  onClick={() => handleStatusChange(ujian, "belum dijadwalkan")}
                >
                  <span className="text-xs">Belum Dijadwalkan</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusChange(ujian, "dijadwalkan")}
                >
                  <span className="text-xs">Dijadwalkan</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleStatusChange(ujian, "selesai")}
                  className="text-blue-600 focus:text-blue-700"
                >
                  <span className="text-xs font-semibold">Tandai Selesai</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      size: 90,
    },
  ];

  // TableGlobal setup
  const table = {
    getRowModel: () => ({
      rows: paginatedData.map((item, idx) => ({
        id: item.id,
        index: idx,
        original: item,
        getVisibleCells: () =>
          cols.map((col) => ({
            id: col.id,
            column: { columnDef: col },
            getContext: () => ({
              row: {
                index: idx,
                original: item,
                getValue: (key: string) => {
                  if (col.accessorFn) return col.accessorFn(item);
                  // Hindari error TS dengan casting ke any
                  return (item as any)[key];
                },
              },
              table,
            }),
          })),
        getIsSelected: () => false,
      })),
    }),
    getHeaderGroups: () => [
      {
        id: "main",
        headers: cols.map((col) => ({
          id: col.id,
          isPlaceholder: false,
          column: { columnDef: col },
          getContext: () => ({ table }),
        })),
      },
    ],
    previousPage: () => setPage((p) => Math.max(1, p - 1)),
    nextPage: () => setPage((p) => Math.min(totalPage, p + 1)),
    getCanPreviousPage: () => page > 1,
    getCanNextPage: () => page < totalPage,
    getFilteredRowModel: () => ({
      rows: filteredData.map((item, idx) => ({
        id: item.id,
        index: idx,
        original: item,
        getVisibleCells: () =>
          cols.map((col) => ({
            id: col.id,
            column: { columnDef: col },
            getContext: () => ({
              row: {
                index: idx,
                original: item,
                getValue: (key: string) => {
                  if (col.accessorFn) return col.accessorFn(item);
                  // Hindari error TS dengan casting ke any
                  return (item as any)[key];
                },
              },
              table,
            }),
          })),
        getIsSelected: () => false,
      })),
    }),
    getPreFilteredRowModel: () => ({
      rows: jadwalUjian.map((item, idx) => ({
        id: item.id,
        index: idx,
        original: item,
        getVisibleCells: () =>
          cols.map((col) => ({
            id: col.id,
            column: { columnDef: col },
            getContext: () => ({
              row: {
                index: idx,
                original: item,
                getValue: (key: string) => {
                  if (col.accessorFn) return col.accessorFn(item);
                  // Hindari error TS dengan casting ke any
                  return (item as any)[key];
                },
              },
              table,
            }),
          })),
        getIsSelected: () => false,
      })),
    }),
    getState: () => ({
      pagination: { pageIndex: page - 1, pageSize },
    }),
    getPageCount: () => totalPage,
    setPageIndex: (p: number) => setPage(p + 1),
  };

  return (
    <DataCard>
      {/* Header bar: Search, Filter, View Mode */}
      <DataTableFilter
        searchValue={filterNama}
        onSearchChange={setFilterNama}
        viewMode={viewMode as "table" | "card"}
        onViewModeChange={setViewMode}
        searchPlaceholder="Search Name..."
        className="mb-2"
      >
        <div className="p-1 space-y-3">
          <div>
            <div className="font-semibold text-xs mb-2 text-muted-foreground">
              Status
            </div>
            <div className="flex flex-col gap-1">
              {["all", "dijadwalkan", "selesai", "belum_dijadwalkan"].map(
                (item) => (
                  <Button
                    key={item}
                    variant={statusTab === item ? "secondary" : "ghost"}
                    size="sm"
                    className={`w-full justify-between rounded-md text-left h-8 px-2 ${statusTab === item
                      ? "font-semibold bg-gray-100 dark:bg-neutral-800"
                      : ""
                      }`}
                    onClick={() => {
                      setStatusTab(
                        item as
                        | "all"
                        | "dijadwalkan"
                        | "selesai"
                        | "belum_dijadwalkan"
                      );
                    }}
                  >
                    <span className="text-sm">
                      {item === "all"
                        ? "Semua"
                        : item === "belum_dijadwalkan"
                          ? "Belum Dijadwalkan"
                          : item.charAt(0).toUpperCase() + item.slice(1)}
                    </span>
                    {statusTab === item && (
                      <Check size={14} className="ml-2 text-emerald-500" />
                    )}
                  </Button>
                )
              )}
            </div>
          </div>

          <div>
            <div className="font-semibold text-xs mb-2 text-muted-foreground">
              Jenis Ujian
            </div>
            <div className="flex flex-col gap-1">
              {["all", "Ujian Proposal", "Ujian Hasil", "Ujian Skripsi"].map(
                (item) => (
                  <Button
                    key={item}
                    variant={filterJenis === item ? "secondary" : "ghost"}
                    size="sm"
                    className={`w-full justify-between rounded-md text-left h-8 px-2 ${filterJenis === item
                      ? "font-semibold bg-gray-100 dark:bg-neutral-800"
                      : ""
                      }`}
                    onClick={() => setFilterJenis(item)}
                  >
                    <span className="text-sm">
                      {item === "all" ? "Semua" : item}
                    </span>
                    {filterJenis === item && (
                      <Check size={14} className="ml-2 text-emerald-500" />
                    )}
                  </Button>
                )
              )}
            </div>
          </div>

        </div>
      </DataTableFilter>

      {/* Table/Card View */}
      <Tabs value={viewMode} onValueChange={setViewMode}>
        <TabsContent value="table">
          <TableGlobal table={table} cols={cols} />
        </TabsContent>
        <TabsContent value="card">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedData.length === 0 ? (
              <div className="text-center text-muted-foreground py-12 col-span-full flex flex-col items-center gap-3">
                <div className="p-4 rounded-full bg-gray-50 dark:bg-neutral-800">
                  <List size={24} className="opacity-50" />
                </div>
                <p>Tidak ada data ujian yang ditemukan.</p>
              </div>
            ) : (
              paginatedData.map((ujian) => {
                const isSelesai =
                  completedIds.includes(ujian.id) ||
                  ujian.pendaftaranUjian.status === "selesai";
                const jenisColor = getJenisUjianColor(
                  ujian.jenisUjian.namaJenis
                );

                return (
                  <div
                    key={ujian.id}
                    className={`group relative bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col`}
                  >
                    <div className="p-5 flex flex-col gap-4 flex-1">
                      {/* Header: Date & Status */}
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                            <CalendarClock size={13} />
                            <span>
                              {ujian.jadwalUjian
                                ? new Date(
                                  ujian.jadwalUjian
                                ).toLocaleDateString("id-ID", {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                                : "Belum dijadwalkan"}
                            </span>
                          </div>
                          <div className="text-xs font-medium text-gray-400">
                            {ujian.waktuMulai?.slice(0, 5)} -{" "}
                            {ujian.waktuSelesai?.slice(0, 5)} WIB
                          </div>
                        </div>

                        {isSelesai ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            Selesai
                          </span>
                        ) : (
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${ujian.pendaftaranUjian.status === "dijadwalkan"
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300 border-blue-100 dark:border-blue-800"
                              : "bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400 border-gray-200 dark:border-neutral-700"
                              }`}
                          >
                            {ujian.pendaftaranUjian.status}
                          </span>
                        )}
                      </div>

                      {/* Content: Title & Name */}
                      <div className="space-y-2">
                        <h3
                          className="font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2"
                          title={ujian.judulPenelitian}
                        >
                          {ujian.judulPenelitian || "Judul belum tersedia"}
                        </h3>

                        <div className="flex items-center gap-2 pt-1">
                          <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                            {ujian.mahasiswa.nama.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[180px]">
                              {ujian.mahasiswa.nama}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {ujian.mahasiswa.nim}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Exam Type & Room */}
                      <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-100 dark:border-neutral-800">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${jenisColor}`}
                        >
                          {ujian.jenisUjian.namaJenis}
                        </span>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                          {ujian.ruangan?.namaRuangan || "Ruangan -"}
                        </span>
                      </div>
                    </div>

                    {/* Actions Footer - Adapting for Scheduling Context */}
                    <div className="bg-gray-50/50 dark:bg-neutral-800/50 p-3 flex items-center justify-between border-t border-gray-100 dark:border-neutral-800">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleJadwal(ujian)}
                        className="text-xs h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                      >
                        <CalendarClock size={14} className="mr-1.5" />
                        {ujian.pendaftaranUjian.status === "dijadwalkan"
                          ? "Edit Jadwal"
                          : "Jadwalkan"}
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                          >
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* Scheduling actions usually don't have View Detail or Mark Complete here based on table logic, but Table view has Mark Complete. 
                                Checking table logic: it DOES have Mark Complete in Dropdown. */}
                          <DropdownMenuItem
                            onClick={() => handleToggleStatusUjian(ujian)}
                          >
                            {isSelesai ? (
                              <>
                                <span className="mr-2 text-blue-500">↩</span>{" "}
                                Set Dijadwalkan
                              </>
                            ) : (
                              <>
                                <Check
                                  size={14}
                                  className="mr-2 text-emerald-500"
                                />{" "}
                                Tandai Selesai
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog Detail Penguji */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md p-0 max-h-[90vh] overflow-hidden rounded-2xl shadow-sm">
          <DialogHeader>
            <DialogTitle className="font-semibold px-6 pt-6 pb-2 text-lg flex items-center gap-2">
              <Eye size={20} className="text-blue-500" />
              Daftar Penguji
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6">
            {selected && (
              <div className="flex flex-col gap-3">
                {selected.penguji.map((penguji, i) => {
                  const roleMap: Record<string, string> = {
                    ketua_penguji: "Ketua Penguji",
                    sekretaris_penguji: "Sekretaris Penguji",
                    penguji_1: "Penguji I",
                    penguji_2: "Penguji II",
                  };
                  const label = roleMap[penguji.peran] || penguji.peran;
                  const hadir = cekHadir(penguji.id);
                  const initials = penguji.nama
                    ? penguji.nama
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()
                    : "?";

                  return (
                    <div
                      key={penguji.id}
                      className="group flex items-center justify-between p-3 sm:p-4 rounded-xl border bg-white dark:bg-neutral-900 border-gray-100 dark:border-neutral-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm border border-blue-100 dark:border-blue-800">
                          {initials}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-tight">
                            {penguji.nama}
                          </span>
                          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-neutral-600" />
                            {label}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center pl-2">
                        {hadir ? (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 shadow-sm">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wide hidden sm:inline-block">
                              Hadir
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900 shadow-sm opacity-80 group-hover:opacity-100 transition-opacity">
                            <div className="h-2 w-2 rounded-full bg-rose-500" />
                            <span className="text-[10px] font-bold uppercase tracking-wide hidden sm:inline-block">
                              Tidak Hadir
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Detail Ujian */}
      <Dialog open={openDetailDialog} onOpenChange={setOpenDetailDialog}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-2xl shadow-lg border bg-white dark:bg-neutral-900">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 px-6 pt-6 pb-2 text-lg font-bold text-blue-700 dark:text-blue-400">
              <Eye size={20} className="text-blue-500" />
              Detail Ujian
            </DialogTitle>
          </DialogHeader>
          {selectedDetail && (
            <div className="px-6 pb-6 pt-2 overflow-auto max-h-[65vh]">
              <div className="space-y-3">
                <div>
                  <span className="block text-xs text-muted-foreground font-medium mb-1">
                    Nama Mahasiswa
                  </span>
                  <span className="font-semibold text-base">
                    {selectedDetail.mahasiswa.nama}
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    {selectedDetail.mahasiswa.nim}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-muted-foreground font-medium mb-1">
                    Judul Penelitian
                  </span>
                  <span className="font-medium text-sm leading-relaxed">
                    {selectedDetail.judulPenelitian}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div>
                    <span className="block text-xs text-muted-foreground font-medium mb-1">
                      Jenis Ujian
                    </span>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${getJenisUjianColor(
                        selectedDetail.jenisUjian.namaJenis
                      )}`}
                    >
                      {selectedDetail.jenisUjian.namaJenis}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-muted-foreground font-medium mb-1">
                      Status
                    </span>
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
                      {selectedDetail.pendaftaranUjian.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div>
                    <span className="block text-xs text-muted-foreground font-medium mb-1">
                      Hari Ujian
                    </span>
                    <span className="font-medium text-sm">
                      {selectedDetail.hariUjian ?? "-"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-muted-foreground font-medium mb-1">
                      Tanggal Ujian
                    </span>
                    <span className="font-medium text-sm">
                      {selectedDetail.jadwalUjian
                        ? new Date(
                          selectedDetail.jadwalUjian
                        ).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                        : "-"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-muted-foreground font-medium mb-1">
                      Waktu
                    </span>
                    <span className="font-medium text-sm">
                      {selectedDetail.waktuMulai?.slice(0, 5)} -{" "}
                      {selectedDetail.waktuSelesai?.slice(0, 5)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-muted-foreground font-medium mb-1">
                      Ruangan
                    </span>
                    <span className="font-medium text-sm">
                      {selectedDetail.ruangan?.namaRuangan ?? "-"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div>
                    <span className="block text-xs text-muted-foreground font-medium mb-1">
                      Nilai Akhir
                    </span>
                    <span className="font-medium text-sm">
                      {selectedDetail.nilaiAkhir ?? "-"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-muted-foreground font-medium mb-1">
                      Keputusan
                    </span>
                    <span className="font-medium text-sm">
                      {selectedDetail.keputusan?.namaKeputusan ?? "-"}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="block text-xs text-muted-foreground font-medium mb-1">
                    Catatan
                  </span>
                  <span className="font-medium text-sm">
                    {selectedDetail.catatan ?? "-"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Daftar Hadir */}
      <Dialog open={openDaftarHadir} onOpenChange={setOpenDaftarHadir}>
        <DialogContent className="sm:max-w-lg p-6">
          <DialogHeader>
            <DialogTitle className="font-semibold mb-2">
              Formulir Daftar Hadir Ujian Skripsi
            </DialogTitle>
          </DialogHeader>

          {selectedDaftarHadir && (
            <div>
              <div className="mb-4">
                <div>
                  <span className="font-medium">Waktu</span>:{" "}
                  {selectedDaftarHadir.waktuMulai.slice(0, 5)} -{" "}
                  {selectedDaftarHadir.waktuSelesai.slice(0, 5)}
                </div>

                <div>
                  <span className="font-medium">Nama Mahasiswa</span>:{" "}
                  {selectedDaftarHadir.mahasiswa.nama}
                </div>

                <div>
                  <span className="font-medium">NIM</span>:{" "}
                  {selectedDaftarHadir.mahasiswa.nim}
                </div>

                <div>
                  <span className="font-medium">Judul Skripsi</span>:{" "}
                  {selectedDaftarHadir.judulPenelitian}
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table className="border w-full">
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="border px-2 py-1">No.</TableHead>
                      <TableHead className="border px-2 py-1">Nama</TableHead>
                      <TableHead className="border px-2 py-1">
                        NIP/NIDN
                      </TableHead>
                      <TableHead className="border px-2 py-1">
                        Jabatan
                      </TableHead>
                      <TableHead className="border px-2 py-1 text-center">
                        Kehadiran
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {selectedDaftarHadir.penguji.map((penguji, i) => {
                      const roleMap: Record<string, string> = {
                        ketua_penguji: "Ketua Penguji",
                        sekretaris_penguji: "Sekretaris Penguji",
                        penguji_1: "Penguji I",
                        penguji_2: "Penguji II",
                      };

                      // Cek kehadiran
                      const hadir = daftarHadir?.some(
                        (d) =>
                          d.dosenId === penguji.id &&
                          d.ujianId === selectedDaftarHadir.id &&
                          d.statusKehadiran === "hadir"
                      );

                      return (
                        <TableRow key={penguji.id}>
                          <TableCell className="border px-2 py-1 text-center">
                            {i + 1}
                          </TableCell>

                          <TableCell className="border px-2 py-1">
                            {penguji.nama}
                          </TableCell>

                          <TableCell className="border px-2 py-1">
                            {penguji.nip || penguji.nidn || "-"}
                          </TableCell>

                          <TableCell className="border px-2 py-1">
                            {roleMap[penguji.peran]}
                          </TableCell>

                          <TableCell className="border px-2 py-1 text-center">
                            {hadir ? (
                              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800">
                                Hadir
                              </span>
                            ) : (
                              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800">
                                Tidak Hadir
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Jadwal Ujian */}
      {
        showJadwalModal && selected && mahasiswaDetail && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            aria-modal="true"
            role="dialog"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => {
                setShowJadwalModal(false);
              }}
            />
            <div
              className="relative z-10 w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-800 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                    {selected.pendaftaranUjian?.status === "dijadwalkan"
                      ? "Edit Jadwal Ujian"
                      : "Jadwalkan Ujian"}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-sm text-muted-foreground">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {selected.mahasiswa.nama}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 text-xs font-semibold">
                      {selected.jenisUjian.namaJenis}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                  onClick={() => setShowJadwalModal(false)}
                >
                  <X size={18} className="text-gray-500" />
                </Button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (
                      !penguji1 ||
                      !penguji2 ||
                      !ruangan ||
                      !ketuaPenguji ||
                      !sekretarisPenguji
                    ) {
                      showToast.error(
                        "Mohon lengkapi semua field yang wajib diisi."
                      );
                      return;
                    }
                    if (
                      penguji1 === penguji2 ||
                      ketuaPenguji === sekretarisPenguji
                    ) {
                      showToast.error(
                        "Pilih dosen yang berbeda untuk setiap peran."
                      );
                      return;
                    }
                    const formElem = e.currentTarget as HTMLFormElement;
                    const fd = new FormData(formElem);
                    fd.set("penguji1", String(penguji1));
                    fd.set("penguji2", String(penguji2));
                    fd.set("ruanganId", String(ruangan));
                    fd.set("ketuaPenguji", String(ketuaPenguji));
                    fd.set("sekretarisPenguji", String(sekretarisPenguji));
                    startTransition(() => {
                      formAction(fd);
                    });
                  }}
                  className="p-6 space-y-6"
                >
                  <input
                    type="hidden"
                    name="ujianId"
                    value={String(selected?.id ?? "")}
                  />

                  {/* Section 1: Penguji Utama */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-1 border-b border-gray-100 dark:border-neutral-800">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold">
                        1
                      </span>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Penguji Utama
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Ketua Penguji
                        </Label>
                        <DosenCombobox
                          value={ketuaPenguji}
                          onChange={(val) => setKetuaPenguji(Number(val))}
                          options={dosen}
                          placeholder="Pilih Ketua Penguji"
                        />
                        <div className="flex items-start gap-1.5 px-2 py-1.5 bg-gray-50 dark:bg-neutral-800/50 rounded text-xs text-gray-600 dark:text-gray-400">
                          <span className="font-semibold shrink-0">Info:</span>
                          <span className="leading-snug">
                            {mahasiswaDetail?.pembimbing1?.nama
                              ? `Pembimbing 1 adalah ${mahasiswaDetail.pembimbing1.nama}`
                              : "Data Pembimbing 1 tidak tersedia"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Sekretaris Penguji
                        </Label>
                        <DosenCombobox
                          value={sekretarisPenguji}
                          onChange={(val) => setSekretarisPenguji(Number(val))}
                          options={dosen}
                          placeholder="Pilih Sekretaris Penguji"
                        />
                        <div className="flex items-start gap-1.5 px-2 py-1.5 bg-gray-50 dark:bg-neutral-800/50 rounded text-xs text-gray-600 dark:text-gray-400">
                          <span className="font-semibold shrink-0">Info:</span>
                          <span className="leading-snug">
                            {mahasiswaDetail?.pembimbing2?.nama
                              ? `Pembimbing 2 adalah ${mahasiswaDetail.pembimbing2.nama}`
                              : "Data Pembimbing 2 tidak tersedia"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Waktu & Tempat */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-1 border-b border-gray-100 dark:border-neutral-800">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-bold">
                        2
                      </span>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Waktu & Tempat
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Tanggal Ujian
                        </Label>
                        <div className="relative">
                          <Input
                            type="date"
                            name="jadwalUjian"
                            required
                            className="pl-9 bg-white dark:bg-neutral-900 border-gray-200"
                            defaultValue={
                              selected.jadwalUjian
                                ? selected.jadwalUjian.slice(0, 10)
                                : ""
                            }
                          />
                          <CalendarClock
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-1/2 space-y-1.5">
                          <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Mulai
                          </Label>
                          <Input
                            type="time"
                            name="waktuMulai"
                            value={waktuMulai}
                            onChange={(e) => setWaktuMulai(e.target.value)}
                            className="bg-white dark:bg-neutral-900 border-gray-200 text-center"
                            placeholder="00:00"
                          />
                        </div>
                        <div className="w-1/2 space-y-1.5">
                          <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Selesai
                          </Label>
                          <Input
                            type="time"
                            name="waktuSelesai"
                            value={waktuSelesai}
                            onChange={(e) => setWaktuSelesai(e.target.value)}
                            className="bg-white dark:bg-neutral-900 border-gray-200 text-center"
                            placeholder="00:00"
                          />
                        </div>
                      </div>

                      <div className="col-span-1 md:col-span-2 space-y-1.5">
                        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Ruangan
                        </Label>
                        <RuanganCombobox
                          value={ruangan ? Number(ruangan) : null}
                          onChange={(val) => setRuangan(String(val))}
                          options={ruanganList}
                          placeholder="Pilih Ruangan Ujian"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Dosen Penguji Anggota */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-1 border-b border-gray-100 dark:border-neutral-800">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold">
                        3
                      </span>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Anggota Penguji
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Dosen Penguji 1
                        </Label>
                        <DosenCombobox
                          value={penguji1}
                          onChange={(val) => setPenguji1(Number(val))}
                          options={dosen}
                          placeholder="Pilih Penguji 1"
                          excludeIds={penguji2 ? [Number(penguji2)] : []}
                        />

                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Dosen Penguji 2
                        </Label>
                        <DosenCombobox
                          value={penguji2}
                          onChange={(val) => setPenguji2(Number(val))}
                          options={dosen}
                          placeholder="Pilih Penguji 2"
                          excludeIds={penguji1 ? [Number(penguji1)] : []}
                        />

                      </div>
                    </div>
                  </div>

                  {/* Validation Info */}
                  {penguji1 === penguji2 && penguji1 !== 0 && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 border border-red-100 text-sm">
                      <Settings2 size={16} />
                      <p>Dosen penguji 1 dan 2 tidak boleh sama.</p>
                    </div>
                  )}

                  {/* Submit Action */}
                  <div className="pt-4 mt-6 border-t border-gray-100 dark:border-neutral-800">
                    <Button
                      type="submit"
                      className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
                      disabled={
                        !penguji1 ||
                        !penguji2 ||
                        !ruangan ||
                        penguji1 === 0 ||
                        penguji2 === 0 ||
                        ruangan === "" ||
                        penguji1 === penguji2 ||
                        isPending
                      }
                    >
                      {isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Menyimpan Jadwal...</span>
                        </div>
                      ) : (
                        "Simpan Jadwal Ujian"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )
      }
    </DataCard >
  );
}
