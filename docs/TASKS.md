# Tasks Checklist - SkyBooker

## Phase 1: Foundation (COMPLETED)
- [x] Initialize Next.js 15 project with TypeScript & Tailwind CSS.
- [x] Configure i18n with multi-language support (EN/VI).
- [x] Set up TanStack Query for server state management.
- [x] Install and configure basic Shadcn UI components.
- [x] Design layout with Navbar and Footer.

## Phase 2: Search Enhancement (COMPLETED)
- [x] Request user geolocation on mount.
- [x] Implement `/api/duffel/nearby` for airport suggestions based on location.
- [x] Add debouncing to airport search input to reduce API calls.
- [x] Categorize suggestions (Nearby Airports / Popular Destinations) for empty input.
- [x] Validate return date for round-trip flights using Zod.
- [x] Add multi-city flight selection logic.

## Phase 3: Results Listing (UPCOMING)
- [ ] Implement search submission and navigation to `/results`.
- [ ] Create `/api/duffel/offers` route handler to fetch flight offers.
- [ ] Design and implement flight search results page with loading skeletons.
- [ ] Build reusable `FlightCard` component (Price, Airline, Times, Duration, Stops).
- [ ] Add sorting functionality (Price, Duration, Departure Time).
- [ ] Implement filtering sidebar (Stops, Airlines, Time ranges).
- [ ] Handle empty states and offer expiration.

## Phase 4: Passenger Details
- [ ] Design and implement the `/checkout` page.
- [ ] Create a multi-step form for entering passenger details.
- [ ] Integrate form validation using React Hook Form and Zod.
- [ ] Display a pinned trip summary to guide the user.
- [ ] Persist passenger data in local storage or global state.

## Phase 5: Booking & Confirmation
- [ ] Implement `/api/duffel/orders` for order creation.
- [ ] Create order confirmation page (`/confirmation/[id]`).
- [ ] Display order summary and airline reference codes.
- [ ] Handle payment simulation/errors using Duffel's test environment.

## Phase 6: Finalization
- [ ] Review and clean up code consistency.
- [ ] Conduct end-to-end testing (Playwright or manual).
- [ ] Finalize documentation (Architecture decisions, setup guide, AI tool usage).
- [ ] Deploy to Vercel/Netlify.
- [ ] Perform accessibility (a11y) check.
