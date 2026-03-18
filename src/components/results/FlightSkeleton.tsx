"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FlightSkeleton() {
  return (
    <Card className="p-6 border-slate-200">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Airline Logo Skeleton */}
        <div className="flex flex-col items-center justify-center w-full md:w-32 gap-2 shrink-0">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <Skeleton className="h-3 w-20" />
        </div>

        {/* Slices Skeleton */}
        <div className="flex-1 space-y-6 w-full">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="flex flex-col items-start gap-1">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-10" />
              </div>
              <div className="flex-1 px-4 flex flex-col items-center gap-2">
                <Skeleton className="h-1 w-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex flex-col items-end gap-1">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-10" />
              </div>
            </div>
          ))}
        </div>

        {/* Price Skeleton */}
        <div className="flex flex-col items-center md:items-end justify-center gap-3 md:pl-6 md:border-l shrink-0 w-full md:w-auto">
          <div className="flex flex-col items-center md:items-end gap-1">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-11 w-32 rounded-xl" />
        </div>
      </div>
    </Card>
  );
}
