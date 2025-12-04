/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useState, useEffect } from "react";
import { Ujian } from "@/types/Ujian";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import {
  Pencil,
  Eye,
  ChevronDown,
  ListFilter,
  SearchIcon,
  MoreHorizontal,
  Calendar,
  Clock,
  MapPin,
  X,
  Check,
  NotebookPen,
  TreeDeciduousIcon,
  Scale,
  Gavel,
} from "lucide-react";
import { IconClipboardText } from "@tabler/icons-react";
import { UserCheck } from "lucide-react";
import PenilaianModal from "./PenilaianModal";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";

import { Button } from "../ui/button";
import { getHadirUjian, setHadirUjian } from "@/actions/daftarHadirUjian";
import { Input } from "../ui/input";
import { getPenilaianByUjianId } from "@/actions/penilaian";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { postCatatanByUjianId } from "@/actions/catatan";
import { postKeputusanByUjianId } from "@/actions/keputusan";

interface JadwalUjianTableProps {
  jadwalUjian: Ujian[];
  currentDosenId: number | undefined;
}

interface Dosen {
  id: number;
  nama: string;
  nip?: string;
  nidn?: string;
}

interface PenilaianItem {
  // id optional karena rekap yang dihimpun mungkin tidak menyertakan dosenId eksplisit
  dosenId?: number;
  dosen: Dosen;
  // jabatan (Ketua/Sekretaris/Penguji) ditampilkan di rekapitulasi
  jabatan: string;
  // total angka nilai yang sudah dihitung (bobot * nilai)
  total: number;
  komponenPenilaian?: { bobot?: number };
  nilai?: number;
}

interface HadirUjian {
  id: number;
  ujianId: number;
  dosenId: number;
  statusKehadiran: string;
}

export default function JadwalUjianTable({
  jadwalUjian,
  currentDosenId,
}: JadwalUjianTableProps) {
  // state untuk sheet keputusan
  const [openKeputusan, setOpenKeputusan] = useState(false);
  // keputusanChoice menyimpan id numeric (1/2/3/4)
  const [keputusanChoice, setKeputusanChoice] = useState<number | null>(null);
  const [selected, setSelected] = useState<Ujian | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openRekapitulasi, setOpenRekapitulasi] = useState(false);
  const [openDaftarHadir, setOpenDaftarHadir] = useState(false);
  const [openCatatan, setOpenCatatan] = useState(false);

  //* Penilaian Modal State
  const [openPenilaian, setOpenPenilaian] = useState(false);
  const [penilaian, setPenilaian] = useState<Record<string, number>>({});
  const [hadirLoading, setHadirLoading] = useState<number | null>(null);
  const [hadirSukses, setHadirSukses] = useState<{
    [ujianId: number]: boolean;
  }>({});
  const [rekapPenilaian, setRekapPenilaian] = useState<PenilaianItem[]>([]);
  const [rekapLoading, setRekapLoading] = useState(false);
  const [hadirData, setHadirData] = useState<HadirUjian[]>([]);
  const [catatanText, setCatatanText] = useState<string>("");

  // Ambil data hadir uj
  useEffect(() => {
    getHadirUjian().then((data) => setHadirData(data ?? []));
  }, []);

  async function handleHadir(currentDosenId: number, ujianId: number) {
    setHadirLoading(ujianId);
    try {
      await setHadirUjian(currentDosenId, ujianId);
      setHadirSukses((prev) => ({ ...prev, [ujianId]: true }));
      const { toast } = await import("sonner");
      toast.success("Kehadiran Anda telah tercatat.");
    } catch (err) {
      console.error("Error mencatat kehadiran:", err);
      const { toast } = await import("sonner");
      toast.error("Terjadi kesalahan saat mencatat kehadiran.");
    } finally {
      setHadirLoading(null);
    }
  }

  // Helper: cek apakah dosen sudah absen untuk ujian tertentu
  function sudahHadir(ujianId: number, dosenId: number | undefined) {
    if (!dosenId) return false;
    return hadirData.some(
      (h) =>
        h.ujianId === ujianId &&
        h.dosenId === dosenId &&
        h.statusKehadiran === "hadir"
    );
  }

  // Helper: mapping penguji dari array
  function getPengujiList(ujian: Ujian) {
    if (!Array.isArray(ujian.penguji)) return [];
    return ujian.penguji.map((p) => ({
      ...p,
      label:
        p.peran === "ketua_penguji"
          ? "Ketua Penguji"
          : p.peran === "sekretaris_penguji"
          ? "Sekretaris Penguji"
          : p.peran === "penguji_1"
          ? "Penguji I"
          : p.peran === "penguji_2"
          ? "Penguji II"
          : p.peran,
    }));
  }

  // Helper: cek peran dosen pada ujian
  function getPeranPenguji(
    ujian: Ujian,
    dosenId: number | undefined
  ): string | null {
    if (!Array.isArray(ujian.penguji) || !dosenId) return null;

    const found = ujian.penguji.find((p) => p.id === Number(dosenId));
    if (!found) return null;

    switch (found.peran) {
      case "ketua_penguji":
        return "Ketua Penguji";
      case "sekretaris_penguji":
        return "Sekretaris Penguji";
      case "penguji_1":
        return "Penguji 1";
      case "penguji_2":
        return "Penguji 2";
      default:
        return found.peran;
    }
  }

  //* Filter & Pagination State
  const [filterPeran, setFilterPeran] = useState("all");
  const [search, setSearch] = useState("");
  //* State untuk filter jenis ujian
  const [filterJenisUjian, setFilterJenisUjian] = useState("all");

  //* Jenis ujian statis
  const jenisUjianList = ["Ujian Proposal", "Ujian Hasil", "Ujian Skripsi"];

  //* Filtered data
  const filteredData = jadwalUjian.filter((ujian) => {
    //* Filter by peran
    let matchPeran = true;
    if (filterPeran !== "all") {
      const peran = getPeranPenguji(ujian, currentDosenId);
      matchPeran = peran === filterPeran;
    }
    //* Filter by jenis ujian
    let matchJenis = true;
    if (filterJenisUjian !== "all") {
      matchJenis = ujian.jenisUjian?.namaJenis === filterJenisUjian;
    }
    //* Filter by search (nama mahasiswa, judul, ruangan)
    const q = search.toLowerCase();
    const matchSearch =
      (ujian.mahasiswa?.nama?.toLowerCase() ?? "").includes(q) ||
      (ujian.judulPenelitian?.toLowerCase() ?? "").includes(q) ||
      (ujian.ruangan?.namaRuangan?.toLowerCase() ?? "").includes(q);
    return matchPeran && matchJenis && matchSearch;
  });

  // Fetch penilaian saat modal rekapitulasi dibuka
  useEffect(() => {
    if (openRekapitulasi && selected?.id) {
      setRekapLoading(true);
      getPenilaianByUjianId(selected.id)
        .then((data) => {
          // Group by dosenId
          const group: Record<
            number,
            { dosen: Dosen; jabatan: string; total: number }
          > = {};

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.forEach((item: any) => {
            // Tentukan jabatan dosen
            const pengujiFound = selected.penguji.find(
              (p) => p.id === item.dosenId
            );

            let jabatan = "-";
            if (pengujiFound) {
              switch (pengujiFound.peran) {
                case "ketua_penguji":
                  jabatan = "Ketua Penguji";
                  break;
                case "sekretaris_penguji":
                  jabatan = "Sekretaris Penguji";
                  break;
                case "penguji_1":
                  jabatan = "Penguji I";
                  break;
                case "penguji_2":
                  jabatan = "Penguji II";
                  break;
              }
            }

            // Hitung bobot * nilai / 100
            const bobot = item.komponenPenilaian?.bobot ?? 0;
            const nilai = item.nilai ?? 0;
            const subtotal = (nilai * bobot) / 100;
            if (!group[item.dosenId]) {
              group[item.dosenId] = {
                dosen: item.dosen,
                jabatan,
                total: 0,
              };
            }
            group[item.dosenId].total += subtotal;
          });

          // Convert to array & urutkan sesuai jabatan
          const jabatanOrder = [
            "Ketua Penguji",
            "Sekretaris Penguji",
            "Penguji I",
            "Penguji II",
          ];
          const arr = Object.values(group).sort(
            (a, b) =>
              jabatanOrder.indexOf(a.jabatan) - jabatanOrder.indexOf(b.jabatan)
          );
          setRekapPenilaian(arr);
        })
        .finally(() => setRekapLoading(false));
    } else {
      setRekapPenilaian([]);
    }
  }, [openRekapitulasi, selected]);

  function getNilaiHuruf(rata: number) {
    if (rata >= 80) return "A";
    if (rata >= 70) return "B";
    if (rata >= 60) return "C";
    if (rata >= 56) return "D";
    return "E";
  }

  // isi catatanText saat sheet dibuka / selected berubah
  useEffect(() => {
    if (openCatatan && selected) {
      setCatatanText(selected.catatan ?? "");
    }
  }, [openCatatan, selected]);

  const handleSaveCatatan = async () => {
    await postCatatanByUjianId(selected?.id ?? null, catatanText);
    try {
      const { toast } = await import("sonner");
      toast.success("Catatan disimpan.");
    } catch {
      // ignore toast error
    }
    setOpenCatatan(false);
  };

  // keputusanId adalah numeric (1..4). UI tetap menampilkan teks label.
  const handleSetKeputusan = async (ujianId: number, keputusanId: number) => {
    // cari label untuk ditampilkan
    const opt = keputusanOptions.find((o) => o.id === keputusanId);
    const label = opt ? opt.label : String(keputusanId);

    // optimistik update selected: simpan hasil sebagai label (tampilan tetap string) dan simpan keputusanId
    setSelected((prev) =>
      prev && prev.id === ujianId
        ? { ...prev, hasil: label, keputusanId }
        : prev
    );

    try {
      await postKeputusanByUjianId(ujianId, keputusanId);
      const { toast } = await import("sonner");
      toast.success("Keputusan berhasil disimpan.");
    } catch (err) {
      console.error("Gagal menyimpan keputusan:", err);
      try {
        const { toast } = await import("sonner");
        toast.error("Gagal menyimpan keputusan.");
      } catch {}
    }
  };

  // daftar opsi keputusan (value = id, tampilkan label)
  const keputusanOptions = [
    { id: 1, kode: "A", label: "Dapat diterima tanpa perbaikan" },
    { id: 2, kode: "B", label: "Dapat diterima dengan perbaikan kecil" },
    { id: 3, kode: "C", label: "Dapat diterima dengan perbaikan besar" },
    { id: 4, kode: "D", label: "Belum dapat diterima" },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border dark:bg-neutral-900">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <span className="text-lg font-semibold">Jadwal Ujian</span>
        {/* Search bar & filter (right) */}
        <div className="flex w-full md:w-auto gap-2 md:justify-end md:ml-auto">
          <div className="relative w-full md:w-56 mt-0">
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm   px-8 rounded-lg  shadow-none bg-white"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none ">
              <SearchIcon size={16} />
            </span>
          </div>
          {/* Filter peran popover */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 flex items-center gap-2  rounded-md  font-normal shadow-none min-w-[90px] justify-between"
              >
                <span className="flex items-center gap-2">
                  <ListFilter size={13} />
                  Peran
                </span>
                <ChevronDown size={13} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 p-0 rounded-md shadow"
            >
              <div className="p-2">
                <div className="flex flex-col gap-1">
                  {[
                    { label: "Semua", value: "all" },
                    { label: "Ketua Penguji", value: "Ketua Penguji" },
                    {
                      label: "Sekretaris Penguji",
                      value: "Sekretaris Penguji",
                    },
                    { label: "Penguji 1", value: "Penguji 1" },
                    { label: "Penguji 2", value: "Penguji 2" },
                  ].map((item) => (
                    <DropdownMenuItem
                      key={item.value}
                      onClick={() => setFilterPeran(item.value)}
                      className="justify-between"
                    >
                      <span
                        className={
                          filterPeran === item.value ? "font-medium" : ""
                        }
                      >
                        {item.label}
                      </span>
                      {filterPeran === item.value && (
                        <Check size={16} className="ml-2" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Filter jenis ujian popover */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 flex items-center gap-2 rounded-lg  font-normal shadow-none min-w-[90px] justify-between"
              >
                <span className="flex items-center gap-2">
                  <ListFilter size={16} />
                  Jenis
                </span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 p-0 rounded-md shadow"
            >
              <div className="p-3">
                <div className="flex flex-col gap-1">
                  <DropdownMenuItem
                    onClick={() => setFilterJenisUjian("all")}
                    className="justify-between"
                  >
                    <span
                      className={
                        filterJenisUjian === "all" ? "font-medium" : ""
                      }
                    >
                      Semua
                    </span>
                    {filterJenisUjian === "all" && (
                      <Check size={16} className="ml-2" />
                    )}
                  </DropdownMenuItem>
                  {jenisUjianList.map((jenis) => (
                    <DropdownMenuItem
                      key={jenis}
                      onClick={() => setFilterJenisUjian(jenis)}
                      className="justify-between"
                    >
                      <span
                        className={
                          filterJenisUjian === jenis ? "font-medium" : ""
                        }
                      >
                        {jenis}
                      </span>
                      {filterJenisUjian === jenis && (
                        <Check size={16} className="ml-2" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="border overflow-auto rounded-lg">
        <Table>
          <TableHeader className="bg-sidebar-accent">
            <TableRow>
              <TableHead className="text-center">No</TableHead>
              <TableHead>Nama Mahasiswa</TableHead>
              <TableHead>Jenis Ujian</TableHead>
              <TableHead>Ruangan</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Peran Anda</TableHead>
              <TableHead>Nilai</TableHead>
              <TableHead>Hasil</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  Tidak ada jadwal ujian
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((ujian, idx) => {
                const waktuMulai = ujian.waktuMulai?.slice(0, 5) ?? "-";
                const waktuSelesai = ujian.waktuSelesai?.slice(0, 5) ?? "-";
                const tanggal = ujian.jadwalUjian?.split(/[ T]/)[0] ?? "-";
                function capitalize(str: string) {
                  return str.charAt(0).toUpperCase() + str.slice(1);
                }
                const peranPenguji = getPeranPenguji(ujian, currentDosenId);

                return (
                  <TableRow key={ujian.id}>
                    <TableCell className="text-center">{idx + 1}</TableCell>
                    <TableCell>{ujian.mahasiswa?.nama ?? "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded font-semibold ${
                          ujian.jenisUjian?.namaJenis === "Ujian Proposal"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                            : ujian.jenisUjian?.namaJenis === "Ujian Hasil"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                            : ujian.jenisUjian?.namaJenis === "Ujian Skripsi"
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {ujian.jenisUjian?.namaJenis ?? "-"}
                      </span>
                    </TableCell>
                    <TableCell>{ujian.ruangan?.namaRuangan ?? "-"}</TableCell>
                    <TableCell className="w-[20px]">
                      <div className="flex flex-col">
                        <span>
                          {capitalize(ujian.hariUjian ?? "-")}, {tanggal}
                        </span>
                        <span>
                          {waktuMulai} - {waktuSelesai}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {peranPenguji ? (
                        <span
                          className={`px-2 py-1 rounded font-semibold ${
                            peranPenguji === "Ketua Penguji"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
                              : peranPenguji === "Sekretaris Penguji"
                              ? "bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100"
                              : peranPenguji === "Penguji 1"
                              ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-800 dark:text-cyan-100"
                              : peranPenguji === "Penguji 2"
                              ? "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {peranPenguji}
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded font-semibold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-200">
                          -
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{ujian.nilaiAkhir ?? "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded font-semibold ${
                          ujian.hasil?.toLowerCase() === "lulus"
                            ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
                            : ujian.hasil?.toLowerCase() === "tidak lulus"
                            ? "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {ujian.hasil ?? "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label="Aksi">
                            <MoreHorizontal size={20} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelected(ujian);
                              setOpenDetail(true);
                            }}
                            className=""
                          >
                            <Eye size={16} className="mr-2" /> Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelected(ujian);
                              setOpenRekapitulasi(true);
                            }}
                            className=""
                          >
                            <IconClipboardText size={16} className="mr-2" />{" "}
                            Rekapitulasi Nilai
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelected(ujian);
                              setOpenDaftarHadir(true);
                            }}
                          >
                            <UserCheck size={16} className="mr-2" /> Daftar
                            Hadir
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelected(ujian);
                              setOpenPenilaian(true);
                            }}
                          >
                            <Pencil size={16} className="mr-2" /> Penilaian
                          </DropdownMenuItem>
                          {/* role check */}
                          {(() => {
                            const isKetuaAtauSek = ujian.penguji?.some(
                              (p) =>
                                p.id === Number(currentDosenId) &&
                                (p.peran === "ketua_penguji" ||
                                  p.peran === "sekretaris_penguji")
                            );
                            const jenis = ujian.jenisUjian?.namaJenis ?? "";
                            const isJenisUntukKeputusan =
                              jenis === "Ujian Hasil" ||
                              jenis === "Ujian Skripsi";
                            return (
                              isKetuaAtauSek && (
                                <>
                                  {/* Catatan: muncul untuk semua jenis ujian */}
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelected(ujian);
                                      setOpenCatatan(true);
                                    }}
                                  >
                                    <NotebookPen size={16} className="mr-2" />{" "}
                                    Catatan
                                  </DropdownMenuItem>

                                  {/* Keputusan: hanya untuk jenis Hasil & Skripsi */}
                                  {isJenisUntukKeputusan && (
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelected(ujian);
                                        const initId =
                                          (ujian as any).keputusanId ??
                                          keputusanOptions.find(
                                            (o) => o.label === ujian.hasil
                                          )?.id ??
                                          null;
                                        setKeputusanChoice(initId);
                                        setOpenKeputusan(true);
                                      }}
                                    >
                                      <Gavel size={16} className="mr-2" />{" "}
                                      <span className="mr-2">Keputusan</span>
                                    </DropdownMenuItem>
                                  )}
                                </>
                              )
                            );
                          })()}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Detail Popup (Card) */}
                      {openDetail && selected?.id === ujian.id && (
                        <div
                          className="fixed inset-0 z-50 flex items-center justify-center"
                          role="dialog"
                          aria-modal="true"
                          onKeyDown={(e) => {
                            if (e.key === "Escape") setOpenDetail(false);
                          }}
                        >
                          <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setOpenDetail(false)}
                          />
                          <div
                            className="relative z-10 w-full max-w-2xl mx-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Card>
                              <CardHeader className="flex items-start justify-between gap-4">
                                <div className="text-left">
                                  <h3 className="text-lg font-semibold">
                                    {ujian.mahasiswa?.nama ?? "-"}
                                  </h3>
                                  <div className="text-sm text-muted-foreground">
                                    {ujian.mahasiswa?.nim ?? "-"} •{" "}
                                    <span className="inline-flex items-center gap-1">
                                      <Calendar size={14} />{" "}
                                      {ujian.jadwalUjian?.split(/[ T]/)[0] ??
                                        "-"}
                                    </span>
                                  </div>
                                </div>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setOpenDetail(false)}
                                  aria-label="Tutup detail"
                                >
                                  <X size={16} />
                                </Button>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 text-left gap-4 text-sm">
                                  <div className="space-y-3">
                                    <div>
                                      <div className="text-xs text-muted-foreground">
                                        Judul Penelitian
                                      </div>
                                      <div className="mt-1 text-sm font-medium whitespace-pre-wrap break-words break-all max-w-full">
                                        {ujian.judulPenelitian ?? "-"}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-muted-foreground">
                                        Jenis Ujian
                                      </div>
                                      <div className="mt-1 inline-flex items-center gap-2">
                                        <span
                                          className={`px-2 py-1 rounded font-semibold text-xs ${
                                            ujian.jenisUjian?.namaJenis ===
                                            "Ujian Proposal"
                                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                                              : ujian.jenisUjian?.namaJenis ===
                                                "Ujian Hasil"
                                              ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                                              : "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                          }`}
                                        >
                                          {ujian.jenisUjian?.namaJenis ?? "-"}
                                        </span>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-xs text-muted-foreground">
                                        Waktu & Ruangan
                                      </div>
                                      <div className="mt-1 text-sm flex flex-col gap-1">
                                        <div className="inline-flex items-center gap-2">
                                          <Calendar size={14} />
                                          <span>
                                            {ujian.hariUjian ?? "-"} ,{" "}
                                            {ujian.jadwalUjian?.split(
                                              /[ T]/
                                            )[0] ?? "-"}
                                          </span>
                                        </div>
                                        <div className="inline-flex items-center gap-2">
                                          <Clock size={14} />
                                          <span>
                                            {ujian.waktuMulai?.slice(0, 5) ??
                                              "-"}{" "}
                                            -{" "}
                                            {ujian.waktuSelesai?.slice(0, 5) ??
                                              "-"}
                                          </span>
                                        </div>
                                        <div className="inline-flex items-center gap-2">
                                          <MapPin size={14} />
                                          <span>
                                            {ujian.ruangan?.namaRuangan ?? "-"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-3">
                                    <div>
                                      <div className="text-xs text-muted-foreground">
                                        Penguji
                                      </div>
                                      <div className="mt-2 space-y-2">
                                        {getPengujiList(ujian).map((p) => (
                                          <div
                                            key={p.id}
                                            className="flex items-center justify-between"
                                          >
                                            <div>
                                              <div className="text-xs text-muted-foreground">
                                                {p.label}
                                              </div>
                                              <div className="text-sm font-medium">
                                                {p.nama ?? "-"}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      )}

                      {/* Rekapitulasi Popup (Card) */}
                      {openRekapitulasi && selected?.id === ujian.id && (
                        <div
                          className="fixed inset-0 z-50 flex items-center justify-center"
                          role="dialog"
                          aria-modal="true"
                        >
                          <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setOpenRekapitulasi(false)}
                          />
                          <div
                            className="relative z-10 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Card>
                              <CardHeader className="text-center">
                                <CardTitle>
                                  Rekapitulasi Nilai{" "}
                                  {ujian.jenisUjian?.namaJenis}
                                </CardTitle>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {ujian.hariUjian ?? "-"} /{" "}
                                  {ujian.jadwalUjian?.split(/[ T]/)[0] ?? "-"}
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <div className="text-xs text-muted-foreground font-medium">
                                      Mahasiswa
                                    </div>
                                    <div className="font-semibold">
                                      {ujian.mahasiswa?.nama ?? "-"}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-muted-foreground font-medium">
                                      NIM
                                    </div>
                                    <div className="font-semibold">
                                      {ujian.mahasiswa?.nim ?? "-"}
                                    </div>
                                  </div>
                                  <div className="sm:col-span-2">
                                    <div className="text-xs text-muted-foreground font-medium mb-2">
                                      Judul Penelitian
                                    </div>
                                    <div className="font-medium border rounded px-3 py-2 dark:bg-sidebar-accent dark:text-white whitespace-normal break-words">
                                      {ujian.judulPenelitian ?? "-"}
                                    </div>
                                  </div>
                                </div>

                                <div className="overflow-x-auto rounded-md border border-muted mt-4">
                                  <Table>
                                    <TableHeader className="border-b">
                                      <TableRow>
                                        <TableHead className="w-8 text-center font-semibold">
                                          No.
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                          Nama
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                          Jabatan
                                        </TableHead>
                                        <TableHead className="font-semibold text-center">
                                          Angka Nilai
                                        </TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {rekapLoading ? (
                                        <TableRow>
                                          <TableCell
                                            colSpan={4}
                                            className="text-center py-4"
                                          >
                                            Loading...
                                          </TableCell>
                                        </TableRow>
                                      ) : rekapPenilaian.length === 0 ? (
                                        <TableRow>
                                          <TableCell
                                            colSpan={4}
                                            className="text-center py-4"
                                          >
                                            Tidak ada data penilaian
                                          </TableCell>
                                        </TableRow>
                                      ) : (
                                        rekapPenilaian.map((d, i) => (
                                          <TableRow key={d.dosen?.id || i}>
                                            <TableCell className="border-r text-center">
                                              {i + 1}
                                            </TableCell>
                                            <TableCell className="border-r">
                                              {d.dosen?.nama ?? "-"}
                                            </TableCell>
                                            <TableCell className="border-r">
                                              {d.jabatan}
                                            </TableCell>
                                            <TableCell className="text-center">
                                              {d.total.toFixed(2)}
                                            </TableCell>
                                          </TableRow>
                                        ))
                                      )}
                                    </TableBody>
                                  </Table>
                                </div>

                                {rekapPenilaian.length > 0 && (
                                  <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 pt-2">
                                    <div className="flex items-center gap-4">
                                      <span className="text-sm text-muted-foreground">
                                        Total
                                      </span>
                                      <span className="text-lg font-semibold">
                                        {rekapPenilaian
                                          .reduce((sum, d) => sum + d.total, 0)
                                          .toFixed(2)}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <span className="text-sm text-muted-foreground">
                                        Rata-rata
                                      </span>
                                      <span className="text-lg font-semibold">
                                        {(
                                          rekapPenilaian.reduce(
                                            (sum, d) => sum + d.total,
                                            0
                                          ) / rekapPenilaian.length
                                        ).toFixed(2)}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-muted-foreground">
                                        Nilai Huruf
                                      </span>
                                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-600 text-white font-semibold">
                                        {getNilaiHuruf(
                                          rekapPenilaian.reduce(
                                            (sum, d) => sum + d.total,
                                            0
                                          ) / rekapPenilaian.length
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                              <CardFooter className="flex justify-end">
                                <Button
                                  variant="default"
                                  onClick={() => setOpenRekapitulasi(false)}
                                >
                                  Tutup
                                </Button>
                              </CardFooter>
                            </Card>
                          </div>
                        </div>
                      )}

                      {/* Daftar Hadir Popup (Card) */}
                      {openDaftarHadir && selected?.id === ujian.id && (
                        <div
                          className="fixed inset-0 z-50 flex items-center justify-center"
                          role="dialog"
                          aria-modal="true"
                        >
                          <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setOpenDaftarHadir(false)}
                          />
                          <div
                            className="relative z-10 w-full max-w-4xl mx-4 max-h-[85vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Card>
                              <CardHeader className="flex items-center justify-between">
                                <CardTitle>
                                  Daftar Hadir {ujian.jenisUjian?.namaJenis}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="mb-4 mt-2">
                                  <div className="flex justify-between items-center gap-1">
                                    <span>
                                      <strong>Hari/Tanggal:</strong>{" "}
                                      {ujian.hariUjian ?? "-"} /{" "}
                                      {ujian.jadwalUjian?.split(/[ T]/)[0] ??
                                        "-"}
                                    </span>
                                    <span>
                                      <strong>Ruangan:</strong>{" "}
                                      {ujian.ruangan.namaRuangan ?? "-"}
                                    </span>
                                  </div>
                                </div>

                                <div className="rounded-md overflow-auto border border-muted">
                                  <Table>
                                    <TableHeader className="border-b">
                                      <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>NIP/NIDN</TableHead>
                                        <TableHead>Jabatan</TableHead>
                                        <TableHead className="text-center">
                                          Kehadiran
                                        </TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {getPengujiList(ujian).map((penguji) => (
                                        <TableRow key={penguji.id}>
                                          <TableCell className="text-left">
                                            {penguji.nama ?? "-"}
                                          </TableCell>
                                          <TableCell className="text-left">
                                            {penguji.nip ?? "-"}
                                            {penguji.nidn
                                              ? ` / ${penguji.nidn}`
                                              : ""}
                                          </TableCell>
                                          <TableCell className="text-left">
                                            {penguji.label}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {(() => {
                                              const hadir = sudahHadir(
                                                ujian.id,
                                                penguji.id
                                              );
                                              if (
                                                penguji.id === currentDosenId
                                              ) {
                                                return (
                                                  <Button
                                                    size="sm"
                                                    className={
                                                      hadir
                                                        ? "bg-green-200 text-green-700  font-semibold px-3 py-1 rounded-lg cursor-default"
                                                        : "bg-green-500 text-white  hover:bg-green-600 transition px-3 py-1 rounded-lg"
                                                    }
                                                    disabled={
                                                      hadirLoading ===
                                                        ujian.id || hadir
                                                    }
                                                    onClick={() =>
                                                      handleHadir(
                                                        currentDosenId!,
                                                        ujian.id
                                                      )
                                                    }
                                                  >
                                                    {hadirLoading === ujian.id
                                                      ? "Loading..."
                                                      : hadir
                                                      ? "Sudah Hadir"
                                                      : "Hadir"}
                                                  </Button>
                                                );
                                              } else {
                                                return hadir ? (
                                                  <span className="bg-green-200 text-green-700  font-semibold px-3 py-1 rounded-lg">
                                                    Sudah Hadir
                                                  </span>
                                                ) : (
                                                  "-"
                                                );
                                              }
                                            })()}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </CardContent>
                              <CardFooter className="flex justify-end">
                                <Button
                                  variant="ghost"
                                  onClick={() => setOpenDaftarHadir(false)}
                                >
                                  Tutup
                                </Button>
                              </CardFooter>
                            </Card>
                          </div>
                        </div>
                      )}

                      {/* Modal Penilaian */}
                      <PenilaianModal
                        open={openPenilaian && selected?.id === ujian.id}
                        onClose={() => setOpenPenilaian(false)}
                        ujian={ujian}
                        currentDosenId={currentDosenId}
                      />

                      {/* Sheet Catatan (render terpisah supaya muncul sebagai panel samping) */}
                      <Sheet
                        open={openCatatan && selected?.id === ujian.id}
                        onOpenChange={(v) => {
                          if (!v) setOpenCatatan(false);
                        }}
                      >
                        <SheetContent
                          side="right"
                          className="w-[420px] dark:bg-neutral-900"
                        >
                          <SheetHeader>
                            <SheetTitle>Tambahkan Catatan</SheetTitle>
                            <SheetDescription>
                              Tambahkan catatan tambahan untuk ujian ini jika
                              diperlukan.
                            </SheetDescription>
                          </SheetHeader>
                          <div className="grid flex-1 auto-rows-min gap-2 px-4">
                            <div className="grid gap-3">
                              <Label htmlFor="catatan">Catatan</Label>
                              <Textarea
                                id="catatan"
                                value={catatanText}
                                onChange={(e) => setCatatanText(e.target.value)}
                                className="min-h-[120px]"
                              />
                            </div>
                          </div>
                          <SheetFooter>
                            <Button onClick={handleSaveCatatan}>Save</Button>
                            <SheetClose asChild>
                              <Button variant="outline">Close</Button>
                            </SheetClose>
                          </SheetFooter>
                        </SheetContent>
                      </Sheet>

                      {/* Sheet Keputusan (Lulus / Tidak Lulus) */}
                      <Sheet
                        open={openKeputusan && selected?.id === ujian.id}
                        onOpenChange={(v) => {
                          if (!v) setOpenKeputusan(false);
                        }}
                      >
                        <SheetContent side="right" className="w-[420px]">
                          <SheetHeader>
                            <SheetTitle>Set Keputusan</SheetTitle>
                            <SheetDescription>
                              Pilih keputusan untuk ujian ini.
                            </SheetDescription>
                          </SheetHeader>
                          <div className="px-4 py-2">
                            <div className="flex flex-col gap-3 mt-3">
                              {keputusanOptions.map((opt) => (
                                <label
                                  key={opt.id}
                                  className="inline-flex items-center gap-2"
                                >
                                  <input
                                    type="radio"
                                    name="keputusan"
                                    checked={keputusanChoice === opt.id}
                                    onChange={() => setKeputusanChoice(opt.id)}
                                  />

                                  <div className="text-sm text-muted-foreground">
                                    {opt.label}
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                          <SheetFooter>
                            <Button
                              onClick={() => {
                                if (selected && keputusanChoice !== null) {
                                  handleSetKeputusan(
                                    selected.id,
                                    keputusanChoice
                                  );
                                }
                                setOpenKeputusan(false);
                              }}
                              disabled={keputusanChoice === null}
                            >
                              Simpan Keputusan
                            </Button>
                            <SheetClose asChild>
                              <Button variant="outline">Batal</Button>
                            </SheetClose>
                          </SheetFooter>
                        </SheetContent>
                      </Sheet>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
