"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

import type { AssistantMessage, Message } from "@/types/chat";

interface ChatMessageProps {
  message: Message;
}

const roleStyles: Record<Message["role"], string> = {
  user: "self-end bg-slate-900 text-white",
  assistant: "self-start bg-white text-slate-900 border border-slate-200",
};

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm transition-colors ${roleStyles[message.role]}`}
        data-role={message.role}
      >
        <div className="prose prose-sm dark:prose-invert prose-neutral max-w-none">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
      {message.role === "assistant" ? (
        <AssistantMeta message={message as AssistantMessage} />
      ) : null}
    </div>
  );
}

function AssistantMeta({ message }: { message: AssistantMessage }) {
  const { metadata } = message;

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
      <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
        {metadata.subject.replace(/-/g, " ").toUpperCase()}
      </span>
      <span>Confidence {(metadata.confidence * 100).toFixed(0)}%</span>
      <span className="hidden md:inline">•</span>
      <span className="hidden md:inline capitalize">{metadata.sentiment}</span>
    </div>
  );
}
