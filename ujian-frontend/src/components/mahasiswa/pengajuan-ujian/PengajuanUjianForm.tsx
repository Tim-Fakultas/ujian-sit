"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPendaftaranUjian } from "@/actions/pendaftaranUjian";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { User } from "@/types/Auth";

export default function PengajuanUjianForm({
  user,
  jenisUjianList,
  pengajuanRanpel,
}: {
  user: User | null;
  jenisUjianList: Array<{ id: number; namaJenis: string }>;
  pengajuanRanpel: PengajuanRanpel[];
}) {
  const [selectedJenisUjian, setSelectedJenisUjian] = useState<number | null>(
    null
  );
  const [berkasTranskrip, setBerkasTranskrip] = useState<File | null>(null);
  const [berkasPengesahan, setBerkasPengesahan] = useState<File | null>(null);
  const [berkasPlagiasi, setBerkasPlagiasi] = useState<File | null>(null);
  const [berkasProposal, setBerkasProposal] = useState<File | null>(null);
  const [selectedRanpelId, setSelectedRanpelId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Ambil ipk dan semester dari user
  const ipk = user?.ipk ?? 0;
  const semester = user?.semester ?? 0;

  function canDaftarProposal() {
    return 1 >= 2 && semester >= 6;
  }

  function handleJenisUjianSelect(id: number) {
    setSelectedJenisUjian(id);
    if (pengajuanRanpel.length === 1) {
      setSelectedRanpelId(pengajuanRanpel[0].ranpel.id ?? null);
    } else {
      setSelectedRanpelId(null);
    }
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
      !user?.id
    ) {
      setErrorMsg("Lengkapi semua data!");
      return;
    }
    try {
      await createPendaftaranUjian({
        mahasiswaId: user.id,
        ranpelId: selectedRanpelId,
        jenisUjianId: selectedJenisUjian,
        berkas: [
          berkasTranskrip,
          berkasPengesahan,
          berkasPlagiasi,
          berkasProposal,
        ],
      });
      setErrorMsg(null);
      setSelectedJenisUjian(null);
      setBerkasTranskrip(null);
      setBerkasPengesahan(null);
      setBerkasPlagiasi(null);
      setBerkasProposal(null);
      setSelectedRanpelId(
        pengajuanRanpel.length === 1
          ? pengajuanRanpel[0].ranpel.id ?? null
          : null
      );
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
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Info syarat proposal */}
      <div className="mb-2">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-700 font-medium">
            Syarat Pengajuan Ujian Proposal:
          </span>
          <div className="flex gap-4 text-xs">
            <span>
              IPK Anda:{" "}
              <span
                className={`font-bold ${
                  ipk >= 2 ? "text-green-600" : "text-red-500"
                }`}
              >
                {ipk}
              </span>{" "}
              {ipk < 2 && (
                <span className="ml-1 text-red-500">(Minimal 2.00)</span>
              )}
            </span>
            <span>
              Semester Anda:{" "}
              <span
                className={`font-bold ${
                  semester >= 6 ? "text-green-600" : "text-red-500"
                }`}
              >
                {semester}
              </span>{" "}
              {semester < 6 && (
                <span className="ml-1 text-red-500">(Minimal 6)</span>
              )}
            </span>
          </div>
          {!canDaftarProposal() && (
            <div className="mt-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-xs">
              Anda belum memenuhi syarat pengajuan ujian proposal.
              <br />
              Syarat: IPK &ge; 2.00 dan Semester &ge; 6.
            </div>
          )}
        </div>
      </div>
      <div>
        <Label className="mb-1 block">Jenis Ujian</Label>
        <select
          className="w-full border rounded px-2 py-1"
          value={selectedJenisUjian ?? ""}
          onChange={(e) => handleJenisUjianSelect(Number(e.target.value))}
          required
        >
          <option value="" disabled>
            Pilih Jenis Ujian
          </option>
          {jenisUjianList.map((jenis) => {
            const isProposal = jenis.namaJenis
              .toLowerCase()
              .includes("proposal");
            const disabled = isProposal && !canDaftarProposal();
            return (
              <option key={jenis.id} value={jenis.id} disabled={disabled}>
                {jenis.namaJenis}
                {isProposal && disabled
                  ? " (IPK ≥ 2 dan Semester ≥ 6 diperlukan)"
                  : ""}
              </option>
            );
          })}
        </select>
        {/* Jika proposal disabled, tampilkan info di bawah select */}
        {jenisUjianList.some((j) =>
          j.namaJenis.toLowerCase().includes("proposal")
        ) &&
          !canDaftarProposal() && (
            <div className="mt-1 text-xs text-red-500">
              Anda belum bisa mengajukan ujian proposal.
            </div>
          )}
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
          <Input value={pengajuanRanpel[0].ranpel.judulPenelitian} readOnly />
        ) : (
          <Input value="" readOnly placeholder="Tidak ada judul penelitian" />
        )}
      </div>
      <div>
        <Label className="mb-1 block">Transkrip Nilai</Label>
        <Input
          type="file"
          onChange={(e) => setBerkasTranskrip(e.target.files?.[0] ?? null)}
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
          onChange={(e) => setBerkasPengesahan(e.target.files?.[0] ?? null)}
          required
        />
        {berkasPengesahan && (
          <div className="text-xs mt-1">{berkasPengesahan.name}</div>
        )}
      </div>
      <div>
        <Label className="mb-1 block">Surat Keterangan Lulus Plagiasi</Label>
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
      </div>
    </form>
  );
}
