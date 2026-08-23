import { NextResponse } from "next/server";
import { syncKnowledgeBase } from "@/lib/rag/sync";
import { llmConfigured } from "@/lib/ai/llm";
import { getData } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getData();

  const sources: Record<string, number> = {};
  for (const doc of data.knowledgeDocs) {
    sources[doc.sourceType] = (sources[doc.sourceType] ?? 0) + 1;
  }

  return NextResponse.json({
    lastSync: data.syncMeta.lastSync,
    docCount: data.knowledgeDocs.length,
    publishedProjects: data.projects.filter((p) => p.published).length,
    draftProjects: data.projects.filter((p) => !p.published).length,
    sources,
    embeddingProvider:
      (process.env.EMBEDDING_PROVIDER ?? "local") === "openai"
        ? `OpenAI-compatible (${process.env.EMBEDDING_MODEL ?? "text-embedding-3-small"})`
        : "Local hashed embeddings (no external key)",
    llmProvider: llmConfigured()
      ? `${process.env.AI_BASE_URL?.replace(/\/$/, "") ?? "https://api.groq.com/openai/v1"} • ${process.env.AI_MODEL ?? "openai/gpt-oss-120b"}`
      : "Not configured — set AI_API_KEY in .env",
  });
}

export async function POST() {
  try {
    const result = await syncKnowledgeBase(true);
    return NextResponse.json({
      ok: true,
      message: `Knowledge base rebuilt: ${result.docCount} documents indexed (${result.embedded} re-embedded).`,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to rebuild knowledge base",
      },
      { status: 500 }
    );
  }
}
