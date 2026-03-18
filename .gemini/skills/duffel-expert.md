# SKILL.md - Flight Booking Expert (Duffel API)

This skill provides deep knowledge of flight booking systems and the Duffel Flights API.

## Core Concepts
1. **Slices & Segments:** A slice is a leg of the journey (e.g., London to Paris). A segment is a flight with a specific flight number.
2. **Offers vs. Offer Requests:**
   - **Offer Request:** The search query (Origin, Destination, Dates, Passengers).
   - **Offer:** A specific priced itinerary returned by the API. Offers have a finite life (they "expire").
3. **Passengers:** Duffel defines passengers by type: `adult`, `child`, `infant_without_seat`.
4. **Orders:** A confirmed booking. Orders are created from an `offer_id`.

## Technical Implementation (Duffel API)
- **Suggestions:** Use `/airports/suggestions` for auto-suggest with a query string.
- **Search (Offer Requests):** Requires an array of slices. Each slice must specify `origin`, `destination`, and `departure_date` (ISO-8601).
- **Price Precision:** All prices in Duffel are strings (e.g., `"124.50"`) to avoid floating-point errors. Always display the `currency` alongside the `total_amount`.
- **Validation Rules:**
  - Date of Birth (DOB) is mandatory for many airlines.
  - Passenger names must match government-issued IDs exactly.
- **Error Handling:** Duffel uses consistent error codes (e.g., `not_found`, `validation_error`). Always log the `request_id` for debugging.

## UX Best Practices
- **Cabin Classes:** Map `economy`, `premium_economy`, `business`, and `first` clearly to the UI.
- **Duration Formatting:** Convert total minutes (e.g., `150`) into human-readable strings (e.g., `2h 30m`).
- **Stopovers:** Clearly indicate the number of stops and the layover duration for multi-segment flights.
- **Mobile First:** Flight lists are best viewed in vertically stacked cards on mobile, and a table/grid on desktop.
