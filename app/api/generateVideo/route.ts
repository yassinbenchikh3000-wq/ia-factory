import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { script } = await req.json();

    if (!script) {
      return NextResponse.json({ error: "No script provided" }, { status: 400 });
    }

    const response = await fetch("https://api.openai.com/v1/videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-video",
        prompt: script,
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      videoUrl: data.url ?? null,
    });
  } catch (error) {
    console.error("Video generation error:", error);
    return NextResponse.json({ error: "Video generation failed" }, { status: 500 });
  }
}