import type {
  FetchResult,
  BuildResult,
  SourceStats,
  PackData,
  SonyLogoResult,
} from './types';
import {
  PPX_BUILD,
  PPX_FANCODE_LOGO,
  PPX_SONY_LIV_EVENTS_LOGO,
  PPX_VZY_LOGO,
} from './constants';
import { ppxLine, ppxAttr, ppxExtinfParts, ppxGetAttribute, ppxNormalizeName, ppxValidEmptyPlaylist } from './utils';
import { ppxSources } from './sources';
import { ppxStaticData, ppxDangalPack } from './static-data';
import { ppxParsePlaylist } from './parser';

// ── Static entry writer ─────────────────────────────────────────────────────

export function ppxStaticEntries(pack: PackData, ua: string): string {
  const entries: string[] = [];
  for (let index = 0; index < pack.channels.length; index++) {
    const channel = pack.channels[index];
    const name = ppxLine(channel.name ?? '');
    const url = ppxLine(channel.url ?? '');
    if (name === '' || url === '') continue;

    const tvgId = channel.tvgId ?? `${pack.id}-${index + 1}`;
    const tvgLogo = channel.logo ?? '';
    const groupTitle = pack.group;
    const tvgLanguage = channel.language ?? '';
    const tvgCategory = channel.category ?? '';
    const groupLogo = pack.logo ?? '';

    let newHead = '#EXTINF:-1';
    if (tvgId !== '') newHead += ` tvg-id="${ppxAttr(tvgId)}"`;
    newHead += ` tvg-name="${ppxAttr(name)}"`;
    if (tvgLogo !== '') newHead += ` tvg-logo="${ppxAttr(tvgLogo)}"`;
    if (tvgCategory !== '') newHead += ` tvg-category="${ppxAttr(tvgCategory)}"`;
    if (tvgLanguage !== '') newHead += ` tvg-language="${ppxAttr(tvgLanguage)}"`;
    newHead += ` group-title="${ppxAttr(groupTitle)}"`;
    if (groupLogo !== '') newHead += ` group-logo="${ppxAttr(groupLogo)}"`;
    if (url.includes('.mpd')) newHead += ' type="dash"';

    let entry = `${newHead},${name}\r\n`;

    if (channel.keyId && channel.key) {
      entry += `#KODIPROP:inputstream.adaptive.license_type=org.w3.clearkey\r\n`;
      entry += `#KODIPROP:inputstream.adaptive.license_key=${ppxLine(channel.keyId)}:${ppxLine(channel.key)}\r\n`;
    }
    if (ua !== '') {
      entry += `#EXTVLCOPT:http-user-agent=${ppxLine(ua)}\r\n`;
    }
    entry += `${url}\r\n`;
    entries.push(entry);
  }
  return entries.join('');
}

// ── Sony logo matching ──────────────────────────────────────────────────────

function ppxSonyIdentity(name: string): { family: string; quality: string; language: string } {
  let n = ppxNormalizeName(name);
  const quality = /\b(?:hd|4k)\b/.test(n) ? 'hd' : 'sd';
  let language = '';
  const langMatch = n.match(/\b(hindi|english|tamil|telugu|kannada|malayalam|bengali)\b/);
  if (langMatch) language = langMatch[1];
  n = n.replace(/\b(?:hd|sd|4k|hindi|english|tamil|telugu|kannada|malayalam|bengali)\b/g, '');
  n = n.replace(/\s+/g, '');
  n = n.replace(/^sonysportsten/, 'sonyten');
  if (n === 'set') n = 'sonyset';
  return { family: n, quality, language };
}

function ppxApplySonyLogos(
  pack: PackData,
  jioBody: string,
): SonyLogoResult {
  const index: Record<string, { quality: string; language: string; logo: string }[]> = {};
  for (const rawLine of jioBody.split(/\r\n|\n|\r/)) {
    const line = rawLine.trim();
    if (!/^#EXTINF\s*:/i.test(line)) continue;
    const [header, name] = ppxExtinfParts(line);
    if (!/^(?:sony\b|set\b)/i.test(name.trim())) continue;
    const logo = ppxGetAttribute(header, 'tvg-logo');
    if (!/^https?:\/\/[^\s<>"\\x00-\\x1f]+$/i.test(logo)) continue;
    const identity = ppxSonyIdentity(name);
    if (!index[identity.family]) index[identity.family] = [];
    index[identity.family].push({ quality: identity.quality, language: identity.language, logo });
  }

  let matched = 0;
  const fallbacks: string[] = [];
  const unmatched: string[] = [];
  const newChannels = pack.channels.map((channel) => {
    const wanted = ppxSonyIdentity(channel.name);
    const language = wanted.language !== '' ? wanted.language : (channel.language ?? '').toLowerCase();
    let best: { quality: string; language: string; logo: string } | null = null;
    let bestScore = -1;
    for (const candidate of index[wanted.family] ?? []) {
      const score =
        (candidate.quality === wanted.quality ? 100 : 0) +
        (candidate.language === language ? 10 : candidate.language === '' ? 5 : 0);
      if (score > bestScore) {
        best = candidate;
        bestScore = score;
      }
    }
    if (best === null) {
      unmatched.push(channel.name);
      return channel;
    }
    matched++;
    if (best.quality !== wanted.quality) fallbacks.push(channel.name);
    return { ...channel, logo: best.logo };
  });

  return {
    pack: { ...pack, channels: newChannels },
    matched,
    quality_fallbacks: fallbacks,
    unmatched,
  };
}

// ── Passthrough: strip #EXTM3U header + comments, clean .m3u8 entries ───────
//
//  .m3u8 (HLS) streams do NOT need ClearKey DRM, so we strip the
//  KODIPROP license lines for those entries to avoid player confusion.

function ppxPassthroughBody(rawBody: string): { body: string; count: number } {
  const stripped = rawBody.replace(/^\xEF\xBB\xBF/, '');
  const lines = stripped.split(/\r\n|\n|\r/);
  const kept: string[] = [];
  let count = 0;

  // Two-pass: first collect entries, then clean .m3u8 ones
  // An "entry" = #EXTINF line + directives + URL line
  const entries: { extinfIdx: number; urlIdx: number; url: string; lineIndices: number[] }[] = [];
  let currentEntry: { extinfIdx: number; lineIndices: number[] } | null = null;
  const cleanLines: (string | null)[] = lines.map(l => l); // copy

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    // Skip #EXTM3U header (builder adds its own)
    if (/^#EXTM3U/i.test(trimmed)) { cleanLines[i] = null; continue; }
    // Skip standalone comment lines
    if (/^#\s+/.test(trimmed) && !/^#EXT/i.test(trimmed) && !/^#KODIPROP/i.test(trimmed)) { cleanLines[i] = null; continue; }
    if (trimmed === '') { cleanLines[i] = null; continue; }

    if (/^#EXTINF\s*:/i.test(trimmed)) {
      currentEntry = { extinfIdx: i, lineIndices: [i] };
      count++;
    } else if (currentEntry && /^https?:\/\//i.test(trimmed)) {
      currentEntry.lineIndices.push(i);
      entries.push({ ...currentEntry, urlIdx: i, url: trimmed });
      currentEntry = null;
    } else if (currentEntry && trimmed[0] === '#') {
      currentEntry.lineIndices.push(i);
    }
  }

  // Strip ClearKey KODIPROP lines from .m3u8 entries (HLS doesn't use ClearKey)
  for (const entry of entries) {
    if (/\.m3u8($|\?)/i.test(entry.url)) {
      for (const idx of entry.lineIndices) {
        const t = (cleanLines[idx] || '').trim().toLowerCase();
        if (t.startsWith('#kodiprop:inputstream.adaptive.license_type') ||
            t.startsWith('#kodiprop:inputstream.adaptive.license_key') ||
            t.startsWith('#kodiprop:inputstream.adaptive.manifest_type')) {
          cleanLines[idx] = null; // remove
        }
      }
    }
  }

  for (let i = 0; i < cleanLines.length; i++) {
    if (cleanLines[i] !== null) kept.push(cleanLines[i] as string);
  }

  return { body: kept.join('\r\n') + '\r\n', count };
}

// ── Build pipeline ──────────────────────────────────────────────────────────

export function ppxBuild(
  fetched: Record<string, FetchResult>,
): BuildResult {
  const data = ppxStaticData();
  const sources = ppxSources();
  const remote: Record<string, string> = {};
  const stats: Record<string, SourceStats> = {};
  let failed = false;

  for (const [id, source] of Object.entries(sources)) {
    const result: FetchResult = fetched[id] ?? {
      ok: false,
      http: 0,
      code: 'MISSING_RESULT',
      error: 'No source response was supplied.',
      seconds: 0,
      bytes: 0,
      body: '',
    };

    let parsed = { body: '', count: 0, invalid: 0, categories: {} as Record<string, number> };

    if (result.ok) {
      // ── PASSTHROUGH MODE: use raw M3U body as-is (no parsing/modification) ──
      if (source.passthrough) {
        const pt = ppxPassthroughBody(result.body);
        parsed = { body: pt.body, count: pt.count, invalid: 0, categories: {} };

        if (
          pt.count === 0 &&
          !(source.allow_empty && ppxValidEmptyPlaylist(result.body))
        ) {
          result.ok = false;
          result.code = 'NO_PLAYABLE_ENTRIES';
          result.error = 'Upstream contained no complete channel entries with HTTP(S) stream URLs.';
        }
      } else {
        // ── NORMAL MODE: parse and rebuild M3U entries ──
        const logo =
          id === 'fancode'
            ? PPX_FANCODE_LOGO
            : id === 'sonylivevents'
              ? PPX_SONY_LIV_EVENTS_LOGO
              : id === 'vzy'
                ? PPX_VZY_LOGO
                : data.remoteLogos[id] ?? '';

        const defaults: Record<string, string> = {};
        if (id === 'fancode') {
          defaults.logo = PPX_FANCODE_LOGO;
          defaults.category = 'Sports';
        }
        if (id === 'hotstar') {
          defaults.user_agent = data.userAgent;
          defaults.referer = 'https://www.hotstar.com/';
        }

        parsed = ppxParsePlaylist(result.body, source.group, logo, false, defaults);

        if (
          parsed.count === 0 &&
          !(source.allow_empty && ppxValidEmptyPlaylist(result.body))
        ) {
          result.ok = false;
          result.code = 'NO_PLAYABLE_ENTRIES';
          result.error = 'Upstream contained no complete channel entries with HTTP(S) stream URLs.';
        }
      }
    }

    const { body: _b, ...resultWithoutBody } = result;
    const stat: SourceStats = {
      ...resultWithoutBody,
      channels: parsed.count,
      invalid: parsed.invalid,
    };
    if (id === 'jio') stat.categories = parsed.categories;
    if (source.optional) {
      stat.optional = true;
      stat.state = !result.ok
        ? 'UNAVAILABLE'
        : parsed.count > 0
          ? 'READY'
          : 'NO_EVENTS';
    }
    stats[id] = stat;
    // A reserved .invalid hostname is intentionally non-playing, but keeps
    // the group visible in IPTV clients that require an HTTP(S) entry URL.
    remote[id] = source.allow_empty && parsed.count === 0
      ? `#EXTINF:-1 tvg-id="${ppxAttr(id)}-no-events" tvg-name="No live events" group-title="${ppxAttr(source.group)}",No live events\r\nhttps://no-live-events.invalid/${encodeURIComponent(id)}\r\n`
      : parsed.body;
    if (!result.ok && !source.optional) failed = true;
  }

  if (failed) {
    return { ok: false, stats, body: '' };
  }

  const packs = { ...data.packs };
  const sonyLogos = ppxApplySonyLogos(packs.sony, fetched.jio?.body ?? '');
  packs.sony = sonyLogos.pack;
  stats.jio = { ...stats.jio, sony_logos: { ...sonyLogos, pack: undefined as any } };

  const ua = data.userAgent;
  const now = new Date().toISOString();

  const chunks: string[] = [
    `#EXTM3U url-tvg="https://avkb.short.gy/jioepg.xml.gz" tvg-url="https://avkb.short.gy/jioepg.xml.gz" refresh="3600"\r\n`,
    `# Generated ${now} | ${PPX_BUILD}\r\n`,
    remote.jio ?? '',
    ppxStaticEntries(packs.zee, ua),
    remote.zeeww ?? '',
    ppxStaticEntries(packs.sony, ua),
    ppxStaticEntries(packs.sun, ua),
    ppxStaticEntries(packs.kids, ua),
    ppxStaticEntries(packs.wowkidz, ua),
    remote.hotstar ?? '',
    remote.vzy ?? '',
    remote.fancode ?? '',
    remote.sonylivevents ?? '',
    remote.willow ?? '',
    remote.primevideo ?? '',
    ppxStaticEntries(ppxDangalPack(), ua),
  ];

  return { ok: true, stats, body: chunks.join('') };
}
