"use client";
import { useState } from "react";
import { getStorageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPendaftaranUjian } from "@/actions/pendaftaranUjian";
import { getSyaratByJenisUjian } from "@/actions/syarat";
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

  const handleJenisUjianSelect = async (id: number) => {
    setSelectedJenisUjian(id);
    setUploadedFiles({}); // Reset files when changing exam type
    if (pengajuanRanpel.length === 1) {
      setSelectedRanpelId(pengajuanRanpel[0].ranpel.id ?? null);
    } else {
      setSelectedRanpelId(null);
    }

    // Fetch requirements for the selected exam type
    setIsLoadingSyarat(true);
    try {
      const data = await getSyaratByJenisUjian(id);
      setAllSyarat(data);
    } catch (err) {
      console.error("[PendaftaranUjianForm] Failed to load syarat", err);
      showToast.error("Gagal memuat daftar persyaratan.");
    } finally {
      setIsLoadingSyarat(false);
    }
  };

  // Helper function to check if a requirement is already fulfilled by existing documents
  const getExistingDocument = (syaratNama: string): string | null => {
    const lowerName = syaratNama.toLowerCase();

    // Map requirement names to user document fields
    if (lowerName.includes('ktm') && user?.url_ktm) {
      return user.url_ktm;
    }
    if ((lowerName.includes('transkrip') || lowerName.includes('nilai sementara') || lowerName.includes('sks') || lowerName.includes('ipk')) && user?.url_transkrip_nilai) {
      return user.url_transkrip_nilai;
    }
    if ((lowerName.includes('metodologi penelitian') || lowerName.includes('metopen')) && user?.url_bukti_lulus_metopen) {
      return user.url_bukti_lulus_metopen;
    }

    return null;
  };

  const getEligibilityMessage = () => {
    if (!selectedJenisUjian) {
      if (!canDaftarProposal()) return "IPK >= 2.00 dan Semester >= 6";
      return "Anda bisa mendaftar Seminar Proposal";
    }

    const selectedJenis = jenisUjianList.find(j => j.id === selectedJenisUjian);
    if (!selectedJenis) return "";
    const nama = selectedJenis.namaJenis.toLowerCase();
    const isProp = nama.includes("proposal");
    const isHas = nama.includes("hasil");
    const isSkrip = nama.includes("skripsi");

    if (isProp) {
      if (!canDaftarProposal()) return "IPK minimal 2.00 dan Semester minimal 6.";
      return "Anda bisa mendaftar Seminar Proposal";
    }

    if (isHas) {
      if (!canDaftarProposal()) return "IPK min 2.00 & Semester min 6.";
      if (!lulusProposal) return "Anda harus lulus Seminar Proposal terlebih dahulu.";
    }
    if (isSkrip) {
      if (!canDaftarProposal()) return "IPK min 2.00 & Semester min 6.";
      if (!lulusProposal) return "Anda harus lulus Seminar Proposal terlebih dahulu.";
      if (!lulusHasil) return "Anda harus lulus Ujian Hasil terlebih dahulu.";
    }

    return "Anda memenuhi syarat";
  };

  const canRegisterSelectedExam = () => {
    const msg = getEligibilityMessage();
    return msg === "Anda memenuhi syarat" || msg === "Anda bisa mendaftar Seminar Proposal";
  };

  const selectedJenis = jenisUjianList.find(j => j.id === selectedJenisUjian);

  // Filter requirements based on selected exam type (SAFEGUARD)
  const activeSyarat = allSyarat.filter(s => Number(s.jenisUjianId) === Number(selectedJenisUjian));

  const handleFileChange = (syaratNama: string, file: File | null) => {
    setUploadedFiles(prev => ({
      ...prev,
      [syaratNama]: file
    }));
  };

  const isSyaratWajibTerisi = () => {
    return activeSyarat.filter(s => s.wajib).every(s => {
      // Check if there's an uploaded file OR an existing document in profile
      return !!uploadedFiles[s.namaSyarat] || !!getExistingDocument(s.namaSyarat);
    });
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
          const existingDoc = getExistingDocument(s.namaSyarat);

          // If there's a new file, use it
          if (f) {
            return { file: f, nama: s.namaSyarat };
          }
          // If there's an existing document, include its URL
          if (existingDoc) {
            return { url: existingDoc, nama: s.namaSyarat };
          }
          return null;
        })
        .filter((item): item is ({ file: File; nama: string } | { url: string; nama: string }) => item !== null);

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
          <div className="p-2.5 bg-gradient-to-br from-primary to-primary/80 rounded-2xl text-white shadow-lg shadow-primary/20">
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
            <div className="p-3 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary rounded-2xl">
              <Info size={20} />
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status Akademik</div>
              <div className="flex gap-4 mt-1">
                <div><span className="text-sm text-gray-500">IPK:</span> <span className={`font-bold ${ipk >= 2 ? 'text-primary' : 'text-red-500'}`}>{ipk}</span></div>
                <div><span className="text-sm text-gray-500">Semester:</span> <span className={`font-bold ${semester >= 6 ? 'text-primary' : 'text-red-500'}`}>{semester}</span></div>
              </div>
            </div>
          </div>

          <div className={`border p-5 rounded-2xl shadow-sm flex items-center gap-4 ${(!selectedJenisUjian ? canDaftarProposal() : canRegisterSelectedExam()) ? 'bg-primary/5 border-primary/10 dark:bg-primary/10 dark:border-primary/20' : 'bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30'}`}>
            <div className={`p-3 rounded-2xl ${(!selectedJenisUjian ? canDaftarProposal() : canRegisterSelectedExam()) ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'bg-red-100 text-red-600 dark:bg-red-900/30'}`}>
              {(!selectedJenisUjian ? canDaftarProposal() : canRegisterSelectedExam()) ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Kelayakan</div>
              <div className={`font-bold truncate ${(!selectedJenisUjian ? canDaftarProposal() : canRegisterSelectedExam()) ? 'text-primary dark:text-primary' : 'text-red-700 dark:text-red-400'}`}>
                {getEligibilityMessage()}
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
                <SelectTrigger className="h-12 rounded-2xl w-full">
                  <SelectValue placeholder="Pilih Jenis Ujian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {jenisUjianList.map(j => {
                      // Render Label with Terminology Check
                      const label = j.namaJenis === "Ujian Proposal" ? "Seminar Proposal" : j.namaJenis;

                      return (
                        <SelectItem key={j.id} value={String(j.id)}>
                          {label}
                        </SelectItem>
                      )
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {selectedJenisUjian && !canRegisterSelectedExam() && (
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2">
                  <div className="p-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg shrink-0 mt-0.5">
                    <AlertCircle size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                      Pendaftaran Belum Diizinkan
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                      {getEligibilityMessage()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 w-full">
              <div className="flex justify-between items-center">
                <Label className="font-semibold">Judul Penelitian</Label>
                {(!pengajuanRanpel || pengajuanRanpel.length === 0) && (
                  <span className="text-red-500 text-xs font-medium animate-pulse flex items-center gap-1">
                    <AlertCircle size={12} />
                    Belum ada judul
                  </span>
                )}
              </div>

              {pengajuanRanpel && pengajuanRanpel.length > 1 ? (
                <Select value={selectedRanpelId ? String(selectedRanpelId) : ""} onValueChange={(v) => setSelectedRanpelId(Number(v))}>
                  <SelectTrigger className="h-12 rounded-2xl w-full">
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
                  className={`h-12 rounded-2xl w-full transition-colors ${(!pengajuanRanpel || pengajuanRanpel.length === 0)
                    ? "bg-red-50 border-red-200 text-red-600 placeholder:text-red-400 dark:bg-red-900/10 dark:border-red-900/30 dark:text-red-400"
                    : "bg-gray-50 dark:bg-neutral-800 text-muted-foreground"
                    }`}
                  placeholder={(!pengajuanRanpel || pengajuanRanpel.length === 0) ? "Anda belum memiliki rancangan penelitian" : "Judul penelitian aktif"}
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
                  const existingDoc = getExistingDocument(item.namaSyarat);
                  const hasDocument = currentFile || existingDoc;

                  return (
                    <div key={item.id} className={`relative group border rounded-2xl p-4 transition-all duration-200 ${hasDocument
                      ? 'bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/20'
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

                        {existingDoc && !currentFile ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 w-full p-2 rounded-lg bg-green-50 border border-green-200 dark:bg-green-900/10 dark:border-green-900/30">
                              <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center dark:bg-green-900/30 dark:text-green-400">
                                <CheckCircle2 size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-green-700 dark:text-green-400">Sudah tersedia di profil</div>
                                <a
                                  href={getStorageUrl(existingDoc)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-green-600 dark:text-green-500 hover:underline flex items-center gap-1"
                                >
                                  <FileText size={10} />
                                  Lihat dokumen
                                </a>
                              </div>
                            </div>
                            <label
                              htmlFor={`file-${item.id}`}
                              className="flex items-center justify-center gap-2 w-full p-2 rounded-lg border border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 cursor-pointer transition-all text-xs text-gray-500 hover:text-primary"
                            >
                              <UploadCloud size={14} />
                              Upload ulang (opsional)
                            </label>
                          </div>
                        ) : !currentFile ? (
                          <label
                            htmlFor={`file-${item.id}`}
                            className="flex items-center gap-3 w-full p-2 rounded-lg border border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 cursor-pointer transition-all group-hover:shadow-sm"
                          >
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                              <UploadCloud size={16} />
                            </div>
                            <div className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                              Klik untuk upload (PDF)
                            </div>
                          </label>
                        ) : (
                          <div className="flex items-center gap-3 w-full p-2 rounded-lg bg-white border border-primary/20 shadow-sm dark:bg-neutral-950 dark:border-primary/20">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                              <FileCheck size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium truncate text-primary dark:text-primary">{currentFile.name}</div>
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
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur border-t dark:border-neutral-800 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-full flex justify-end gap-3">
          {onCloseModal && (
            <Button type="button" variant="ghost" onClick={onCloseModal} className="h-11 rounded-2xl px-6">Batal</Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || !selectedJenisUjian || !canRegisterSelectedExam() || !isSyaratWajibTerisi() || !selectedRanpelId}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white h-11 rounded-2xl px-8 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
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
