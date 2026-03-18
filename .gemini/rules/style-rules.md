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

## 5. Multi-language Support (i18n)
- **Locales:** Support both English (`en`) and Vietnamese (`vi`).
- **Translation Keys:** Never hardcode strings in components. Use a dictionary-based approach (e.g., `dictionary[lang].search.title`).
- **Locale Detection:** Use middleware to detect and redirect users based on their preferred language or URL prefix (`/en/...`, `/vi/...`).
- **Formatting:** Use locale-aware formatting for dates, currencies, and numbers (e.g., `date-fns/locale` or `Intl.DateTimeFormat`).

## 6. Commit Rules
- **Structure:** Every commit message must include a concise **title** and a descriptive **detail/body**.
- **Format:**
  ```text
  <type>(<scope>): <title>

  - <detail 1>
  - <detail 2>
  ```
- **Type:** Use conventional commits (e.g., `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`).
- **Description:** The body should explain "why" the change was made, not just "what" changed.
- **Language:** Commit messages should be in English.
