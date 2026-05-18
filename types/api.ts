/**
 * API Types for Report Publish API
 */

// Request Types

export interface ReportPublishRequest {
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

export interface BatchPublishRequest {
  api_key: string;
  source_project: string;
  reports: Array<ReportPublishRequest['report']>;
  options?: {
    continue_on_error?: boolean;
    webhook_url?: string;
  };
}

// Response Types

export interface ValidationError {
  field: string;
  message: string;
  line?: number;
}

export interface ReportPublishResponse {
  success: boolean;
  report_id: string | null;
  public_url: string | null;
  folder_path: string | null;
  published_at: string | null;
  validation_passed: boolean;
  errors: ValidationError[];
}

export interface BatchItemResult {
  report_id: string;
  success: boolean;
  public_url?: string;
  errors?: ValidationError[];
}

export interface BatchPublishResponse {
  success: boolean;
  batch_id: string;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
  results: BatchItemResult[];
}

// Error Response

export interface ApiErrorResponse {
  success: false;
  error: string;
  code: string;
  message: string;
}

// Metadata Types

export interface ReportMetadata {
  id: string;
  folder_id: string;
  title: string;
  summary: string;
  category: string;
  report_type: string;
  updated_at: string;
  source_project: string;
  published_via: 'api' | 'manual';
  published_at: string;
}