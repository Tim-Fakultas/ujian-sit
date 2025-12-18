
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 min-h-screen bg-gray-50/50 dark:bg-neutral-900/20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 md:w-96" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-10 w-48 rounded-full" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="rounded-2xl border-none shadow-sm h-48 relative overflow-hidden">
            <CardContent className="p-6 flex flex-col justify-between h-full">
               <div className="flex justify-between items-start">
                  <div className="space-y-4">
                     <Skeleton className="h-12 w-12 rounded-xl" />
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-8 w-16" />
                     </div>
                  </div>
                  <Skeleton className="h-24 w-24 rounded-full opacity-10" />
               </div>
               <Skeleton className="h-10 w-full mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions Section */}
      <div className="space-y-4">
        <Skeleton className="h-7 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {Array.from({ length: 4 }).map((_, i) => (
             <Card key={i} className="h-32">
                <CardContent className="p-5 flex flex-col items-center justify-center text-center gap-4 h-full">
                   <Skeleton className="h-10 w-10 rounded-full" />
                   <Skeleton className="h-4 w-24" />
                </CardContent>
             </Card>
           ))}
        </div>
      </div>
    </div>
  );
}
