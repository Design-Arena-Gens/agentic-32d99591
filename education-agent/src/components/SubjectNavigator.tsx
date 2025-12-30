"use client";

import { SUBJECTS } from "@/lib/knowledge";

interface SubjectNavigatorProps {
  activeSubjectId: string;
  onSelect: (subjectId: string) => void;
}

export function SubjectNavigator({ activeSubjectId, onSelect }: SubjectNavigatorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {SUBJECTS.map((subject) => {
        const isActive = subject.id === activeSubjectId;
        return (
          <button
            key={subject.id}
            type="button"
            onClick={() => onSelect(subject.id)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
              isActive
                ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-900 hover:text-slate-900"
            }`}
          >
            {subject.label}
          </button>
        );
      })}
    </div>
  );
}
