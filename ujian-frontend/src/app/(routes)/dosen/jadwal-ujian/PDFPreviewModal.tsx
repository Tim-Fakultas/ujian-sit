"use client";
import { PDFDocument } from "@/components/PDFDocument";
import { Button } from "@/components/ui/button";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { updateStatusPengajuanRanpel } from "@/actions/pengajuanRanpel";
import { getDosen } from "@/actions/data-master/dosen";
import { updatePembimbingMahasiswa } from "@/actions/data-master/mahasiswa";
import { X, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRef } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import revalidateAction from "@/actions/revalidate";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/components/ui/custom-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pengajuan: PengajuanRanpel;
  onUpdated?: () => void;
}

export default function PDFPreviewModal({
  isOpen,
  onClose,
  pengajuan,
  onUpdated,
}: PDFPreviewModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPembimbingModal, setShowPembimbingModal] = useState(false);
  const [dosenList, setDosenList] = useState<{ id: number; nama: string }[]>(
    []
  );
  const [selectedPembimbing1, setSelectedPembimbing1] = useState<number | null>(
    null
  );
  const [selectedPembimbing2, setSelectedPembimbing2] = useState<number | null>(
    null
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [keterangan, setKeterangan] = useState<string>("");
  const firstSelectRef = useRef<HTMLButtonElement | null>(null);

  const { user } = useAuthStore.getState();

  // Check if user has permission to approve/reject
  const canApproveReject =
    user?.roles &&
    (user.roles[0].name === "dosen" || user.roles[0].name === "kaprodi");

  useEffect(() => {
    if (showPembimbingModal && user?.prodi?.id) {
      getDosen(user.prodi.id).then((res) => {
        setDosenList(res);
      });
    }
  }, [showPembimbingModal, user]);

  // Prefill pembimbing jika sudah ada ketika modal dibuka
  useEffect(() => {
    if (showPembimbingModal) {
      const p1 = pengajuan.mahasiswa.pembimbing1?.id ?? null;
      const p2 = pengajuan.mahasiswa.pembimbing2?.id ?? null;
      setSelectedPembimbing1(p1);
      setSelectedPembimbing2(p2);
      setValidationError(null);

      // Prefill keterangan jika sudah ada
      setKeterangan(pengajuan.keterangan ?? "");

      // fokus ke select pertama untuk akses keyboard
      setTimeout(() => {
        firstSelectRef.current?.focus?.();
      }, 80);
    }
  }, [showPembimbingModal, pengajuan]);

  if (!isOpen) return null;

  // Add state for sidebar toggle
  const [showDetails, setShowDetails] = useState(true);

  if (!isOpen) return null;

  const handleAccept = async () => {
    setIsUpdating(true);
    try {
      const ranpelId = pengajuan.id;
      const status =
        user?.roles?.[0]?.name === "dosen" ? "diverifikasi" : "diterima";

      if (user?.roles?.[0]?.name === "kaprodi") {
        setShowPembimbingModal(true);
        setIsUpdating(false);
        return;
      }

      await updateStatusPengajuanRanpel(pengajuan.mahasiswa.id, ranpelId, {
        status,
      });

      if (status === "diverifikasi") {
        showToast.success(
          "Berhasil Diverifikasi",
          `Pengajuan ${pengajuan.mahasiswa.nama} berhasil diverifikasi.`
        );
      }

      const role = user?.roles?.[0]?.name;
      if (role === "dosen" || role === "kaprodi") {
        await revalidateAction(`/${role}/pengajuan-ranpel`);
      }

      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    setIsUpdating(true);
    try {
      const ranpelId = pengajuan.id;
      await updateStatusPengajuanRanpel(pengajuan.mahasiswa.id, ranpelId, {
        status: "ditolak",
      });

      const role = user?.roles?.[0]?.name;
      if (role === "dosen" || role === "kaprodi") {
        await revalidateAction(`/${role}/pengajuan-ranpel`);
      }

      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePembimbingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      if (
        selectedPembimbing1 == null ||
        selectedPembimbing2 == null ||
        selectedPembimbing1 === selectedPembimbing2
      ) {
        setValidationError(
          selectedPembimbing1 === selectedPembimbing2
            ? "Pembimbing 1 dan 2 tidak boleh sama."
            : "Harap pilih kedua pembimbing."
        );
        setIsUpdating(false);
        return;
      }
      await updatePembimbingMahasiswa({
        mahasiswaId: pengajuan.mahasiswa.id,
        pembimbing1: selectedPembimbing1!,
        pembimbing2: selectedPembimbing2!,
      });
      await updateStatusPengajuanRanpel(pengajuan.mahasiswa.id, pengajuan.id, {
        status: "diterima",
        keterangan: keterangan,
      });
      await revalidateAction("/kaprodi/pengajuan-ranpel");
      setShowPembimbingModal(false);

      showToast.success(
        "Berhasil!",
        "Pembimbing berhasil disimpan dan pengajuan diterima."
      );

      if (onUpdated) onUpdated();
      onClose();
    } catch (error) {
      showToast.error("Gagal update pembimbing atau status!", String(error));
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Blurred background */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-[#1f1f1f] rounded-xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden border dark:border-neutral-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-neutral-800 bg-white dark:bg-[#1f1f1f] z-10">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                {/* Document Icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current stroke-2">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
             </div>
             <div>
               <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                Preview Rancangan Penelitian
               </h2>
               <p className="text-xs text-gray-500 dark:text-gray-400">
                 {pengajuan.mahasiswa.nama} • {pengajuan.mahasiswa.nim}
               </p>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <button
               onClick={() => setShowDetails(!showDetails)}
               className={`p-2 rounded-full transition-colors hidden md:block ${showDetails ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500'}`}
               title={showDetails ? "Sembunyikan Panel Kanan" : "Tampilkan Panel Kanan"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current stroke-2">
                 <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                 <line x1="15" y1="3" x2="15" y2="21" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-gray-500"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Main: Content Preview */}
          <div className="flex-1 bg-gray-50 dark:bg-black/20 overflow-auto p-4 md:p-6 flex justify-center relative order-1 md:order-1">
             <div className="w-full h-full max-w-5xl mx-auto">
                <PDFDocument pengajuan={pengajuan} />
             </div>
          </div>

          {/* Right Sidebar: Details & Actions */}
          <div className={`
             fixed bottom-0 left-0 right-0 z-30 flex flex-col bg-white dark:bg-[#1f1f1f]
             md:static md:w-96 md:flex-shrink-0 md:border-l md:dark:border-neutral-800 md:z-20 md:shadow-[-5px_0_15px_-3px_rgba(0,0,0,0.05)]
             transition-all duration-300 ease-in-out
             ${showDetails ? 'md:flex' : 'md:hidden'}
             ${showDetails ? 'h-[60vh] md:h-auto' : 'h-16 md:h-auto'}
             rounded-t-2xl md:rounded-none shadow-[0_-5px_15px_-3px_rgba(0,0,0,0.1)] md:shadow-none overflow-hidden
          `}>
             
             {/* Mobile Mobile Toggle Header */}
             <div 
               className="flex md:hidden items-center justify-between px-6 h-16 border-b dark:border-neutral-800 cursor-pointer bg-white dark:bg-[#1f1f1f] hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors z-40 relative"
               onClick={() => setShowDetails(!showDetails)}
             >
                {/* Pull Handle */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>

                <div className="flex items-center gap-2 mt-2">
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse box-content border-2 border-blue-100 dark:border-blue-900/30"></div>
                   <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">Status Dokumen</h3>
                </div>
                <button className="p-2 mt-2 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-500 transition-transform">
                   <svg 
                     width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     className={`transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`}
                   >
                      <polyline points="18 15 12 9 6 15"></polyline>
                   </svg>
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
                
                {/* Section: Status Details */}
                <div className="space-y-4">
                   <h3 className="hidden md:flex text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      Status Dokumen
                   </h3>
                   
                   <div className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-4 space-y-3 border border-gray-100 dark:border-neutral-800">
                      <div>
                         <span className="text-xs text-gray-500 block mb-1">Status Pengajuan</span>
                         <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide
                            ${pengajuan.status === 'diterima' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                              pengajuan.status === 'ditolak' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                              'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}
                         `}>
                            {pengajuan.status}
                         </span>
                      </div>
                      <div>
                         <span className="text-xs text-gray-500 block mb-1">Tanggal Pengajuan</span>
                         <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                            {new Date(pengajuan.tanggalPengajuan).toLocaleDateString('id-ID', {
                               weekday: 'long', 
                               day: 'numeric', 
                               month: 'long', 
                               year: 'numeric'
                            })}
                         </span>
                      </div>
                   </div>

                   {/* Keterangan */}
                   <div>
                      <span className="text-xs font-semibold text-gray-500 mb-2 block">Keterangan / Catatan</span>
                      <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20 text-sm text-gray-700 dark:text-blue-100 leading-relaxed min-h-[60px]">
                          {pengajuan.keterangan || <span className="text-gray-400 italic">Tidak ada catatan khusus.</span>}
                      </div>
                   </div>
                </div>

                <div className="w-full border-b dark:border-neutral-800 my-4"></div>

                {/* Section: Pembimbing */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Dosen Pembimbing
                   </h3>
                   
                   <div className="space-y-3">
                      <div className="flex gap-3 items-start">
                         <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                         <div>
                            <p className="text-xs text-gray-500 mb-0.5">Pembimbing Utama</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                               {pengajuan.mahasiswa?.pembimbing1?.nama || <span className="text-gray-400 font-normal italic">Belum ditentukan</span>}
                            </p>
                         </div>
                      </div>
                      <div className="flex gap-3 items-start">
                         <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                         <div>
                            <p className="text-xs text-gray-500 mb-0.5">Pembimbing Pendamping</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                               {pengajuan.mahasiswa?.pembimbing2?.nama || <span className="text-gray-400 font-normal italic">Belum ditentukan</span>}
                            </p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Actions Section */}
                {canApproveReject && (
                  <div className="mt-8 pt-4">
                     <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                        Tindakan
                     </h3>
                     <div className="flex flex-col gap-3">
                        <Button
                           className="bg-emerald-600 hover:bg-emerald-700 text-white w-full h-10 rounded-xl shadow-lg shadow-emerald-500/20"
                           onClick={handleAccept}
                           disabled={isUpdating}
                        >
                           {isUpdating
                           ? "Memproses..."
                           : user?.roles?.[0]?.name === "dosen"
                           ? "Verifikasi Pengajuan"
                           : pengajuan.mahasiswa.pembimbing1?.id ||
                             pengajuan.mahasiswa.pembimbing2?.id
                           ? "Simpan Perubahan"
                           : "Terima & Tentukan Pembimbing"}
                        </Button>
                        <Button
                           variant="destructive"
                           className="w-full h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 dark:border-red-900/50 shadow-none"
                           onClick={() => {
                              if(confirm('Apakah Anda yakin ingin menolak pengajuan ini?')) {
                                handleReject();
                              }
                           }}
                           disabled={isUpdating}
                        >
                           {isUpdating ? "Memproses..." : "Tolak Pengajuan"}
                        </Button>
                     </div>
                  </div>
                )}

             </div>
          </div>

        </div>
      </div>

      {/* Modal pilih pembimbing untuk kaprodi */}
      <AlertDialog
        open={showPembimbingModal}
        onOpenChange={setShowPembimbingModal}
      >
        <AlertDialogContent className="max-w-md dark:bg-neutral-900 rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-gray-100">
              {pengajuan.mahasiswa.pembimbing1?.id ||
              pengajuan.mahasiswa.pembimbing2?.id
                ? "Edit Pembimbing & Keterangan"
                : "Pilih Pembimbing & Tambah Keterangan"}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <form onSubmit={handlePembimbingSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 dark:text-gray-200 text-sm font-medium">
                Pembimbing 1
              </label>
              <Select
                value={selectedPembimbing1 ? String(selectedPembimbing1) : ""}
                onValueChange={(val) => {
                  setSelectedPembimbing1(Number(val));
                  setValidationError(null);
                  if (Number(val) === selectedPembimbing2) {
                    setSelectedPembimbing2(null);
                  }
                }}
                required
              >
                <SelectTrigger
                  ref={firstSelectRef}
                  className="w-full dark:bg-[#1f1f1f] dark:text-gray-100 rounded-lg"
                  aria-label="Pilih Pembimbing 1"
                >
                  <SelectValue placeholder="Pilih Pembimbing 1" />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#1f1f1f] dark:text-gray-100">
                  {dosenList.map((dosen) => (
                    <SelectItem key={dosen.id} value={String(dosen.id)}>
                      {dosen.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                Pilih dosen pembimbing pertama.
              </p>
            </div>
            <div>
              <label className="block mb-1 dark:text-gray-200 text-sm font-medium">
                Pembimbing 2
              </label>
              <Select
                value={selectedPembimbing2 ? String(selectedPembimbing2) : ""}
                onValueChange={(val) => {
                  setSelectedPembimbing2(Number(val));
                  setValidationError(null);
                }}
                required
              >
                <SelectTrigger
                  className="w-full dark:bg-[#1f1f1f] dark:text-gray-100 rounded-lg"
                  aria-label="Pilih Pembimbing 2"
                >
                  <SelectValue placeholder="Pilih Pembimbing 2" />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#1f1f1f] dark:text-gray-100">
                  {dosenList
                    .filter((d) => d.id !== selectedPembimbing1)
                    .map((dosen) => (
                      <SelectItem key={dosen.id} value={String(dosen.id)}>
                        {dosen.nama}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="block mb-1 dark:text-gray-200 text-sm font-medium">
                Keterangan (opsional)
              </Label>
              <Textarea
                className="w-full rounded-lg border px-2 py-1 dark:bg-[#1f1f1f] dark:text-gray-100"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Isi keterangan jika diperlukan"
                rows={2}
              />
            </div>
            <div className="mt-2">
              {validationError && (
                <div className="text-sm text-red-600 mt-1">
                  {validationError}
                </div>
              )}
            </div>
            <AlertDialogFooter className="pt-2 flex-row gap-2 justify-end">
              <AlertDialogCancel asChild>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowPembimbingModal(false)}
                  disabled={isUpdating}
                  className="rounded-lg"
                >
                  Batal
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  type="submit"
                  disabled={
                    isUpdating ||
                    !selectedPembimbing1 ||
                    !selectedPembimbing2 ||
                    selectedPembimbing1 === selectedPembimbing2
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  {isUpdating ? "Memproses..." : "Simpan & Terima"}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
