import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminUjianTableSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Table Header Skeleton */}
          <div className="flex gap-4 border-b pb-4">
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 flex-1" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-32" />
          </div>

          {/* Table Rows Skeleton */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 py-4 border-b last:border-0">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-8 w-32" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
