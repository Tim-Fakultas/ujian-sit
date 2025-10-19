"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useState, useMemo } from "react";
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

interface JadwalUjianTableProps {
  jadwalUjian: Ujian[];
}

export default function JadwalUjianTable({
  jadwalUjian,
}: JadwalUjianTableProps) {
  const [selected, setSelected] = useState<Ujian | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openPenilaian, setOpenPenilaian] = useState(false);
  const [openRekapitulasi, setOpenRekapitulasi] = useState(false);
  const [openDaftarHadir, setOpenDaftarHadir] = useState(false);
  const [penilaian, setPenilaian] = useState({
    efektivitas: 0,
    motivasi: 0,
    literatur: 0,
    metodologi: 0,
    sikap: 0,
    bimbingan: 0,
  });

  // Bobot sesuai gambar
  const bobot = {
    efektivitas: 20,
    motivasi: 15,
    literatur: 15,
    metodologi: 15,
    sikap: 20,
    bimbingan: 15,
  };

  // Hitung total skor akhir
  const skorAkhir = useMemo(() => {
    return (
      (penilaian.efektivitas * bobot.efektivitas) / 100 +
      (penilaian.motivasi * bobot.motivasi) / 100 +
      (penilaian.literatur * bobot.literatur) / 100 +
      (penilaian.metodologi * bobot.metodologi) / 100 +
      (penilaian.sikap * bobot.sikap) / 100 +
      (penilaian.bimbingan * bobot.bimbingan) / 100
    );
  }, [penilaian]);

  // Helper untuk nilai huruf
  function getNilaiHuruf(rata: number) {
    if (rata >= 80) return "A";
    if (rata >= 70) return "B";
    if (rata >= 60) return "C";
    if (rata >= 56) return "D";
    return "E";
  }

  // Modal sederhana
  function Modal({
    open,
    onClose,
    children,
    className = "",
  }: {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
  }) {
    if (!open) return null;
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/80"
        onClick={onClose}
      >
        <div
          className={`bg-white rounded shadow-lg p-6 relative ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama Mahasiswa</TableHead>
            <TableHead>Jenis Ujian</TableHead>
            <TableHead>Ruangan</TableHead>
            <TableHead>Peran Anda</TableHead>
            <TableHead>Waktu</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jadwalUjian.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Tidak ada jadwal ujian
              </TableCell>
            </TableRow>
          ) : (
            jadwalUjian.map((ujian, idx) => {
              // Format waktu tanpa detik
              const waktuMulai = ujian.waktuMulai?.slice(0, 5) ?? "-";
              const waktuSelesai = ujian.waktuSelesai?.slice(0, 5) ?? "-";
              // Ambil tanggal dari jadwalUjian (support "YYYY-MM-DD HH:mm:ss" atau "YYYY-MM-DDTHH:mm:ss")
              const tanggal = ujian.jadwalUjian?.split(/[ T]/)[0] ?? "-";
              const waktuGabung = `${
                ujian.hariUjian ?? "-"
              }, ${tanggal} ${waktuMulai} - ${waktuSelesai}`;
              return (
                <TableRow key={ujian.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{ujian.mahasiswa?.nama ?? "-"}</TableCell>
                  <TableCell>{ujian.jenisUjian?.namaJenis ?? "-"}</TableCell>
                  <TableCell>{ujian.ruangan ?? "-"}</TableCell>
                  <TableCell>{ujian.peranPenguji ?? "-"}</TableCell>
                  <TableCell>{waktuGabung}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="px-2 py-1 rounded bg-gray-200 text-xs">
                          Menu
                        </button>
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
                            setOpenPenilaian(true);
                          }}
                        >
                          <Pencil size={16} className="mr-2" /> Penilaian
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
                            <strong>Ruangan:</strong> {ujian.ruangan}
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
                            <strong>Peran Anda:</strong>{" "}
                            {ujian.peranPenguji ?? "-"}
                          </div>
                        </div>
                      </div>
                    </Modal>

                    {/* Modal Penilaian */}
                    <Modal
                      open={openPenilaian && selected?.id === ujian.id}
                      onClose={() => setOpenPenilaian(false)}
                      className="max-h-[80vh] overflow-y-auto w-full max-w-2xl"
                    >
                      <div>
                        <h2 className="text-lg font-bold mb-2">
                          Form Penilaian Ujian
                        </h2>
                        <form
                          className="space-y-3"
                          onSubmit={(e) => {
                            e.preventDefault();
                            // TODO: handle submit
                          }}
                        >
                          {/* Identitas */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Nama Mahasiswa
                              </label>
                              <input
                                type="text"
                                className="border rounded px-2 py-1 w-full"
                                value={ujian.mahasiswa?.nama ?? ""}
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                NIM
                              </label>
                              <input
                                type="text"
                                className="border rounded px-2 py-1 w-full"
                                value={ujian.mahasiswa?.nim ?? ""}
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Prodi
                              </label>
                              <input
                                type="text"
                                className="border rounded px-2 py-1 w-full"
                                value={ujian.mahasiswa?.prodi?.namaProdi ?? ""}
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Ketua Penguji
                              </label>
                              <input
                                type="text"
                                className="border rounded px-2 py-1 w-full"
                                value={ujian.ketuaPenguji?.nama ?? ""}
                                readOnly
                              />
                            </div>
                          </div>
                          {/* Penilaian */}
                          <div className="mt-4">
                            <table className="w-full text-sm border">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="border px-2 py-1">Kriteria</th>
                                  <th className="border px-2 py-1">
                                    Bobot (%)
                                  </th>
                                  <th className="border px-2 py-1">Skor</th>
                                  <th className="border px-2 py-1">
                                    Bobot*Skor
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border px-2 py-1">
                                    Efektivitas Pendahuluan
                                  </td>
                                  <td className="border px-2 py-1">
                                    {bobot.efektivitas}
                                  </td>
                                  <td className="border px-2 py-1">
                                    <input
                                      type="number"
                                      min={0}
                                      max={100}
                                      value={penilaian.efektivitas}
                                      onChange={(e) =>
                                        setPenilaian((p) => ({
                                          ...p,
                                          efektivitas: Number(e.target.value),
                                        }))
                                      }
                                      className="w-16 border rounded px-1"
                                    />
                                  </td>
                                  <td className="border px-2 py-1">
                                    {(
                                      (penilaian.efektivitas *
                                        bobot.efektivitas) /
                                      100
                                    ).toFixed(2)}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border px-2 py-1">
                                    Motivasi pada Penelitian
                                  </td>
                                  <td className="border px-2 py-1">
                                    {bobot.motivasi}
                                  </td>
                                  <td className="border px-2 py-1">
                                    <input
                                      type="number"
                                      min={0}
                                      max={100}
                                      value={penilaian.motivasi}
                                      onChange={(e) =>
                                        setPenilaian((p) => ({
                                          ...p,
                                          motivasi: Number(e.target.value),
                                        }))
                                      }
                                      className="w-16 border rounded px-1"
                                    />
                                  </td>
                                  <td className="border px-2 py-1">
                                    {(
                                      (penilaian.motivasi * bobot.motivasi) /
                                      100
                                    ).toFixed(2)}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border px-2 py-1">
                                    Literatur Review
                                  </td>
                                  <td className="border px-2 py-1">
                                    {bobot.literatur}
                                  </td>
                                  <td className="border px-2 py-1">
                                    <input
                                      type="number"
                                      min={0}
                                      max={100}
                                      value={penilaian.literatur}
                                      onChange={(e) =>
                                        setPenilaian((p) => ({
                                          ...p,
                                          literatur: Number(e.target.value),
                                        }))
                                      }
                                      className="w-16 border rounded px-1"
                                    />
                                  </td>
                                  <td className="border px-2 py-1">
                                    {(
                                      (penilaian.literatur * bobot.literatur) /
                                      100
                                    ).toFixed(2)}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border px-2 py-1">
                                    Metodologi
                                  </td>
                                  <td className="border px-2 py-1">
                                    {bobot.metodologi}
                                  </td>
                                  <td className="border px-2 py-1">
                                    <input
                                      type="number"
                                      min={0}
                                      max={100}
                                      value={penilaian.metodologi}
                                      onChange={(e) =>
                                        setPenilaian((p) => ({
                                          ...p,
                                          metodologi: Number(e.target.value),
                                        }))
                                      }
                                      className="w-16 border rounded px-1"
                                    />
                                  </td>
                                  <td className="border px-2 py-1">
                                    {(
                                      (penilaian.metodologi *
                                        bobot.metodologi) /
                                      100
                                    ).toFixed(2)}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border px-2 py-1">
                                    Sikap/Presentasi
                                  </td>
                                  <td className="border px-2 py-1">
                                    {bobot.sikap}
                                  </td>
                                  <td className="border px-2 py-1">
                                    <input
                                      type="number"
                                      min={0}
                                      max={100}
                                      value={penilaian.sikap}
                                      onChange={(e) =>
                                        setPenilaian((p) => ({
                                          ...p,
                                          sikap: Number(e.target.value),
                                        }))
                                      }
                                      className="w-16 border rounded px-1"
                                    />
                                  </td>
                                  <td className="border px-2 py-1">
                                    {(
                                      (penilaian.sikap * bobot.sikap) /
                                      100
                                    ).toFixed(2)}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="border px-2 py-1">
                                    Bimbingan
                                  </td>
                                  <td className="border px-2 py-1">
                                    {bobot.bimbingan}
                                  </td>
                                  <td className="border px-2 py-1">
                                    <input
                                      type="number"
                                      min={0}
                                      max={100}
                                      value={penilaian.bimbingan}
                                      onChange={(e) =>
                                        setPenilaian((p) => ({
                                          ...p,
                                          bimbingan: Number(e.target.value),
                                        }))
                                      }
                                      className="w-16 border rounded px-1"
                                    />
                                  </td>
                                  <td className="border px-2 py-1">
                                    {(
                                      (penilaian.bimbingan * bobot.bimbingan) /
                                      100
                                    ).toFixed(2)}
                                  </td>
                                </tr>
                                <tr className="font-bold bg-gray-50">
                                  <td className="border px-2 py-1">
                                    Skor Akhir
                                  </td>
                                  <td className="border px-2 py-1">Total</td>
                                  <td className="border px-2 py-1"></td>
                                  <td className="border px-2 py-1">
                                    {skorAkhir.toFixed(2)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-blue-500 text-white rounded py-2 mt-2"
                          >
                            Simpan Penilaian
                          </button>
                          {/* Catatan interval nilai */}
                          <div className="mt-4 text-sm border rounded p-3 bg-gray-50">
                            <strong>Catatan interval nilai:</strong>
                            <table className="mt-2">
                              <tbody>
                                <tr>
                                  <td className="pr-2">A</td>
                                  <td>: 80.00 – 100</td>
                                </tr>
                                <tr>
                                  <td className="pr-2">B</td>
                                  <td>: 70.00 – 79.99</td>
                                </tr>
                                <tr>
                                  <td className="pr-2">C</td>
                                  <td>: 60.00 – 69.99</td>
                                </tr>
                                <tr>
                                  <td className="pr-2">D</td>
                                  <td>: 56.00 – 59.99</td>
                                </tr>
                                <tr>
                                  <td className="pr-2">E</td>
                                  <td>: {"<"} 55.99</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </form>
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
                            {ujian.judulPenelitian ?? "-"}
                          </div>
                        </div>
                        <table className="w-full text-sm border">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border px-2 py-1 w-8">No.</th>
                              <th className="border px-2 py-1">Nama</th>
                              <th className="border px-2 py-1">Jabatan</th>
                              <th className="border px-2 py-1">Angka Nilai</th>
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
                            {/* Hitung total, rata-rata, huruf */}
                            <tr>
                              <td className="border px-2 py-1" colSpan={3}>
                                Total Angka Nilai
                              </td>
                              <td className="border px-2 py-1">360</td>
                            </tr>
                            <tr>
                              <td className="border px-2 py-1" colSpan={3}>
                                Nilai Rata-rata
                              </td>
                              <td className="border px-2 py-1">90.00</td>
                            </tr>
                            <tr>
                              <td className="border px-2 py-1" colSpan={3}>
                                Nilai Huruf
                              </td>
                              <td className="border px-2 py-1">A</td>
                            </tr>
                          </tbody>
                        </table>
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
                          Daftar Hadir Ujian {ujian.jenisUjian?.namaJenis}
                        </h2>
                        <div className="mb-4 mt-2">
                          <div className="flex flex-col gap-1">
                            <span>
                              <strong>Hari/Tanggal:</strong>{" "}
                              {ujian.hariUjian ?? "-"} /{" "}
                              {ujian.jadwalUjian?.split(/[ T]/)[0] ?? "-"}
                            </span>
                            <span>
                              <strong>Ruangan:</strong> {ujian.ruangan ?? "-"}
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
                                Hadir
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
                                <button className="px-3 py-1 rounded bg-green-500 text-white text-xs hover:bg-green-600 transition">
                                  Hadir
                                </button>
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
                                <button className="px-3 py-1 rounded bg-green-500 text-white text-xs hover:bg-green-600 transition">
                                  Hadir
                                </button>
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
                                <button className="px-3 py-1 rounded bg-green-500 text-white text-xs hover:bg-green-600 transition">
                                  Hadir
                                </button>
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
                                <button className="px-3 py-1 rounded bg-green-500 text-white text-xs hover:bg-green-600 transition">
                                  Hadir
                                </button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </Modal>
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
