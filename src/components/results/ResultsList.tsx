"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { FlightCard } from "./FlightCard";
import { FlightSkeleton } from "./FlightSkeleton";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpDown, 
  Filter, 
  ChevronDown, 
  Plane, 
  Search, 
  AlertCircle 
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

interface ResultsListProps {
  dictionary: any;
}

export function ResultsList({ dictionary }: ResultsListProps) {
  const searchParams = useSearchParams();
  const queryData = searchParams.get("q");
  const [sortBy, setSortBy] = useState("price_asc");
  const [filterStops, setFilterStops] = useState<string>("all");

  const searchData = useMemo(() => {
    if (!queryData) return null;
    try {
      return JSON.parse(atob(queryData));
    } catch (e) {
      console.error("Failed to decode search data", e);
      return null;
    }
  }, [queryData]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["offers", queryData],
    queryFn: async () => {
      if (!searchData) return null;
      const res = await fetch("/api/duffel/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch offers");
      }
      return res.json();
    },
    enabled: !!searchData,
    staleTime: 5 * 60 * 1000,
  });

  const offers = data?.data?.offers || [];

  const processedOffers = useMemo(() => {
    let result = [...offers];

    // Simple Filtering by stops
    if (filterStops !== "all") {
      result = result.filter(offer => {
        const maxStops = Math.max(...offer.slices.map((s: any) => s.segments.length - 1));
        if (filterStops === "direct") return maxStops === 0;
        if (filterStops === "1stop") return maxStops === 1;
        return maxStops >= 2;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "price_asc") return parseFloat(a.total_amount) - parseFloat(b.total_amount);
      if (sortBy === "price_desc") return parseFloat(b.total_amount) - parseFloat(a.total_amount);
      
      // Duration sorting (sum of all slices)
      const getDuration = (off: any) => off.slices.reduce((acc: number, s: any) => {
        const matches = s.duration.match(/PT(\d+H)?(\d+M)?/);
        const h = parseInt(matches?.[1] || "0");
        const m = parseInt(matches?.[2] || "0");
        return acc + h * 60 + m;
      }, 0);

      if (sortBy === "duration_asc") return getDuration(a) - getDuration(b);
      return 0;
    });

    return result;
  }, [offers, sortBy, filterStops]);

  if (!searchData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold">{dictionary.results.noResults}</h2>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-100 animate-pulse rounded" />
            <div className="h-4 w-32 bg-slate-100 animate-pulse rounded" />
          </div>
        </div>
        {[1, 2, 3, 4, 5].map((i) => <FlightSkeleton key={i} />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="bg-destructive/10 p-4 rounded-full mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">{(error as Error).message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            {dictionary.results.title}
            <Badge variant="outline" className="text-lg font-medium px-3 h-8 rounded-lg">
              {processedOffers.length}
            </Badge>
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            {searchData.slices[0].origin} to {searchData.slices[0].destination} • {searchData.slices[0].departure_date}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Stops Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl border-slate-200">
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

          {/* Sort Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl border-slate-200">
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
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        {processedOffers.length > 0 ? (
          processedOffers.map((offer) => (
            <FlightCard 
              key={offer.id} 
              offer={offer} 
              dictionary={dictionary} 
            />
          ))
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
    </div>
  );
}
