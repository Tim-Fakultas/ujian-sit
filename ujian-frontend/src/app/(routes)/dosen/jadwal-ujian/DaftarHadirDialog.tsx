import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Ujian } from "@/types/Ujian";
import { 
  IconCalendar, 
  IconMapPin, 
  IconCheck, 
  IconUser,
  IconClipboardList,
  IconClock
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

  const formatTanggal = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
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
    <Dialog open={openDaftarHadir} onOpenChange={setOpenDaftarHadir}>
      <DialogContent className="sm:max-w-[500px] h-[90vh] p-0 overflow-hidden gap-0 dark:bg-neutral-900 border-none shadow-2xl">
        {/* Header Section */}
        <div className="bg-slate-50/50 dark:bg-neutral-800/50 p-6 border-b border-border/40">
          <DialogHeader className="gap-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-blue-100 dark:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400">
                <IconClipboardList size={22} stroke={2} />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight">Daftar Hadir Ujian</DialogTitle>
                <DialogDescription className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-0.5">
                  {ujian?.jenisUjian?.namaJenis}
                </DialogDescription>
              </div>
            </div>
            
            {/* Exam Details Summary */}
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground bg-white dark:bg-neutral-900/50 p-3 rounded-lg border border-border/50 shadow-sm">
              <div className="flex items-center gap-2">
                <IconCalendar size={16} className="text-slate-400" />
                <span>{formatTanggal(ujian?.jadwalUjian)}</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <IconMapPin size={16} className="text-slate-400" />
                <span>{ujian?.ruangan?.namaRuangan || "-"}</span>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* List Content */}
        <ScrollArea className="max-h-[60vh] overflow-y-auto">
          <div className="p-6 space-y-4">
            {getPengujiList(ujian).map((penguji) => {
              const hadir = sudahHadir(ujian.id, penguji.id);
              const isCurrent = Number(penguji.id) === Number(currentDosenId);
              const initials = penguji.nama
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "?";

              return (
                <div
                  key={penguji.id}
                  className={cn(
                    "group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border transition-all",
                    isCurrent 
                      ? "bg-blue-50/50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-800/30 ring-1 ring-blue-100 dark:ring-blue-900/20" 
                      : "bg-white dark:bg-neutral-900 border-border/60 hover:border-border"
                  )}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar className="h-10 w-10 border border-border/50 shrink-0">
                      <AvatarFallback className={cn(
                        "font-semibold text-xs",
                        isCurrent ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      )}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-sm leading-none">
                          {penguji.nama || "-"}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded">
                            Anda
                          </span>
                        )}
                      </div>
                      <Badge variant="outline" className={cn("text-[10px] px-2 py-0 h-5 font-medium border", getRoleBadgeColor(penguji.label))}>
                        {penguji.label}
                      </Badge>
                    </div>
                  </div>

                  <div className="sm:self-center pt-2 sm:pt-0 pl-12 sm:pl-0">
                    {isCurrent ? (
                      <Button
                        size="sm"
                        onClick={() => handleHadir(currentDosenId!, ujian.id)}
                        disabled={hadirLoading === ujian.id || hadir}
                        className={cn(
                          "w-full sm:w-auto h-9 font-medium shadow-sm transition-all",
                          hadir 
                            ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-500/20 dark:text-green-300 border border-green-200 dark:border-green-800 cursor-default" 
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
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
                            Sudah Hadir
                          </>
                        ) : (
                          <>
                            <IconCheck size={16} className="mr-1.5" />
                            Konfirmasi Hadir
                          </>
                        )}
                      </Button>
                    ) : (
                      <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border",
                        hadir 
                          ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-800" 
                          : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700"
                      )}>
                        {hadir ? (
                           <>
                             <IconCheck size={14} />
                             <span>Hadir</span>
                           </>
                        ) : (
                          <>
                            <IconClock size={14} />
                            <span>Belum Hadir</span>
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
        
        <div className="p-4 bg-slate-50/50 dark:bg-neutral-800/50 border-t border-border/40 flex justify-end">
           <Button variant="outline" onClick={() => setOpenDaftarHadir(false)}>
             Tutup
           </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
