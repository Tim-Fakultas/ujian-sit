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
import { Ujian } from "@/types/Ujian";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IconGavel, IconBook, IconCheck, IconDeviceFloppy } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export default function KeputusanSheet({
  openKeputusan,
  setOpenKeputusan,
  selected,
  ujian,
  keputusanOptions,
  keputusanChoice,
  setKeputusanChoice,
  handleSetKeputusan,
}: {
  openKeputusan: boolean;
  setOpenKeputusan: (v: boolean) => void;
  selected: Ujian | null;
  ujian: Ujian;
  keputusanOptions: { id: number; label: string }[];
  keputusanChoice: number | null;
  setKeputusanChoice: (v: number) => void;
  handleSetKeputusan: (ujianId: number, keputusan: number) => void;
}) {
  // Cek apakah keputusan sudah pernah di-set sebelumnya
  const keputusanSudahAda =
    !!ujian.keputusan && typeof ujian.keputusan.id === "number";

  const initials = ujian?.mahasiswa?.nama
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sheet
      open={openKeputusan && selected?.id === ujian.id}
      onOpenChange={(v) => {
        if (!v) setOpenKeputusan(false);
      }}
    >
      <SheetContent
        side="right"
        className="w-full sm:w-[480px] p-0 flex flex-col gap-0 dark:bg-neutral-900 border-l border-border/40"
      >
        {/* Header */}
        <SheetHeader className="p-6 pb-2 space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <IconGavel size={22} stroke={2} />
            </div>
            <div>
              <SheetTitle className="text-xl font-bold text-foreground">
                Keputusan Ujian
              </SheetTitle>
              <SheetDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Tentukan hasil akhir kelulusan untuk mahasiswa ini.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Separator />

        {/* Content Wrapper */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Student Info Card */}
          <div className="p-4 rounded-xl border border-border/50 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10 border border-border/50">
                <AvatarFallback className="bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 font-semibold text-sm">
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

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              Pilih Keputusan
              {!keputusanSudahAda && (
                <span className="text-[10px] bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded font-normal">
                  Wajib Dipilih
                </span>
              )}
            </h3>

            {keputusanSudahAda ? (
              <div className="mt-2 p-4 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 flex flex-col items-center justify-center text-center gap-2">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400">
                  <IconCheck size={20} stroke={3} />
                </div>
                <div>
                  <div className="text-sm text-green-700 dark:text-green-300 font-medium">
                    Keputusan Telah Ditetapkan
                  </div>
                  <div className="text-lg font-bold text-green-800 dark:text-green-200 mt-1">
                    {ujian.keputusan?.namaKeputusan}
                  </div>
                </div>
                <div className="text-xs text-green-600/80 dark:text-green-400/80 mt-1">
                  Keputusan ini bersifat final dan tidak dapat diubah.
                </div>
              </div>
            ) : (
              <div className="grid gap-3">
                {keputusanOptions.map((opt) => {
                  const isSelected = keputusanChoice === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={cn(
                        "relative flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50",
                        isSelected
                          ? "border-blue-600 bg-blue-50/50 dark:bg-blue-500/10 dark:border-blue-500"
                          : "border-border bg-white dark:bg-transparent"
                      )}
                    >
                      <input
                        type="radio"
                        name="keputusan"
                        className="peer sr-only"
                        checked={isSelected}
                        onChange={() => setKeputusanChoice(opt.id)}
                        disabled={keputusanSudahAda}
                      />
                      <div className={cn(
                        "mt-0.5 h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background flex items-center justify-center",
                        isSelected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 dark:border-slate-600"
                      )}>
                        {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>
                      <div className="space-y-1">
                        <div className={cn("text-sm font-medium leading-none", isSelected ? "text-blue-700 dark:text-blue-300" : "text-foreground")}>
                          {opt.label}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <Separator />

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
            {!keputusanSudahAda && (
              <Button
                onClick={() => {
                  if (selected && keputusanChoice !== null) {
                    handleSetKeputusan(selected.id, keputusanChoice);
                  }
                  setOpenKeputusan(false);
                }}
                disabled={keputusanChoice === null}
                className="flex-1 h-11 rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20 transition-all active:scale-[0.98]"
              >
                <IconDeviceFloppy size={18} className="mr-2" />
                Simpan Keputusan
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
