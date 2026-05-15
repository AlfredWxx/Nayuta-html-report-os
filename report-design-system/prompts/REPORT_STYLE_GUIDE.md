# Report Style Guide

Personal HTML Report OS uses a quiet, professional, read-only report language. Reports should feel closer to a private research memo than a dashboard or landing page.

## Principles

- Use calm hierarchy, generous whitespace, large radius, and light shadows.
- Keep the default report body black-and-white: black, white, and gray should carry the hierarchy.
- Write concise, decision-ready sections with clear headings and stable structure.
- Prefer readable prose over dense widgets.
- Do not introduce frontend editing controls, forms, scripts, or interactive state.
- Do not add navigation, downloads, or Table of Contents inside report HTML; the Reader owns those surfaces.

## Required Structure

Each report fragment starts with:

```html
<div class="report-page" data-report-type="general-report">
```

Each section uses:

```html
<section class="report-card" data-section-id="stable-id">
```

Use stable `data-section-id` values so future storage, export, and publish workflows can target sections safely.

## Default Section Rhythm

Use this section sequence unless a report type has a strong reason to differ:

1. `context`
2. `main-reading`
3. `interpretation`
4. `supporting-evidence`
5. `reading-notes`
6. `closing`

Each section should include one `.report-section-title` so the Reader can generate a Table of Contents.
