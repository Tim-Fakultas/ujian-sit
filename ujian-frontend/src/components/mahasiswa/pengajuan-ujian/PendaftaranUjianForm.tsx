"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPendaftaranUjian } from "@/actions/pendaftaranUjian";
import { getAllSyarat } from "@/actions/syarat";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { User } from "@/types/Auth";
import { Ujian } from "@/types/Ujian";
import { Syarat } from "@/types/Syarat";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select";
import revalidateAction from "@/actions/revalidate";
import {
  CheckCircle2,
  Send,
  UploadCloud,
  FileCheck,
  AlertCircle,
  X,
  FileText,
  GraduationCap,
  Info,
  Loader2,
} from "lucide-react";
import { showToast } from "@/components/ui/custom-toast";

interface Props {
  user: User | null;
  jenisUjianList: Array<{ id: number; namaJenis: string }>;
  pengajuanRanpel: PengajuanRanpel[];
  ujian: Ujian[];
  onCloseModal?: () => void;
}

export default function PendaftaranUjianForm({
  user,
  jenisUjianList,
  pengajuanRanpel,
  ujian,
  onCloseModal,
}: Props) {
  const [selectedJenisUjian, setSelectedJenisUjian] = useState<number | null>(null);
  const [selectedRanpelId, setSelectedRanpelId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSyarat, setIsLoadingSyarat] = useState(false);

  // Dynamic Requirements State
  const [allSyarat, setAllSyarat] = useState<Syarat[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({});

  useEffect(() => {
    const loadSyarat = async () => {
      setIsLoadingSyarat(true);
      try {
        const data = await getAllSyarat();
        setAllSyarat(data);
      } catch (err) {
        console.error("Failed to load syarat", err);
        showToast.error("Gagal memuat daftar persyaratan.");
      } finally {
        setIsLoadingSyarat(false);
      }
    };
    loadSyarat();
  }, []);


  // User stats
  const ipk = user?.ipk ?? 0;
  const semester = user?.semester ?? 0;

  // Logic Checks
  const ujianProposal = ujian.find(u => u.jenisUjian?.namaJenis?.toLowerCase().includes("proposal") && u.mahasiswa?.id === user?.id);
  const ujianHasil = ujian.find(u => u.jenisUjian?.namaJenis?.toLowerCase().includes("hasil") && u.mahasiswa?.id === user?.id);

  const lulusProposal = ujianProposal?.hasil === "lulus";
  const lulusHasil = ujianHasil?.hasil === "lulus";
  // const pernahDaftarProposal = !!ujianProposal; // unused
  // const pernahDaftarHasil = !!ujianHasil; // unused

  const canDaftarProposal = () => ipk >= 2 && semester >= 6; // Adjusted logic from original

  const handleJenisUjianSelect = (id: number) => {
    setSelectedJenisUjian(id);
    setUploadedFiles({}); // Reset files when changing exam type
    if (pengajuanRanpel.length === 1) {
      setSelectedRanpelId(pengajuanRanpel[0].ranpel.id ?? null);
    } else {
      setSelectedRanpelId(null);
    }
  };

  const selectedJenis = jenisUjianList.find(j => j.id === selectedJenisUjian);

  // Filter requirements based on selected exam type
  const activeSyarat = selectedJenisUjian
    ? allSyarat.filter(s => s.jenisUjianId === selectedJenisUjian)
    : [];

  const handleFileChange = (syaratNama: string, file: File | null) => {
    setUploadedFiles(prev => ({
      ...prev,
      [syaratNama]: file
    }));
  };

  const isSyaratWajibTerisi = () => {
    return activeSyarat.filter(s => s.wajib).every(s => !!uploadedFiles[s.namaSyarat]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedJenisUjian || !selectedRanpelId || !user?.id) {
      setErrorMsg("Mohon lengkapi data jenis ujian dan judul penelitian.");
      return;
    }

    if (!isSyaratWajibTerisi()) {
      setErrorMsg("Mohon lengkapi semua berkas persyaratan yang wajib.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Collect files in order matching the simplified logic or adjust backend to accept map?
      // user request implies backend handles mapped files or just 'berkas' array.
      // previous implementation sent an array of files. We should probably stick to that 
      // but we need to know WHICH file is WHICH? 
      // The previous 'createPendaftaranUjian' action likely just accepts an array of files 
      // and assumes order or backend handles it? 
      // Let's look at the backend... standard file upload usually needs keys if order matters.
      // But purely based on frontend `createPendaftaranUjian` signature seen in previous file:
      // it takes `berkas: File[]`.
      // The original code filtered nulls from a mapped array.
      // So we will just send the files that are present. 
      // Ideally backend needs to know which file corresponds to which requirement.
      // BUT for now, to maintain compatibility with existing 'createPendaftaranUjian' signature which takes File[],
      // we will send them. (Ideally we should refactor backend to accept named keys or handle mapping).

      const filesToSend = activeSyarat
        .map(s => {
          const f = uploadedFiles[s.namaSyarat];
          return f ? { file: f, nama: s.namaSyarat } : null;
        })
        .filter((item): item is { file: File; nama: string } => item !== null);

      await createPendaftaranUjian({
        mahasiswaId: user.id,
        ranpelId: selectedRanpelId,
        jenisUjianId: selectedJenisUjian,
        berkas: filesToSend,
      });

      showToast.success("Pendaftaran ujian berhasil diajukan!");

      // Reset logic
      setSelectedJenisUjian(null);
      setUploadedFiles({});
      onCloseModal?.();
      await revalidateAction("/mahasiswa/pendaftaran-ujian");
    } catch (err: unknown) {
      let msg = "Terjadi kesalahan saat menyimpan pendaftaran.";
      if (typeof err === "object" && err !== null && "message" in err) {
        msg = (err as any).message;
        if (msg.includes("Body exceeded 1 MB limit")) {
          msg = "File terlalu besar (Maks 5MB total). Mohon kompres PDF Anda.";
        }
      }
      setErrorMsg(msg);
      showToast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="w-full h-[90vh] flex flex-col bg-gray-50/50 dark:bg-[#0a0a0a]" onSubmit={handleSubmit}>
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b dark:border-neutral-800 px-6 py-4 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              Pendaftaran Ujian
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Ajukan seminar proposal atau hasil skripsi Anda.
            </div>
          </div>
        </div>

        {onCloseModal && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCloseModal}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full"
          >
            <X className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-xl">
              <Info size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status Akademik</div>
              <div className="flex gap-4 mt-1">
                <div><span className="text-sm text-gray-500">IPK:</span> <span className={`font-bold ${ipk >= 2 ? 'text-blue-600' : 'text-red-500'}`}>{ipk}</span></div>
                <div><span className="text-sm text-gray-500">Semester:</span> <span className={`font-bold ${semester >= 6 ? 'text-blue-600' : 'text-red-500'}`}>{semester}</span></div>
              </div>
            </div>
          </div>

          <div className={`border p-5 rounded-2xl shadow-sm flex items-center gap-4 ${canDaftarProposal() ? 'bg-blue-50/50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30' : 'bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30'}`}>
            <div className={`p-3 rounded-xl ${canDaftarProposal() ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'}`}>
              {canDaftarProposal() ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Kelayakan</div>
              <div className={`font-bold ${canDaftarProposal() ? 'text-blue-700 dark:text-blue-400' : 'text-red-700 dark:text-red-400'}`}>
                {canDaftarProposal() ? "Memenuhi Syarat" : "Belum Memenuhi Syarat"}
              </div>
            </div>
          </div>
        </div>

        {/* Form Controls */}
        <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col gap-6">
            <div className="space-y-3 w-full">
              <Label className="font-semibold">Jenis Ujian</Label>
              <Select value={selectedJenisUjian ? String(selectedJenisUjian) : ""} onValueChange={(v) => handleJenisUjianSelect(Number(v))}>
                <SelectTrigger className="h-12 rounded-xl w-full">
                  <SelectValue placeholder="Pilih Jenis Ujian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {jenisUjianList.map(j => {
                      const nama = j.namaJenis.toLowerCase();
                      const isProp = nama.includes("proposal");
                      const isHas = nama.includes("hasil");
                      const isSkrip = nama.includes("skripsi");
                      let disabled = false;
                      let reason = "";

                      if (isProp && !canDaftarProposal()) { disabled = true; reason = "(Syarat IPK/Sem tidak cukup)"; }
                      if (isHas) {
                        if (!canDaftarProposal()) { disabled = true; reason = "(Syarat dasar tidak cukup)"; }
                        else if (!lulusProposal) { disabled = true; reason = "(Belum lulus proposal)"; }
                      }
                      if (isSkrip) {
                        if (!canDaftarProposal()) { disabled = true; reason = "(Syarat dasar tidak cukup)"; }
                        else if (!lulusProposal) { disabled = true; reason = "(Belum lulus proposal)"; }
                        else if (!lulusHasil) { disabled = true; reason = "(Belum lulus ujian hasil)"; }
                      }

                      // Render Label with Terminology Check
                      const label = j.namaJenis === "Ujian Proposal" ? "Seminar Proposal" : j.namaJenis;

                      return (
                        <SelectItem key={j.id} value={String(j.id)} disabled={disabled}>
                          {label} {reason && <span className="text-xs text-muted-foreground ml-1">{reason}</span>}
                        </SelectItem>
                      )
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 w-full">
              <Label className="font-semibold">Judul Penelitian</Label>
              {pengajuanRanpel && pengajuanRanpel.length > 1 ? (
                <Select value={selectedRanpelId ? String(selectedRanpelId) : ""} onValueChange={(v) => setSelectedRanpelId(Number(v))}>
                  <SelectTrigger className="h-12 rounded-xl w-full">
                    <SelectValue placeholder="Pilih Judul" />
                  </SelectTrigger>
                  <SelectContent>
                    {pengajuanRanpel.map(r => (
                      <SelectItem key={r.ranpel.id} value={String(r.ranpel.id)}>{r.ranpel.judulPenelitian}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={pengajuanRanpel?.[0]?.ranpel?.judulPenelitian ?? ""}
                  readOnly
                  className="h-12 rounded-xl bg-gray-50 dark:bg-neutral-800 text-muted-foreground w-full"
                  placeholder="Tidak ada judul aktif"
                />
              )}
            </div>
          </div>
        </div>

        {/* File Upload Sections */}
        {selectedJenisUjian && (
          <div className="space-y-4 animate-in slide-in-from-bottom-5 duration-500">
            <div className="flex items-center gap-2 px-1">
              <FileText className="text-gray-400" size={18} />
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                Berkas Persyaratan {selectedJenis?.namaJenis === "Ujian Proposal" ? "Seminar Proposal" : selectedJenis?.namaJenis}
              </h3>
            </div>

            {isLoadingSyarat ? (
              <div className="text-center py-8 text-muted-foreground">Memuat persyaratan...</div>
            ) : activeSyarat.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Tidak ada persyaratan khusus untuk ujian ini.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeSyarat.map((item, idx) => {
                  const currentFile = uploadedFiles[item.namaSyarat];
                  return (
                    <div key={item.id} className={`relative group border rounded-xl p-4 transition-all duration-200 ${currentFile
                      ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-900/30'
                      : 'bg-white hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-800 dark:hover:bg-neutral-800'
                      }`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-semibold text-sm flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[10px] flex items-center justify-center border dark:bg-neutral-800 dark:border-neutral-700">
                              {idx + 1}
                            </span>
                            <span className="line-clamp-2" title={item.namaSyarat}>{item.namaSyarat}</span>
                            {item.wajib && <span className="text-red-500 shrink-0">*</span>}
                          </div>
                          {item.deskripsi && <p className="text-xs text-muted-foreground mt-1 ml-7">{item.deskripsi}</p>}
                        </div>
                        {currentFile && (
                          <button
                            type="button"
                            onClick={() => handleFileChange(item.namaSyarat, null)}
                            className="text-gray-400 hover:text-red-500 transition-colors bg-white dark:bg-black rounded-full p-1 shadow-sm border"
                            title="Hapus file"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>

                      <div className="ml-7">
                        <input
                          type="file"
                          id={`file-${item.id}`}
                          className="hidden"
                          accept="application/pdf"
                          onChange={(e) => handleFileChange(item.namaSyarat, e.target.files?.[0] ?? null)}
                        />

                        {!currentFile ? (
                          <label
                            htmlFor={`file-${item.id}`}
                            className="flex items-center gap-3 w-full p-2 rounded-lg border border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer transition-all group-hover:shadow-sm"
                          >
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors">
                              <UploadCloud size={16} />
                            </div>
                            <div className="text-xs text-muted-foreground group-hover:text-blue-600 transition-colors">
                              Klik untuk upload (PDF)
                            </div>
                          </label>
                        ) : (
                          <div className="flex items-center gap-3 w-full p-2 rounded-lg bg-white border border-blue-100 shadow-sm dark:bg-neutral-950 dark:border-blue-900/30">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                              <FileCheck size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium truncate text-blue-700 dark:text-blue-300">{currentFile.name}</div>
                              <div className="text-[10px] text-gray-400">{(currentFile.size / 1024 / 1024).toFixed(2)} MB</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur border-t dark:border-neutral-800 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-full flex justify-end gap-3">
          {onCloseModal && (
            <Button type="button" variant="ghost" onClick={onCloseModal} className="h-11 rounded-xl px-6">Batal</Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || !selectedJenisUjian}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-11 rounded-xl px-8 shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Mengirim...
              </>
            ) : (
              <>
                <Send className="mr-2" size={18} />
                Ajukan Pendaftaran
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
