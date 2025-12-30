import { NextResponse } from "next/server";

import { generateAgentResponse } from "@/lib/agent";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = generateAgentResponse(body);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Agent failure", error);
    return NextResponse.json(
      {
        error: "The agent hit a snag parsing your request. Try reframing or shortening your message.",
      },
      { status: 400 },
    );
  }
}
