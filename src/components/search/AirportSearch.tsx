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
            className="w-full h-12 justify-between font-normal"
          >
            {value ? (
              <span className="flex items-center truncate min-w-0">
                <Plane className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <span className="truncate">
                  {selectedAirport ? `${selectedAirport.name} (${selectedAirport.iata_code})` : value}
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder="Search city or airport..." 
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              <CommandEmpty>
                {isSearching ? "Searching..." : "No airport found."}
              </CommandEmpty>
              
              {searchTerm.length < 2 && (
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b mb-1">
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
                  >
                    <div className="flex items-center w-full">
                      <div className="mr-2 bg-muted p-2 rounded-full">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="truncate font-medium">{airport.name} ({airport.iata_code})</span>
                        <span className="text-xs text-muted-foreground truncate">{airport.city_name}</span>
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
