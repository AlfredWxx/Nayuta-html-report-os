# Add A Report

Use this guide when adding a new report to the GitHub file-based report library.

## 1. Pick The Folder

Folders are defined in:

```text
content/folders.json
```

Use an existing `folder_id` unless you intentionally add a new folder.

Example:

```json
{
  "id": "study-notes",
  "title": "Study Notes",
  "slug": "study-notes",
  "parent_id": null
}
```

## 2. Create Two Files

Each report needs one metadata file and one HTML file:

```text
content/reports/<folder-path>/<report-id>.json
content/reports/<folder-path>/<report-id>.html
```

Example:

```text
content/reports/study-notes/frm-certification-path.json
content/reports/study-notes/frm-certification-path.html
```

## 3. Metadata File

The `.json` file must use this shape:

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

Rules:

- `id` must match the file name.
- `folder_id` must exist in `content/folders.json`.
- `updated_at` should use `YYYY-MM-DD`.
- Do not put `html_content` in JSON. HTML lives in the `.html` file.

## 4. HTML File

The `.html` file must be a report fragment:

```html
<div class="report-page" data-report-type="general-report">
  <section class="report-card" data-section-id="context">
    <h2 class="report-section-title">Context</h2>
    <p>...</p>
  </section>
</div>
```

Rules:

- Use only `report-*` classes.
- Use stable `data-section-id` values.
- Every meaningful section must include exactly one `.report-section-title`.
- Do not include custom TOC, navigation, download controls, forms, buttons, inputs, or checkboxes.
- Do not include `<html>`, `<head>`, `<body>`, `<script>`, `<style>`, inline styles, external CSS, or external JavaScript.

## 5. Ask AI To Generate The Report

Tell AI to read:

```text
report-design-system/prompts/GENERATE_REPORT_PROMPT.md
report-design-system/prompts/REPORT_CONTRACT.md
report-design-system/prompts/REPORT_STYLE_GUIDE.md
report-design-system/prompts/COMPONENT_LIBRARY.md
docs/ADD_REPORT.md
```

Ask it to generate both files:

```text
content/reports/<folder-path>/<report-id>.json
content/reports/<folder-path>/<report-id>.html
```

## 6. Validate

Run:

```bash
npm run validate:report -- content/reports/<folder-path>/<report-id>.html
```

The report must pass before committing.

## 7. Preview

Run:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 8. Commit

```bash
git add content
git commit -m "Add report"
git push
```

If GitHub Pages is enabled, the site rebuilds after push.
