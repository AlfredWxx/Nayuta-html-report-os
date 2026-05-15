export type ReportTocItem = {
  id: string;
  title: string;
};

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function titleFromId(id: string) {
  return id
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function extractReportToc(html: string): ReportTocItem[] {
  const sectionPattern = /<section\b([^>]*)>([\s\S]*?)<\/section>/g;
  const items: ReportTocItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = sectionPattern.exec(html)) !== null) {
    const attrs = match[1];
    const body = match[2];
    const id = attrs.match(/data-section-id="([^"]+)"/)?.[1];

    if (!id) {
      continue;
    }

    const heading = body.match(
      /<h[2-3]\b[^>]*class="[^"]*\breport-section-title\b[^"]*"[^>]*>([\s\S]*?)<\/h[2-3]>/
    )?.[1];

    items.push({
      id,
      title: decodeHtml(stripTags(heading ?? titleFromId(id)))
    });
  }

  return items;
}
