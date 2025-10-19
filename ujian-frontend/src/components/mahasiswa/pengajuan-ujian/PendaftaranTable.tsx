"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { getJenisUjianColor, getStatusColor, truncateTitle } from "@/lib/utils";
import { PendaftaranUjianResponse } from "@/types/PendaftaranUjian";
import { MahasiswaUser } from "@/types/Auth";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { createPendaftaranUjian } from "@/actions/pendaftaranUjian";

export default function PendaftaranTable({
  pendaftaranUjian,
  loggedInUser,
  jenisUjianList,
  pengajuanRanpel,
}: {
  pendaftaranUjian: PendaftaranUjianResponse;
  loggedInUser: MahasiswaUser;
  jenisUjianList: Array<{ id: number; namaJenis: string }>;
  pengajuanRanpel: PengajuanRanpel[];
}) {
  const [openForm, setOpenForm] = useState(false);
  const [selectedJenisUjian, setSelectedJenisUjian] = useState<number | null>(
    null
  );
  const [formOpen, setFormOpen] = useState(false);
  const [berkasTranskrip, setBerkasTranskrip] = useState<File | null>(null);
  const [berkasPengesahan, setBerkasPengesahan] = useState<File | null>(null);
  const [berkasPlagiasi, setBerkasPlagiasi] = useState<File | null>(null);
  const [berkasProposal, setBerkasProposal] = useState<File | null>(null);
  const [selectedRanpelId, setSelectedRanpelId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handlePengajuanClick() {
    setOpenForm(true);
  }

  function handleJenisUjianSelect(id: number) {
    setSelectedJenisUjian(id);
    // Set default judul penelitian jika hanya satu
    if (pengajuanRanpel.length === 1) {
      setSelectedRanpelId(pengajuanRanpel[0].ranpel.id ?? null);
    } else {
      setSelectedRanpelId(null);
    }
    setFormOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    if (
      !selectedJenisUjian ||
      !selectedRanpelId ||
      !berkasTranskrip ||
      !berkasPengesahan ||
      !berkasPlagiasi ||
      !berkasProposal ||
      !loggedInUser?.id
    ) {
      alert("Lengkapi semua data!");
      return;
    }
    try {
      await createPendaftaranUjian({
        mahasiswaId: loggedInUser.id,
        ranpelId: selectedRanpelId,
        jenisUjianId: selectedJenisUjian,
        berkas: [
          berkasTranskrip,
          berkasPengesahan,
          berkasPlagiasi,
          berkasProposal,
        ],
      });
      
      // Optional: refresh data, show success, etc.
    } catch (err: unknown) {
      let msg = "Gagal submit pendaftaran ujian.";
      if (
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof (err as { message?: string }).message === "string"
      ) {
        const errorMessage = (err as { message: string }).message;
        if (errorMessage.includes("Body exceeded 1 MB limit")) {
          msg =
            "Gagal submit pendaftaran ujian: File yang diunggah terlalu besar (maksimal 1 MB per file). Silakan kompres file PDF Anda atau upload file yang lebih kecil.";
        } else {
          msg += " " + errorMessage;
        }
      }
      setErrorMsg(msg);
      return;
    }
    setFormOpen(false);
    setOpenForm(false);
    setSelectedJenisUjian(null);
    setBerkasTranskrip(null);
    setBerkasPengesahan(null);
    setBerkasPlagiasi(null);
    setBerkasProposal(null);
    setSelectedRanpelId(
      pengajuanRanpel.length === 1 ? pengajuanRanpel[0].ranpel.id ?? null : null
    );
  }

  // Ambil ipk dan semester dari loggedInUser
  const ipk = loggedInUser?.ipk ?? 0;
  const semester = loggedInUser?.semester ?? 0;

  // Fungsi untuk cek apakah bisa daftar ujian proposal
  function canDaftarProposal() {
    return ipk >= 2 && semester >= 6;
  }

  return (
    <div className="rounded-sm overflow-x-auto">
      <div className="mb-4 flex justify-end">
        {/* Tombol Pengajuan Ujian tetap, pemilihan jenis ujian di dialog */}
        <Button onClick={handlePengajuanClick}>Pengajuan Ujian</Button>
      </div>
      <Table>
        <TableHeader className="bg-accent">
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Judul</TableHead>
            <TableHead>Jenis Ujian</TableHead>
            <TableHead>Tanggal Pengajuan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendaftaranUjian.data && pendaftaranUjian.data.length > 0 ? (
            pendaftaranUjian.data.map((pendaftaran, index: number) => (
              <TableRow key={pendaftaran.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {truncateTitle(pendaftaran.ranpel.judulPenelitian)}
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
                  {new Date(pendaftaran.tanggalPengajuan).toLocaleDateString(
                    "id-ID"
                  )}
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
                  <Button variant="outline" className="text-xs">
                    <Eye />
                    Lihat
                  </Button>
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

      {/* Dialog Pilih Jenis Ujian */}
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pilih Jenis Ujian</DialogTitle>
            <DialogDescription>
              Pilih jenis ujian yang ingin diajukan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {jenisUjianList.map((jenis) => {
              // Jika jenis ujian adalah "Proposal", cek syarat
              const isProposal = jenis.namaJenis
                .toLowerCase()
                .includes("proposal");
              const disabled = isProposal && !canDaftarProposal();
              return (
                <Button
                  key={jenis.id}
                  className="w-full"
                  variant="outline"
                  onClick={() => handleJenisUjianSelect(jenis.id)}
                  disabled={disabled}
                >
                  {jenis.namaJenis}
                  {isProposal && disabled && (
                    <span className="ml-2 text-xs text-red-500">
                      (IPK &ge; 2 dan Semester &ge; 6 diperlukan)
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Form Pengajuan */}
      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          setErrorMsg(null);
          // Reset judul penelitian saat dialog dibuka
          if (open) {
            if (pengajuanRanpel.length === 1) {
              setSelectedRanpelId(pengajuanRanpel[0].ranpel.id ?? null);
            } else {
              setSelectedRanpelId(null);
            }
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Form Pengajuan Ujian</DialogTitle>
            <DialogDescription>
              Isi data pengajuan ujian di bawah ini.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label className="mb-1 block">Jenis Ujian</Label>
              <Input
                value={
                  jenisUjianList.find((j) => j.id === selectedJenisUjian)
                    ?.namaJenis || ""
                }
                readOnly
              />
            </div>
            <div>
              <Label className="mb-1 block">Judul Penelitian</Label>
              {pengajuanRanpel && pengajuanRanpel.length > 1 ? (
                <select
                  className="w-full border rounded px-2 py-1"
                  value={selectedRanpelId ?? ""}
                  onChange={(e) => setSelectedRanpelId(Number(e.target.value))}
                  required
                >
                  <option value="" disabled>
                    Pilih Judul Penelitian
                  </option>
                  {pengajuanRanpel.map((ranpel) => (
                    <option key={ranpel.ranpel.id} value={ranpel.ranpel.id}>
                      {ranpel.ranpel.judulPenelitian}
                    </option>
                  ))}
                </select>
              ) : pengajuanRanpel && pengajuanRanpel.length === 1 ? (
                <Input
                  value={pengajuanRanpel[0].ranpel.judulPenelitian}
                  readOnly
                />
              ) : (
                <Input
                  value=""
                  readOnly
                  placeholder="Tidak ada judul penelitian"
                />
              )}
            </div>
            {/* Hidden input id ranpel, hanya dari pengajuanRanpel */}
            {pengajuanRanpel &&
              pengajuanRanpel.length > 1 &&
              selectedRanpelId && (
                <input type="hidden" name="ranpelId" value={selectedRanpelId} />
              )}
            {pengajuanRanpel && pengajuanRanpel.length === 1 && (
              <input
                type="hidden"
                name="ranpelId"
                value={pengajuanRanpel[0].ranpel.id}
              />
            )}
            <div>
              <Label className="mb-1 block">Transkrip Nilai</Label>
              <Input
                type="file"
                onChange={(e) =>
                  setBerkasTranskrip(e.target.files?.[0] ?? null)
                }
                required
              />
              {berkasTranskrip && (
                <div className="text-xs mt-1">{berkasTranskrip.name}</div>
              )}
            </div>
            <div>
              <Label className="mb-1 block">Pengesahan Proposal</Label>
              <Input
                type="file"
                onChange={(e) =>
                  setBerkasPengesahan(e.target.files?.[0] ?? null)
                }
                required
              />
              {berkasPengesahan && (
                <div className="text-xs mt-1">{berkasPengesahan.name}</div>
              )}
            </div>
            <div>
              <Label className="mb-1 block">
                Surat Keterangan Lulus Plagiasi
              </Label>
              <Input
                type="file"
                onChange={(e) => setBerkasPlagiasi(e.target.files?.[0] ?? null)}
                required
              />
              {berkasPlagiasi && (
                <div className="text-xs mt-1">{berkasPlagiasi.name}</div>
              )}
            </div>
            <div>
              <Label className="mb-1 block">Proposal Skripsi</Label>
              <Input
                type="file"
                onChange={(e) => setBerkasProposal(e.target.files?.[0] ?? null)}
                required
              />
              {berkasProposal && (
                <div className="text-xs mt-1">{berkasProposal.name}</div>
              )}
            </div>
            {errorMsg && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded mb-2 text-sm">
                {errorMsg}
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <Button type="submit" variant="default">
                Ajukan
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
              >
                Batal
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
