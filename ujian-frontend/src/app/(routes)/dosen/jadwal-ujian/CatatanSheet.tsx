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

  

  return (
    <>
      <Sheet
        open={openCatatan && selected?.id === ujian.id}
        onOpenChange={(v) => {
          if (!v) setOpenCatatan(false);
        }}
      >
        <SheetContent side="right" className="w-[420px] dark:bg-neutral-900">
          <SheetHeader>
            <SheetTitle>Tambahkan Catatan</SheetTitle>
            <SheetDescription>
              Tambahkan catatan tambahan untuk ujian ini jika diperlukan.
            </SheetDescription>
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min gap-2 px-4">
            <div className="grid gap-3">
              <Label htmlFor="catatan">Catatan</Label>
              <Textarea
                id="catatan"
                value={catatanText}
                onChange={(e) => setCatatanText(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>
          <SheetFooter>
            <Button onClick={handleSaveCatatan}>Save</Button>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
