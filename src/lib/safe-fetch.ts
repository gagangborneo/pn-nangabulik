type SafeFetchInit = RequestInit & {
  next?: { revalidate?: number | false; tags?: string[] };
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
};

const TRANSIENT_CODES = new Set([
  'ECONNRESET',
  'ETIMEDOUT',
  'EAI_AGAIN',
  'ENOTFOUND',
  'ECONNREFUSED',
  'UND_ERR_SOCKET',
  'UND_ERR_CONNECT_TIMEOUT',
  'UND_ERR_HEADERS_TIMEOUT',
  'UND_ERR_BODY_TIMEOUT',
]);

function isTransientError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as { code?: string; name?: string; cause?: { code?: string; name?: string } };
  if (e.code && TRANSIENT_CODES.has(e.code)) return true;
  if (e.name === 'AbortError') return true;
  const causeCode = e.cause?.code;
  if (causeCode && TRANSIENT_CODES.has(causeCode)) return true;
  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * fetch wrapper that:
 *  - sends a proper User-Agent (some upstreams reject the default Node UA)
 *  - applies a request timeout via AbortController
 *  - retries transient network errors (ECONNRESET, timeouts, DNS hiccups) with backoff
 *  - retries on 502/503/504 responses
 *
 * Safe to use in Next.js Server Components, Route Handlers, and `next: { revalidate }` calls.
 */
export async function safeFetch(
  input: string | URL,
  init: SafeFetchInit = {}
): Promise<Response> {
  const {
    timeoutMs = 15_000,
    retries = 3,
    retryDelayMs = 500,
    headers,
    ...rest
  } = init;

  const mergedHeaders = new Headers(headers);
  if (!mergedHeaders.has('User-Agent')) {
    mergedHeaders.set(
      'User-Agent',
      'pn-nangabulik-landing/1.0 (+https://pn-nangabulik.go.id)'
    );
  }
  if (!mergedHeaders.has('Accept')) {
    mergedHeaders.set('Accept', 'application/json');
  }

  let lastError: unknown = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(input, {
        ...rest,
        headers: mergedHeaders,
        signal: controller.signal,
      });

      if (
        (response.status === 502 || response.status === 503 || response.status === 504) &&
        attempt < retries
      ) {
        lastError = new Error(`Upstream ${response.status}`);
        await sleep(retryDelayMs * Math.pow(2, attempt));
        continue;
      }

      return response;
    } catch (err) {
      lastError = err;
      if (attempt < retries && isTransientError(err)) {
        await sleep(retryDelayMs * Math.pow(2, attempt));
        continue;
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError ?? new Error('safeFetch: exhausted retries');
}
