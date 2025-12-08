/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import TableGlobal from "@/components/tableGlobal";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  ListFilter,
  ChevronDown,
  Eye,
  MoreHorizontal,
  File,
  DownloadIcon,
  X,
  Settings2,
} from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { SuratKeteranganLulusPDF } from "@/components/pdf/SuratKeteranganLulus";
import { Card, CardContent } from "@/components/ui/card";
import { BeritaUjian } from "@/types/BeritaUjian";
import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  ujian: BeritaUjian[];
};

const bobot: Record<"proposal" | "hasil" | "skripsi", number> = {
  proposal: 0.2,
  hasil: 0.5,
  skripsi: 0.3,
};

const jenisList: Array<keyof typeof bobot> = ["proposal", "hasil", "skripsi"];

const jenisUjianOptions = ["Ujian Proposal", "Ujian Hasil", "Ujian Skripsi"];
const nilaiOrderOptions = [
  { label: "Nilai Tertinggi", value: "desc" },
  { label: "Nilai Terendah", value: "asc" },
];

function getJenisUjian(ujian: BeritaUjian): keyof typeof bobot | "" {
  if (ujian.jenisUjian.namaJenis === "Ujian Proposal") return "proposal";
  if (ujian.jenisUjian.namaJenis === "Ujian Hasil") return "hasil";
  if (ujian.jenisUjian.namaJenis === "Ujian Skripsi") return "skripsi";
  return "";
}

function groupByMahasiswa(ujian: BeritaUjian[]) {
  const map: Record<number, BeritaUjian[]> = {};
  ujian.forEach((item) => {
    const mhsId = item.mahasiswa.id;
    if (!map[mhsId]) map[mhsId] = [];
    map[mhsId].push(item);
  });
  return Object.values(map);
}

function hitungNilaiAkhir(ujianMhs: BeritaUjian[]) {
  let total = 0;
  const detail: {
    jenis: keyof typeof bobot;
    skor: number;
    bobot: number;
    nilai: number;
  }[] = [];

  jenisList.forEach((jenis) => {
    const ujian = ujianMhs.find((u) => getJenisUjian(u) === jenis);
    const skor = ujian?.nilaiAkhir ?? 0;
    const bbt = bobot[jenis] ?? 0;
    const nilai = skor * bbt;

    detail.push({ jenis, skor, bobot: bbt, nilai });
    total += nilai;
  });

  return { total, detail };
}

// Helper: cek apakah mahasiswa sudah lulus semua ujian
function sudahLulusSemua(ujianMhs: BeritaUjian[]) {
  // Harus ada 3 jenis ujian dan semuanya hasil === "lulus"
  return jenisList.every((jenis) =>
    ujianMhs.some(
      (u) => getJenisUjian(u) === jenis && u.hasil?.toLowerCase() === "lulus"
    )
  );
}

export default function RekapitulasiNilaiTable({ ujian }: Props) {
  const [selected, setSelected] = useState<{
    mhs: BeritaUjian["mahasiswa"];
    judul: string;
    detail: {
      jenis: keyof typeof bobot;
      skor: number;
      bobot: number;
      nilai: number;
    }[];
    total: number;
  } | null>(null);

  const [open, setOpen] = useState(false);
  const [openSurat, setOpenSurat] = useState(false);
  const [suratData, setSuratData] = useState<{
    nama: string;
    nim: string;
    nilaiHuruf: string;
    total: number;
    judul: string;
    waktuMulai?: string;
    waktuSelesai?: string;
    dosenPembimbing1?: string;
    dosenPembimbing2?: string;
    ketuaPenguji?: string;
    sekretarisPenguji?: string;
    penguji1?: string;
    penguji2?: string;
  } | null>(null);

  // Search & filter state
  const [filterNama, setFilterNama] = useState("");
  const [filterJenis, setFilterJenis] = useState("all");
  const [openFilter, setOpenFilter] = useState(false);
  const [nilaiOrder, setNilaiOrder] = useState<"asc" | "desc">("desc");

  // Per-row popover state
  const [aksiOpenArr, setAksiOpenArr] = useState<boolean[]>([]);

  // Filtered & sorted data
  const grouped = useMemo(() => groupByMahasiswa(ujian), [ujian]);
  const filteredData = useMemo(() => {
    let data = grouped
      // Filter: hanya tampilkan jika sudah lulus semua ujian
      .filter((ujianMhs) => sudahLulusSemua(ujianMhs))
      .filter((ujianMhs) => {
        const nama = ujianMhs[0].mahasiswa.nama.toLowerCase();
        const matchNama = nama.includes(filterNama.toLowerCase());
        let matchJenis = true;
        if (filterJenis !== "all") {
          matchJenis = ujianMhs.some(
            (u) => u.jenisUjian.namaJenis === filterJenis
          );
        }
        return matchNama && matchJenis;
      });

    // Sort by total nilai akhir
    data = [...data].sort((a, b) => {
      const totalA = hitungNilaiAkhir(a).total;
      const totalB = hitungNilaiAkhir(b).total;
      return nilaiOrder === "desc" ? totalB - totalA : totalA - totalB;
    });
    return data;
  }, [grouped, filterNama, filterJenis, nilaiOrder]);

  // TableGlobal columns
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
      accessorFn: (row: BeritaUjian[]) => row[0].mahasiswa.nama,
      id: "nama",
      header: "Nama Mahasiswa",
      cell: ({ row }: any) => (
        <div>
          {row.original[0].mahasiswa.nama}
          <div className="text-gray-500">{row.original[0].mahasiswa.nim}</div>
        </div>
      ),
      size: 120,
    },
    {
      accessorFn: (row: BeritaUjian[]) => row[0].judulPenelitian,
      id: "judul",
      header: "Judul Skripsi",
      cell: ({ row }: any) => (
        <div className="whitespace-pre-line break-all">
          {row.original[0].judulPenelitian}
        </div>
      ),
      size: 180,
    },
    {
      accessorFn: (row: BeritaUjian[]) => hitungNilaiAkhir(row).total,
      id: "hasilAkhir",
      header: "Hasil Akhir",
      cell: ({ row }: any) => {
        const total = hitungNilaiAkhir(row.original).total;
        return <span>{total.toFixed(2)}</span>;
      },
      size: 70,
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row, table }: any) => {
        const idx = table
          .getRowModel()
          .rows.findIndex((r: any) => r.id === row.id);
        const ujianMhs = row.original;
        const mhs = ujianMhs[0].mahasiswa;
        const judul = ujianMhs[0].judulPenelitian;
        const { total, detail } = hitungNilaiAkhir(ujianMhs);
        const nilaiHuruf =
          total >= 85
            ? "A"
            : total >= 75
            ? "B"
            : total >= 65
            ? "C"
            : total >= 55
            ? "D"
            : "E";

        const [openPopover, setOpenPopover] = useState(false);

        return (
          <div className="flex justify-center">
            <Popover open={openPopover} onOpenChange={setOpenPopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-1"
                  aria-label="Aksi"
                  tabIndex={0}
                  onClick={() => setOpenPopover((v) => !v)}
                >
                  <MoreHorizontal size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-2 w-[230px]" align="end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full flex items-center gap-2 justify-start"
                  onClick={() => {
                    setSelected({ mhs, judul, detail, total });
                    setOpen(true);
                    setOpenPopover(false);
                  }}
                >
                  <Eye size={14} />
                  Lihat Detail
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full flex items-center gap-2 justify-start  whitespace-normal"
                  onClick={() => {
                    const ujianProposal = ujianMhs.find(
                      (u: any) => getJenisUjian(u) === "proposal"
                    );
                    const ujianHasil = ujianMhs.find(
                      (u: any) => getJenisUjian(u) === "hasil"
                    );
                    const ujianSkripsi = ujianMhs.find(
                      (u: any) => getJenisUjian(u) === "skripsi"
                    );
                    const ujianUtama =
                      ujianSkripsi || ujianHasil || ujianProposal;
                    setSuratData({
                      nama: mhs.nama,
                      nim: mhs.nim,
                      nilaiHuruf,
                      total,
                      judul,
                      waktuMulai: ujianUtama?.waktuMulai ?? "-",
                      waktuSelesai: ujianUtama?.waktuSelesai ?? "-",
                      dosenPembimbing1:
                        ujianUtama?.mahasiswa.pembimbing1?.nama ?? "-",
                      dosenPembimbing2:
                        ujianUtama?.mahasiswa.pembimbing2?.nama ?? "-",
                      ketuaPenguji:
                        ujianUtama?.penguji.find(
                          (p: any) => p.peran === "ketua_penguji"
                        )?.nama ?? "-",
                      sekretarisPenguji:
                        ujianUtama?.penguji.find(
                          (p: any) => p.peran === "sekretaris_penguji"
                        )?.nama ?? "-",
                      ...(() => {
                        const pengujiLain = (ujianUtama?.penguji ?? [])
                          .filter(
                            (p: any) =>
                              p?.nama &&
                              p.peran !== "ketua_penguji" &&
                              p.peran !== "sekretaris_penguji"
                          )
                          .map((p: any) => p.nama);
                        return {
                          penguji1: pengujiLain[0] ?? "-",
                          penguji2: pengujiLain[1] ?? "-",
                        };
                      })(),
                    });
                    setOpenSurat(true);
                    setOpenPopover(false);
                  }}
                >
                  <span role="img" aria-label="Cetak">
                    <File size={16} />
                  </span>
                  Surat Keterangan Lulus
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        );
      },
      size: 80,
    },
  ];

  // TableGlobal setup
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const totalPage = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Sync aksiOpenArr with filteredData length
  useEffect(() => {
    setAksiOpenArr(Array(filteredData.length).fill(false));
  }, [filteredData.length]);

  const table = {
    getRowModel: () => ({
      rows: paginatedData.map((item, idx) => ({
        id: item[0].mahasiswa.id,
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
        id: item[0].mahasiswa.id,
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
      rows: filteredData.map((item, idx) => ({
        id: item[0].mahasiswa.id,
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
    <div className="bg-white p-6 rounded-lg dark:bg-neutral-900 border">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div className="flex gap-2 w-full ">
          <div className="relative w-full ">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>
            <Input
              placeholder="Search"
              value={filterNama}
              onChange={(e) => setFilterNama(e.target.value)}
              className="pl-10 w-full bg-white text-sm dark:bg-[#1f1f1f]"
              inputMode="text"
            />
          </div>

          {/* Ubah filter menjadi Popover */}
          <Popover open={openFilter} onOpenChange={setOpenFilter}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-9 flex items-center rounded-lg px-4 py-1 bg-white hover:bg-gray-50 font-medium"
              >
                <Settings2 size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-[220px] p-3" align="end">
              <div className="font-semibold mb-2 text-xs text-muted-foreground">
                Jenis Ujian
              </div>
              <div className="flex flex-col gap-1 mb-2">
                <Button
                  variant={filterJenis === "all" ? "secondary" : "ghost"}
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    setFilterJenis("all");
                    // Jangan tutup popover
                  }}
                >
                  Semua
                </Button>
                {jenisUjianOptions.map((jenis) => (
                  <Button
                    key={jenis}
                    variant={filterJenis === jenis ? "secondary" : "ghost"}
                    size="sm"
                    className="justify-start"
                    onClick={() => {
                      setFilterJenis(jenis);
                      // Jangan tutup popover
                    }}
                  >
                    {jenis}
                  </Button>
                ))}
              </div>
              <div className="font-semibold text-xs mb-2 text-muted-foreground">
                Urutkan Nilai Akhir
              </div>
              <div className="flex flex-col gap-1">
                {nilaiOrderOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    variant={nilaiOrder === opt.value ? "secondary" : "ghost"}
                    size="sm"
                    className="justify-start"
                    onClick={() => {
                      setNilaiOrder(opt.value as "asc" | "desc");
                      // Jangan tutup popover
                    }}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* TableGlobal rendering */}
      <TableGlobal table={table} cols={cols} />

      {/* Mobile list (small screens) */}
      <div className="sm:hidden mt-2">
        {filteredData.map((ujianMhs, idx) => {
          const mhs = ujianMhs[0].mahasiswa;
          const judul = ujianMhs[0].judulPenelitian;
          const { total, detail } = hitungNilaiAkhir(ujianMhs);
          const nilaiHuruf =
            total >= 85
              ? "A"
              : total >= 75
              ? "B"
              : total >= 65
              ? "C"
              : total >= 55
              ? "D"
              : "E";

          return (
            <div
              key={mhs.id}
              className="border rounded-lg p-3 mb-3 bg-white dark:bg-[#121212]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="font-medium">{mhs.nama}</div>
                  <div className="text-sm text-gray-500">{mhs.nim}</div>
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 break-words">
                    {judul}
                  </div>
                </div>
                <div className="flex flex-col items-end ml-2">
                  <div className="font-semibold">{total.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">{nilaiHuruf}</div>
                </div>
              </div>
              <div className="flex items-center justify-end mt-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setSelected({ mhs, judul, detail, total });
                    setOpen(true);
                  }}
                >
                  <Eye size={14} />
                  Lihat Detail
                </Button>
                <Popover
                  open={aksiOpenArr[idx]}
                  onOpenChange={(open) => {
                    setAksiOpenArr((prev) =>
                      prev.map((v, i) => (i === idx ? open : false))
                    );
                  }}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-1"
                      aria-label="Aksi"
                    >
                      <MoreHorizontal size={16} />
                      Lihat detail
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-2 w-full max-w-xs" align="end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full flex items-center gap-2 justify-start"
                      onClick={() => {
                        setSelected({ mhs, judul, detail, total });
                        setOpen(true);
                        setAksiOpenArr((prev) =>
                          prev.map((v, i) => (i === idx ? false : v))
                        );
                      }}
                    >
                      <Eye size={14} />
                      Lihat Detail
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full flex items-center gap-2 justify-start whitespace-normal"
                      onClick={() => {
                        const ujianProposal = ujianMhs.find(
                          (u) => getJenisUjian(u) === "proposal"
                        );
                        const ujianHasil = ujianMhs.find(
                          (u) => getJenisUjian(u) === "hasil"
                        );
                        const ujianSkripsi = ujianMhs.find(
                          (u) => getJenisUjian(u) === "skripsi"
                        );
                        const ujianUtama =
                          ujianSkripsi || ujianHasil || ujianProposal;
                        setSuratData({
                          nama: mhs.nama,
                          nim: mhs.nim,
                          nilaiHuruf,
                          total,
                          judul,
                          waktuMulai: ujianUtama?.waktuMulai ?? "-",
                          waktuSelesai: ujianUtama?.waktuSelesai ?? "-",
                          dosenPembimbing1:
                            ujianUtama?.mahasiswa.pembimbing1?.nama ?? "-",
                          dosenPembimbing2:
                            ujianUtama?.mahasiswa.pembimbing2?.nama ?? "-",
                          ketuaPenguji:
                            ujianUtama?.penguji.find(
                              (p: any) => p.peran === "ketua_penguji"
                            )?.nama ?? "-",
                          sekretarisPenguji:
                            ujianUtama?.penguji.find(
                              (p: any) => p.peran === "sekretaris_penguji"
                            )?.nama ?? "-",
                          // Loop penguji (selain ketua & sekretaris)
                          ...(() => {
                            const pengujiLain = (ujianUtama?.penguji ?? [])
                              .filter(
                                (p: any) =>
                                  p?.nama &&
                                  p.peran !== "ketua_penguji" &&
                                  p.peran !== "sekretaris_penguji"
                              )
                              .map((p: any) => p.nama);
                            return {
                              penguji1: pengujiLain[0] ?? "-",
                              penguji2: pengujiLain[1] ?? "-",
                            };
                          })(),
                        });
                        setOpenSurat(true);
                        setAksiOpenArr((prev) =>
                          prev.map((v, i) => (i === idx ? false : v))
                        );
                      }}
                    >
                      <File size={16} />
                      Surat Keterangan Lulus
                    </Button>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dialog Detail Nilai */}
      {open && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <Card className="max-w-2xl w-full relative shadow-2xl rounded-2xl border-none bg-white text-gray-900 dark:bg-[#232323] dark:text-white h-[90vh] flex flex-col">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setOpen(false)}
            >
              <X size={16} />
            </Button>
            <CardContent className="flex-1 flex flex-col px-8 py-8 overflow-y-auto">
              <div className="mb-6">
                <div className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  Rekapitulasi Nilai Skripsi
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-8 mb-2">
                  <div className="flex gap-2">
                    <span className="font-semibold text-gray-700 dark:text-gray-200 min-w-[90px]">
                      Nama: {selected.mhs.nama}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-200">
                    Judul Skripsi:
                  </span>
                  <div className="font-normal italic text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-line break-words">
                    {selected.judul}
                  </div>
                </div>
              </div>
              <div className=" dark:border-gray-700 mb-6" />
              <div className="border rounded-xl overflow-hidden  dark:bg-neutral-900 ">
                <Table className="w-full text-gray-900 dark:text-white">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center border px-3 py-2 bg-gray-100 dark:bg-[#232323] font-semibold">
                        No.
                      </TableHead>
                      <TableHead className="border px-3 py-2 bg-gray-100 dark:bg-[#232323] font-semibold">
                        Komponen
                      </TableHead>
                      <TableHead className="border px-3 py-2 bg-gray-100 dark:bg-[#232323] font-semibold">
                        Bobot %
                      </TableHead>
                      <TableHead className="border px-3 py-2 bg-gray-100 dark:bg-[#232323] font-semibold">
                        Skor
                      </TableHead>
                      <TableHead className="border px-3 py-2 bg-gray-100 dark:bg-[#232323] font-semibold">
                        Bobot × Skor
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selected.detail.map((d, i) => (
                      <TableRow
                        key={i}
                        className="hover:bg-gray-100 dark:hover:bg-[#222]"
                      >
                        <TableCell className="text-center border px-3 py-2">
                          {i + 1}
                        </TableCell>
                        <TableCell className="border px-3 py-2">
                          {d.jenis === "proposal"
                            ? "Seminar Proposal"
                            : d.jenis === "hasil"
                            ? "Ujian Hasil"
                            : "Ujian Skripsi"}
                        </TableCell>
                        <TableCell className="border px-3 py-2 text-center">
                          {d.bobot * 100}
                        </TableCell>
                        <TableCell className="border px-3 py-2 text-center">
                          {d.skor}
                        </TableCell>
                        <TableCell className="border px-3 py-2 text-center">
                          {d.nilai.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="font-bold text-right border px-3 py-2"
                      >
                        Total Angka Nilai
                      </TableCell>
                      <TableCell className="font-bold border px-3 py-2 text-lg text-blue-700 dark:text-blue-300 text-center">
                        {selected.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="font-bold text-right border px-3 py-2"
                      >
                        Nilai Huruf
                      </TableCell>
                      <TableCell className="font-bold border px-3 py-2 text-lg text-green-700 dark:text-green-300 tracking-wider text-center">
                        {selected.total >= 85
                          ? "A"
                          : selected.total >= 75
                          ? "B"
                          : selected.total >= 65
                          ? "C"
                          : selected.total >= 55
                          ? "D"
                          : "E"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal Preview Surat Keterangan Lulus - gunakan Card saja, tanpa Dialog */}
      {openSurat && suratData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <Card className="max-w-2xl h-[90vh] overflow-auto w-full border-none bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white relative shadow-2xl rounded-2xl">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={() => setOpenSurat(false)}
            >
              <X size={16} />
            </Button>
            <CardContent className="p-8">
              <div className="text-2xl font-bold mb-6 tracking-wide">
                Keterangan Lulus Ujian Skripsi
              </div>
              <div className="space-y-6">
                <p className="text-base">
                  Pada hari ini, tanggal{" "}
                  <span className="underline font-semibold text-blue-300">
                    {new Date().toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  , telah berlangsung ujian skripsi mahasiswa:
                </p>
                <div className="rounded-xl border border-neutral-700 bg-neutral-800 p-4 mb-2">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between border-b border-neutral-700 pb-2">
                      <span className="font-semibold text-neutral-300 w-40">
                        Nama
                      </span>
                      <span className="font-medium">{suratData.nama}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-neutral-700 pb-2">
                      <span className="font-semibold text-neutral-300 w-40">
                        NIM
                      </span>
                      <span className="font-medium">{suratData.nim}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-neutral-700 pb-2">
                      <span className="font-semibold text-neutral-300 w-40">
                        Program Studi
                      </span>
                      <span className="font-medium">SISTEM INFORMASI</span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="font-semibold text-neutral-300 w-40">
                        Judul Skripsi
                      </span>
                      <span className="font-medium whitespace-pre-line break-words text-right">
                        {suratData.judul}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-base">
                  Ujian berlangsung dari pukul{" "}
                  <span className="underline font-semibold text-blue-300">
                    {suratData.waktuMulai ?? "-"}
                  </span>
                  , sampai dengan{" "}
                  <span className="underline font-semibold text-blue-300">
                    {suratData.waktuSelesai ?? "-"}
                  </span>{" "}
                  WIB
                </p>
                <div className="rounded-xl border border-neutral-700 bg-neutral-800 p-4 mb-2">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between border-b border-neutral-700 pb-2">
                      <span className="font-semibold text-neutral-300 w-40">
                        Dosen Pembimbing I
                      </span>
                      <span className="font-medium">
                        {suratData.dosenPembimbing1 ?? "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-neutral-700 pb-2">
                      <span className="font-semibold text-neutral-300 w-40">
                        Dosen Pembimbing II
                      </span>
                      <span className="font-medium">
                        {suratData.dosenPembimbing2 ?? "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-neutral-700 pb-2">
                      <span className="font-semibold text-neutral-300 w-40">
                        Ketua Penguji
                      </span>
                      <span className="font-medium">
                        {suratData.ketuaPenguji ?? "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-neutral-700 pb-2">
                      <span className="font-semibold text-neutral-300 w-40">
                        Sekretaris Penguji
                      </span>
                      <span className="font-medium">
                        {suratData.sekretarisPenguji ?? "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-neutral-700 pb-2">
                      <span className="font-semibold text-neutral-300 w-40">
                        Penguji I
                      </span>
                      <span className="font-medium">
                        {suratData.penguji1 ?? "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-300 w-40">
                        Penguji II
                      </span>
                      <span className="font-medium">
                        {suratData.penguji2 ?? "-"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-center font-bold text-lg mt-4">
                  <span className="text-green-400">LULUS</span> dengan nilai:{" "}
                  <span className="tracking-wider text-blue-300 font-mono text-xl">
                    {suratData.total?.toFixed(2) ?? "............."}
                  </span>{" "}
                  (
                  <span className="underline text-green-400">
                    {suratData.nilaiHuruf}
                  </span>
                  )
                </div>
                <p className="text-base mt-4 text-neutral-300">
                  Demikian Surat Keterangan ini dibuat sebagai bukti dari hasil
                  Ujian Skripsi
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 mt-8">
                <PDFDownloadLink
                  document={
                    <SuratKeteranganLulusPDF {...(suratData ?? ({} as any))} />
                  }
                  fileName={`Surat_Lulus_${suratData?.nim ?? "data"}.pdf`}
                >
                  {({ loading }) => (
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800"
                    >
                      {loading ? (
                        "Menyiapkan..."
                      ) : (
                        <>
                          <DownloadIcon size={14} />
                          &nbsp;Download PDF
                        </>
                      )}
                    </Button>
                  )}
                </PDFDownloadLink>
                <Button
                  size="sm"
                  className="bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800"
                  onClick={() => setOpenSurat(false)}
                >
                  Tutup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
