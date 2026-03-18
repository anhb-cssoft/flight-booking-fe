"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown, Plane, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSuggestions } from "@/components/providers/SuggestionProvider";
import { useDebounce } from "@/hooks/use-debounce";

interface Airport {
  id: string;
  name: string;
  iata_code: string;
  city_name: string;
}

interface AirportSearchProps {
  placeholder: string;
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  isOrigin?: boolean;
}

export function AirportSearch({ 
  placeholder, 
  value, 
  onChange, 
  label,
  isOrigin = false 
}: AirportSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const { 
    originSuggestions, 
    destinationSuggestions, 
    fetchSuggestions, 
    isLoadingSuggestions 
  } = useSuggestions();

  // Tìm kiếm sân bay dựa trên từ khóa nhập vào
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["airports", debouncedSearchTerm],
    queryFn: async () => {
      if (debouncedSearchTerm.length < 2) return [];
      const res = await fetch(`/api/duffel/suggestions?query=${encodeURIComponent(debouncedSearchTerm)}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.data as Airport[];
    },
    enabled: debouncedSearchTerm.length >= 2,
  });

  // Lấy thông tin sân bay hiện tại khi reload page (nếu chỉ có mã IATA)
  const { data: currentAirportInfo } = useQuery({
    queryKey: ["airport-info", value],
    queryFn: async () => {
      if (!value) return null;
      const res = await fetch(`/api/duffel/suggestions?query=${encodeURIComponent(value)}`);
      if (!res.ok) return null;
      const json = await res.json();
      const airports = json.data as Airport[];
      return airports.find(a => a.iata_code === value) || null;
    },
    enabled: !!value && searchTerm.length < 2,
  });

  useEffect(() => {
    if (open) {
      fetchSuggestions();
    }
  }, [open, fetchSuggestions]);

  const displaySuggestions = searchTerm.length < 2 
    ? (isOrigin ? originSuggestions : destinationSuggestions)
    : (searchResults || []);

  const selectedAirport = [...(originSuggestions || []), ...(destinationSuggestions || []), ...(searchResults || [])]
    .find((a) => a.iata_code === value) || currentAirportInfo;

  return (
    <div className="flex flex-col space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full h-12 justify-between font-bold border-slate-200 rounded-2xl bg-white/50 hover:bg-white transition-all min-w-0 px-4"
          >
            {value ? (
              <div className="flex items-center truncate min-w-0 flex-1">
                <Plane className="mr-3 h-5 w-5 shrink-0 text-primary opacity-60" />
                <span className="truncate text-slate-700">
                  {selectedAirport ? `${selectedAirport.name} (${selectedAirport.iata_code})` : value}
                </span>
              </div>
            ) : (
              <div className="flex items-center truncate min-w-0 flex-1">
                <Plane className="mr-3 h-5 w-5 shrink-0 text-slate-400 opacity-40" />
                <span className="text-slate-400 truncate">{placeholder}</span>
              </div>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-40" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-3xl border-slate-200 overflow-hidden shadow-2xl" align="start">
          <Command shouldFilter={false} className="rounded-none">
            <CommandInput 
              placeholder="Search city or airport..." 
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="h-12 border-none focus:ring-0"
            />
            <CommandList className="max-h-[300px] md:max-h-[400px]">
              <CommandEmpty className="py-6 text-sm text-slate-500 text-center">
                {isSearching ? "Searching..." : "No airport found."}
              </CommandEmpty>
              
              {searchTerm.length < 2 && (
                <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50/50 border-y border-slate-100">
                  {isOrigin ? "Nearby Airports" : "Popular Destinations"}
                </div>
              )}

              <CommandGroup>
                {displaySuggestions.map((airport) => (
                  <CommandItem
                    key={airport.id}
                    value={airport.iata_code}
                    onSelect={(currentValue) => {
                      onChange(currentValue);
                      setOpen(false);
                      setSearchTerm("");
                    }}
                    className="px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center w-full min-w-0">
                      <div className="mr-3 bg-primary/10 p-2 rounded-xl text-primary shrink-0">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="truncate font-bold text-slate-900">{airport.name} ({airport.iata_code})</span>
                        <span className="text-xs text-slate-500 truncate font-medium">{airport.city_name}</span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
