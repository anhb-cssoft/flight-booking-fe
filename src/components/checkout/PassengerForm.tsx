"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  Briefcase,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/store/useBookingStore";

interface PassengerFormProps {
  index: number;
  dictionary: any;
}

export function PassengerForm({ index, dictionary }: PassengerFormProps) {
  const { control, watch, setValue } = useFormContext();
  const t = dictionary.checkout.form;
  const passengers = useBookingStore((state) => state.passengers);
  const toggleBaggage = useBookingStore((state) => state.toggleBaggage);
  const currentPassenger = passengers[index];
  const isBaggageSelected = watch(`passengers.${index}.add_baggage`);

  const handleBaggageToggle = () => {
    const newValue = !isBaggageSelected;
    setValue(`passengers.${index}.add_baggage`, newValue);
    if (currentPassenger) toggleBaggage(currentPassenger.id);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-[2rem] bg-white pt-0">
        <CardContent className="p-0">
          {/* Header synced with Sidebar */}
          <div className="bg-slate-900 px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                <User className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-widest">
                {dictionary.checkout.passenger} {index + 1}
              </h3>
            </div>
            <div className="px-3 py-1 rounded-full bg-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-700">
              {currentPassenger?.type || "Adult"}
            </div>
          </div>

          <div className="p-6 md:p-10 pt-0 md:pt-0 space-y-10">
            <div className="h-6" />

            {/* Unified Name Row with Mobile Support */}
            <div className="space-y-0">
              <div className="flex flex-col md:grid md:grid-cols-12 border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all bg-white">
                {/* Title */}
                <div className="md:col-span-3 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/50">
                  <FormField
                    control={control}
                    name={`passengers.${index}.title`}
                    render={({ field }) => (
                      <FormItem className="space-y-0 h-full">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="!h-14 border-0 bg-transparent rounded-none focus:ring-0 shadow-none px-6 font-bold text-slate-900 w-full">
                              <SelectValue placeholder="Title" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent
                            className="rounded-xl border-slate-200"
                            align="start"
                            sideOffset={4}
                          >
                            <SelectItem value="mr">Mr.</SelectItem>
                            <SelectItem value="mrs">Mrs.</SelectItem>
                            <SelectItem value="ms">Ms.</SelectItem>
                            <SelectItem value="miss">Miss</SelectItem>
                            <SelectItem value="dr">Dr.</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                {/* First Name */}
                <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-slate-200">
                  <FormField
                    control={control}
                    name={`passengers.${index}.first_name`}
                    render={({ field }) => (
                      <FormItem className="space-y-0 h-full">
                        <FormControl>
                          <Input
                            placeholder={t.firstName}
                            {...field}
                            className="h-14 border-0 bg-transparent rounded-none focus-visible:ring-0 px-6 font-medium placeholder:text-slate-400"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                {/* Last Name */}
                <div className="md:col-span-4">
                  <FormField
                    control={control}
                    name={`passengers.${index}.last_name`}
                    render={({ field }) => (
                      <FormItem className="space-y-0 h-full">
                        <FormControl>
                          <Input
                            placeholder={t.lastName}
                            {...field}
                            className="h-14 border-0 bg-transparent rounded-none focus-visible:ring-0 px-6 font-medium placeholder:text-slate-400"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-x-4 px-2 mt-2">
                <FormMessage
                  name={`passengers.${index}.title`}
                  className="text-[10px] font-bold"
                />
                <FormMessage
                  name={`passengers.${index}.first_name`}
                  className="text-[10px] font-bold"
                />
                <FormMessage
                  name={`passengers.${index}.last_name`}
                  className="text-[10px] font-bold"
                />
              </div>
            </div>

            {/* Gender & DOB */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <FormLabel className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                  {t.gender}
                </FormLabel>
                <FormField
                  control={control}
                  name={`passengers.${index}.gender`}
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="!h-14 bg-slate-50 border-slate-200 rounded-2xl px-6 font-bold hover:bg-slate-100/50 transition-colors w-full">
                            <SelectValue placeholder="Gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent
                          className="rounded-xl border-slate-200"
                          align="start"
                          sideOffset={4}
                        >
                          <SelectItem value="m">Male</SelectItem>
                          <SelectItem value="f">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[10px] font-bold mt-1.5" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-3">
                <FormLabel className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                  {t.bornOn}
                </FormLabel>
                <FormField
                  control={control}
                  name={`passengers.${index}.born_on`}
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <div className="relative group">
                          <Input
                            type="date"
                            {...field}
                            className="h-14 bg-slate-50 border-slate-200 rounded-2xl pl-12 pr-6 font-bold focus:ring-primary/20 transition-all w-full"
                          />
                          <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold mt-1.5" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Baggage Section */}
            <div
              className={cn(
                "p-5 md:p-6 rounded-[1.5rem] border-2 transition-all cursor-pointer group",
                isBaggageSelected
                  ? "bg-primary/5 border-primary shadow-md shadow-primary/10"
                  : "bg-slate-50/50 border-slate-200 hover:border-primary/40",
              )}
              onClick={handleBaggageToggle}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 md:gap-5">
                  <div
                    className={cn(
                      "h-12 w-12 md:h-14 md:w-14 rounded-2xl flex items-center justify-center transition-colors shrink-0",
                      isBaggageSelected
                        ? "bg-primary text-white"
                        : "bg-white text-slate-400 border border-slate-100",
                    )}
                  >
                    <Briefcase className="h-6 w-6 md:h-7 md:w-7" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 tracking-tight text-sm md:text-base">
                      Add Checked Bag (23kg)
                    </h4>
                    <p className="text-xs md:text-sm text-slate-500 font-medium">
                      Extra space for your belongings
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-base md:text-lg font-black text-slate-900">
                      + $30.00
                    </p>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                      Per flight
                    </p>
                  </div>
                  <div
                    className={cn(
                      "h-7 w-7 md:h-8 md:w-8 rounded-full border-2 flex items-center justify-center transition-all",
                      isBaggageSelected
                        ? "bg-primary border-primary text-white scale-110"
                        : "border-slate-200 text-transparent group-hover:border-primary/40",
                    )}
                  >
                    <Check className="h-4 w-4 md:h-5 md:w-5 stroke-[4px]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            {index === 0 && (
              <div className="pt-10 mt-6 border-t border-slate-100 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-1 w-12 bg-primary rounded-full" />
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900">
                    Contact Information
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <FormField
                    control={control}
                    name={`passengers.${index}.email`}
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                          {t.email}
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              placeholder={t.placeholders.email}
                              {...field}
                              className="h-14 bg-slate-50 border-slate-200 rounded-2xl pl-12 focus:ring-primary/20 transition-all w-full"
                            />
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`passengers.${index}.phone_number`}
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                          {t.phoneNumber}
                        </FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              placeholder={t.placeholders.phoneNumber}
                              {...field}
                              className="h-14 bg-slate-50 border-slate-200 rounded-2xl pl-12 focus:ring-primary/20 transition-all w-full"
                            />
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
