import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { provider, apiKey } = await req.json();

    if (!provider || !apiKey) {
      return NextResponse.json({ error: "Missing provider or API key" }, { status: 400 });
    }

    let url = "";
    let headers: any = {};
    let body: any = {};

    /* ======================================================
       IA PROVIDERS — CHOIX DE L’UTILISATEUR
    ====================================================== */

    if (provider === "openai") {
      url = "https://api.openai.com/v1/chat/completions";
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };
      body = {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Tu es un générateur de scripts YouTube courts et viraux.",
          },
          { role: "user", content: "Génère un script pour une vidéo YouTube courte." },
        ],
      };
    }

    if (provider === "claude") {
      url = "https://api.anthropic.com/v1/messages";
      headers = {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      };
      body = {
        model: "claude-3-sonnet-20240229",
        max_tokens: 500,
        messages: [
          { role: "user", content: "Génère un script court et percutant pour une vidéo." },
        ],
      };
    }

    if (provider === "gemini") {
      url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
      headers = { "Content-Type": "application/json" };
      body = {
        contents: [
          { parts: [{ text: "Génère un script très court pour une vidéo YouTube." }] },
        ],
      };
    }

    if (provider === "mistral") {
      url = "https://api.mistral.ai/v1/chat/completions";
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };
      body = {
        model: "mistral-small-latest",
        messages: [
          { role: "user", content: "Génère un script court pour une vidéo stylée." },
        ],
      };
    }

    if (provider === "qwen") {
      url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation";
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };
      body = {
        model: "qwen-turbo",
        input: "Génère un script spectaculaire pour une vidéo YouTube.",
      };
    }

    if (provider === "deepseek") {
      url = "https://api.deepseek.com/v1/chat/completions";
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };
      body = {
        model: "deepseek-chat",
        messages: [
          { role: "user", content: "Génère un petit script pour une vidéo virale." },
        ],
      };
    }

    // ==== Requête API ====
    const request = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await request.json();

    // ==== Extraire le script selon l'IA ====
    let script = "Aucun script généré.";

    if (provider === "openai" || provider === "mistral" || provider === "deepseek") {
      script = data?.choices?.[0]?.message?.content || script;
    }

    if (provider === "claude") {
      script = data?.content?.[0]?.text || script;
    }

    if (provider === "gemini") {
      script = data?.candidates?.[0]?.content?.parts?.[0]?.text || script;
    }

    if (provider === "qwen") {
      script = data?.output?.text || script;
    }

    return NextResponse.json({ script });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}