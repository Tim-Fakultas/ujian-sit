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
  const [rekapPenilaian, setRekapPenilaian] = useState<any[]>([]);
  const [rekapLoading, setRekapLoading] = useState(false);
  const [hadirData, setHadirData] = useState<any[]>([]);

  // Ambil data hadir ujian sekali saat komponen mount
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

  //* Fungsi untuk menentukan peran penguji
  function getPeranPenguji(
    ujian: Ujian,
    dosenId: number | undefined
  ): string | null {
    if (ujian.ketuaPenguji?.id === Number(dosenId)) return "Ketua Penguji";
    if (ujian.sekretarisPenguji?.id === Number(dosenId))
      return "Sekretaris Penguji";
    if (ujian.penguji1?.id === Number(dosenId)) return "Penguji 1";
    if (ujian.penguji2?.id === Number(dosenId)) return "Penguji 2";
    return null;
  }

  //* Filter & Pagination State
  const [filterPeran, setFilterPeran] = useState("all");
  const [search, setSearch] = useState("");
  // State untuk popover filter
  const [openFilter, setOpenFilter] = useState(false);
  // State untuk filter jenis ujian
  const [filterJenisUjian, setFilterJenisUjian] = useState("all");
  const [openFilterJenis, setOpenFilterJenis] = useState(false);

  // Jenis ujian statis
  const jenisUjianList = ["Ujian Proposal", "Ujian Hasil", "Ujian Skripsi"];

  //* Filtered data
  const filteredData = jadwalUjian.filter((ujian) => {
    // Filter by peran
    let matchPeran = true;
    if (filterPeran !== "all") {
      const peran = getPeranPenguji(ujian, currentDosenId);
      matchPeran = peran === filterPeran;
    }
    // Filter by jenis ujian
    let matchJenis = true;
    if (filterJenisUjian !== "all") {
      matchJenis = ujian.jenisUjian?.namaJenis === filterJenisUjian;
    }
    // Filter by search (nama mahasiswa, judul, ruangan)
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
            {
              dosen: any;
              jabatan: string;
              total: number;
            }
          > = {};

          data.forEach((item: any) => {
            // Tentukan jabatan dosen
            let jabatan = "-";
            if (selected.ketuaPenguji?.id === item.dosenId)
              jabatan = "Ketua Penguji";
            else if (selected.sekretarisPenguji?.id === item.dosenId)
              jabatan = "Sekretaris Penguji";
            else if (selected.penguji1?.id === item.dosenId)
              jabatan = "Penguji I";
            else if (selected.penguji2?.id === item.dosenId)
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

  // Fungsi nilai huruf
  function getNilaiHuruf(rata: number) {
    if (rata >= 80) return "A";
    if (rata >= 70) return "B";
    if (rata >= 60) return "C";
    if (rata >= 56) return "D";
    return "E";
  }

  return (
    <div className="">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        {/* Search bar & filter (right) */}
        <div className="flex w-full md:w-auto gap-2 md:justify-end md:ml-auto">
          <div className="relative w-full md:w-72 mt-0">
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs placeholder:text-xs h-8 px-8 rounded-md border border-gray-200 shadow-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
              <SearchIcon size={16} />
            </span>
          </div>
          {/* Filter peran popover */}
          <Popover open={openFilter} onOpenChange={setOpenFilter}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 flex items-center gap-2 border border-gray-200 rounded-md text-xs font-normal shadow-none min-w-[90px] justify-between"
                style={{ boxShadow: "0 1px 2px 0 rgba(16,24,40,.05)" }}
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
              className="w-44 p-0 rounded-md border border-gray-200 shadow"
              sideOffset={8}
            >
              <div className="p-3">
                <div className="font-semibold text-xs mb-2 text-gray-700">
                  Peran
                </div>
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
                      className={`justify-start w-full text-xs rounded-md ${
                        filterPeran === item.value
                          ? "bg-blue-100 text-blue-700 border-blue-400"
                          : ""
                      }`}
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
                className="h-8 px-3 flex items-center gap-2 border border-gray-200 rounded-md text-xs font-normal shadow-none min-w-[90px] justify-between"
                style={{ boxShadow: "0 1px 2px 0 rgba(16,24,40,.05)" }}
              >
                <span className="flex items-center gap-2">
                  <ListFilter size={13} />
                  Jenis
                </span>
                <ChevronDown size={13} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-44 p-0 rounded-md border border-gray-200 shadow"
              sideOffset={8}
            >
              <div className="p-3">
                <div className="font-semibold text-xs mb-2 text-gray-700">
                  Jenis Ujian
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    variant={filterJenisUjian === "all" ? "default" : "ghost"}
                    size="sm"
                    className={`justify-start w-full text-xs rounded-md ${
                      filterJenisUjian === "all"
                        ? "bg-blue-100 text-blue-700 border-blue-400"
                        : ""
                    }`}
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
                      className={`justify-start w-full text-xs rounded-md ${
                        filterJenisUjian === jenis
                          ? "bg-blue-100 text-blue-700 border-blue-400"
                          : ""
                      }`}
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
      <div className="border overflow-auto rounded-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
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
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{ujian.mahasiswa?.nama ?? "-"}</TableCell>
                    <TableCell>{ujian.jenisUjian?.namaJenis ?? "-"}</TableCell>
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
                    <TableCell>{peranPenguji ?? "-"}</TableCell>
                    <TableCell>{ujian.nilaiAkhir ?? "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
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
                            className="text-xs"
                          >
                            <Eye size={16} className="mr-2" /> Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelected(ujian);
                              setOpenRekapitulasi(true);
                            }}
                            className="text-xs"
                          >
                            <IconClipboardText size={16} className="mr-2" />{" "}
                            Rekapitulasi Nilai
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelected(ujian);
                              setOpenDaftarHadir(true);
                            }}
                            className="text-xs"
                          >
                            <UserCheck size={16} className="mr-2" /> Daftar
                            Hadir Ujian
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelected(ujian);
                              setOpenPenilaian(true);
                            }}
                            className="text-xs"
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
                            <div>
                              <strong>Ketua Penguji:</strong>{" "}
                              {ujian.ketuaPenguji?.nama}
                            </div>
                            <div>
                              <strong>Sekretaris Penguji:</strong>{" "}
                              {ujian.sekretarisPenguji?.nama}
                            </div>
                            <div>
                              <strong>Penguji 1:</strong> {ujian.penguji1?.nama}
                            </div>
                            <div>
                              <strong>Penguji 2:</strong> {ujian.penguji2?.nama}
                            </div>
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
                        <div>
                          <h2 className="text-lg font-bold mb-2 text-center">
                            Rekapitulasi Nilai {ujian.jenisUjian?.namaJenis}
                          </h2>
                          <div className="mb-2 text-center text-sm">
                            <div>
                              <strong>Hari/Tanggal:</strong>{" "}
                              {ujian.hariUjian ?? "-"} /{" "}
                              {ujian.jadwalUjian?.split(/[ T]/)[0] ?? "-"}
                            </div>
                            <div>
                              <strong>Nama/NIM:</strong>{" "}
                              {ujian.mahasiswa?.nama ?? "-"} /{" "}
                              {ujian.mahasiswa?.nim ?? "-"}
                            </div>
                            <div>
                              <strong>Judul Proposal:</strong>{" "}
                              <span className="break-words whitespace-normal">
                                {ujian.judulPenelitian ?? "-"}
                              </span>
                            </div>
                          </div>
                          {/* Ganti table html dengan Table shadcnui */}
                          <Table className="w-full text-sm border border-collapse">
                            <TableHeader>
                              <TableRow className="bg-gray-100">
                                <TableHead className="border px-2 py-1 w-8">
                                  No.
                                </TableHead>
                                <TableHead className="border px-2 py-1">
                                  Nama
                                </TableHead>
                                <TableHead className="border px-2 py-1">
                                  Jabatan
                                </TableHead>
                                <TableHead className="border px-2 py-1">
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
                                    <TableCell className="border px-2 py-1">
                                      {i + 1}.
                                    </TableCell>
                                    <TableCell className="border px-2 py-1">
                                      {d.dosen?.nama ?? "-"}
                                    </TableCell>
                                    <TableCell className="border px-2 py-1">
                                      {d.jabatan}
                                    </TableCell>
                                    <TableCell className="border px-2 py-1">
                                      {d.total.toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                              {/* Total, rata-rata, huruf */}
                              {rekapPenilaian.length > 0 && (
                                <>
                                  <TableRow>
                                    <TableCell
                                      className="border px-2 py-1 font-semibold"
                                      colSpan={3}
                                    >
                                      Total Angka Nilai
                                    </TableCell>
                                    <TableCell className="border px-2 py-1 font-semibold">
                                      {rekapPenilaian
                                        .reduce((sum, d) => sum + d.total, 0)
                                        .toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell
                                      className="border px-2 py-1 font-semibold"
                                      colSpan={3}
                                    >
                                      Nilai Rata-rata
                                    </TableCell>
                                    <TableCell className="border px-2 py-1 font-semibold">
                                      {(
                                        rekapPenilaian.reduce(
                                          (sum, d) => sum + d.total,
                                          0
                                        ) / rekapPenilaian.length
                                      ).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell
                                      className="border px-2 py-1 font-semibold"
                                      colSpan={3}
                                    >
                                      Nilai Huruf
                                    </TableCell>
                                    <TableCell className="border px-2 py-1 font-semibold">
                                      {getNilaiHuruf(
                                        rekapPenilaian.reduce(
                                          (sum, d) => sum + d.total,
                                          0
                                        ) / rekapPenilaian.length
                                      )}
                                    </TableCell>
                                  </TableRow>
                                </>
                              )}
                            </TableBody>
                          </Table>
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
                          <Table className="w-full text-sm border">
                            <TableHeader>
                              <TableRow className="bg-gray-100">
                                <TableHead className="w-8">No.</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>NIP/NIDN</TableHead>
                                <TableHead>Jabatan</TableHead>
                                <TableHead className="text-center">
                                  Kehadiran
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {/* Ketua Penguji */}
                              <TableRow>
                                <TableCell>1</TableCell>
                                <TableCell>
                                  {ujian.ketuaPenguji?.nama ?? "-"}
                                </TableCell>
                                <TableCell>
                                  {ujian.ketuaPenguji?.nip ?? "-"}
                                  {ujian.ketuaPenguji?.nidn
                                    ? ` / ${ujian.ketuaPenguji.nidn}`
                                    : ""}
                                </TableCell>
                                <TableCell>Ketua Penguji</TableCell>
                                <TableCell className="text-center">
                                  {(() => {
                                    const hadir = sudahHadir(
                                      ujian.id,
                                      ujian.ketuaPenguji?.id
                                    );
                                    if (
                                      ujian.ketuaPenguji?.id === currentDosenId
                                    ) {
                                      return (
                                        <Button
                                          size="sm"
                                          className={
                                            hadir
                                              ? "bg-green-200 text-green-700 text-xs font-semibold px-3 py-1 rounded cursor-default"
                                              : "bg-green-500 text-white text-xs hover:bg-green-600 transition px-3 py-1 rounded"
                                          }
                                          disabled={
                                            hadirLoading === ujian.id || hadir
                                          }
                                          onClick={() =>
                                            handleHadir(
                                              currentDosenId,
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
                                        <span className="bg-green-200 text-green-700 text-xs font-semibold px-3 py-1 rounded">
                                          Sudah Hadir
                                        </span>
                                      ) : (
                                        "-"
                                      );
                                    }
                                  })()}
                                </TableCell>
                              </TableRow>
                              {/* Sekretaris Penguji */}
                              <TableRow>
                                <TableCell>2</TableCell>
                                <TableCell>
                                  {ujian.sekretarisPenguji?.nama ?? "-"}
                                </TableCell>
                                <TableCell>
                                  {ujian.sekretarisPenguji?.nip ?? "-"}
                                  {ujian.sekretarisPenguji?.nidn
                                    ? ` / ${ujian.sekretarisPenguji.nidn}`
                                    : ""}
                                </TableCell>
                                <TableCell>Sekretaris Penguji</TableCell>
                                <TableCell className="text-center">
                                  {(() => {
                                    const hadir = sudahHadir(
                                      ujian.id,
                                      ujian.sekretarisPenguji?.id
                                    );
                                    if (
                                      ujian.sekretarisPenguji?.id ===
                                      currentDosenId
                                    ) {
                                      return (
                                        <Button
                                          size="sm"
                                          className={
                                            hadir
                                              ? "bg-green-200 text-green-700 text-xs font-semibold px-3 py-1 rounded cursor-default"
                                              : "bg-green-500 text-white text-xs hover:bg-green-600 transition px-3 py-1 rounded"
                                          }
                                          disabled={
                                            hadirLoading === ujian.id || hadir
                                          }
                                          onClick={() =>
                                            handleHadir(
                                              currentDosenId,
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
                                        <span className="bg-green-200 text-green-700 text-xs font-semibold px-3 py-1 rounded">
                                          Sudah Hadir
                                        </span>
                                      ) : (
                                        "-"
                                      );
                                    }
                                  })()}
                                </TableCell>
                              </TableRow>
                              {/* Penguji I */}
                              <TableRow>
                                <TableCell>3</TableCell>
                                <TableCell>
                                  {ujian.penguji1?.nama ?? "-"}
                                </TableCell>
                                <TableCell>
                                  {ujian.penguji1?.nip ?? "-"}
                                  {ujian.penguji1?.nidn
                                    ? ` / ${ujian.penguji1.nidn}`
                                    : ""}
                                </TableCell>
                                <TableCell>Penguji I</TableCell>
                                <TableCell className="text-center">
                                  {(() => {
                                    const hadir = sudahHadir(
                                      ujian.id,
                                      ujian.penguji1?.id
                                    );
                                    if (ujian.penguji1?.id === currentDosenId) {
                                      return (
                                        <Button
                                          size="sm"
                                          className={
                                            hadir
                                              ? "bg-green-200 text-green-700 text-xs font-semibold px-3 py-1 rounded cursor-default"
                                              : "bg-green-500 text-white text-xs hover:bg-green-600 transition px-3 py-1 rounded"
                                          }
                                          disabled={
                                            hadirLoading === ujian.id || hadir
                                          }
                                          onClick={() =>
                                            handleHadir(
                                              currentDosenId,
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
                                        <span className="bg-green-200 text-green-700 text-xs font-semibold px-3 py-1 rounded">
                                          Sudah Hadir
                                        </span>
                                      ) : (
                                        "-"
                                      );
                                    }
                                  })()}
                                </TableCell>
                              </TableRow>
                              {/* Penguji II */}
                              <TableRow>
                                <TableCell>4</TableCell>
                                <TableCell>
                                  {ujian.penguji2?.nama ?? "-"}
                                </TableCell>
                                <TableCell>
                                  {ujian.penguji2?.nip ?? "-"}
                                  {ujian.penguji2?.nidn
                                    ? ` / ${ujian.penguji2.nidn}`
                                    : ""}
                                </TableCell>
                                <TableCell>Penguji II</TableCell>
                                <TableCell className="text-center">
                                  {(() => {
                                    const hadir = sudahHadir(
                                      ujian.id,
                                      ujian.penguji2?.id
                                    );
                                    if (ujian.penguji2?.id === currentDosenId) {
                                      return (
                                        <Button
                                          size="sm"
                                          className={
                                            hadir
                                              ? "bg-green-200 text-green-700 text-xs font-semibold px-3 py-1 rounded cursor-default"
                                              : "bg-green-500 text-white text-xs hover:bg-green-600 transition px-3 py-1 rounded"
                                          }
                                          disabled={
                                            hadirLoading === ujian.id || hadir
                                          }
                                          onClick={() =>
                                            handleHadir(
                                              currentDosenId,
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
                                        <span className="bg-green-200 text-green-700 text-xs font-semibold px-3 py-1 rounded">
                                          Sudah Hadir
                                        </span>
                                      ) : (
                                        "-"
                                      );
                                    }
                                  })()}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
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
