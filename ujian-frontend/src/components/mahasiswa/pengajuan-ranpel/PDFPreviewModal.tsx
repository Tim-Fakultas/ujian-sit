"use client";
import { PDFDocument } from "@/components/PDFDocument";
import SuratPengajuanJudul from "./SuratPengajuanJudul";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
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
  const [showDetails, setShowDetails] = React.useState(true);
  const suratRef = useRef<HTMLDivElement>(null);

  // Fungsi untuk print surat
  const handlePrint = async () => {
    if (!suratRef.current) return;

    try {
      // Import secara dinamis untuk menghindari error SSR
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const canvas = await html2canvas(suratRef.current, {
        scale: 2, // Meningkatkan kualitas
        useCORS: true, // Mengizinkan gambar dari sumber eksternal
        logging: false,
        windowWidth: 794, // Format A4 width in pixels at 96 DPI
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Menyesuaikan rasio aspek
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("Surat Pengajuan Judul dan Pembimbing Skripsi.pdf");

      // Notify user or optional success handling
    } catch (error) {
      console.error("Gagal mengunduh PDF:", error);
    }
  };

  if (!isOpen) return null;

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
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current stroke-2"
              >
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
              className={`p-2 rounded-full transition-colors hidden md:block ${
                showDetails
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30"
                  : "hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500"
              }`}
              title={
                showDetails
                  ? "Sembunyikan Panel Kanan"
                  : "Tampilkan Panel Kanan"
              }
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current stroke-2"
              >
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
          <div
            className={`
             fixed bottom-0 left-0 right-0 z-30 flex flex-col bg-white dark:bg-[#1f1f1f]
             md:static md:w-96 md:flex-shrink-0 md:border-l md:dark:border-neutral-800 md:z-20 md:shadow-[-5px_0_15px_-3px_rgba(0,0,0,0.05)]
             transition-all duration-300 ease-in-out
             ${showDetails ? "md:flex" : "md:hidden"}
             ${showDetails ? "h-[60vh]" : "h-16"} md:h-auto
             rounded-t-2xl md:rounded-none shadow-[0_-5px_15px_-3px_rgba(0,0,0,0.1)] md:shadow-none overflow-hidden
          `}
          >
            {/* Mobile Mobile Toggle Header */}
            <div
              className="flex md:hidden items-center justify-between px-6 h-16 border-b dark:border-neutral-800 cursor-pointer bg-white dark:bg-[#1f1f1f] hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors z-40 relative"
              onClick={() => setShowDetails(!showDetails)}
            >
              {/* Pull Handle for extra affordance */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>

              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse box-content border-2 border-blue-100 dark:border-blue-900/30"></div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">
                  Status Dokumen
                </h3>
              </div>
              <button className="p-2 mt-2 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-500 transition-transform">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-300 ${
                    showDetails ? "rotate-180" : ""
                  }`}
                >
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
              {/* Section: Status Details - Modified for desktop/mobile consistency */}
              <div className="space-y-4">
                {/* Title hidden on mobile since it's in the toggler */}
                <h3 className="hidden md:flex text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Status Dokumen
                </h3>

                <div className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-4 space-y-3 border border-gray-100 dark:border-neutral-800">
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">
                      Status Pengajuan
                    </span>
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide
                            ${
                              pengajuan.status === "diterima"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : pengajuan.status === "ditolak"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }
                         `}
                    >
                      {pengajuan.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">
                      Tanggal Pengajuan
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      {new Date(pengajuan.tanggalPengajuan).toLocaleDateString(
                        "id-ID",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>

                {/* Keterangan */}
                <div>
                  <span className="text-xs font-semibold text-gray-500 mb-2 block">
                    Keterangan / Catatan
                  </span>
                  <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20 text-sm text-gray-700 dark:text-blue-100 leading-relaxed min-h-[60px]">
                    {pengajuan.keterangan || (
                      <span className="text-gray-400 italic">
                        Tidak ada catatan khusus.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full border-b dark:border-neutral-800 my-4"></div>

              {/* Section: Pembimbing */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  Dosen Pembimbing
                </h3>

                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
                      1
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">
                        Pembimbing Utama
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {pengajuan.mahasiswa?.pembimbing1?.nama || (
                          <span className="text-gray-400 font-normal italic">
                            Belum ditentukan
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
                      2
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">
                        Pembimbing Pendamping
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {pengajuan.mahasiswa?.pembimbing2?.nama || (
                          <span className="text-gray-400 font-normal italic">
                            Belum ditentukan
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Print Button moved inside content */}
                <div className="pt-4">
                  <Button
                    disabled={!pengajuan.mahasiswa?.pembimbing1}
                    title={
                      !pengajuan.mahasiswa?.pembimbing1
                        ? "Belum ada pembimbing"
                        : "Cetak Surat"
                    }
                    onClick={handlePrint}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white h-10 md:h-12 rounded-xl text-sm font-medium shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
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
                      <polyline points="6 9 6 2 18 2 18 9"></polyline>
                      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                      <rect x="6" y="14" width="12" height="8"></rect>
                    </svg>
                    Cetak
                  </Button>

                  {/* Hidden Template for Print - Positioned off-screen but visible for html2canvas */}
                  <div
                    style={{
                      position: "absolute",
                      top: -10000,
                      left: -10000,
                      width: "794px",
                    }}
                  >
                    <div ref={suratRef}>
                      <SuratPengajuanJudul pengajuan={pengajuan} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
