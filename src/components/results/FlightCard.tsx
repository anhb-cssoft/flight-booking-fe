"use client";

import { Plane, Clock, ArrowRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Slice {
  id: string;
  origin: { iata_code: string; name: string };
  destination: { iata_code: string; name: string };
  duration: string;
  segments: {
    departing_at: string;
    arriving_at: string;
  }[];
}

interface Offer {
  id: string;
  total_amount: string;
  total_currency: string;
  owner: { name: string; logo_symbol_url: string };
  slices: Slice[];
}

interface FlightCardProps {
  offer: Offer;
  dictionary: any;
}

export function FlightCard({ offer, dictionary }: FlightCardProps) {
  const formatDuration = (isoDuration: string) => {
    // Duffel duration is ISO8601 (e.g., PT2H30M)
    const matches = isoDuration.match(/PT(\d+H)?(\d+M)?/);
    const hours = matches?.[1] ? matches[1].replace('H', 'h ') : '';
    const minutes = matches?.[2] ? matches[2].replace('M', 'm') : '';
    return `${hours}${minutes}`;
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow border-slate-200">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Airline Logo & Name */}
        <div className="flex flex-col items-center justify-center w-full md:w-32 gap-2 shrink-0">
          <div className="h-12 w-12 rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden border">
            {offer.owner.logo_symbol_url ? (
              <img 
                src={offer.owner.logo_symbol_url} 
                alt={offer.owner.name} 
                className="h-8 w-8 object-contain"
              />
            ) : (
              <Plane className="h-6 w-6 text-slate-400" />
            )}
          </div>
          <span className="text-xs font-medium text-center text-slate-600 truncate w-full">
            {offer.owner.name}
          </span>
        </div>

        {/* Slices (Outbound and optional Inbound) */}
        <div className="flex-1 space-y-6 w-full">
          {offer.slices.map((slice, idx) => {
            const departureTime = slice.segments[0].departing_at;
            const arrivalTime = slice.segments[slice.segments.length - 1].arriving_at;

            return (
              <div key={slice.id} className="flex items-center justify-between gap-4">
                <div className="flex flex-col items-start min-w-[80px]">
                  <span className="text-xl font-bold">
                    {format(parseISO(departureTime), "HH:mm")}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">
                    {slice.origin.iata_code}
                  </span>
                </div>

                <div className="flex-1 flex flex-col items-center px-4">
                  <div className="flex items-center gap-2 text-slate-400 w-full">
                    <div className="h-px bg-slate-200 flex-1" />
                    <Plane className="h-4 w-4 shrink-0 rotate-90" />
                    <div className="h-px bg-slate-200 flex-1" />
                  </div>
                  <div className="mt-1 flex flex-col items-center">
                    <span className="text-xs text-slate-500 font-medium">
                      {formatDuration(slice.duration)}
                    </span>
                    <Badge variant="secondary" className="mt-1 text-[10px] h-5">
                      {slice.segments.length === 1 
                        ? dictionary.results.stops.direct 
                        : `${slice.segments.length - 1} ${dictionary.results.stops.stop}`}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col items-end min-w-[80px]">
                  <span className="text-xl font-bold">
                    {format(parseISO(arrivalTime), "HH:mm")}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">
                    {slice.destination.iata_code}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Price & Action */}
        <div className="flex flex-col items-center md:items-end justify-center gap-3 md:pl-6 md:border-l shrink-0 w-full md:w-auto">
          <div className="text-center md:text-right">
            <span className="text-2xl font-black text-primary">
              {new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: offer.total_currency 
              }).format(parseFloat(offer.total_amount))}
            </span>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              Total for all passengers
            </p>
          </div>
          <Button className="w-full md:w-auto rounded-xl h-11 px-8 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            {dictionary.results.select}
          </Button>
        </div>
      </div>
    </Card>
  );
}
