"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { UjianResponse, Ujian } from "@/types/Ujian";
import { Button } from "../../ui/button";
import { MoreVertical, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { ScrollArea } from "../../ui/scroll-area";
import { truncateTitle } from "@/lib/utils";

export default function BeritaAcaraUjianTable({
  beritaUjian,
}: {
  beritaUjian: UjianResponse;
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState<Ujian | null>(null);

  function handleDetail(ujian: Ujian) {
    setSelected(ujian);
    setOpenDialog(true);
  }

  return (
    <div className="rounded-sm overflow-x-auto ">
      <Table>
        <TableHeader className="bg-accent ">
          <TableRow>
            <TableCell className=" font-semibold">No</TableCell>
            <TableCell className=" font-semibold">Nama Mahasiswa</TableCell>
            <TableCell className=" font-semibold">Judul</TableCell>
            <TableCell className=" font-semibold">Jenis</TableCell>
            <TableCell className=" font-semibold">Nilai Akhir</TableCell>
            <TableCell className=" font-semibold">Hasil</TableCell>
            <TableCell className=" font-semibold">Aksi</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>Contoh Mahasiswa</TableCell>
            <TableCell>
              {truncateTitle("Contoh Judul Penelitian yang Sangat Panjang", 30)}
            </TableCell>
            <TableCell>Skripsi</TableCell>
            <TableCell>85</TableCell>
            <TableCell>Lulus</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Dialog Detail */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-3xl p-6 max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold  mb-2">
              Detail Berita Acara Ujian
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[65vh] pr-2">
            {selected && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-700 mt-2">
                <div>
                  <span className="font-medium text-gray-800">
                    Nama Mahasiswa:
                  </span>
                  <p>{selected.mahasiswa.nama}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">NIM:</span>
                  <p>{selected.mahasiswa.nim}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">
                    Program Studi:
                  </span>
                  <p>{selected.mahasiswa.prodi.namaProdi}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">
                    Jenis Ujian:
                  </span>
                  <p>{selected.jenisUjian.namaJenis}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-800">
                    Judul Penelitian:
                  </span>
                  <p className="text-gray-600">{selected.judulPenelitian}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">Hari Ujian:</span>
                  <p>{selected.hariUjian || "-"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">
                    Tanggal Ujian:
                  </span>
                  <p>{selected.jadwalUjian}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">
                    Waktu Mulai:
                  </span>
                  <p>{selected.waktuMulai}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">
                    Waktu Selesai:
                  </span>
                  <p>{selected.waktuSelesai}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">Ruangan:</span>
                  <p>{selected.ruangan}</p>
                </div>

                <div className="border-t border-gray-200 md:col-span-2 my-2"></div>

                <div>
                  <span className="font-medium text-gray-800">
                    Ketua Penguji:
                  </span>
                  <p>{selected.ketuaPenguji}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">
                    Sekretaris Penguji:
                  </span>
                  <p>{selected.sekretarisPenguji}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">Penguji 1:</span>
                  <p>{selected.penguji1}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">Penguji 2:</span>
                  <p>{selected.penguji2}</p>
                </div>

                <div className="border-t border-gray-200 md:col-span-2 my-2"></div>

                <div>
                  <span className="font-medium text-gray-800">Dinyatakan:</span>
                  <p className="font-semibold text-[#636AE8]">
                    {selected.hasil || "-"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-800">Catatan:</span>
                  <p className="text-gray-600">{selected.catatan || "-"}</p>
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
    </div>
  );
}
