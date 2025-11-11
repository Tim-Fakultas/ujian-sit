import { Spinner } from "@/components/ui/spinner";

export default function Loading({
  text = "Memuat data...",
}: { text?: string } = {}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <Spinner className="size-8 text-blue-400" />
      <div className="text-xs font-semibold text-neutral-700">{text}</div>
    </div>
  );
}
