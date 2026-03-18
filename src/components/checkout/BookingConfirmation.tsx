"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, Plane, ShoppingCart, ArrowRight, Printer, Home, MapPin, Calendar, Clock, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { useBookingStore } from "@/store/useBookingStore";
import { Locale } from "@/i18n-config";
import { cn } from "@/lib/utils";

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
  const common = dictionary.common;

  // Extract lead passenger for billing info
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
            margin: 15mm;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          /* Ensure tables look good */
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { text-align: left; padding: 8px; border-bottom: 1px solid #eee; }
          th { background-color: #f8fafc !important; -webkit-print-color-adjust: exact; }
        }
      `}</style>

      {/* --- SCREEN UI --- */}
      <div className="print:hidden">
        {/* Success Header */}
        <div className="text-center mb-10 md:mb-16">
          <div className="bg-emerald-100 text-emerald-600 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-xl shadow-emerald-100/50">
            <CheckCircle2 className="h-10 w-10 md:h-14 md:w-14" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-slate-900">
            {t.title}
          </h1>
          <p className="text-slate-500 text-base md:text-lg max-w-xl mx-auto font-medium">
            {t.subtitle}
          </p>
        </div>

        {/* Fancy Card for Screen */}
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
              {/* Info Grid */}
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

              {/* Itinerary */}
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
                        <Plane className="h-5 w-5 text-slate-300 rotate-90" />
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

              {/* Total */}
              <div className="pt-6 flex justify-between items-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest">Amount Paid</p>
                <p className="text-4xl font-black tracking-tighter text-slate-900">
                  {formatPrice(order.total_amount, order.total_currency)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto rounded-2xl px-10 h-14 font-black flex items-center gap-3 group"
            onClick={() => window.print()}
          >
            <Printer className="h-5 w-5 group-hover:scale-110 transition-transform" />
            Print Receipt
          </Button>
          <Button
            size="lg"
            className="w-full sm:w-auto rounded-2xl px-12 h-14 font-black bg-slate-900 hover:bg-slate-800 transition-all flex items-center gap-3"
            onClick={() => { resetBooking(); router.push(`/${lang}`); }}
          >
            <Home className="h-5 w-5" />
            {t.backToHome}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* --- PRINT ONLY INVOICE --- */}
      <div className="hidden print:block font-serif text-black p-10">
        <div className="flex justify-between items-start border-b-2 border-black pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">Flight Receipt</h1>
            <p className="text-sm">Premium Flight Booking Services</p>
            <p className="text-sm">support@travel-service.com</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold uppercase mb-1">Receipt / Invoice</h2>
            <p className="text-sm font-bold">REFERENCE: {(order.booking_reference || order.id.slice(-8)).toUpperCase()}</p>
            <p className="text-sm">Date of Issue: {format(new Date(), "dd MMM yyyy")}</p>
            <p className="text-sm">Status: CONFIRMED</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 mb-10">
          <div>
            <h3 className="font-bold uppercase text-xs border-b border-black mb-3 pb-1">Billed To</h3>
            <p className="text-lg font-bold capitalize">{leadPassenger.title}. {leadPassenger.given_name} {leadPassenger.family_name}</p>
            <p className="text-sm">{leadPassenger.email}</p>
            <p className="text-sm">{leadPassenger.phone_number}</p>
          </div>
          <div>
            <h3 className="font-bold uppercase text-xs border-b border-black mb-3 pb-1">Payment Method</h3>
            <p className="text-sm">Duffel Balance (Test Payment)</p>
            <p className="text-sm font-bold mt-2">Transaction ID:</p>
            <p className="text-xs font-mono">{order.id}</p>
          </div>
        </div>

        <h3 className="font-bold uppercase text-xs border-b border-black mb-4 pb-1">Passenger List</h3>
        <table className="mb-10">
          <thead>
            <tr>
              <th className="text-xs uppercase">Name</th>
              <th className="text-xs uppercase">Type</th>
              <th className="text-xs uppercase text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {order.passengers.map((p: any, idx: number) => (
              <tr key={idx}>
                <td className="text-sm capitalize">{p.title}. {p.given_name} {p.family_name}</td>
                <td className="text-sm capitalize">{p.type || "Adult"}</td>
                <td className="text-sm text-right">Confirmed</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="font-bold uppercase text-xs border-b border-black mb-4 pb-1">Flight Itinerary</h3>
        {order.slices.map((slice: any, idx: number) => {
          const firstSeg = slice.segments[0];
          const lastSeg = slice.segments[slice.segments.length - 1];
          return (
            <div key={idx} className="mb-6 last:mb-0">
              <div className="flex justify-between items-center mb-2">
                <p className="font-bold text-sm">
                  {format(parseISO(firstSeg.departing_at), "EEEE, dd MMM yyyy")}
                </p>
                <p className="text-sm font-bold uppercase">
                  {slice.origin.iata_code} → {slice.destination.iata_code}
                </p>
              </div>
              <table className="mb-2">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-[10px] uppercase">Flight</th>
                    <th className="text-[10px] uppercase">Route</th>
                    <th className="text-[10px] uppercase">Departure</th>
                    <th className="text-[10px] uppercase text-right">Arrival</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-xs">{firstSeg.operating_carrier_flight_number || firstSeg.marketing_carrier_flight_number}</td>
                    <td className="text-xs">{slice.origin.name} to {slice.destination.name}</td>
                    <td className="text-xs">{format(parseISO(firstSeg.departing_at), "HH:mm")}</td>
                    <td className="text-xs text-right">{format(parseISO(lastSeg.arriving_at), "HH:mm")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}

        <div className="mt-12 flex justify-end">
          <div className="w-64 border-t-2 border-black pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm">Base Fare</span>
              <span className="text-sm">{formatPrice(order.base_amount || (parseFloat(order.total_amount) * 0.9).toString(), order.total_currency)}</span>
            </div>
            <div className="flex justify-between mb-2 pb-2 border-b border-gray-200">
              <span className="text-sm">Taxes & Fees</span>
              <span className="text-sm">{formatPrice(order.tax_amount || (parseFloat(order.total_amount) * 0.1).toString(), order.total_currency)}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-lg font-bold">TOTAL PAID</span>
              <span className="text-lg font-bold">{formatPrice(order.total_amount, order.total_currency)}</span>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-gray-200 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-2">Official E-Ticket Receipt</p>
          <p className="text-[9px] text-gray-400 italic">
            Please present this receipt and your valid passport at the check-in counter. 
            This is a computer-generated document and does not require a physical signature.
            Thank you for your business.
          </p>
        </div>
      </div>
    </div>
  );
}
