"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { BeritaUjian } from "@/types/beritaUjian";
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
  beritaUjian: BeritaUjian[];
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState<BeritaUjian | null>(null);

  function handleDetail(ujian: BeritaUjian) {
    setSelected(ujian);
    setOpenDialog(true);
  }

  // Tambahkan komponen Modal sederhana
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
          className={`bg-white rounded shadow-lg p-10 max-w-4xl w-full relative max-h-[90vh] overflow-y-auto ${className}`}
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

  // Helper untuk header berita acara
  function getHeaderText(selected: BeritaUjian | null) {
    if (!selected) return null;
    const jenis = selected.jenisUjian?.namaJenis?.toLowerCase();
    if (jenis === "ujian proposal") {
      return (
        <>
          Pada hari ini,{" "}
          <span className="underline font-semibold">
            {selected.hariUjian ?? "[hari]"}
          </span>
          , tanggal{" "}
          <span className="underline font-semibold">
            {selected.jadwalUjian ?? "[tanggal]"}
          </span>{" "}
          telah dilaksanakan ujian seminar proposal skripsi:
        </>
      );
    }
    if (jenis === "ujian hasil") {
      return (
        <>
          Pada hari ini,{" "}
          <span className="underline font-semibold">
            {selected.hariUjian ?? "[hari]"}
          </span>
          , tanggal{" "}
          <span className="underline font-semibold">
            {selected.jadwalUjian ?? "[tanggal]"}
          </span>{" "}
          telah dilaksanakan ujian hasil skripsi:
        </>
      );
    }
    // default skripsi
    return (
      <>
        Pada hari ini,{" "}
        <span className="underline font-semibold">
          {selected.hariUjian ?? "[hari]"}
        </span>
        , tanggal{" "}
        <span className="underline font-semibold">
          {selected.jadwalUjian ?? "[tanggal]"}
        </span>{" "}
        telah dilaksanakan ujian skripsi:
      </>
    );
  }

  function getJudulLabel(selected: BeritaUjian | null) {
    if (!selected) return "Judul Skripsi";
    const jenis = selected.jenisUjian?.namaJenis?.toLowerCase();
    if (jenis === "ujian proposal") return "Judul";
    return "Judul Skripsi";
  }

  function getKeputusan(selected: BeritaUjian | null) {
    if (!selected) return null;
    const jenis = selected.jenisUjian?.namaJenis?.toLowerCase();
    if (jenis === "ujian proposal") {
      return (
        <div className="mt-8 font-semibold text-base">
          MEMUTUSKAN: Proposal saudara dinyatakan DITERIMA / DITOLAK dengan
          catatan terlampir.
        </div>
      );
    }
    // hasil & skripsi
    return (
      <>
        <div className="mt-8 font-semibold text-base">
          MEMUTUSKAN: Skripsi yang bersangkutan:
        </div>
        <div className="mt-2 space-y-1">
          <div>
            <input
              type="checkbox"
              checked={selected?.hasil === "tanpa_perbaikan"}
              readOnly
              className="mr-2"
            />
            Dapat diterima tanpa perbaikan
          </div>
          <div>
            <input
              type="checkbox"
              checked={selected?.hasil === "perbaikan_kecil"}
              readOnly
              className="mr-2"
            />
            Dapat diterima dengan perbaikan kecil
          </div>
          <div>
            <input
              type="checkbox"
              checked={selected?.hasil === "perbaikan_besar"}
              readOnly
              className="mr-2"
            />
            Dapat diterima dengan perbaikan besar
          </div>
          <div>
            <input
              type="checkbox"
              checked={selected?.hasil === "belum_diterima"}
              readOnly
              className="mr-2"
            />
            Belum dapat diterima
          </div>
        </div>
      </>
    );
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
          {beritaUjian.length > 0 ? (
            beritaUjian.map((ujian, idx) => (
              <TableRow key={ujian.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{ujian.mahasiswa?.nama ?? "-"}</TableCell>
                <TableCell>
                  {truncateTitle(ujian.judulPenelitian ?? "-", 30)}
                </TableCell>
                <TableCell>{ujian.jenisUjian?.namaJenis ?? "-"}</TableCell>
                <TableCell>{ujian.nilaiAkhir ?? "-"}</TableCell>
                <TableCell>{ujian.hasil ?? "-"}</TableCell>
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
                          setOpenDialog(true);
                        }}
                      >
                        <Eye size={16} className="mr-2" /> Detail
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Tidak ada berita acara ujian
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Modal Detail Berita Acara */}
      <Modal open={openDialog} onClose={() => setOpenDialog(false)}>
        <div className="mb-6">
          <div className="text-base leading-relaxed">
            {getHeaderText(selected)}
          </div>
          <div className="grid grid-cols-12 gap-y-2 gap-x-2 mt-6 text-base">
            <div className="col-span-3 font-medium">Nama</div>
            <div className="col-span-1">:</div>
            <div className="col-span-8">{selected?.mahasiswa?.nama ?? "-"}</div>
            <div className="col-span-3 font-medium">NIM</div>
            <div className="col-span-1">:</div>
            <div className="col-span-8">{selected?.mahasiswa?.nim ?? "-"}</div>
            <div className="col-span-3 font-medium">Program Studi</div>
            <div className="col-span-1">:</div>
            <div className="col-span-8">
              {selected?.mahasiswa?.prodi?.namaProdi ?? "-"}
            </div>
            <div className="col-span-3 font-medium">
              {getJudulLabel(selected)}
            </div>
            <div className="col-span-1">:</div>
            <div className="col-span-8 break-words">
              {selected?.judulPenelitian ?? "-"}
            </div>
          </div>
        </div>
        <div className="mt-6 mb-3 font-semibold text-base">Tim Penguji:</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">No.</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead>Tanda Tangan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1.</TableCell>
              <TableCell>{selected?.ketuaPenguji?.nama ?? "-"}</TableCell>
              <TableCell>Ketua Penguji</TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2.</TableCell>
              <TableCell>{selected?.sekretarisPenguji?.nama ?? "-"}</TableCell>
              <TableCell>Sekretaris Penguji</TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>3.</TableCell>
              <TableCell>{selected?.penguji1?.nama ?? "-"}</TableCell>
              <TableCell>Penguji I</TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>4.</TableCell>
              <TableCell>{selected?.penguji2?.nama ?? "-"}</TableCell>
              <TableCell>Penguji II</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {getKeputusan(selected)}
        <div className="mt-4">
          <span className="font-medium text-gray-800">Catatan:</span>
          <p className="text-gray-600">{selected?.catatan ?? "-"}</p>
        </div>
        <div className="flex justify-end mt-10">
          <Button variant="outline" onClick={() => setOpenDialog(false)}>
            Tutup
          </Button>
        </div>
      </Modal>
    </div>
  );
}
