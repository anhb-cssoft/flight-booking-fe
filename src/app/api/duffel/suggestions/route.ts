import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const DUFFEL_API_URL = "https://api.duffel.com";
const ACCESS_TOKEN = process.env.DUFFEL_ACCESS_TOKEN;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ data: [] });
  }

  try {
    const response = await axios.get(`${DUFFEL_API_URL}/airports/suggestions`, {
      params: { query },
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Duffel-Version": "v1",
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Duffel API Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: error.response?.status || 500 }
    );
  }
}
