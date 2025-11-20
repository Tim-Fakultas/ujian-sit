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
} from "lucide-react";
import { IconClipboardText } from "@tabler/icons-react";
import { UserCheck } from "lucide-react";
import PenilaianModal from "./PenilaianModal";
import Modal from "../Modal";
import { Button } from "../ui/button";
import { setHadirUjian } from "@/actions/daftarHadirUjian";
import { Input } from "../ui/input";

import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { getPenilaianByUjianId } from "@/actions/penilaian";
import { getHadirUjian } from "@/actions/daftarHadirUjian";

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
  const [selected, setSelected] = useState<Ujian | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openRekapitulasi, setOpenRekapitulasi] = useState(false);
  const [openDaftarHadir, setOpenDaftarHadir] = useState(false);

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
    return found.peran === "ketua_penguji"
      ? "Ketua Penguji"
      : found.peran === "sekretaris_penguji"
      ? "Sekretaris Penguji"
      : found.peran === "penguji_1"
      ? "Penguji 1"
      : found.peran === "penguji_2"
      ? "Penguji 2"
      : found.peran;
  }

  //* Filter & Pagination State
  const [filterPeran, setFilterPeran] = useState("all");
  const [search, setSearch] = useState("");
  //* State untuk popover filter
  const [openFilter, setOpenFilter] = useState(false);
  //* State untuk filter jenis ujian
  const [filterJenisUjian, setFilterJenisUjian] = useState("all");
  const [openFilterJenis, setOpenFilterJenis] = useState(false);

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
            let jabatan = "-";
            if (selected.penguji.id === item.dosenId) jabatan = "Ketua Penguji";
            else if (selected.penguji?.id === item.dosenId)
              jabatan = "Sekretaris Penguji";
            else if (selected.penguji.id === item.dosenId)
              jabatan = "Penguji I";
            else if (selected.penguji.id === item.dosenId)
              jabatan = "Penguji II";
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-[#1f1f1f]">
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
          <Popover open={openFilter} onOpenChange={setOpenFilter}>
            <PopoverTrigger asChild>
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
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-44 p-0 rounded-md  shadow"
              sideOffset={8}
            >
              <div className="p-3">
                <div className="font-semibold mb-2">Peran</div>
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
                    <Button
                      key={item.value}
                      variant={filterPeran === item.value ? "default" : "ghost"}
                      size="sm"
                      className={`justify-start w-full  rounded-md `}
                      onClick={() => {
                        setFilterPeran(item.value);
                        setOpenFilter(false);
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {/* Filter jenis ujian popover */}
          <Popover open={openFilterJenis} onOpenChange={setOpenFilterJenis}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 flex items-center gap-2  rounded-lg  font-normal shadow-none min-w-[90px] justify-between"
              >
                <span className="flex items-center gap-2">
                  <ListFilter size={16} />
                  Jenis
                </span>
                <ChevronDown size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className=" w-44 p-0 rounded-md   shadow"
              sideOffset={8}
            >
              <div className="p-3">
                <div className="font-semibold  mb-2 ">Jenis Ujian</div>
                <div className="flex flex-col gap-1">
                  <Button
                    variant={filterJenisUjian === "all" ? "default" : "ghost"}
                    size="sm"
                    className={`justify-start w-full rounded-md `}
                    onClick={() => {
                      setFilterJenisUjian("all");
                      setOpenFilterJenis(false);
                    }}
                  >
                    Semua
                  </Button>
                  {jenisUjianList.map((jenis) => (
                    <Button
                      key={jenis}
                      variant={filterJenisUjian === jenis ? "default" : "ghost"}
                      size="sm"
                      className={`justify-start w-full  rounded-md`}
                      onClick={() => {
                        setFilterJenisUjian(jenis);
                        setOpenFilterJenis(false);
                      }}
                    >
                      {jenis}
                    </Button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="border overflow-auto rounded-lg bg-white dark:bg-[#1f1f1f]">
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
                const waktuGabung = `${capitalize(
                  ujian.hariUjian ?? "-"
                )}, ${tanggal}, ${waktuMulai} - ${waktuSelesai}`;
                const peranPenguji = getPeranPenguji(ujian, currentDosenId);

                return (
                  <TableRow key={ujian.id}>
                    <TableCell className="text-center">{idx + 1}</TableCell>
                    <TableCell>{ujian.mahasiswa?.nama ?? "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded  font-semibold ${
                          ujian.jenisUjian?.namaJenis === "Ujian Proposal"
                            ? "bg-yellow-100 text-yellow-800"
                            : ujian.jenisUjian?.namaJenis === "Ujian Hasil"
                            ? "bg-blue-100 text-blue-800"
                            : ujian.jenisUjian?.namaJenis === "Ujian Skripsi"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {ujian.jenisUjian?.namaJenis ?? "-"}
                      </span>
                    </TableCell>
                    <TableCell>{ujian.ruangan.namaRuangan ?? "-"}</TableCell>
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
                              ? "bg-purple-100 text-purple-800"
                              : peranPenguji === "Sekretaris Penguji"
                              ? "bg-pink-100 text-pink-800"
                              : peranPenguji === "Penguji 1"
                              ? "bg-cyan-100 text-cyan-800"
                              : peranPenguji === "Penguji 2"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {peranPenguji}
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded  font-semibold bg-gray-100 text-gray-600">
                          -
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{ujian.nilaiAkhir ?? "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded  font-semibold ${
                          ujian.hasil?.toLowerCase() === "lulus"
                            ? "bg-green-100 text-green-700"
                            : ujian.hasil?.toLowerCase() === "tidak lulus"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
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
                            className=""
                          >
                            <UserCheck size={16} className="mr-2" /> Daftar
                            Hadir
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelected(ujian);
                              setOpenPenilaian(true);
                            }}
                            className=""
                          >
                            <Pencil size={16} className="mr-2" /> Penilaian
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Modal Detail */}
                      <Modal
                        open={openDetail && selected?.id === ujian.id}
                        onClose={() => setOpenDetail(false)}
                      >
                        <div className="text-left">
                          <h2 className="text-lg font-bold mb-2">
                            Detail Jadwal Ujian
                          </h2>
                          <div className="space-y-2 mt-2">
                            <div>
                              <strong>Nama Mahasiswa:</strong>{" "}
                              {ujian.mahasiswa?.nama}
                            </div>
                            <div>
                              <strong>NIM:</strong> {ujian.mahasiswa?.nim}
                            </div>
                            <div>
                              <strong>Judul Penelitian:</strong>{" "}
                              {ujian.judulPenelitian}
                            </div>
                            <div>
                              <strong>Jenis Ujian:</strong>{" "}
                              {ujian.jenisUjian?.namaJenis}
                            </div>
                            <div>
                              <strong>Ruangan:</strong>{" "}
                              {ujian.ruangan.namaRuangan}
                            </div>
                            <div>
                              <strong>Waktu:</strong> {waktuGabung}
                            </div>
                            {/* Loop penguji */}
                            {getPengujiList(ujian).map((penguji) => (
                              <div key={penguji.id}>
                                <strong>{penguji.label}:</strong> {penguji.nama}
                              </div>
                            ))}
                            <div>
                              <strong>Peran Anda:</strong> {peranPenguji ?? "-"}
                            </div>
                          </div>
                        </div>
                      </Modal>

                      {/* Modal Rekapitulasi Nilai */}
                      <Modal
                        open={openRekapitulasi && selected?.id === ujian.id}
                        onClose={() => setOpenRekapitulasi(false)}
                        className="max-h-[80vh] overflow-y-auto w-full max-w-2xl"
                      >
                        <div className="space-y-4">
                          <div className="text-center">
                            <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-gray-100">
                              Rekapitulasi Nilai {ujian.jenisUjian?.namaJenis}
                            </h2>
                            <div className="text-sm text-muted-foreground">
                              {ujian.hariUjian ?? "-"} /{" "}
                              {ujian.jadwalUjian?.split(/[ T]/)[0] ?? "-"}
                            </div>
                          </div>
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
                              <div className="font-medium border rounded px-3 py-2 bg-gray-900/80 text-white dark:bg-sidebar-accent dark:text-white whitespace-normal break-words">
                                {ujian.judulPenelitian ?? "-"}
                              </div>
                            </div>
                          </div>
                          <div className="overflow-x-auto rounded-lg border border-muted">
                            <Table className="min-w-[500px]">
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-8 text-center font-semibold border-r">
                                    No.
                                  </TableHead>
                                  <TableHead className="font-semibold border-r">
                                    Nama
                                  </TableHead>
                                  <TableHead className="font-semibold border-r">
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
                          {/* Ringkasan nilai */}
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
                        </div>
                      </Modal>

                      {/* Modal Daftar Hadir Ujian */}
                      <Modal
                        open={openDaftarHadir && selected?.id === ujian.id}
                        onClose={() => setOpenDaftarHadir(false)}
                        className="max-w-4xl w-full max-h-[85vh] overflow-y-auto "
                      >
                        <div>
                          <h2 className="text-lg font-bold mb-2">
                            Daftar Hadir {ujian.jenisUjian?.namaJenis}
                          </h2>
                          <div className="mb-4 mt-2">
                            <div className="flex flex-col gap-1">
                              <span>
                                <strong>Hari/Tanggal:</strong>{" "}
                                {ujian.hariUjian ?? "-"} /{" "}
                                {ujian.jadwalUjian?.split(/[ T]/)[0] ?? "-"}
                              </span>
                              <span>
                                <strong>Ruangan:</strong>{" "}
                                {ujian.ruangan.namaRuangan ?? "-"}
                              </span>
                            </div>
                          </div>
                          <div className="rounded-lg overflow-auto">
                            <Table>
                              <TableHeader>
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
                                {getPengujiList(ujian).map((penguji, idx) => (
                                  <TableRow key={penguji.id}>
                                    <TableCell className="text-left">
                                      {penguji.nama ?? "-"}
                                    </TableCell>
                                    <TableCell className="text-left">
                                      {penguji.nip ?? "-"}
                                      {penguji.nidn ? ` / ${penguji.nidn}` : ""}
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
                                        if (penguji.id === currentDosenId) {
                                          return (
                                            <Button
                                              size="sm"
                                              className={
                                                hadir
                                                  ? "bg-green-200 text-green-700  font-semibold px-3 py-1 rounded-lg cursor-default"
                                                  : "bg-green-500 text-white  hover:bg-green-600 transition px-3 py-1 rounded-lg"
                                              }
                                              disabled={
                                                hadirLoading === ujian.id ||
                                                hadir
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
                        </div>
                      </Modal>

                      {/* Modal Penilaian */}
                      <PenilaianModal
                        open={openPenilaian && selected?.id === ujian.id}
                        onClose={() => setOpenPenilaian(false)}
                        ujian={ujian}
                        penilaian={penilaian}
                        setPenilaian={setPenilaian}
                      />
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
