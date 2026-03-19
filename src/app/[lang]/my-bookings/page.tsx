"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDictionary } from "@/i18n/get-dictionary";
import { Locale } from "@/i18n-config";
import { Plane, Calendar, User, ArrowRight, Hash, ExternalLink } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MyBookingsPage() {
  const params = useParams();
  const router = useRouter();
  const lang = params.lang as Locale;
  const [dictionary, setDictionary] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dict = await getDictionary(lang);
        setDictionary(dict);
        
        if (typeof window !== "undefined") {
          const savedBookings = JSON.parse(localStorage.getItem("my-bookings") || "[]");
          setBookings(Array.isArray(savedBookings) ? savedBookings : []);
        }
      } catch (e) {
        console.error("Failed to load bookings or dictionary", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [lang]);

  if (loading || !dictionary) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
      </div>
    );
  }

  // Fallback labels if dictionary is missing some keys
  const t = dictionary.myBookings || {
    title: "My Bookings",
    subtitle: "Review and manage your recent flight reservations.",
    noBookings: "You haven't made any bookings yet.",
    bookNow: "Find a flight",
    ref: "Ref",
    passenger: "Passenger",
    bookedOn: "Booked on"
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
            {t.title}
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl font-medium">
            {t.subtitle}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-slate-200 max-w-2xl mx-auto">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plane className="h-10 w-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.noBookings}</h2>
            <p className="text-slate-500 mb-8">{t.bookNowPrompt || "Ready for your next adventure?"}</p>
            <Button asChild size="lg" className="rounded-2xl px-8 font-bold">
              <Link href={`/${lang}`}>
                {t.bookNow}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
            {bookings.map((booking) => (
              <div 
                key={booking.id} 
                className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 z-0" />
                
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-xl text-primary">
                        <Hash className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.ref}</p>
                        <p className="text-lg font-black text-slate-900 uppercase">
                          {booking.booking_reference || booking.id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.bookedOn}</p>
                      <p className="font-bold text-slate-700">
                        {format(parseISO(booking.savedAt || booking.created_at), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {booking.slices.map((slice: any, idx: number) => {
                      const firstSeg = slice.segments[0];
                      const lastSeg = slice.segments[slice.segments.length - 1];
                      return (
                        <div key={idx} className="flex flex-col lg:flex-row lg:items-center gap-4 bg-slate-50/50 p-4 md:p-6 rounded-2xl border border-slate-50">
                          <div className="flex items-center justify-between flex-1 gap-4 md:gap-8">
                            <div className="text-center min-w-[60px]">
                              <p className="text-xl md:text-2xl font-black text-slate-900">{slice.origin.iata_code}</p>
                              <p className="text-[10px] md:text-xs font-bold text-slate-400">{format(parseISO(firstSeg.departing_at), "HH:mm")}</p>
                            </div>
                            
                            <div className="flex-1 flex items-center gap-2 max-w-[150px]">
                              <div className="h-px flex-1 bg-slate-200 relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                                  <Plane className="h-4 w-4 text-slate-300" />
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-center min-w-[60px]">
                              <p className="text-xl md:text-2xl font-black text-slate-900">{slice.destination.iata_code}</p>
                              <p className="text-[10px] md:text-xs font-bold text-slate-400">{format(parseISO(lastSeg.arriving_at), "HH:mm")}</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-between lg:block lg:text-right lg:min-w-[140px] pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                            <div>
                              <p className="text-sm font-bold text-slate-700">{format(parseISO(firstSeg.departing_at), "EEE, dd MMM")}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                Flight {firstSeg.operating_carrier_flight_number || firstSeg.marketing_carrier_flight_number}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-bold text-slate-600">
                          {booking.passengers.length} {booking.passengers.length > 1 ? dictionary.common.travelers : dictionary.common.traveler}
                        </span>
                      </div>
                      <div className="text-xl font-black text-slate-900">
                        {new Intl.NumberFormat(lang === "vi" ? "vi-VN" : "en-US", {
                          style: "currency",
                          currency: booking.total_currency,
                        }).format(parseFloat(booking.total_amount))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-full">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      {dictionary.checkout.confirmation.confirmed}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
