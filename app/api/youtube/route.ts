import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(req: Request) {
  try {
    const { videoUrl, title, description } = await req.json();

    if (!videoUrl) {
      return NextResponse.json({ error: "Missing videoUrl" }, { status: 400 });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.YT_CLIENT_ID,
      process.env.YT_CLIENT_SECRET,
      process.env.YT_REDIRECT_URI,
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.YT_REFRESH_TOKEN,
    });

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    const upload = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title: title || "AI Factory Auto Video",
          description: description || "",
        },
        status: { privacyStatus: "public" },
      },
      media: {
        body: await fetch(videoUrl).then((res) => res.body),
      },
    });

    return NextResponse.json({
      success: true,
      youtube: upload.data,
    });
  } catch (error) {
    console.error("YouTube upload error:", error);
    return NextResponse.json({ error: "YouTube upload failed" }, { status: 500 });
  }
}