import { NextRequest, NextResponse } from "next/server";
import { Duffel } from "@duffel/api";

const duffel = new Duffel({
  token: process.env.DUFFEL_ACCESS_TOKEN || "",
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ data: [] });
  }

  try {
    // Reverse geocode to get city name using Nominatim (OpenStreetMap)
    // This is a free service, but in production you might want a more robust one like Google/Mapbox
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`,
      {
        headers: {
          "User-Agent": "SkyBooker/1.0",
        },
      }
    );

    let cityName = "";
    if (geoRes.ok) {
      const geoData = await geoRes.json();
      cityName = geoData.address.city || geoData.address.town || geoData.address.state || "";
    }

    if (!cityName) {
      return NextResponse.json({ data: [] });
    }

    // Now query Duffel suggestions with the city name
    const response = await duffel.suggestions.list({
      query: cityName,
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Duffel SDK Nearby Error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch nearby airports" },
      { status: 500 }
    );
  }
}
