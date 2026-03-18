"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { CalendarIcon, Briefcase, Plus, X } from "lucide-react";
import { format } from "date-fns";
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
import { AirportSearch } from "./AirportSearch";
import { PassengerPicker } from "./PassengerPicker";

interface SearchFormProps {
  dictionary: any;
  common: any;
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
});

type SearchFormValues = z.infer<ReturnType<typeof createSearchSchema>>;

export function SearchForm({ dictionary, common }: SearchFormProps) {
  const searchSchema = createSearchSchema(dictionary);
  
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      tripType: "round-trip",
      flights: [{ origin: "", destination: "", departureDate: new Date() }],
      passengers: { adults: 1, children: 0 },
      cabinClass: "economy",
    },
  });

  const tripType = form.watch("tripType");
  const flights = form.watch("flights");

  useEffect(() => {
    if (tripType !== "multi-city" && flights.length > 1) {
      form.setValue("flights", [flights[0]]);
    }
  }, [tripType, flights.length, form]);

  function onSubmit(data: SearchFormValues) {
    console.log("Search Data:", data);
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
    <div className="glass-card rounded-[2rem] p-8 shadow-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Trip Type Selector */}
          <div className="flex flex-wrap items-center gap-6 pb-2 border-b">
            <FormField
              control={form.control}
              name="tripType"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="round-trip" />
                        </FormControl>
                        <FormLabel className="font-medium cursor-pointer">{dictionary.tripType.roundTrip}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="one-way" />
                        </FormControl>
                        <FormLabel className="font-medium cursor-pointer">{dictionary.tripType.oneWay}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="multi-city" />
                        </FormControl>
                        <FormLabel className="font-medium cursor-pointer">{dictionary.tripType.multiCity}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="h-6 w-px bg-slate-200" />

            {/* Cabin Class */}
            <FormField
              control={form.control}
              name="cabinClass"
              render={({ field }) => (
                <FormItem className="w-44 space-y-0">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-0 bg-transparent p-0 h-12 focus:ring-0 shadow-none font-medium">
                        <Briefcase className="mr-2 h-4 w-4 opacity-50" />
                        <SelectValue placeholder={dictionary.form.cabin} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="economy">{common.economy}</SelectItem>
                      <SelectItem value="premium_economy">{common.premium_economy}</SelectItem>
                      <SelectItem value="business">{common.business}</SelectItem>
                      <SelectItem value="first">{common.first}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="h-6 w-px bg-slate-200" />

            {/* Passengers */}
            <FormField
              control={form.control}
              name="passengers"
              render={({ field }) => (
                <FormItem className="w-auto space-y-0">
                  <FormControl>
                    <PassengerPicker
                      value={field.value}
                      onChange={field.onChange}
                      common={common}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 pt-4">
            {flights.map((_, index) => (
              <div key={index} className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-start group">
                <div className="lg:col-span-5">
                  <FormField
                    control={form.control}
                    name={`flights.${index}.origin`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(index > 0 && "lg:sr-only")}>{dictionary.form.origin}</FormLabel>
                        <FormControl>
                          <AirportSearch
                            placeholder={dictionary.form.originPlaceholder}
                            value={field.value}
                            onChange={field.onChange}
                            isOrigin={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="lg:col-span-4">
                  <FormField
                    control={form.control}
                    name={`flights.${index}.destination`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={cn(index > 0 && "lg:sr-only")}>{dictionary.form.destination}</FormLabel>
                        <FormControl>
                          <AirportSearch
                            placeholder={dictionary.form.destinationPlaceholder}
                            value={field.value}
                            onChange={field.onChange}
                            isOrigin={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="lg:col-span-3">
                  {tripType === "round-trip" && index === 0 ? (
                    <FormItem>
                      <FormLabel>{dictionary.form.dates}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal h-12 truncate",
                                !flights[0].departureDate && "text-muted-foreground"
                              )}
                            >
                              <span className="truncate">
                                {flights[0].departureDate ? (
                                  form.watch("returnDate") ? (
                                    `${format(flights[0].departureDate, "MMM d")} - ${format(form.watch("returnDate")!, "MMM d")}`
                                  ) : (
                                    `${format(flights[0].departureDate, "MMM d")} - ${dictionary.form.return}`
                                  )
                                ) : (
                                  dictionary.form.datesPlaceholder
                                )}
                              </span>
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50 shrink-0" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            selected={{
                              from: flights[0].departureDate,
                              to: form.watch("returnDate")
                            }}
                            onSelect={(range: DateRange | undefined) => {
                              if (range?.from) {
                                form.setValue(`flights.0.departureDate`, range.from);
                              }
                              form.setValue("returnDate", range?.to);
                            }}
                            disabled={(date) => date < new Date()}
                            numberOfMonths={2}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  ) : (
                    <FormField
                      control={form.control}
                      name={`flights.${index}.departureDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={cn(index > 0 && "lg:sr-only")}>{dictionary.form.departure}</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal h-12 truncate",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <span className="truncate">
                                    {field.value ? format(field.value, "PPP") : dictionary.form.datePlaceholder}
                                  </span>
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50 shrink-0" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {tripType === "multi-city" && index > 0 && (
                  <div className="lg:col-span-1 pb-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
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
                  className="text-primary hover:text-primary hover:bg-primary/5"
                  onClick={addFlight}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {dictionary.form.addFlight}
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="w-full md:w-auto px-12 text-lg h-12">
              {dictionary.form.search}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
