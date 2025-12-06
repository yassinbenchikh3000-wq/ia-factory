import { NextResponse } from "next/server";
import { addHistory, clearHistory, listHistory, type HistoryItem } from "@/lib/historyStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const items = await listHistory();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  let body: Partial<HistoryItem> = {};

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const next = await addHistory({
    type: body.type ?? "system",
    provider: body.provider,
    input: body.input,
    output: body.output,
    status: body.status ?? "ok",
    meta: body.meta ?? {},
  });

  return NextResponse.json(next);
}

export async function DELETE() {
  await clearHistory();
  return NextResponse.json({ ok: true });
}