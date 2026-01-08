import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import React from "react";

// interface PDFDocumentProps
interface PDFDocumentProps {
  pengajuan: PengajuanRanpel;
  id?: string;
}

export const PDFDocument: React.FC<PDFDocumentProps> = ({
  pengajuan,
  id = "pdf-content",
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-4 md:p-8">
      {/* Header Modern */}
      <div className="text-center space-y-3 pb-6 border-b dark:border-neutral-800">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
          {pengajuan?.ranpel?.judulPenelitian}
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-2 text-sm md:text-base text-muted-foreground">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {pengajuan?.mahasiswa.nama}
          </span>
          <span className="hidden sm:inline">•</span>
          <span>{pengajuan?.mahasiswa?.nim}</span>
          <span className="hidden sm:inline">•</span>
          <span className="uppercase text-xs tracking-wide bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
            {pengajuan?.mahasiswa?.prodi?.nama ?? "Informatika"}
          </span>
        </div>
      </div>

      {/* Content Modern Cards */}
      <div className="space-y-6">
        {[
          {
            title: "Latar Belakang & Masalah",
            content: pengajuan?.ranpel?.masalahDanPenyebab,
            color: "border-l-blue-500",
          },
          {
            title: "Alternatif Solusi",
            content: pengajuan?.ranpel?.alternatifSolusi,
            color: "border-l-indigo-500",
          },
          {
            title: "Hasil yang Diharapkan",
            content: pengajuan?.ranpel?.hasilYangDiharapkan,
            color: "border-l-emerald-500",
          },
          {
            title: "Kebutuhan Data",
            content: pengajuan?.ranpel?.kebutuhanData,
            color: "border-l-orange-500",
          },
          {
            title: "Metode Pelaksanaan",
            content: pengajuan?.ranpel?.metodePenelitian,
            color: "border-l-purple-500",
          },
          {
            title: "Jurnal Referensi",
            content: pengajuan?.ranpel?.jurnalReferensi,
            color: "border-l-rose-500",
          },
        ].map((section, idx) => (
          <div
            key={idx}
            className={`bg-white dark:bg-neutral-900 rounded-lg p-5 border shadow-sm ${section.color} border-l-4`}
          >
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              {section.title}
            </h3>
            <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
              {section.content || (
                <span className="text-gray-400 italic text-sm">
                  - Belum diisi -
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
