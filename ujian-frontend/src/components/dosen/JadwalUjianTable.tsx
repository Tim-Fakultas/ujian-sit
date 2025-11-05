"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useState } from "react";
import { Ujian } from "@/types/Ujian";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Pencil, Eye } from "lucide-react";
import { IconClipboardText } from "@tabler/icons-react";
import { UserCheck } from "lucide-react";
import { MoreVertical } from "lucide-react";
import PenilaianModal from "./PenilaianModal";
import Modal from "../Modal";
import { Button } from "../ui/button";
import { setHadirUjian } from "@/actions/daftarHadirUjian";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

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

  //* Filtered data
  const filteredData = jadwalUjian.filter((ujian) => {
    //* Filter by peran
    let matchPeran = true;
    if (filterPeran !== "all") {
      const peran = getPeranPenguji(ujian, currentDosenId);
      matchPeran = peran === filterPeran;
    }
    // Filter by search (nama mahasiswa, judul, ruangan)
    const q = search.toLowerCase();
    const matchSearch =
      (ujian.mahasiswa?.nama?.toLowerCase() ?? "").includes(q) ||
      (ujian.judulPenelitian?.toLowerCase() ?? "").includes(q) ||
      (ujian.ruangan?.namaRuangan?.toLowerCase() ?? "").includes(q);
    return matchPeran && matchSearch;
  });

  return (
    <div className="shadow p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        {/* Filter peran (left) & search bar (right) */}
        <div className="flex flex-1 gap-2 items-center">
          {/* Filter peran nav */}
          <div className="flex gap-2">
            {[
              { label: "Semua", value: "all" },
              { label: "Ketua Penguji", value: "Ketua Penguji" },
              { label: "Sekretaris Penguji", value: "Sekretaris Penguji" },
              { label: "Penguji 1", value: "Penguji 1" },
              { label: "Penguji 2", value: "Penguji 2" },
            ].map((item) => (
              <Button
                key={item.value}
                className={`px-6 py-2 rounded-lg text-xs font-medium transition focus:outline-none hover:bg-blue-400 hover:text-white
                  ${
                    filterPeran === item.value
                      ? "bg-blue-400 text-white"
                      : "bg-[#F5F7FF] text-blue-400"
                  }
                `}
                style={{
                  boxShadow:
                    filterPeran === item.value
                      ? "0 1px 4px 0 #6C7CFF22"
                      : undefined,
                  border: "none",
                }}
                onClick={() => setFilterPeran(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
        {/* Search bar (right) */}
        <div className="relative w-full md:w-72 mt-2 md:mt-0">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path
                d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <Input
            placeholder="Cari nama mahasiswa, judul, ruangan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full text-xs placeholder:text-xs"
          />
        </div>
      </div>
      <Table>
        <TableHeader className="bg-accent">
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama Mahasiswa</TableHead>
            <TableHead>Jenis Ujian</TableHead>
            <TableHead>Ruangan</TableHead>
            <TableHead>Waktu</TableHead>
            <TableHead>Peran Anda</TableHead>
            <TableHead>Nilai</TableHead>
            <TableHead>Hasil</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
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

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="p-2"
                          aria-label="Aksi"
                        >
                          <MoreVertical size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelected(ujian);
                            setOpenDetail(true);
                          }}
                        >
                          <Eye size={16} className="mr-2" /> Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelected(ujian);
                            setOpenRekapitulasi(true);
                          }}
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
                          <UserCheck size={16} className="mr-2" /> Daftar Hadir
                          Ujian
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelected(ujian);
                            setOpenPenilaian(true);
                          }}
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
                      <div>
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
                        <h2 className="text-lg font-bold mb-2">
                          Rekapitulasi Nilai {ujian.jenisUjian?.namaJenis}
                        </h2>
                        <div className="mb-2">
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
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm border border-collapse">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="border px-2 py-1 w-8">No.</th>
                                <th className="border px-2 py-1">Nama</th>
                                <th className="border px-2 py-1">Jabatan</th>
                                <th className="border px-2 py-1">
                                  Angka Nilai
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border px-2 py-1">1.</td>
                                <td className="border px-2 py-1">
                                  {ujian.ketuaPenguji?.nama ?? "-"}
                                </td>
                                <td className="border px-2 py-1">
                                  Ketua Penguji
                                </td>
                                <td className="border px-2 py-1">90</td>
                              </tr>
                              <tr>
                                <td className="border px-2 py-1">2.</td>
                                <td className="border px-2 py-1">
                                  {ujian.sekretarisPenguji?.nama ?? "-"}
                                </td>
                                <td className="border px-2 py-1">
                                  Sekretaris Penguji
                                </td>
                                <td className="border px-2 py-1">90</td>
                              </tr>
                              <tr>
                                <td className="border px-2 py-1">3.</td>
                                <td className="border px-2 py-1">
                                  {ujian.penguji1?.nama ?? "-"}
                                </td>
                                <td className="border px-2 py-1">Penguji I</td>
                                <td className="border px-2 py-1">90</td>
                              </tr>
                              <tr>
                                <td className="border px-2 py-1">4.</td>
                                <td className="border px-2 py-1">
                                  {ujian.penguji2?.nama ?? "-"}
                                </td>
                                <td className="border px-2 py-1">Penguji II</td>
                                <td className="border px-2 py-1">90</td>
                              </tr>
                              <tr>
                                <td
                                  className="border px-2 py-1 font-semibold"
                                  colSpan={3}
                                >
                                  Total Angka Nilai
                                </td>
                                <td className="border px-2 py-1 font-semibold">
                                  360
                                </td>
                              </tr>
                              <tr>
                                <td
                                  className="border px-2 py-1 font-semibold"
                                  colSpan={3}
                                >
                                  Nilai Rata-rata
                                </td>
                                <td className="border px-2 py-1 font-semibold">
                                  90.00
                                </td>
                              </tr>
                              <tr>
                                <td
                                  className="border px-2 py-1 font-semibold"
                                  colSpan={3}
                                >
                                  Nilai Huruf
                                </td>
                                <td className="border px-2 py-1 font-semibold">
                                  A
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
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
                                Action
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
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
                                {ujian.ketuaPenguji?.id === currentDosenId ? (
                                  <Button
                                    size="sm"
                                    className="bg-green-500 text-white text-xs hover:bg-green-600 transition px-3 py-1 rounded"
                                    disabled={
                                      hadirLoading === ujian.id ||
                                      hadirSukses[ujian.id]
                                    }
                                    onClick={() =>
                                      handleHadir(currentDosenId, ujian.id)
                                    }
                                  >
                                    {hadirLoading === ujian.id
                                      ? "Loading..."
                                      : hadirSukses[ujian.id]
                                      ? "Sudah Hadir"
                                      : "Hadir"}
                                  </Button>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                            </TableRow>
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
                                {ujian.sekretarisPenguji?.id ===
                                currentDosenId ? (
                                  <Button
                                    size="sm"
                                    className="bg-green-500 text-white text-xs hover:bg-green-600 transition px-3 py-1 rounded"
                                    disabled={
                                      hadirLoading === ujian.id ||
                                      hadirSukses[ujian.id]
                                    }
                                    onClick={() =>
                                      handleHadir(currentDosenId, ujian.id)
                                    }
                                  >
                                    {hadirLoading === ujian.id
                                      ? "Loading..."
                                      : hadirSukses[ujian.id]
                                      ? "Sudah Hadir"
                                      : "Hadir"}
                                  </Button>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                            </TableRow>
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
                                {ujian.penguji1?.id === currentDosenId ? (
                                  <Button
                                    size="sm"
                                    className="bg-green-500 text-white text-xs hover:bg-green-600 transition px-3 py-1 rounded"
                                    disabled={
                                      hadirLoading === ujian.id ||
                                      hadirSukses[ujian.id]
                                    }
                                    onClick={() =>
                                      handleHadir(currentDosenId, ujian.id)
                                    }
                                  >
                                    {hadirLoading === ujian.id
                                      ? "Loading..."
                                      : hadirSukses[ujian.id]
                                      ? "Sudah Hadir"
                                      : "Hadir"}
                                  </Button>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                            </TableRow>
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
                                {ujian.penguji2?.id === currentDosenId ? (
                                  <Button
                                    size="sm"
                                    className="bg-green-500 text-white text-xs hover:bg-green-600 transition px-3 py-1 rounded"
                                    disabled={
                                      hadirLoading === ujian.id ||
                                      hadirSukses[ujian.id]
                                    }
                                    onClick={() =>
                                      handleHadir(currentDosenId, ujian.id)
                                    }
                                  >
                                    {hadirLoading === ujian.id
                                      ? "Loading..."
                                      : hadirSukses[ujian.id]
                                      ? "Sudah Hadir"
                                      : "Hadir"}
                                  </Button>
                                ) : (
                                  "-"
                                )}
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
  );
}
