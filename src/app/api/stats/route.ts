import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/helpers/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const backendUrl = `${process.env.NEXT_PUBLIC_BASE_API}/stats`;
    const response = await fetch(backendUrl, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Backend error:", text);
      return NextResponse.json(
        { error: "Failed to fetch stats from backend" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
