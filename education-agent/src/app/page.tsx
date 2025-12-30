"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { SubjectNavigator } from "@/components/SubjectNavigator";
import { ChatMessage } from "@/components/ChatMessage";
import { ResourceList } from "@/components/ResourceList";
import { StrategyDeck } from "@/components/StrategyDeck";
import { FollowUps } from "@/components/FollowUps";
import { SUBJECTS, getSubjectById } from "@/lib/knowledge";
import type { AssistantMessage, Message, UserMessage } from "@/types/chat";

const defaultSubject = SUBJECTS[0];

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const introMessage: AssistantMessage = {
  id: "intro",
  role: "assistant",
  createdAt: new Date().toISOString(),
  content: [
    "Hey there! I'm your higher-ed learning partner. Tell me what you're wrestling with and we'll turn it into a plan you can actually act on.",
    "",
    "Share the situation, the stakes, and what would feel like a win. I'll adapt the tone, surface the right frameworks, and keep the conversation human.",
  ].join("\n"),
  metadata: {
    subject: defaultSubject.id,
    confidence: 0.72,
    summary: defaultSubject.elevatorPitch,
    strategies: [
      {
        title: "Frame the problem",
        description: "Describe the context, constraints, and what success unlocks.",
        duration: "2 minutes",
      },
    ],
    resources: defaultSubject.resourcePool.slice(0, 2),
    followUps: [
      "Can you outline the stakes or deadline?",
      "Do you want a conceptual walkthrough or a ready-to-run plan?",
    ],
    sentiment: "motivational",
  },
};

function useMessages() {
  const [messages, setMessages] = useState<Message[]>([introMessage]);
  const messagesRef = useRef<Message[]>(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const appendMessage = useCallback((message: Message) => {
    setMessages((previous) => [...previous, message]);
  }, []);

  const replaceMessages = useCallback((next: Message[]) => {
    setMessages(next);
  }, []);

  return { messages, appendMessage, replaceMessages, messagesRef };
}

export default function Home() {
  const { messages, appendMessage, messagesRef, replaceMessages } = useMessages();
  const [activeSubjectId, setActiveSubjectId] = useState(defaultSubject.id);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const latestAssistant = useMemo<AssistantMessage | undefined>(() => {
    return [...messages].reverse().find((entry) => entry.role === "assistant") as AssistantMessage | undefined;
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSend = useCallback(
    async (raw: string) => {
      const content = raw.trim();
      if (!content || isThinking) return;

      const subjectHint = getSubjectById(activeSubjectId) ? activeSubjectId : undefined;
      const userMessage: UserMessage = {
        id: createId(),
        role: "user",
        content,
        createdAt: new Date().toISOString(),
        metadata: subjectHint ? { subjectHint } : undefined,
      };

      const conversation = [...messagesRef.current, userMessage];
      replaceMessages(conversation);
      setInputValue("");
      setIsThinking(true);
      setError(null);

      try {
        const response = await fetch("/api/respond", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: conversation }),
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => ({}))) as { error?: string };
          throw new Error(payload.error ?? "Agent could not craft a response.");
        }

        const payload = (await response.json()) as { message: AssistantMessage };
        appendMessage(payload.message);
        setActiveSubjectId(payload.message.metadata.subject);
        setAttempts(0);
      } catch (agentError) {
        console.error(agentError);
        const retries = attempts + 1;
        setAttempts(retries);
        setError(
          retries >= 2
            ? "The agent is having trouble keeping up. Try simplifying or refreshing the page."
            : "I hit a snag—mind rephrasing that slightly?",
        );
      } finally {
        setIsThinking(false);
      }
    },
    [activeSubjectId, appendMessage, attempts, isThinking, messagesRef, replaceMessages],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        void handleSend(inputValue);
      }
    },
    [handleSend, inputValue],
  );

  const dashboardSubject = useMemo(() => {
    return getSubjectById(activeSubjectId) ?? defaultSubject;
  }, [activeSubjectId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-12 text-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-8">
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 shadow-lg shadow-black/20 backdrop-blur">
            Agentic Learning Studio
          </div>
          <h1 className="max-w-xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Higher-ed intelligence that feels human, strategic, and on your side.
          </h1>
          <p className="max-w-xl text-sm text-white/80 sm:text-base">
            Share the challenge. The agent senses the subject, pulls the right frameworks, and responds with human-grade
            guidance. No fluff—just actionable insight, curated resources, and prompts to keep you moving.
          </p>
          <SubjectNavigator activeSubjectId={activeSubjectId} onSelect={setActiveSubjectId} />
        </header>

        <main className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(260px,2fr)]">
          <section className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl shadow-black/30 backdrop-blur">
            <div className="flex-1 space-y-4 overflow-y-auto p-6" data-testid="chat-scroll-region">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isThinking ? (
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                  </span>
                  Crafting a response…
                </div>
              ) : null}
              <div ref={chatEndRef} />
            </div>
            <div className="border-t border-white/5 bg-slate-950/40 p-6">
              {error ? <p className="mb-3 text-xs text-red-400">{error}</p> : null}
              <div className="rounded-2xl border border-white/10 bg-black/40 shadow-inner shadow-black/40">
                <textarea
                  className="h-28 w-full resize-none rounded-2xl bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none"
                  placeholder="Ask for a deep dive, a critique, a plan, or an analogy…"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isThinking}
                />
                <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">Shift + Enter for new line</p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:bg-white/90 disabled:opacity-50"
                    onClick={() => void handleSend(inputValue)}
                    disabled={isThinking || !inputValue.trim()}
                  >
                    Send
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <FollowUps
                  questions={latestAssistant?.metadata.followUps ?? []}
                  onSelect={(question) => void handleSend(question)}
                  disabled={isThinking}
                />
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl shadow-black/30 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Subject Pulse</p>
              <h2 className="mt-2 text-lg font-semibold text-white">{dashboardSubject.label}</h2>
              <p className="mt-2 text-sm text-white/70">{dashboardSubject.elevatorPitch}</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl shadow-black/30 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Strategies</p>
              <div className="mt-3 space-y-3">
                <StrategyDeck strategies={latestAssistant?.metadata.strategies ?? []} />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl shadow-black/30 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Resources</p>
              <div className="mt-3">
                <ResourceList items={latestAssistant?.metadata.resources ?? []} />
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
