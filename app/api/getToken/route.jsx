// app/api/getToken/route.js
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.DEEPGRAM_API_KEY; // 🔐 SERVER ONLY

  if (!apiKey) {
    return NextResponse.json(
      { error: "Deepgram API key missing" },
      { status: 500 }
    );
  }

  return NextResponse.json({ token: apiKey });
}
