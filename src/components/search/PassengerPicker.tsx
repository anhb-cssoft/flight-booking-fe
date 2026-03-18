"use client";

import { useState } from "react";
import { Users, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PassengerPickerProps {
  value: {
    adults: number;
    children: number;
  };
  onChange: (value: { adults: number; children: number }) => void;
  common: any;
}

export function PassengerPicker({ value, onChange, common }: PassengerPickerProps) {
  const [open, setOpen] = useState(false);

  const total = value.adults + value.children;

  const updateCount = (type: "adults" | "children", delta: number) => {
    const newValue = { ...value, [type]: Math.max(type === "adults" ? 1 : 0, value[type] + delta) };
    onChange(newValue);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-12 justify-between font-normal"
        >
          <span className="flex items-center truncate">
            <Users className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <span className="truncate">
              {total} {total > 1 ? common.travelers : common.traveler} ({value.adults} {value.adults > 1 ? common.adults : common.adult}
              {value.children > 0 ? `, ${value.children} ${value.children > 1 ? common.children : common.child}` : ""})
            </span>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{common.adults}</span>
              <span className="text-xs text-muted-foreground">Age 18+</span>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => updateCount("adults", -1)}
                disabled={value.adults <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-4 text-center text-sm font-medium">{value.adults}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => updateCount("adults", 1)}
                disabled={value.adults >= 9}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{common.children}</span>
              <span className="text-xs text-muted-foreground">Age 0-17</span>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => updateCount("children", -1)}
                disabled={value.children <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-4 text-center text-sm font-medium">{value.children}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => updateCount("children", 1)}
                disabled={value.children >= 9}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="pt-2 border-t flex justify-end">
            <Button size="sm" onClick={() => setOpen(false)}>{common.done}</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
