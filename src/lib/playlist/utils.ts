/**
 * Trim and collapse a value to a single line.
 */
export function ppxLine(value: string | number | null | undefined): string {
  return String(value ?? '').replace(/[\r\n]/g, ' ').trim();
}

/**
 * Sanitise a value for use inside a quoted M3U attribute.
 */
export function ppxAttr(value: string | number | null | undefined): string {
  return ppxLine(value).replace(/"/g, '');
}

/**
 * Splits an #EXTINF line into [header, channel_name].
 * Handles malformed lines where attrs appear after the comma.
 */
export function ppxExtinfParts(line: string): [string, string] {
  let quote = '';
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (quote !== '') {
      if (char === quote) quote = '';
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if (char === ',') {
      return [line.slice(0, i), line.slice(i + 1)];
    }
  }
  return [line, ''];
}

/**
 * Extract a named attribute from an #EXTINF header string.
 */
export function ppxGetAttribute(header: string, name: string): string {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `(?<=\\s)${escaped}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s,]+))`,
    'i',
  );
  const m = header.match(pattern);
  if (!m) return '';
  const raw = m[1] ?? m[2] ?? m[3] ?? '';
  // Decode common HTML entities
  return raw
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .trim();
}

/**
 * Normalise a channel name for genre-matching lookups.
 */
export function ppxNormalizeName(name: string): string {
  let n = name
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/&#x27;/gi, "'");
  n = n.replace(/[._|\-]+/g, ' ');
  return n.toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Check whether a playlist body is a valid but empty M3U (header only).
 */
export function ppxValidEmptyPlaylist(body: string): boolean {
  const lines = body.replace(/^\xEF\xBB\xBF/, '').trim().split(/\r\n|\n|\r/);
  const first = (lines.shift() ?? '').trim();
  if (!/^#EXTM3U(?:[\t ]|$)/i.test(first)) return false;
  for (const raw of lines) {
    const line = raw.trim();
    if (line === '') continue;
    if (line[0] !== '#' || /^#EXT(?:INF\s*:|-X-)/i.test(line)) return false;
  }
  return true;
}
