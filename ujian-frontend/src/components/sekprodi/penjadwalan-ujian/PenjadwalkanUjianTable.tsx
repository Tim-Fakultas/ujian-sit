/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useMemo, useEffect } from "react";
import TableGlobal from "@/components/tableGlobal";
import { Ujian } from "@/types/Ujian";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Search,
  MoreHorizontal,
  Check,
  LayoutGrid,
  List,
  Settings2,
  CalendarClock,
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
} from "@/components/ui/dropdown-menu";
import { setUjianSelesai, setUjianDijadwalkan } from "@/actions/jadwalUjian";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { X, CalendarPlus } from "lucide-react";
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
  const [penguji1, setPenguji1] = useState<string>("");
  const [penguji2, setPenguji2] = useState<string>("");
  const [ketuaPenguji, setKetuaPenguji] = useState<string>("");
  const [sekretarisPenguji, setSekretarisPenguji] = useState<string>("");
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

  // Bersihkan field saat selected ganti / null (jika perlu) or prefill
  useEffect(() => {
    if (selected) {
       // Prefill logic
      setWaktuMulai(selected.waktuMulai ? selected.waktuMulai.slice(0, 5) : "");
      setWaktuSelesai(selected.waktuSelesai ? selected.waktuSelesai.slice(0, 5) : "");
      setRuangan(
        selected.ruangan && selected.ruangan.id
          ? String(selected.ruangan.id)
          : ""
      );
      if (Array.isArray(selected.penguji)) {
        const p1 = selected.penguji.find((p) => p.peran === "penguji_1");
        const p2 = selected.penguji.find((p) => p.peran === "penguji_2");
        setPenguji1(p1 ? String(p1.id) : "");
        setPenguji2(p2 ? String(p2.id) : "");

        const ketuaObj = selected.penguji.find((p) => p.peran === "ketua_penguji");
        const sekreObj = selected.penguji.find((p) => p.peran === "sekretaris_penguji");
        
        setKetuaPenguji(ketuaObj ? String(ketuaObj.id) : (selected.pembimbing1 ? String(selected.pembimbing1.id) : ""));
        setSekretarisPenguji(sekreObj ? String(sekreObj.id) : (selected.pembimbing2 ? String(selected.pembimbing2.id) : ""));
      } else {
        setPenguji1("");
        setPenguji2("");
        setKetuaPenguji(selected.pembimbing1 ? String(selected.pembimbing1.id) : "");
        setSekretarisPenguji(selected.pembimbing2 ? String(selected.pembimbing2.id) : "");
      }
    } else {
      setPenguji1("");
      setPenguji2("");
      setMahasiswaDetail(null);
      setWaktuMulai("");
      setWaktuSelesai("");
      setRuangan("");
    }
  }, [selected]);

  const handleJadwal = (u: Ujian) => {
    setSelected(u);
    setShowJadwalModal(true);
  };
  // --- End Logic Modal Jadwal ---

  const [filterNama, setFilterNama] = useState("");
  const [filterJenis, setFilterJenis] = useState("all");
  const [filterBulan, setFilterBulan] = useState<string>("all");
  const [filterTahun, setFilterTahun] = useState<string>("all");
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

      const matchBulan =
        filterBulan === "all"
          ? true
          : (() => {
              if (!ujian.jadwalUjian) return false;
              const bulan = String(new Date(ujian.jadwalUjian).getMonth() + 1);
              return bulan === filterBulan;
            })();

      const matchTahun =
        filterTahun === "all"
          ? true
          : (() => {
              if (!ujian.jadwalUjian) return false;
              const tahun = String(new Date(ujian.jadwalUjian).getFullYear());
              return tahun === filterTahun;
            })();

      return matchNama && matchJenis && matchBulan && matchTahun;
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
    filterBulan,
    filterTahun,
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
          <div className="text-xs text-muted-foreground">
            {row.original.mahasiswa.nim}
          </div>
        </div>
      ),
      size: 120,
    },
    {
      accessorFn: (row: Ujian) => row.judulPenelitian ?? "-",
      id: "judul",
      header: "Judul Penelitian",
      cell: ({ row }: any) => (
        <div className="text-xs whitespace-pre-line break-words max-w-[180px]">
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
        // Tampilkan aksi sesuai tab: jika tab selesai, hanya tampilkan "Jadwalkan"
        const showJadwalkanOnly = statusTab === "selesai";
        return (
          <div className="flex items-center justify-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Aksi">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="end"
                className="min-w-[140px] py-1"
              >

                {showJadwalkanOnly ? (
                  <DropdownMenuItem
                    onClick={() => handleJadwal(ujian)}
                    className="flex items-center gap-1 px-2 py-1"
                  >
                    <span className="mr-1 text-blue-500">
                      <CalendarClock size={16} className="text-blue-500" />
                    </span>
                    Edit Jadwal
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => handleJadwal(ujian)}
                    className="flex items-center gap-1 px-2 py-1"
                  >
                     <span className="mr-1 text-blue-500">
                      <CalendarClock size={16} className="text-blue-500" />
                    </span>
                    {isSelesai || ujian.pendaftaranUjian.status === "dijadwalkan"
                      ? "Edit Jadwal"
                      : "Jadwalkan"}
                  </DropdownMenuItem>
                )}
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
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg  border">
      {/* Header bar: Search, Filter, View Mode */}
      <div className="flex items-center sm:justify-end gap-2 mb-2">
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={16} />
          </span>
          <Input
            placeholder="Search"
            value={filterNama}
            onChange={(e) => setFilterNama(e.target.value)}
            className="pl-10 w-full bg-white dark:bg-[#2a2a2a]"
          />
        </div>



        {/* Tombol filter Jenis, Bulan, Tahun */}
        <Popover open={openFilter} onOpenChange={setOpenFilter}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant={filterJenis !== "all" ? "secondary" : "outline"}
              className="h-9 border rounded-lg px-4 py-1 bg-white hover:bg-gray-50 font-medium shadow-sm"
            >
              <Settings2 size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="min-w-[220px] p-0 rounded-lg " align="end">
            <div className="p-3">
              <div className="font-semibold text-xs mb-2 text-muted-foreground">
                Status
              </div>
              <div className="flex flex-col gap-1 mb-3">
                {["all", "dijadwalkan", "selesai", "belum_dijadwalkan"].map(
                  (item) => (
                    <Button
                      key={item}
                      variant={statusTab === item ? "secondary" : "ghost"}
                      size="sm"
                      className={`w-full justify-between rounded-md text-left ${
                        statusTab === item ? "font-semibold" : ""
                      }`}
                      onClick={() => {
                        setStatusTab(
                          item as
                            | "all"
                            | "dijadwalkan"
                            | "selesai"
                            | "belum_dijadwalkan"
                        );
                        // setOpenFilter(false); // Optional: keep open for multiple filters
                      }}
                    >
                      <span className="text-sm">
                        {item === "all"
                          ? "Semua"
                          : item === "belum_dijadwalkan"
                          ? "Belum Dijadwalkan"
                          : item.charAt(0).toUpperCase() + item.slice(1)}
                      </span>
                    {statusTab === item && <Check size={14} className="ml-2" />}
                  </Button>
                ))}
              </div>

              <div className="font-semibold text-xs mb-2 text-muted-foreground">
                Jenis Ujian
              </div>
              <div className="flex flex-col gap-1 mb-3">
                {["all", "Ujian Proposal", "Ujian Hasil", "Ujian Skripsi"].map(
                  (item) => (
                    <Button
                      key={item}
                      variant={filterJenis === item ? "secondary" : "ghost"}
                      size="sm"
                      className={`w-full justify-between rounded-md text-left ${
                        filterJenis === item ? "font-semibold" : ""
                      }`}
                      onClick={() => {
                        setFilterJenis(item);
                        // setOpenFilter(false);
                      }}
                    >
                      <span className="text-sm">
                        {item === "all" ? "Semua" : item}
                      </span>
                      {filterJenis === item && (
                        <Check size={14} className="ml-2" />
                      )}
                    </Button>
                  )
                )}
              </div>
              <div className="font-semibold text-xs mb-2 text-muted-foreground">
                Bulan
              </div>
              <div className="flex flex-col gap-1 mb-3">
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={filterBulan === "all" ? "" : filterBulan}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFilterBulan(val === "" ? "all" : val);
                  }}
                  placeholder="Bulan (1-12)"
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
              <div className="font-semibold text-xs mb-2 text-muted-foreground">
                Tahun
              </div>
              <div className="flex flex-col gap-1">
                <input
                  type="number"
                  min={2000}
                  max={2100}
                  value={filterTahun === "all" ? "" : filterTahun}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFilterTahun(val === "" ? "all" : val);
                  }}
                  placeholder="Tahun"
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Tabs value={viewMode} onValueChange={setViewMode}>
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

      {/* Table/Card View */}
      <Tabs value={viewMode} onValueChange={setViewMode}>
        <TabsContent value="table">
          <TableGlobal table={table} cols={cols} />
        </TabsContent>
        <TabsContent value="card">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {paginatedData.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 col-span-full">
                Tidak ada data.
              </div>
            ) : (
              paginatedData.map((ujian) => (
                <div
                  key={ujian.id}
                  className="border rounded-xl p-5 bg-white dark:bg-neutral-800 shadow flex flex-col gap-3 relative transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-1 mb-2">
                    <div className="font-semibold text-lg text-gray-800 dark:text-gray-100 truncate">
                      {ujian.mahasiswa.nama}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {ujian.mahasiswa.nim}
                    </div>
                  </div>
                  <div className="border-t my-2" />
                  <div className="mb-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                      Judul
                    </div>
                    <div className="whitespace-pre-line break-words text-sm font-medium text-gray-700 dark:text-gray-200 ">
                      {ujian.judulPenelitian}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Jenis:
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs rounded font-semibold ${getJenisUjianColor(
                          ujian.jenisUjian.namaJenis
                        )}`}
                      >
                        {ujian.jenisUjian.namaJenis}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Ruangan:
                      </span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                        {ujian.ruangan?.namaRuangan ?? "-"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Waktu:
                      </span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                        {ujian.hariUjian
                          ? ujian.hariUjian[0].toUpperCase() +
                            ujian.hariUjian.slice(1)
                          : "-"}
                        {", "}
                        {ujian.jadwalUjian
                          ? new Date(ujian.jadwalUjian).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )
                          : "-"}{" "}
                        {ujian.waktuMulai?.slice(0, 5)} -{" "}
                        {ujian.waktuSelesai?.slice(0, 5)}
                      </span>
                    </div>
                  </div>
            
                </div>
              ))
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
      {showJadwalModal && selected && mahasiswaDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowJadwalModal(false);
              // setSelected(null); // Optional: if we want to keep selected for other modals
            }}
          />
          <div
            className="relative z-10 w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-muted flex flex-col h-fit">
              <div className="flex items-center justify-between px-6 py-4 border-b dark:border-neutral-800">
                <div>
                  <div className="text-lg font-semibold">
                    {selected.pendaftaranUjian?.status === "dijadwalkan"
                      ? "Edit Jadwal Ujian"
                      : "Jadwalkan Ujian"}
                  </div>
                  <div className="text-sm font-normal text-muted-foreground">
                    {selected.mahasiswa.nama} &mdash;{" "}
                    {selected.jenisUjian.namaJenis}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowJadwalModal(false);
                  }}
                >
                  <X size={16} />
                </Button>
              </div>
              <ScrollArea className="flex-1">
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
                        "Lengkapi semua field penguji, ketua, sekretaris, dan ruangan."
                      );
                      return;
                    }
                    if (
                      penguji1 === penguji2 ||
                      ketuaPenguji === sekretarisPenguji
                    ) {
                      showToast.error("Pilih dosen yang berbeda untuk setiap peran.");
                      return;
                    }
                    const formElem = e.currentTarget as HTMLFormElement;
                    const fd = new FormData(formElem);
                    fd.set("penguji1", penguji1);
                    fd.set("penguji2", penguji2);
                    fd.set("ruanganId", ruangan);
                    fd.set("ketuaPenguji", ketuaPenguji);
                    fd.set("sekretarisPenguji", sekretarisPenguji);
                    startTransition(() => {
                      formAction(fd);
                    });
                  }}
                  className="space-y-4 p-4 pb-0"
                  style={{ minHeight: 0 }}
                >
                  <input
                    type="hidden"
                    name="ujianId"
                    value={String(selected?.id ?? "")}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-2 block">Ketua Penguji</Label>
                      <Select
                        value={ketuaPenguji}
                        onValueChange={setKetuaPenguji}
                        name="ketuaPenguji"
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Ketua Penguji" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          {dosen.map((d) => (
                            <SelectItem key={d.id} value={String(d.id)}>
                              {d.nama}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="mt-2 text-xs text-neutral-700 font-medium dark:text-neutral-400">
                        {mahasiswaDetail?.pembimbing1?.nama
                          ? `Pembimbing 1: ${mahasiswaDetail.pembimbing1.nama}`
                          : "Pembimbing 1: -"}
                      </div>
                    </div>
                    <div>
                      <Label className="mb-2 block">Sekretaris Penguji</Label>
                      <Select
                        value={sekretarisPenguji}
                        onValueChange={setSekretarisPenguji}
                        name="sekretarisPenguji"
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Sekretaris Penguji" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          {dosen.map((d) => (
                            <SelectItem key={d.id} value={String(d.id)}>
                              {d.nama}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="mt-2 text-xs text-neutral-700 font-medium dark:text-neutral-400">
                        {mahasiswaDetail?.pembimbing2?.nama
                          ? `Pembimbing 2: ${mahasiswaDetail.pembimbing2.nama}`
                          : "Pembimbing 2: -"}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-2 block">Tanggal Ujian</Label>
                      <Input
                        type="date"
                        name="jadwalUjian"
                        required
                        placeholder="Pilih tanggal"
                        defaultValue={
                          selected.jadwalUjian
                            ? selected.jadwalUjian.slice(0, 10)
                            : ""
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="w-1/2">
                        <Label className="mb-2 block">Waktu Mulai</Label>
                        <Input
                          type="time"
                          name="waktuMulai"
                          value={waktuMulai}
                          onChange={(e) => setWaktuMulai(e.target.value)}
                          placeholder="08:00"
                        />
                      </div>
                      <div className="w-1/2">
                        <Label className="mb-2 block">Waktu Selesai</Label>
                        <Input
                          type="time"
                          name="waktuSelesai"
                          value={waktuSelesai}
                          onChange={(e) => setWaktuSelesai(e.target.value)}
                          placeholder="09:00"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-2 block">Dosen Penguji 1</Label>
                      <Select
                        value={penguji1}
                        onValueChange={setPenguji1}
                        name="penguji1"
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Dosen" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          {dosen
                            .filter((d) => String(d.id) !== penguji2)
                            .map((d) => (
                              <SelectItem key={d.id} value={String(d.id)}>
                                {d.nama}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="mb-2 block">Dosen Penguji 2</Label>
                      <Select
                        value={penguji2}
                        onValueChange={setPenguji2}
                        name="penguji2"
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Dosen" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          {dosen
                            .filter((d) => String(d.id) !== penguji1)
                            .map((d) => (
                              <SelectItem key={d.id} value={String(d.id)}>
                                {d.nama}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-2 block">Ruangan</Label>
                      <Select
                        value={ruangan}
                        onValueChange={setRuangan}
                        name="ruanganId"
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Ruangan" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          {ruanganList.map((r) => (
                            <SelectItem key={r.id} value={String(r.id)}>
                              {r.namaRuangan}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="pt-2">
                    {penguji1 === penguji2 && penguji1 !== "" && (
                      <div className="text-sm text-red-600 mb-2">
                        Pilih penguji yang berbeda.
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full mb-4"
                    disabled={
                      !penguji1 ||
                      !penguji2 ||
                      !ruangan ||
                      penguji1 === "" ||
                      penguji2 === "" ||
                      ruangan === "" ||
                      penguji1 === penguji2 ||
                      isPending
                    }
                  >
                    {isPending ? "Menyimpan..." : "Simpan Jadwal"}
                  </Button>
                </form>
              </ScrollArea>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
