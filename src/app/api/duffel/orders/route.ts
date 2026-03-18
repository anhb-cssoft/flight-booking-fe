import { NextRequest, NextResponse } from "next/server";
import { Duffel } from "@duffel/api";

const duffel = new Duffel({
  token: process.env.DUFFEL_ACCESS_TOKEN || "",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { selectedOfferId, passengers } = body;

    // Map passengers to Duffel format
    const duffelPassengers = passengers.map((p: any) => ({
      id: p.id,
      title: p.title,
      given_name: p.first_name,
      family_name: p.last_name,
      gender: p.gender,
      born_on: p.born_on,
      email: p.email || undefined,
      phone_number: p.phone_number || undefined,
    }));

    // In a real app, you'd handle payment here. 
    // For Duffel Test environment, we can often create an order with 'instant' type if supported by the provider,
    // or use the 'pay_later' if available. 
    // Most test offers support instant booking with a mock payment or no payment required in the request.
    
    const response = await duffel.orders.create({
      selected_offers: [selectedOfferId],
      passengers: duffelPassengers,
      type: "instant", // Attempt instant booking
      payments: [
        {
          type: "balance",
          amount: (await duffel.offers.get(selectedOfferId)).data.total_amount,
          currency: (await duffel.offers.get(selectedOfferId)).data.total_currency,
        }
      ]
    });

    return NextResponse.json({
      data: response.data
    });
  } catch (error: any) {
    console.error("Duffel SDK Order Error:", error.message, error.errors);
    return NextResponse.json(
      { 
        error: error.message || "Failed to create booking",
        details: error.errors 
      },
      { status: 500 }
    );
  }
}
