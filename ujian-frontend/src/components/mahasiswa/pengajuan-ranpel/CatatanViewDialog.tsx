"use client";

import { MessageSquareText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface CatatanViewDialogProps {
  keterangan?: string | null;
  catatanKaprodi?: string | null;
}

function hasContent(value?: string | null): boolean {
  return !!value && value !== "-" && value.trim() !== "";
}

export default function CatatanViewDialog({
  keterangan,
  catatanKaprodi,
}: CatatanViewDialogProps) {
  const hasDosen = hasContent(keterangan);
  const hasKaprodi = hasContent(catatanKaprodi);

  if (!hasDosen && !hasKaprodi) {
    return <span className="text-muted-foreground text-sm">-</span>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-primary bg-primary/5 hover:bg-primary/10 hover:text-primary rounded-full"
        >
          <MessageSquareText size={15} />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="rounded-xl max-w-[90%] sm:max-w-lg max-h-[90vh] overflow-y-auto"
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Catatan</DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {hasDosen && (
            <div className="space-y-1.5">
              <h4 className="font-bold text-[10px] uppercase tracking-widest text-primary flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Dosen PA
              </h4>
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {keterangan}
              </div>
            </div>
          )}
          {hasKaprodi && (
            <div className="space-y-1.5">
              <h4 className="font-bold text-[10px] uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                Kaprodi
              </h4>
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {catatanKaprodi}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
