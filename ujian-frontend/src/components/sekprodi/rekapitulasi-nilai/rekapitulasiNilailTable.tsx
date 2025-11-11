"use client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { BeritaUjian } from "@/types/BeritaUjian";
import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
} from "lucide-react";

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
    let data = grouped.filter((ujianMhs) => {
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

  // Sync aksiOpenArr with filteredData length
  React.useEffect(() => {
    setAksiOpenArr(Array(filteredData.length).fill(false));
  }, [filteredData.length]);

  return (
    <div>
      {/* Search & Filter Bar */}
      <div className="flex items-center justify-end gap-2 mb-4">
        <div className="relative w-full max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={16} />
          </span>
          <Input
            placeholder="Search nama mahasiswa"
            value={filterNama}
            onChange={(e) => setFilterNama(e.target.value)}
            className="pl-10 w-full text-xs placeholder:text-xs"
            inputMode="text"
            style={{ fontSize: "0.75rem" }}
          />
        </div>
        <Popover open={openFilter} onOpenChange={setOpenFilter}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="flex items-center border border-gray-200 rounded-lg px-4 py-1 bg-white text-gray-700 hover:bg-gray-50 text-xs font-medium shadow-sm"
            >
              <ListFilter size={16} className="mr-2" />
              Filter
              <ChevronDown size={16} className="ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2 text-xs" align="end">
            <div className="font-semibold mb-2">Jenis Ujian</div>
            <div className="flex flex-col gap-1 mb-2">
              <Button
                variant={filterJenis === "all" ? "secondary" : "ghost"}
                size="sm"
                className="justify-start text-xs"
                onClick={() => {
                  setFilterJenis("all");
                  setOpenFilter(false);
                }}
              >
                Semua
              </Button>
              {jenisUjianOptions.map((jenis) => (
                <Button
                  key={jenis}
                  variant={filterJenis === jenis ? "secondary" : "ghost"}
                  size="sm"
                  className="justify-start text-xs"
                  onClick={() => {
                    setFilterJenis(jenis);
                    setOpenFilter(false);
                  }}
                >
                  {jenis}
                </Button>
              ))}
            </div>
            <div className="font-semibold mb-2">Urutkan Nilai Akhir</div>
            <div className="flex flex-col gap-1">
              {nilaiOrderOptions.map((opt) => (
                <Button
                  key={opt.value}
                  variant={nilaiOrder === opt.value ? "secondary" : "ghost"}
                  size="sm"
                  className="justify-start text-xs"
                  onClick={() => {
                    setNilaiOrder(opt.value as "asc" | "desc");
                    setOpenFilter(false);
                  }}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Table */}
      <div className="border overflow-auto rounded-sm">
        <Table className="text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-10">No</TableHead>
              <TableHead>Nama Mahasiswa</TableHead>
              <TableHead>Judul Skripsi</TableHead>
              <TableHead>Hasil Akhir</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((ujianMhs, idx) => {
              const mhs = ujianMhs[0].mahasiswa;
              const judul = ujianMhs[0].judulPenelitian;
              const { total, detail } = hitungNilaiAkhir(ujianMhs);

              return (
                <TableRow
                  key={mhs.id}
                  className="hover:bg-gray-50 transition text-xs"
                >
                  <TableCell className="text-center">{idx + 1}</TableCell>
                  <TableCell>
                    <div>
                      {mhs.nama}
                      <div className="text-xs text-gray-500">{mhs.nim}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="whitespace-pre-line break-all">{judul}</div>
                  </TableCell>
                  <TableCell>{total.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
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
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-36 p-2 text-xs" align="end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full flex items-center gap-2 justify-start text-xs"
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
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Dialog Detail Nilai */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rekapitulasi Nilai Skripsi</DialogTitle>
          </DialogHeader>
          {selected && (
            <>
              <h3 className="mb-2 text-sm">Nama: {selected.mhs.nama}</h3>
              <h3 className="mb-2 whitespace-pre-line break-all text-sm">
                Judul Skripsi: <br />
                {selected.judul}
              </h3>
              <Table className="w-full mt-2 border">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">No.</TableHead>
                    <TableHead>Komponen</TableHead>
                    <TableHead>Bobot %</TableHead>
                    <TableHead>Skor</TableHead>
                    <TableHead>Bobot * Skor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selected.detail.map((d, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-center">{i + 1}</TableCell>
                      <TableCell>
                        {d.jenis === "proposal"
                          ? "Seminar Proposal"
                          : d.jenis === "hasil"
                          ? "Ujian Hasil"
                          : "Ujian Skripsi"}
                      </TableCell>
                      <TableCell>{d.bobot * 100}</TableCell>
                      <TableCell>{d.skor}</TableCell>
                      <TableCell>{d.nilai.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} className="font-bold text-right">
                      Total Angka Nilai
                    </TableCell>
                    <TableCell className="font-bold">
                      {selected.total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4} className="font-bold text-right">
                      Nilai Huruf
                    </TableCell>
                    <TableCell className="font-bold">
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
              <DialogFooter>
                <button
                  className="mt-2 px-3 py-1 bg-gray-200 rounded"
                  onClick={() => setOpen(false)}
                >
                  Tutup
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
