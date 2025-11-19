import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-6">
      <div className="mb-2">
        <Skeleton className="h-6 w-48 mb-2" /> {/* Judul */}
        <Skeleton className="h-4 w-96" /> {/* Deskripsi */}
      </div>
      <div className="flex gap-6 mt-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-5 w-64 flex flex-col gap-3 bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-[#1f1f1f]"
          >
            <Skeleton className="h-4 w-32 mb-2" /> {/* Label */}
            <Skeleton className="h-8 w-16" /> {/* Value */}
            <Skeleton className="h-5 w-5 mt-2" /> {/* Icon */}
          </div>
        ))}
      </div>
    </div>
  );
}
