"use client";

import { PDFDocument } from "@/components/PDFDocument";
import { Button } from "@/components/ui/button";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { X, Pencil } from "lucide-react";
import Form from "./Form";
import { usePDFPreviewModal } from "./usePDFPreviewModal";

// ─── Props ────────────────────────────────────────────────────────────────────

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pengajuan: PengajuanRanpel;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dosenList?: any[];
  kaprodi?: { nama: string; nip: string };
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function DocumentIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="stroke-current stroke-2"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function LayoutIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="stroke-current stroke-2"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="15" y1="3" x2="15" y2="21" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ChevronIcon({ rotated }: { rotated: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-300 ${rotated ? "rotate-180" : ""}`}
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PDFPreviewModal({
  isOpen,
  onClose,
  pengajuan,
  dosenList,
  kaprodi,
}: PDFPreviewModalProps) {
  const {
    showDetails,
    setShowDetails,
    isEditing,
    setIsEditing,
    isGeneratingRanpel,
    isGeneratingSurat,
    handleDownloadRanpel,
    handleDownloadSurat,
  } = usePDFPreviewModal({ pengajuan, dosenList, kaprodi });

  if (!isOpen) return null;

  // ── Edit mode overlay ──────────────────────────────────────────────────────
  if (isEditing) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsEditing(false)}
        />
        <div className="relative bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden border dark:border-neutral-800">
          <div className="flex-1 overflow-auto">
            <Form
              mahasiswaId={pengajuan.mahasiswa.id}
              initialData={pengajuan.ranpel}
              ranpelId={pengajuan.ranpel.id}
              status={pengajuan.status}
              onClose={() => setIsEditing(false)}
              onSuccess={() => setIsEditing(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Main preview ───────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-[#1f1f1f] rounded-xl shadow-2xl max-w-full sm:max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden border dark:border-neutral-800">
        {/* Header */}
        <ModalHeader
          pengajuan={pengajuan}
          showDetails={showDetails}
          isGeneratingRanpel={isGeneratingRanpel}
          onToggleDetails={() => setShowDetails(!showDetails)}
          onEditClick={() => setIsEditing(true)}
          onDownloadRanpel={handleDownloadRanpel}
          onClose={onClose}
        />

        {/* Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* PDF preview area */}
          <div className="flex-1 bg-gray-50 dark:bg-black/20 overflow-auto p-4 md:p-6 flex justify-center">
            <div className="w-full h-full max-w-5xl mx-auto">
              <PDFDocument pengajuan={pengajuan} />
            </div>
          </div>

          {/* Right sidebar */}
          <div
            className={`
              fixed bottom-0 left-0 right-0 z-30 flex flex-col bg-white dark:bg-[#1f1f1f]
              md:static md:w-96 md:shrink-0 md:border-l md:dark:border-neutral-800 md:z-20
              md:shadow-[-5px_0_15px_-3px_rgba(0,0,0,0.05)] transition-all duration-300
              ${showDetails ? "md:flex" : "md:hidden"}
              ${showDetails ? "h-[60vh]" : "h-16"} md:h-auto
              rounded-t-2xl md:rounded-none shadow-[0_-5px_15px_-3px_rgba(0,0,0,0.1)]
              md:shadow-none overflow-hidden
            `}
          >
            {/* Mobile toggle handle */}
            <MobileToggle
              showDetails={showDetails}
              onToggle={() => setShowDetails(!showDetails)}
            />

            {/* Sidebar content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
              <StatusSection pengajuan={pengajuan} />
              <hr className="my-4 border-gray-100 dark:border-neutral-800" />
              <DosenPASection pengajuan={pengajuan} />
              <hr className="my-4 border-gray-100 dark:border-neutral-800" />
              <PembimbingSection
                pengajuan={pengajuan}
                isGeneratingSurat={isGeneratingSurat}
                onDownloadSurat={handleDownloadSurat}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section sub-components ───────────────────────────────────────────────────

function ModalHeader({
  pengajuan,
  showDetails,
  isGeneratingRanpel,
  onToggleDetails,
  onEditClick,
  onDownloadRanpel,
  onClose,
}: {
  pengajuan: PengajuanRanpel;
  showDetails: boolean;
  isGeneratingRanpel: boolean;
  onToggleDetails: () => void;
  onEditClick: () => void;
  onDownloadRanpel: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b dark:border-neutral-800 bg-white dark:bg-[#1f1f1f] z-10">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 dark:bg-primary/20 text-primary rounded-xl">
          <DocumentIcon />
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
          onClick={onEditClick}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-xl transition-colors text-gray-500 hover:text-primary dark:hover:text-primary"
          title="Edit Rancangan"
        >
          <Pencil size={18} />
          <span className="text-sm font-medium hidden md:inline-block">
            Edit Ranpel
          </span>
        </button>
        <button
          disabled={isGeneratingRanpel}
          onClick={onDownloadRanpel}
          className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary/80 text-white rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          title={
            isGeneratingRanpel
              ? "Sedang membuat PDF..."
              : "Download Rancangan Penelitian"
          }
        >
          <DownloadIcon />
          <span className="text-sm font-medium hidden md:inline-block">
            {isGeneratingRanpel ? "Membuat PDF..." : "Download Ranpel"}
          </span>
        </button>
        <button
          onClick={onToggleDetails}
          className={`p-2 rounded-full transition-colors hidden md:block ${
            showDetails
              ? "bg-primary/10 text-primary dark:bg-primary/20"
              : "hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500"
          }`}
          title={
            showDetails ? "Sembunyikan Panel Kanan" : "Tampilkan Panel Kanan"
          }
        >
          <LayoutIcon />
        </button>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-gray-500"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

function MobileToggle({
  showDetails,
  onToggle,
}: {
  showDetails: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="flex md:hidden items-center justify-between px-6 h-16 border-b dark:border-neutral-800 cursor-pointer bg-white dark:bg-[#1f1f1f] hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors z-40 relative"
      onClick={onToggle}
    >
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-200 dark:bg-neutral-700 rounded-full" />
      <div className="flex items-center gap-2 mt-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">
          Detail
        </h3>
      </div>
      <button className="p-2 mt-2 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-500">
        <ChevronIcon rotated={showDetails} />
      </button>
    </div>
  );
}

function StatusSection({ pengajuan }: { pengajuan: PengajuanRanpel }) {
  const statusClass =
    pengajuan.status === "diterima"
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      : pengajuan.status === "ditolak"
        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        : pengajuan.status === "diverifikasi"
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";

  return (
    <div className="space-y-4">
      <h3 className="hidden md:flex text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
        Status Dokumen
      </h3>
      <div className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-4 border border-gray-100 dark:border-neutral-800">
        <div className="mb-4">
          <span className="text-xs text-gray-500 block mb-1">
            Status Saat Ini
          </span>
          <span
            className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide ${statusClass}`}
          >
            {pengajuan.status}
          </span>
        </div>

        {/* Timeline */}
        <div className="relative pl-4 space-y-6 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-neutral-700">
          <TimelineItem
            label="Tanggal Pengajuan"
            date={pengajuan.tanggalPengajuan}
            color="bg-primary"
          />
          <TimelineItem
            label="Verifikasi Dosen PA"
            date={pengajuan.tanggalDiverifikasi}
            color={
              pengajuan.tanggalDiverifikasi
                ? "bg-blue-500"
                : "bg-gray-300 dark:bg-neutral-700"
            }
            fallback="Menunggu verifikasi"
          />
          <TimelineItem
            label="Persetujuan Kaprodi"
            date={pengajuan.tanggalDiterima}
            color={
              pengajuan.tanggalDiterima
                ? "bg-green-500"
                : "bg-gray-300 dark:bg-neutral-700"
            }
            fallback={
              pengajuan.status === "ditolak" ? "Ditolak" : "Menunggu keputusan"
            }
          />
        </div>
      </div>

      {pengajuan.keterangan && (
        <NoteBox label="Catatan Dosen PA" content={pengajuan.keterangan} />
      )}
      {pengajuan.catatanKaprodi && (
        <NoteBox
          label="Catatan Kaprodi"
          content={pengajuan.catatanKaprodi}
          colorClass="border-purple-100 dark:border-purple-900/20 bg-purple-50/50 dark:bg-purple-900/10 text-purple-900 dark:text-purple-100"
        />
      )}
    </div>
  );
}

function TimelineItem({
  label,
  date,
  color,
  fallback,
}: {
  label: string;
  date?: string | null;
  color: string;
  fallback?: string;
}) {
  const formatted = date
    ? new Date(date).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="relative">
      <div
        className={`absolute -left-[21px] mt-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-neutral-900 ring-2 ring-current/20 ${color}`}
      />
      <span className="text-xs font-medium text-gray-500 block">{label}</span>
      {formatted ? (
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">
          {formatted}
        </span>
      ) : (
        <span className="text-sm text-gray-400 italic">{fallback}</span>
      )}
    </div>
  );
}

function NoteBox({
  label,
  content,
  colorClass = "border-primary/10 dark:border-primary/20 bg-primary/5 dark:bg-primary/10 text-gray-700 dark:text-primary",
}: {
  label: string;
  content: string;
  colorClass?: string;
}) {
  return (
    <div>
      <span className="text-xs font-semibold text-gray-500 mb-2 block">
        {label}
      </span>
      <div
        className={`p-4 rounded-2xl border text-sm leading-relaxed min-h-[60px] ${colorClass}`}
      >
        {content}
      </div>
    </div>
  );
}

function DosenPASection({ pengajuan }: { pengajuan: PengajuanRanpel }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
        Dosen PA
      </h3>
      <div className="flex gap-3 items-start">
        <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xs font-bold shrink-0">
          PA
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Pembimbing Akademik</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {pengajuan.mahasiswa?.dosenPa?.nama || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

function PembimbingSection({
  pengajuan,
  isGeneratingSurat,
  onDownloadSurat,
}: {
  pengajuan: PengajuanRanpel;
  isGeneratingSurat: boolean;
  onDownloadSurat: () => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
        Dosen Pembimbing
      </h3>
      <div className="space-y-3">
        {[
          {
            num: "1",
            role: "Pembimbing 1",
            dosen: pengajuan.mahasiswa?.pembimbing1,
          },
          {
            num: "2",
            role: "Pembimbing 2",
            dosen: pengajuan.mahasiswa?.pembimbing2,
          },
        ].map(({ num, role, dosen }) => (
          <div key={num} className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
              {num}
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">{role}</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {dosen?.nama ?? (
                  <span className="text-gray-400 font-normal italic">
                    Belum ditentukan
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <Button
          disabled={isGeneratingSurat || !pengajuan.mahasiswa?.pembimbing1}
          title={
            !pengajuan.mahasiswa?.pembimbing1
              ? "Pembimbing belum ditentukan"
              : isGeneratingSurat
                ? "Sedang membuat PDF..."
                : "Download Surat Pengajuan"
          }
          onClick={onDownloadSurat}
          className="w-full bg-primary hover:bg-primary/80 text-white h-10 md:h-12 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <DownloadIcon />
          {isGeneratingSurat
            ? "Membuat PDF..."
            : "Download Surat Pengajuan Judul"}
        </Button>
      </div>
    </div>
  );
}
