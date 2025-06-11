import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_BASE =
  "https://torre-talent-explorer-production.up.railway.app";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Proxying register request to backend:", body);

    const response = await fetch(`${BACKEND_API_BASE}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend register error:", response.status, errorText);
      return NextResponse.json(
        { error: `Registration failed: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Register proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
