"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown, Plane } from "lucide-react";
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
}

export function AirportSearch({ placeholder, value, onChange, label }: AirportSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["airports", searchTerm],
    queryFn: async () => {
      if (searchTerm.length < 2) return [];
      const res = await fetch(`/api/duffel/suggestions?query=${encodeURIComponent(searchTerm)}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      return json.data as Airport[];
    },
    enabled: searchTerm.length >= 2,
  });

  const selectedAirport = suggestions?.find((a) => a.iata_code === value);

  return (
    <div className="flex flex-col space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
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
                {isLoading ? "Searching..." : "No airport found."}
              </CommandEmpty>
              <CommandGroup>
                {suggestions?.map((airport) => (
                  <CommandItem
                    key={airport.id}
                    value={airport.iata_code}
                    data-checked={value === airport.iata_code}
                    onSelect={(currentValue) => {
                      onChange(currentValue);
                      setOpen(false);
                    }}
                  >
                    <div className="flex flex-col">
                      <span>{airport.name} ({airport.iata_code})</span>
                      <span className="text-xs text-muted-foreground">{airport.city_name}</span>
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
