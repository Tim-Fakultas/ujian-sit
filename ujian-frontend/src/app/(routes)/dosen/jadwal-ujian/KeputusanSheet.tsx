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
  return (
    <>
      {/* Sheet Keputusan (Lulus / Tidak Lulus) */}
      <Sheet
        open={openKeputusan && selected?.id === ujian.id}
        onOpenChange={(v) => {
          if (!v) setOpenKeputusan(false);
        }}
      >
        <SheetContent side="right" className="w-[420px]">
          <SheetHeader>
            <SheetTitle>Set Keputusan</SheetTitle>
            <SheetDescription>
              Pilih keputusan untuk ujian ini.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 py-2">
            <div className="flex flex-col gap-3 mt-3">
              {keputusanOptions.map((opt) => (
                <label key={opt.id} className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="keputusan"
                    checked={keputusanChoice === opt.id}
                    onChange={() => setKeputusanChoice(opt.id)}
                  />

                  <div className="text-sm text-muted-foreground">
                    {opt.label}
                  </div>
                </label>
              ))}
            </div>
          </div>
          <SheetFooter>
            <Button
              onClick={() => {
                if (selected && keputusanChoice !== null) {
                  handleSetKeputusan(selected.id, keputusanChoice);
                }
                setOpenKeputusan(false);
              }}
              disabled={keputusanChoice === null}
            >
              Simpan
            </Button>
            <SheetClose asChild>
              <Button variant="outline">Batal</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
