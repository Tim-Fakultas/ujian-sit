/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useMemo, useEffect } from "react";
import TableGlobal from "@/components/tableGlobal";
import { Ujian } from "@/types/Ujian";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Search,
  MoreHorizontal,
  Check,
  LayoutGrid,
  List,
  Settings2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { daftarKehadiran } from "@/types/DaftarKehadiran";
import { Input } from "@/components/ui/input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getJenisUjianColor } from "@/lib/utils";
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

export default function JadwalUjianTable({
  jadwalUjian,
  daftarHadir,
}: {
  jadwalUjian: Ujian[];
  daftarHadir: daftarKehadiran[] | null;
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState<Ujian | null>(null);

  const [openDaftarHadir, setOpenDaftarHadir] = useState(false);
  const [selectedDaftarHadir, setSelectedDaftarHadir] = useState<Ujian | null>(
    null
  );

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

  const filteredData = useMemo(() => {
    let data = jadwalUjian.filter((ujian) => {
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

  // ===========================================
  // Handlers
  // ===========================================
  function handleDetail(ujian: Ujian) {
    setSelected(ujian);
    setOpenDialog(true);
  }

  async function handleToggleStatusUjian(ujian: Ujian) {
    const { toast } = await import("sonner");
    try {
      if (completedIds.includes(ujian.id)) {
        await setUjianDijadwalkan(ujian.pendaftaranUjian.id);
        setCompletedIds((prev) => prev.filter((id) => id !== ujian.id));
        toast.success("Status ujian dikembalikan ke Dijadwalkan");
      } else {
        await setUjianSelesai(ujian.pendaftaranUjian.id);
        setCompletedIds((prev) => [...prev, ujian.id]);
        toast.success("Berhasil menandai ujian selesai");
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengubah status ujian");
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
      cell: ({ row }: any) => <div>{row.getValue("nama")}</div>,
      size: 120,
    },
    {
      accessorFn: (row: Ujian) => row.judulPenelitian ?? "-",
      id: "judul",
      header: "Judul Penelitian",
      cell: ({ row }: any) => (
        <div className="whitespace-pre-line break-words max-w-[180px]">
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
          className={`px-2 py-1 text-sm rounded font-semibold inline-block ${getJenisUjianColor(
            String(row.getValue("jenis"))
          )}`}
        >
          {row.getValue("jenis")}
        </span>
      ),
      size: 90,
    },
    {
      accessorFn: (row: Ujian) => ({
        hari: row.hariUjian
          ? row.hariUjian[0].toUpperCase() + row.hariUjian.slice(1)
          : "-",
        tanggal: (() => {
          try {
            return new Date(row.jadwalUjian).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
          } catch {
            return "-";
          }
        })(),
        waktu: `${row.waktuMulai?.slice(0, 5) ?? ""} - ${
          row.waktuSelesai?.slice(0, 5) ?? ""
        }`,
      }),
      id: "waktu",
      header: "Waktu",
      cell: ({ row }: any) => {
        const val = row.getValue("waktu");
        return (
          <div>
            <div>
              {val.hari}, {val.tanggal}
            </div>
            <div>{val.waktu}</div>
          </div>
        );
      },
      size: 120,
    },
    {
      accessorFn: (row: Ujian) => row.ruangan?.namaRuangan ?? "-",
      id: "ruangan",
      header: "Ruangan",
      cell: ({ row }: any) => <div>{row.getValue("ruangan")}</div>,
      size: 70,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }: any) => {
        const ujian = row.original;
        const isSelesai = completedIds.includes(ujian.id);
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
                <DropdownMenuItem
                  onClick={() => handleDetail(ujian)}
                  className="flex items-center gap-1 px-2 py-1"
                >
                  <Eye size={15} className="mr-1" />
                  Penguji
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleToggleStatusUjian(ujian)}
                  className="flex items-center gap-1 px-2 py-1"
                >
                  {isSelesai ? (
                    <>
                      {/* Jadwalkan: gunakan icon kalender */}
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 20 20"
                        fill="none"
                        className="mr-1 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="3"
                          y="6"
                          width="14"
                          height="11"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M7 2V6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M13 2V6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      Jadwalkan
                    </>
                  ) : (
                    <>
                      <Check size={13} className="mr-1 text-emerald-500" />
                      Tandai Selesai
                    </>
                  )}
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
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg  border">
      {/* Header bar: Tabs, Search, Filter in one row */}
      <div className="flex items-center sm:justify-end gap-2 mb-4">
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
                        setOpenFilter(false);
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
                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDetail(ujian)}
                      aria-label="Lihat Tim Penguji"
                      className="flex items-center gap-2"
                    >
                      <Eye size={16} className="mr-1" />
                      <span>Lihat Tim Penguji</span>
                    </Button>
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
                        <DropdownMenuItem
                          onClick={() => handleToggleStatusUjian(ujian)}
                          className="flex items-center gap-1 px-2 py-1"
                        >
                          {completedIds.includes(ujian.id) ? (
                            <>
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 20 20"
                                fill="none"
                                className="mr-1 text-blue-500"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="3"
                                  y="6"
                                  width="14"
                                  height="11"
                                  rx="2"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                                <path
                                  d="M7 2V6"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M13 2V6"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </svg>
                              Dijadwalkan
                            </>
                          ) : (
                            <>
                              <Check
                                size={13}
                                className="mr-1 text-emerald-500"
                              />
                              Tandai Selesai
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {completedIds.includes(ujian.id) && (
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800 ml-1">
                        Selesai
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog Detail Penguji */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-2xl p-0 max-h-[90vh] overflow-hidden rounded-2xl shadow-sm">
          <DialogHeader>
            <DialogTitle className="font-semibold px-6 pt-6 pb-2 text-lg">
              Tim Penguji
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6">
            {selected && (
              <div className="rounded-xl border bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow className="bg-muted">
                      <TableHead className="text-center w-10">No</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Jabatan</TableHead>
                      <TableHead className="text-center">Kehadiran</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selected.penguji.map((penguji, i) => {
                      const roleMap: Record<string, string> = {
                        ketua_penguji: "Ketua Penguji",
                        sekretaris_penguji: "Sekretaris Penguji",
                        penguji_1: "Penguji 1",
                        penguji_2: "Penguji 2",
                      };
                      const label = roleMap[penguji.peran];
                      const hadir = cekHadir(penguji.id);
                      return (
                        <TableRow
                          key={penguji.id}
                          className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
                        >
                          <TableCell className="text-center font-semibold">
                            {i + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {penguji.nama}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-semibold
                                ${
                                  label === "Ketua Penguji"
                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
                                    : label === "Sekretaris Penguji"
                                    ? "bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100"
                                    : label === "Penguji 1"
                                    ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-800 dark:text-cyan-100"
                                    : label === "Penguji 2"
                                    ? "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100"
                                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-200"
                                }`}
                            >
                              {label}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            {hadir ? (
                              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800">
                                Hadir
                              </span>
                            ) : (
                              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-400 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
                                -
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
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
    </div>
  );
}
