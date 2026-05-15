# Personal HTML Report OS

A private, read-only, GitHub file-backed library for AI-generated HTML reports. Version 0.1 is focused on a calm Report Library and a long-form Report Reader that can be published through GitHub Pages.

## Current Phase 1 Scope

- Static visual prototype only.
- Next.js App Router, TypeScript, and Tailwind CSS.
- File-based report data under `content/`.
- Three read-only screens: folder-based Library homepage, folder report list, and Report Reader detail page.
- Reader chrome: fixed top-left breadcrumb, fixed top-right Download menu, and generated Table of Contents.
- Visual-only Download menu with no download logic.
- No Supabase, API, search, filter, editing, deletion, comments, permissions, or AI generation.

## Roadmap

- Phase 1: Confirm static visual direction and report design system.
- Phase 2: Use GitHub file-based reports as the primary content source.
- Phase 3: Add GitHub Pages static deployment.
- Phase 4: Add PDF, HTML, and Markdown export/download workflows.
- Phase 5: Consider Supabase or a publish API only if file-based workflow becomes limiting.

## Report Design System

`report-design-system/styles/report-theme.css` is the single visual source for report HTML. AI-generated report fragments must use the `report-*` class system and follow the quiet memo-style templates in `report-design-system/templates`.

The Reader owns navigation, downloads, and Table of Contents. Report HTML only provides content sections with stable `data-section-id` values and `.report-section-title` headings.

The prompt documents in `report-design-system/prompts` define the long-term style guide, component library, and report HTML contract.

## Generating Reports With AI

Future AI-generated reports should read these files before producing HTML:

- `report-design-system/prompts/GENERATE_REPORT_PROMPT.md`
- `report-design-system/prompts/REPORT_CONTRACT.md`
- `report-design-system/prompts/REPORT_STYLE_GUIDE.md`
- `report-design-system/prompts/COMPONENT_LIBRARY.md`

Generated report HTML must be validated before storage:

```bash
npm run validate:report -- examples/valid-report.html
```

The validator rejects scripts, styles, inline styles, external resources, custom TOC, navigation, download controls, forms, buttons, checkboxes, unknown classes, missing section IDs, and missing section titles.

Phase 1.2 adds richer static HTML report components such as stat rows, quotes, source lists, comparison cards, progress blocks, definition lists, risk matrices, and footnotes. These are still black-and-white, static, and validator-controlled.

## GitHub File Workflow

Reports are stored as files:

```text
content/reports/<folder-path>/<report-id>.json
content/reports/<folder-path>/<report-id>.html
```

See `docs/GITHUB_FILE_WORKFLOW.md`.

For the exact steps to add a new report, see `docs/ADD_REPORT.md`.

## Why The Frontend Is Read-only

The product goal is a high-quality reading and archive experience, not a dashboard or CMS. The homepage is organized as folders first, then individual reports inside each folder. Keeping Version 0.1 read-only prevents premature editing workflows, protects report integrity, and leaves publishing to future controlled APIs.

## Optional Future Supabase Integration

Supabase is no longer required for the primary workflow. It remains a future option if GitHub file-based reports become limiting. See `docs/PHASE2_DATA_MODEL.md`.

The current app reads from `content/` at build time.

## Future Publish API

A later publish API can accept validated report payloads from other repositories. Incoming HTML should be checked against `REPORT_CONTRACT.md` before storage.

## Future Downloads

PDF, HTML, and Markdown downloads are intentionally not implemented in Phase 1. The current reader reserves a visual download bar so export workflows can be added without redesigning the reader.

## Development

```bash
npm install
npm run build
```
