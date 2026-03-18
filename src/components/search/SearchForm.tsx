"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { CalendarIcon, Briefcase, Plus, X } from "lucide-react";
import { format, isAfter, isBefore, startOfDay } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter, useParams } from "next/navigation";
import { AirportSearch } from "./AirportSearch";
import { PassengerPicker } from "./PassengerPicker";

interface SearchFormProps {
  dictionary: any;
  common: any;
  initialData?: any;
}

const createSearchSchema = (t: any) => z.object({
  tripType: z.enum(["round-trip", "one-way", "multi-city"]),
  flights: z.array(z.object({
    origin: z.string().min(3, t.form.errors.origin),
    destination: z.string().min(3, t.form.errors.destination),
    departureDate: z.date(),
  })).min(1),
  returnDate: z.date().optional(),
  passengers: z.object({
    adults: z.number().min(1),
    children: z.number().min(0),
  }),
  cabinClass: z.enum(["economy", "premium_economy", "business", "first"]),
}).refine((data) => {
  if (data.tripType === "round-trip" && !data.returnDate) {
    return false;
  }
  return true;
}, {
  message: t.form.errors.returnDate,
  path: ["returnDate"],
});

type SearchFormValues = z.infer<ReturnType<typeof createSearchSchema>>;

export function SearchForm({ dictionary, common, initialData }: SearchFormProps) {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const searchSchema = createSearchSchema(dictionary);

  const getInitialValues = () => {
    if (initialData) {
      const isRoundTrip = initialData.slices.length === 2 && 
                         initialData.slices[0].origin === initialData.slices[1].destination;
      const isMultiCity = initialData.slices.length > 2 || 
                         (initialData.slices.length === 2 && !isRoundTrip);

      return {
        tripType: isRoundTrip ? "round-trip" : (isMultiCity ? "multi-city" : "one-way"),
        flights: initialData.slices.map((s: any) => ({
          origin: s.origin,
          destination: s.destination,
          departureDate: new Date(s.departure_date),
        })).slice(0, isRoundTrip ? 1 : initialData.slices.length),
        returnDate: isRoundTrip ? new Date(initialData.slices[1].departure_date) : undefined,
        passengers: {
          adults: initialData.passengers.filter((p: any) => p.type === "adult").length,
          children: initialData.passengers.filter((p: any) => p.type === "child").length,
        },
        cabinClass: initialData.cabin_class,
      };
    }
    return {
      tripType: "round-trip",
      flights: [{ origin: "", destination: "", departureDate: new Date() }],
      passengers: { adults: 1, children: 0 },
      cabinClass: "economy",
    };
  };

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: getInitialValues() as any,
  });

  useEffect(() => {
    if (initialData) {
      form.reset(getInitialValues() as any);
    }
  }, [initialData, form]);

  const tripType = form.watch("tripType");
  const flights = form.watch("flights");
  const returnDate = form.watch("returnDate");

  useEffect(() => {
    if (tripType !== "multi-city" && flights.length > 1) {
      form.setValue("flights", [flights[0]]);
    }
  }, [tripType, flights.length, form]);

  function onSubmit(data: SearchFormValues) {
    const slices = data.flights.map(f => ({
      origin: f.origin,
      destination: f.destination,
      departure_date: format(f.departureDate, "yyyy-MM-dd"),
    }));

    if (data.tripType === "round-trip" && data.returnDate) {
      slices.push({
        origin: data.flights[0].destination,
        destination: data.flights[0].origin,
        departure_date: format(data.returnDate, "yyyy-MM-dd"),
      });
    }

    const passengers = [
      ...Array(data.passengers.adults).fill({ type: "adult" }),
      ...Array(data.passengers.children).fill({ type: "child" }),
    ];

    const searchData = {
      slices,
      passengers,
      cabin_class: data.cabinClass,
    };

    const encodedData = Buffer.from(JSON.stringify(searchData)).toString("base64");
    router.push(`/${lang}/results?q=${encodedData}`);
  }

  const addFlight = () => {
    const currentFlights = form.getValues("flights");
    form.setValue("flights", [
      ...currentFlights,
      { origin: "", destination: "", departureDate: new Date() }
    ]);
  };

  const removeFlight = (index: number) => {
    const currentFlights = form.getValues("flights");
    if (currentFlights.length > 1) {
      form.setValue("flights", currentFlights.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="glass-card rounded-[2rem] p-4 md:p-8 shadow-2xl mx-auto w-full max-w-6xl overflow-hidden">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 pb-6 lg:pb-4 border-b">
            <FormField
              control={form.control}
              name="tripType"
              render={({ field }) => (
                <FormItem className="space-y-0 w-full lg:w-auto overflow-x-auto no-scrollbar">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex items-center space-x-4 lg:space-x-6 min-w-max pb-2 lg:pb-0"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="round-trip" /></FormControl>
                        <FormLabel className="font-bold text-sm cursor-pointer whitespace-nowrap text-slate-700">{dictionary.tripType.roundTrip}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="one-way" /></FormControl>
                        <FormLabel className="font-bold text-sm cursor-pointer whitespace-nowrap text-slate-700">{dictionary.tripType.oneWay}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="multi-city" /></FormControl>
                        <FormLabel className="font-bold text-sm cursor-pointer whitespace-nowrap text-slate-700">{dictionary.tripType.multiCity}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="hidden lg:block h-8 w-px bg-slate-200" />

            <div className="flex items-center gap-4 lg:gap-6 w-full lg:w-auto">
              <FormField
                control={form.control}
                name="cabinClass"
                render={({ field }) => (
                  <FormItem className="flex-1 lg:w-44 space-y-0 min-w-0">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-0 bg-transparent p-0 h-10 focus:ring-0 shadow-none font-bold text-sm text-slate-700">
                          <div className="flex items-center truncate">
                            <Briefcase className="mr-2 h-4 w-4 opacity-60 shrink-0" />
                            <div className="truncate"><SelectValue placeholder={dictionary.form.cabin} /></div>
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-slate-200">
                        <SelectItem value="economy">{common.economy}</SelectItem>
                        <SelectItem value="premium_economy">{common.premium_economy}</SelectItem>
                        <SelectItem value="business">{common.business}</SelectItem>
                        <SelectItem value="first">{common.first}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <div className="h-6 w-px bg-slate-200 shrink-0" />

              <FormField
                control={form.control}
                name="passengers"
                render={({ field }) => (
                  <FormItem className="flex-1 md:w-auto space-y-0 min-w-0">
                    <FormControl>
                      <PassengerPicker value={field.value} onChange={field.onChange} common={common} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-6 pt-4">
            {flights.map((_, index) => (
              <div key={index} className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-end group relative">
                <div className="lg:col-span-5 min-w-0">
                  <FormField
                    control={form.control}
                    name={`flights.${index}.origin`}
                    render={({ field }) => (
                      <FormItem className="min-w-0">
                        <FormLabel className={cn("font-bold text-xs uppercase tracking-widest text-slate-400 ml-1", index > 0 && "lg:sr-only")}>{dictionary.form.origin}</FormLabel>
                        <FormControl>
                          <AirportSearch
                            placeholder={dictionary.form.originPlaceholder}
                            value={field.value}
                            onChange={field.onChange}
                            isOrigin={true}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="lg:col-span-5 min-w-0">
                  <FormField
                    control={form.control}
                    name={`flights.${index}.destination`}
                    render={({ field }) => (
                      <FormItem className="min-w-0">
                        <FormLabel className={cn("font-bold text-xs uppercase tracking-widest text-slate-400 ml-1", index > 0 && "lg:sr-only")}>{dictionary.form.destination}</FormLabel>
                        <FormControl>
                          <AirportSearch
                            placeholder={dictionary.form.destinationPlaceholder}
                            value={field.value}
                            onChange={field.onChange}
                            isOrigin={false}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="lg:col-span-2 min-w-0">
                  {tripType === "round-trip" && index === 0 ? (
                    <FormItem className="min-w-0">
                      <FormLabel className="font-bold text-xs uppercase tracking-widest text-slate-400 ml-1">{dictionary.form.dates}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 pr-2 text-left font-bold h-12 truncate border-slate-200 rounded-2xl bg-white/50 hover:bg-white transition-all min-w-0",
                                form.formState.errors.returnDate && "border-destructive text-destructive bg-destructive/5",
                                !flights[0].departureDate && "text-slate-400"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-primary opacity-60 shrink-0" />
                              <span className="truncate flex-1 min-w-0 text-[13px]">
                                {flights[0].departureDate ? (
                                  returnDate ? (
                                    `${format(flights[0].departureDate, "MMM d")} - ${format(returnDate, "MMM d")}`
                                  ) : (
                                    `${format(flights[0].departureDate, "MMM d")} - ${dictionary.form.return}`
                                  )
                                ) : (
                                  dictionary.form.datesPlaceholder
                                )}
                              </span>
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-3xl border-slate-200 overflow-hidden shadow-2xl" align="start">
                          <Calendar
                            mode="range"
                            selected={{
                              from: flights[0].departureDate,
                              to: returnDate
                            }}
                            onSelect={(range: DateRange | undefined) => {
                              if (range?.from) {
                                form.setValue(`flights.0.departureDate`, range.from);
                                form.setValue("returnDate", range.to);
                                if (range.to) form.clearErrors("returnDate");
                              } else {
                                form.setValue("returnDate", undefined);
                              }
                            }}
                            disabled={(date) => isBefore(date, startOfDay(new Date()))}
                            numberOfMonths={2}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-[10px] font-bold">{form.formState.errors.returnDate?.message}</FormMessage>
                    </FormItem>
                  ) : (
                    <FormField
                      control={form.control}
                      name={`flights.${index}.departureDate`}
                      render={({ field }) => (
                        <FormItem className="min-w-0">
                          <FormLabel className={cn("font-bold text-xs uppercase tracking-widest text-slate-400 ml-1", index > 0 && "lg:sr-only")}>{dictionary.form.departure}</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 pr-2 text-left font-bold h-12 truncate border-slate-200 rounded-2xl bg-white/50 hover:bg-white transition-all min-w-0",
                                    !field.value && "text-slate-400"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4 text-primary opacity-60 shrink-0" />
                                  <span className="truncate flex-1 min-w-0 text-[13px]">
                                    {field.value ? format(field.value, "MMM d, yy") : dictionary.form.datePlaceholder}
                                  </span>
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-3xl border-slate-200 overflow-hidden shadow-2xl" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => isBefore(date, startOfDay(new Date()))}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage className="text-[10px] font-bold" />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {tripType === "multi-city" && index > 0 && (
                  <div className="absolute -right-2 top-0 lg:static lg:col-span-1 lg:flex lg:justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-destructive hover:bg-destructive/10 rounded-full"
                      onClick={() => removeFlight(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {tripType === "multi-city" && (
              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-primary hover:text-primary hover:bg-primary/5 rounded-xl font-bold border-primary/20"
                  onClick={addFlight}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {dictionary.form.addFlight}
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:justify-end gap-4 pt-6 border-t border-slate-100/50">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full md:w-auto px-16 h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {dictionary.form.search}...
                </div>
              ) : (
                dictionary.form.search
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
