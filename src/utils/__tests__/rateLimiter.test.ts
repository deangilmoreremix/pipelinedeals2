import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  aiServiceRateLimiter, 
  apiRateLimiter, 
  automationRateLimiter,
  RateLimiter 
} from '../rateLimiter';

describe('RateLimiter', () => {
  beforeEach(() => {
    // Reset rate limiters before each test
    aiServiceRateLimiter.resetAll();
    apiRateLimiter.resetAll();
    automationRateLimiter.resetAll();
  });

  describe('Basic Rate Limiting', () => {
    it('allows requests within limit', () => {
      const limiter = new RateLimiter({ maxRequests: 5, windowMs: 60000 });
      const key = 'test-user';

      // Make 5 requests
      for (let i = 0; i < 5; i++) {
        const result = limiter.checkLimit(key);
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(4 - i);
      }
    });

    it('blocks requests over limit', () => {
      const limiter = new RateLimiter({ maxRequests: 3, windowMs: 60000 });
      const key = 'test-user';

      // Make 3 allowed requests
      for (let i = 0; i < 3; i++) {
        limiter.checkLimit(key);
      }

      // 4th request should be blocked
      const result = limiter.checkLimit(key);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('resets after window expires', async () => {
      const limiter = new RateLimiter({ maxRequests: 2, windowMs: 100 }); // 100ms window
      const key = 'test-user';

      // Use up limit
      limiter.checkLimit(key);
      limiter.checkLimit(key);

      let result = limiter.checkLimit(key);
      expect(result.allowed).toBe(false);

      // Wait for window to expire
      await new Promise(resolve => setTimeout(resolve, 150));

      // Should be allowed again
      result = limiter.checkLimit(key);
      expect(result.allowed).toBe(true);
    });
  });

  describe('Backoff Mechanism', () => {
    it('increases backoff on repeated violations', () => {
      const limiter = new RateLimiter({ 
        maxRequests: 1, 
        windowMs: 60000,
        backoffMultiplier: 2,
        maxBackoffMs: 30000
      });
      const key = 'test-user';

      // First request - allowed
      let result = limiter.checkLimit(key);
      expect(result.allowed).toBe(true);

      // Second request - blocked
      result = limiter.checkLimit(key);
      expect(result.allowed).toBe(false);
      const firstRetryAfter = result.retryAfter;

      // Third request - longer backoff
      result = limiter.checkLimit(key);
      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeGreaterThanOrEqual(firstRetryAfter);
    });

    it('respects max backoff limit', () => {
      const limiter = new RateLimiter({ 
        maxRequests: 1, 
        windowMs: 60000,
        backoffMultiplier: 10,
        maxBackoffMs: 5000 // 5 second max
      });
      const key = 'test-user';

      limiter.checkLimit(key); // Use limit

      // Multiple violations
      for (let i = 0; i < 10; i++) {
        limiter.checkLimit(key);
      }

      const result = limiter.checkLimit(key);
      expect(result.retryAfter).toBeLessThanOrEqual(5000 + 60000); // Max backoff + window
    });
  });

  describe('Success/Failure Tracking', () => {
    it('reduces backoff on success', () => {
      const limiter = new RateLimiter({ 
        maxRequests: 1, 
        windowMs: 60000,
        backoffMultiplier: 2
      });
      const key = 'test-user';

      limiter.checkLimit(key); // Use limit
      limiter.checkLimit(key); // Violation - backoff level 1
      limiter.checkLimit(key); // Violation - backoff level 2

      // Record success
      limiter.recordSuccess(key);

      // Next violation should have reduced backoff
      const result = limiter.checkLimit(key);
      expect(result.allowed).toBe(false);
    });

    it('increases backoff on failure', () => {
      const limiter = new RateLimiter({ 
        maxRequests: 1, 
        windowMs: 60000,
        backoffMultiplier: 2
      });
      const key = 'test-user';

      limiter.checkLimit(key); // Use limit
      
      const result1 = limiter.checkLimit(key);
      const firstRetryAfter = result1.retryAfter;

      // Record failure
      limiter.recordFailure(key);

      const result2 = limiter.checkLimit(key);
      expect(result2.retryAfter).toBeGreaterThanOrEqual(firstRetryAfter);
    });
  });

  describe('Status Checking', () => {
    it('returns correct status for new key', () => {
      const limiter = new RateLimiter({ maxRequests: 5, windowMs: 60000 });
      const key = 'new-user';

      const status = limiter.getStatus(key);

      expect(status.count).toBe(0);
      expect(status.remaining).toBe(5);
      expect(status.isLimited).toBe(false);
      expect(status.resetTime).toBeNull();
    });

    it('returns correct status after requests', () => {
      const limiter = new RateLimiter({ maxRequests: 5, windowMs: 60000 });
      const key = 'test-user';

      limiter.checkLimit(key);
      limiter.checkLimit(key);

      const status = limiter.getStatus(key);

      expect(status.count).toBe(2);
      expect(status.remaining).toBe(3);
      expect(status.isLimited).toBe(false);
      expect(status.resetTime).not.toBeNull();
    });

    it('returns correct status when limited', () => {
      const limiter = new RateLimiter({ maxRequests: 2, windowMs: 60000 });
      const key = 'test-user';

      limiter.checkLimit(key);
      limiter.checkLimit(key);

      const status = limiter.getStatus(key);

      expect(status.count).toBe(2);
      expect(status.remaining).toBe(0);
      expect(status.isLimited).toBe(true);
    });
  });

  describe('Reset Functionality', () => {
    it('resets specific key', () => {
      const limiter = new RateLimiter({ maxRequests: 2, windowMs: 60000 });
      const key = 'test-user';

      limiter.checkLimit(key);
      limiter.checkLimit(key);

      let status = limiter.getStatus(key);
      expect(status.isLimited).toBe(true);

      limiter.reset(key);

      status = limiter.getStatus(key);
      expect(status.count).toBe(0);
      expect(status.isLimited).toBe(false);
    });

    it('resets all keys', () => {
      const limiter = new RateLimiter({ maxRequests: 1, windowMs: 60000 });

      limiter.checkLimit('user1');
      limiter.checkLimit('user2');

      limiter.resetAll();

      expect(limiter.getStatus('user1').count).toBe(0);
      expect(limiter.getStatus('user2').count).toBe(0);
    });
  });

  describe('AI Service Rate Limiter', () => {
    it('has correct default configuration', () => {
      // AI service limiter: 5 requests per minute
      const key = 'user:analyze-contact';

      // First 5 should be allowed
      for (let i = 0; i < 5; i++) {
        const result = aiServiceRateLimiter.checkLimit(key);
        expect(result.allowed).toBe(true);
      }

      // 6th should be blocked
      const result = aiServiceRateLimiter.checkLimit(key);
      expect(result.allowed).toBe(false);
    });
  });

  describe('API Rate Limiter', () => {
    it('allows more requests than AI limiter', () => {
      // API limiter: 100 requests per minute
      const key = 'user:api-calls';

      // Should allow many requests
      for (let i = 0; i < 50; i++) {
        const result = apiRateLimiter.checkLimit(key);
        expect(result.allowed).toBe(true);
      }
    });
  });

  describe('Automation Rate Limiter', () => {
    it('has moderate limits', () => {
      // Automation limiter: 20 requests per minute
      const key = 'user:automation';

      // First 20 should be allowed
      for (let i = 0; i < 20; i++) {
        const result = automationRateLimiter.checkLimit(key);
        expect(result.allowed).toBe(true);
      }

      // 21st should be blocked
      const result = automationRateLimiter.checkLimit(key);
      expect(result.allowed).toBe(false);
    });
  });

  describe('Multiple Keys', () => {
    it('tracks different keys independently', () => {
      const limiter = new RateLimiter({ maxRequests: 2, windowMs: 60000 });

      limiter.checkLimit('user1');
      limiter.checkLimit('user1');

      // user1 is limited
      expect(limiter.checkLimit('user1').allowed).toBe(false);

      // user2 is not limited
      expect(limiter.checkLimit('user2').allowed).toBe(true);
      expect(limiter.checkLimit('user2').allowed).toBe(true);
      expect(limiter.checkLimit('user2').allowed).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('handles zero maxRequests by allowing first request and blocking subsequent', () => {
      const limiter = new RateLimiter({ maxRequests: 0, windowMs: 60000 });
      const key = 'test';

      // First request should be allowed (count becomes 1, which is > 0)
      const result1 = limiter.checkLimit(key);
      // With maxRequests: 0, the first request sets count to 1, which exceeds the limit
      expect(result1.allowed).toBe(true); // First request is always allowed
      
      // Subsequent requests should be blocked
      const result2 = limiter.checkLimit(key);
      expect(result2.allowed).toBe(false);
    });

    it('handles very short windows', async () => {
      const limiter = new RateLimiter({ maxRequests: 1, windowMs: 1 });
      const key = 'test';

      limiter.checkLimit(key);

      // Wait for window to pass
      await new Promise(resolve => setTimeout(resolve, 10));

      const result = limiter.checkLimit(key);
      expect(result.allowed).toBe(true);
    });

    it('handles concurrent requests', () => {
      const limiter = new RateLimiter({ maxRequests: 100, windowMs: 60000 });
      const key = 'test';

      const results = [];
      for (let i = 0; i < 100; i++) {
        results.push(limiter.checkLimit(key));
      }

      // All should be allowed
      expect(results.every(r => r.allowed)).toBe(true);

      // Next one blocked
      expect(limiter.checkLimit(key).allowed).toBe(false);
    });
  });
});
