/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";

import { getPengujiList } from "@/lib/ujian/helpers";
import { Ujian } from "@/types/Ujian";
import { Calendar, Clock, MapPin, X } from "lucide-react";

export default function DetailDialog({
  dispatchModal,
  ujian,
}: {
  dispatchModal: React.Dispatch<any>;
  ujian: Ujian;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      onKeyDown={(e) => {
        if (e.key === "Escape") dispatchModal({ type: "CLOSE_DETAIL" });
      }}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={() => dispatchModal({ type: "CLOSE_DETAIL" })}
      />
      <div
        className="relative z-10 w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-gray-100 dark:border-neutral-800 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 py-6 border-b border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {ujian.mahasiswa?.nama ?? "-"}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400 font-medium">
                <span className="bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-xs tracking-wide">
                  {ujian.mahasiswa?.nim ?? "-"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-blue-500" />
                  {ujian.jadwalUjian?.split(/[ T]/)[0] ?? "-"}
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 bg-gray-50 dark:bg-neutral-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-gray-900 dark:hover:text-white transition-all"
              onClick={() => dispatchModal({ type: "CLOSE_DETAIL" })}
              aria-label="Tutup detail"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-sm">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Judul */}
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-wider font-semibold text-gray-400 dark:text-neutral-500 mb-1">
                  Judul Penelitian
                </div>
                <div className="text-base font-medium text-gray-800 dark:text-gray-200 leading-relaxed max-w-prose">
                  {ujian?.judulPenelitian ?? "-"}
                </div>
              </div>

              {/* Jenis Ujian Badge */}
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-wider font-semibold text-gray-400 dark:text-neutral-500 mb-1">
                  Jenis Ujian
                </div>
                <div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide border ${
                      ujian.jenisUjian?.namaJenis?.toLowerCase().includes("proposal")
                        ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
                        : ujian.jenisUjian?.namaJenis?.toLowerCase().includes("hasil")
                        ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800"
                        : "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800"
                    }`}
                  >
                    {ujian.jenisUjian?.namaJenis ?? "-"}
                  </span>
                </div>
              </div>

              {/* Waktu & Ruangan */}
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-wider font-semibold text-gray-400 dark:text-neutral-500 mb-1">
                  Detail Pelaksanaan
                </div>
                <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-2xl p-4 space-y-3 border border-gray-100 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-neutral-800 flex items-center justify-center text-blue-500 shadow-sm border border-gray-100 dark:border-neutral-700">
                      <Calendar size={15} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">Tanggal</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {ujian.hariUjian ?? "-"}, {ujian.jadwalUjian?.split(/[ T]/)[0] ?? "-"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-neutral-800 flex items-center justify-center text-orange-500 shadow-sm border border-gray-100 dark:border-neutral-700">
                      <Clock size={15} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">Waktu</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                         {ujian.waktuMulai?.slice(0, 5) ?? "-"} - {ujian.waktuSelesai?.slice(0, 5) ?? "-"} WIB
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-neutral-800 flex items-center justify-center text-purple-500 shadow-sm border border-gray-100 dark:border-neutral-700">
                      <MapPin size={15} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400">Ruangan</div>
                      <div className="font-medium text-gray-900 dark:text-white capitalize">
                        {ujian.ruangan?.namaRuangan ?? "-"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Penguji */}
            <div className="space-y-4">
              <div className="text-xs uppercase tracking-wider font-semibold text-gray-400 dark:text-neutral-500 mb-1">
                Tim Penguji
              </div>
              <div className="space-y-3">
                {getPengujiList(ujian).map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="group relative flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-neutral-800"
                  >
                    <div className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                      p.label?.toLowerCase().includes("ketua") ? "bg-blue-500" :
                      p.label?.toLowerCase().includes("sekretaris") ? "bg-pink-500" :
                      "bg-gray-300 dark:bg-neutral-600"
                    }`} />
                    <div>
                      <div className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wide mb-0.5">
                        {p.label}
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white leading-snug">
                        {p.nama ?? <span className="text-gray-400 italic">Belum ditentukan</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer (Optional, currently just decorative spacing or we can add actions) */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-neutral-900/50 border-t border-gray-100 dark:border-neutral-800 flex justify-end">
             <Button 
                onClick={() => dispatchModal({ type: "CLOSE_DETAIL" })}
                className="bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-neutral-700 shadow-sm hover:bg-gray-50 dark:hover:bg-neutral-700"
             >
                Tutup
             </Button>
        </div>
      </div>
    </div>
  );
}
