"use client";

import { useState, useMemo } from "react";
import { Plane, Clock, Briefcase, Wifi, Zap, MapPin, ChevronRight, Info, AlertCircle, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useBookingStore } from "@/store/useBookingStore";

interface Slice {
  id: string;
  origin: { iata_code: string; name: string; city_name: string };
  destination: { iata_code: string; name: string; city_name: string };
  duration: string;
  segments: {
    id: string;
    departing_at: string;
    arriving_at: string;
    duration: string;
    marketing_carrier_flight_number: string;
    marketing_carrier: { name: string; logo_symbol_url: string };
    origin: { iata_code: string; name: string; city_name?: string; terminal?: string };
    destination: { iata_code: string; name: string; city_name?: string; terminal?: string };
    aircraft?: { name: string };
    passengers: any[];
  }[];
}

interface Offer {
  id: string;
  total_amount: string;
  total_currency: string;
  owner: { name: string; logo_symbol_url: string };
  slices: Slice[];
  passengers: { id: string; type: string }[];
}

interface FlightCardProps {
  offer: Offer;
  dictionary: any;
  common: any;
}

export function FlightCard({ offer, dictionary, common }: FlightCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const lang = params.lang as string;
  const selectOffer = useBookingStore((state) => state.selectOffer);
  const initPassengers = useBookingStore((state) => state.initPassengers);
  const dateLocale = lang === "vi" ? vi : enUS;

  const handleSelect = () => {
    selectOffer(offer);
    initPassengers(offer.passengers);
    router.push(`/${lang}/checkout`);
  };

  // Calculate total passengers from the offer.passengers array
  const passengerCounts = useMemo(() => {
    const passengers = offer.passengers || [];
    const adults = passengers.filter(p => p.type === "adult").length;
    const children = passengers.filter(p => p.type === "child").length;
    return { adults, children };
  }, [offer]);

  const formatDuration = (isoDuration: string) => {
    if (!isoDuration) return "";
    const matches = isoDuration.match(/PT(\d+H)?(\d+M)?/);
    const hours = matches?.[1] ? matches[1].replace('H', 'h ') : '';
    const minutes = matches?.[2] ? matches[2].replace('M', 'm') : '';
    return `${hours}${minutes}`;
  };

  const getLayoverTime = (segment1: any, segment2: any) => {
    const arrival = parseISO(segment1.arriving_at);
    const departure = parseISO(segment2.departing_at);
    const diffMs = departure.getTime() - arrival.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const h = Math.floor(diffMins / 60);
    const m = diffMins % 60;
    return `${h > 0 ? `${h}h ` : ""}${m}m`;
  };

  return (
    <Card className="p-6 hover:shadow-xl transition-all duration-300 border-slate-200 group">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Airline Logo & Name */}
        <div className="flex flex-col items-center justify-center w-full md:w-32 gap-3 shrink-0">
          <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 group-hover:border-primary/20 transition-colors">
            {offer.owner.logo_symbol_url ? (
              <img 
                src={offer.owner.logo_symbol_url} 
                alt={offer.owner.name} 
                className="h-10 w-10 object-contain"
              />
            ) : (
              <Plane className="h-7 w-7 text-slate-400" />
            )}
          </div>
          <span className="text-[11px] font-bold text-center text-slate-500 uppercase tracking-tighter truncate w-full">
            {offer.owner.name}
          </span>
        </div>

        {/* Slices Overview */}
        <div className="flex-1 space-y-6 w-full">
          {offer.slices.map((slice) => {
            const departureTime = slice.segments[0].departing_at;
            const arrivalTime = slice.segments[slice.segments.length - 1].arriving_at;

            return (
              <div key={slice.id} className="flex items-center justify-between gap-4">
                <div className="flex flex-col items-start min-w-[90px]">
                  <span className="text-2xl font-black tracking-tight text-slate-900">
                    {format(parseISO(departureTime), "HH:mm")}
                  </span>
                  <span className="text-sm font-bold text-slate-400">
                    {slice.origin.iata_code}
                  </span>
                </div>

                <div className="flex-1 flex flex-col items-center px-4">
                  <div className="flex items-center gap-3 text-slate-200 w-full">
                    <div className="h-[2px] bg-slate-100 flex-1 rounded-full" />
                    <Plane className="h-5 w-5 shrink-0 text-primary/40 rotate-90" />
                    <div className="h-[2px] bg-slate-100 flex-1 rounded-full" />
                  </div>
                  <div className="mt-2 flex flex-col items-center">
                    <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {formatDuration(slice.duration)}
                    </span>
                    <Badge variant="secondary" className="mt-1.5 text-[9px] font-black uppercase tracking-widest h-5 bg-slate-100 text-slate-600 border-none">
                      {slice.segments.length === 1 
                        ? dictionary.results.stops.direct 
                        : `${slice.segments.length - 1} ${dictionary.results.stops.stop}${slice.segments.length > 2 ? 's' : ''}`}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col items-end min-w-[90px]">
                  <span className="text-2xl font-black tracking-tight text-slate-900">
                    {format(parseISO(arrivalTime), "HH:mm")}
                  </span>
                  <span className="text-sm font-bold text-slate-400">
                    {slice.destination.iata_code}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Price & Action */}
        <div className="flex flex-col items-center md:items-end justify-center gap-4 md:pl-8 md:border-l border-slate-100 shrink-0 w-full md:w-auto">
          <div className="text-center md:text-right">
            <span className="text-3xl font-black text-primary tracking-tighter">
              {new Intl.NumberFormat(lang === "vi" ? "vi-VN" : "en-US", { 
                style: 'currency', 
                currency: offer.total_currency 
              }).format(parseFloat(offer.total_amount))}
            </span>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
              Final Price
            </p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto rounded-2xl h-12 px-10 font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-300">
                {dictionary.results.select}
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] md:max-w-3xl h-[90vh] md:h-auto md:max-h-[90vh] overflow-hidden p-0 rounded-2xl md:rounded-[2rem] border-none shadow-2xl flex flex-col">
              {/* Header Section */}
              <div className="p-6 md:p-7 bg-slate-50 border-b border-slate-100 shrink-0">
                <DialogHeader>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <DialogTitle className="text-xl md:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2 md:gap-3">
                        <div className="bg-primary/10 p-1.5 md:p-2 rounded-lg md:rounded-xl">
                          <Plane className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                        </div>
                        {dictionary.results.details.itinerary}
                      </DialogTitle>
                      <p className="text-slate-500 text-[11px] md:text-sm font-medium mt-1 flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        {format(parseISO(offer.slices[0].segments[0].departing_at), "EEEE, MMMM do, yyyy", { locale: dateLocale })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{dictionary.results.details.operatedBy}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <img src={offer.owner.logo_symbol_url} alt="" className="h-5 w-5 md:h-6 md:w-6 object-contain" />
                        <span className="text-xs font-bold text-slate-900 hidden sm:inline">{offer.owner.name}</span>
                      </div>
                    </div>
                  </div>
                </DialogHeader>
              </div>

              {/* Content Section */}
              <div className="flex-1 overflow-y-auto p-6 md:p-7 space-y-8 md:space-y-10 min-h-0 bg-white">
                {offer.slices.map((slice, sIdx) => (
                  <div key={slice.id} className="space-y-6 md:space-y-8">
                    {/* Slice Header */}
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={cn(
                        "px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest",
                        sIdx === 0 ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                      )}>
                        {offer.slices.length === 1 
                          ? dictionary.results.details.outbound 
                          : sIdx === 0 
                            ? dictionary.results.details.outbound 
                            : sIdx === 1 && offer.slices.length === 2
                              ? dictionary.results.details.return
                              : `${dictionary.search.tripType.multiCity} ${sIdx + 1}`}
                      </div>
                      <div className="h-px bg-slate-100 flex-1" />
                      <div className="text-[11px] md:text-sm font-bold text-slate-400 flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        {dictionary.results.duration} {formatDuration(slice.duration)}
                      </div>
                    </div>

                    {/* Segments Timeline */}
                    <div className="space-y-0 relative">
                      {slice.segments.map((segment, segIdx) => {
                        const amenities = segment.passengers[0]?.cabin?.amenities;
                        const baggage = segment.passengers[0]?.baggages || [];
                        const isLastSegment = segIdx === slice.segments.length - 1;

                        return (
                          <div key={segment.id} className="relative">
                            {/* Vertical Line */}
                            {!isLastSegment && (
                              <div className="absolute left-[13px] md:left-[15px] top-[32px] bottom-[-32px] md:top-[40px] md:bottom-[-40px] w-0.5 border-l-2 border-dashed border-slate-200" />
                            )}

                            <div className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_auto_1fr] gap-4 md:gap-6 mb-8 md:mb-10">
                              {/* Time Column */}
                              <div className="flex flex-col justify-between py-1 min-w-[50px] md:min-w-[60px]">
                                <div className="text-right">
                                  <p className="text-base md:text-lg font-black text-slate-900 leading-none">
                                    {format(parseISO(segment.departing_at), "HH:mm")}
                                  </p>
                                  <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mt-1">{format(parseISO(segment.departing_at), "MMM d")}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-base md:text-lg font-black text-slate-900 leading-none">
                                    {format(parseISO(segment.arriving_at), "HH:mm")}
                                  </p>
                                  <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mt-1">{format(parseISO(segment.arriving_at), "MMM d")}</p>
                                </div>
                              </div>

                              {/* Icon Column */}
                              <div className="flex flex-col items-center py-1">
                                <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-white border-2 border-primary flex items-center justify-center z-10 shadow-sm">
                                  <div className="h-2 md:h-2.5 w-2 md:w-2.5 rounded-full bg-primary animate-pulse" />
                                </div>
                                <div className="flex-1" />
                                <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center z-10 shadow-sm">
                                  <div className="h-2 md:h-2.5 w-2 md:w-2.5 rounded-full bg-slate-300" />
                                </div>
                              </div>

                              {/* Details Column */}
                              <div className="flex flex-col justify-between gap-6 md:gap-8">
                                {/* Origin Detail */}
                                <div>
                                  <p className="text-base md:text-lg font-black text-slate-900 leading-tight">
                                    {segment.origin.city_name || segment.origin.name} ({segment.origin.iata_code})
                                  </p>
                                  <p className="text-xs md:text-sm font-medium text-slate-500">{segment.origin.name}</p>
                                  {segment.origin.terminal && (
                                    <Badge variant="outline" className="mt-1 md:mt-1.5 text-[8px] md:text-[9px] font-black uppercase tracking-tighter h-4 md:h-5 bg-slate-50">
                                      Terminal {segment.origin.terminal}
                                    </Badge>
                                  )}
                                </div>

                                {/* Segment Middle Card */}
                                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 flex flex-wrap items-center justify-between gap-4">
                                  <div className="flex items-center gap-3 md:gap-4">
                                    <div className="h-8 w-8 md:h-9 md:w-9 rounded-lg bg-white flex items-center justify-center border border-slate-100 shadow-sm shrink-0">
                                      <img src={segment.marketing_carrier.logo_symbol_url} alt="" className="h-5 w-5 md:h-6 md:w-6 object-contain" />
                                    </div>
                                    <div>
                                      <p className="text-[10px] md:text-[11px] font-black text-slate-900 uppercase tracking-tight">
                                        {segment.marketing_carrier.name} • {segment.marketing_carrier_flight_number}
                                      </p>
                                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                        {segment.aircraft?.name || "Aircraft Info N/A"} • {formatDuration(segment.duration)}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-1.5">
                                    {baggage.map((b: any, i: number) => (
                                      <div key={i} className="flex items-center gap-1 px-2 py-0.5 bg-white rounded-lg border border-slate-100 text-[9px] font-bold text-slate-600 shadow-sm">
                                        <Briefcase className="h-2.5 w-2.5 text-slate-400" /> {b.quantity}x {b.type}
                                      </div>
                                    ))}
                                    {amenities?.wifi?.available && (
                                      <div className="flex items-center gap-1 px-2 py-0.5 bg-white rounded-lg border border-slate-100 text-[9px] font-bold text-slate-600 shadow-sm">
                                        <Wifi className="h-2.5 w-2.5 text-slate-400" /> Wifi
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Destination Detail */}
                                <div>
                                  <p className="text-base md:text-lg font-black text-slate-900 leading-tight">
                                    {segment.destination.city_name || segment.destination.name} ({segment.destination.iata_code})
                                  </p>
                                  <p className="text-xs md:text-sm font-medium text-slate-500">{segment.destination.name}</p>
                                </div>
                              </div>
                            </div>

                            {/* Layover marker between segments */}
                            {!isLastSegment && (
                              <div className="ml-[60px] md:ml-[75px] mb-8 md:mb-10">
                                <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100/50 flex items-center gap-3">
                                  <div className="bg-amber-100 p-1.5 rounded-lg">
                                    <Clock className="h-4 w-4 text-amber-600" />
                                  </div>
                                  <div>
                                    <p className="text-[9px] md:text-[10px] font-black text-amber-600 uppercase tracking-widest">{dictionary.results.details.layoverConnection}</p>
                                    <p className="text-xs md:text-sm font-black text-amber-900">
                                      {getLayoverTime(segment, slice.segments[segIdx + 1])} {dictionary.results.details.waitIn} {segment.destination.name}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Section */}
              <div className="p-6 md:p-7 bg-slate-900 text-white border-t border-slate-800 shrink-0">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center justify-between md:justify-start w-full md:w-auto gap-6">
                    <div>
                      <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-1">{dictionary.results.details.totalAmount}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl md:text-3xl font-black tracking-tighter">
                          {new Intl.NumberFormat(lang === "vi" ? "vi-VN" : "en-US", { 
                            style: 'currency', 
                            currency: offer.total_currency 
                          }).format(parseFloat(offer.total_amount))}
                        </span>
                      </div>
                    </div>
                    <div className="hidden sm:block h-10 md:h-12 w-px bg-slate-800" />
                    <div className="hidden sm:block">
                      <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1">{dictionary.results.details.passengers}</p>
                      <p className="text-xs md:text-sm font-bold">
                        {passengerCounts.adults} {passengerCounts.adults > 1 ? common.adults : common.adult}, {passengerCounts.children} {passengerCounts.children > 1 ? common.children : common.child}
                      </p>
                    </div>
                  </div>
                  <Button 
                    className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white rounded-xl h-12 md:h-13 px-8 md:px-10 text-base md:text-lg font-black shadow-2xl shadow-primary/40 transition-all hover:scale-105 active:scale-95"
                    onClick={handleSelect}
                  >
                    {dictionary.results.details.confirmSelect}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Card>
  );
}
