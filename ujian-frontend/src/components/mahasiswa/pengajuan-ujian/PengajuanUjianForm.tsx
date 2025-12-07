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
import revalidateAction from "@/actions/revalidate";
import { CheckCircle2, Send } from "lucide-react";

export default function PengajuanUjianForm({
  user,
  jenisUjianList,
  pengajuanRanpel,
  ujian,
  onCloseModal, // Tambahkan prop opsional
}: {
  user: User | null;
  jenisUjianList: Array<{ id: number; namaJenis: string }>;
  pengajuanRanpel: PengajuanRanpel[];
  ujian: Ujian[];
  onCloseModal?: () => void; // Tambahkan tipe prop
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
          <CheckCircle2 className="text-emerald-500" size={20} />
          <div>
            <div className="font-semibold">Berhasil!</div>
            <div className="text-sm">Pendaftaran ujian berhasil diajukan.</div>
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

      // Tutup modal jika fungsi tersedia
      if (onCloseModal) {
        onCloseModal();
      }
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
      className="w-full mx-auto h-[80vh] rounded-lg overflow-auto  flex flex-col"
      onSubmit={handleSubmit}
    >
      {/* scrollable content */}
      <div className="flex-1 py-4 space-y-6">
        {/* Info syarat proposal - compact for mobile */}
        <div className="bg-gray-50 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-md p-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-sm md:text-base font-semibold">
                Syarat Pengajuan Ujian Proposal
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Pastikan IPK & semester memenuhi syarat sebelum mengajukan.
              </p>

              <div className="mt-3 flex flex-wrap gap-2 items-center">
                <div
                  className={`inline-flex items-center gap-2 px-2 py-0.5 rounded-md text-sm font-medium ${
                    ipk >= 2
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200"
                      : "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  <span className="opacity-90 text-xs">IPK</span>
                  <span className="ml-1 font-semibold text-sm">{ipk}</span>
                </div>

                <div
                  className={`inline-flex items-center gap-2 px-2 py-0.5 rounded-md text-sm font-medium ${
                    semester >= 6
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200"
                      : "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  <span className="opacity-90 text-xs">Semester</span>
                  <span className="ml-1 font-semibold text-sm">{semester}</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 self-start">
              {canDaftarProposal() ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-600 text-white text-xs sm:text-sm font-medium">
                  ✓ Memenuhi syarat
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-600 text-white text-xs sm:text-sm font-medium">
                  ✕ Belum memenuhi
                </div>
              )}
            </div>
          </div>

          {!canDaftarProposal() && (
            <div className="mt-3 px-2 py-2 bg-red-50 border border-red-200 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-300 rounded text-xs">
              Anda belum memenuhi syarat: IPK &ge; 2.00 dan Semester &ge; 6.
            </div>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <Label className="mb-2 block font-medium">Jenis Ujian</Label>
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
              <div className="mt-1 text-sm text-red-500">
                Anda belum bisa mengajukan ujian proposal.
              </div>
            );
          }
          if (nama.includes("hasil")) {
            if (!canDaftarProposal()) {
              return (
                <div className="mt-1 text-sm text-red-500">
                  Anda belum memenuhi syarat pengajuan proposal.
                </div>
              );
            }
            if (!lulusProposal) {
              return (
                <div className="mt-1 text-sm text-red-500">
                  Anda belum lulus ujian proposal.
                </div>
              );
            }
          }
          if (nama.includes("skripsi")) {
            if (!canDaftarProposal()) {
              return (
                <div className="mt-1 text-sm text-red-500">
                  Anda belum memenuhi syarat pengajuan proposal.
                </div>
              );
            }
            if (!lulusProposal) {
              return (
                <div className="mt-1 text-sm text-red-500">
                  Anda belum lulus ujian proposal.
                </div>
              );
            }
            if (!lulusHasil) {
              return (
                <div className="mt-1 text-sm text-red-500">
                  Anda belum lulus ujian hasil.
                </div>
              );
            }
          }
          return null;
        })()}
      </div>
      <div>
        <Label className="mb-2 block font-medium">Judul Penelitian</Label>
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

      {/* File uploads - responsive: vertical on mobile, two columns on md */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-4">
        {[
          {
            label: "Transkrip Nilai",
            file: berkasTranskrip,
            onChange: (f: File | null) => setBerkasTranskrip(f),
          },
          {
            label: "Pengesahan Proposal",
            file: berkasPengesahan,
            onChange: (f: File | null) => setBerkasPengesahan(f),
          },
          {
            label: "Surat Keterangan Lulus Plagiasi",
            file: berkasPlagiasi,
            onChange: (f: File | null) => setBerkasPlagiasi(f),
          },
          {
            label: "Proposal Skripsi",
            file: berkasProposal,
            onChange: (f: File | null) => setBerkasProposal(f),
          },
        ].map((it, idx) => (
          <div key={idx}>
            <Label className="mb-1 block font-medium text-sm">{it.label}</Label>
            <label className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border border-dashed rounded-md px-3 py-2 cursor-pointer hover:bg-muted/50 w-full">
              <input
                type="file"
                className="hidden"
                onChange={(e) => it.onChange(e.target.files?.[0] ?? null)}
                accept="application/pdf"
                required
              />
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="text-sm font-medium">Upload PDF</div>
              </div>
              <div className="text-sm text-muted-foreground w-full sm:w-1/2 truncate text-right sm:text-left">
                {it.file ? it.file.name : "Belum ada file"}
              </div>
            </label>
          </div>
        ))}
      </div>

      <div className="text-xs text-muted-foreground mt-1">
        Tips: Unggah file dalam format PDF. Maks. 1 MB per file. Periksa kembali
        nama file agar mudah dikenali.
      </div>

      {errorMsg && (
        <div className="bg-red-100 border border-red-300 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-300 px-3 py-2 rounded mb-2 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Submit footer (non-sticky) */}
      <div className="pt-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 justify-end">
            <Button
              type="submit"
              variant="default"
              className="md:w-auto px-6 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
            >
              <Send className="mr-2" size={16} />
              Ajukan
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
