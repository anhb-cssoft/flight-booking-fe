# SkyBooker Documentation

SkyBooker is a modern, production-ready flight booking application built with Next.js and the Duffel Flights API. This document outlines the architectural decisions, design patterns, and technical details of the project.

---

## 🏗 Architectural Decisions

### 1. Framework & Rendering Strategy

- **Next.js (App Router):** I utilize the App Router for its robust support of **React Server Components (RSC)**.
- **Server-Side Rendering (SSR):** Used for the initial page load and SEO-sensitive content (like the homepage and metadata).
- **Client-Side Rendering (CSR):** Reserved for highly interactive parts of the application, such as the flight search results (filtering/sorting) and the passenger details form.
- **Server Actions & Route Handlers:** All interactions with the **Duffel API** are handled via Next.js Route Handlers (`/api/duffel/*`). This ensures the `DUFFEL_ACCESS_TOKEN` remains secure on the server and is never exposed to the client.

### 2. Component Structure

The project follows a modular, feature-based directory structure in `src/components`:

- `search/`: Components related to flight search (Airport auto-suggest, Date pickers, Passenger counters).
- `results/`: Flight listing, filtering, and sorting logic.
- `checkout/`: Passenger information forms and booking confirmation.
- `my-bookings/`: Responsive flight history cards with `localStorage` persistence for review.
- `ui/`: Reusable, low-level UI primitives (Buttons, Inputs, Dialogs) built on top of **Shadcn UI**.
- `layout/`: Global layout elements like the Navbar and Footer.

### 3. State Management

- **Server State:** Handled by **TanStack Query (React Query)**. It manages fetching, caching, and synchronizing flight offers and airport suggestions, providing built-in support for loading and error states.
- **Client State:** Powered by **Zustand** (`src/store/useBookingStore.ts`). It persists the selected flight offer and passenger details across the multi-step booking flow, offering a lightweight alternative to Redux.
- **Form State:** Managed by **React Hook Form** with **Zod** for schema validation, ensuring a smooth and error-free data entry experience for users.

---

## 🔍 Competitor Analysis

My design was informed by studying major Online Travel Agencies (OTAs) like **Booking.com**, **Google Flights**, and **Skyscanner**:

- **What I adopted:**
  - **Google Flights' Minimalism:** I chose a clean, card-based layout for flight results to avoid information overload.
  - **Skyscanner's Search Layout:** A horizontal, prominent search bar that feels familiar to frequent travelers.
  - **Booking.com's Visual Cues:** Use of glassmorphism and subtle gradients to make the UI feel "alive" and modern.
- **What I avoided:**
  - **Dark Patterns:** I avoided high-pressure "urgency" banners and hidden fees often found on some OTA platforms.
  - **Clutter:** Many OTAs are overwhelmed with ads and cross-selling (hotels, cars). My focus remains strictly on a streamlined flight booking experience.

---

## ⚡ Performance & UX Optimizations

- **Debounced Search:** To reduce unnecessary API calls, the airport auto-suggest feature uses a custom `use-debounce` hook.
- **Optimistic UI & Prevention:**
  - The "Search" button is disabled during submission to prevent duplicate requests.
  - Loading skeletons are used extensively during data fetching to improve perceived performance.
- **Image Optimization:** The homepage background uses `next/image` with `.webp` format, responsive sizing (`sizes="100vw"`), and priority loading to prevent layout shifts (CLS).
- **Glassmorphism:** Strategic use of backdrop filters and semi-transparent backgrounds (`glass-card`, `glass-nav`) ensures a premium feel without sacrificing readability.

---

## 🤖 AI Tools Usage

This project was developed with the assistance of several AI tools to optimize the workflow and ensure technical accuracy:

- **ChatGPT:** I used ChatGPT to clarify complex requirements and gain a deeper understanding of the airline industry's business logic (e.g., flight slices, cabin classes, and passenger types).
- **Perplexity:** I utilized Perplexity for rapid research of the **Duffel API documentation**. It helped me quickly identify specific endpoints, required parameters, and response structures without manual searching.
- **Gemini CLI:** This was my primary assistant for **brainstorming, planning, and task management**. I used it to scaffold the project structure, implement complex UI components, and handle the heavy lifting of the coding process.

### Impact

The combination of these tools allowed me to focus on high-level architectural decisions and user experience while significantly accelerating the development of the "Search" and "Results" phases.

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm.
- A Duffel API Access Token (Test environment recommended).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/anhb-cssoft/flight-booking-fe
    cd flight-booking-fe
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure environment variables:**
    Create a `.env.local` file in the root directory:
    ```env
    DUFFEL_ACCESS_TOKEN=your_duffel_token_here
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```
