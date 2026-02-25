import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onReset: () => void;
}

export function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="py-20 flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-300">
      <div className="p-4 rounded-full bg-slate-50 dark:bg-neutral-800 text-slate-400">
        <SearchX size={48} strokeWidth={1.5} />
      </div>
      <div className="text-center space-y-1">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Data Tidak Ditemukan
        </h3>
        <p className="text-sm text-muted-foreground max-w-[280px]">
          Maaf, tidak ada pengajuan yang sesuai dengan kriteria pencarian atau
          filter Anda.
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={onReset}
        className="rounded-full px-6 font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all border-slate-200 dark:border-neutral-800"
      >
        Reset Semua Filter
      </Button>
    </div>
  );
}
