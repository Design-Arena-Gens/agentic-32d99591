"use client";

import type { Strategy } from "@/types/chat";

interface StrategyDeckProps {
  strategies: Strategy[];
}

export function StrategyDeck({ strategies }: StrategyDeckProps) {
  if (!strategies.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200/60 bg-white/20 p-4 text-sm text-slate-600">
        Ask for a roadmap or critique to unlock a tailored strategy bundle.
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {strategies.map((strategy) => (
        <div
          key={strategy.title}
          className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span>{strategy.title}</span>
            {strategy.duration ? (
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                {strategy.duration}
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-slate-700">{strategy.description}</p>
        </div>
      ))}
    </div>
  );
}
