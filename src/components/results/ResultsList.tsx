"use client";

import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { FlightCard } from "./FlightCard";
import { FlightSkeleton } from "./FlightSkeleton";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  Filter,
  ChevronDown,
  Plane,
  Search,
  AlertCircle,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SearchForm } from "../search/SearchForm";
import { cn } from "@/lib/utils";

interface ResultsListProps {
  dictionary: any;
  common: any;
}

const LIMIT = 10;

export function ResultsList({ dictionary, common }: ResultsListProps) {
  const searchParams = useSearchParams();
  const queryData = searchParams.get("q");
  
  // States cho Filtering và Sorting
  const [sortBy, setSortBy] = useState("price_asc");
  const [filterStops, setFilterStops] = useState<string>("all");

  const searchData = useMemo(() => {
    if (!queryData) return null;
    try {
      const decoded = Buffer.from(queryData, "base64").toString("utf-8");
      return JSON.parse(decoded);
    } catch (e) {
      console.error("Failed to decode search data", e);
      return null;
    }
  }, [queryData]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch
  } = useInfiniteQuery({
    // Đưa sortBy và filterStops vào queryKey để tự động refetch khi thay đổi
    queryKey: ["offers", queryData, sortBy, filterStops],
    queryFn: async ({ pageParam = 0 }) => {
      if (!searchData) return null;
      const res = await fetch("/api/duffel/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...searchData,
          limit: LIMIT,
          offset: pageParam,
          sortBy,
          filterStops
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch offers");
      }
      return res.json();
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const currentOffset = allPages.length * LIMIT;
      const totalOffers = lastPage?.data?.total_offers || 0;
      return currentOffset < totalOffers ? currentOffset : undefined;
    },
    enabled: !!searchData,
    staleTime: 0, // Disable stale time to ensure data is always considered old
    gcTime: 0,    // Disable garbage collection cache to force fresh fetches
  });

  // Lấy toàn bộ danh sách chuyến bay từ các trang đã fetch
  const allOffers = useMemo(() => {
    return data?.pages.flatMap((page) => page?.data?.offers || []) || [];
  }, [data]);

  // Tổng số lượng kết quả dựa trên Filter hiện tại
  const totalResultsCount = data?.pages[0]?.data?.total_offers || 0;

  if (!searchData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold">{dictionary.results.noResults}</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-12">
        <SearchForm
          dictionary={dictionary}
          common={common}
          initialData={searchData}
        />
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              {dictionary.results.title}
              <Badge
                variant="outline"
                className={cn(
                  "text-lg font-medium px-3 h-8 rounded-lg transition-opacity",
                  isLoading ? "opacity-50" : "opacity-100"
                )}
              >
                {isLoading ? "..." : totalResultsCount}
              </Badge>
            </h1>
            <p className="text-slate-500 mt-1 font-medium">
              {searchData.slices[0].origin} to {searchData.slices[0].destination} • {searchData.slices[0].departure_date}
            </p>
          </div>

          {!error && (
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="rounded-xl border-slate-200"
                    disabled={isLoading}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    {dictionary.results.filters.stops}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl">
                  <DropdownMenuLabel>{dictionary.results.filters.stops}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={filterStops} onValueChange={setFilterStops}>
                    <DropdownMenuRadioItem value="all">All Flights</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="direct">{dictionary.results.stops.direct}</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="1stop">1 Stop</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="2plus">2+ Stops</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="rounded-xl border-slate-200"
                    disabled={isLoading}
                  >
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Sort by
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                    <DropdownMenuRadioItem value="price_asc">{dictionary.results.cheapest}</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="duration_asc">{dictionary.results.fastest}</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="price_desc">Highest Price</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => <FlightSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="bg-destructive/10 p-4 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-6">{(error as Error).message}</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {allOffers.length > 0 ? (
              <>
                <div className="space-y-4">
                  {allOffers.map((offer) => (
                    <FlightCard 
                      key={offer.id} 
                      offer={offer} 
                      dictionary={dictionary} 
                      common={common}
                    />
                  ))}
                </div>

                {hasNextPage && (
                  <div className="flex justify-center pt-8">
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-xl px-12 font-bold border-slate-200 hover:bg-slate-50"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                    >
                      {isFetchingNextPage ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading...
                        </div>
                      ) : (
                        `Show More Flights (${totalResultsCount - allOffers.length} remaining)`
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed">
                <Search className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-900">{dictionary.results.noResults}</h3>
                <p className="text-slate-500 mt-1">Try adjusting your filters to find more flights.</p>
                <Button variant="link" onClick={() => setFilterStops("all")} className="mt-2">
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
