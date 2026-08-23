/**
 * LLM provider abstraction.
 *
 * Default: Groq via its OpenAI-compatible endpoint.
 * Configure with AI_BASE_URL / AI_API_KEY / AI_MODEL to switch to any
 * OpenAI-compatible provider without code changes.
 */

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LlmResult {
  ok: boolean;
  content?: string;
  error?: string;
}

export function llmConfigured(): boolean {
  return Boolean(process.env.AI_API_KEY);
}

export async function chatComplete(messages: ChatMessage[]): Promise<LlmResult> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "LLM is not configured" };
  }
  const baseUrl =
    process.env.AI_BASE_URL ?? "https://api.groq.com/openai/v1";
  const model = process.env.AI_MODEL ?? "openai/gpt-oss-120b";

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.3,
        max_tokens: 700,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        ok: false,
        error: `LLM provider error (${res.status})${body ? `: ${body.slice(0, 200)}` : ""}`,
      };
    }
    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content?.trim();
    if (!content) return { ok: false, error: "Empty response from LLM" };
    return { ok: true, content };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "LLM request failed",
    };
  }
}
