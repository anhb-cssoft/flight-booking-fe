"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface Airport {
  id: string;
  name: string;
  iata_code: string;
  city_name: string;
}

interface SuggestionContextType {
  coords: { lat: number; lng: number } | null;
  originSuggestions: Airport[];
  destinationSuggestions: Airport[];
  isLoadingSuggestions: boolean;
  setOriginSuggestions: (suggestions: Airport[]) => void;
  setDestinationSuggestions: (suggestions: Airport[]) => void;
  fetchSuggestions: () => Promise<void>;
}

const SuggestionContext = createContext<SuggestionContextType | undefined>(undefined);

const POPULAR_DESTINATIONS_IATA = ["LHR", "DXB", "SIN", "CDG", "JFK", "SGN", "HAN"];

export function SuggestionProvider({ children }: { children: React.ReactNode }) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [originSuggestions, setOriginSuggestions] = useState<Airport[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Airport[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Geolocation permission denied or error:", error.message);
        }
      );
    }
  }, []);

  const fetchSuggestions = async () => {
    if (hasFetched || isLoadingSuggestions) return;
    setIsLoadingSuggestions(true);

    try {
      // Fetch Origin (Nearby) Suggestions if coords exist
      if (coords) {
        const nearbyRes = await fetch(`/api/duffel/nearby?lat=${coords.lat}&lng=${coords.lng}`);
        if (nearbyRes.ok) {
          const data = await nearbyRes.json();
          setOriginSuggestions(data.data || []);
        }
      }

      // Fetch Popular Destinations
      const popularCities = ["London", "Dubai", "Singapore", "New York", "Paris", "Ho Chi Minh City", "Hanoi"];
      const randomCity = popularCities[Math.floor(Math.random() * popularCities.length)];
      
      const popularRes = await fetch(`/api/duffel/suggestions?query=${encodeURIComponent(randomCity)}`);
      if (popularRes.ok) {
        const data = await popularRes.json();
        setDestinationSuggestions(data.data || []);
      }

      setHasFetched(true);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  return (
    <SuggestionContext.Provider
      value={{
        coords,
        originSuggestions,
        destinationSuggestions,
        isLoadingSuggestions,
        setOriginSuggestions,
        setDestinationSuggestions,
        fetchSuggestions,
      }}
    >
      {children}
    </SuggestionContext.Provider>
  );
}

export function useSuggestions() {
  const context = useContext(SuggestionContext);
  if (context === undefined) {
    throw new Error("useSuggestions must be used within a SuggestionProvider");
  }
  return context;
}
