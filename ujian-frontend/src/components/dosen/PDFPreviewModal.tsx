"use client";
import { PDFDocument } from "@/components/PDFDocument";
import { Button } from "@/components/ui/button";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { updateStatusPengajuanRanpel } from "@/actions/pengajuanRanpel";
import { getDosen } from "@/actions/dosen";
import { updatePembimbingMahasiswa } from "@/actions/mahasiswa";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import revalidateAction from "@/actions/revalidateAction";
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
import { CheckCircle2 } from "lucide-react";

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

  const { user } = useAuthStore.getState();
  useEffect(() => {
    console.log("Logged User in Modal:", user);
  }, [user]);

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
      await updatePembimbingMahasiswa({
        mahasiswaId: pengajuan.mahasiswa.id,
        pembimbing1: selectedPembimbing1!,
        pembimbing2: selectedPembimbing2!,
      });
      await updateStatusPengajuanRanpel(pengajuan.mahasiswa.id, pengajuan.id, {
        status: "diterima",
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
        className="absolute inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col z-50">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Rancangan Penelitian</h2>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-auto p-4 ">
          <div className="bg-white shadow-lg">
            <PDFDocument pengajuan={pengajuan} />
          </div>
          {/* Tampilkan dosen pembimbing di bawah preview */}
          <div className="mt-6 border-t pt-4">
            <div className="mb-2 font-semibold">Dosen Pembimbing:</div>
            <div className="text-sm">
              <span className="font-medium">Pembimbing 1: </span>
              {pengajuan.mahasiswa.pembimbing1?.nama ? (
                pengajuan.mahasiswa.pembimbing1.nama
              ) : (
                <span className="italic text-gray-400">Belum ditentukan</span>
              )}
            </div>
            <div className="text-sm">
              <span className="font-medium">Pembimbing 2: </span>
              {pengajuan.mahasiswa.pembimbing2?.nama ? (
                pengajuan.mahasiswa.pembimbing2.nama
              ) : (
                <span className="italic text-gray-400">Belum ditentukan</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer with action buttons - only show for dosen/kaprodi */}
        {canApproveReject && (
          <div className="border-t p-4 bg-gray-50">
            <div className="flex gap-4 justify-end">
              <Button
                className="bg-emerald-600"
                onClick={handleAccept}
                disabled={isUpdating}
              >
                {isUpdating ? "Memproses..." : "Terima"}
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
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
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Pilih Pembimbing 1 & 2</AlertDialogTitle>
          </AlertDialogHeader>
          <form onSubmit={handlePembimbingSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Pembimbing 1</label>
              <Select
                value={selectedPembimbing1 ? String(selectedPembimbing1) : ""}
                onValueChange={(val) => setSelectedPembimbing1(Number(val))}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Pembimbing 1" />
                </SelectTrigger>
                <SelectContent>
                  {dosenList.map((dosen) => (
                    <SelectItem key={dosen.id} value={String(dosen.id)}>
                      {dosen.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-1">Pembimbing 2</label>
              <Select
                value={selectedPembimbing2 ? String(selectedPembimbing2) : ""}
                onValueChange={(val) => setSelectedPembimbing2(Number(val))}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Pembimbing 2" />
                </SelectTrigger>
                <SelectContent>
                  {dosenList.map((dosen) => (
                    <SelectItem key={dosen.id} value={String(dosen.id)}>
                      {dosen.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <AlertDialogFooter className="pt-2 flex-row gap-2 justify-end">
              <AlertDialogAction asChild>
                <Button type="submit" disabled={isUpdating}>
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
