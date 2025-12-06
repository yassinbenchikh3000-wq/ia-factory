import { NextResponse } from "next/server";
import { google } from "googleapis";
import { Readable } from "stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Expected multipart/form-data fields:
 * - accessToken: string  (OAuth 2.0 access token with youtube.upload scope)
 * - title: string
 * - description: string (optional)
 * - tags: string (optional, comma separated)
 * - visibility: "public" | "unlisted" | "private" (optional)
 * - file: File (video)
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const accessToken = String(formData.get("accessToken") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const tagsRaw = String(formData.get("tags") ?? "").trim();
    const visibility = String(formData.get("visibility") ?? "public").trim();

    const file = formData.get("file");

    if (!accessToken) {
      return NextResponse.json(
        { ok: false, error: "accessToken OAuth manquant." },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { ok: false, error: "Titre manquant." },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Fichier vidéo manquant (champ 'file')." },
        { status: 400 }
      );
    }

    // Parse tags
    const tags = tagsRaw
      ? tagsRaw
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .slice(0, 50)
      : undefined;

    // Convert File -> Buffer -> Readable
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const stream = Readable.from(buffer);

    // OAuth client with access token only
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    const res = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title,
          description: description || undefined,
          tags,
          categoryId: "22", // People & Blogs (safe default)
        },
        status: {
          privacyStatus:
            visibility === "private" || visibility === "unlisted"
              ? visibility
              : "public",
          selfDeclaredMadeForKids: false,
        },
      },
      media: {
        mimeType: file.type || "video/*",
        body: stream,
      },
    });

    const videoId = res.data.id;

    return NextResponse.json({
      ok: true,
      videoId,
      message: "Upload YouTube OK.",
    });
  } catch (err: any) {
    const msg =
      typeof err?.message === "string"
        ? err.message
        : "Erreur inconnue pendant l’upload.";

    return NextResponse.json(
      { ok: false, error: msg },
      { status: 500 }
    );
  }
}