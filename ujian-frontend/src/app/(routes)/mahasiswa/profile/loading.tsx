import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Card className="w-full max-w-full mx-auto p-6 animate-pulse">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar Skeleton */}
        <div className="flex-shrink-0">
          <Skeleton className="h-32 w-32 rounded-full" />
        </div>
        {/* Info Skeleton */}
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0">
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
          {/* Statistik Skeleton */}
          <div className="flex gap-8 mt-6">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
          {/* Info lain Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-6 text-sm">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>
    </Card>
  );
}
