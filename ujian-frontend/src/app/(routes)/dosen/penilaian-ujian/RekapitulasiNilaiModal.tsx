/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { getNilaiHuruf } from "@/lib/ujian/constants";
import { Ujian } from "@/types/Ujian";
import { IconClipboardList, IconX, IconCalendar, IconUser, IconHash, IconAward } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export default function RekapitulasiNilaiModal({
  dispatchModal,
  ujian,
  rekapPenilaian,
  rekapLoading,
}: {
  dispatchModal: React.Dispatch<any>;
  ujian: Ujian;
  rekapPenilaian: any[];
  rekapLoading: boolean;
}) {

  
  const totalNilai = rekapPenilaian.reduce((sum, d) => sum + d.total, 0);
  const rataRata = rekapPenilaian.length > 0 ? totalNilai / rekapPenilaian.length : 0;
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => dispatchModal({ type: "CLOSE_REKAP" })}
    >
      <div
        className="relative w-full max-w-2xl mx-4 bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 slide-in-from-bottom-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modern Header */}
        <div className="relative bg-gradient-to-b from-gray-50/80 to-white dark:from-neutral-800/80 dark:to-neutral-900 p-6 border-b border-gray-100 dark:border-neutral-800 shrink-0">
          <div className="absolute top-4 right-4">
            <button
              onClick={() => dispatchModal({ type: "CLOSE_REKAP" })}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors text-gray-500 dark:text-gray-400"
            >
              <IconX size={18} />
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 shadow-sm">
                <IconClipboardList size={24} stroke={2} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Detail nilai penguji
                </h3>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {ujian.jenisUjian?.namaJenis}
                </span>
              </div>
            </div>

             <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-neutral-800/50 p-3 rounded-xl border border-gray-100 dark:border-neutral-800/50">
                <div className="flex items-center gap-2">
                    <IconCalendar size={16} className="text-gray-400" />
                    <span className="font-medium">
                        {ujian.hariUjian ?? "-"}, {ujian.jadwalUjian?.split(/[ T]/)[0] ?? "-"}
                    </span>
                </div>
                <div className="h-4 w-px bg-gray-200 dark:bg-neutral-700" />
                <div className="flex items-center gap-2">
                    <IconUser size={16} className="text-gray-400" />
                    <span className="font-medium">{ujian.mahasiswa?.nama ?? "-"} ({ujian.mahasiswa?.nim ?? "-"})</span>
                </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto bg-gray-50/30 dark:bg-neutral-900/50 flex-1">
          <div className="mb-6">
             <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-1">
                  Judul Penelitian
             </div>
             <div className="p-4 bg-white dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700 text-sm font-medium text-gray-900 dark:text-gray-200 shadow-sm">
                {ujian.judulPenelitian ?? "Judul tidak tersedia"}
             </div>
          </div>

          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-1">
              Rincian Penilaian
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50/50 dark:bg-neutral-800 border-b border-gray-100 dark:border-neutral-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 w-12 text-center">No</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Nama Penguji</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">Jabatan</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 text-right">Nilai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                  {rekapLoading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        <span className="animate-pulse">Memuat data penilaian...</span>
                      </td>
                    </tr>
                  ) : (!ujian.penguji || ujian.penguji.length === 0) ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        Data penguji tidak ditemukan.
                      </td>
                    </tr>
                  ) : (
                    (() => {
                        const roleOrder = ["ketua_penguji", "sekretaris_penguji", "penguji_1", "penguji_2"];
                        // Create a clean sorted copy of penguji
                        const sortedPenguji = [...ujian.penguji].sort((a, b) => roleOrder.indexOf(a.peran) - roleOrder.indexOf(b.peran));
                        
                        return sortedPenguji.map((p, i) => {
                            const gradeData = rekapPenilaian.find((r) => r.dosen?.id === p.id);
                            
                            let labelRole = "-";
                             switch (p.peran) {
                                case "ketua_penguji": labelRole = "Ketua Penguji"; break;
                                case "sekretaris_penguji": labelRole = "Sekretaris Penguji"; break;
                                case "penguji_1": labelRole = "Penguji I"; break;
                                case "penguji_2": labelRole = "Penguji II"; break;
                                default: labelRole = p.peran;
                             }

                            return (
                              <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                                <td className="px-4 py-3 text-center text-gray-500">{i + 1}</td>
                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-200">
                                    {p.nama ?? "-"}
                                </td>
                                <td className="px-4 py-3 text-gray-500">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded text-xs font-medium border",
                                        labelRole === "Ketua Penguji" ? "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-800" :
                                        labelRole === "Sekretaris Penguji" ? "bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-500/10 dark:text-pink-300 dark:border-pink-800" :
                                        "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700"
                                    )}>
                                        {labelRole}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                                  {gradeData ? gradeData.total.toFixed(2) : <span className="text-gray-400 italic font-normal text-xs">Belum menilai</span>}
                                </td>
                              </tr>
                            );
                        });
                    })()
                  )}
                </tbody>
            </table>
          </div>

          {/* Summary Section */}
           {rekapPenilaian.length > 0 && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-gray-100 dark:border-neutral-700 flex flex-col items-center justify-center text-center shadow-sm">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Nilai</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                           <IconHash size={20} className="text-blue-500" />
                          {totalNilai.toFixed(2)}
                      </div>
                  </div>
                  <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-gray-100 dark:border-neutral-700 flex flex-col items-center justify-center text-center shadow-sm">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Rata-rata</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {rataRata.toFixed(2)}
                      </div>
                  </div>
                   <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 p-4 rounded-2xl border border-blue-500 dark:border-blue-800 flex flex-col items-center justify-center text-center shadow-md shadow-blue-500/20">
                      <div className="text-xs font-semibold text-blue-100 uppercase tracking-wider mb-1">Nilai Huruf</div>
                      <div className="text-3xl font-extrabold text-white flex items-center gap-2">
                          <IconAward size={28} className="text-yellow-300" />
                          {getNilaiHuruf(rataRata)}
                      </div>
                  </div>
              </div>
           )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-white dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800 flex justify-end shrink-0">
          <Button
            variant="ghost"
            onClick={() => dispatchModal({ type: "CLOSE_REKAP" })}
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
