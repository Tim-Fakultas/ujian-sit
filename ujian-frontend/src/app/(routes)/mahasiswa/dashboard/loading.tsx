import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-6 space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
            <Skeleton className="h-8 w-64 rounded-xl" />
            <Skeleton className="h-4 w-48 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-48 rounded-full" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[1, 2, 3].map((i) => (
             <div key={i} className="h-48 rounded-2xl bg-white dark:bg-neutral-900 border dark:border-neutral-800 p-6 flex flex-col justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                </div>
                <Skeleton className="h-10 w-full rounded-xl" />
             </div>
         ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="space-y-4">
         <Skeleton className="h-6 w-32 rounded-lg" />
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-white dark:bg-neutral-900 border dark:border-neutral-800 p-5 flex flex-col items-center justify-center gap-3 shadow-sm">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                </div>
            ))}
         </div>
      </div>
    </div>
  );
}
