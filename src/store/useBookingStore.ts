import { create } from "zustand";

interface PassengerDetails {
  id: string;
  type: string;
  title: "mr" | "mrs" | "ms" | "miss" | "dr";
  first_name: string;
  last_name: string;
  gender: "m" | "f";
  born_on: string;
  email: string;
  phone_number: string;
  add_baggage: boolean; // Thêm hành lý ký gửi
}

interface BookingState {
  selectedOffer: any | null;
  passengers: PassengerDetails[];
  isBooking: boolean;
  bookingError: string | null;
  orderConfirmation: any | null;

  selectOffer: (offer: any) => void;
  setPassengerDetails: (passengerId: string, details: Partial<PassengerDetails>) => void;
  toggleBaggage: (passengerId: string) => void;
  initPassengers: (offerPassengers: any[]) => void;
  resetBooking: () => void;
  setBookingStatus: (isBooking: boolean, error?: string | null) => void;
  setOrderConfirmation: (order: any) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedOffer: null,
  passengers: [],
  isBooking: false,
  bookingError: null,
  orderConfirmation: null,

  selectOffer: (offer) => set({ 
    selectedOffer: offer,
    orderConfirmation: null,
    bookingError: null 
  }),

  initPassengers: (offerPassengers) => {
    const passengers: PassengerDetails[] = offerPassengers.map((p) => ({
      id: p.id,
      type: p.type,
      title: "mr",
      first_name: "",
      last_name: "",
      gender: "m",
      born_on: "",
      email: "",
      phone_number: "",
      add_baggage: false,
    }));
    set({ passengers });
  },

  setPassengerDetails: (passengerId, details) =>
    set((state) => ({
      passengers: state.passengers.map((p) =>
        p.id === passengerId ? { ...p, ...details } : p
      ),
    })),

  toggleBaggage: (passengerId) =>
    set((state) => ({
      passengers: state.passengers.map((p) =>
        p.id === passengerId ? { ...p, add_baggage: !p.add_baggage } : p
      ),
    })),

  setBookingStatus: (isBooking, error = null) => 
    set({ isBooking, bookingError: error }),

  setOrderConfirmation: (order) => 
    set({ orderConfirmation: order, isBooking: false }),

  resetBooking: () =>
    set({
      selectedOffer: null,
      passengers: [],
      isBooking: false,
      bookingError: null,
      orderConfirmation: null,
    }),
}));
