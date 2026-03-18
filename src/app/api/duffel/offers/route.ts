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
      limit = 10,
      offset = 0,
      sortBy = "price_asc",
      filterStops = "all"
    } = body;

    const response = await duffel.offerRequests.create({
      slices,
      passengers,
      cabin_class,
      return_offers: true,
    });

    const offerRequest = response.data;
    let allOffers = offerRequest.offers || [];

    // 1. Xử lý Lọc (Filtering) theo số điểm dừng
    if (filterStops !== "all") {
      allOffers = allOffers.filter((offer: any) => {
        const maxStops = Math.max(
          ...offer.slices.map((s: any) => s.segments.length - 1)
        );
        if (filterStops === "direct") return maxStops === 0;
        if (filterStops === "1stop") return maxStops === 1;
        if (filterStops === "2plus") return maxStops >= 2;
        return true;
      });
    }

    // 2. Xử lý Sắp xếp (Sorting)
    allOffers.sort((a: any, b: any) => {
      if (sortBy === "price_asc")
        return parseFloat(a.total_amount) - parseFloat(b.total_amount);
      if (sortBy === "price_desc")
        return parseFloat(b.total_amount) - parseFloat(a.total_amount);

      if (sortBy === "duration_asc") {
        const getDuration = (off: any) =>
          off.slices.reduce((acc: number, s: any) => {
            const matches = s.duration.match(/PT(\d+H)?(\d+M)?/);
            const h = parseInt(matches?.[1] || "0");
            const m = parseInt(matches?.[2] || "0");
            return acc + h * 60 + m;
          }, 0);
        return getDuration(a) - getDuration(b);
      }
      return 0;
    });

    // 3. Thực hiện Phân trang (Pagination) sau khi đã Lọc và Sắp xếp
    const totalOffers = allOffers.length;
    const paginatedOffers = allOffers.slice(offset, offset + limit);

    return NextResponse.json({
      data: {
        id: offerRequest.id,
        slices: offerRequest.slices,
        passengers: offerRequest.passengers,
        cabin_class: offerRequest.cabin_class,
        offers: paginatedOffers,
        total_offers: totalOffers,
        created_at: offerRequest.created_at
      }
    });
  } catch (error: any) {
    console.error("Duffel SDK Offers Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to fetch flight offers" },
      { status: 500 }
    );
  }
}
