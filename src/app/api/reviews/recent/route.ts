import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

// GET /api/reviews/recent
export async function GET(request: NextRequest) {
  try {
    // Fetch recent reviews from backend API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/reviews/recent`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      // Return empty array instead of throwing error during build
      console.warn("Backend not available, returning empty reviews");
      return NextResponse.json({ reviews: [] });
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching recent reviews:", error);
    // Return empty array instead of error during build
    return NextResponse.json({ reviews: [] });
  }
}
