import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://kawane-be.vercel.app/api";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

// GET /api/shipments/stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Forward query parameters to backend
    const queryString = searchParams.toString();
    const backendUrl = `${BACKEND_URL}/api/shipments/stats${
      queryString ? `?${queryString}` : ""
    }`;

    // Get authorization header from request
    const authHeader = request.headers.get("authorization");

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn(
        "Backend not available for shipment stats, returning empty data"
      );
      return NextResponse.json({ stats: {} });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching shipment stats:", error);
    // Return empty stats instead of error during build
    return NextResponse.json({ stats: {} });
  }
}
