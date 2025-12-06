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

  // Otomatis set waktu selesai berdasarkan waktu mulai & jenis ujian
  useEffect(() => {
    if (!waktuMulai || !selected) {
      setWaktuSelesai("");
      return;
    }
    // Ambil durasi berdasarkan jenis ujian
    let durasiJam = 2;
    let durasiMenit = 0;
    if (selected.jenisUjian.namaJenis.toLowerCase().includes("skripsi")) {
      durasiJam = 1;
      durasiMenit = 30;
    }
    // Parse waktu mulai
    const [jam, menit] = waktuMulai.split(":").map(Number);
    const mulai = new Date();
    mulai.setHours(jam, menit, 0, 0);
    // Tambah durasi
    mulai.setHours(mulai.getHours() + durasiJam);
    mulai.setMinutes(mulai.getMinutes() + durasiMenit);
    // Format kembali ke "HH:MM"
    const pad = (n: number) => n.toString().padStart(2, "0");
    setWaktuSelesai(`${pad(mulai.getHours())}:${pad(mulai.getMinutes())}`);
  }, [waktuMulai, selected]);

  // Filter & Pagination State
  const [filterNama, setFilterNama] = useState("");
  const [filterJenis, setFilterJenis] = useState("all");
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

  const filteredData = useMemo(() => {
    const data = ujianList.filter((u) => {
      const matchNama = u.mahasiswa.nama
        .toLowerCase()
        .includes(filterNama.toLowerCase());
      const matchJenis =
        filterJenis === "all" ? true : u.jenisUjian.namaJenis === filterJenis;
      return matchNama && matchJenis;
    });

    return data;
  }, [ujianList, filterNama, filterJenis]);

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
      },
      {
        accessorFn: (row) => row.mahasiswa.nama ?? "-",
        id: "nama",
        header: "Nama Mahasiswa",
        cell: ({ row }) => <div>{row.getValue("nama")}</div>,
      },
      {
        accessorFn: (row) => row.judulPenelitian ?? "-",
        id: "judul",
        header: "Judul",
        cell: ({ row }) => (
          <div className="max-w-[48ch] truncate">{row.getValue("judul")}</div>
        ),
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
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleDetail(u)}>
                    <CalendarPlus className="mr-2" size={16} />
                    Jadwalkan
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
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

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <span className="font-semibold text-lg">Daftar ujian</span>
        <div className="flex w-full sm:w-auto items-center gap-3">
          {/* Search */}
          <div className="relative w-56">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>
            <Input
              placeholder="Search"
              value={filterNama}
              onChange={(e) => setFilterNama(e.target.value)}
              className="pl-10 w-full   bg-white dark:bg-[#1f1f1f] "
            />
          </div>
          {/* Filter jenis ujian dengan Popover, ukuran sama dengan search */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 flex items-center gap-2  rounded-lg text-sm font-normal shadow-none min-w-[110px] justify-between"
              >
                <span className="flex items-center gap-2">
                  <ListFilter size={16} />
                  Filter
                </span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-52 p-0 rounded-lg shadow"
            >
              <div className="p-4">
                <div className="font-semibold text-xs mb-2">Jenis Ujian</div>
                <div className="flex flex-col gap-1">
                  <DropdownMenuItem onClick={() => setFilterJenis("all")}>
                    Semua
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterJenis("Ujian Proposal")}
                  >
                    Ujian Proposal
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterJenis("Ujian Hasil")}
                  >
                    Ujian Hasil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterJenis("Ujian Skripsi")}
                  >
                    Ujian Skripsi
                  </DropdownMenuItem>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Sort dropdown (shadcn) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 flex items-center gap-2 rounded-lg text-sm font-normal shadow-none "
              >
                <ArrowUpDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => applySort("nama", false)}>
                Nama ↑
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => applySort("nama", true)}>
                Nama ↓
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setSorting([]);
                }}
              >
                Clear sorting
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Replace manual table + pagination with TableGlobal */}
      <TableGlobal table={table} cols={cols} />

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
            className="relative z-10 w-full max-w-3xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="dark:bg-neutral-900 dark:border-neutral-800">
              <CardHeader className="flex items-center justify-between">
                <CardTitle>
                  Jadwalkan Ujian
                  <div className="text-sm font-normal text-muted-foreground ">
                    {selected.mahasiswa.nama} &mdash;{" "}
                    {selected.jenisUjian.namaJenis}
                  </div>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelected(null)}
                >
                  <X size={16} />
                </Button>
              </CardHeader>
              <CardContent>
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
                          readOnly
                          tabIndex={-1}
                          className="bg-[#f3f4f6] text-muted-foreground"
                        />
                        <span className="text-xs text-muted-foreground block mt-1">
                          Otomatis diisi sesuai jenis ujian
                        </span>
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
                  <CardFooter className="p-0">
                    <div className="w-full">
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
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
