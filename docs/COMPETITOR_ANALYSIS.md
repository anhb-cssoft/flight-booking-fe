# Competitor Analysis - Flight Booking App

## 1. Overview
Analysis of UI/UX patterns from **Booking.com**, **Google Flights**, and **Skyscanner/Kiwi** to inform the design of our Duffel-powered flight booking application.

## 2. Key Findings

### Search Interface
- **Competitor:** Booking.com
- **Observations:** Uses a prominent, horizontal search bar at the top with clear labels for Origin, Destination, Dates, and Passengers. It also features "Continue where you left off" and "Popular flights near you" cards to drive engagement.
- **Adoption:** We will adopt the **horizontal search layout** for desktop as it feels familiar and efficient. We'll also implement the **airport auto-suggest** with IATA codes prominently displayed.

### Results Listing (Flight Cards)
- **Competitor:** Google Flights
- **Observations:** Extremely minimalist. Flight cards are thin, showing only the airline logo, times, duration, stops, and price. A "Best" vs "Cheapest" toggle or tab system helps users filter quickly.
- **Adoption:** We will adopt the **minimalist card design** but ensure the airline branding is clear. We'll use the **tab-based filtering** (Cheapest, Best, Fastest) as it simplifies the decision-making process.

### Passenger Details & Checkout
- **Competitor:** Skyscanner (Kiwi)
- **Observations:** Features a multi-step progress indicator at the top. The trip summary is pinned to the side (or top on mobile) so users always see what they are booking. The form uses clear grouping for Name, Nationality, and DOB.
- **Adoption:** We will implement the **pinned trip summary** and a **stepper-based flow** to reduce cognitive load during the multi-passenger data entry phase.

## 3. Visual References & Logic

### Patterns to Avoid
- **Information Overload:** Booking.com can feel cluttered with too many "deals" and "urgent" banners. Our app will stay clean and focused on the booking task.
- **Hidden Fees:** Some OTAs add insurance or baggage options in a confusing way. We will maintain transparency in price breakdown.

### Screenshots Analyzed
- `docs/research/booking.com/booking.com-homepage.png`: Search layout and discovery features.
- `docs/research/google flight/google-flight-list-result.png`: Efficient listing and price comparison.
- `docs/research/skyscanner/skyscanner-checkout.png`: Complex form handling and trip summaries.

