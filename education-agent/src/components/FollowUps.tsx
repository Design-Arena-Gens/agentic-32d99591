"use client";

interface FollowUpsProps {
  questions: string[];
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export function FollowUps({ questions, onSelect, disabled }: FollowUpsProps) {
  if (!questions.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {questions.map((question) => (
        <button
          key={question}
          type="button"
          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white disabled:pointer-events-none disabled:opacity-50"
          onClick={() => onSelect(question)}
          disabled={disabled}
        >
          {question}
        </button>
      ))}
    </div>
  );
}
