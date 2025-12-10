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
import { toast } from "sonner";
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

      // Tampilkan toast dinamis jika status yang di-set adalah 'diverifikasi'
      if (status === "diverifikasi") {
        toast(
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-green-500" size={20} />
            <div>
              <div className="font-semibold">Berhasil Diverifikasi</div>
              <div className="text-xs">
                Pengajuan {pengajuan.mahasiswa.nama} berhasil diverifikasi.
              </div>
            </div>
          </div>
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
      // Validasi cepat: pembimbing tidak boleh sama
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
      await revalidateAction("/kaprodi/pengajuan-ranpel"); // tambahkan ini agar kaprodi juga revalidate
      setShowPembimbingModal(false);

      // Custom toast
      toast(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="text-green-500" size={20} />
          <div>
            <div className="font-semibold">Berhasil!</div>
            <div className="text-xs">
              Pembimbing berhasil disimpan dan pengajuan diterima.
            </div>
          </div>
        </div>
      );

      if (onUpdated) onUpdated();
      onClose();
    } catch (error) {
      alert("Gagal update pembimbing atau status!" + error);
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blur background */}
      <div
        className="absolute inset-0 bg-black/30 dark:bg-neutral-950/70 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-neutral-950 rounded-lg max-w-5xl w-full max-h-[92vh] flex flex-col z-50">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b gap-4 dark:border-neutral-800">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Rancangan Penelitian
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {pengajuan.mahasiswa.nama} •{" "}
              <span className="font-mono">{pengajuan.mahasiswa.nim}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              aria-label="Tutup"
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main content: left = preview (scrollable), right = sidebar (sticky on md+) */}
        <div className="flex-1 overflow-hidden">
          <div className="flex flex-col md:flex-row h-full min-h-0">
            {/* preview pane */}
            <div className="flex-1 p-4 overflow-auto min-h-0">
              <div className="bg-white dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800 rounded-md shadow-sm overflow-hidden h-full">
                {/* preview area controlled by parent: use native overflow-auto to avoid runtime invalid element errors */}
                <div className="h-full overflow-auto p-6">
                  <PDFDocument pengajuan={pengajuan} />
                </div>
                {/* pembimbing info (mobile: below preview) */}
                <div className="mt-4 md:hidden border-t pt-4 dark:border-neutral-800">
                  <div className="mb-2 font-semibold">Dosen Pembimbing:</div>
                  <div className="text-sm">
                    <span className="font-medium">Pembimbing 1: </span>
                    {pengajuan.mahasiswa.pembimbing1?.nama ? (
                      pengajuan.mahasiswa.pembimbing1.nama
                    ) : (
                      <span className="italic text-gray-400 dark:text-gray-500">
                        Belum ditentukan
                      </span>
                    )}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Pembimbing 2: </span>
                    {pengajuan.mahasiswa.pembimbing2?.nama ? (
                      pengajuan.mahasiswa.pembimbing2.nama
                    ) : (
                      <span className="italic text-gray-400 dark:text-gray-500">
                        Belum ditentukan
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* sidebar */}
            <aside className="w-full md:w-80 border-t md:border-t-0 md:border-l border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-950">
              <div className="p-4 md:sticky md:top-4">
                <div className="mb-4">
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="mt-2">
                    <span
                      className={
                        `inline-block px-2 py-1 rounded text-sm font-semibold ` +
                        (pengajuan.status === "menunggu"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : pengajuan.status === "diterima"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : pengajuan.status === "diverifikasi"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : pengajuan.status === "ditolak"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200")
                      }
                    >
                      {pengajuan.status}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-muted-foreground">
                    Dosen Pembimbing
                  </div>
                  <div className="mt-2 text-sm">
                    <div>
                      <span className="font-medium">Pembimbing 1:</span>{" "}
                      {pengajuan.mahasiswa.pembimbing1?.nama ?? (
                        <span className="italic text-gray-400">Belum</span>
                      )}
                    </div>
                    <div className="mt-1">
                      <span className="font-medium">Pembimbing 2:</span>{" "}
                      {pengajuan.mahasiswa.pembimbing2?.nama ?? (
                        <span className="italic text-gray-400">Belum</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* actions - visible on desktop inside sidebar; on mobile actions shown in footer */}
                {canApproveReject && (
                  <div className="hidden md:block">
                    <div className="flex flex-col gap-2">
                      <Button
                        className="bg-emerald-700 hover:bg-emerald-800 text-white w-full"
                        onClick={handleAccept}
                        disabled={isUpdating}
                      >
                        {isUpdating
                          ? "Memproses..."
                          : user?.roles?.[0]?.name === "dosen"
                          ? "Verifikasi"
                          : pengajuan.mahasiswa.pembimbing1?.id ||
                            pengajuan.mahasiswa.pembimbing2?.id
                          ? "Edit Pembimbing"
                          : "Tentukan Pembimbing"}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          await handleReject();
                          toast(
                            <div className="flex items-center gap-2">
                              <CheckCircle2
                                className="text-red-500"
                                size={18}
                              />
                              <div>
                                <div className="font-semibold">Ditolak</div>
                                <div className="text-xs">
                                  Pengajuan berhasil ditolak.
                                </div>
                              </div>
                            </div>
                          );
                        }}
                        disabled={isUpdating}
                        className="w-full"
                      >
                        {isUpdating ? "Memproses..." : "Tolak"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>

        {/* Mobile footer actions (sticky bottom) */}
        {canApproveReject && (
          <div className="md:hidden border-t p-3 bg-white dark:bg-neutral-950 dark:border-neutral-800">
            <div className="flex gap-3 justify-end">
              <Button
                className="bg-emerald-600 text-white"
                onClick={handleAccept}
                disabled={isUpdating}
              >
                {isUpdating
                  ? "Memproses..."
                  : user?.roles?.[0]?.name === "dosen"
                  ? "Verifikasi"
                  : pengajuan.mahasiswa.pembimbing1?.id ||
                    pengajuan.mahasiswa.pembimbing2?.id
                  ? "Edit Pembimbing"
                  : "Tentukan Pembimbing"}
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  await handleReject();
                  toast(
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="text-red-500" size={18} />
                      <div>
                        <div className="font-semibold">Ditolak</div>
                        <div className="text-xs">
                          Pengajuan berhasil ditolak.
                        </div>
                      </div>
                    </div>
                  );
                }}
                disabled={isUpdating}
              >
                {isUpdating ? "Memproses..." : "Tolak"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal pilih pembimbing untuk kaprodi */}
      <AlertDialog
        open={showPembimbingModal}
        onOpenChange={setShowPembimbingModal}
      >
        <AlertDialogContent className="max-w-md dark:bg-neutral-900">
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
              <label className="block mb-1 dark:text-gray-200">
                Pembimbing 1
              </label>
              <Select
                value={selectedPembimbing1 ? String(selectedPembimbing1) : ""}
                onValueChange={(val) => {
                  setSelectedPembimbing1(Number(val));
                  // reset validation when user changes
                  setValidationError(null);
                  // if user selected same as pembimbing2, clear pembimbing2 to force reselect
                  if (Number(val) === selectedPembimbing2) {
                    setSelectedPembimbing2(null);
                  }
                }}
                required
              >
                <SelectTrigger
                  ref={firstSelectRef}
                  className="w-full dark:bg-[#1f1f1f] dark:text-gray-100"
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
                Pilih dosen pembimbing pertama. Pastikan pembimbing 1 dan 2
                berbeda.
              </p>
            </div>
            <div>
              <label className="block mb-1 dark:text-gray-200">
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
                  className="w-full dark:bg-[#1f1f1f] dark:text-gray-100"
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
              <Label className="block mb-1 dark:text-gray-200">
                Keterangan (opsional)
              </Label>
              <Textarea
                className="w-full rounded border px-2 py-1 dark:bg-[#1f1f1f] dark:text-gray-100"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Isi keterangan jika diperlukan"
                rows={2}
              />
              {/* Tampilkan keterangan sebelumnya jika ada dan tidak sedang mengedit */}
              {pengajuan.keterangan && !showPembimbingModal && (
                <div className="text-xs text-muted-foreground mt-1">
                  Keterangan sebelumnya: {pengajuan.keterangan}
                </div>
              )}
            </div>
            <div className="mt-2">
              {validationError && (
                <div className="text-sm text-red-600 mt-1">
                  {validationError}
                </div>
              )}
            </div>
            <AlertDialogFooter className="pt-2 flex-row gap-2 justify-end">
              <AlertDialogAction asChild>
                <Button
                  type="submit"
                  disabled={
                    isUpdating ||
                    !selectedPembimbing1 ||
                    !selectedPembimbing2 ||
                    selectedPembimbing1 === selectedPembimbing2
                  }
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isUpdating ? "Memproses..." : "Simpan & Terima"}
                </Button>
              </AlertDialogAction>
              <AlertDialogCancel asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPembimbingModal(false)}
                  disabled={isUpdating}
                >
                  Batal
                </Button>
              </AlertDialogCancel>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
