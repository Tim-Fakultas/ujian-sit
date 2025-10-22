"use client";

import { useState, useMemo } from "react";
import { Ujian } from "@/types/Ujian";

import { Pencil, Eye } from "lucide-react";
import { IconClipboardText } from "@tabler/icons-react";
import { UserCheck } from "lucide-react";

import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  }, [
    penilaian,
    bobot.efektivitas,
    bobot.motivasi,
    bobot.literatur,
    bobot.metodologi,
    bobot.sikap,
    bobot.bimbingan,
  ]);

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
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            &times;
          </Button>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader className="bg-accent">
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama Mahasiswa</TableHead>
            <TableHead>Jenis Ujian</TableHead>
            <TableHead>Ruangan</TableHead>
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
                  <TableCell>{ujian.ruangan.namaRuangan ?? "-"}</TableCell>
                  <TableCell>{waktuGabung}</TableCell>
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
                              <Label className="mb-1">Nama Mahasiswa</Label>
                              <Input
                                type="text"
                                value={ujian.mahasiswa?.nama ?? ""}
                                readOnly
                              />
                            </div>
                            <div>
                              <Label className="mb-1">NIM</Label>
                              <Input
                                type="text"
                                value={ujian.mahasiswa?.nim ?? ""}
                                readOnly
                              />
                            </div>
                            <div>
                              <Label className="mb-1">Prodi</Label>
                              <Input
                                type="text"
                                value={ujian.mahasiswa?.prodi?.namaProdi ?? ""}
                                readOnly
                              />
                            </div>
                            <div>
                              <Label className="mb-1">Ketua Penguji</Label>
                              <Input
                                type="text"
                                value={ujian.ketuaPenguji?.nama ?? ""}
                                readOnly
                              />
                            </div>
                          </div>
                          {/* Penilaian */}
                          <div className="mt-4">
                            <Table className="w-full text-sm border">
                              <TableHeader>
                                <TableRow className="bg-gray-100">
                                  <TableHead className="border px-2 py-1">
                                    Kriteria
                                  </TableHead>
                                  <TableHead className="border px-2 py-1">
                                    Bobot (%)
                                  </TableHead>
                                  <TableHead className="border px-2 py-1">
                                    Skor
                                  </TableHead>
                                  <TableHead className="border px-2 py-1">
                                    Bobot*Skor
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="border px-2 py-1">
                                    Efektivitas Pendahuluan
                                  </TableCell>
                                  <TableCell className="border px-2 py-1">
                                    {bobot.efektivitas}
                                  </TableCell>
                                  <TableCell className="border px-2 py-1">
                                    <Input
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
                                      className="w-16"
                                    />
                                  </TableCell>
                                  <TableCell className="border px-2 py-1">
                                    {(
                                      (penilaian.efektivitas *
                                        bobot.efektivitas) /
                                      100
                                    ).toFixed(2)}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="border px-2 py-1">
                                    Motivasi pada Penelitian
                                  </TableCell>
                                  <TableCell className="border px-2 py-1">
                                    {bobot.motivasi}
                                  </TableCell>
                                  <TableCell className="border px-2 py-1">
                                    <Input
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
                                      className="w-16"
                                    />
                                  </TableCell>
                                  <TableCell className="border px-2 py-1">
                                    {(
                                      (penilaian.motivasi * bobot.motivasi) /
                                      100
                                    ).toFixed(2)}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="border px-2 py-1">
                                    Literatur Review
                                  </TableCell>
                                  <TableCell className="border px-2 py-1">
                                    {bobot.literatur}
                                  </TableCell>
                                  <TableCell className="border px-2 py-1">
                                    <Input
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
                                      className="w-16"
                                    />
                                  </TableCell>
                                  <TableCell className="border px-2 py-1">
                                    {(
                                      (penilaian.literatur * bobot.literatur) /
                                      100
                                    ).toFixed(2)}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="border px-2 py-1">
                                    Metodologi
                                  </TableCell>
                                  <TableCell className="border px-2 py-1">
                                    {bobot.metodologi}
                                  </TableCell>
                                  <TableCell className="border px-2 py-1">
                                    <Input
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
                                      className="w-16"
                                    />
                                  </TableCell>
                                  <TableCell className="border px-2 py-1">
                                    {(
                                      (penilaian.metodologi *
                                        bobot.metodologi) /
                                      100
                                    ).toFixed(2)}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="border px-2 py-1">
                                    Sikap/Presentasi
                                  </TableCell>
                                  <TableCell className="border px-2 py-1">
                                    {bobot.sikap}
                                  </TableCell>
                                  <TableCell className="border px-2 py-1">
                                    <Input
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
                                      className="w-16"
                                    />
                                  </TableCell>
                                  <TableCell className="border px-2 py-1">
                                    {(
                                      (penilaian.sikap * bobot.sikap) /
                                      100
                                    ).toFixed(2)}
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="border px-2 py-1">
                                    Bimbingan
                                  </TableCell>
                                  <TableCell className="border px-2 py-1">
                                    {bobot.bimbingan}
                                  </TableCell>
                                  <TableCell className="border px-2 py-1">
                                    <Input
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
                                      className="w-16"
                                    />
                                  </TableCell>
                                  <TableCell className="border px-2 py-1">
                                    {(
                                      (penilaian.bimbingan * bobot.bimbingan) /
                                      100
                                    ).toFixed(2)}
                                  </TableCell>
                                </TableRow>
                                <TableRow className="font-bold bg-gray-50">
                                  <TableCell className="border px-2 py-1">
                                    Skor Akhir
                                  </TableCell>
                                  <TableCell className="border px-2 py-1">
                                    Total
                                  </TableCell>
                                  <TableCell className="border px-2 py-1"></TableCell>
                                  <TableCell className="border px-2 py-1">
                                    {skorAkhir.toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                          <Button
                            type="submit"
                            className="w-full bg-blue-500 text-white rounded py-2 mt-2"
                          >
                            Simpan Penilaian
                          </Button>
                          {/* Catatan interval nilai */}
                          <div className="mt-4 text-sm border rounded p-3 bg-gray-50">
                            <strong>Catatan interval nilai:</strong>
                            <Table className="mt-2">
                              <TableBody>
                                <TableRow>
                                  <TableCell className="pr-2">A</TableCell>
                                  <TableCell>: 80.00 – 100</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="pr-2">B</TableCell>
                                  <TableCell>: 70.00 – 79.99</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="pr-2">C</TableCell>
                                  <TableCell>: 60.00 – 69.99</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="pr-2">D</TableCell>
                                  <TableCell>: 56.00 – 59.99</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="pr-2">E</TableCell>
                                  <TableCell>: {"<"} 55.99</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
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
                            <span className="break-words whitespace-normal">
                              {ujian.judulPenelitian ?? "-"}
                            </span>
                          </div>
                        </div>
                        <Table className="w-full text-sm border">
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
                            <TableRow>
                              <TableCell className="border px-2 py-1">
                                1.
                              </TableCell>
                              <TableCell className="border px-2 py-1">
                                {ujian.ketuaPenguji?.nama ?? "-"}
                              </TableCell>
                              <TableCell className="border px-2 py-1">
                                Ketua Penguji
                              </TableCell>
                              <TableCell className="border px-2 py-1">
                                90
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="border px-2 py-1">
                                2.
                              </TableCell>
                              <TableCell className="border px-2 py-1">
                                {ujian.sekretarisPenguji?.nama ?? "-"}
                              </TableCell>
                              <TableCell className="border px-2 py-1">
                                Sekretaris Penguji
                              </TableCell>
                              <TableCell className="border px-2 py-1">
                                90
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="border px-2 py-1">
                                3.
                              </TableCell>
                              <TableCell className="border px-2 py-1">
                                {ujian.penguji1?.nama ?? "-"}
                              </TableCell>
                              <TableCell className="border px-2 py-1">
                                Penguji I
                              </TableCell>
                              <TableCell className="border px-2 py-1">
                                90
                              </TableCell>
                            </TableRow>
                            <TableCell>
                              <TableRow>
                                <TableCell className="border px-2 py-1">
                                  4.
                                </TableCell>
                                <TableCell className="border px-2 py-1">
                                  {ujian.penguji2?.nama ?? "-"}
                                </TableCell>
                                <TableCell className="border px-2 py-1">
                                  Penguji II
                                </TableCell>
                                <TableCell className="border px-2 py-1">
                                  90
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  className="border px-2 py-1"
                                  colSpan={3}
                                >
                                  Total Angka Nilai
                                </TableCell>
                                <TableCell className="border px-2 py-1">
                                  360
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  className="border px-2 py-1"
                                  colSpan={3}
                                >
                                  Nilai Rata-rata
                                </TableCell>
                                <TableCell className="border px-2 py-1">
                                  90.00
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  className="border px-2 py-1"
                                  colSpan={3}
                                >
                                  Nilai Huruf
                                </TableCell>
                                <TableCell className="border px-2 py-1">
                                  A
                                </TableCell>
                              </TableRow>
                            </TableCell>
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
                                <Button
                                  size="sm"
                                  className="bg-green-500 text-white text-xs hover:bg-green-600 transition px-3 py-1 rounded"
                                >
                                  Hadir
                                </Button>
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
                                <Button
                                  size="sm"
                                  className="bg-green-500 text-white text-xs hover:bg-green-600 transition px-3 py-1 rounded"
                                >
                                  Hadir
                                </Button>
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
                                <Button
                                  size="sm"
                                  className="bg-green-500 text-white text-xs hover:bg-green-600 transition px-3 py-1 rounded"
                                >
                                  Hadir
                                </Button>
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
                                <Button
                                  size="sm"
                                  className="bg-green-500 text-white text-xs hover:bg-green-600 transition px-3 py-1 rounded"
                                >
                                  Hadir
                                </Button>
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
