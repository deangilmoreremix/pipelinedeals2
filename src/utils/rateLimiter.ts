/**
 * Rate Limiter Utility for AI Service Calls
 * Prevents excessive API calls and implements backoff strategies
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  backoffMultiplier: number;
  maxBackoffMs: number;
}

interface RateLimitEntry {
  count: number;
  windowStart: number;
  backoffLevel: number;
  lastRequestTime: number;
}

const defaultConfig: RateLimitConfig = {
  maxRequests: 10,        // 10 requests
  windowMs: 60000,        // per minute
  backoffMultiplier: 2,   // exponential backoff
  maxBackoffMs: 30000     // max 30 second backoff
};

class RateLimiter {
  private storage = new Map<string, RateLimitEntry>();
  private config: RateLimitConfig;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Check if a request is allowed for the given key
   * Returns { allowed, retryAfter, remaining }
   */
  checkLimit(key: string): { 
    allowed: boolean; 
    retryAfter: number; 
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const entry = this.storage.get(key);

    // No entry exists - create new
    if (!entry) {
      this.storage.set(key, {
        count: 1,
        windowStart: now,
        backoffLevel: 0,
        lastRequestTime: now
      });
      return {
        allowed: true,
        retryAfter: 0,
        remaining: this.config.maxRequests - 1,
        resetTime: now + this.config.windowMs
      };
    }

    // Check if window has reset
    if (now - entry.windowStart >= this.config.windowMs) {
      entry.count = 1;
      entry.windowStart = now;
      entry.backoffLevel = 0;
      entry.lastRequestTime = now;
      return {
        allowed: true,
        retryAfter: 0,
        remaining: this.config.maxRequests - 1,
        resetTime: now + this.config.windowMs
      };
    }

    // Check if within limit
    if (entry.count < this.config.maxRequests) {
      entry.count++;
      entry.lastRequestTime = now;
      return {
        allowed: true,
        retryAfter: 0,
        remaining: this.config.maxRequests - entry.count,
        resetTime: entry.windowStart + this.config.windowMs
      };
    }

    // Rate limit exceeded - calculate backoff
    const backoffMs = Math.min(
      Math.pow(this.config.backoffMultiplier, entry.backoffLevel) * 1000,
      this.config.maxBackoffMs
    );
    entry.backoffLevel++;

    const retryAfter = Math.max(0, entry.windowStart + this.config.windowMs - now);

    return {
      allowed: false,
      retryAfter: Math.max(retryAfter, backoffMs),
      remaining: 0,
      resetTime: entry.windowStart + this.config.windowMs
    };
  }

  /**
   * Record a successful request
   */
  recordSuccess(key: string): void {
    const entry = this.storage.get(key);
    if (entry) {
      entry.backoffLevel = Math.max(0, entry.backoffLevel - 1);
    }
  }

  /**
   * Record a failed request (may increase backoff)
   */
  recordFailure(key: string): void {
    const entry = this.storage.get(key);
    if (entry) {
      entry.backoffLevel++;
    }
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.storage.delete(key);
  }

  /**
   * Reset all rate limits
   */
  resetAll(): void {
    this.storage.clear();
  }

  /**
   * Get current status for a key
   */
  getStatus(key: string): {
    count: number;
    remaining: number;
    resetTime: number | null;
    isLimited: boolean;
  } {
    const entry = this.storage.get(key);
    if (!entry) {
      return {
        count: 0,
        remaining: this.config.maxRequests,
        resetTime: null,
        isLimited: false
      };
    }

    const now = Date.now();
    if (now - entry.windowStart >= this.config.windowMs) {
      return {
        count: 0,
        remaining: this.config.maxRequests,
        resetTime: null,
        isLimited: false
      };
    }

    return {
      count: entry.count,
      remaining: Math.max(0, this.config.maxRequests - entry.count),
      resetTime: entry.windowStart + this.config.windowMs,
      isLimited: entry.count >= this.config.maxRequests
    };
  }
}

// Create singleton instances for different use cases
export const aiServiceRateLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 60000,
  backoffMultiplier: 2,
  maxBackoffMs: 30000
});

export const apiRateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60000,
  backoffMultiplier: 1.5,
  maxBackoffMs: 10000
});

export const automationRateLimiter = new RateLimiter({
  maxRequests: 20,
  windowMs: 60000,
  backoffMultiplier: 2,
  maxBackoffMs: 60000
});

export { RateLimiter };
export default RateLimiter;
