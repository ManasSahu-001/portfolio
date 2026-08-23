"use client";

import { useRef, useState } from "react";
import { SparkleIcon } from "@/components/ui/icons";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What is Manas currently building?",
  "Tell me about Orbital Guardian.",
  "What does Manas work with?",
  "What are Manas's competitive programming achievements?",
  "What is Manas currently learning?",
];

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    const question = text.trim();
    if (!question || loading) return;

    setError(null);
    setInput("");
    const history = messages;
    setMessages([...history, { role: "user", content: question }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, history }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "Something went wrong");
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: json.reply },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
      requestAnimationFrame(() => {
        listRef.current?.scrollTo({
          top: listRef.current.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }

  return (
    <div className="flex h-[min(72vh,640px)] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_24px_60px_-32px_rgba(28,27,24,0.25)]">
      <div className="flex items-center gap-3 border-b border-line px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
          <SparkleIcon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">Ask Manas</p>
          <p className="text-xs text-muted">Grounded in portfolio content only</p>
        </div>
      </div>

      <div
        ref={listRef}
        className="flex-1 space-y-4 overflow-y-auto px-5 py-6"
        aria-live="polite"
        aria-label="Chat conversation"
      >
        {messages.length === 0 && !loading && (
          <div>
            <p className="text-sm leading-relaxed text-muted">
              Hi! I&apos;m trained on Manas&apos;s portfolio. Ask me anything
              about his work, skills or what he&apos;s building — or start with
              one of these:
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => void send(s)}
                    className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-left text-[13px] text-muted transition-colors hover:border-accent hover:text-accent-deep"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "rounded-br-md bg-ink text-paper"
                  : "rounded-bl-md border border-line bg-paper text-ink"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start" aria-label="Assistant is typing">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-line bg-paper px-4 py-3.5">
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted" />
            </div>
          </div>
        )}

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="flex gap-2 border-t border-line p-4"
      >
        <label htmlFor="chat-input" className="sr-only">
          Ask a question about Manas
        </label>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Manas's work, skills, projects…"
          maxLength={1000}
          autoComplete="off"
          className="h-11 flex-1 rounded-xl border border-line bg-paper px-4 text-sm text-ink placeholder:text-faint focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="h-11 rounded-xl bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-coal disabled:cursor-not-allowed disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}
