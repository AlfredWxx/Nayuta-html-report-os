/**
 * POST /api/publish
 * 
 * Publish a single report to the repository
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withAuth } from '@/lib/api/auth';
import { withRateLimit } from '@/lib/api/rateLimit';
import { validateReportHtml } from '@/lib/validation/reportValidator';
import { upsertFile, generateReportUrl } from '@/lib/api/github';
import type { ReportPublishResponse, ReportMetadata } from '@/types/api';

// Request validation schema
const publishRequestSchema = z.object({
  api_key: z.string(),
  source_project: z.string().min(1).max(100),
  folder_path: z.string().min(1).max(200),
  report: z.object({
    id: z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/),
    title: z.string().min(1).max(200),
    summary: z.string().min(1).max(500),
    category: z.string().min(1).max(50),
    report_type: z.string().min(1).max(50),
    html_content: z.string().min(1).max(500 * 1024), // 500KB max
  }),
  options: z.object({
    create_folder_if_missing: z.boolean().optional(),
    update_if_exists: z.boolean().optional(),
  }).optional(),
});

/**
 * Main handler for POST /api/publish
 */
async function handlePublish(
  request: NextRequest,
  projectName: string
): Promise<NextResponse> {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate request structure
    const validationResult = publishRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => ({
        field: String(err.path[0] || 'unknown'),
        message: err.message,
      }));
      
      return NextResponse.json(
        {
          success: false,
          report_id: null,
          public_url: null,
          folder_path: null,
          published_at: null,
          validation_passed: false,
          errors,
        } as ReportPublishResponse,
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const { report, folder_path, options } = data;

    // Validate HTML content
    const htmlValidation = validateReportHtml(report.html_content);
    
    if (!htmlValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          report_id: report.id,
          public_url: null,
          folder_path: null,
          published_at: null,
          validation_passed: false,
          errors: htmlValidation.errors,
        } as ReportPublishResponse,
        { status: 400 }
      );
    }

    // Generate metadata
    const now = new Date().toISOString();
    const metadata: ReportMetadata = {
      id: report.id,
      folder_id: folder_path,
      title: report.title,
      summary: report.summary,
      category: report.category,
      report_type: report.report_type,
      updated_at: now,
      source_project: data.source_project,
      published_via: 'api',
      published_at: now,
    };

    // Prepare file paths
    const basePath = `content/reports/${folder_path}`;
    const htmlPath = `${basePath}/${report.id}.html`;
    const jsonPath = `${basePath}/${report.id}.json`;

    // Commit files to GitHub
    const commitMessage = `Publish report: ${report.title} (${report.id})`;
    
    try {
      // Commit HTML file
      await upsertFile(
        htmlPath,
        report.html_content,
        `${commitMessage} - HTML`
      );

      // Commit metadata JSON
      await upsertFile(
        jsonPath,
        JSON.stringify(metadata, null, 2),
        `${commitMessage} - Metadata`
      );
    } catch (error: any) {
      console.error('GitHub commit error:', error);
      
      return NextResponse.json(
        {
          success: false,
          report_id: report.id,
          public_url: null,
          folder_path,
          published_at: null,
          validation_passed: true,
          errors: [
            {
              field: 'github',
              message: `Failed to commit files: ${error.message}`,
            },
          ],
        } as ReportPublishResponse,
        { status: 500 }
      );
    }

    // Generate public URL
    const publicUrl = generateReportUrl(folder_path, report.id);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        report_id: report.id,
        public_url: publicUrl,
        folder_path,
        published_at: now,
        validation_passed: true,
        errors: [],
      } as ReportPublishResponse,
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Publish error:', error);
    
    return NextResponse.json(
      {
        success: false,
        report_id: null,
        public_url: null,
        folder_path: null,
        published_at: null,
        validation_passed: false,
        errors: [
          {
            field: 'server',
            message: `Internal server error: ${error.message}`,
          },
        ],
      } as ReportPublishResponse,
      { status: 500 }
    );
  }
}

// Export wrapped handler with auth and rate limiting
export const POST = withRateLimit(withAuth(handlePublish));