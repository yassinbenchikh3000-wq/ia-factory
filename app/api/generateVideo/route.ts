import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { provider, apiKey, script } = await req.json();

    if (!provider || !apiKey || !script) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    let url = "";
    let headers: any = {};
    let body: any = {};

    /* ======================================================
       VIDEO PROVIDERS
    ====================================================== */

    // ---------- PIKA ----------
    if (provider === "pika") {
      url = "https://api.pika.art/v1/video";
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };
      body = { prompt: script };
    }

    // ---------- RUNWAY ----------
    if (provider === "runway") {
      url = "https://api.runwayml.com/v1/videos";
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };
      body = { prompt: script };
    }

    // ---------- STABILITY VIDEO ----------
    if (provider === "stability") {
      url = "https://api.stability.ai/v2beta/video/generate";
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };
      body = { prompt: script };
    }

    // ---------- KLING ----------
    if (provider === "kling") {
      url = "https://api.klingai.com/v1/video";
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };
      body = { prompt: script };
    }

    // ---------- LUMA DREAM MACHINE ----------
    if (provider === "luma") {
      url = "https://api.lumalabs.ai/v1/videos";
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };
      body = { prompt: script };
    }

    // ---- (VEO dispo plus tard) ----

    /* ======================================================
       ENVOI DE LA REQUÊTE
    ====================================================== */
    const request = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const buffer = await request.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    return NextResponse.json({ videoBase64: base64 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}