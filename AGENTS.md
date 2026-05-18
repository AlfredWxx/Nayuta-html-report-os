<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read:

specs/001-publish-api-integration/plan.md
specs/001-publish-api-integration/spec.md
<!-- SPECKIT END -->

# Project Rules

- The frontend is read-only by default.
- Do not add frontend create, edit, delete, or mutation entry points unless a later phase explicitly requires them.
- Do not casually add search, filter, complex sidebars, or dashboard-heavy UI.
- `report-design-system` is the single source of truth for report visuals.
- AI-generated reports must use `report-*` classes.
- Report HTML must not contain `<script>`, `<style>`, `<html>`, `<head>`, `<body>`, inline styles, external CSS, or external JavaScript.
- Report HTML should use stable `data-section-id` attributes.
- Report HTML must include `.report-section-title` in meaningful sections so the Reader can generate TOC.
- Report HTML must not include custom TOC, download controls, navigation, or frontend chrome.
- Generated report HTML should pass `npm run validate:report -- <file>` before being stored or added to mock data.
- Reader chrome is fixed: breadcrumb top-left, Download top-right, generated TOC in the reader layout.
- Reports default to black-and-white quiet memo styling.
- Rich report components are allowed only when they are static, use approved `report-*` classes, and pass the validator.
- Future features must be implemented by phase. Do not over-engineer the platform in one pass.
- Version 0.1 prioritizes a quiet, premium reading experience over report management workflows.
- Primary content source is GitHub file-based content under `content/`; Supabase is optional future infrastructure, not the default path.
