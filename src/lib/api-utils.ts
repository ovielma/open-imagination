/**
 * Utility functions for API calls with timeout and retry logic
 */

interface RetryOptions {
  maxAttempts?: number;
  timeoutMs?: number;
  backoffMs?: number;
}

/**
 * Fetch with timeout and exponential backoff retry
 */
export async function fetchWithRetry(
  url: string, 
  options: RequestInit = {}, 
  retryOptions: RetryOptions = {}
): Promise<Response> {
  const {
    maxAttempts = 3,
    timeoutMs = 15000, // 15 seconds
    backoffMs = 1000   // 1 second base delay
  } = retryOptions;

  let lastError: Error = new Error('Unknown error');

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // If response is successful or client error (4xx), don't retry
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response;
      }

      // Server error (5xx) or other issues - retry
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);

    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // Don't retry on timeout or abort
      if (lastError.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }

      // Don't retry on last attempt
      if (attempt === maxAttempts) {
        break;
      }

      // Exponential backoff delay
      const delay = backoffMs * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Safe logging that doesn't expose sensitive data in production
 */
export function safeLog(message: string, data?: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log(message, data);
  }
}

export function safeError(message: string, error?: any) {
  if (process.env.NODE_ENV === 'development') {
    console.error(message, error);
  } else {
    // In production, only log the message without sensitive data
    console.error(message);
  }
}

/**
 * Mask API keys in logs
 */
export function maskApiKey(key: string): string {
  if (!key || key.length < 8) return '[HIDDEN]';
  return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
}
