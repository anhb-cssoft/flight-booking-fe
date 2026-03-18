import { create } from "zustand";

interface PassengerDetails {
  id: string; // From Duffel Offer Passenger ID
  type: string;
  first_name: string;
  last_name: string;
  gender: "m" | "f";
  born_on: string;
  email: string;
  phone_number: string;
}

interface BookingState {
  // Data
  selectedOffer: any | null;
  passengers: PassengerDetails[];
  
  // UI Status
  isBooking: boolean;
  bookingError: string | null;
  orderConfirmation: any | null;

  // Actions
  selectOffer: (offer: any) => void;
  setPassengerDetails: (passengerId: string, details: Partial<PassengerDetails>) => void;
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
    const passengers = offerPassengers.map((p) => ({
      id: p.id,
      type: p.type,
      first_name: "",
      last_name: "",
      gender: "m",
      born_on: "",
      email: "",
      phone_number: "",
    }));
    set({ passengers });
  },

  setPassengerDetails: (passengerId, details) =>
    set((state) => ({
      passengers: state.passengers.map((p) =>
        p.id === passengerId ? { ...p, ...details } : p
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
