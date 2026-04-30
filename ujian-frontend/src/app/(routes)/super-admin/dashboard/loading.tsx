
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="p-6 md:p-10 flex flex-col gap-10 min-h-screen max-w-(--breakpoint-2xl) mx-auto">
      {/* Header Section */}
      <div className="space-y-4 py-8 px-8 bg-muted/20 rounded-2xl border border-muted/50">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-64 md:w-96" />
        <Skeleton className="h-6 w-48 md:w-80" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
             <Skeleton className="h-8 w-48" />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {Array.from({ length: 4 }).map((_, i) => (
                 <Card key={i} className="border-border/50">
                   <CardContent className="p-6 flex items-start justify-between">
                      <div className="space-y-4 flex-1">
                         <div className="space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-20" />
                         </div>
                         <Skeleton className="h-5 w-24 rounded-full" />
                      </div>
                      <Skeleton className="h-12 w-12 rounded-2xl" />
                   </CardContent>
                 </Card>
               ))}
             </div>
          </div>

          {/* Chart Skeleton */}
          <Card className="border-border/50">
             <CardContent className="p-6 space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-80" />
                <div className="h-[300px] w-full pt-4 space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-8 w-1/4" />
                            <Skeleton className="h-8 flex-1 rounded-lg" style={{ width: `${Math.random() * 50 + 30}%` }} />
                        </div>
                    ))}
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-8">
          <div className="space-y-4">
             <Skeleton className="h-8 w-48" />
             <Card className="border-border/50">
                <CardContent className="p-0 divide-y divide-border/50">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="p-4 flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </div>
                    ))}
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

