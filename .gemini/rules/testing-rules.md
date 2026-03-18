# Testing Rules - Flight Booking

This file defines the automated testing strategy for ensuring the correctness of the flight booking application.

## 1. Unit Testing (Vitest/Jest)
- **Business Logic:** Mandatory unit tests for search calculations, date range validations, and passenger type sorting.
- **Component Tests:** Test individual UI components (e.g., `FlightCard`) for correct rendering of props (Airline name, price currency).
- **Form Validation:** Verify that `PassengerForm` correctly identifies invalid emails, empty mandatory fields, and invalid DOBs.

## 2. E2E Testing (Playwright/Cypress)
- **The Critical Path:** One full E2E test covering the "Happy Path":
  1.  Searching for a flight from LHR to JFK.
  2.  Selecting the first available offer.
  3.  Entering valid passenger details.
  4.  Reaching the booking confirmation screen.
- **Failures:** One E2E test for the "Sad Path" (e.g., searching for non-existent routes or handling expired offers).

## 3. General Rules
- **Mocking:** Mock all Duffel API calls in unit and component tests to ensure speed and reliability.
- **Coverage:** Aim for 80%+ coverage on critical business logic folders (`lib/`, `hooks/`).
- **Test Naming:** Use clear, descriptive names: `should show error when return date is before departure date`.
- **Pre-commit:** All tests must pass before any code is pushed to the main branch.
