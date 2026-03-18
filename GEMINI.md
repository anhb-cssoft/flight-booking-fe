# GEMINI.md - Flight Booking Project Mandates

## Core Principles
- **User-Centric Design:** Every screen must feel "alive," responsive, and production-ready.
- **Type Safety:** Use strict TypeScript. Avoid `any`. Define clear interfaces for Duffel API responses (Offers, Orders, Passengers).
- **Resilience:** Handle loading states, empty results, and API errors gracefully with clear feedback to the user.
- **Component Modularity:** Build small, reusable components (e.g., `FlightCard`, `SearchForm`, `PassengerInput`).

## Tech Stack Preferences
- **Framework:** Next.js (App Router) with Server Components for data fetching where appropriate.
- **Styling:** Tailwind CSS for layout and responsiveness.
- **UI Components:** Shadcn UI (Radix UI) for polished, accessible primitives (Combobox, Date Picker, Dialog).
- **State Management:** 
  - **Server State:** TanStack Query (React Query) for caching and fetching flight offers.
  - **Client State:** React Context or Zustand for the search criteria and passenger data.
  - **Form Handling:** React Hook Form + Zod for robust validation.
- **API Integration:** Duffel official Node/TypeScript SDK.

## Project-Specific Rules
1. **Duffel API Hygiene:** Never expose the Duffel Access Token in client-side code. Use Next.js Route Handlers (`app/api/...`) to proxy requests if needed, or Server Actions.
2. **IATA Codes:** Use a local mapping or the Duffel `suggestions` endpoint for airport auto-suggest.
3. **Responsive Design:** Flight cards must be readable on mobile and desktop.
4. **Testing:** Unit tests for search logic and form validation (Vitest/Jest). E2E tests for the critical booking flow (Playwright/Cypress).

## Documentation
- Document all architectural decisions in the `docs/` folder or root `README.md`.
- Include a section on AI tool usage as per requirements.
