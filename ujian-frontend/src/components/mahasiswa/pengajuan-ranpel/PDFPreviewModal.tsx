"use client";
import { PDFDocument } from "@/components/PDFDocument";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { X } from "lucide-react";

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pengajuan: PengajuanRanpel;
}

export default function PDFPreviewModal({
  isOpen,
  onClose,
  pengajuan,
}: PDFPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred background */}
      <div
        className="absolute inset-0 bg-black/30 dark:bg-[#1f1f1f]/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-[#1f1f1f] rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
          <h2 className="text-xl font-semibold  ">
            Preview Rancangan Penelitian
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-auto p-4 bg-white dark:bg-[#1f1f1f] flex flex-col md:flex-row gap-4">
          {/* Left: PDF */}
          <div className="bg-white shadow-lg dark:bg-[#1f1f1f] flex-1">
            <PDFDocument pengajuan={pengajuan} />
          </div>
          {/* Right: Keterangan */}
          <div className="w-full md:w-72 flex-shrink-0 mt-4 md:mt-0">
            <div className="font-semibold mb-1">Keterangan</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 border rounded p-2 bg-gray-50 dark:bg-neutral-900 min-h-[40px]">
              {pengajuan.keterangan ? (
                pengajuan.keterangan
              ) : (
                <span className="italic text-gray-400">
                  Tidak ada keterangan
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
