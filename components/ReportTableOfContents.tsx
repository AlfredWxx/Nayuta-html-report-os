"use client";

import type { ReportTocItem } from "@/lib/reportToc";

type ReportTableOfContentsProps = {
  items: ReportTocItem[];
};

export function ReportTableOfContents({ items }: ReportTableOfContentsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="report-toc" aria-label="Table of contents">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => {
            document
              .querySelector<HTMLElement>(`[data-section-id="${item.id}"]`)
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        >
          {item.title}
        </button>
      ))}
    </aside>
  );
}
