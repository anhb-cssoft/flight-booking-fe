import { NextRequest, NextResponse } from "next/server";
import { Duffel } from "@duffel/api";

const duffel = new Duffel({
  token: process.env.DUFFEL_ACCESS_TOKEN || "",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { selectedOfferId, passengers, totalAmount, currency } = body;

    // Map passengers to Duffel format
    // Note: given_name and family_name are required by Duffel
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

    // Create the order using 'instant' type for test environment
    console.log("Creating Duffel Order for Offer:", selectedOfferId);
    
    const response = await duffel.orders.create({
      selected_offers: [selectedOfferId],
      passengers: duffelPassengers,
      type: "instant",
      payments: [
        {
          type: "balance",
          amount: totalAmount,
          currency: currency,
        }
      ]
    });

    console.log("Duffel Order Created Successfully:", response.data.id);

    return NextResponse.json({
      data: response.data
    });
  } catch (error: any) {
    console.error("Duffel API Error Details:");
    console.error("- Message:", error.message);
    console.error("- Status:", error.status);
    console.error("- Errors:", JSON.stringify(error.errors, null, 2));
    
    const firstError = error.errors?.[0];
    let userMessage = "Failed to create booking. Please try a different flight.";
    
    if (firstError) {
      if (firstError.code === "internal_server_error") {
        userMessage = "The airline's reservation system is temporarily unavailable. Please try selecting a different flight or airline.";
      } else {
        userMessage = firstError.message || firstError.title || userMessage;
      }
    }

    return NextResponse.json(
      { 
        error: userMessage,
        details: error.errors || [] 
      },
      { status: error.status || 500 }
    );
  }
}
