import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-6 space-y-8">
      {/* Header Skeleton */}
      <div className="flex bg-white dark:bg-neutral-900 border dark:border-neutral-800 p-6 rounded-2xl shadow-sm items-start gap-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
      </div>

      {/* Content Skeleton */}
      <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-6">
         {/* Filter Bar */}
         <div className="flex justify-between">
            <Skeleton className="h-10 w-48 rounded-xl" />
            <div className="flex gap-2">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-10 w-24 rounded-xl" />
            </div>
         </div>
         
         {/* Table Rows */}
         <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4 items-center p-4 border rounded-xl">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-8 w-24 ml-auto rounded-lg" />
                </div>
            ))}
         </div>
      </div>
    </div>
  );
}
