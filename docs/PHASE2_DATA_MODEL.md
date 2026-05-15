# Optional Supabase Data Model Draft

The primary workflow is now GitHub file-based content under `content/`. This document is kept only as a future optional Supabase model if file-based reports become limiting.

## Tables

### folders

```sql
create table folders (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references folders(id) on delete cascade,
  title text not null,
  slug text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(parent_id, slug)
);
```

### reports

```sql
create table reports (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid not null references folders(id) on delete cascade,
  title text not null,
  summary text not null default '',
  category text not null default 'General',
  report_type text not null default 'general-report',
  source_project text not null default '',
  html_content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## Read Model

- Library homepage reads root folders where `parent_id is null`.
- Folder pages read child folders and reports by `folder_id`.
- Report pages read a single report and its ancestor folder path.
- Frontend remains read-only: no create, edit, or delete surfaces.
- Local development falls back to mock data when Supabase env vars are missing.
- Phase 2.1 repository functions live in `lib/reportRepository.ts`.

## HTML Validation

Before storage, report HTML should be validated against `report-design-system/prompts/REPORT_CONTRACT.md`.

Required checks:

- Root starts with `.report-page`.
- Meaningful sections use `section.report-card[data-section-id]`.
- Each meaningful section contains one `.report-section-title`.
- No `script`, `style`, `html`, `head`, `body`, inline styles, or external CSS/JS.
- No custom TOC, navigation, download controls, forms, checkboxes, or mutation UI.

## Future Publish API Shape

```json
{
  "folder_path": ["Market Research"],
  "title": "Example Report",
  "summary": "Short report summary.",
  "category": "Research",
  "report_type": "quant-research-report",
  "source_project": "external-repo-name",
  "html_content": "<div class=\"report-page\" data-report-type=\"quant-research-report\">...</div>"
}
```

The publish API should validate HTML first, create missing folders only if explicitly allowed, and store reports without adding any frontend editing workflow.
