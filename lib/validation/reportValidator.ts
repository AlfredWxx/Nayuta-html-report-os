/**
 * HTML Report Validator
 * 
 * Validates report HTML against the REPORT_CONTRACT.md specification.
 * Based on scripts/validate-report.mjs
 */

import type { ValidationError } from '@/types/api';

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validate report HTML content
 * Returns detailed validation results with line numbers
 */
export function validateReportHtml(html: string): ValidationResult {
  const errors: ValidationError[] = [];

  // Helper to add error with optional line number
  function addError(field: string, message: string) {
    const line = findLineNumber(html, field);
    errors.push({ field, message, line });
  }

  // Helper to check if pattern exists in HTML
  function has(pattern: RegExp): boolean {
    return pattern.test(html);
  }

  // 1. Check root element structure
  if (!has(/<div\b[^>]*class="[^"]*\breport-page\b[^"]*"[^>]*data-report-type="[^"]+"[^>]*>/)) {
    addError('root_element', 'Root fragment must start with a div using class "report-page" and data-report-type.');
  }

  // 2. Forbidden tags
  if (has(/<\/?(html|head|body)\b/i)) {
    addError('forbidden_tags', 'Report HTML must not include html, head, or body tags.');
  }

  if (has(/<script\b/i)) {
    addError('script_tag', 'Report HTML must not include script tags.');
  }

  if (has(/<style\b/i)) {
    addError('style_tag', 'Report HTML must not include style tags.');
  }

  if (has(/<(link|iframe|object|embed)\b/i)) {
    addError('external_resources', 'Report HTML must not include external resource tags such as link, iframe, object, or embed.');
  }

  // 3. Inline styles and handlers
  if (has(/\sstyle\s*=/i)) {
    addError('inline_style', 'Report HTML must not include inline style attributes.');
  }

  if (has(/\son(?:click|change|input|submit|load|error|mouseover|keydown)\s*=/i)) {
    addError('inline_handlers', 'Report HTML must not include inline event handlers.');
  }

  // 4. Interactive elements
  if (has(/<form\b|<input\b|<textarea\b|<select\b|<button\b/i)) {
    addError('interactive_controls', 'Report HTML must not include forms, inputs, buttons, or mutation controls.');
  }

  if (has(/type\s*=\s*["']checkbox["']/i)) {
    addError('checkbox', 'Report HTML must not include interactive checkboxes.');
  }

  // 5. Reader-owned UI elements
  if (
    has(/\b(class|id)\s*=\s*["'][^"']*(toc|table-of-contents|download|breadcrumb|navigation|navbar)[^"']*["']/i)
  ) {
    addError('reader_ui', 'Report HTML must not include custom TOC, download controls, navigation, or frontend chrome classes or IDs.');
  }

  if (has(/<(nav|menu)\b/i)) {
    addError('navigation', 'Report HTML must not include navigation or menu elements.');
  }

  // 6. CSS class validation
  const allowedStructuralClasses = new Set([
    'report-page',
    'report-card',
    'report-title',
    'report-subtitle',
    'report-meta',
    'report-section-title',
    'report-body',
    'report-grid',
    'report-grid-2',
    'report-badge',
    'report-badge-success',
    'report-badge-warning',
    'report-badge-danger',
    'report-callout',
    'report-callout-warning',
    'report-callout-danger',
    'report-metric-grid',
    'report-metric-card',
    'report-table',
    'report-timeline',
    'report-note',
    'report-divider',
    'report-download-bar',
    'report-stat-row',
    'report-stat',
    'report-quote',
    'report-source-list',
    'report-comparison-grid',
    'report-comparison-card',
    'report-progress',
    'report-progress-item',
    'report-progress-label',
    'report-progress-track',
    'report-progress-bar',
    'report-definition-list',
    'report-risk-matrix',
    'report-risk-row',
    'report-footnotes'
  ]);

  const classMatches = html.matchAll(/\bclass="([^"]+)"/g);
  for (const match of classMatches) {
    for (const className of match[1].split(/\s+/).filter(Boolean)) {
      if (!className.startsWith('report-')) {
        addError('css_class', `Only report-* classes are allowed. Found "${className}".`);
      } else if (!allowedStructuralClasses.has(className)) {
        addError('css_class', `Unknown report class "${className}". Add it to the contract before using it.`);
      }
    }
  }

  // 7. Section structure validation
  const sections = [...html.matchAll(/<section\b([^>]*)>([\s\S]*?)<\/section>/gi)];
  
  if (sections.length === 0) {
    addError('sections', 'Report must include at least one section.');
  }

  const sectionIds = new Set<string>();
  
  for (const [index, section] of sections.entries()) {
    const attrs = section[1];
    const body = section[2];
    const id = attrs.match(/data-section-id="([^"]+)"/)?.[1];

    // Check report-card class
    if (!attrs.match(/class="[^"]*\breport-card\b[^"]*"/)) {
      addError('section_class', `Section ${index + 1} must use class "report-card".`);
    }

    // Check data-section-id
    if (!id) {
      addError('section_id', `Section ${index + 1} must include data-section-id.`);
    } else if (sectionIds.has(id)) {
      addError('duplicate_id', `Duplicate data-section-id "${id}".`);
    } else {
      sectionIds.add(id);
    }

    // Check exactly one section title
    const headingMatches = [...body.matchAll(/class="[^"]*\breport-section-title\b[^"]*"/g)];
    if (headingMatches.length !== 1) {
      addError('section_title', `Section ${id ?? index + 1} must include exactly one .report-section-title.`);
    }
  }

  // 8. Size check (500KB limit)
  const sizeInBytes = Buffer.byteLength(html, 'utf8');
  const maxSize = 500 * 1024; // 500KB
  if (sizeInBytes > maxSize) {
    addError('size', `Report HTML exceeds maximum size of 500KB (current: ${(sizeInBytes / 1024).toFixed(1)}KB).`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Find approximate line number for a pattern in HTML
 */
function findLineNumber(html: string, field: string): number | undefined {
  // Simple heuristic: count newlines before the first occurrence
  // This is approximate but sufficient for error reporting
  const lines = html.split('\n');
  
  // Look for keywords related to the field
  const keywords: Record<string, string[]> = {
    root_element: ['report-page'],
    forbidden_tags: ['<html', '<head', '<body'],
    script_tag: ['<script'],
    style_tag: ['<style'],
    external_resources: ['<link', '<iframe'],
    inline_style: ['style='],
    inline_handlers: ['onclick', 'onchange'],
    interactive_controls: ['<form', '<input', '<button'],
    checkbox: ['checkbox'],
    reader_ui: ['toc', 'breadcrumb', 'navigation'],
    navigation: ['<nav', '<menu'],
    css_class: ['class='],
    sections: ['<section'],
    section_class: ['report-card'],
    section_id: ['data-section-id'],
    duplicate_id: ['data-section-id'],
    section_title: ['report-section-title'],
    size: [] // Size errors don't have a specific line
  };

  const searchTerms = keywords[field] || [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    for (const term of searchTerms) {
      if (line.includes(term.toLowerCase())) {
        return i + 1; // 1-based line numbers
      }
    }
  }

  return undefined;
}

/**
 * Quick validation check (returns boolean only)
 */
export function isValidReport(html: string): boolean {
  return validateReportHtml(html).valid;
}