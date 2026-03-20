# Development Process – Flight Booking App

## 1. Approach & Thought Process

I started by clarifying the requirements using AI tools, then applied a research-first approach:

- Analyzed industry products (Google Flights, Booking.com, Skyscanner)
- Identified the common flow: search → results → checkout
- Broke the problem into core modules:
  - Search
  - Offers
  - Checkout
  - Error handling & resilience

Key assumption:

- The frontend acts as a "smart proxy" to protect API keys and handle UX complexity.

---

## 2. Design Decisions

- **Next.js (App Router)**  
  Used to separate server/client logic and implement an API proxy via route handlers.  
  → Ensures "API hygiene": no secret keys exposed to the client and full control over request handling on the server.

- **Zustand**  
  Lightweight global state for search and passenger data.  
  Trade-off: less powerful than Redux for large-scale applications, but sufficient for this scope.

- **React Query (TanStack Query)**  
  Handles server state, caching, and prevents redundant API calls.

- **Shadcn UI + Tailwind CSS**  
  Enables fast, consistent, and responsive UI development.

---

## 3. Testing Strategy

Focused on practical scenarios:

- Validate search logic (dates, inputs)
- Handle API errors and empty states safely
- Prevent excessive API calls (debounce, disable repeated actions)
- Test UI across devices (mobile → desktop)

---

## 4. AI Tools Usage

I used AI as a **productivity layer** to accelerate development while keeping engineering decisions under control:

- **ChatGPT**
  - Requirement analysis
  - Architecture suggestions
  - Prompt generation for Gemini CLI

- **Perplexity**
  - API documentation research (Duffel API)

- **Gemini CLI**
  - Code implementation support
  - Workflow setup
  - Generating project structure (rules, skills, etc.)
  - Assisting with logic validation and commit improvements

---

## 5. Workflow

1. Clarify requirements & define architecture
2. Plan structure (components, state, API flow)
3. Implement incrementally (feature-by-feature)
4. Validate with real-world scenarios
5. Refine UX and performance

Git:

- Feature-based commits with clear messages

---

## 6. Improvements

- Add unit tests (Vitest)
- Introduce Storybook for component scalability
- Move filters to URL for better shareability
- Improve loading states (skeleton UI)

## 7. Run project

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
