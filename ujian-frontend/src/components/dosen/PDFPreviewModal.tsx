"use client";
import { PDFDocument } from "@/components/PDFDocument";
import { Button } from "@/components/ui/button";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { updateStatusPengajuanRanpel } from "@/actions/pengajuanRanpel";
import { getDosen } from "@/actions/dosen";
import { updatePembimbingMahasiswa } from "@/actions/mahasiswa";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pengajuan: PengajuanRanpel;
  loggedUser: any;
  onUpdated?: () => void; // Tambah prop ini
}

export default function PDFPreviewModal({
  isOpen,
  onClose,
  pengajuan,
  loggedUser,
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

  // Check if user has permission to approve/reject
  const canApproveReject =
    loggedUser.roles[0].name === "dosen" ||
    loggedUser.roles[0].name === "kaprodi";

  useEffect(() => {
    if (showPembimbingModal && loggedUser?.prodi?.id) {
      getDosen(loggedUser.prodi.id).then((res) => {
        setDosenList(res.data);
      });
    }
  }, [showPembimbingModal, loggedUser]);

  if (!isOpen) return null;

  const handleAccept = async () => {
    setIsUpdating(true);
    try {
      const ranpelId = pengajuan.id;
      const status =
        loggedUser.roles[0].name === "dosen" ? "diverifikasi" : "diterima";

      if (loggedUser.roles[0].name === "kaprodi") {
        setShowPembimbingModal(true);
        setIsUpdating(false);
        return;
      }

      await updateStatusPengajuanRanpel(pengajuan.mahasiswa.id, ranpelId, {
        status,
      });

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
      const ranpelId = pengajuan.id; // Assuming pengajuan has an 'id' field
      await updateStatusPengajuanRanpel(pengajuan.mahasiswa.id, ranpelId, {
        status: "ditolak",
      });
      // Optionally refresh the data or show success message
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
      setShowPembimbingModal(false);
      if (onUpdated) onUpdated(); // Trigger refresh
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
          <h2 className="text-xl font-semibold">
            Preview Rancangan Penelitian
          </h2>
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
      {showPembimbingModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Pilih Pembimbing 1 & 2
            </h3>
            <form onSubmit={handlePembimbingSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Pembimbing 1</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={selectedPembimbing1 ?? ""}
                  onChange={(e) =>
                    setSelectedPembimbing1(Number(e.target.value))
                  }
                  required
                >
                  <option value="" disabled>
                    Pilih Pembimbing 1
                  </option>
                  {dosenList.map((dosen) => (
                    <option key={dosen.id} value={dosen.id}>
                      {dosen.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Pembimbing 2</label>
                <select
                  className="w-full border rounded px-2 py-1"
                  value={selectedPembimbing2 ?? ""}
                  onChange={(e) =>
                    setSelectedPembimbing2(Number(e.target.value))
                  }
                  required
                >
                  <option value="" disabled>
                    Pilih Pembimbing 2
                  </option>
                  {dosenList.map((dosen) => (
                    <option key={dosen.id} value={dosen.id}>
                      {dosen.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2 justify-end">
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Memproses..." : "Simpan & Terima"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPembimbingModal(false)}
                  disabled={isUpdating}
                >
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
