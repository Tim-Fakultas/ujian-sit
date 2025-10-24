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
import { truncateTitle } from "@/lib/utils";
import { daftarKehadiran } from "@/types/daftarKehadiran";

export default function BeritaAcaraUjianTable({
  beritaUjian,
  daftarKehadiran,
}: {
  beritaUjian: BeritaUjian[];
  daftarKehadiran: daftarKehadiran[];
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState<BeritaUjian | null>(null);

  // ✅ Ambil status kehadiran dosen berdasarkan daftarKehadiran
  function getStatusHadir(dosenId?: number) {
    if (!dosenId) return null;
    const kehadiran = daftarKehadiran.find((item) => item.dosenId === dosenId);
    return kehadiran?.statusKehadiran ?? null;
  }

  function handleDetail(ujian: BeritaUjian) {
    setSelected(ujian);
    setOpenDialog(true);
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

  // Helper teks header berita acara
  function getHeaderText(selected: BeritaUjian | null) {
    if (!selected) return null;
    const jenis = selected.jenisUjian?.namaJenis?.toLowerCase();
    const hari = selected.hariUjian ?? "Senin";
    const tanggal = selected.jadwalUjian
      ? new Date(selected.jadwalUjian).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "[tanggal]";

    const teks = {
      "ujian proposal": `telah dilaksanakan ujian seminar proposal skripsi:`,
      "ujian hasil": `telah dilaksanakan ujian hasil skripsi:`,
      default: `telah dilaksanakan ujian skripsi:`,
    };

    return (
      <>
        Pada hari ini, <span className="underline font-semibold">{hari}</span>,
        tanggal <span className="underline font-semibold">{tanggal}</span>{" "}
        {teks[jenis as keyof typeof teks] ?? teks.default}
      </>
    );
  }

  // Label judul
  function getJudulLabel(selected: BeritaUjian | null) {
    if (!selected) return "Judul Skripsi";
    const jenis = selected.jenisUjian?.namaJenis?.toLowerCase();
    if (jenis === "ujian proposal") return "Judul";
    return "Judul Skripsi";
  }

  return (
    <div className="rounded-sm overflow-x-auto ">
      <Table>
        <TableHeader className="bg-accent ">
          <TableRow>
            <TableCell className="font-semibold">No</TableCell>
            <TableCell className="font-semibold">Nama Mahasiswa</TableCell>
            <TableCell className="font-semibold">Judul</TableCell>
            <TableCell className="font-semibold">Jenis</TableCell>
            <TableCell className="font-semibold">Nilai Akhir</TableCell>
            <TableCell className="font-semibold">Hasil</TableCell>
            <TableCell className="font-semibold">Aksi</TableCell>
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
                      <DropdownMenuItem onClick={() => handleDetail(ujian)}>
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
          <h1 className="font-semibold mb-4">
            BERITA ACARA UJIAN SEMINAR PROPOSAL
          </h1>
          <div className="text-base leading-relaxed mb-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
            {getHeaderText(selected)}
          </div>

          {/* Detail mahasiswa */}
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

        {/* Tabel Penguji */}
        <div className="mt-6 mb-3 font-semibold text-base">Tim Penguji:</div>
        <Table className="border border-gray-200 rounded-lg overflow-hidden">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="w-8">No.</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead>Kehadiran</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                label: "Ketua Penguji",
                dosen: selected?.ketuaPenguji,
              },
              {
                label: "Sekretaris Penguji",
                dosen: selected?.sekretarisPenguji,
              },
              {
                label: "Penguji I",
                dosen: selected?.penguji1,
              },
              {
                label: "Penguji II",
                dosen: selected?.penguji2,
              },
            ].map((row, i) => {
              const status = getStatusHadir(row.dosen?.id);
              let statusClass = "text-red-400 italic ";
              let statusText = "Tidak hadir";
              if (status === "hadir") {
                statusClass = "text-green-600 font-semibold";
                statusText = "Hadir";
              } else if (status === "izin") {
                statusClass = "text-yellow-600 font-semibold";
                statusText = "Izin";
              }

              return (
                <TableRow key={i} className="even:bg-gray-50">
                  <TableCell>{i + 1}.</TableCell>
                  <TableCell>{row.dosen?.nama ?? "-"}</TableCell>
                  <TableCell>{row.label}</TableCell>
                  <TableCell>
                    <span className={statusClass}>{statusText}</span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Keputusan / Hasil Ujian */}
        <div className="mt-8">
          {(() => {
            if (!selected) return null;
            const jenis = selected.jenisUjian?.namaJenis?.toLowerCase();
            const hasil = selected.hasil?.toLowerCase();

            // ✅ Untuk ujian proposal
            if (jenis === "ujian proposal") {
              let keputusanText = "DITERIMA / DITOLAK";
              let keputusanClass = "text-gray-800";
              if (hasil === "lulus") {
                keputusanText = "DITERIMA";
                keputusanClass = "text-green-700 font-semibold";
              } else if (hasil === "tidak lulus") {
                keputusanText = "DITOLAK";
                keputusanClass = "text-red-700 font-semibold";
              }

              return (
                <p className="mt-4 text-base text-gray-800 leading-relaxed">
                  <span className="font-bold">MEMUTUSKAN:</span> Proposal
                  saudara dinyatakan{" "}
                  <span className={`underline ${keputusanClass}`}>
                    {keputusanText}
                  </span>{" "}
                  dengan catatan terlampir.
                </p>
              );
            }

            // ✅ Untuk ujian hasil / skripsi
            if (
              jenis === "ujian hasil" ||
              jenis === "ujian skripsi" ||
              !jenis
            ) {
              let keputusanText = "";
              let keputusanClass = "";

              switch (hasil) {
                case "tanpa_perbaikan":
                  keputusanText = "Dapat diterima tanpa perbaikan";
                  keputusanClass = "text-green-700 font-semibold";
                  break;
                case "perbaikan_kecil":
                  keputusanText = "Dapat diterima dengan perbaikan kecil";
                  keputusanClass = "text-yellow-700 font-semibold";
                  break;
                case "perbaikan_besar":
                  keputusanText = "Dapat diterima dengan perbaikan besar";
                  keputusanClass = "text-orange-700 font-semibold";
                  break;
                case "belum_diterima":
                case "tidak lulus":
                  keputusanText = "Belum dapat diterima";
                  keputusanClass = "text-red-700 font-semibold";
                  break;
                default:
                  keputusanText = "Belum ada hasil ujian.";
                  keputusanClass = "text-gray-600 italic";
              }

              return (
                <p className="mt-4 text-base text-gray-800 leading-relaxed">
                  <span className="font-bold">MEMUTUSKAN:</span>{" "}
                  <span className={keputusanClass}>{keputusanText}</span>.
                </p>
              );
            }

            return null;
          })()}
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
