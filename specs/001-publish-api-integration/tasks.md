# Implementation Tasks: Multi-Project Report Publish API

**Feature**: [spec.md](spec.md) | [plan.md](plan.md)  
**Branch**: `001-publish-api-integration`  
**Status**: Ready for Implementation

---

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | 18 |
| User Stories | 3 (Single Publish, Batch Publish, Folder Management) |
| Estimated Effort | ~20 hours |
| MVP Scope | US1 (Single Report Publishing) |

---

## User Story Dependency Graph

```text
Phase 1: Setup ───────────────────────────────────────┐
                                                       │
Phase 2: Foundational ─────────────────────────────────┤
  [T003-T007] API Infrastructure, Validation, GitHub  │
                                                       │
Phase 3: US1 - Single Report Publishing ───────────────┤
  [T008-T011] Core publish endpoint                   │ [Independent]
                                                       │
Phase 4: US2 - Batch Operations ───────────────────────┤
  [T012-T014] Batch endpoint, partial failures        │ [Depends: US1]
                                                       │
Phase 5: US3 - Folder Management ──────────────────────┤
  [T015-T017] Folder validation, auto-creation        │ [Depends: US1]
                                                       │
Phase 6: Polish ───────────────────────────────────────┘
  [T018] Documentation, examples, client SDK
```

**Parallel Execution Opportunities**:
- T003 (Auth middleware) and T004 (Rate limiting) can be developed in parallel
- T005 (Validation service) and T006 (GitHub API wrapper) can be developed in parallel
- T012 (Batch endpoint) and T015 (Folder validation) can be developed in parallel after US1

---

## Phase 1: Project Setup

**Goal**: Initialize project structure and dependencies

- [ ] T001 Install required dependencies in `package.json`
  - Add `@octokit/rest` for GitHub API
  - Add `rate-limiter-flexible` for rate limiting
  - Add `zod` for request validation
  - **File**: `package.json`, run `npm install`

- [ ] T002 Create environment configuration template
  - Create `.env.local.example` with all required variables
  - Document each variable in comments
  - **File**: `.env.local.example`

---

## Phase 2: Foundational Infrastructure

**Goal**: Build shared services used by all user stories

- [ ] T003 [P] Implement API key authentication middleware
  - Parse `x-api-key` header from requests
  - Validate against environment variables (API_KEY_*)
  - Return 401 for invalid keys
  - **File**: `lib/api/auth.ts`

- [ ] T004 [P] Implement rate limiting middleware
  - Use `rate-limiter-flexible` with in-memory store
  - Limit: 100 requests/minute per API key
  - Return 429 with retry-after header
  - **File**: `lib/api/rateLimit.ts`

- [ ] T005 [P] Refactor HTML validation service
  - Convert `scripts/validate-report.mjs` to TypeScript module
  - Export validation function with detailed error results
  - Maintain same validation rules (no scripts, inline styles, etc.)
  - **File**: `lib/validation/reportValidator.ts`

- [ ] T006 [P] Implement GitHub API wrapper
  - Create functions for: create file, update file, check if exists
  - Use `@octokit/rest` with personal access token
  - Handle authentication and error responses
  - **File**: `lib/api/github.ts`

- [ ] T007 Create shared API response types
  - Define TypeScript interfaces for success/error responses
  - Export validation error type with field/message/line
  - **File**: `types/api.ts`

---

## Phase 3: User Story 1 - Single Report Publishing

**Story**: External project publishes first report  
**Goal**: Functional `/api/publish` endpoint accepting single report  
**Test Criteria**: 
- Valid report returns 200 with report_id and public_url
- Invalid HTML returns 400 with detailed errors
- Missing auth returns 401
- Rate limit exceeded returns 429

- [ ] T008 [US1] Create `/api/publish` route handler
  - Accept POST requests with JSON body
  - Apply auth and rate limit middleware
  - Parse and validate request body structure
  - **File**: `app/api/publish/route.ts`

- [ ] T009 [US1] Implement publish request validation
  - Use Zod to validate request schema
  - Validate required fields: api_key, source_project, folder_path, report.*
  - Return 400 for malformed requests with field errors
  - **File**: `app/api/publish/route.ts` (validation section)

- [ ] T010 [US1] Integrate HTML validation in publish flow
  - Call reportValidator with report.html_content
  - If validation fails, return 400 with error details
  - If validation passes, proceed to file creation
  - **File**: `app/api/publish/route.ts` (handler logic)

- [ ] T011 [US1] Implement GitHub file commit on publish
  - Generate report metadata JSON
  - Commit both `.json` and `.html` files to folder_path
  - Generate public_url based on site config
  - Return success response with all details
  - **File**: `app/api/publish/route.ts` (commit logic)

---

## Phase 4: User Story 2 - Batch Operations

**Story**: AI agent batch publishes multiple reports  
**Goal**: `/api/publish/batch` endpoint with partial failure handling  
**Test Criteria**:
- Batch of 10 reports processes all successfully
- Batch with 2 invalid reports returns partial success (8 success, 2 errors)
- Individual failures don't block other reports in batch

- [ ] T012 [US2] Create `/api/publish/batch` route handler
  - Accept POST with array of reports
  - Apply auth and rate limit middleware
  - Limit batch size to 50 reports
  - **File**: `app/api/publish/batch/route.ts`

- [ ] T013 [US2] Implement batch validation with partial failures
  - Validate each report independently
  - Collect results: success[] and errors[]
  - Continue processing on individual failures
  - **File**: `app/api/publish/batch/route.ts` (validation loop)

- [ ] T014 [US2] Add batch summary response
  - Return structured response with breakdown per item
  - Include batch_id for tracking (use timestamp + random)
  - Count successful vs failed publishes
  - **File**: `app/api/publish/batch/route.ts` (response formatting)

---

## Phase 5: User Story 3 - Folder Management

**Story**: Multiple projects publish to different organizational folders  
**Goal**: Folder validation and auto-creation support  
**Test Criteria**:
- Publish to existing folder succeeds
- Publish to new folder with create_folder_if_missing=true creates folder
- Folder creation updates `content/folders.json`
- Invalid folder paths return 400

- [ ] T015 [US3] Implement folder validation logic
  - Check if folder_path exists in `content/folders.json`
  - Validate folder path format (no special characters)
  - Support nested folders (e.g., "market-research/q1-2026")
  - **File**: `lib/api/folder.ts`

- [ ] T016 [US3] Implement folder auto-creation
  - When create_folder_if_missing=true and folder doesn't exist
  - Parse folder path, create parent folders if needed
  - Update `content/folders.json` with new folder entry
  - Generate proper folder_id and slug
  - **File**: `lib/api/folder.ts`

- [ ] T017 [US3] Add folder-level source project tracking
  - Extend ReportMetadata with source_project field
  - Optionally track which projects publish to which folders
  - **File**: `types/report.ts` (extend interface)

---

## Phase 6: Polish & Documentation

**Goal**: Documentation, examples, and developer experience

- [ ] T018 Create integration documentation and client SDK example
  - Write `docs/API_INTEGRATION.md` with full API reference
  - Create example Node.js client in `examples/api-client/`
  - Add curl examples for common operations
  - Document error handling and best practices
  - **Files**: `docs/API_INTEGRATION.md`, `examples/api-client/index.js`

---

## Implementation Strategy

### MVP First (Recommended)
Complete **Phase 1-3 only** (T001-T011) to deliver US1:
- Single report publishing endpoint
- Basic validation and GitHub integration
- Immediate value for first external project

### Incremental Delivery
After MVP, implement US2 and US3 in parallel:
- US2 enables AI agents to batch publish
- US3 enables better organization as project count grows

### Testing Approach
- **Manual Testing**: Use curl or Postman to test endpoints
- **Integration Testing**: Create test GitHub repo, verify file commits
- **E2E Testing**: Publish real report, verify appears on site after rebuild

---

## Task Checklist

### Ready to Start
- [ ] All design documents reviewed (spec.md, plan.md)
- [ ] Development environment set up
- [ ] GitHub personal access token created
- [ ] Feature branch checked out: `001-publish-api-integration`

### Phase 1: Setup
- [ ] T001: Dependencies installed
- [ ] T002: Environment template created

### Phase 2: Foundational
- [ ] T003: Auth middleware
- [ ] T004: Rate limiting
- [ ] T005: Validation service
- [ ] T006: GitHub API wrapper
- [ ] T007: API types

### Phase 3: US1 (MVP)
- [ ] T008: Publish route
- [ ] T009: Request validation
- [ ] T010: HTML validation integration
- [ ] T011: GitHub commit logic

### Phase 4: US2
- [ ] T012: Batch route
- [ ] T013: Batch validation
- [ ] T014: Batch response

### Phase 5: US3
- [ ] T015: Folder validation
- [ ] T016: Folder creation
- [ ] T017: Source tracking

### Phase 6: Polish
- [ ] T018: Documentation and examples

---

## Success Criteria Verification

| Criterion | How to Verify | Status |
|-----------|---------------|--------|
| Report publish latency < 5s | API response timing | ⬜ |
| Validation pass rate > 95% | Compare failed vs total publishes | ⬜ |
| API uptime 99.5% | Health check monitoring | ⬜ |
| 5+ source projects publishing | Registration tracking | ⬜ |

---

## References

- [spec.md](spec.md) - Functional requirements
- [plan.md](plan.md) - Technical design
- [docs/GITHUB_FILE_WORKFLOW.md](../docs/GITHUB_FILE_WORKFLOW.md) - Current workflow
- [report-design-system/prompts/REPORT_CONTRACT.md](../report-design-system/prompts/REPORT_CONTRACT.md) - Validation rules