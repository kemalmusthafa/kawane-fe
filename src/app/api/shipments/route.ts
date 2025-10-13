import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

// GET /api/shipments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Forward query parameters to backend
    const queryString = searchParams.toString();
    const backendUrl = `${BACKEND_URL}/api/shipments${
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
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch shipments" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching shipments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/shipments
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get authorization header from request
    const authHeader = request.headers.get("authorization");

    const response = await fetch(`${BACKEND_URL}/api/shipments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to create shipment" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating shipment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
