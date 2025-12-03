import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Missing topic" }, { status: 400 });
    }

    const prompt = `
      Create a short, dynamic and viral script for TikTok / YouTube Shorts.
      Theme: ${topic}
      Length: 30-45 seconds.
      Tone: fast, catchy, engaging.
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-4.1-mini",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      script: data.choices?.[0]?.message?.content ?? "No script generated",
    });
  } catch (error) {
    console.error("Error generating prompt:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}