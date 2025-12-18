
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 md:w-96" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-10 w-48 rounded-full" />
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="rounded-xl border shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
               <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
               </div>
               <Skeleton className="h-10 w-10 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card className="h-[400px]">
             <CardContent className="p-6 h-full flex flex-col gap-4">
                 <Skeleton className="h-6 w-48" />
                 <div className="flex-1 flex items-end gap-2 px-4">
                    {Array.from({ length: 7 }).map((_, i) => (
                         <Skeleton key={i} className="w-full rounded-t-lg" style={{ height: `${Math.random() * 80 + 20}%` }} />
                    ))}
                 </div>
             </CardContent>
         </Card>
         
         <Card className="h-[400px]">
            <CardContent className="p-6 h-full flex flex-col gap-4">
                 <Skeleton className="h-6 w-48" />
                 <div className="space-y-4 pt-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                       <div key={i} className="flex items-center gap-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2 flex-1">
                             <Skeleton className="h-4 w-full" />
                             <Skeleton className="h-3 w-1/2" />
                          </div>
                       </div>
                    ))}
                 </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
