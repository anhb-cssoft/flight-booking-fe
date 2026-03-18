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
import { BookingConfirmation } from "@/components/checkout/BookingConfirmation";
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
import { cn } from "@/lib/utils";

const createPassengerSchema = (t: any) =>
  z.object({
    passengers: z.array(
      z.object({
        id: z.string(),
        type: z.string(),
        title: z.enum(["mr", "mrs", "ms", "miss", "dr"], {
          error_map: () => ({ message: "Required" }),
        }),
        first_name: z.string().min(2, t.checkout.form.validation.firstName),
        last_name: z.string().min(2, t.checkout.form.validation.lastName),
        gender: z.enum(["m", "f"], {
          error_map: () => ({ message: "Required" }),
        }),
        born_on: z.string().min(1, t.checkout.form.validation.bornOn),
        email: z.string().nullable().optional(),
        phone_number: z.string().nullable().optional(),
        add_baggage: z.boolean().default(false),
      })
    ).superRefine((passengers, ctx) => {
      passengers.forEach((p, index) => {
        if (p.born_on) {
          const birthDate = new Date(p.born_on);
          const today = new Date();
          const birthYear = birthDate.getFullYear();
          
          // Strict year validation
          if (birthYear > today.getFullYear() || birthYear < 1900) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t.checkout.form.validation.invalidYear,
              path: [index, "born_on"],
            });
            return; // Skip further age checks if year is invalid
          }

          let age = today.getFullYear() - birthYear;
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }

          if (p.type === "adult" && age < 12) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t.checkout.form.validation.ageAdult,
              path: [index, "born_on"],
            });
          } else if (p.type === "child" && (age < 2 || age >= 12)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t.checkout.form.validation.ageChild,
              path: [index, "born_on"],
            });
          }
        }
      });

      const lead = passengers[0];
      if (lead) {
        // Email validation
        if (!lead.email || lead.email.trim() === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${t.checkout.form.email} is required and must be valid`,
            path: [0, "email"],
          });
        }
        // Phone validation
        const internationalPhoneRegex = /^\+[1-9]\d{1,14}$/;
        const phone = lead.phone_number?.trim();
        if (!phone) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${t.checkout.form.phoneNumber} is required`,
            path: [0, "phone_number"],
          });
        } else if (!phone.startsWith("+")) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${t.checkout.form.phoneNumber} must start with '+'`,
            path: [0, "phone_number"],
          });
        } else if (!internationalPhoneRegex.test(phone)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Invalid ${t.checkout.form.phoneNumber.toLowerCase()} format`,
            path: [0, "phone_number"],
          });
        }
      }
    }),
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

  const isExpired = useMemo(() => {
    if (!selectedOffer?.expires_at) return false;
    return new Date(selectedOffer.expires_at) < new Date();
  }, [selectedOffer]);

  const schema = dictionary ? createPassengerSchema(dictionary) : z.any();

  const methods = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      passengers: storePassengers,
    },
  });

  const onSubmit = async (data: any) => {
    if (isExpired) {
      setBookingStatus(false, "This offer has expired. Please go back and select a new flight.");
      return;
    }
    setBookingStatus(true);
    try {
      const response = await fetch("/api/duffel/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedOfferId: selectedOffer.id,
          passengers: data.passengers,
          totalAmount: selectedOffer.total_amount, // Original flight price
          currency: selectedOffer.total_currency,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errors = result.details || [];
        const firstError = errors[0];
        
        if (firstError) {
          // Special handling for expired offers
          if (firstError.code === "offer_no_longer_available" || firstError.code === "offer_expired") {
            throw new Error(`${dictionary.search.results.noResults} ${firstError.message}`);
          }
          
          // Map validation errors to react-hook-form if source field is provided
          if (firstError.type === "validation_error" && firstError.source) {
            const { field, pointer } = firstError.source;
            
            // Extract index from pointer (e.g., "/data/passengers/1/phone_number" -> 1)
            let index = 0;
            if (pointer) {
              const match = pointer.match(/\/passengers\/(\d+)\//);
              if (match) index = parseInt(match[1], 10);
            }

            // Map common Duffel fields to our form structure
            let formField = field;
            if (field === "given_name") formField = "first_name";
            if (field === "family_name") formField = "last_name";

            // If it's phone or email, always show it on the first passenger's form since that's where the inputs are
            const isContactField = field === "phone_number" || field === "email";
            const targetIndex = isContactField ? 0 : index;

            methods.setError(`passengers.${targetIndex}.${formField}`, { 
              message: firstError.message 
            });
          }

          const title = firstError.title;
          const message = firstError.message;
          throw new Error(title && message && !message.includes(title) ? `${title}: ${message}` : (message || title));
        }
        
        throw new Error(result.error || "An unexpected error occurred");
      }

      setOrderConfirmation({
        ...result.data,
        total_amount: totalAmount.toString(), // Price with baggage
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
      <BookingConfirmation
        order={orderConfirmation}
        dictionary={dictionary}
        lang={lang}
      />
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
            {isExpired && (
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-[1.5rem] flex flex-col items-center text-center gap-4 animate-in fade-in slide-in-from-top-4">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-amber-900 uppercase tracking-widest mb-1">Offer Expired</h3>
                  <p className="text-amber-700 font-medium max-w-md">
                    This flight offer is no longer available because the time limit has reached. Please return to the results page to find the latest offers.
                  </p>
                </div>
                <Button 
                  onClick={() => router.back()}
                  className="rounded-xl px-8 bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Back to Results
                </Button>
              </div>
            )}

            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-10"
              >
                <div className={cn("space-y-8 transition-opacity", isExpired && "opacity-50 pointer-events-none")}>
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
                    disabled={isBooking || isExpired}
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
          <div className="lg:col-span-4 sticky top-24">
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
