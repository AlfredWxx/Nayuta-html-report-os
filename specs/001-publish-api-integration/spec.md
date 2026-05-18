# Feature Specification: Multi-Project Report Publish API

## Feature Overview

Enable external projects to publish validated HTML reports to the central Personal HTML Report OS through a standardized API workflow, creating a unified report management and reading experience across multiple codebases.

### Background & Motivation

The current system supports manual report generation and Git-based file workflows. However, as the number of source projects grows, manual file copying becomes inefficient. Teams need an automated way to publish reports from their respective repositories while maintaining design system consistency and content validation.

### Target Users

- **Developers**: From other projects who want to publish analysis reports, research notes, or documentation
- **AI Agents**: Automated systems generating reports from various data sources
- **Report Readers**: End users who consume reports through the unified frontend interface

---

## User Scenarios & Testing

### Scenario 1: External Project Publishes First Report

**Given**: A data analysis project wants to publish weekly market reports  
**When**: Developer runs publish command from their project  
**Then**: 
- Report passes validation against design system contract
- Report appears in designated folder within 60 seconds
- Report is readable through the web interface
- Developer receives confirmation with report URL

**Acceptance Criteria**:
- [ ] Publish endpoint accepts JSON metadata + HTML content
- [ ] Response includes report ID and public URL
- [ ] Failed validation returns detailed error messages
- [ ] Published reports are immediately available (no rebuild delay)

### Scenario 2: AI Agent Batch Publishing

**Given**: An AI system generates 10 research reports overnight  
**When**: Batch publish API is called  
**Then**:
- All valid reports are published
- Invalid reports are rejected with specific reasons
- Partial success is handled gracefully
- Batch ID allows tracking all items in the batch

**Acceptance Criteria**:
- [ ] Batch endpoint accepts up to 50 reports per call
- [ ] Individual report failures don't block batch completion
- [ ] Response includes success/failure breakdown per item
- [ ] Duplicate report detection prevents overwrites

### Scenario 3: Folder Organization and Routing

**Given**: Multiple projects publish to different organizational folders  
**When**: Reports are published with folder specifications  
**Then**:
- Reports route to correct folder hierarchy
- Auto-create folders if permitted
- Respect folder access patterns
- Maintain folder navigation integrity

**Acceptance Criteria**:
- [ ] Folder path validation on publish
- [ ] Optional auto-folder creation
- [ ] Folder-level source project tracking
- [ ] Reports from same project group together visually

---

## Functional Requirements

### FR1: Publish Endpoint

| ID | Requirement | Priority |
|----|-------------|----------|
| FR1.1 | Accept POST requests with report metadata and HTML content | Must Have |
| FR1.2 | Validate HTML against REPORT_CONTRACT.md before accepting | Must Have |
| FR1.3 | Support API key authentication per source project | Must Have |
| FR1.4 | Return structured JSON response with report ID, URL, status | Must Have |
| FR1.5 | Support idempotent publishing (same content = same report ID) | Should Have |
| FR1.6 | Rate limit: 100 requests/minute per API key | Should Have |

### FR2: Report Validation

| ID | Requirement | Priority |
|----|-------------|----------|
| FR2.1 | Reject HTML containing scripts, inline styles, or forbidden tags | Must Have |
| FR2.2 | Verify all CSS classes match approved `report-*` design system | Must Have |
| FR2.3 | Validate required section structure (data-section-id, section titles) | Must Have |
| FR2.4 | Check report size limit (max 500KB HTML content) | Should Have |
| FR2.5 | Provide detailed validation error messages with line numbers | Should Have |

### FR3: Batch Operations

| ID | Requirement | Priority |
|----|-------------|----------|
| FR3.1 | Accept array of reports in single request | Should Have |
| FR3.2 | Process reports independently (one failure doesn't block others) | Should Have |
| FR3.3 | Return batch summary with individual report statuses | Should Have |
| FR3.4 | Support async processing for large batches with webhook callback | Nice to Have |

### FR4: Folder Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR4.1 | Support folder path parameter (e.g., "market-research/q1-2026") | Must Have |
| FR4.2 | Validate folder exists or create if allowed | Should Have |
| FR4.3 | Track source project per report for filtering/grouping | Should Have |
| FR4.4 | Support folder-level permissions (which projects can publish where) | Nice to Have |

### FR5: Content Updates

| ID | Requirement | Priority |
|----|-------------|----------|
| FR5.1 | Support updating existing reports by ID | Should Have |
| FR5.2 | Track report version history | Nice to Have |
| FR5.3 | Soft delete capability with recovery window | Nice to Have |

---

## Success Criteria

| Criterion | Target | Measurement Method |
|-----------|--------|-------------------|
| Report publish latency | < 5 seconds from API call to availability | Automated monitoring |
| Validation pass rate | > 95% for properly formatted reports | Analytics on publish attempts |
| API uptime | 99.5% availability | Monitoring dashboard |
| Developer satisfaction | 4.5/5 on ease of integration | Post-integration survey |
| Report discoverability | 100% of published reports accessible via web UI | Automated audit |
| Multi-project support | 5+ distinct source projects actively publishing | Registration tracking |

---

## Key Entities

### ReportPublishRequest
```
{
  "api_key": "string",           // Authentication
  "source_project": "string",    // Source identifier
  "folder_path": "string",       // Target folder (e.g., "study-notes/ml-research")
  "report": {
    "id": "string",              // Unique report ID
    "title": "string",
    "summary": "string",
    "category": "string",
    "report_type": "string",
    "html_content": "string"     // Validated HTML fragment
  },
  "options": {
    "create_folder_if_missing": boolean,
    "update_if_exists": boolean
  }
}
```

### ReportPublishResponse
```
{
  "success": boolean,
  "report_id": "string",
  "public_url": "string",
  "folder_path": "string",
  "published_at": "ISO8601",
  "validation_passed": boolean,
  "errors": [                    // Empty if success
    {
      "field": "string",
      "message": "string",
      "line": number
    }
  ]
}
```

### BatchPublishRequest
```
{
  "api_key": "string",
  "source_project": "string",
  "reports": [ReportPublishRequest.report],
  "options": {
    "continue_on_error": boolean,
    "webhook_url": "string"      // Optional async callback
  }
}
```

---

## Out of Scope (Future Phases)

The following are intentionally excluded from this feature:

1. **Real-time collaborative editing** - Reports are immutable once published
2. **Rich media uploads** - Images must be base64-encoded or externally hosted
3. **Advanced search/indexing** - Covered in Phase 5+ roadmap
4. **User management/permissions UI** - API keys managed via configuration
5. **Report templates/generation** - Source projects handle their own generation
6. **Commenting/discussion** - Out of scope for read-first architecture
7. **PDF/DOCX export** - Planned for Phase 4

---

## Assumptions & Dependencies

### Assumptions
- Source projects have access to Report design system prompts
- API keys are distributed securely outside this system
- GitHub file storage remains the primary persistence layer
- Static site regeneration (Next.js export) handles content updates

### Dependencies
- GitHub repository access for file storage
- Next.js static export build pipeline
- Existing report validation logic (validate-report.mjs)
- Current folder structure in content/

---

## Technical Decisions

### Authentication Method
**Decision**: Simple API keys (Option A)

API keys are project-level, stored in environment configuration. Each source project receives a unique key for tracking and rate limiting. Keys are distributed securely via project environment variables.

### Deployment Strategy  
**Decision**: Direct GitHub file commit (Option A)

Published reports commit directly to the `content/reports/` directory in the repository. GitHub Actions workflow triggers static site rebuild. Acceptable latency (1-2 minutes) aligns with report publishing use case. Zero additional infrastructure cost.

---

---

## Related Documentation

- `docs/GITHUB_FILE_WORKFLOW.md` - Current file-based workflow
- `report-design-system/prompts/REPORT_CONTRACT.md` - HTML validation rules
- `README.md` - Project roadmap and architecture

---

## Feature Readiness Checklist

- [ ] Specification reviewed and approved
- [ ] Technical approach validated against infrastructure constraints
- [ ] Open questions resolved
- [ ] Success criteria agreed upon by stakeholders