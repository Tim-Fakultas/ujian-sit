"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPendaftaranUjian } from "@/actions/pendaftaranUjian";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { User } from "@/types/Auth";
import { Ujian } from "@/types/Ujian";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select";
import revalidateAction from "@/actions/revalidateAction";
import { CheckCircle2 } from "lucide-react";

export default function PengajuanUjianForm({
  user,
  jenisUjianList,
  pengajuanRanpel,
  ujian,
}: {
  user: User | null;
  jenisUjianList: Array<{ id: number; namaJenis: string }>;
  pengajuanRanpel: PengajuanRanpel[];
  ujian: Ujian[];
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

  // Cek kelulusan ujian proposal & hasil
  const ujianProposal = ujian.find(
    (u) =>
      u.jenisUjian?.namaJenis?.toLowerCase().includes("proposal") &&
      u.mahasiswa?.id === user?.id
  );
  const ujianHasil = ujian.find(
    (u) =>
      u.jenisUjian?.namaJenis?.toLowerCase().includes("hasil") &&
      u.mahasiswa?.id === user?.id
  );

  const lulusProposal = ujianProposal?.hasil === "lulus";
  const lulusHasil = ujianHasil?.hasil === "lulus";

  // Cek apakah sudah pernah daftar ujian proposal/hasil
  const pernahDaftarProposal = !!ujianProposal;
  const pernahDaftarHasil = !!ujianHasil;

  function canDaftarProposal() {
    return ipk >= 2 && semester >= 6;
  }
  function canDaftarHasil() {
    // Bisa daftar hasil jika sudah lulus proposal
    return canDaftarProposal() && lulusProposal;
  }

  function canDaftarSkripsi() {
    // Bisa daftar skripsi jika sudah lulus hasil
    return canDaftarHasil() && lulusHasil;
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

      // Dynamic import sonner toast & show custom success
      const { toast } = await import("sonner");
      toast(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="text-green-500" size={20} />
          <div>
            <div className="font-semibold">Berhasil!</div>
            <div className="text-xs">Pendaftaran ujian berhasil diajukan.</div>
          </div>
        </div>
      );

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

      revalidateAction("/mahasiswa/pendaftaran-ujian");
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
    <form
      className="space-y-6 bg-white rounded-lg max-w-2xl mx-auto"
      onSubmit={handleSubmit}
    >
      {/* Info syarat proposal */}
      <div className="mb-2">
        <div className="flex flex-col gap-1">
          <span className="text-base text-gray-700 font-semibold mb-1">
            Syarat Pengajuan Ujian Proposal
          </span>
          <div className="flex flex-wrap gap-4 text-xs">
            <span>
              IPK Anda:{" "}
              <span
                className={`font-bold ${
                  ipk >= 2 ? "text-green-600" : "text-red-500"
                }`}
              >
                {ipk}
              </span>
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
              </span>
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
        <Label className="mb-1 block font-medium">Jenis Ujian</Label>
        <Select
          value={selectedJenisUjian ? String(selectedJenisUjian) : ""}
          onValueChange={(val) => handleJenisUjianSelect(Number(val))}
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih Jenis Ujian" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {jenisUjianList.map((jenis) => {
                const nama = jenis.namaJenis.toLowerCase();
                const isProposal = nama.includes("proposal");
                const isHasil = nama.includes("hasil");
                const isSkripsi = nama.includes("skripsi");

                // Disable logic
                let disabled = false;
                let reason = "";

                if (isProposal) {
                  disabled = !canDaftarProposal();
                  if (disabled)
                    reason = " (IPK ≥ 2 dan Semester ≥ 6 diperlukan)";
                } else if (isHasil) {
                  if (!canDaftarProposal()) {
                    disabled = true;
                    reason = " (Belum memenuhi syarat proposal)";
                  } else if (!lulusProposal) {
                    disabled = true;
                    reason = pernahDaftarProposal
                      ? " (Belum lulus ujian proposal)"
                      : " (Belum mengikuti ujian proposal)";
                  }
                } else if (isSkripsi) {
                  if (!canDaftarProposal()) {
                    disabled = true;
                    reason = " (Belum memenuhi syarat proposal)";
                  } else if (!lulusProposal) {
                    disabled = true;
                    reason = pernahDaftarProposal
                      ? " (Belum lulus ujian proposal)"
                      : " (Belum mengikuti ujian proposal)";
                  } else if (!lulusHasil) {
                    disabled = true;
                    reason = pernahDaftarHasil
                      ? " (Belum lulus ujian hasil)"
                      : " (Belum mengikuti ujian hasil)";
                  }
                }

                return (
                  <SelectItem
                    key={jenis.id}
                    value={String(jenis.id)}
                    disabled={disabled}
                  >
                    {jenis.namaJenis}
                    {reason}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* Info warning bawah select */}
        {(() => {
          const selectedJenis = jenisUjianList.find(
            (j) => j.id === selectedJenisUjian
          );
          if (!selectedJenis) return null;
          const nama = selectedJenis.namaJenis.toLowerCase();
          if (nama.includes("proposal") && !canDaftarProposal()) {
            return (
              <div className="mt-1 text-xs text-red-500">
                Anda belum bisa mengajukan ujian proposal.
              </div>
            );
          }
          if (nama.includes("hasil")) {
            if (!canDaftarProposal()) {
              return (
                <div className="mt-1 text-xs text-red-500">
                  Anda belum memenuhi syarat pengajuan proposal.
                </div>
              );
            }
            if (!lulusProposal) {
              return (
                <div className="mt-1 text-xs text-red-500">
                  Anda belum lulus ujian proposal.
                </div>
              );
            }
          }
          if (nama.includes("skripsi")) {
            if (!canDaftarProposal()) {
              return (
                <div className="mt-1 text-xs text-red-500">
                  Anda belum memenuhi syarat pengajuan proposal.
                </div>
              );
            }
            if (!lulusProposal) {
              return (
                <div className="mt-1 text-xs text-red-500">
                  Anda belum lulus ujian proposal.
                </div>
              );
            }
            if (!lulusHasil) {
              return (
                <div className="mt-1 text-xs text-red-500">
                  Anda belum lulus ujian hasil.
                </div>
              );
            }
          }
          return null;
        })()}
      </div>
      <div>
        <Label className="mb-1 block font-medium">Judul Penelitian</Label>
        {pengajuanRanpel && pengajuanRanpel.length > 1 ? (
          <Select
            value={selectedRanpelId ? String(selectedRanpelId) : ""}
            onValueChange={(val) => setSelectedRanpelId(Number(val))}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Judul Penelitian" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {pengajuanRanpel.map((ranpel) => (
                  <SelectItem
                    key={ranpel.ranpel.id}
                    value={String(ranpel.ranpel.id)}
                  >
                    {ranpel.ranpel.judulPenelitian}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : pengajuanRanpel && pengajuanRanpel.length === 1 ? (
          <Input value={pengajuanRanpel[0].ranpel.judulPenelitian} readOnly />
        ) : (
          <Input value="" readOnly placeholder="Tidak ada judul penelitian" />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-1 block font-medium text-xs">
            Transkrip Nilai
          </Label>
          <Input
            type="file"
            onChange={(e) => setBerkasTranskrip(e.target.files?.[0] ?? null)}
            required
            className="w-full file:text-xs file:py-1 file:font-normal text-xs"
            style={{ fontSize: "0.75rem" }}
          />
          {berkasTranskrip && (
            <div className="text-xs mt-1">{berkasTranskrip.name}</div>
          )}
        </div>
        <div>
          <Label className="mb-1 block font-medium text-xs">
            Pengesahan Proposal
          </Label>
          <Input
            type="file"
            onChange={(e) => setBerkasPengesahan(e.target.files?.[0] ?? null)}
            required
            className="w-full file:text-xs file:py-1 file:font-normal text-xs"
            style={{ fontSize: "0.75rem" }}
          />
          {berkasPengesahan && (
            <div className="text-xs mt-1">{berkasPengesahan.name}</div>
          )}
        </div>
        <div>
          <Label className="mb-1 block font-medium text-xs">
            Surat Keterangan Lulus Plagiasi
          </Label>
          <Input
            type="file"
            onChange={(e) => setBerkasPlagiasi(e.target.files?.[0] ?? null)}
            required
            className="w-full file:text-xs file:py-1 file:font-normal text-xs"
            style={{ fontSize: "0.75rem" }}
          />
          {berkasPlagiasi && (
            <div className="text-xs mt-1">{berkasPlagiasi.name}</div>
          )}
        </div>
        <div>
          <Label className="mb-1 block font-medium text-xs">
            Proposal Skripsi
          </Label>
          <Input
            type="file"
            onChange={(e) => setBerkasProposal(e.target.files?.[0] ?? null)}
            required
            className="w-full file:text-xs file:py-1 file:font-normal text-xs"
            style={{ fontSize: "0.75rem" }}
          />
          {berkasProposal && (
            <div className="text-xs mt-1">{berkasProposal.name}</div>
          )}
        </div>
      </div>
      {errorMsg && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded mb-2 text-sm">
          {errorMsg}
        </div>
      )}
      <div className="flex gap-2 pt-2 justify-end">
        <Button type="submit" variant="default" className="px-6">
          Ajukan
        </Button>
      </div>
    </form>
  );
}
