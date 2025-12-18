import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="p-6 max-w-full">
         <Card className="bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
             <CardHeader className="flex flex-row items-center gap-4">
                 <Skeleton className="w-20 h-20 rounded-full" />
                 <div className="space-y-2">
                     <Skeleton className="h-6 w-48" />
                     <Skeleton className="h-4 w-32" />
                 </div>
             </CardHeader>
             <CardContent className="grid gap-6 mt-4">
                 <div className="space-y-2">
                     <Skeleton className="h-4 w-24" />
                     <Skeleton className="h-10 w-full" />
                 </div>
                 <div className="space-y-2">
                     <Skeleton className="h-4 w-24" />
                     <Skeleton className="h-10 w-full" />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                     </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                     </div>
                 </div>
             </CardContent>
         </Card>
    </div>
  );
}
