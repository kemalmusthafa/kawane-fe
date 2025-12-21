import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function CategoriesSkeleton() {
  return (
    <div className="w-full h-full space-y-4 sm:space-y-6">
      {/* Header Skeleton */}
      <div className="mb-6 sm:mb-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Search and Add Button Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Categories Table Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-5 gap-4 py-2 border-b">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24 hidden sm:block" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
              </div>

              {/* Table Rows */}
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="grid grid-cols-5 gap-4 py-4">
                  {/* Image */}
                  <Skeleton className="h-12 w-12 rounded" />
                  
                  {/* Name */}
                  <Skeleton className="h-4 w-32" />
                  
                  {/* Description */}
                  <Skeleton className="h-4 w-48 hidden sm:block" />
                  
                  {/* Product Count */}
                  <Skeleton className="h-6 w-12" />
                  
                  {/* Actions */}
                  <div className="flex gap-2">
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





