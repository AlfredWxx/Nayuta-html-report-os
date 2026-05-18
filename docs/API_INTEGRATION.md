# API Integration Guide

## Overview

The Report Publish API allows external projects to programmatically publish HTML reports to your Personal HTML Report OS.

**Endpoint**: `POST /api/publish`

## Quick Start

### 1. Get API Key

Contact the repository owner to receive:
- API key (used in `x-api-key` header)
- Recommended folder path for your project
- Source project identifier

### 2. Environment Setup

In your project's environment variables:

```bash
REPORT_API_KEY=your_api_key_here
REPORT_API_URL=https://yourusername.github.io/report-os/api/publish
```

### 3. Generate Report HTML

Before publishing, generate valid report HTML. Ask AI to read the design system:

```text
Please read these files from the Report OS repository:
- report-design-system/prompts/GENERATE_REPORT_PROMPT.md
- report-design-system/prompts/REPORT_CONTRACT.md

Then generate a report about [your topic].
```

### 4. Validate Locally (Optional)

```bash
# Clone the Report OS repo and run validation
npm run validate:report -- your-report.html
```

### 5. Publish Report

```bash
curl -X POST https://yourusername.github.io/report-os/api/publish \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -d '{
    "api_key": "your_api_key",
    "source_project": "your-project-name",
    "folder_path": "your-folder-path",
    "report": {
      "id": "unique-report-id",
      "title": "Report Title",
      "summary": "Brief description",
      "category": "Research",
      "report_type": "weekly-report",
      "html_content": "<div class=\"report-page\">...</div>"
    }
  }'
```

## API Reference

### POST /api/publish

Publish a single report.

#### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | Must be `application/json` |
| `x-api-key` | Yes | Your API key |

#### Request Body

```typescript
{
  api_key: string;           // Your API key
  source_project: string;    // Project identifier (e.g., "market-analysis-bot")
  folder_path: string;       // Target folder (e.g., "market-research/weekly")
  report: {
    id: string;              // Unique report ID (alphanumeric, hyphens, underscores)
    title: string;           // Report title
    summary: string;         // Brief description
    category: string;        // Category label
    report_type: string;     // Type identifier
    html_content: string;    // Validated HTML content (max 500KB)
  };
  options?: {
    create_folder_if_missing?: boolean;  // Auto-create folder if needed
    update_if_exists?: boolean;          // Update if report already exists
  };
}
```

#### Success Response (200)

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

#### Validation Error Response (400)

```json
{
  "success": false,
  "report_id": "weekly-market-2026-w20",
  "public_url": null,
  "folder_path": null,
  "published_at": null,
  "validation_passed": false,
  "errors": [
    {
      "field": "html_content",
      "message": "Report HTML must not include script tags.",
      "line": 15
    }
  ]
}
```

#### Authentication Error (401)

```json
{
  "success": false,
  "error": "Unauthorized",
  "code": "INVALID_API_KEY",
  "message": "Invalid or missing API key. Provide a valid x-api-key header."
}
```

#### Rate Limit Error (429)

```json
{
  "success": false,
  "error": "Rate Limit Exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Rate limit exceeded. Try again in 60 seconds."
}
```

## Client SDK Example

### Node.js

```javascript
// reportClient.js
class ReportClient {
  constructor(apiKey, baseUrl) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async publish(report, folderPath, sourceProject) {
    const response = await fetch(`${this.baseUrl}/api/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
      },
      body: JSON.stringify({
        api_key: this.apiKey,
        source_project: sourceProject,
        folder_path: folderPath,
        report,
      }),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(`Publish failed: ${JSON.stringify(data.errors || data.error)}`);
    }

    return data;
  }
}

// Usage
const client = new ReportClient(
  process.env.REPORT_API_KEY,
  process.env.REPORT_API_URL
);

await client.publish({
  id: 'analysis-2026-05-18',
  title: 'Market Analysis',
  summary: 'Daily market analysis report',
  category: 'Analysis',
  report_type: 'daily-report',
  html_content: '<div class="report-page">...</div>',
}, 'market-research/daily', 'my-trading-bot');
```

### Python

```python
import requests
import os

class ReportClient:
    def __init__(self, api_key, base_url):
        self.api_key = api_key
        self.base_url = base_url
    
    def publish(self, report, folder_path, source_project):
        response = requests.post(
            f"{self.base_url}/api/publish",
            headers={
                "Content-Type": "application/json",
                "x-api-key": self.api_key,
            },
            json={
                "api_key": self.api_key,
                "source_project": source_project,
                "folder_path": folder_path,
                "report": report,
            }
        )
        
        data = response.json()
        
        if not data["success"]:
            raise Exception(f"Publish failed: {data}")
        
        return data

# Usage
client = ReportClient(
    os.getenv("REPORT_API_KEY"),
    os.getenv("REPORT_API_URL")
)

result = client.publish({
    "id": "analysis-2026-05-18",
    "title": "Market Analysis",
    "summary": "Daily market analysis report",
    "category": "Analysis",
    "report_type": "daily-report",
    "html_content": '<div class="report-page">...</div>',
}, "market-research/daily", "my-trading-bot")

print(f"Published: {result['public_url']}")
```

## Best Practices

### 1. Report ID Convention

Use consistent, descriptive IDs:
- `weekly-market-2026-w20`
- `daily-analysis-2026-05-18`
- `project-alpha-q2-review`

### 2. Folder Organization

Organize reports by project and time:
```
market-research/
  ├── weekly/
  ├── monthly/
  └── ad-hoc/

project-alpha/
  ├── requirements/
  ├── design/
  └── retrospectives/
```

### 3. Error Handling

Always handle validation errors gracefully:

```javascript
try {
  const result = await client.publish(report, folder, project);
  console.log(`Published: ${result.public_url}`);
} catch (error) {
  if (error.message.includes('validation')) {
    // Fix HTML and retry
    console.error('Validation failed:', error);
  } else if (error.message.includes('rate limit')) {
    // Wait and retry
    await sleep(60000);
    return retry();
  } else {
    // Log and alert
    console.error('Publish failed:', error);
  }
}
```

### 4. Pre-validation

Validate reports before calling the API to save bandwidth:

```bash
# Local validation
npm run validate:report -- report.html

# Only publish if validation passes
if [ $? -eq 0 ]; then
  curl -X POST ... # publish
fi
```

## Rate Limits

- **100 requests per minute** per API key
- Rate limit resets every 60 seconds
- Exceeding the limit returns HTTP 429 with `Retry-After: 60` header

## Report Requirements

### Valid HTML Structure

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
</div>
```

### Constraints

- No `<script>`, `<style>`, `<html>`, `<head>`, `<body>` tags
- No inline styles (`style="..."`)
- Only `report-*` CSS classes allowed
- Max size: 500KB
- Must include at least one section with `data-section-id`

## Troubleshooting

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `INVALID_API_KEY` | Wrong or missing API key | Check your API key |
| `script_tag` | HTML contains `<script>` | Remove all JavaScript |
| `inline_style` | CSS in `style` attribute | Use `report-*` classes instead |
| `css_class` | Unknown class name | Use only approved `report-*` classes |
| `size` | Report > 500KB | Reduce content or split into multiple reports |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Wait 60 seconds and retry |

### Support

For API access or issues, contact the repository owner.