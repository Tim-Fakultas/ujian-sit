import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Ujian } from "@/types/Ujian";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  IconNotebook, 
  IconUser, 
  IconBook, 
  IconDeviceFloppy 
} from "@tabler/icons-react";

export default function CatatanSheet({
  openCatatan,
  setOpenCatatan,
  selected,
  ujian,
  catatanText,
  setCatatanText,
  handleSaveCatatan,
}: {
  openCatatan: boolean;
  setOpenCatatan: (v: boolean) => void;
  selected: Ujian | null;
  ujian: Ujian;
  catatanText: string;
  setCatatanText: (v: string) => void;
  handleSaveCatatan: () => void;
}) {
  const initials = ujian?.mahasiswa?.nama
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sheet
      open={openCatatan && selected?.id === ujian.id}
      onOpenChange={(v) => {
        if (!v) setOpenCatatan(false);
      }}
    >
      <SheetContent 
        side="right" 
        className="w-full sm:w-[480px] p-0 flex flex-col gap-0 dark:bg-neutral-900 border-l border-border/40"
      >
        {/* Header */}
        <SheetHeader className="p-6 pb-2 space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <IconNotebook size={22} stroke={2} />
            </div>
            <div>
              <SheetTitle className="text-xl font-bold text-foreground">
                Catatan Ujian
              </SheetTitle>
              <SheetDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Berikan evaluasi atau revisi untuk mahasiswa.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Separator />

        {/* Content Wrapper */}
          <div className="p-6 space-y-6 overflow-y-auto">
            
            {/* Student Info Card */}
            <div className="p-4 rounded-xl border border-border/50 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 border border-border/50">
                  <AvatarFallback className="bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold text-foreground leading-none">
                    {ujian?.mahasiswa?.nama}
                  </h4>
                  <p className="text-xs text-muted-foreground font-mono">
                    {ujian?.mahasiswa?.nim}  
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <IconBook size={14} className="mt-0.5 shrink-0" />
                  <span className="leading-relaxed line-clamp-2">
                    {ujian?.judulPenelitian}
                  </span>
                </div>
              </div>
            </div>

            {/* Input Form */}
            <div className="space-y-3">
              <Label 
                htmlFor="catatan" 
                className="text-sm font-medium text-foreground flex items-center gap-2"
              >
                Isi Catatan
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-normal">
                  Wajib Diisi
                </span>
              </Label>
              <Textarea
                id="catatan"
                value={catatanText}
                onChange={(e) => setCatatanText(e.target.value)}
                placeholder="Tuliskan catatan revisi, saran, atau masukan untuk mahasiswa disini..."
                className="min-h-[250px] resize-none text-sm p-4 rounded-xl border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500/20 bg-white dark:bg-black/20"
              />
              <p className="text-[11px] text-muted-foreground">
                *Catatan ini akan dapat dilihat oleh mahasiswa yang bersangkutan.
              </p>
            </div>
          </div>

        <Separator />

        {/* Footer */}
        <SheetFooter className="p-6 pt-4 bg-slate-50/30 dark:bg-slate-900/10">
          <div className="flex w-full gap-3">
            <SheetClose asChild>
              <Button
                variant="outline" 
                className="flex-1 h-11 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Batal
              </Button>
            </SheetClose>
            <Button 
              onClick={handleSaveCatatan}
              className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]"
            >
              <IconDeviceFloppy size={18} className="mr-2" />
              Simpan Catatan
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
