// app/(sekprodi)/pendaftaran-ujian/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function PendaftaranUjianLoading() {
  return (
    <div className="p-6">
      <Skeleton className="h-8 w-48 mb-4" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
