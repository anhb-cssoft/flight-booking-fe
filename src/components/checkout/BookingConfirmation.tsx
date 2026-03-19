"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CheckCircle2, Plane, ArrowRight, Printer, Home, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { useBookingStore } from "@/store/useBookingStore";
import { Locale } from "@/i18n-config";

interface BookingConfirmationProps {
  order: any;
  dictionary: any;
  lang: Locale;
}

export function BookingConfirmation({
  order,
  dictionary,
  lang,
}: BookingConfirmationProps) {
  const router = useRouter();
  const resetBooking = useBookingStore((state) => state.resetBooking);
  const t = dictionary.checkout.confirmation;

  useEffect(() => {
    if (order && typeof window !== "undefined") {
      try {
        const savedBookings = JSON.parse(localStorage.getItem("my-bookings") || "[]");
        const isAlreadySaved = savedBookings.some((b: any) => b.id === order.id);
        
        if (!isAlreadySaved) {
          const newBooking = {
            ...order,
            savedAt: new Date().toISOString(),
          };
          localStorage.setItem("my-bookings", JSON.stringify([newBooking, ...savedBookings]));
        }
      } catch (e) {
        console.error("Failed to save booking to localStorage", e);
      }
    }
  }, [order]);

  const leadPassenger = order.passengers[0];
  
  const formatPrice = (amount: string, currency: string) => {
    return new Intl.NumberFormat(lang === "vi" ? "vi-VN" : "en-US", {
      style: "currency",
      currency: currency,
    }).format(parseFloat(amount));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-16 animate-in fade-in slide-in-from-bottom-4 duration-700 print:p-0 print:m-0 print:max-w-none print:bg-white">
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 8mm;
          }
          body {
            background: white !important;
            color: black !important;
            font-size: 9pt;
            line-height: 1.2;
          }
          .no-print {
            display: none !important;
          }
          table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
          th, td { text-align: left; padding: 4px 6px; border-bottom: 1px solid #eee; font-size: 8.5pt; }
          th { background-color: #f8fafc !important; -webkit-print-color-adjust: exact; font-weight: bold; }
          .print-section { page-break-inside: avoid; margin-bottom: 12px; }
          h1, h2, h3 { margin: 0; padding: 0; }
        }
      `}</style>

      {/* --- SCREEN UI --- */}
      <div className="print:hidden">
        <div className="text-center mb-10 md:mb-16">
          <div className="bg-emerald-100 text-emerald-600 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-xl shadow-emerald-100/50">
            <CheckCircle2 className="h-10 w-10 md:h-14 md:w-14" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-slate-900">{t.title}</h1>
          <p className="text-slate-500 text-base md:text-lg max-w-xl mx-auto font-medium">{t.subtitle}</p>
        </div>

        <div className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 z-0" />
          <div className="relative z-10">
            <div className="bg-slate-900 p-8 md:p-12 text-white flex flex-col md:flex-row justify-between items-start gap-6">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tight mb-2">{t.confirmed}</h2>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Digital Confirmation</p>
              </div>
              <div className="md:text-right">
                <p className="text-slate-400 text-sm font-bold">
                  Ref: <span className="text-white uppercase">{order.booking_reference || order.id.slice(-8).toUpperCase()}</span>
                </p>
              </div>
            </div>

            <div className="p-8 md:p-12 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-100 pb-10">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-4">Passenger Details</h3>
                  <div className="space-y-2">
                    {order.passengers.map((p: any, idx: number) => (
                      <p key={idx} className="text-slate-900 font-bold capitalize">
                        {p.title}. {p.given_name} {p.family_name} <span className="text-xs text-slate-400 font-normal">({p.type || "Adult"})</span>
                      </p>
                    ))}
                  </div>
                </div>
                <div className="md:text-right">
                  <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-4">Contact Info</h3>
                  <p className="text-slate-900 font-bold">{leadPassenger.email}</p>
                  <p className="text-slate-500">{leadPassenger.phone_number}</p>
                </div>
              </div>

              <div className="space-y-6">
                {order.slices.map((slice: any, idx: number) => {
                  const firstSeg = slice.segments[0];
                  const lastSeg = slice.segments[slice.segments.length - 1];
                  return (
                    <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <p className="text-2xl font-black text-slate-900">{slice.origin.iata_code}</p>
                          <p className="text-xs font-bold text-slate-400">{format(parseISO(firstSeg.departing_at), "HH:mm")}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-black text-slate-900">{slice.destination.iata_code}</p>
                          <p className="text-xs font-bold text-slate-400">{format(parseISO(lastSeg.arriving_at), "HH:mm")}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900">{format(parseISO(firstSeg.departing_at), "EEE, dd MMM yyyy")}</p>
                        <p className="text-xs text-slate-500 uppercase font-bold">Flight {firstSeg.operating_carrier_flight_number || firstSeg.marketing_carrier_flight_number}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 flex justify-between items-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest">Amount Paid</p>
                <p className="text-4xl font-black tracking-tighter text-slate-900">{formatPrice(order.total_amount, order.total_currency)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
          <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-2xl px-10 h-14 font-black flex items-center gap-3 group" onClick={() => window.print()}>
            <Printer className="h-5 w-5 group-hover:scale-110 transition-transform" />
            Print Receipt
          </Button>
          <Button size="lg" className="w-full sm:w-auto rounded-2xl px-12 h-14 font-black bg-slate-900 hover:bg-slate-800 transition-all flex items-center gap-3" onClick={() => { resetBooking(); router.push(`/${lang}`); }}>
            <Home className="h-5 w-5" />
            {t.backToHome}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* --- PRINT ONLY INVOICE (Optimized for 1 Page A4) --- */}
      <div className="hidden print:block font-serif text-black">
        <div className="flex justify-between items-start border-b-2 border-black pb-1 mb-3">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-tight">Flight Receipt</h1>
            <p className="text-[7.5pt] text-gray-600">Premium Booking Service | support@travel-service.com</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold uppercase">Invoice</h2>
            <p className="text-[8.5pt] font-bold">REF: {(order.booking_reference || order.id.slice(-8)).toUpperCase()}</p>
            <p className="text-[7.5pt]">Date: {format(new Date(), "dd MMM yyyy")}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3 print-section">
          <div>
            <h3 className="font-bold uppercase text-[7pt] border-b border-gray-300 mb-0.5 pb-0.5">Billed To</h3>
            <p className="text-[9pt] font-bold capitalize">{leadPassenger.title}. {leadPassenger.given_name} {leadPassenger.family_name}</p>
            <p className="text-[8pt]">{leadPassenger.email} | {leadPassenger.phone_number}</p>
          </div>
          <div>
            <h3 className="font-bold uppercase text-[7pt] border-b border-gray-300 mb-0.5 pb-0.5">Payment Details</h3>
            <p className="text-[8pt]">Method: Duffel Balance (Test Payment)</p>
            <p className="text-[7pt] font-mono text-gray-500 truncate">ID: {order.id}</p>
          </div>
        </div>

        <div className="print-section">
          <h3 className="font-bold uppercase text-[7.5pt] border-b border-gray-300 mb-1 pb-0.5">Passenger List</h3>
          <table>
            <thead>
              <tr>
                <th className="uppercase">Name</th>
                <th className="uppercase">Type</th>
                <th className="uppercase text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {order.passengers.map((p: any, idx: number) => (
                <tr key={idx}>
                  <td className="capitalize">{p.title}. {p.given_name} {p.family_name}</td>
                  <td className="capitalize">{p.type || "Adult"}</td>
                  <td className="text-right">Confirmed</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="print-section">
          <h3 className="font-bold uppercase text-[7.5pt] border-b border-gray-300 mb-1 pb-0.5">Flight Itinerary</h3>
          {order.slices.map((slice: any, idx: number) => {
            const firstSeg = slice.segments[0];
            const lastSeg = slice.segments[slice.segments.length - 1];
            return (
              <div key={idx} className="mb-2 last:mb-0 border border-gray-50 p-2 rounded">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-bold text-[8.5pt]">{format(parseISO(firstSeg.departing_at), "EEEE, dd MMM yyyy")}</p>
                  <p className="text-[8.5pt] font-bold">{slice.origin.iata_code} → {slice.destination.iata_code}</p>
                </div>
                <table className="mb-0">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-[7pt] py-0.5">Flight</th>
                      <th className="text-[7pt] py-0.5">Route Detail</th>
                      <th className="text-[7pt] py-0.5 text-right">Time (Dep/Arr)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-[8pt]">{firstSeg.operating_carrier_flight_number || firstSeg.marketing_carrier_flight_number}</td>
                      <td className="text-[8pt]">{slice.origin.name} to {slice.destination.name}</td>
                      <td className="text-[8pt] text-right">
                        {format(parseISO(firstSeg.departing_at), "HH:mm")} — {format(parseISO(lastSeg.arriving_at), "HH:mm")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex justify-end print-section">
          <div className="w-48 border-t-2 border-black pt-1">
            <div className="flex justify-between mb-0.5 text-[8pt]">
              <span>Base Fare</span>
              <span>{formatPrice(order.base_amount || (parseFloat(order.total_amount) * 0.9).toString(), order.total_currency)}</span>
            </div>
            <div className="flex justify-between mb-0.5 text-[8pt] border-b border-gray-100 pb-0.5">
              <span>Taxes & Fees</span>
              <span>{formatPrice(order.tax_amount || (parseFloat(order.total_amount) * 0.1).toString(), order.total_currency)}</span>
            </div>
            <div className="flex justify-between pt-0.5 font-bold text-[10.5pt]">
              <span>TOTAL PAID</span>
              <span>{formatPrice(order.total_amount, order.total_currency)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-2 border-t border-gray-100 text-center">
          <p className="text-[7pt] text-gray-500 uppercase tracking-widest mb-0.5">Official E-Ticket Receipt</p>
          <p className="text-[6.5pt] text-gray-400 italic leading-tight">
            Please present this receipt and your valid passport at the check-in counter. 
            This is a computer-generated document and does not require a physical signature. Thank you.
          </p>
        </div>
      </div>
    </div>
  );
}
