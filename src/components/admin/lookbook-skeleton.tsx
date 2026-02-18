import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function LookbookSkeleton() {
  return (
    <div className="w-full h-full space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Lookbook Photos Table Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-6 gap-4 py-2 border-b">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>

              {/* Table Rows */}
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="grid grid-cols-6 gap-4 py-4">
                  {/* Preview */}
                  <Skeleton className="h-16 w-16 rounded" />
                  
                  {/* Title */}
                  <Skeleton className="h-4 w-32" />
                  
                  {/* Order */}
                  <Skeleton className="h-4 w-12" />
                  
                  {/* Status */}
                  <Skeleton className="h-6 w-16" />
                  
                  {/* Created Date */}
                  <Skeleton className="h-4 w-24" />
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}





