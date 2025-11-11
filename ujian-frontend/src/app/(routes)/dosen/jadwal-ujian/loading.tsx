// app/(sekprodi)/pendaftaran-ujian/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function JadwalUjianDosenLoading() {
  return (
    <div className="p-6">
      <Skeleton className="h-8 w-48 mb-4" />
      <div className="border rounded-md bg-white">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-2 p-4 border-b last:border-b-0">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-10 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
