"use client";

import {
  useState,
  useEffect,
  useActionState,
  useMemo,
  useTransition,
} from "react";
import { getRuangan } from "@/actions/data-master/ruangan";

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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  CalendarPlus,
  ListFilter,
  ChevronDown,
  MoreHorizontal,
  ArrowUpDown,
  X,
  CheckCircle2,
  Settings2,
  Layout,
  List,
  LayoutGrid,
} from "lucide-react";
import { getMahasiswaById } from "@/actions/data-master/mahasiswa";
import { getJenisUjianColor, getStatusColor, truncateTitle } from "@/lib/utils";
import { jadwalkanUjianAction } from "@/actions/jadwalUjian";
import { Ujian } from "@/types/Ujian";
import revalidateAction from "@/actions/revalidate";
import { Dosen } from "@/types/Dosen";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function PendaftaranUjianTable({
  ujianList,
  dosen,
}: {
  ujianList: Ujian[];
  dosen: Dosen[];
}) {
  const [selected, setSelected] = useState<Ujian | null>(null);

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

  // State for ruangan
  const [ruanganList, setRuanganList] = useState<
    { id: number; namaRuangan: string }[]
  >([]);

  const [ruangan, setRuangan] = useState<string>("");
  // State untuk waktu mulai dan selesai
  const [waktuMulai, setWaktuMulai] = useState("");
  const [waktuSelesai, setWaktuSelesai] = useState("");

  useEffect(() => {
    getRuangan().then((res) => {
      if (res && Array.isArray(res.data)) {
        setRuanganList(res.data);
      }
    });
  }, []);

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
    revalidateAction("/sekprodi/daftar-ujian");
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
        toast.success("Ujian berhasil dijadwalkan!");
        setSelected(null);
      } else if (state.message) {
        // Mapping pesan error agar lebih user-friendly
        let userMessage = state.message;
        if (
          userMessage.includes(
            "waktu selesai field must be a date after waktu mulai"
          ) ||
          userMessage.includes("waktuSelesai") ||
          userMessage.toLowerCase().includes("must be a date after waktu mulai")
        ) {
          userMessage = "Waktu selesai ujian harus setelah waktu mulai.";
        }
        toast.error(userMessage);
      }
    })();
  }, [state]);

  // Bersihkan field saat card ditutup (selected = null)
  useEffect(() => {
    if (selected === null) {
      setPenguji1("");
      setPenguji2("");
      setMahasiswaDetail(null);
      setWaktuMulai("");
      setWaktuSelesai("");
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
    { value: "diterima", label: "Diterima" },
    { value: "ditolak", label: "Ditolak" },
    { value: "dijadwalkan", label: "Dijadwalkan" },
    { value: "selesai", label: "Selesai" },
  ];

  // Gabungan status dan jenis ujian untuk filter
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
  const currentSortLabel = (() => {
    if (!sorting || sorting.length === 0) return "Sort";
    const s = sorting[0];
    const col = String(s.id);
    const dir = s.desc ? "↓" : "↑";
    const map: Record<string, string> = {
      nama: "Nama",
      jenis: "Jenis",
      status: "Status",
    };
    return `${map[col] ?? col} ${dir}`;
  })();
  const applySort = (id: string, desc: boolean) => {
    setSorting([{ id, desc }]);
  };

  // Filtered data
  const filteredData = useMemo(() => {
    return ujianList.filter((u) => {
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
            : u.pendaftaranUjian?.status === filterOption.value
          : true;
      return matchNama && matchJenis && matchStatus;
    });
  }, [ujianList, filterNama, filterOption]);

  // helper to open modal from table action
  const handleDetail = (u: Ujian) => {
    setSelected(u);
  };

  const cols: ColumnDef<Ujian>[] = useMemo(
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
        size: 160, // kurangi lebar kolom nama
      },
      {
        accessorFn: (row) => row.judulPenelitian ?? "-",
        id: "judul",
        header: "Judul",
        cell: ({ row }) => (
          <div className="max-w-[180px] truncate">{row.getValue("judul")}</div>
        ),
        size: 200, // kurangi lebar kolom judul
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
        size: 110, // kurangi lebar kolom jenis
      },
      {
        accessorFn: (row) => row.pendaftaranUjian?.status ?? "-",
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
        size: 100, // kurangi lebar kolom status
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const u = row.original;
          return (
            <div className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="mx-auto">
                    <MoreHorizontal size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" >
                  <DropdownMenuItem onClick={() => handleDetail(u)}>
                    <CalendarPlus className="mr-2" size={16} />
                    Jadwalkan
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        size: 60, // kurangi lebar kolom aksi
      },
    ],
    []
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
              filteredData.map((ujian) => (
                <div
                  key={ujian.id}
                  className="border rounded-lg bg-white dark:bg-neutral-800 shadow-sm flex flex-col"
                >
                  <div className="p-4 flex flex-col gap-2">
                    <div className="font-semibold text-base leading-tight">
                      {ujian.mahasiswa.nama}
                    </div>
                    <div className="text-xs text-muted-foreground mb-1 leading-none">
                      {ujian.mahasiswa.nim}
                    </div>
                    <div>
                      <span className="font-medium block mb-1">Judul:</span>
                      <div className="whitespace-pre-line break-words text-sm leading-relaxed max-h-16 overflow-hidden">
                        {ujian.judulPenelitian}
                      </div>
                    </div>
                    <div className="flex flex-row items-center gap-2 mt-2">
                      <span className="font-medium">Jenis:</span>
                      <span
                        className={`px-2 py-0.5 text-xs rounded font-semibold ${getJenisUjianColor(
                          ujian.jenisUjian.namaJenis
                        )}`}
                      >
                        {ujian.jenisUjian.namaJenis}
                      </span>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <span className="font-medium">Status:</span>
                      <span
                        className={`px-2 py-0.5 text-xs rounded font-semibold ${getStatusColor(
                          ujian.pendaftaranUjian?.status
                        )}`}
                      >
                        {ujian.pendaftaranUjian?.status}
                      </span>
                    </div>
                  </div>
                  <div className="border-t px-4 py-2 flex justify-end items-center gap-2 bg-gray-50 dark:bg-neutral-900 rounded-b-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDetail(ujian)}
                      aria-label="Jadwalkan"
                      className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-neutral-800 px-2 py-1"
                    >
                      <CalendarPlus size={16} />
                      <span className="text-xs font-medium text-muted-foreground">
                        Jadwalkan
                      </span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Popup Card Jadwal */}
      {selected && mahasiswaDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          {/* Card container — klik di sini tidak menutup popup */}
          <div
            className="relative z-10 w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ganti Card dengan shadcn Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-muted">
              <div className="flex items-center justify-between px-6 py-4 border-b dark:border-neutral-800">
                <div>
                  <div className="text-lg font-semibold">Jadwalkan Ujian</div>
                  <div className="text-sm font-normal text-muted-foreground">
                    {selected.mahasiswa.nama} &mdash;{" "}
                    {selected.jenisUjian.namaJenis}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelected(null)}
                >
                  <X size={16} />
                </Button>
              </div>
              <div className="px-6 py-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!penguji1 || !penguji2 || !ruangan) {
                      toast.error("Lengkapi semua field penguji dan ruangan.");
                      return;
                    }
                    if (penguji1 === penguji2) {
                      toast.error("Pilih penguji yang berbeda.");
                      return;
                    }
                    const formElem = e.currentTarget as HTMLFormElement;
                    const fd = new FormData(formElem);
                    fd.set("penguji1", penguji1);
                    fd.set("penguji2", penguji2);
                    fd.set("ruanganId", ruangan);
                    startTransition(() => {
                      formAction(fd);
                    });
                  }}
                  className="space-y-4"
                >
                  <input
                    type="hidden"
                    name="ujianId"
                    value={String(selected?.id ?? "")}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-2 block">Ketua Penguji</Label>
                      <Input
                        type="text"
                        value={mahasiswaDetail.pembimbing1?.nama || ""}
                        disabled
                      />
                      <input
                        type="hidden"
                        name="ketuaPenguji"
                        value={String(mahasiswaDetail.pembimbing1?.id ?? "")}
                      />
                    </div>
                    <div>
                      <Label className="mb-2 block">Sekretaris Penguji</Label>
                      <Input
                        type="text"
                        value={mahasiswaDetail.pembimbing2?.nama || ""}
                        disabled
                      />
                      <input
                        type="hidden"
                        name="sekretarisPenguji"
                        value={String(mahasiswaDetail.pembimbing2?.id ?? "")}
                      />
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
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="w-1/2">
                        <Label className="mb-2 block">Waktu Mulai</Label>
                        <Input
                          type="time"
                          name="waktuMulai"
                          required
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
                          required
                          value={waktuSelesai}
                          onChange={(e) => setWaktuSelesai(e.target.value)}
                          placeholder="10:00"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block">Ruangan</Label>
                    <Select
                      value={ruangan}
                      onValueChange={(val) => setRuangan(val)}
                      name="ruanganId"
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih Ruangan" />
                      </SelectTrigger>
                      <SelectContent>
                        {ruanganList.map((r) => (
                          <SelectItem key={r.id} value={String(r.id)}>
                            {r.namaRuangan}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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
                  <div className="pt-2">
                    {penguji1 === penguji2 && penguji1 !== "" && (
                      <div className="text-sm text-red-600 mb-2">
                        Pilih penguji yang berbeda.
                      </div>
                    )}
                    <Button
                      type="submit"
                      className="w-full mt-1"
                      disabled={
                        !penguji1 ||
                        !penguji2 ||
                        !ruangan ||
                        penguji1 === "" ||
                        penguji2 === "" ||
                        ruangan === "" ||
                        penguji1 === penguji2
                      }
                    >
                      Simpan Jadwal
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
