import type { SourceConfig, FetchResult } from './types';
import { PPX_MAX_SOURCE_BYTES } from './constants';
import { ppxValidEmptyPlaylist } from './utils';

// ═══════════════════════════════════════════════════════════════
//  Single URL fetch with timeout
// ═══════════════════════════════════════════════════════════════
async function fetchOneUrl(
  url: string,
  timeoutMs: number,
): Promise<{ ok: boolean; status: number; body: string; bytes: number; ms: number; error?: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const start = performance.now();

  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'audio/x-mpegurl, application/vnd.apple.mpegurl, text/plain, */*',
        'Cache-Control': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/126.0.0.0 Mobile Safari/537.36',
      },
    });

    const ms = performance.now() - start;

    if (!resp.ok) {
      return { ok: false, status: resp.status, body: '', bytes: 0, ms, error: `HTTP ${resp.status}` };
    }

    const body = await resp.text();
    const bytes = new TextEncoder().encode(body).length;

    if (bytes > PPX_MAX_SOURCE_BYTES) {
      return { ok: false, status: resp.status, body: '', bytes, ms, error: 'Response too large' };
    }

    return { ok: true, status: resp.status, body, bytes, ms };
  } catch (err: any) {
    const ms = performance.now() - start;
    const isTimeout = err.name === 'AbortError' || err.name === 'TimeoutError';
    return {
      ok: false,
      status: 0,
      body: '',
      bytes: 0,
      ms,
      error: isTimeout ? 'Timeout' : `Fetch: ${err.message}`,
    };
  } finally {
    clearTimeout(timer);
  }
}

// ═══════════════════════════════════════════════════════════════
//  Fetch a single source with retries + mirror fallbacks
//  Strategy: try primary URL → retries → mirror URLs → retries
// ═══════════════════════════════════════════════════════════════
async function fetchSourceWithRetries(
  id: string,
  source: SourceConfig,
): Promise<FetchResult> {
  const maxRetries = source.retries ?? 2;
  const retryDelay = source.retryDelay ?? 2000;
  const timeoutMs = source.timeout * 1000;

  // Build URL list: primary first, then mirrors
  const urls = [source.url, ...(source.mirrors ?? [])];
  const allErrors: string[] = [];
  let totalMs = 0;
  let lastHttp = 0;

  for (const url of urls) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      // Delay between retries (not on first attempt)
      if (attempt > 0) {
        const delay = retryDelay * Math.pow(1.5, attempt - 1); // escalating: 2s, 3s, 4.5s
        await new Promise(r => setTimeout(r, delay));
      }

      const tag = `[${id}] ${url} attempt ${attempt + 1}/${maxRetries + 1}`;
      const result = await fetchOneUrl(url, timeoutMs);
      totalMs += result.ms;
      lastHttp = result.status || lastHttp;

      if (result.ok) {
        // Validate M3U content
        const stripped = result.body.replace(/^\xEF\xBB\xBF/, '');
        const hasEntries = /^[\t ]*#EXTINF\s*:/im.test(stripped);
        const isValidEmpty = source.allow_empty && ppxValidEmptyPlaylist(result.body);

        if (!hasEntries && !isValidEmpty) {
          allErrors.push(`${tag}: No M3U entries (${result.bytes}B)`);
          continue; // retry — might be a transient empty response
        }

        // SUCCESS
        return {
          ok: true,
          http: result.status,
          code: null,
          error: null,
          seconds: +(totalMs / 1000).toFixed(3),
          bytes: result.bytes,
          body: result.body,
        };
      }

      allErrors.push(`${tag}: ${result.error}`);

      // If it's a permanent error (4xx), skip remaining retries for this URL
      if (result.status >= 400 && result.status < 500 && result.status !== 429) {
        break;
      }
    }
  }

  // All attempts exhausted
  const lastError = allErrors[allErrors.length - 1] || 'Unknown error';
  const code = lastError.includes('Timeout')
    ? 'TIMEOUT'
    : lastError.includes('HTTP')
      ? `HTTP_${lastHttp}`
      : lastError.includes('No M3U')
        ? 'NOT_M3U'
        : 'FETCH_ERROR';

  return {
    ok: false,
    http: lastHttp,
    code,
    error: `All ${allErrors.length} attempts failed. Last: ${lastError}`,
    seconds: +(totalMs / 1000).toFixed(3),
    bytes: 0,
    body: '',
  };
}

// ═══════════════════════════════════════════════════════════════
//  Race strategy for critical sources (jio)
//  Fire primary + all mirrors simultaneously, first valid wins
// ═══════════════════════════════════════════════════════════════
async function fetchSourceRace(
  id: string,
  source: SourceConfig,
): Promise<FetchResult> {
  const timeoutMs = source.timeout * 1000;
  const urls = [source.url, ...(source.mirrors ?? [])];

  if (urls.length <= 1) {
    return fetchSourceWithRetries(id, source);
  }

  const start = performance.now();

  // Race all URLs simultaneously
  const raceResult = await new Promise<FetchResult>((resolve) => {
    let settled = false;
    let completed = 0;
    const errors: string[] = [];

    for (const url of urls) {
      fetchOneUrl(url, timeoutMs).then((result) => {
        completed++;

        if (settled) return;

        if (result.ok) {
          const stripped = result.body.replace(/^\xEF\xBB\xBF/, '');
          const hasEntries = /^[\t ]*#EXTINF\s*:/im.test(stripped);
          const isValidEmpty = source.allow_empty && ppxValidEmptyPlaylist(result.body);

          if (hasEntries || isValidEmpty) {
            settled = true;
            resolve({
              ok: true,
              http: result.status,
              code: null,
              error: null,
              seconds: +((performance.now() - start) / 1000).toFixed(3),
              bytes: result.bytes,
              body: result.body,
            });
            return;
          }
        }

        errors.push(`${url}: ${result.error || 'No M3U entries'}`);

        // If all failed, resolve with failure
        if (completed >= urls.length) {
          settled = true;
          resolve({
            ok: false,
            http: result.status,
            code: 'ALL_MIRRORS_FAILED',
            error: errors.join(' | '),
            seconds: +((performance.now() - start) / 1000).toFixed(3),
            bytes: 0,
            body: '',
          });
        }
      });
    }
  });

  // If race failed, fall back to sequential retries
  if (!raceResult.ok) {
    return fetchSourceWithRetries(id, source);
  }

  return raceResult;
}

// ═══════════════════════════════════════════════════════════════
//  Fetch ALL sources — parallel with smart strategies
// ═══════════════════════════════════════════════════════════════
export async function ppxFetchSources(
  sources: Record<string, SourceConfig>,
): Promise<Record<string, FetchResult>> {
  const entries = Object.entries(sources);

  // Classify sources: critical (jio, zeeww) use race, others use retry
  const settled = await Promise.allSettled(
    entries.map(async ([id, source]) => {
      // Critical sources with mirrors → race all URLs simultaneously
      const usesRace = (source.mirrors?.length ?? 0) > 0 && !source.optional;
      const result = usesRace
        ? await fetchSourceRace(id, source)
        : await fetchSourceWithRetries(id, source);

      return { id, result };
    }),
  );

  const results: Record<string, FetchResult> = {};
  for (const outcome of settled) {
    if (outcome.status === 'fulfilled') {
      results[outcome.value.id] = outcome.value.result;
    }
  }

  // Fill in any missing (shouldn't happen but safety net)
  for (const id of Object.keys(sources)) {
    if (!results[id]) {
      results[id] = {
        ok: false,
        http: 0,
        code: 'MISSING_RESULT',
        error: 'No source response was supplied.',
        seconds: 0,
        bytes: 0,
        body: '',
      };
    }
  }

  return results;
}
