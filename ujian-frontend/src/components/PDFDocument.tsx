import { PengajuanRanpel } from "@/types/RancanganPenelitian";
import React, { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CommentDrawer from "@/components/common/CommentDrawer";
import { useAuthStore } from "@/stores/useAuthStore";

// interface PDFDocumentProps
interface PDFDocumentProps {
  pengajuan: PengajuanRanpel;
  id?: string;
}

export const PDFDocument: React.FC<PDFDocumentProps> = ({
  pengajuan,
  id = "pdf-content",
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [activeSectionTitle, setActiveSectionTitle] = useState("");
  const { user } = useAuthStore();

  const handleOpenComments = (sectionId: string, title: string) => {
    setActiveSectionId(sectionId);
    setActiveSectionTitle(title);
  };

  const sections = [
    {
      id: "latar-belakang",
      title: "Latar Belakang & Masalah",
      content: pengajuan?.ranpel?.masalahDanPenyebab,
      color: "border-l-blue-500",
    },
    {
      id: "alternatif-solusi",
      title: "Alternatif Solusi",
      content: pengajuan?.ranpel?.alternatifSolusi,
      color: "border-l-indigo-500",
    },
    {
      id: "hasil-diharapkan",
      title: "Hasil yang Diharapkan",
      content: pengajuan?.ranpel?.hasilYangDiharapkan,
      color: "border-l-emerald-500",
    },
    {
      id: "kebutuhan-data",
      title: "Kebutuhan Data",
      content: pengajuan?.ranpel?.kebutuhanData,
      color: "border-l-orange-500",
    },
    {
      id: "metode",
      title: "Metode Pelaksanaan",
      content: pengajuan?.ranpel?.metodePenelitian,
      color: "border-l-purple-500",
    },
    {
      id: "referensi",
      title: "Jurnal Referensi",
      content: pengajuan?.ranpel?.jurnalReferensi,
      color: "border-l-rose-500",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-4 md:p-8">
      {/* Header Modern */}
      <div className="text-center space-y-3 pb-6 border-b dark:border-neutral-800">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
          {pengajuan?.perbaikanJudul?.judulBaru || pengajuan?.ranpel?.judulPenelitian}
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
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="group relative bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm mb-6 transition-all hover:shadow-md border border-transparent hover:border-gray-100 dark:hover:border-neutral-800"
          >
            <div className="flex justify-between items-start mb-4 border-b pb-2 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                {section.title}
              </h3>
              {/* Access Control: Only Dosen and Mahasiswa can see revision button */}
              {(user?.role === 'dosen' || user?.role === 'mahasiswa') && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full px-3 gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleOpenComments(section.id, section.title)}
                >
                  <MessageSquarePlus size={14} />
                  <span>Revisi</span>
                </Button>
              )}
            </div>

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

      <CommentDrawer
        isOpen={!!activeSectionId}
        onClose={() => setActiveSectionId(null)}
        proposalId={pengajuan?.id || 0}
        sectionId={activeSectionId || ""}
        sectionTitle={activeSectionTitle}
      />
    </div>
  );
};
