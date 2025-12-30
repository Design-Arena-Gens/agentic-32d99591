"use client";

import type { ResourceLink } from "@/types/chat";

interface ResourceListProps {
  items: ResourceLink[];
}

const TYPE_LABEL: Record<ResourceLink["type"], string> = {
  article: "Deep Dive",
  video: "Watch",
  course: "Course",
  paper: "Research",
  tool: "Tool",
};

export function ResourceList({ items }: ResourceListProps) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200/60 bg-white/20 p-4 text-sm text-slate-600">
        Ask for reading recommendations or tools to surface a curated bundle.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-800">Curated Resources</h3>
      <ul className="mt-3 space-y-3">
        {items.map((resource) => (
          <li key={resource.url} className="space-y-1">
            <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
              <span>{TYPE_LABEL[resource.type]}</span>
              <span>5-20 min</span>
            </div>
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-start gap-2 text-sm font-medium text-slate-900 hover:text-slate-700"
            >
              <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
                Go
              </span>
              <span className="leading-tight">
                {resource.title}
                <span className="block text-xs font-normal text-slate-600">{resource.description}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
