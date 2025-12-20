import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Ujian } from "@/types/Ujian";
import {
  IconCalendar,
  IconMapPin,
  IconCheck,
  IconClipboardList,
  IconClock,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export default function DaftarHadirDialog({
  openDaftarHadir,
  setOpenDaftarHadir,
  ujian,
  getPengujiList,
  sudahHadir,
  handleHadir,
  hadirLoading,
  currentDosenId,
}: {
  openDaftarHadir: boolean;
  setOpenDaftarHadir: (open: boolean) => void;
  ujian: Ujian;
  getPengujiList: (ujian: Ujian) => {
    id: number;
    nama: string | null;
    nip: string | null;
    nidn: string | null;
    label: string;
  }[];
  sudahHadir: (ujianId: number, dosenId: number) => boolean;
  handleHadir: (dosenId: number, ujianId: number) => void;
  hadirLoading: number | null;
  currentDosenId: number | null;
}) {
  if (!openDaftarHadir) return null;

  const formatTanggal = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Ketua Penguji":
        return "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      case "Sekretaris Penguji":
        return "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300 border-pink-200 dark:border-pink-800";
      case "Penguji 1":
        return "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800";
      case "Penguji 2":
        return "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 border-orange-200 dark:border-orange-800";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60  animate-in fade-in duration-200"
      onClick={() => setOpenDaftarHadir(false)}
    >
      <div
        className="relative w-full max-w-xl mx-4 bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 slide-in-from-bottom-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modern Header */}
        <div className="relative bg-gradient-to-b from-gray-50/80 to-white dark:from-neutral-800/80 dark:to-neutral-900 p-6 border-b border-gray-100 dark:border-neutral-800 shrink-0">
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setOpenDaftarHadir(false)}
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
                  Absensi Kehadiran
                </h3>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {ujian?.jenisUjian?.namaJenis}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-neutral-800/50 p-3 rounded-xl border border-gray-100 dark:border-neutral-800/50">
              <div className="flex items-center gap-2">
                <IconCalendar size={16} className="text-gray-400" />
                <span className="font-medium">
                  {formatTanggal(ujian?.jadwalUjian)}
                </span>
              </div>
              <div className="h-4 w-px bg-gray-200 dark:bg-neutral-700" />
              <div className="flex items-center gap-2">
                <IconMapPin size={16} className="text-gray-400" />
                <span className="font-medium">
                  {ujian?.ruangan?.namaRuangan || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable List */}
        <ScrollArea className="flex-1 overflow-y-auto bg-gray-50/30 dark:bg-neutral-900/50">
          <div className="p-6 space-y-3">
            {getPengujiList(ujian).map((penguji) => {
              const hadir = sudahHadir(ujian.id, penguji.id);
              const isCurrent = Number(penguji.id) === Number(currentDosenId);
              const initials =
                penguji.nama
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "?";

              return (
                <div
                  key={penguji.id}
                  className={cn(
                    "group flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border transition-all duration-300",
                    isCurrent
                      ? "bg-white dark:bg-neutral-800 border-blue-200 dark:border-blue-900/50 shadow-lg shadow-blue-500/5 ring-1 ring-blue-100 dark:ring-blue-900/20"
                      : "bg-white dark:bg-neutral-900 border-gray-100 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-10 w-10 border-2 border-white dark:border-neutral-800 shadow-sm ring-1 ring-gray-100 dark:ring-neutral-700 shrink-0">
                      <AvatarFallback
                        className={cn(
                          "font-bold text-xs",
                          isCurrent
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-300"
                        )}
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">
                          {penguji.nama || "-"}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-lg uppercase tracking-wider">
                            Anda
                          </span>
                        )}
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] px-2 py-0 border h-5 font-semibold rounded-md",
                          getRoleBadgeColor(penguji.label)
                        )}
                      >
                        {penguji.label}
                      </Badge>
                    </div>
                  </div>

                  <div className="sm:self-center flex-shrink-0">
                    {isCurrent ? (
                      <Button
                        size="sm"
                        onClick={() => handleHadir(currentDosenId!, ujian.id)}
                        disabled={hadirLoading === ujian.id || hadir}
                        className={cn(
                          "w-full sm:w-auto h-9 font-semibold text-xs shadow-md rounded-xl transition-all",
                          hadir
                            ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-500/20 dark:text-green-300 border border-green-200 dark:border-green-900 cursor-default shadow-none"
                            : "bg-gray-900 hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        )}
                      >
                        {hadirLoading === ujian.id ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            Memproses...
                          </>
                        ) : hadir ? (
                          <>
                            <IconCheck size={16} className="mr-1.5" />
                            HADIR
                          </>
                        ) : (
                          <>
                            <IconCheck size={16} className="mr-1.5" />
                            Konfirmasi Hadir
                          </>
                        )}
                      </Button>
                    ) : (
                      <div
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border",
                          hadir
                            ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-900"
                            : "bg-gray-50 text-gray-400 border-gray-100 dark:bg-neutral-800 dark:text-gray-500 dark:border-neutral-800"
                        )}
                      >
                        {hadir ? (
                          <>
                            <IconCheck size={14} />
                            <span>HADIR</span>
                          </>
                        ) : (
                          <>
                            <IconClock size={14} />
                            <span>BELUM</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 bg-white dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800 flex justify-end shrink-0">
          <Button
            variant="ghost"
            onClick={() => setOpenDaftarHadir(false)}
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
