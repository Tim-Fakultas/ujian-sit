"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { User } from "@/types/Auth";
import { Eye, MoreVertical } from "lucide-react";
import { getJenisUjianColor, getStatusColor, truncateTitle } from "@/lib/utils";
import { PendaftaranUjian } from "@/types/PendaftaranUjian";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import React, { useState, useTransition } from "react";
import { updateStatusPendaftaranUjian } from "@/actions/pendaftaranUjian";

export default function PendaftaranUjianTable({
  pendaftaranUjian,
  user,
}: {
  pendaftaranUjian: PendaftaranUjian[];
  user: User;
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState<PendaftaranUjian | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDetail(pendaftaran: PendaftaranUjian) {
    setSelected(pendaftaran);
    setOpenDialog(true);
  }

  async function handleBuatSKUjian(id: number) {
    try {
      await updateStatusPendaftaranUjian(id, "diterima");
      setOpenDialog(false);
      // window.location.reload(); // Atau trigger re-fetch data jika pakai SWR/React Query
    } catch (err) {
      alert("Gagal memperbarui status pendaftaran ujian.");
      console.error(err);
    }
  }

  return (
    <div className="overflow-x-auto rounded-sm">
      <Table>
        <TableHeader className="bg-accent">
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>Nama Mahasiswa</TableCell>
            <TableCell>Judul</TableCell>
            <TableCell>Tanggal Pengajuan</TableCell>
            <TableCell>Jenis</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Aksi</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendaftaranUjian.length > 0 ? (
            pendaftaranUjian.map((pendaftaran, index) => (
              <TableRow key={pendaftaran.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{pendaftaran.mahasiswa.nama}</TableCell>
                <TableCell>
                  {truncateTitle(pendaftaran.ranpel.judulPenelitian)}
                </TableCell>
                <TableCell>
                  {new Date(pendaftaran.tanggalPengajuan).toLocaleDateString(
                    "id-ID"
                  )}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold inline-block ${getJenisUjianColor(
                      pendaftaran.jenisUjian.namaJenis
                    )}`}
                  >
                    {pendaftaran.jenisUjian.namaJenis}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs ${getStatusColor(
                      pendaftaran.status
                    )}`}
                  >
                    {pendaftaran.status}
                  </span>
                </TableCell>
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
                        onClick={() => handleDetail(pendaftaran)}
                      >
                        <Eye size={16} />
                        Lihat Detail
                      </DropdownMenuItem>
                      {/* Tambahkan opsi lain jika diperlukan */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-500">
                Tidak ada data pendaftaran ujian
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-2 text-2xl font-bold text-blue-700">
              Detail Pendaftaran Ujian
            </DialogTitle>
            {selected && (
              <div className="space-y-6 mt-2 max-h-[70vh] overflow-y-auto pr-2 ">
                {/* Mahasiswa Info */}
                <div className="border-b pb-3 mb-3 flex flex-col gap-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="text-lg font-semibold text-blue-700">
                      {selected.mahasiswa.nama}
                    </span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      NIM: {selected.mahasiswa.nim}
                    </span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      Prodi: {selected.mahasiswa.prodiId.namaProdi}
                    </span>
                  </div>
                </div>
                {/* Ujian Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="font-semibold text-gray-700 mb-1">
                      Judul Penelitian
                    </div>
                    <div className="bg-gray-50 border rounded px-3 py-2 text-gray-800 text-sm">
                      {selected.ranpel.judulPenelitian}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>
                      <span className="font-semibold">Jenis Ujian:</span>{" "}
                      <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-semibold">
                        {selected.jenisUjian.namaJenis}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">Tanggal Pengajuan:</span>{" "}
                      <span className="text-sm">
                        {new Date(selected.tanggalPengajuan).toLocaleDateString(
                          "id-ID"
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">Status:</span>{" "}
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold
                        ${
                          selected.status === "diterima"
                            ? "bg-blue-100 text-blue-800"
                            : selected.status === "diverifikasi"
                            ? "bg-green-100 text-green-800"
                            : selected.status === "ditolak"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {selected.status}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Berkas Section */}
                <div>
                  <div className="font-semibold mb-2">Berkas</div>
                  {selected.berkas && selected.berkas.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {selected.berkas.map((file, idx) => {
                        const fileUrl = `http://localhost:8000/storage/${file.filePath}`;
                        let label = "";
                        if (idx === 0) label = "Transkrip Nilai";
                        else if (idx === 1) label = "Pengesahan Proposal";
                        else if (idx === 2)
                          label = "Surat Keterangan Lulus Plagiasi";
                        else if (idx === 3) label = "Proposal Skripsi";
                        else
                          label = file.namaBerkas || fileUrl.split("/").pop();

                        return (
                          <div
                            key={idx}
                            className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white border rounded px-3 py-2 shadow-sm"
                          >
                            <div className="flex items-center gap-2 mb-2 md:mb-0">
                              <Eye size={16} className="text-blue-500" />
                              <span className="font-semibold mr-2">
                                {label}:
                              </span>
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-700 underline font-medium break-all"
                              >
                                {file.namaBerkas || fileUrl.split("/").pop()}
                              </a>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(fileUrl, "_blank")}
                            >
                              Lihat
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="italic text-gray-500 ml-2">
                      Tidak ada berkas
                    </span>
                  )}
                </div>
                {/* Actions */}
                <div className="flex gap-2  justify-end border-t mt-4 pt-4">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      // TODO: implement aksi tolak
                    }}
                  >
                    Tolak
                  </Button>
                  <Button
                    variant="default"
                    disabled={isPending}
                    onClick={() => {
                      if (selected) {
                        startTransition(() => handleBuatSKUjian(selected.id));
                      }
                    }}
                  >
                    {isPending ? "Memproses..." : "Buat SK Ujian"}
                  </Button>
                </div>
              </div>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
