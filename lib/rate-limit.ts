import { NextRequest } from "next/server";

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (works well for serverless/edge)
const store = new Map<string, RateLimitStore>();

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (now > value.resetTime) {
      store.delete(key);
    }
  }
}, 10 * 60 * 1000);

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed
   */
  limit: number;
  /**
   * Time window in seconds
   */
  window: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Get client identifier from request
 */
function getIdentifier(request: NextRequest): string {
  // Try to get IP from various headers (for proxies/CDNs)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  
  const ip = forwarded?.split(",")[0] || realIp || cfConnectingIp || "unknown";
  
  return ip;
}

/**
 * Rate limit a request
 * @param request - The Next.js request object
 * @param config - Rate limit configuration
 * @returns Rate limit result with success status and headers
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const identifier = getIdentifier(request);
  const key = `${identifier}:${request.nextUrl.pathname}`;
  const now = Date.now();
  const windowMs = config.window * 1000;

  // Get or create rate limit entry
  let entry = store.get(key);
  
  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired one
    entry = {
      count: 0,
      resetTime: now + windowMs,
    };
    store.set(key, entry);
  }

  // Increment count
  entry.count++;

  const remaining = Math.max(0, config.limit - entry.count);
  const success = entry.count <= config.limit;

  return {
    success,
    limit: config.limit,
    remaining,
    reset: Math.ceil(entry.resetTime / 1000),
  };
}

/**
 * Common rate limit configurations
 */
export const RATE_LIMITS = {
  // Form submissions: 5 requests per 10 minutes
  FORM_SUBMISSION: { limit: 5, window: 600 },
  // Public read APIs: 100 requests per minute
  PUBLIC_READ: { limit: 100, window: 60 },
  // Admin APIs: 1000 requests per hour
  ADMIN: { limit: 1000, window: 3600 },
  // Auth endpoints: 10 requests per 15 minutes
  AUTH: { limit: 10, window: 900 },
} as const;

