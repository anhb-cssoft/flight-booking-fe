"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useBookingStore } from "@/store/useBookingStore";
import { getDictionary } from "@/i18n/get-dictionary";
import { Locale } from "@/i18n-config";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PassengerForm } from "@/components/checkout/PassengerForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plane,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShoppingCart,
  Briefcase,
} from "lucide-react";
import { format, parseISO } from "date-fns";

const createPassengerSchema = (t: any) =>
  z.object({
    passengers: z
      .array(
        z.object({
          id: z.string(),
          type: z.string(),
          title: z.enum(["mr", "mrs", "ms", "miss", "dr"]),
          first_name: z.string().min(2, t.checkout.form.validation.firstName),
          last_name: z.string().min(2, t.checkout.form.validation.lastName),
          gender: z.enum(["m", "f"]),
          born_on: z.string().min(1, t.checkout.form.validation.bornOn),
          email: z
            .string()
            .email(t.checkout.form.validation.email)
            .optional()
            .or(z.literal("")),
          phone_number: z.string().optional().or(z.literal("")),
          add_baggage: z.boolean().default(false),
        }),
      )
      .refine(
        (data) => {
          const lead = data[0];
          return lead.email && lead.phone_number;
        },
        {
          message: "Lead passenger contact info required",
          path: ["passengers.0.email"],
        },
      ),
  });

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as Locale;
  const [dictionary, setDictionary] = useState<any>(null);

  const {
    selectedOffer,
    passengers: storePassengers,
    isBooking,
    bookingError,
    orderConfirmation,
    setBookingStatus,
    setOrderConfirmation,
    resetBooking,
  } = useBookingStore();

  useEffect(() => {
    getDictionary(lang).then(setDictionary);
  }, [lang]);

  useEffect(() => {
    if (!selectedOffer && !orderConfirmation) {
      router.push(`/${lang}`);
    }
  }, [selectedOffer, orderConfirmation, router, lang]);

  const baggageTotal = useMemo(() => {
    return storePassengers.filter((p) => p.add_baggage).length * 30;
  }, [storePassengers]);

  const totalAmount = useMemo(() => {
    if (!selectedOffer) return 0;
    return parseFloat(selectedOffer.total_amount) + baggageTotal;
  }, [selectedOffer, baggageTotal]);

  const schema = dictionary ? createPassengerSchema(dictionary) : z.any();

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      passengers: storePassengers,
    },
  });

  const onSubmit = async (data: any) => {
    setBookingStatus(true);
    try {
      const response = await fetch("/api/duffel/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedOfferId: selectedOffer.id,
          passengers: data.passengers,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to create order");
      }

      const order = await response.json();
      setOrderConfirmation({
        ...order.data,
        total_amount: totalAmount.toString(), // Cập nhật tổng tiền bao gồm hành lý
      });
    } catch (err: any) {
      setBookingStatus(false, err.message);
    }
  };

  if (!dictionary || (!selectedOffer && !orderConfirmation)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (orderConfirmation) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-green-50 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h1 className="text-4xl font-black mb-4 tracking-tight">
          Booking Confirmed!
        </h1>
        <p className="text-slate-500 text-lg mb-8 font-medium">
          Your flight has been successfully booked. Order reference:
          <span className="text-slate-900 font-bold ml-2">
            {orderConfirmation.id}
          </span>
        </p>

        <Card className="text-left mb-8 border-slate-200 shadow-xl rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-slate-900 text-white p-6">
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">
                Status
              </span>
              <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                Confirmed
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">
                Total Paid
              </span>
              <span className="text-3xl font-black text-slate-900 tracking-tighter">
                {new Intl.NumberFormat(lang === "vi" ? "vi-VN" : "en-US", {
                  style: "currency",
                  currency: orderConfirmation.total_currency,
                }).format(parseFloat(orderConfirmation.total_amount))}
              </span>
            </div>
          </CardContent>
        </Card>

        <Button
          size="lg"
          className="rounded-2xl px-12 h-14 font-black shadow-xl shadow-primary/20"
          onClick={() => {
            resetBooking();
            router.push(`/${lang}`);
          }}
        >
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Page Header - Moved outside the grid for better alignment */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button
              variant="outline"
              className="rounded-2xl h-12 w-12 p-0 bg-white border-slate-200 shadow-sm hover:bg-slate-50"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-slate-900">
                {dictionary.checkout.title}
              </h1>
              <p className="text-slate-500 font-medium mt-1">
                {dictionary.checkout.subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 space-y-8">
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-10"
              >
                <div className="space-y-8">
                  {storePassengers.map((_, index) => (
                    <PassengerForm
                      key={index}
                      index={index}
                      dictionary={dictionary}
                    />
                  ))}
                </div>

                {bookingError && (
                  <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-[1.5rem] flex items-start gap-4 text-destructive">
                    <AlertCircle className="h-6 w-6 shrink-0" />
                    <p className="font-bold">{bookingError}</p>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full md:w-auto px-16 h-16 rounded-[1.5rem] text-xl font-black shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95"
                    disabled={isBooking}
                  >
                    {isBooking ? (
                      <>
                        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                        Processing Order...
                      </>
                    ) : (
                      dictionary.checkout.sidebar.bookNow
                    )}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4 sticky top-12">
            <Card className="border-slate-200 overflow-hidden shadow-2xl rounded-[2.5rem] bg-white pt-0">
              <CardHeader className="bg-slate-900 text-white p-8 py-6 px-8">
                <CardTitle className="text-xl font-black flex items-center gap-3 uppercase tracking-widest">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                  {dictionary.checkout.sidebar.yourTrip}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {selectedOffer.slices.map((slice: any, idx: number) => (
                  <div key={idx} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        {idx === 0 ? "Outbound" : "Return"}
                      </span>
                      <div className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-black text-slate-500 uppercase">
                        {format(
                          parseISO(slice.segments[0].departing_at),
                          "MMM d",
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <span className="text-2xl font-black text-slate-900 tracking-tighter">
                          {slice.origin.iata_code}
                        </span>
                        <span className="text-xs text-slate-500 font-bold uppercase">
                          {format(
                            parseISO(slice.segments[0].departing_at),
                            "HH:mm",
                          )}
                        </span>
                      </div>
                      <div className="flex flex-col items-center flex-1 relative">
                        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-100 -translate-y-1/2" />
                        <Plane className="h-5 w-5 text-primary rotate-90 relative z-10 bg-white px-0.5" />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-black text-slate-900 tracking-tighter">
                          {slice.destination.iata_code}
                        </span>
                        <span className="text-xs text-slate-500 font-bold uppercase">
                          {format(
                            parseISO(
                              slice.segments[slice.segments.length - 1]
                                .arriving_at,
                            ),
                            "HH:mm",
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-8 border-t border-slate-100 space-y-4">
                  <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                    <span>Flight Fare</span>
                    <span className="text-slate-900 font-bold">
                      {new Intl.NumberFormat(
                        lang === "vi" ? "vi-VN" : "en-US",
                        {
                          style: "currency",
                          currency: selectedOffer.total_currency,
                        },
                      ).format(parseFloat(selectedOffer.total_amount))}
                    </span>
                  </div>

                  {baggageTotal > 0 && (
                    <div className="flex justify-between items-center text-sm font-medium text-primary animate-in fade-in slide-in-from-right-2">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span>Extra Baggage</span>
                      </div>
                      <span className="font-bold">
                        + ${baggageTotal.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="pt-4 flex flex-col">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                      {dictionary.checkout.sidebar.total}
                    </p>
                    <p className="text-4xl font-black text-primary tracking-tighter mt-1">
                      {new Intl.NumberFormat(
                        lang === "vi" ? "vi-VN" : "en-US",
                        {
                          style: "currency",
                          currency: selectedOffer.total_currency,
                        },
                      ).format(totalAmount)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
