import { useState, useMemo } from "react";
import { pdf } from "@react-pdf/renderer";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import SuratPengajuanJudulPDF from "./SuratPengajuanJudulPDF";
import RancanganPenelitianPDF from "./RancanganPenelitianPDF";

const KAPRODI_NIP = "197508012009122001";

interface Dosen {
  id?: number;
  nama?: string;
  nip?: string;
  nidn?: string;
}

interface UsePDFPreviewModalOptions {
  pengajuan: PengajuanRanpel;
  dosenList?: Dosen[];
  kaprodi?: { nama: string; nip: string };
}

/**
 * Triggers a browser file download from a Blob.
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Sanitizes a student name for use in a filename.
 */
function toFilename(nama: string): string {
  return (nama || "Mahasiswa").replace(/[^a-zA-Z0-9]/g, "_");
}

export function usePDFPreviewModal({
  pengajuan,
  dosenList,
  kaprodi,
}: UsePDFPreviewModalOptions) {
  // ── UI state ─────────────────────────────────────────────────────────────────
  const [showDetails, setShowDetails] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingRanpel, setIsGeneratingRanpel] = useState(false);
  const [isGeneratingSurat, setIsGeneratingSurat] = useState(false);

  // ── Derived data ──────────────────────────────────────────────────────────────
  /**
   * Resolves the Kaprodi object, either from the `kaprodi` prop directly,
   * or by searching `dosenList` by NIP.
   */
  const derivedKaprodi = useMemo(() => {
    if (kaprodi) return kaprodi;
    if (!dosenList) return undefined;
    const found = dosenList.find(
      (d) => d.nip && String(d.nip).replace(/\s/g, "") === KAPRODI_NIP,
    );
    return found ? { nama: found.nama ?? "", nip: found.nip ?? "" } : undefined;
  }, [kaprodi, dosenList]);

  /**
   * Resolves NIP/NIDN details for both pembimbing by matching against dosenList.
   * These are needed to populate the Surat Pengajuan Judul PDF.
   */
  const pembimbingDetails = useMemo(() => {
    if (!dosenList) return {};
    const find = (match: { id?: number; nama?: string } | undefined) =>
      dosenList.find(
        (d) => d.id === match?.id || d.nama === match?.nama,
      );

    const p1 = find(pengajuan.mahasiswa.pembimbing1);
    const p2 = find(pengajuan.mahasiswa.pembimbing2);

    return {
      p1: p1 ? { nip: p1.nip ?? undefined, nidn: p1.nidn ?? undefined } : undefined,
      p2: p2 ? { nip: p2.nip ?? undefined, nidn: p2.nidn ?? undefined } : undefined,
    };
  }, [dosenList, pengajuan]);

  // ── Download handlers ─────────────────────────────────────────────────────────
  const handleDownloadRanpel = async () => {
    setIsGeneratingRanpel(true);
    try {
      const blob = await pdf(<RancanganPenelitianPDF pengajuan={pengajuan} />).toBlob();
      downloadBlob(
        new Blob([blob], { type: "application/pdf" }),
        `Rancangan_Penelitian_${toFilename(pengajuan.mahasiswa.nama)}.pdf`,
      );
    } catch (error) {
      console.error("[usePDFPreviewModal] Gagal mengunduh Ranpel PDF:", error);
      alert("Gagal membuat PDF. Silakan coba lagi.");
    } finally {
      setIsGeneratingRanpel(false);
    }
  };

  const handleDownloadSurat = async () => {
    setIsGeneratingSurat(true);
    try {
      const blob = await pdf(
        <SuratPengajuanJudulPDF
          pengajuan={pengajuan}
          kaprodi={derivedKaprodi}
          pembimbingDetails={pembimbingDetails}
        />,
      ).toBlob();
      downloadBlob(
        new Blob([blob], { type: "application/pdf" }),
        `Surat_Pengajuan_Judul_${toFilename(pengajuan.mahasiswa.nama)}.pdf`,
      );
    } catch (error) {
      console.error("[usePDFPreviewModal] Gagal mengunduh Surat PDF:", error);
      alert("Gagal membuat PDF. Silakan coba lagi.");
    } finally {
      setIsGeneratingSurat(false);
    }
  };

  return {
    // UI state
    showDetails,
    setShowDetails,
    isEditing,
    setIsEditing,

    // Download state
    isGeneratingRanpel,
    isGeneratingSurat,

    // Derived data
    derivedKaprodi,
    pembimbingDetails,

    // Handlers
    handleDownloadRanpel,
    handleDownloadSurat,
  };
}
