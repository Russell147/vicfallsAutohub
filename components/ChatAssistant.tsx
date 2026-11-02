"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const welcomeMessage: ChatMessage = {
  id: 0,
  role: "assistant",
  content: "Hi! I can help you find a car, understand a listing, or buy safely. What are you looking for?",
};

const suggestedQuestions = [
  "Show me cars under $5,000",
  "What should I check before buying?",
  "How do I contact a seller?",
];

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const nextId = useRef(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading, isOpen]);

  async function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: nextId.current++,
      role: "user",
      content: trimmed,
    };
    const context = messages
      .filter((message) => message.id !== welcomeMessage.id)
      .slice(-11)
      .map(({ role, content: messageContent }) => ({ role, content: messageContent }));

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...context, { role: "user", content: trimmed }] }),
      });

      let result: unknown;
      try {
        result = await response.json();
      } catch {
        throw new Error("The assistant returned an invalid response. Please try again.");
      }

      if (!response.ok || typeof result !== "object" || result === null || !("reply" in result)) {
        const message =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "The assistant could not respond right now. Please try again.";
        throw new Error(message);
      }

      if (typeof result.reply !== "string" || !result.reply.trim()) {
        throw new Error("The assistant returned an empty response. Please try again.");
      }

      const reply = result.reply;
      setMessages((current) => [
        ...current,
        { id: nextId.current++, role: "assistant", content: reply },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "The assistant could not connect right now. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isOpen && (
        <section
          aria-label="Autohub AI assistant"
          className="flex h-[min(600px,calc(100dvh-120px))] w-[min(390px,calc(100vw-40px))] flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-2xl"
          id="autohub-assistant"
          role="dialog"
        >
          <header className="flex items-center justify-between bg-[#102c28] px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                <svg fill="none" height="22" viewBox="0 0 24 24" width="22">
                  <path
                    d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9-1.9 5.7-1.9-5.7-5.6-1.9L10.1 9 12 3.5Z"
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth="1.7"
                  />
                  <path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" fill="currentColor" />
                </svg>
              </div>
              <div>
                <h2 className="font-bold">Autohub Assistant</h2>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/75">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  AI-powered car search
                </p>
              </div>
            </div>
            <button
              aria-label="Close assistant"
              className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
                <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              </svg>
            </button>
          </header>

          <div
            aria-live="polite"
            className="flex-1 space-y-4 overflow-y-auto bg-[#f7f8f6] p-4"
            role="log"
          >
            {messages.map((message) => (
              <div
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                key={message.id}
              >
                <p
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${
                    message.role === "user"
                      ? "rounded-br-md bg-brand text-white"
                      : "rounded-bl-md border border-[var(--line)] bg-white text-ink"
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pl-1">
                {suggestedQuestions.map((question) => (
                  <button
                    className="rounded-full border border-[var(--line)] bg-white px-3 py-2 text-left text-xs font-medium text-ink transition hover:border-brand hover:text-brand"
                    key={question}
                    onClick={() => void sendMessage(question)}
                    type="button"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <p className="w-fit rounded-2xl rounded-bl-md border border-[var(--line)] bg-white px-3.5 py-2.5 text-sm text-[var(--muted)]">
                Finding an answer…
              </p>
            )}
            <div ref={bottomRef} />
          </div>

          <form className="border-t border-[var(--line)] bg-white p-3" onSubmit={handleSubmit}>
            <div className="flex items-end gap-2 rounded-xl border border-[var(--line)] bg-white p-2 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
              <textarea
                aria-label="Ask the Autohub assistant"
                className="max-h-24 min-h-10 flex-1 resize-none bg-transparent px-1 py-2 text-sm text-ink outline-none placeholder:text-[var(--muted)]"
                maxLength={1200}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage(input);
                  }
                }}
                placeholder="Ask about cars or buying safely…"
                value={input}
              />
              <button
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!input.trim() || isLoading}
                type="submit"
              >
                <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
                  <path
                    d="M5 12h14m-7-7 7 7-7 7"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-[var(--muted)]">
              Don&apos;t share private or payment details.
            </p>
          </form>
        </section>
      )}

      <button
        aria-controls="autohub-assistant"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close Autohub assistant" : "Chat with Autohub assistant"}
        className="flex h-14 items-center gap-2.5 rounded-full bg-brand px-5 text-sm font-bold text-white shadow-lg transition hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {isOpen ? (
          <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
            <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          </svg>
        ) : (
          <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
            <path
              d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2v-5.5A7.5 7.5 0 1 1 20 11.5Z"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
            <path d="M8 11.5h.01M12.5 11.5h.01M17 11.5h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
          </svg>
        )}
        {isOpen ? "Close" : "Ask Autohub"}
      </button>
    </div>
  );
}
