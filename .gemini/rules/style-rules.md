# Style Rules - Flight Booking

This file defines the styling, naming, and UI/UX conventions for the flight booking application.

## 1. Naming & Organization
- **Tailwind Classes:** Organize Tailwind classes using a logical order (Layout -> Box Model -> Typography -> Visuals -> Transitions).
- **Component Naming:** Use PascalCase for React components and camelCase for props and functions.
- **File Naming:** Match file names to component names (e.g., `FlightCard.tsx`).

## 2. Visual Style & Themes
- **Color Palette:** Use standard Tailwind colors (e.g., `blue-600` for primary actions, `slate-50` for backgrounds).
- **Typography:** Use a clean, sans-serif font (e.g., `Inter`) for readability.
- **Interactions:** Every clickable element must have a visible `hover` and `focus` state.
- **Consistent Spacing:** Use standard Tailwind spacing units (`p-4`, `m-2`, `gap-4`).

## 3. Responsive Design Strategy
- **Mobile First:** Always design for mobile (`base` classes) and add `md:` or `lg:` breakpoints later.
- **Mobile (< 768px):** Use single-column layouts. Form fields should be full width. Flight cards stack metadata vertically. Navigation uses a hamburger menu or bottom bar.
- **Tablet (768px - 1024px):** Transition to multi-column layouts for search results (e.g., 2-column grids if appropriate). Use side paddings of `px-6` to `px-8`.
- **Desktop (> 1024px):** Full-width or centered containers with a max-width (e.g., `max-w-7xl`). Search bar becomes a horizontal bar. Flight cards show all metadata horizontally (Airline - Times - Duration - Price - Action).
- **Flexibility:** Use `flex-wrap` and `grid` systems to ensure components adapt smoothly without breaking.

## 4. Accessibility (A11y)
- **Contrast:** Ensure text color contrasts properly with backgrounds.
- **Alt Text:** Every image, including airline logos, must have a descriptive `alt` attribute.
- **Aria Labels:** Use `aria-label` for icons or elements without visible text.
- **Tab Index:** Ensure all interactive elements are reachable via keyboard navigation.

## 4. Reusability
- **UI Components:** Use **Shadcn UI** for foundational primitives (Buttons, Inputs, Dialogs).
- **Utility Hooks:** Extract common styling logic (e.g., `useActiveLink`) into custom hooks.
- **SVG Icons:** Prefer **Lucide React** for consistent iconography.
