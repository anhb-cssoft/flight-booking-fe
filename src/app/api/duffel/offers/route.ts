import { NextRequest, NextResponse } from "next/server";
import { Duffel } from "@duffel/api";

const duffel = new Duffel({
  token: process.env.DUFFEL_ACCESS_TOKEN || "",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      slices, 
      passengers, 
      cabin_class,
      return_date // Optional, only for round-trip if not already in slices
    } = body;

    // Construct slices for Duffel API
    // Duffel expects an array of slices: { origin, destination, departure_date }
    
    const response = await duffel.offerRequests.create({
      slices,
      passengers,
      cabin_class,
      return_offers: true,
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Duffel SDK Offers Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to fetch flight offers" },
      { status: 500 }
    );
  }
}
