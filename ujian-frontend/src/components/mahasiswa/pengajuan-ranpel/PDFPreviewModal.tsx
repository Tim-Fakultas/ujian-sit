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
        <div className="flex-1 overflow-auto p-4 bg-white dark:bg-[#1f1f1f]">
          <div className="bg-white shadow-lg dark:bg-[#1f1f1f]">
            <PDFDocument pengajuan={pengajuan} />
          </div>
        </div>
      </div>
    </div>
  );
}
