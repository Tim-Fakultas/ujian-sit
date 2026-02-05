/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getNilaiHuruf } from "@/lib/ujian/constants";
import { Ujian } from "@/types/Ujian";
import { showToast } from "@/components/ui/custom-toast";
import { IconClipboardList, IconX, IconCalendar, IconUser, IconHash, IconAward, IconChevronDown, IconChevronUp, IconPencil, IconCheck, IconLoader } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function PengujiRow({ p, i, gradeData, labelRole, isAuthorized, canEdit, onUpdate }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Local state for editing values: record<detail_id, value>
  const [values, setValues] = useState<Record<number, string | number>>({});

  const hasDetails = gradeData?.details && gradeData.details.length > 0;
  const canExpand = (isAuthorized && hasDetails) || (canEdit && hasDetails);

  // Initialize values when opening edit mode
  useEffect(() => {
    if (gradeData?.details) {
      const init: Record<number, string | number> = {};
      gradeData.details.forEach((d: any) => {
        if (d.id) init[d.id] = d.nilai;
      });
      setValues(init);
    }
  }, [gradeData]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updates = Object.entries(values).map(([id, val]) => {
        // Convert string input to number, default to 0 if empty/invalid
        let numVal = typeof val === 'string' ? parseFloat(val) : val;
        if (isNaN(numVal)) numVal = 0;
        return {
          id: parseInt(id),
          nilai: numVal,
        };
      });
      await onUpdate(updates);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Re-calculate total based on weight if needed, but simple sum for now if weights are handled elsewhere. 
  // Wait, standard total is weighted sum.
  // We need weights to calc dynamic total preview.
  const calculateDynamicTotal = () => {
    if (!gradeData?.details) return 0;
    return gradeData.details.reduce((sum: number, d: any) => {
      const rawVal = values[d.id] !== undefined ? values[d.id] : d.nilai;
      const val = typeof rawVal === 'string' ? (parseFloat(rawVal) || 0) : rawVal;
      return sum + (val * d.bobot) / 100;
    }, 0);
  }

  const displayTotal = isEditing ? calculateDynamicTotal().toFixed(2) : (gradeData ? gradeData.total.toFixed(2) : <span className="text-gray-400 italic font-normal text-xs">Belum menilai</span>);

  return (
    <>
      <tr
        className={cn(
          "transition-colors",
          canExpand ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800/50" : ""
        )}
        onClick={() => {
          if (!isEditing && canExpand) setIsOpen(!isOpen)
        }}
      >
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
          <div className="flex items-center justify-end gap-2">
            <span>{displayTotal}</span>
            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
              {canEdit && hasDetails && !isEditing && (
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => { setIsEditing(true); setIsOpen(true); }}>
                  <IconPencil size={14} className="text-gray-500" />
                </Button>
              )}
              {canExpand && !isEditing && (
                <div className="text-gray-400 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                  {isOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                </div>
              )}
            </div>
          </div>
        </td>
      </tr>
      {isOpen && hasDetails && (
        <tr className="bg-gray-50/50 dark:bg-neutral-800/30">
          <td colSpan={4} className="px-4 py-3">
            <div className="ml-12 pl-4 border-l-2 border-gray-200 dark:border-neutral-700 space-y-2">
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Detail Kriteria Penilaian</div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} disabled={loading}>Batal</Button>
                    <Button size="sm" onClick={handleSave} disabled={loading}>
                      {loading ? <IconLoader className="animate-spin mr-1" size={14} /> : <IconCheck className="mr-1" size={14} />}
                      Simpan
                    </Button>
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                {gradeData.details.map((d: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-sm group">
                    <span className="text-gray-600 dark:text-gray-400 flex-1">{d.komponen} <span className="text-xs text-gray-400">({d.bobot}%)</span></span>
                    {isEditing ? (
                      <div className="w-24">
                        <Input
                          type="number"
                          step="any"
                          className="h-8 text-right font-medium"
                          value={values[d.id] ?? d.nilai}
                          onChange={(e) => {
                            // Allow empty string or any valid number input
                            setValues(prev => ({ ...prev, [d.id]: e.target.value }));
                          }}
                        />
                      </div>
                    ) : (
                      <span className="font-medium text-gray-900 dark:text-white tabular-nums">{d.nilai}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function RekapitulasiNilaiModal({
  dispatchModal,
  ujian,
  rekapPenilaian,
  rekapLoading,
  currentDosenId,
  onRefresh,
}: {
  dispatchModal: React.Dispatch<any>;
  ujian: Ujian;
  rekapPenilaian: any[];
  rekapLoading: boolean;
  currentDosenId?: number;
  onRefresh?: () => void;
}) {


  const totalNilai = rekapPenilaian.reduce((sum, d) => sum + d.total, 0);
  const rataRata = rekapPenilaian.length > 0 ? totalNilai / rekapPenilaian.length : 0;

  const [loading, setLoading] = useState(false);
  const [showConfirmFinalize, setShowConfirmFinalize] = useState(false);

  // Cek apakah user adalah Ketua Penguji
  const isKetuaPenguji = currentDosenId && ujian.penguji?.some(p =>
    p.id === Number(currentDosenId) && p.peran === 'ketua_penguji'
  );

  const isAuthorized = currentDosenId && ujian.penguji?.some(p =>
    p.id === Number(currentDosenId) &&
    (p.peran === 'ketua_penguji' || p.peran === 'sekretaris_penguji')
  );

  const isUjianSelesai = ujian.pendaftaranUjian?.status === 'selesai';

  const totalPenguji = ujian.penguji?.length || 0;
  const gradedPenguji = rekapPenilaian.length;
  const allPengujiGraded = gradedPenguji === totalPenguji;

  const handleUpdate = async (updates: { id: number, nilai: number }[]) => {
    if (updates.length === 0) return;
    try {
      const firstId = updates[0].id;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${apiUrl}/penilaian/${firstId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ data: updates })
      });

      if (!response.ok) throw new Error("Gagal update penilaian");

      showToast.success("Nilai berhasil diperbarui");
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error(error);
      showToast.error("Gagal menyimpan perubahan");
    }
  };

  const onConfirmFinalize = async () => {
    setShowConfirmFinalize(false);
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const pendaftaranId = ujian.pendaftaranUjian?.id;

      if (!pendaftaranId) throw new Error("ID Pendaftaran tidak ditemukan");

      const response = await fetch(`${apiUrl}/pendaftaran-ujian/${pendaftaranId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ status: 'selesai' })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Gagal finalisasi ujian");
      }

      showToast.success("Ujian berhasil difinalisasi");
      if (onRefresh) onRefresh();
      dispatchModal({ type: "CLOSE_REKAP" });
    } catch (error: any) {
      console.error(error);
      showToast.error(error.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

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
              <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-2xl text-primary dark:text-primary border border-primary/20 dark:border-primary/30 shadow-sm">
                <IconClipboardList size={24} stroke={2} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Detail nilai penguji
                </h3>
                <span className="flex items-center gap-2 text-sm font-medium text-primary dark:text-primary">
                  {ujian.jenisUjian?.namaJenis}
                  {isUjianSelesai && (
                    <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs px-2 py-0.5 rounded-full border border-green-200 dark:border-green-800">
                      Selesai
                    </span>
                  )}
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
                        <PengujiRow
                          key={p.id}
                          p={p}
                          i={i}
                          gradeData={gradeData}
                          labelRole={labelRole}
                          isAuthorized={isAuthorized}
                          canEdit={isKetuaPenguji && !isUjianSelesai}
                          onUpdate={handleUpdate}
                        />
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
                  <IconHash size={20} className="text-primary" />
                  {totalNilai.toFixed(2)}
                </div>
              </div>
              <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-gray-100 dark:border-neutral-700 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Rata-rata</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {rataRata.toFixed(2)}
                </div>
              </div>

              {(() => {
                const affectedExams = ["seminar proposal", "ujian hasil", "ujian skripsi"];
                const currentExamType = ujian.jenisUjian?.namaJenis?.toLowerCase() || "";
                const isExamRuleActive = affectedExams.some(t => currentExamType.includes(t));

                // Cek apakah ada nilai kriteria yang <= 60
                const hasScoreBelowThreshold = rekapPenilaian.some(r =>
                  r.details?.some((d: any) => d.nilai <= 60)
                );

                const forcedFail = isExamRuleActive && hasScoreBelowThreshold;
                const displayGrade = forcedFail ? "E" : getNilaiHuruf(rataRata);

                return (
                  <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center shadow-md ${forcedFail
                    ? "bg-red-600 border-red-700 shadow-red-500/20"
                    : "bg-gradient-to-br from-primary to-primary/90 dark:from-primary dark:to-primary/80 border-primary dark:border-primary shadow-primary/20"
                    }`}>
                    <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${forcedFail ? "text-red-100" : "text-primary-foreground"}`}>
                      Nilai Huruf
                    </div>
                    <div className="text-3xl font-extrabold text-white flex items-center gap-2">
                      <IconAward size={28} className={forcedFail ? "text-white" : "text-yellow-300"} />
                      {displayGrade}
                    </div>
                    {forcedFail && (
                      <div className="text-[10px] text-white/90 mt-1 font-medium bg-red-700/50 px-2 py-0.5 rounded-full">
                        Tidak Lulus (Kriteria ≤ 60)
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-white dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800 flex justify-end gap-3 shrink-0">
          {isKetuaPenguji && !isUjianSelesai && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0} className="inline-block">
                    <Button
                      onClick={() => setShowConfirmFinalize(true)}
                      disabled={loading || !allPengujiGraded}
                      className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? <IconLoader className="animate-spin mr-2" size={18} /> : <IconCheck className="mr-2" size={18} />}
                      Finalisasi Nilai
                    </Button>
                  </span>
                </TooltipTrigger>
                {!allPengujiGraded && (
                  <TooltipContent className="max-w-xs text-center bg-destructive ">
                    <p>Tidak dapat finalisasi. Masih ada penguji yang belum memberikan nilai ({gradedPenguji}/{totalPenguji}).</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )}

          <AlertDialog open={showConfirmFinalize} onOpenChange={setShowConfirmFinalize}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Finalisasi Nilai Ujian?</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menyelesaikan nilai ujian ini? Status ujian akan menjadi <strong>Selesai</strong> dan nilai tidak dapat diubah lagi.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={(e) => { e.preventDefault(); onConfirmFinalize(); }} disabled={loading} className="bg-green-600 hover:bg-green-700">
                  {loading ? <IconLoader className="animate-spin mr-2" size={16} /> : null}
                  Ya, Finalisasi
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

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
