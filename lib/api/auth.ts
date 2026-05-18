/**
 * API Key Authentication Middleware
 */

import { NextRequest, NextResponse } from 'next/server';

// Cache for API keys loaded from environment
let apiKeyCache: Map<string, string> | null = null;

/**
 * Load API keys from environment variables
 * Format: API_KEY_{PROJECT_NAME}={key_value}
 */
function loadApiKeys(): Map<string, string> {
  if (apiKeyCache) {
    return apiKeyCache;
  }

  const keys = new Map<string, string>();
  
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith('API_KEY_') && value) {
      // Store mapping: api_key_value -> project_name
      const projectName = key.replace('API_KEY_', '');
      keys.set(value, projectName);
    }
  }

  apiKeyCache = keys;
  return keys;
}

/**
 * Validate API key from request header
 * Returns project name if valid, null if invalid
 */
export function validateApiKey(request: NextRequest): string | null {
  const apiKey = request.headers.get('x-api-key');
  
  if (!apiKey) {
    return null;
  }

  const keys = loadApiKeys();
  return keys.get(apiKey) || null;
}

/**
 * Middleware wrapper for API routes
 * Returns 401 if authentication fails
 */
export function withAuth(
  handler: (request: NextRequest, projectName: string) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const projectName = validateApiKey(request);

    if (!projectName) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          code: 'INVALID_API_KEY',
          message: 'Invalid or missing API key. Provide a valid x-api-key header.',
        },
        { status: 401 }
      );
    }

    return handler(request, projectName);
  };
}

/**
 * Get project name from API key (for logging/tracking)
 */
export function getProjectName(apiKey: string): string | null {
  const keys = loadApiKeys();
  return keys.get(apiKey) || null;
}