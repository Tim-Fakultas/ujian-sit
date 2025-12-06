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
    <div
      id={id}
      className="max-w-3xl mx-auto bg-transparent rounded-xl h-[70vh] overflow-y-auto p-6"
      style={{
        fontFamily: '"Inter", Arial, sans-serif',
        color: "#222",
      }}
    >
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-100 mb-1">
          {pengajuan?.ranpel?.judulPenelitian}
        </div>
        <div className="text-sm md:text-base text-gray-500 dark:text-gray-300">
          {pengajuan?.mahasiswa.nama} ({pengajuan?.mahasiswa?.nim})
        </div>
      </div>

      {/* Content - vertical layout */}
      <div className="space-y-6">
        {[
          {
            label: "1. Masalah dan Penyebab",
            value: pengajuan?.ranpel?.masalahDanPenyebab,
          },
          {
            label: "2. Alternatif Solusi",
            value: pengajuan?.ranpel?.alternatifSolusi,
          },
          {
            label: "3. Hasil yang Diharapkan",
            value: pengajuan?.ranpel?.hasilYangDiharapkan,
          },
          {
            label: "4. Kebutuhan Data",
            value: pengajuan?.ranpel?.kebutuhanData,
          },
          {
            label: "5. Metode Pelaksanaan",
            value: pengajuan?.ranpel?.metodePenelitian,
          },
        ].map((item, idx, arr) => (
          <div key={item.label}>
            <div className="flex flex-col gap-2 py-1">
              <span className="font-semibold text-gray-700 dark:text-gray-100 border-l-4 border-primary pl-3 mb-1">
                {item.label}
              </span>
              <div className="bg-gray-50 dark:bg-neutral-900 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 min-h-[48px] whitespace-pre-line">
                {item.value ? (
                  item.value
                ) : (
                  <span className="text-gray-400 dark:text-gray-500">-</span>
                )}
              </div>
            </div>
            {idx < arr.length - 1 && (
              <div className="border-b border-dashed border-gray-200 dark:border-gray-800 my-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
