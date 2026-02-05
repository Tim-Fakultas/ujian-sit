"use client";
import { PDFDocument } from "@/components/PDFDocument";
import { Button } from "@/components/ui/button";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { updateStatusPengajuanRanpel } from "@/actions/pengajuanRanpel";
import { getDosen } from "@/actions/data-master/dosen";
import { updatePembimbingMahasiswa } from "@/actions/data-master/mahasiswa";
import { useState, useEffect, useRef } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { showToast } from "@/components/ui/custom-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { X, CheckCircle2, Check, ChevronsUpDown, Search } from "lucide-react";

function DosenCombobox({
  value,
  onChange,
  options,
  placeholder = "Pilih Dosen...",
  disabled = false,
  excludeIds = [],
}: {
  value: number | null;
  onChange: (val: number) => void;
  options: { id: number; nama: string }[];
  placeholder?: string;
  disabled?: boolean;
  excludeIds?: number[];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter(
    (opt) =>
      !excludeIds.includes(opt.id) &&
      opt.nama.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOption = options.find((opt) => opt.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between font-normal dark:bg-[#1f1f1f] dark:text-gray-100 dark:border-neutral-700 h-10 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {selectedOption ? (
            <span className="truncate">{selectedOption.nama}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 dark:bg-[#1f1f1f] dark:border-neutral-700">
        <div className="flex items-center border-b px-3 dark:border-neutral-700">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 dark:text-gray-400" />
          <input
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-100"
            placeholder="Cari dosen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="max-h-[200px] overflow-y-auto p-1">
          {filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Tidak ada dosen ditemukan.
            </div>
          ) : (
            filteredOptions.map((option) => (
              <div
                key={option.id}
                className={cn(
                  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-100 dark:hover:bg-neutral-800 cursor-pointer",
                  value === option.id && "bg-slate-100 dark:bg-neutral-800"
                )}
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                  setSearch("");
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.nama}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

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
  const [catatanKaprodi, setCatatanKaprodi] = useState<string>("");
  const firstSelectRef = useRef<HTMLButtonElement | null>(null);

  const { user } = useAuthStore.getState();

  // Check if user has permission to approve/reject
  const canApproveReject =
    user?.roles &&
    (user.roles[0].name === "dosen" || user.roles[0].name === "kaprodi");

  // State for Dosen PA verification modal
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  // Add state for sidebar toggle
  const [showDetails, setShowDetails] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    if (showPembimbingModal && user?.prodi?.id) {
      getDosen(user.prodi.id).then((res) => {
        setDosenList(res);
      });
    }
  }, [showPembimbingModal, user]);

  // Prefill pembimbing jika sudah ada ketika modal dibuka
  useEffect(() => {
    if (showPembimbingModal || showVerificationModal || showRejectModal) {
      const p1 = pengajuan.mahasiswa.pembimbing1?.id ?? null;
      const p2 = pengajuan.mahasiswa.pembimbing2?.id ?? null;
      setSelectedPembimbing1(p1);
      setSelectedPembimbing2(p2);
      setValidationError(null);

      // Prefill keterangan jika sudah ada
      setKeterangan(pengajuan.keterangan ?? "");
      setCatatanKaprodi(pengajuan.catatanKaprodi ?? "");

      // fokus ke select pertama untuk akses keyboard
      setTimeout(() => {
        firstSelectRef.current?.focus?.();
      }, 80);
    }
  }, [showPembimbingModal, showVerificationModal, showRejectModal, pengajuan]);

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

      // If Dosen PA, open verification modal first if not strictly confirming
      if (user?.roles?.[0]?.name === "dosen" && !showVerificationModal) {
        setShowVerificationModal(true);
        setIsUpdating(false);
        return;
      }

      await updateStatusPengajuanRanpel(pengajuan.mahasiswa.id, ranpelId, {
        status,
        keterangan: keterangan // Send keterangan for Dosen PA too
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

      setShowVerificationModal(false);
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
      // Note: Rejection could also benefit from a note, currently strictly status
      await updateStatusPengajuanRanpel(pengajuan.mahasiswa.id, ranpelId, {
        status: "ditolak",
        keterangan: user?.roles?.[0]?.name === "dosen" ? keterangan : undefined, // Dosen PA uses keterangan
        catatanKaprodi: user?.roles?.[0]?.name === "kaprodi" ? catatanKaprodi : undefined // Kaprodi uses distinct note
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
        catatanKaprodi: catatanKaprodi,
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
            <div className="p-2 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary rounded-lg">
              {/* Document Icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current stroke-2">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                Rancangan Penelitian
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {pengajuan.mahasiswa.nama} • {pengajuan.mahasiswa.nim}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`p-2 rounded-full transition-colors hidden md:block ${showDetails ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500'}`}
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
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse box-content border-2 border-primary/20 dark:border-primary/30"></div>
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
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
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

                  {/* Timeline Design */}
                  <div className="mt-4 space-y-0">
                    {/* Tanggal Pengajuan */}
                    <div className="flex gap-3 items-start relative">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 dark:border-blue-400 flex items-center justify-center shrink-0 z-10">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                        </div>
                        {(pengajuan.tanggalDiverifikasi || canApproveReject || user?.roles?.[0]?.name === 'kaprodi' || user?.roles?.[0]?.name === 'dosen') && (
                          <div className="w-0.5 h-8 bg-gradient-to-b from-blue-300 to-orange-300 dark:from-blue-700 dark:to-orange-700"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <span className="text-xs text-gray-500 block">Tanggal Pengajuan</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                          {new Date(pengajuan.tanggalPengajuan).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Tanggal Diverifikasi */}
                    {(pengajuan.tanggalDiverifikasi || canApproveReject || user?.roles?.[0]?.name === 'kaprodi' || user?.roles?.[0]?.name === 'dosen') && (
                      <div className="flex gap-3 items-start relative">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${pengajuan.tanggalDiverifikasi
                              ? 'bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-500 dark:border-orange-400'
                              : 'bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600'
                            }`}>
                            {pengajuan.tanggalDiverifikasi ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600 dark:text-orange-400">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600"></div>
                            )}
                          </div>
                          {pengajuan.tanggalDiterima && (
                            <div className="w-0.5 h-8 bg-gradient-to-b from-orange-300 to-green-300 dark:from-orange-700 dark:to-green-700"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-2">
                          <span className="text-xs text-gray-500 block">Tanggal Diverifikasi Dosen PA</span>
                          <span className={`text-sm font-semibold ${pengajuan.tanggalDiverifikasi ? 'text-gray-900 dark:text-gray-200' : 'text-gray-400 dark:text-gray-600'}`}>
                            {pengajuan.tanggalDiverifikasi
                              ? new Date(pengajuan.tanggalDiverifikasi).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })
                              : "Belum diverifikasi"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Tanggal Diterima */}
                    {pengajuan.tanggalDiterima && (
                      <div className="flex gap-3 items-start relative">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 border-2 border-green-500 dark:border-green-400 flex items-center justify-center shrink-0 z-10">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                              <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1">
                          <span className="text-xs text-gray-500 block">Tanggal Diterima Kaprodi</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                            {new Date(pengajuan.tanggalDiterima).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Keterangan */}
                <div>
                  <div className="space-y-4">
                    {/* Catatan Dosen PA */}
                    <div>
                      <span className="text-xs font-semibold text-gray-500 mb-2 block">Catatan Dosen PA</span>
                      <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/10 dark:border-primary/20 text-sm text-gray-700 dark:text-primary leading-relaxed min-h-[60px]">
                        {pengajuan.keterangan ? (
                          pengajuan.keterangan
                        ) : (
                          <span className="text-gray-400 italic">Tidak ada catatan.</span>
                        )}
                      </div>
                    </div>

                    {/* Catatan Kaprodi */}
                    <div>
                      <span className="text-xs font-semibold text-gray-500 mb-2 block">Catatan Kaprodi</span>
                      <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/10 dark:border-primary/20 text-sm text-gray-700 dark:text-primary leading-relaxed min-h-[60px]">
                        {pengajuan.catatanKaprodi ? (
                          pengajuan.catatanKaprodi
                        ) : (
                          <span className="text-gray-400 italic">Tidak ada catatan.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full border-b dark:border-neutral-800 my-4"></div>

              {/* Section: Dosen PA */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                  Dosen PA
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xs font-bold shrink-0">
                      PA
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">
                        Pembimbing Akademik
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {pengajuan.mahasiswa?.dosenPa?.nama || "-"}
                      </p>
                    </div>
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
                      onClick={() => setShowRejectModal(true)}
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
              <DosenCombobox
                value={selectedPembimbing1}
                options={dosenList}
                onChange={(val) => {
                  setSelectedPembimbing1(val);
                  setValidationError(null);
                  if (val === selectedPembimbing2) {
                    setSelectedPembimbing2(null); // Reset P2 if same
                  }
                }}
                placeholder="Pilih Pembimbing 1"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Pilih dosen pembimbing pertama.
              </p>
            </div>
            <div>
              <label className="block mb-1 dark:text-gray-200 text-sm font-medium">
                Pembimbing 2
              </label>
              <DosenCombobox
                value={selectedPembimbing2}
                options={dosenList}
                onChange={(val) => {
                  setSelectedPembimbing2(val);
                  setValidationError(null);
                }}
                placeholder="Pilih Pembimbing 2"
                excludeIds={selectedPembimbing1 ? [selectedPembimbing1] : []}
              />
            </div>
            <div>
              <Label className="block mb-1 dark:text-gray-200 text-sm font-medium">
                Catatan Kaprodi
              </Label>
              <Textarea
                className="w-full rounded-lg border px-2 py-1 dark:bg-[#1f1f1f] dark:text-gray-100"
                value={catatanKaprodi}
                onChange={(e) => setCatatanKaprodi(e.target.value)}
                placeholder="Isi catatan untuk mahasiswa (opsional)"
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
                  className="bg-primary hover:bg-primary/90 text-white rounded-lg"
                  onClick={(e) => {
                    // The form submit will handle this, but AlertDialogAction triggers automatic close if not prevented
                    // We need to rely on form submit, so we use `type="submit"` and let it bubble up to `handlePembimbingSubmit`
                    // However, `AlertDialogAction` has a default click handler that might interfere. 
                    // It is better to use `asChild` and a regular Button that SUBMITS the form. 
                    // Wait, we are already using a Button type="submit" inside asChild. 
                    // Just ensure the form handler works. 
                  }}
                >
                  {isUpdating ? "Memproses..." : "Simpan & Terima"}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal Verifikasi Dosen PA */}
      <AlertDialog
        open={showVerificationModal}
        onOpenChange={setShowVerificationModal}
      >
        <AlertDialogContent className="max-w-md dark:bg-neutral-900 rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-gray-100">
              Verifikasi Rancangan Penelitian
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Apakah Anda yakin ingin memverifikasi pengajuan ini? Anda dapat menambahkan catatan untuk mahasiswa/prodi.
            </p>
            <div>
              <Label className="block mb-1 dark:text-gray-200 text-sm font-medium">
                Catatan Dosen PA (Opsional)
              </Label>
              <Textarea
                className="w-full rounded-lg border px-2 py-1 dark:bg-[#1f1f1f] dark:text-gray-100"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Tuliskan catatan..."
                rows={3}
              />
            </div>

            <AlertDialogFooter className="pt-2 flex-row gap-2 justify-end">
              <AlertDialogCancel asChild>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowVerificationModal(false)}
                  disabled={isUpdating}
                  className="rounded-lg"
                >
                  Batal
                </Button>
              </AlertDialogCancel>
              <Button
                type="button" // Use type button calling handleAccept directly
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                onClick={handleAccept}
                disabled={isUpdating}
              >
                {isUpdating ? "Memproses..." : "Verifikasi"}
              </Button>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal Tolak Pengajuan */}
      <AlertDialog
        open={showRejectModal}
        onOpenChange={setShowRejectModal}
      >
        <AlertDialogContent className="max-w-md dark:bg-neutral-900 rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-gray-100 flex items-center gap-2 text-red-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              Tolak Pengajuan
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Apakah Anda yakin ingin menolak pengajuan ini? Mohon berikan alasan penolakan atau catatan perbaikan.
            </p>
            <div>
              <Label className="block mb-1 dark:text-gray-200 text-sm font-medium">
                Alasan Penolakan / Catatan
              </Label>
              <Textarea
                className="w-full rounded-lg border px-2 py-1 dark:bg-[#1f1f1f] dark:text-gray-100 focus-visible:ring-red-500"
                value={user?.roles?.[0]?.name === "kaprodi" ? catatanKaprodi : keterangan}
                onChange={(e) => user?.roles?.[0]?.name === "kaprodi" ? setCatatanKaprodi(e.target.value) : setKeterangan(e.target.value)}
                placeholder="Tuliskan alasan penolakan..."
                rows={3}
                required
              />
            </div>

            <AlertDialogFooter className="pt-2 flex-row gap-2 justify-end">
              <AlertDialogCancel asChild>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowRejectModal(false)}
                  disabled={isUpdating}
                  className="rounded-lg"
                >
                  Batal
                </Button>
              </AlertDialogCancel>
              <Button
                type="button"
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
                onClick={handleReject}
                disabled={isUpdating || (user?.roles?.[0]?.name === "kaprodi" ? !catatanKaprodi.trim() : !keterangan.trim())}
              >
                {isUpdating ? "Memproses..." : "Tolak Pengajuan"}
              </Button>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div >
  );
}
