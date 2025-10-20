"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ujian } from "@/types/Ujian";
import { Button } from "@/components/ui/button";
import { MoreVertical, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function JadwalUjianTable({
  jadwalUjian,
}: {
  jadwalUjian: Ujian[];
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState<Ujian | null>(null);

  // Tambahan untuk daftar hadir
  const [openDaftarHadir, setOpenDaftarHadir] = useState(false);
  const [selectedDaftarHadir, setSelectedDaftarHadir] = useState<Ujian | null>(
    null
  );

  function handleDetail(ujian: Ujian) {
    setSelected(ujian);
    setOpenDialog(true);
  }

  function handleDaftarHadir(ujian: Ujian) {
    setSelectedDaftarHadir(ujian);
    setOpenDaftarHadir(true);
  }

  return (
    <div className="rounded-sm overflow-x-auto ">
      <Table>
        <TableHeader className="bg-accent ">
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama Mahasiswa</TableHead>
            <TableHead>Judul Penelitian</TableHead>
            <TableHead>Jenis Ujian</TableHead>
            <TableHead>Hari Ujian</TableHead>
            <TableHead>Tanggal Ujian</TableHead>
            <TableHead>Waktu</TableHead>
            <TableHead>Ruangan</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jadwalUjian.length > 0 ? (
            jadwalUjian.map((ujian, index) => (
              <TableRow key={ujian.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{ujian.mahasiswa.nama}</TableCell>
                <TableCell className="whitespace-normal break-words max-w-xs">
                  {ujian.judulPenelitian}
                </TableCell>
                <TableCell>{ujian.jenisUjian.namaJenis}</TableCell>
                <TableCell>{ujian?.hariUjian?.toUpperCase() || "-"}</TableCell>
                <TableCell>
                  {ujian.jadwalUjian
                    ? new Date(ujian.jadwalUjian).toLocaleDateString("id-ID")
                    : "-"}
                </TableCell>
                <TableCell>
                  {(ujian.waktuMulai?.slice(0, 5) || "-") +
                    "-" +
                    (ujian.waktuSelesai?.slice(0, 5) || "-")}
                </TableCell>
                <TableCell>{ujian.ruangan.namaRuangan || "-"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="p-2">
                        <MoreVertical size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={() => handleDetail(ujian)}
                      >
                        <Eye size={16} />
                        Lihat Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={() => handleDaftarHadir(ujian)}
                      >
                        <Eye size={16} />
                        Lihat Daftar Hadir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                Tidak ada jadwal ujian tersedia.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Dialog Detail */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-3xl p-6 max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-2">
              Detail Jadwal Ujian
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[65vh] pr-2">
            {selected && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-700 mt-2">
                <div>
                  <span className="font-medium text-gray-800">
                    Nama Mahasiswa:
                  </span>
                  <p>{selected.mahasiswa?.nama || "-"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">NIM:</span>
                  <p>{selected.mahasiswa?.nim || "-"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">
                    Program Studi:
                  </span>
                  <p>{selected.mahasiswa?.prodi?.namaProdi || "-"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">
                    Jenis Ujian:
                  </span>
                  <p>{selected.jenisUjian?.namaJenis || "-"}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-800">
                    Judul Penelitian:
                  </span>
                  <p className="text-gray-600">
                    {selected.judulPenelitian || "-"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">Hari Ujian:</span>
                  <p>{selected.hariUjian || "-"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">
                    Tanggal Ujian:
                  </span>
                  <p>
                    {selected.jadwalUjian
                      ? new Date(selected.jadwalUjian).toLocaleDateString(
                          "id-ID"
                        )
                      : "-"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">
                    Waktu Mulai:
                  </span>
                  <p>
                    {selected.waktuMulai
                      ? selected.waktuMulai.slice(0, 5)
                      : "-"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">
                    Waktu Selesai:
                  </span>
                  <p>
                    {selected.waktuSelesai
                      ? selected.waktuSelesai.slice(0, 5)
                      : "-"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">Ruangan:</span>
                  <p>{selected.ruangan.namaRuangan || "-"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">
                    Ketua Penguji:
                  </span>
                  <p>
                    {selected.ketuaPenguji
                      ? typeof selected.ketuaPenguji === "object"
                        ? selected.ketuaPenguji.nama
                        : selected.ketuaPenguji
                      : "-"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">
                    Sekretaris Penguji:
                  </span>
                  <p>
                    {selected.sekretarisPenguji
                      ? typeof selected.sekretarisPenguji === "object"
                        ? selected.sekretarisPenguji.nama
                        : selected.sekretarisPenguji
                      : "-"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">Penguji 1:</span>
                  <p>
                    {selected.penguji1
                      ? typeof selected.penguji1 === "object"
                        ? selected.penguji1.nama
                        : selected.penguji1
                      : "-"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">Penguji 2:</span>
                  <p>
                    {selected.penguji2
                      ? typeof selected.penguji2 === "object"
                        ? selected.penguji2.nama
                        : selected.penguji2
                      : "-"}
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>
          <div className="flex justify-end mt-5">
            <Button
              variant="outline"
              onClick={() => setOpenDialog(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Daftar Hadir */}
      <Dialog open={openDaftarHadir} onOpenChange={setOpenDaftarHadir}>
        <DialogContent className="sm:max-w-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-2">
              Formulir Daftar Hadir Ujian Skripsi
            </DialogTitle>
          </DialogHeader>
          {selectedDaftarHadir && (
            <div>
              <div className="mb-4 text-sm">
                <div>
                  <span className="font-medium">Hari/Tanggal</span>:{" "}
                  {selectedDaftarHadir.hariUjian || "-"} /{" "}
                  {selectedDaftarHadir.jadwalUjian
                    ? new Date(
                        selectedDaftarHadir.jadwalUjian
                      ).toLocaleDateString("id-ID")
                    : "-"}
                </div>
                <div>
                  <span className="font-medium">Waktu</span>:{" "}
                  {(selectedDaftarHadir.waktuMulai?.slice(0, 5) || "-") +
                    " - " +
                    (selectedDaftarHadir.waktuSelesai?.slice(0, 5) || "-")}
                </div>
                <div>
                  <span className="font-medium">Nama Mahasiswa</span>:{" "}
                  {selectedDaftarHadir.mahasiswa?.nama || "-"}
                </div>
                <div>
                  <span className="font-medium">NIM</span>:{" "}
                  {selectedDaftarHadir.mahasiswa?.nim || "-"}
                </div>
                <div>
                  <span className="font-medium">Judul Skripsi</span>:{" "}
                  {selectedDaftarHadir.judulPenelitian || "-"}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1">No.</th>
                      <th className="border px-2 py-1">Nama</th>
                      <th className="border px-2 py-1">NIP/NIDN</th>
                      <th className="border px-2 py-1">Jabatan</th>
                      <th className="border px-2 py-1">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-2 py-1 text-center">1.</td>
                      <td className="border px-2 py-1">
                        {selectedDaftarHadir.ketuaPenguji
                          ? typeof selectedDaftarHadir.ketuaPenguji === "object"
                            ? selectedDaftarHadir.ketuaPenguji.nama
                            : selectedDaftarHadir.ketuaPenguji
                          : "-"}
                      </td>
                      <td className="border px-2 py-1">
                        {selectedDaftarHadir.ketuaPenguji &&
                        typeof selectedDaftarHadir.ketuaPenguji === "object"
                          ? selectedDaftarHadir.ketuaPenguji.nip || "-"
                          : "-"}
                      </td>
                      <td className="border px-2 py-1">Ketua Penguji</td>
                      <td className="border px-2 py-1 text-center text-green-600 font-semibold">
                        Hadir
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 text-center">2.</td>
                      <td className="border px-2 py-1">
                        {selectedDaftarHadir.sekretarisPenguji
                          ? typeof selectedDaftarHadir.sekretarisPenguji ===
                            "object"
                            ? selectedDaftarHadir.sekretarisPenguji.nama
                            : selectedDaftarHadir.sekretarisPenguji
                          : "-"}
                      </td>
                      <td className="border px-2 py-1">
                        {selectedDaftarHadir.sekretarisPenguji &&
                        typeof selectedDaftarHadir.sekretarisPenguji ===
                          "object"
                          ? selectedDaftarHadir.sekretarisPenguji.nip || "-"
                          : "-"}
                      </td>
                      <td className="border px-2 py-1">Sekretaris Penguji</td>
                      <td className="border px-2 py-1 text-center text-green-600 font-semibold">
                        Hadir
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 text-center">3.</td>
                      <td className="border px-2 py-1">
                        {selectedDaftarHadir.penguji1
                          ? typeof selectedDaftarHadir.penguji1 === "object"
                            ? selectedDaftarHadir.penguji1.nama
                            : selectedDaftarHadir.penguji1
                          : "-"}
                      </td>
                      <td className="border px-2 py-1">
                        {selectedDaftarHadir.penguji1 &&
                        typeof selectedDaftarHadir.penguji1 === "object"
                          ? selectedDaftarHadir.penguji1.nip || "-"
                          : "-"}
                      </td>
                      <td className="border px-2 py-1">Penguji I</td>
                      <td className="border px-2 py-1 text-center text-green-600 font-semibold">
                        Hadir
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1 text-center">4.</td>
                      <td className="border px-2 py-1">
                        {selectedDaftarHadir.penguji2
                          ? typeof selectedDaftarHadir.penguji2 === "object"
                            ? selectedDaftarHadir.penguji2.nama
                            : selectedDaftarHadir.penguji2
                          : "-"}
                      </td>
                      <td className="border px-2 py-1">
                        {selectedDaftarHadir.penguji2 &&
                        typeof selectedDaftarHadir.penguji2 === "object"
                          ? selectedDaftarHadir.penguji2.nip || "-"
                          : "-"}
                      </td>
                      <td className="border px-2 py-1">Penguji II</td>
                      <td className="border px-2 py-1 text-center text-green-600 font-semibold">
                        Hadir
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div className="flex justify-end mt-5">
            <Button
              variant="outline"
              onClick={() => setOpenDaftarHadir(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
