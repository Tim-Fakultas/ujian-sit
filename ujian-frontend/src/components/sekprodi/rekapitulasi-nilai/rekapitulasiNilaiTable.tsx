/* eslint-disable @typescript-eslint/no-explicit-any */
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
  File,
  DownloadIcon,
  X,
} from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { SuratKeteranganLulusPDF } from "@/components/pdf/SuratKeteranganLulus";
import { Card, CardContent } from "@/components/ui/card";

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

  // Sync aksiOpenArr with filteredData length
  React.useEffect(() => {
    setAksiOpenArr(Array(filteredData.length).fill(false));
  }, [filteredData.length]);

  return (
    <div className="bg-white p-6 rounded-lg dark:bg-[#1f1f1f]">
      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <h1 className="font-semibold text-lg">Rekapitulasi Nilai</h1>

        <div className="flex gap-2 ">
          <div className="relative w-56">
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

          <Popover open={openFilter} onOpenChange={setOpenFilter}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-9 flex items-center rounded-lg px-4 py-1 bg-white  hover:bg-gray-50  font-medium "
              >
                <ListFilter size={16} className="mr-2" />
                Filter
                <ChevronDown size={16} className="ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-45 p-2 " align="end">
              <div className="font-semibold mb-2 text-xs">Jenis Ujian</div>
              <div className="flex flex-col gap-1 mb-2">
                <Button
                  variant={filterJenis === "all" ? "secondary" : "ghost"}
                  size="sm"
                  className="justify-start "
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
                    className="justify-start "
                    onClick={() => {
                      setFilterJenis(jenis);
                      setOpenFilter(false);
                    }}
                  >
                    {jenis}
                  </Button>
                ))}
              </div>
              <div className="font-semibold text-xs mb-2">
                Urutkan Nilai Akhir
              </div>
              <div className="flex flex-col gap-1">
                {nilaiOrderOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    variant={nilaiOrder === opt.value ? "secondary" : "ghost"}
                    size="sm"
                    className="justify-start "
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
      </div>

      {/* Table */}
      <div className="border bg-white overflow-auto rounded-lg dark:bg-[#1f1f1f] ">
        <Table>
          <TableHeader className="bg-sidebar-accent">
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
                <TableRow key={mhs.id} className="hover:bg-gray-50 transition ">
                  <TableCell className="text-center">{idx + 1}</TableCell>
                  <TableCell>
                    <div>
                      {mhs.nama}
                      <div className=" text-gray-500">{mhs.nim}</div>
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
                      <PopoverContent className="p-2  w-[230px]" align="end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full flex items-center gap-2 justify-start "
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
                          className="w-full flex items-center gap-2 justify-start  whitespace-normal"
                          onClick={() => {
                            // Ambil data dari ujianMhs
                            const ujianProposal = ujianMhs.find(
                              (u) => getJenisUjian(u) === "proposal"
                            );
                            const ujianHasil = ujianMhs.find(
                              (u) => getJenisUjian(u) === "hasil"
                            );
                            const ujianSkripsi = ujianMhs.find(
                              (u) => getJenisUjian(u) === "skripsi"
                            );
                            // Pilih salah satu untuk waktu dan penguji, prioritas skripsi > hasil > proposal
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
                                ujianUtama?.ketuaPenguji?.nama ?? "-",
                              sekretarisPenguji:
                                ujianUtama?.sekretarisPenguji?.nama ?? "-",
                              penguji1: ujianUtama?.penguji1?.nama ?? "-",
                              penguji2: ujianUtama?.penguji2?.nama ?? "-",
                            });
                            setOpenSurat(true);
                            setAksiOpenArr((prev) =>
                              prev.map((v, i) => (i === idx ? false : v))
                            );
                          }}
                        >
                          <span role="img" aria-label="Cetak">
                            <File size={16} />
                          </span>
                          Surat Keterangan Lulus
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
      {open && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <Card className="max-w-2xl w-full relative shadow-2xl rounded-xl border-none bg-white text-gray-900 dark:bg-[#232323] dark:text-white h-[90vh]">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setOpen(false)}
            >
              <X size={16} />
            </Button>
            <CardContent className="px-8 py-4">
              <div className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                Rekapitulasi Nilai Skripsi
              </div>
              <div className="mb-1 text-base font-medium text-gray-900 dark:text-white">
                Nama: <span className="font-normal">{selected.mhs.nama}</span>
              </div>
              <div className="mb-3 whitespace-pre-line break-all text-base font-medium text-gray-900 dark:text-white">
                Judul Skripsi:
                <div className="font-normal mt-1">{selected.judul}</div>
              </div>
              <div className="border rounded-lg overflow-hidden bg-gray-50 dark:bg-[#181818]">
                <Table className="w-full mt-2 text-gray-900 dark:text-white">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center text-gray-900 dark:text-white">
                        No.
                      </TableHead>
                      <TableHead className="text-gray-900 dark:text-white">
                        Komponen
                      </TableHead>
                      <TableHead className="text-gray-900 dark:text-white">
                        Bobot %
                      </TableHead>
                      <TableHead className="text-gray-900 dark:text-white">
                        Skor
                      </TableHead>
                      <TableHead className="text-gray-900 dark:text-white">
                        Bobot * Skor
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selected.detail.map((d, i) => (
                      <TableRow
                        key={i}
                        className="hover:bg-gray-100 dark:hover:bg-[#222]"
                      >
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
                      <TableCell
                        colSpan={4}
                        className="font-bold text-right bg-white dark:bg-[#232323]"
                      >
                        Total Angka Nilai
                      </TableCell>
                      <TableCell className="font-bold bg-white dark:bg-[#232323]">
                        {selected.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="font-bold text-right bg-white dark:bg-[#232323]"
                      >
                        Nilai Huruf
                      </TableCell>
                      <TableCell className="font-bold bg-white dark:bg-[#232323]">
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
          <Card className="max-w-2xl h-[90vh] overflow-auto w-full border-none bg-white text-gray-900 dark:bg-[#232323] dark:text-white relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-900 dark:hover:text-white"
              onClick={() => setOpenSurat(false)}
            >
              <X size={16} />
            </Button>
            <CardContent className="p-6">
              <div className="text-xl font-bold mb-4">
                Keterangan Lulus Ujian Skripsi
              </div>
              <div className="space-y-4">
                <p>
                  Pada hari ini, tanggal{" "}
                  <span className="underline">
                    {new Date().toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  , telah berlangsung ujian skripsi mahasiswa:
                </p>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="w-32 font-medium">Nama</TableCell>
                      <TableCell className="w-4">:</TableCell>
                      <TableCell>{suratData.nama}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">NIM</TableCell>
                      <TableCell>:</TableCell>
                      <TableCell>{suratData.nim}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Program Studi
                      </TableCell>
                      <TableCell>:</TableCell>
                      <TableCell>SISTEM INFORMASI</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Judul Skripsi
                      </TableCell>
                      <TableCell>:</TableCell>
                      <TableCell className="whitespace-pre-line break-words">
                        {suratData.judul}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <p>
                  Ujian berlangsung dari pukul{" "}
                  <span className="underline">
                    {suratData.waktuMulai ?? "-"}
                  </span>
                  , sampai dengan{" "}
                  <span className="underline">
                    {suratData.waktuSelesai ?? "-"}
                  </span>{" "}
                  WIB
                </p>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="w-40 font-medium">
                        Dosen Pembimbing I
                      </TableCell>
                      <TableCell className="w-4">:</TableCell>
                      <TableCell>{suratData.dosenPembimbing1 ?? "-"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Dosen Pembimbing II
                      </TableCell>
                      <TableCell>:</TableCell>
                      <TableCell>{suratData.dosenPembimbing2 ?? "-"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Ketua Penguji
                      </TableCell>
                      <TableCell>:</TableCell>
                      <TableCell>{suratData.ketuaPenguji ?? "-"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Sekretaris Penguji
                      </TableCell>
                      <TableCell>:</TableCell>
                      <TableCell>
                        {suratData.sekretarisPenguji ?? "-"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Penguji I</TableCell>
                      <TableCell>:</TableCell>
                      <TableCell>{suratData.penguji1 ?? "-"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Penguji II</TableCell>
                      <TableCell>:</TableCell>
                      <TableCell>{suratData.penguji2 ?? "-"}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="text-center font-bold text-sm mt-2">
                  LULUS dengan nilai:{" "}
                  <span className="tracking-wider">
                    {suratData.total?.toFixed(2) ?? "............."}
                  </span>{" "}
                  (<span className="underline">{suratData.nilaiHuruf}</span>)
                </div>
                <p>
                  Demikian Surat Keterangan ini dibuat sebagai bukti dari hasil
                  Ujian Skripsi
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 mt-6">
                <PDFDownloadLink
                  document={
                    <SuratKeteranganLulusPDF {...(suratData ?? ({} as any))} />
                  }
                  fileName={`Surat_Lulus_${suratData?.nim ?? "data"}.pdf`}
                >
                  {({ loading }) => (
                    <Button variant="outline" size="sm">
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
                <Button size="sm" onClick={() => setOpenSurat(false)}>
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
