/**
 * Embedding provider abstraction.
 *
 * - "local" (default): deterministic hashed bag-of-features embedding.
 *   No API key or network needed — good enough for retrieval over a
 *   small portfolio corpus, and keeps the RAG fully self-contained.
 * - "openai": any OpenAI-compatible /embeddings endpoint
 *   (OpenAI, Together, Fireworks, Ollama, ...). Configure with
 *   EMBEDDING_PROVIDER=openai, EMBEDDING_BASE_URL, EMBEDDING_API_KEY,
 *   EMBEDDING_MODEL.
 */

const LOCAL_DIM = 384;

function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function tokenize(text: string): string[] {
  const words = text.toLowerCase().match(/[a-z0-9][a-z0-9+#./-]*/g) ?? [];
  const features: string[] = [];
  for (const w of words) {
    features.push(w);
    if (w.length > 4) {
      for (let i = 0; i < w.length - 2; i++) {
        features.push(w.slice(i, i + 3));
      }
    }
  }
  return features;
}

function localEmbed(text: string): number[] {
  const vec = new Array<number>(LOCAL_DIM).fill(0);
  const counts = new Map<string, number>();
  for (const f of tokenize(text)) {
    counts.set(f, (counts.get(f) ?? 0) + 1);
  }
  for (const [feature, count] of counts) {
    const h = fnv1a(feature);
    const idx = h % LOCAL_DIM;
    const sign = (h >>> 16) % 2 === 0 ? 1 : -1;
    vec[idx] += sign * (1 + Math.log(count));
  }
  let norm = 0;
  for (const v of vec) norm += v * v;
  norm = Math.sqrt(norm) || 1;
  return vec.map((v) => v / norm);
}

async function openaiEmbed(texts: string[]): Promise<number[][]> {
  const baseUrl =
    process.env.EMBEDDING_BASE_URL ?? "https://api.openai.com/v1";
  const apiKey = process.env.EMBEDDING_API_KEY;
  const model = process.env.EMBEDDING_MODEL ?? "text-embedding-3-small";
  if (!apiKey) throw new Error("EMBEDDING_API_KEY is not configured");
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, input: texts }),
  });
  if (!res.ok) {
    throw new Error(`Embedding provider error (${res.status})`);
  }
  const json = (await res.json()) as { data: { embedding: number[] }[] };
  return json.data.map((d) => d.embedding);
}

export async function embedText(text: string): Promise<number[]> {
  if ((process.env.EMBEDDING_PROVIDER ?? "local") === "openai") {
    const [vec] = await openaiEmbed([text]);
    return vec;
  }
  return localEmbed(text);
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if ((process.env.EMBEDDING_PROVIDER ?? "local") === "openai") {
    return openaiEmbed(texts);
  }
  return texts.map(localEmbed);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) dot += a[i] * b[i];
  return dot;
}
