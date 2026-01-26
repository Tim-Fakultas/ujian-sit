"use client";
import { PDFDocument } from "@/components/PDFDocument";
import React from "react";
import { Button } from "@/components/ui/button";
import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import { X } from "lucide-react";
import { pdf } from "@react-pdf/renderer";


import { getAllDosen } from "@/actions/data-master/dosen";
import SuratPengajuanJudulPDF from "./SuratPengajuanJudulPDF";
import RancanganPenelitianPDF from "./RancanganPenelitianPDF";

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

  const [isGeneratingRanpel, setIsGeneratingRanpel] = React.useState(false);
  const [isGeneratingSurat, setIsGeneratingSurat] = React.useState(false);
  const [kaprodi, setKaprodi] = React.useState<{ nama: string; nip: string } | undefined>(undefined);
  const [pembimbingDetails, setPembimbingDetails] = React.useState<{
    p1?: { nip?: string; nidn?: string };
    p2?: { nip?: string; nidn?: string };
  }>({});

  React.useEffect(() => {
    if (isOpen) {
      const fetchDosenData = async () => {
        try {
          const dosenList = await getAllDosen();

          // 1. Get Kaprodi
          const targetNipClean = "197508012009122001";
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const kaprodiObj = dosenList?.find((d: any) => d.nip && d.nip.replace(/\s/g, "") === targetNipClean);

          if (kaprodiObj) {
            setKaprodi({ nama: kaprodiObj.nama || "", nip: kaprodiObj.nip || "" });
          }

          // 2. Get Pembimbing Details
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const p1 = dosenList?.find((d: any) => d.id === pengajuan.mahasiswa.pembimbing1?.id || d.nama === pengajuan.mahasiswa.pembimbing1?.nama);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const p2 = dosenList?.find((d: any) => d.id === pengajuan.mahasiswa.pembimbing2?.id || d.nama === pengajuan.mahasiswa.pembimbing2?.nama);

          setPembimbingDetails({
            p1: p1 ? { nip: p1.nip || undefined, nidn: p1.nidn || undefined } : undefined,
            p2: p2 ? { nip: p2.nip || undefined, nidn: p2.nidn || undefined } : undefined,
          });

        } catch (error) {
          console.error("Failed to fetch dosen data:", error);
        }
      };

      fetchDosenData();
    }
  }, [isOpen, pengajuan]);

  // Fungsi untuk download PDF menggunakan react-pdf/renderer


  // Fungsi untuk download Rancangan Penelitian PDF
  const handleDownloadRanpel = async () => {
    setIsGeneratingRanpel(true);
    try {
      const blob = await pdf(<RancanganPenelitianPDF pengajuan={pengajuan} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Rancangan_Penelitian_${pengajuan.mahasiswa.nama}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gagal mengunduh PDF:", error);
      alert('Gagal membuat PDF. Silakan coba lagi.');
    } finally {
      setIsGeneratingRanpel(false);
    }
  };

  // Fungsi untuk download Surat Pengajuan Judul PDF
  const handleDownloadSurat = async () => {
    setIsGeneratingSurat(true);
    try {
      const blob = await pdf(<SuratPengajuanJudulPDF pengajuan={pengajuan} kaprodi={kaprodi} pembimbingDetails={pembimbingDetails} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Surat_Pengajuan_Judul_${pengajuan.mahasiswa.nama}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gagal mengunduh PDF:", error);
      alert('Gagal membuat PDF. Silakan coba lagi.');
    } finally {
      setIsGeneratingSurat(false);
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
              className={`p-2 rounded-full transition-colors hidden md:block ${showDetails
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
                  className={`transition-transform duration-300 ${showDetails ? "rotate-180" : ""
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
                    {/* Status Pengajuan */}
                    <span className="text-xs text-gray-500 block mb-1">
                      Status Pengajuan
                    </span>
                    {/* Status Pengajuan */}
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide
                            ${pengajuan.status === "diterima"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : pengajuan.status === "ditolak"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : pengajuan.status === "diverifikasi"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }
                         `}
                    >
                      {pengajuan.status}
                    </span>
                  </div>

                  <div>
                    {/* Tanggal Pengajuan */}
                    <span className="text-xs text-gray-500 block mb-1">
                      Tanggal Pengajuan
                    </span>
                    {/* Tanggal Pengajuan */}
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

                  {pengajuan.tanggalDiverifikasi && (
                    <div>
                      {/* Tanggal Diverifikasi */}
                      <span className="text-xs text-gray-500 block mb-1">
                        Tanggal Diverifikasi Dosen PA
                      </span>
                      {/* Tanggal Diverifikasi */}
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        {new Date(pengajuan.tanggalDiverifikasi).toLocaleDateString(
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
                  )}

                  {pengajuan.tanggalDiterima && (
                    <div>
                      {/* Tanggal Diterima */}
                      <span className="text-xs text-gray-500 block mb-1">
                        Tanggal Diterima Kaprodi
                      </span>
                      {/* Tanggal Diterima */}
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        {new Date(pengajuan.tanggalDiterima).toLocaleDateString(
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
                  )}


                </div>

                {/* Keterangan / Catatan Dosen */}
                {pengajuan.keterangan && (
                  <div>
                    <span className="text-xs font-semibold text-gray-500 mb-2 block">
                      Catatan Dosen PA
                    </span>
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20 text-sm text-gray-700 dark:text-blue-100 leading-relaxed min-h-[60px]">
                      {pengajuan.keterangan}
                    </div>
                  </div>
                )}

                {/* Catatan Kaprodi */}
                {pengajuan.catatanKaprodi && (
                  <div>
                    <span className="text-xs font-semibold text-gray-500 mb-2 block">
                      Catatan Kaprodi
                    </span>
                    <div className="bg-purple-50/50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-900/20 text-sm text-gray-700 dark:text-purple-100 leading-relaxed min-h-[60px]">
                      {pengajuan.catatanKaprodi}
                    </div>
                  </div>
                )}
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
                        Pembimbing 1
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
                        Pembimbing 2
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

                {/* Print Buttons */}
                <div className="pt-4 space-y-3">
                  <Button
                    disabled={isGeneratingRanpel}
                    title={isGeneratingRanpel ? "Sedang membuat PDF..." : "Download Rancangan Penelitian"}
                    onClick={handleDownloadRanpel}
                    className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white dark:border-neutral-700 h-10 md:h-12 rounded-xl text-sm font-medium shadow-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    {isGeneratingRanpel ? "Membuat PDF..." : "Download Rancangan Penelitian"}
                  </Button>

                  <Button
                    disabled={isGeneratingSurat}
                    title={isGeneratingSurat ? "Sedang membuat PDF..." : "Download Surat Pengajuan"}
                    onClick={handleDownloadSurat}
                    className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white dark:border-neutral-700 h-10 md:h-12 rounded-xl text-sm font-medium shadow-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    {isGeneratingSurat ? "Membuat PDF..." : "Download Surat Pengajuan Judul"}
                  </Button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
