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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Card 1 Skeleton */}
         <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-4">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="h-24 w-full rounded-xl" />
         </div>

         {/* Card 2 Skeleton */}
         <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-2xl p-6 shadow-sm space-y-4">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <div className="space-y-4">
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
         </div>
      </div>
    </div>
  );
}
