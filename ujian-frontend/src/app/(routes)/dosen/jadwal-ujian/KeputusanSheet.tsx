import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  // Cek apakah keputusan sudah pernah di-set sebelumnya
  const keputusanSudahAda =
    !!ujian.keputusan && typeof ujian.keputusan.id === "number";

  return (
    <>
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
            {keputusanSudahAda ? (
              <div className="mt-4 mb-4">
                <div className="text-sm text-muted-foreground mb-2">
                  Keputusan sudah ditetapkan:
                </div>
                <div className="font-semibold text-base">
                  {ujian.keputusan?.namaKeputusan}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mt-3">
                {keputusanOptions.map((opt) => (
                  <Label
                    key={opt.id}
                    className="inline-flex items-center gap-2"
                  >
                    <input
                      type="radio"
                      name="keputusan"
                      checked={keputusanChoice === opt.id}
                      onChange={() => setKeputusanChoice(opt.id)}
                      disabled={keputusanSudahAda}
                    />
                    <div className="text-sm text-muted-foreground">
                      {opt.label}
                    </div>
                  </Label>
                ))}
              </div>
            )}
            {keputusanSudahAda && (
              <div className="mt-4 text-xs text-amber-500">
                Keputusan sudah pernah di-set dan tidak dapat diubah lagi.
              </div>
            )}
          </div>
          <SheetFooter>
            <Button
              onClick={() => {
                if (selected && keputusanChoice !== null) {
                  handleSetKeputusan(selected.id, keputusanChoice);
                }
                setOpenKeputusan(false);
              }}
              disabled={keputusanChoice === null || keputusanSudahAda}
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
