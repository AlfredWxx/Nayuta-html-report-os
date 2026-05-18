# Implementation Plan: Multi-Project Report Publish API

**Status**: Draft  
**Last Updated**: 2026-05-18  
**Branch**: `001-publish-api-integration`  
**Feature**: [spec.md](spec.md)

---

## Technical Context

### Current Architecture
- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **Deployment**: GitHub Pages via static export (`next export`)
- **Content**: File-based storage under `content/reports/`
- **Validation**: Node.js script (`validate-report.mjs`)
- **Design System**: CSS classes + prompts in `report-design-system/`

### New Components Required

| Component | Technology | Purpose |
|-----------|------------|---------|
| Publish API Endpoint | Next.js API Route (`/api/publish`) | Receive and process publish requests |
| Validation Service | TypeScript module | HTML validation against REPORT_CONTRACT |
| GitHub Integration | GitHub REST API | File commits to repository |
| Rate Limiting | In-memory or Redis | API protection |
| API Key Management | Environment config | Authentication |

### Technology Choices

| Decision | Choice | Rationale |
|----------|--------|-----------|
| API Framework | Next.js API Routes | Existing infrastructure, no new dependencies |
| GitHub Integration | `@octokit/rest` | Official SDK, well-documented |
| Validation | Reuse `validate-report.mjs` | Consistent with CLI validation |
| Rate Limiting | `rate-limiter-flexible` | Flexible, works serverless |
| Data Storage | GitHub file system | Already used, no new database |

---

## Constitution Check

### Project Principles Alignment

| Principle | Compliance | Notes |
|-----------|------------|-------|
| Read-first architecture | ✅ Compliant | API is write-only from external, read-only for frontend |
| Design system consistency | ✅ Enforced | All reports validated against REPORT_CONTRACT |
| Static-first deployment | ✅ Maintained | GitHub Pages static export unchanged |
| File-based simplicity | ✅ Preserved | Content remains in git repository |

### Quality Gates

- [x] No external database dependencies introduced
- [x] Validation logic reused from existing codebase
- [x] API authentication protects against unauthorized writes
- [x] Rate limiting prevents abuse
- [x] Error handling provides actionable feedback

---

## Phase 0: Research

### Research Questions

1. **GitHub API Integration**
   - **Question**: How to commit files programmatically via GitHub API?
   - **Decision**: Use `@octokit/rest` with personal access token
   - **Rationale**: Official SDK, supports file creation/update with blob/tree/commit workflow
   - **Reference**: [GitHub API Docs - Create/update file](https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents)

2. **API Route Security**
   - **Question**: How to secure Next.js API routes?
   - **Decision**: API key middleware checking `x-api-key` header against env vars
   - **Rationale**: Simple, stateless, sufficient for project-level granularity
   - **Alternatives**: OAuth2 (too complex), JWT (overkill for this use case)

3. **Rate Limiting Strategy**
   - **Question**: How to implement rate limiting in serverless environment?
   - **Decision**: `rate-limiter-flexible` with in-memory store (initial), Redis upgrade path
   - **Rationale**: Works in serverless, upgradeable if needed
   - **Limit**: 100 requests/minute per API key

---

## Phase 1: Design

### Data Model

**ReportPublishRequest** (API Input)
```typescript
interface ReportPublishRequest {
  api_key: string;
  source_project: string;
  folder_path: string;
  report: {
    id: string;
    title: string;
    summary: string;
    category: string;
    report_type: string;
    html_content: string;
  };
  options?: {
    create_folder_if_missing?: boolean;
    update_if_exists?: boolean;
  };
}
```

**ReportMetadata** (File Storage)
```typescript
interface ReportMetadata {
  id: string;
  folder_id: string;
  title: string;
  summary: string;
  category: string;
  report_type: string;
  updated_at: string; // ISO8601
  source_project: string;
  published_via: 'api';
  published_at: string;
}
```

### API Contract

**POST /api/publish**

Request:
```json
{
  "api_key": "proj_abc123",
  "source_project": "market-analysis-bot",
  "folder_path": "market-research/weekly",
  "report": {
    "id": "weekly-market-2026-w20",
    "title": "Weekly Market Analysis - Week 20",
    "summary": "Analysis of market trends and regime shifts",
    "category": "Analysis",
    "report_type": "weekly-report",
    "html_content": "<div class=\"report-page\">...</div>"
  },
  "options": {
    "create_folder_if_missing": true
  }
}
```

Success Response (200):
```json
{
  "success": true,
  "report_id": "weekly-market-2026-w20",
  "public_url": "https://yourusername.github.io/report-os/reports/market-research/weekly/weekly-market-2026-w20",
  "folder_path": "market-research/weekly",
  "published_at": "2026-05-18T16:35:00Z",
  "validation_passed": true,
  "errors": []
}
```

Validation Error Response (400):
```json
{
  "success": false,
  "report_id": null,
  "public_url": null,
  "folder_path": null,
  "published_at": null,
  "validation_passed": false,
  "errors": [
    {
      "field": "html_content",
      "message": "Forbidden tag found: <script>",
      "line": 15
    }
  ]
}
```

### File Structure

```
report-os/
├── app/
│   ├── api/
│   │   └── publish/
│   │       └── route.ts          # API endpoint
│   ├── reports/
│   │   └── [folderPath]/
│   │       └── [reportId]/
│   │           └── page.tsx      # Report reader
│   └── page.tsx                  # Home (folder list)
├── lib/
│   ├── api/
│   │   ├── auth.ts               # API key validation
│   │   ├── rateLimit.ts          # Rate limiting
│   │   └── github.ts             # GitHub API wrapper
│   └── validation/
│       └── reportValidator.ts    # HTML validation (reuse)
├── content/
│   └── reports/                  # Existing structure
└── .env.local                    # API keys config
```

### Environment Configuration

```bash
# .env.local
GITHUB_TOKEN=ghp_xxxxxxxx
GITHUB_OWNER=yourusername
GITHUB_REPO=report-os
GITHUB_BRANCH=main

# API Keys (format: key=project_name)
API_KEY_PROJ1=proj1_abc123
API_KEY_PROJ2=proj2_def456
```

---

## Quick Start (for Developers)

### 1. Get API Key

Contact repository owner to receive:
- API key
- Recommended folder path
- Source project identifier

### 2. Install Client (Optional)

```bash
npm install @yourorg/report-publish-client
```

Or use curl:
```bash
curl -X POST https://yourusername.github.io/report-os/api/publish \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -d '{
    "source_project": "your-project",
    "folder_path": "your-folder",
    "report": {
      "id": "report-001",
      "title": "My Report",
      "summary": "Brief description",
      "category": "Research",
      "report_type": "general-report",
      "html_content": "<div class=\"report-page\">...</div>"
    }
  }'
```

### 3. Generate Report HTML

Ask AI to read design system prompts:
```
report-design-system/prompts/GENERATE_REPORT_PROMPT.md
report-design-system/prompts/REPORT_CONTRACT.md
```

### 4. Validate Before Publishing

```bash
npm run validate:report -- your-report.html
```

---

## Implementation Phases

### Phase 1.1: Core API (Must-Have)

| Task | Description | Effort |
|------|-------------|--------|
| 1.1.1 | Create `/api/publish` route with request parsing | 2h |
| 1.1.2 | Implement API key authentication middleware | 1h |
| 1.1.3 | Integrate HTML validation (reuse existing) | 2h |
| 1.1.4 | Implement GitHub file commit logic | 3h |
| 1.1.5 | Add error handling and response formatting | 2h |

### Phase 1.2: Enhanced Security (Should-Have)

| Task | Description | Effort |
|------|-------------|--------|
| 1.2.1 | Add rate limiting (100 req/min per key) | 2h |
| 1.2.2 | Add request logging and monitoring | 1h |
| 1.2.3 | Implement folder validation/creation | 2h |

### Phase 1.3: Batch Operations (Nice-to-Have)

| Task | Description | Effort |
|------|-------------|--------|
| 1.3.1 | Create `/api/publish/batch` endpoint | 2h |
| 1.3.2 | Implement batch validation with partial failures | 2h |
| 1.3.3 | Add batch status tracking | 2h |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| GitHub API rate limits | High | Implement caching, batch operations, exponential backoff |
| Validation failures | Medium | Provide detailed error messages, client-side pre-validation |
| Concurrent writes | Medium | Use GitHub's optimistic locking (SHA-based updates) |
| Security breach | High | Rotate API keys regularly, monitor access logs |

---

## Testing Strategy

### Unit Tests
- Validation logic
- Authentication middleware
- Rate limiting

### Integration Tests
- Full publish flow with test GitHub repo
- Batch operations
- Error scenarios

### E2E Tests
- Real publish from external project
- Verify report appears on site after rebuild

---

## Success Metrics Tracking

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Publish latency | < 5s | API response time logging |
| Validation pass rate | > 95% | Failed vs total publishes |
| API uptime | 99.5% | Health check monitoring |
| Developer satisfaction | 4.5/5 | Post-integration survey |

---

## Next Steps

1. Create implementation tasks from Phase 1.1
2. Set up test GitHub repository for development
3. Implement core API endpoint
4. Create client SDK example
5. Document integration guide for first external project

---

## References

- [spec.md](spec.md) - Feature specification
- [docs/GITHUB_FILE_WORKFLOW.md](../docs/GITHUB_FILE_WORKFLOW.md) - Current workflow
- [report-design-system/prompts/REPORT_CONTRACT.md](../report-design-system/prompts/REPORT_CONTRACT.md) - Validation rules