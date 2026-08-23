import { NextRequest, NextResponse } from "next/server";
import { retrieve } from "@/lib/rag/retrieve";
import { chatComplete, llmConfigured } from "@/lib/ai/llm";
import { buildChatMessages } from "@/lib/rag/prompt";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { message?: string; history?: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }
  if (message.length > 1000) {
    return NextResponse.json({ error: "Message is too long" }, { status: 400 });
  }

  const history = Array.isArray(body.history)
    ? body.history
        .filter(
          (m) =>
            (m.role === "user" || m.role === "assistant") &&
            typeof m.content === "string"
        )
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content.slice(0, 2000),
        }))
    : [];

  const { docs } = await retrieve(message, 6);

  if (!llmConfigured()) {
    return NextResponse.json({
      reply:
        "The AI assistant isn't connected yet (missing AI_API_KEY). Meanwhile, feel free to browse the portfolio directly.",
      sources: [],
    });
  }

  const result = await chatComplete(buildChatMessages(history, docs, message));
  if (!result.ok) {
    return NextResponse.json(
      { error: "The AI assistant is unavailable right now. Please try again later." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    reply: result.content,
    sources: docs.map((d) => d.title),
  });
}
