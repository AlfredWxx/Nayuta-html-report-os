# Generate Report Prompt

Use this prompt when generating a GitHub file-based report for Personal HTML Report OS.

Generate two files:

- `content/reports/<folder-path>/<report-id>.json`
- `content/reports/<folder-path>/<report-id>.html`

The JSON file contains metadata. The HTML file contains the report fragment.

## Metadata Rules

The metadata JSON must use this shape:

```json
{
  "id": "example-report",
  "folder_id": "study-notes",
  "title": "Example Report",
  "summary": "Short summary.",
  "category": "Study",
  "report_type": "general-report",
  "updated_at": "2026-05-15",
  "source_project": "manual-ai-generation"
}
```

The `folder_id` must exist in `content/folders.json`.

## HTML Output Rules

- Start with `<div class="report-page" data-report-type="...">`.
- Use only `report-*` classes from `COMPONENT_LIBRARY.md`.
- Do not include `<html>`, `<head>`, `<body>`, `<script>`, `<style>`, inline styles, external CSS, or external JavaScript.
- Do not include custom Table of Contents, navigation, breadcrumbs, download controls, forms, buttons, inputs, or checkboxes.
- Every meaningful section must be `<section class="report-card" data-section-id="stable-id">`.
- Every meaningful section must include exactly one `.report-section-title`.
- Use stable lowercase kebab-case `data-section-id` values.

## Default Quiet Memo Structure

Use this structure unless the user explicitly asks for a different report type:

```html
<div class="report-page" data-report-type="general-report">
  <section class="report-card" data-section-id="context">
    <h2 class="report-section-title">Context</h2>
    <p>...</p>
  </section>
  <section class="report-card" data-section-id="main-reading">
    <h2 class="report-section-title">Main Reading</h2>
    <p>...</p>
  </section>
  <section class="report-card" data-section-id="interpretation">
    <h2 class="report-section-title">Interpretation</h2>
    <p>...</p>
  </section>
  <section class="report-card" data-section-id="supporting-evidence">
    <h2 class="report-section-title">Supporting Evidence</h2>
    <table class="report-table">
      <thead><tr><th>Area</th><th>Read</th><th>Implication</th></tr></thead>
      <tbody><tr><td>...</td><td>...</td><td>...</td></tr></tbody>
    </table>
  </section>
  <section class="report-card" data-section-id="reading-notes">
    <h2 class="report-section-title">Reading Notes</h2>
    <div class="report-grid">
      <div class="report-note"><strong>Note:</strong> ...</div>
    </div>
  </section>
  <section class="report-card" data-section-id="closing">
    <h2 class="report-section-title">Closing</h2>
    <ol class="report-timeline">
      <li><strong>Next:</strong> ...</li>
    </ol>
  </section>
</div>
```

## Optional Rich Components

Use these when they improve clarity, but keep the report black-and-white and static:

- Use `report-stat-row` and `report-stat` for key exam counts, dates, stages, or metrics.
- Use `report-definition-list` for terms and definitions.
- Use `report-progress` for static readiness or phase progress.
- Use `report-comparison-grid` and `report-comparison-card` for side-by-side comparisons.
- Use `report-risk-matrix` and `report-risk-row` for risk, impact, and mitigation summaries.
- Use `report-source-list` or `report-footnotes` for source notes.
- Use `report-quote` for one central thesis or recommendation.

Do not use these components as interactive controls. They are display-only.

## Validation

The generated HTML file must pass:

```bash
npm run validate:report -- content/reports/<folder-path>/<report-id>.html
```
