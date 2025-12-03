import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { videoBase64, accessToken } = await req.json();

    if (!accessToken) {
      return NextResponse.json({ error: "Missing access token" }, { status: 400 });
    }

    // YouTube upload endpoint
    const uploadInit = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          snippet: {
            title: "AI Generated Video",
            description: "Uploaded automatically via user token",
          },
          status: {
            privacyStatus: "public",
          },
        }),
      }
    );

    const uploadUrl = uploadInit.headers.get("location");

    if (!uploadUrl) {
      return NextResponse.json(
        { error: "Failed to create upload session" },
        { status: 500 }
      );
    }

    // Upload the raw video data
    const buffer = Buffer.from(videoBase64, "base64");

    const uploadFinal = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "video/mp4",
      },
      body: buffer,
    });

    if (!uploadFinal.ok) {
      return NextResponse.json(
        { error: "Failed to upload video" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}