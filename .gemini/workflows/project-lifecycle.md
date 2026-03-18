# Project Lifecycle - Flight Booking

This workflow outlines the end-to-end development process for the Duffel-powered flight booking application.

## Phase 1: Research & Project Setup
- [ ] Initialize Next.js project (App Router, TS, Tailwind).
- [ ] Install: `duffel`, `lucide-react`, `shadcn/ui`, `zod`, `react-hook-form`, `react-query`.
- [ ] Set up `.env.local` with `DUFFEL_ACCESS_TOKEN`.
- [ ] Define shared types for Search and Passenger entities.

## Phase 2: Core Components & Layout
- [ ] Setup `shadcn/ui` foundational components.
- [ ] Create Global Navigation and Footer.
- [ ] Implement responsive layouts for mobile/desktop.

## Phase 3: Screen 1 - Flight Search
- [ ] Build `SearchForm` with IATA suggestions (via Duffel SDK).
- [ ] Implement date and passenger selections.
- [ ] Basic validation (Origin vs Destination, future dates).

## Phase 4: Screen 2 - Flight Results
- [ ] Create `FlightCard` for listing results.
- [ ] Implement sorting (Price/Duration) and filtering (Stops/Airline).
- [ ] Handle Loading/Empty/Error states via Skeletons and UI feedback.

## Phase 5: Screen 3 - Passenger Details
- [ ] Build multi-passenger form with robust Zod validation.
- [ ] Manage passenger state in Context or Zustand.

## Phase 6: Screen 4 - Order Confirmation
- [ ] Handle booking submission via Duffel `orders` API.
- [ ] Display confirmation summary and handle failures clearly.

## Phase 7: Validation & Deployment
- [ ] Manual walkthrough and automated tests.
- [ ] Write architectural and AI usage documentation.
- [ ] Deploy to production (Vercel).
