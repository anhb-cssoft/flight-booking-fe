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
          className="w-full h-10 justify-between font-bold border-0 bg-transparent p-0 focus:ring-0 shadow-none text-sm text-slate-700 min-w-0"
        >
          <div className="flex items-center truncate min-w-0">
            <Users className="mr-2 h-4 w-4 shrink-0 opacity-60" />
            <span className="truncate">
              {total} {total > 1 ? common.travelers : common.traveler} ({value.adults} {value.adults > 1 ? common.adults : common.adult}
              {value.children > 0 ? `, ${value.children} ${value.children > 1 ? common.children : common.child}` : ""})
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-6 rounded-3xl border-slate-200 shadow-2xl" align="start">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-black uppercase tracking-widest text-slate-900">{common.adults}</span>
              <span className="text-xs text-slate-500 font-medium">Age 18+</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-xl border-slate-200 hover:bg-slate-50"
                onClick={() => updateCount("adults", -1)}
                disabled={value.adults <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-6 text-center text-lg font-black text-slate-900">{value.adults}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-xl border-slate-200 hover:bg-slate-50"
                onClick={() => updateCount("adults", 1)}
                disabled={value.adults >= 9}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-black uppercase tracking-widest text-slate-900">{common.children}</span>
              <span className="text-xs text-slate-500 font-medium">Age 2-11</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-xl border-slate-200 hover:bg-slate-50"
                onClick={() => updateCount("children", -1)}
                disabled={value.children <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-6 text-center text-lg font-black text-slate-900">{value.children}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-xl border-slate-200 hover:bg-slate-50"
                onClick={() => updateCount("children", 1)}
                disabled={value.children >= 9}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button className="rounded-xl px-8 font-bold" size="sm" onClick={() => setOpen(false)}>{common.done}</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
