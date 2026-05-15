# GitHub File-Based Report Workflow

This project can run as a static report library without Supabase, Vercel, or a backend.

## Content Source

Reports live in the repo under `content/`:

```text
content/
  folders.json
  reports/
    study-notes/
      frm-certification-path.json
      frm-certification-path.html
```

The `.json` file stores report metadata. The `.html` file stores the report fragment.

## Adding A Report

1. Ask AI to read:

- `report-design-system/prompts/GENERATE_REPORT_PROMPT.md`
- `report-design-system/prompts/REPORT_CONTRACT.md`
- `report-design-system/prompts/COMPONENT_LIBRARY.md`
- `report-design-system/prompts/REPORT_STYLE_GUIDE.md`

2. Generate:

```text
content/reports/<folder-path>/<report-id>.json
content/reports/<folder-path>/<report-id>.html
```

3. Validate the HTML:

```bash
npm run validate:report -- content/reports/study-notes/example.html
```

4. Commit and push:

```bash
git add content
git commit -m "Add report"
git push
```

GitHub Pages rebuilds the static site after push.

## Metadata Shape

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

## Folder Rules

- Folder definitions live in `content/folders.json`.
- `folder_id` in report metadata must match an existing folder ID.
- Nested folder URL paths are derived from folder ancestors and `slug` values.

## GitHub Pages

The project uses Next.js static export. The workflow at `.github/workflows/deploy-pages.yml` builds `out/` and deploys it to GitHub Pages.

In GitHub repository settings:

1. Go to `Settings -> Pages`.
2. Set source to `GitHub Actions`.
3. Push to `main`.
