# FE_SKILL.md - Frontend Expert (Next.js & React)

This skill provides expert guidance on building high-performance, accessible, and maintainable frontend applications using the modern Next.js ecosystem.

## Core Architecture
1. **Server vs. Client Components:**
   - **Server Components (RSC):** Default for data fetching (Duffel API calls on the server), SEO, and reducing bundle size.
   - **Client Components:** Used for interactivity (forms, search inputs, airport suggestions, tab switching).
2. **Data Fetching:**
   - Use **TanStack Query (React Query)** for client-side state, caching, and optimistic updates.
   - Use **Server Actions** for mutations (e.g., creating a booking) to handle form submissions securely.
3. **Form Management:**
   - **React Hook Form + Zod:** Mandatory for complex forms (Passenger Details).
   - Implement real-time validation for DOB, email, and mandatory fields.

## UI & Styling
1. **Design System:** Use **Tailwind CSS** for rapid styling and **Shadcn UI** for accessible, unstyled primitives.
2. **Loading States:**
   - Use `loading.tsx` for page-level transitions.
   - Use **Skeletons** for component-level loading (e.g., `FlightCardSkeleton` while waiting for search results).
3. **Responsiveness (Cross-Device Strategy):**
   - **Mobile (Base):** Focus on vertical scrolling and thumb-friendly touch targets (min 44x44px). Hide non-essential info (e.g., detailed baggage rules) behind drawers or modals.
   - **Tablet (md):** Utilize the extra width for sidebars (e.g., filter panels) or 2-column layouts for cards. Ensure input focus doesn't trigger zoom-in bugs on iOS.
   - **Desktop (lg/xl):** Optimize for high information density. Flight cards should be horizontal for easy comparison of times/prices across rows. Use sticky headers for the search criteria to allow quick changes.
4. **Accessibility (A11y):**
   - Ensure high contrast ratios.
   - Use semantic HTML (`<main>`, `<section>`, `<article>`).
   - Proper `aria-labels` for interactive elements like the Date Picker and Combobox.

## Performance Optimization
1. **Next/Image:** Always use for airline logos and promotional banners to prevent Layout Shift (CLS).
2. **Dynamic Imports:** Use for heavy components (e.g., Maps or large modal content) that aren't needed on the initial paint.
3. **Debouncing:** Crucial for the airport auto-suggest search to minimize unnecessary API hits to Duffel.

## OTA UX Patterns (Best Practices)
1. **Sticky Trip Summary:** In the checkout flow, keep the selected flight details (times, price, route) visible to the user at all times to increase confidence.
2. **Horizontal Discovery:** For the search results page, use a horizontal "Date Grid" or "Price Tabs" (e.g., Best, Cheapest, Fastest) to allow quick comparison without scrolling.
3. **Progressive Disclosure:** For complex passenger forms, group related fields and use a multi-step stepper or accordion to avoid overwhelming the user.
4. **Visual Hierarchy:** Airline logos should be at least 32x32px and have high visibility to help users recognize their preferred carriers instantly.

## State Management Strategy
- **URL Params:** Store search criteria (Origin, Destination, Dates) in the URL for shareable search results.
- **Zustand/Context:** Manage "Shopping Cart" state (selected offer) and passenger data across the multi-step booking flow.
- **Persistence:** Consider `localStorage` for "Recent Searches."
