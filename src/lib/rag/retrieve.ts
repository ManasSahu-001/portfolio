import { getData } from "@/lib/content";
import { embedText, cosineSimilarity } from "@/lib/ai/embeddings";
import type { KnowledgeDoc } from "@/types";

const STOP_WORDS = new Set([
  "what", "is", "the", "a", "an", "about", "of", "in", "on", "for", "to",
  "and", "or", "does", "do", "tell", "me", "his", "her", "manas", "sahu",
  "currently", "with", "how", "are", "was", "can", "you", "i",
]);

/**
 * Hybrid retrieval: cosine similarity over embeddings plus a keyword
 * overlap boost — robust for a small corpus.
 */
export async function retrieve(
  query: string,
  k = 6
): Promise<{ docs: KnowledgeDoc[] }> {
  const data = await getData();
  if (data.knowledgeDocs.length === 0) return { docs: [] };

  let queryVec: number[] | null = null;
  try {
    queryVec = await embedText(query);
  } catch {
    queryVec = null;
  }
  const queryTokens = new Set(
    (query.toLowerCase().match(/[a-z0-9][a-z0-9+#.-]*/g) ?? []).filter(
      (t) => !STOP_WORDS.has(t) && t.length > 2
    )
  );

  const scored = data.knowledgeDocs.map((doc) => {
    const sim = queryVec ? cosineSimilarity(queryVec, doc.embedding) : 0;
    let overlap = 0;
    for (const t of queryTokens) {
      if (doc.text.toLowerCase().includes(t)) overlap += 1;
    }
    const kw = queryTokens.size > 0 ? overlap / queryTokens.size : 0;
    return { doc, score: sim + 0.5 * kw };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, k).filter((s) => s.score > 0.08);
  return { docs: top.map((s) => s.doc) };
}
