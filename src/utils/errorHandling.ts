import { ZodError } from 'zod';

// Custom error classes
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public validationErrors: any) {
    super(message, 'VALIDATION_ERROR', 400, validationErrors);
    this.name = 'ValidationError';
  }
}

export class APIError extends AppError {
  constructor(message: string, public apiName: string, public originalError?: any) {
    super(message, 'API_ERROR', 500, { apiName, originalError });
    this.name = 'APIError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string, public url?: string) {
    super(message, 'NETWORK_ERROR', 0, { url });
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

// Error handling utilities
export function handleZodError(error: ZodError): ValidationError {
  const message = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
  return new ValidationError(`Validation failed: ${message}`, error.issues);
}

export function handleAPIError(error: any, apiName: string): APIError {
  let message = `API request failed for ${apiName}`;

  if (error instanceof Error) {
    message += `: ${error.message}`;
  } else if (typeof error === 'string') {
    message += `: ${error}`;
  }

  return new APIError(message, apiName, error);
}

export function handleNetworkError(error: any, url?: string): NetworkError {
  let message = 'Network request failed';

  if (error instanceof Error) {
    message += `: ${error.message}`;
  }

  return new NetworkError(message, url);
}

export function isRetryableError(error: any): boolean {
  // Retry on network errors, 5xx server errors, and timeouts
  if (error instanceof NetworkError) return true;
  if (error instanceof APIError && error.statusCode && error.statusCode >= 500) return true;
  if (error.name === 'TimeoutError') return true;

  return false;
}

// Retry utility with exponential backoff
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error) || attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Global error handler for unhandled errors
export function setupGlobalErrorHandling() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // In production, you might want to send this to an error reporting service
    event.preventDefault(); // Prevent the default browser behavior
  });

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
    // In production, you might want to send this to an error reporting service
  });
}

// Error logging utility
export function logError(error: any, context?: string) {
  const errorInfo = {
    message: error.message || 'Unknown error',
    name: error.name || 'Error',
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  console.error('Error logged:', errorInfo);

  // In production, send to error reporting service
  // Example: Sentry.captureException(error, { extra: errorInfo });
}

// React error boundary helper
export function reportErrorToService(error: Error, errorInfo: any) {
  logError(error, 'React Error Boundary');

  // Send to error reporting service
  // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
}