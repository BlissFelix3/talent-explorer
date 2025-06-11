import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_BASE = "http://localhost:8888";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Proxying login request to backend:", body);

    const response = await fetch(`${BACKEND_API_BASE}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend login error:", response.status, errorText);
      return NextResponse.json(
        { error: `Login failed: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Login proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
