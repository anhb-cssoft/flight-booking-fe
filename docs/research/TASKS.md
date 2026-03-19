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

## Phase 3: Results Listing (COMPLETED)

- [x] Implement search submission and navigation to `/results`.
- [x] Create `/api/duffel/offers` route handler to fetch flight offers.
- [x] Design and implement flight search results page with loading skeletons.
- [x] Build reusable `FlightCard` component (Price, Airline, Times, Duration, Stops).
- [x] Add sorting functionality (Price, Duration).
- [x] Implement filtering by stops.
- [x] Handle empty states and errors gracefully.

## Phase 4: Passenger Details (UPCOMING)

- [x] Design and implement the `/checkout` page.
- [x] Create a multi-step form for entering passenger details.
- [x] Integrate form validation using React Hook Form and Zod.
- [x] Display a pinned trip summary to guide the user.
- [x] Persist passenger data in local storage or global state.

## Phase 5: Booking & Confirmation

- [x] Implement `/api/duffel/orders` for order creation.
- [x] Create order confirmation page (`/confirmation/[id]`).
- [x] Display order summary and airline reference codes.
- [x] Handle payment simulation/errors using Duffel's test environment.

## Phase 6: Finalization

- [x] Review and clean up code consistency.
- [x] Conduct end-to-end testing (Playwright or manual).
- [x] Finalize documentation (Architecture decisions, setup guide, AI tool usage).
- [x] Deploy to Vercel/Netlify.
- [x] Perform accessibility (a11y) check.
