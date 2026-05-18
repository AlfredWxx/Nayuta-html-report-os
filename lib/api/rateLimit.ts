/**
 * Rate Limiting Middleware
 */

import { NextRequest, NextResponse } from 'next/server';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Rate limiter: 100 requests per minute per API key
const rateLimiter = new RateLimiterMemory({
  keyPrefix: 'api_publish',
  points: parseInt(process.env.RATE_LIMIT_PER_MINUTE || '100', 10),
  duration: 60, // 60 seconds
});

/**
 * Check rate limit for API key
 * Returns true if allowed, false if rate limited
 */
export async function checkRateLimit(apiKey: string): Promise<boolean> {
  try {
    await rateLimiter.consume(apiKey);
    return true;
  } catch (rejRes) {
    return false;
  }
}

/**
 * Get retry-after timestamp for rate limited requests
 */
export function getRetryAfter(): number {
  return 60; // Retry after 60 seconds
}

/**
 * Middleware wrapper for rate limiting
 * Returns 429 if rate limit exceeded
 */
export function withRateLimit(
  handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: any[]): Promise<NextResponse> => {
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey) {
      // Let auth middleware handle missing key
      return handler(request, ...args);
    }

    const allowed = await checkRateLimit(apiKey);
    
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate Limit Exceeded',
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Rate limit exceeded. Try again in ${getRetryAfter()} seconds.`,
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(getRetryAfter()),
          },
        }
      );
    }

    return handler(request, ...args);
  };
}

/**
 * Get current rate limit status for an API key
 */
export async function getRateLimitStatus(apiKey: string): Promise<{
  remaining: number;
  resetTime: number;
}> {
  const resRateLimiter = await rateLimiter.get(apiKey);
  
  if (resRateLimiter === null) {
    // No record means full quota available
    return {
      remaining: parseInt(process.env.RATE_LIMIT_PER_MINUTE || '100', 10),
      resetTime: Date.now() + 60000,
    };
  }

  return {
    remaining: resRateLimiter.remainingPoints,
    resetTime: Date.now() + (resRateLimiter.msBeforeNext || 0),
  };
}