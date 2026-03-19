# Development Plan - SkyBooker

## 1. Architecture Overview
- **Framework:** Next.js (App Router) for improved SEO and performance via Server Components.
- **Language:** TypeScript for type safety and robust API interactions.
- **Styling:** Tailwind CSS for rapid UI development and responsive design.
- **UI Components:** Shadcn UI for high-quality, accessible, and customizable primitives.

## 2. State Management Strategy
- **Server State:** TanStack Query (React Query) for fetching flight offers and airport suggestions. This handles caching, loading states, and automatic refetching.
- **Client State:** React Context or Zustand for cross-page persistence of:
  - Search criteria (Origin, Destination, Dates, Passengers, Class).
  - Selected flight offer (before checkout).
  - Current booking progress.

## 3. API Integration (Duffel API)
- **Hygiene:** All API calls to Duffel will be proxied through Next.js Route Handlers (`src/app/api/...`) to keep the secret access token server-side.
- **Endpoints:**
  - `GET /api/duffel/suggestions`: Airport search.
  - `GET /api/duffel/nearby`: Geolocation-based airport suggestions (using city lookup).
  - `POST /api/duffel/offers`: Fetching flight offers based on search criteria.
  - `POST /api/duffel/orders`: Creating the final flight booking.

## 4. User Experience Design
- **Search:** Intuitive form with geolocation-based defaults and polished date/passenger pickers.
- **Results:** Minimalist cards (inspired by Google Flights) with clear filters and sorting options.
- **Checkout:** A multi-step stepper to guide users through passenger data entry without overwhelming them.
- **Feedback:** Comprehensive loading skeletons and clear error messages (e.g., flight expired, seat unavailable).

## 5. Development Phases
1. **Phase 1: Foundation (COMPLETED):** Setup Next.js, i18n, and basic UI components.
2. **Phase 2: Search Enhancement (IN PROGRESS):** Geolocation, debounced suggestions, and validation.
3. **Phase 3: Results Listing:** Fetching offers, filtering, and sorting.
4. **Phase 4: Passenger Details:** Form handling with validation and progress tracking.
5. **Phase 5: Booking & Confirmation:** Order creation and success/error states.
6. **Phase 6: Finalization:** E2E testing, deployment, and documentation.
