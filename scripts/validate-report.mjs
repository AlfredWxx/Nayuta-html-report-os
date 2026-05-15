import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: npm run validate:report -- <path-to-report.html>");
  process.exit(2);
}

const absolutePath = resolve(process.cwd(), filePath);
const html = await readFile(absolutePath, "utf8");
const failures = [];

function fail(message) {
  failures.push(message);
}

function has(pattern) {
  return pattern.test(html);
}

if (!has(/<div\b[^>]*class="[^"]*\breport-page\b[^"]*"[^>]*data-report-type="[^"]+"[^>]*>/)) {
  fail('Root fragment must start with a div using class "report-page" and data-report-type.');
}

if (has(/<\/?(html|head|body)\b/i)) {
  fail("Report HTML must not include html, head, or body tags.");
}

if (has(/<script\b/i)) {
  fail("Report HTML must not include script tags.");
}

if (has(/<style\b/i)) {
  fail("Report HTML must not include style tags.");
}

if (has(/\sstyle\s*=/i)) {
  fail("Report HTML must not include inline style attributes.");
}

if (has(/<(link|iframe|object|embed)\b/i)) {
  fail("Report HTML must not include external resource tags such as link, iframe, object, or embed.");
}

if (has(/\son(?:click|change|input|submit|load|error|mouseover|keydown)\s*=/i)) {
  fail("Report HTML must not include inline event handlers.");
}

if (has(/<form\b|<input\b|<textarea\b|<select\b|<button\b/i)) {
  fail("Report HTML must not include forms, inputs, buttons, or mutation controls.");
}

if (has(/type\s*=\s*["']checkbox["']/i)) {
  fail("Report HTML must not include interactive checkboxes.");
}

if (
  has(/\b(class|id)\s*=\s*["'][^"']*(toc|table-of-contents|download|breadcrumb|navigation|navbar)[^"']*["']/i)
) {
  fail("Report HTML must not include custom TOC, download controls, navigation, or frontend chrome classes or IDs.");
}

if (has(/<(nav|menu)\b/i)) {
  fail("Report HTML must not include navigation or menu elements.");
}

const classMatches = html.matchAll(/\bclass="([^"]+)"/g);
const allowedStructuralClasses = new Set([
  "report-page",
  "report-card",
  "report-title",
  "report-subtitle",
  "report-meta",
  "report-section-title",
  "report-body",
  "report-grid",
  "report-grid-2",
  "report-badge",
  "report-badge-success",
  "report-badge-warning",
  "report-badge-danger",
  "report-callout",
  "report-callout-warning",
  "report-callout-danger",
  "report-metric-grid",
  "report-metric-card",
  "report-table",
  "report-timeline",
  "report-note",
  "report-divider",
  "report-download-bar",
  "report-stat-row",
  "report-stat",
  "report-quote",
  "report-source-list",
  "report-comparison-grid",
  "report-comparison-card",
  "report-progress",
  "report-progress-item",
  "report-progress-label",
  "report-progress-track",
  "report-progress-bar",
  "report-definition-list",
  "report-risk-matrix",
  "report-risk-row",
  "report-footnotes"
]);

for (const match of classMatches) {
  for (const className of match[1].split(/\s+/).filter(Boolean)) {
    if (!className.startsWith("report-")) {
      fail(`Only report-* classes are allowed. Found "${className}".`);
    } else if (!allowedStructuralClasses.has(className)) {
      fail(`Unknown report class "${className}". Add it to the contract before using it.`);
    }
  }
}

const sections = [...html.matchAll(/<section\b([^>]*)>([\s\S]*?)<\/section>/gi)];

if (sections.length === 0) {
  fail("Report must include at least one section.");
}

const sectionIds = new Set();

for (const [index, section] of sections.entries()) {
  const attrs = section[1];
  const body = section[2];
  const id = attrs.match(/data-section-id="([^"]+)"/)?.[1];

  if (!attrs.match(/class="[^"]*\breport-card\b[^"]*"/)) {
    fail(`Section ${index + 1} must use class "report-card".`);
  }

  if (!id) {
    fail(`Section ${index + 1} must include data-section-id.`);
  } else if (sectionIds.has(id)) {
    fail(`Duplicate data-section-id "${id}".`);
  } else {
    sectionIds.add(id);
  }

  const headingMatches = [...body.matchAll(/class="[^"]*\breport-section-title\b[^"]*"/g)];
  if (headingMatches.length !== 1) {
    fail(`Section ${id ?? index + 1} must include exactly one .report-section-title.`);
  }
}

if (failures.length > 0) {
  console.error(`Report validation failed: ${absolutePath}`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Report validation passed: ${absolutePath}`);
