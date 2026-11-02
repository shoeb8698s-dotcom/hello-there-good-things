import type { ParsedPlaylist, ParseDefaults } from './types';
import {
  ppxLine,
  ppxAttr,
  ppxExtinfParts,
  ppxGetAttribute,
  ppxValidEmptyPlaylist,
} from './utils';
import { ppxJioCategory } from './genres';
import { PPX_JIO_CATEGORY_PREFIX } from './constants';

/**
 * Parse an M3U playlist body and normalise every entry.
 * Port of PHP ppx_parse_playlist().
 */
export function ppxParsePlaylist(
  text: string,
  group: string,
  logo: string,
  jioCategories = false,
  defaults: ParseDefaults = {},
): ParsedPlaylist {
  const lines = text.replace(/^\xEF\xBB\xBF/, '').split(/\r\n|\n|\r/);
  const chunks: string[] = [];
  let current: [string, string, string[]] | null = null;
  let count = 0;
  let invalid = 0;
  const categories: Record<string, number> = {};

  for (const raw of lines) {
    const line = raw.trim();
    if (line === '') continue;

    if (/^#EXTINF\s*:/i.test(line)) {
      if (current !== null) invalid++;
      let [head, name] = ppxExtinfParts(line);

      // Recover malformed headers
      const trimmedHead = head.trim();
      if (
        [
          '#EXTINF:-1',
          '#EXTINF:0',
          '#EXTINF:-1 tvg-logo=""',
          '#EXTINF:-1 tvg-name=""',
        ].includes(trimmedHead)
      ) {
        const attrRe =
          /(?:^|\s)(tvg-id|tvg-name|tvg-logo|tvg-category|tvg-language|group-title|logo)\s*=\s*("[^"]*"|'[^']*'|[^\s,]+)/gi;
        const attrs = [...name.matchAll(attrRe)];
        if (attrs.length > 0) {
          head = '#EXTINF:-1';
          let remainingName = name;
          for (const attr of attrs) {
            head += ` ${attr[1]}=${attr[2]}`;
            remainingName = remainingName.replace(attr[0], '');
          }
          name = remainingName.replace(/^[\s,]+/, '').trim();
        }
      }

      current = [head.trim(), name, []];
    } else if (current !== null && line[0] === '#') {
      current[2].push(line);
    } else if (current !== null && /^https?:\/\//i.test(line)) {
      const [head, name, directives] = current;
      let entryGroup = group;
      let category = '';

      if (jioCategories) {
        category = ppxJioCategory(head, directives, name);
        entryGroup = PPX_JIO_CATEGORY_PREFIX + category;
        categories[category] = (categories[category] ?? 0) + 1;
      } else if (defaults.category) {
        category = defaults.category;
      } else {
        category = ppxGetAttribute(head, 'tvg-category');
        if (category === '') {
          category = ppxJioCategory(head, directives, name);
        }
      }

      let tvgLogo = ppxGetAttribute(head, 'tvg-logo').trim();
      if (tvgLogo === '') tvgLogo = ppxGetAttribute(head, 'logo').trim();
      if (tvgLogo === '' && defaults.logo) tvgLogo = defaults.logo;

      const tvgId = ppxGetAttribute(head, 'tvg-id');
      let tvgName = ppxGetAttribute(head, 'tvg-name');
      if (tvgName === '') tvgName = name;
      const tvgLang = ppxGetAttribute(head, 'tvg-language');

      let newHead = '#EXTINF:-1';
      if (tvgId !== '') newHead += ` tvg-id="${ppxAttr(tvgId)}"`;
      newHead += ` tvg-name="${ppxAttr(tvgName)}"`;
      if (tvgLogo !== '') newHead += ` tvg-logo="${ppxAttr(tvgLogo)}"`;
      if (category !== '') newHead += ` tvg-category="${ppxAttr(category)}"`;
      if (tvgLang !== '') newHead += ` tvg-language="${ppxAttr(tvgLang)}"`;
      newHead += ` group-title="${ppxAttr(entryGroup)}"`;
      if (logo !== '') newHead += ` group-logo="${ppxAttr(logo)}"`;

      // DASH type flag
      if (/\.mpd($|\?)/i.test(line)) {
        newHead += ' type="dash"';
      }

      // Default user-agent/referer directives
      const extraDirectives: string[] = [];
      if (defaults.user_agent) {
        const uaFound = directives.some((d) =>
          d.toLowerCase().startsWith('#extvlcopt:http-user-agent'),
        );
        if (!uaFound) {
          extraDirectives.push(
            `#EXTVLCOPT:http-user-agent=${ppxLine(defaults.user_agent)}`,
          );
        }
      }
      if (defaults.referer) {
        const refFound = directives.some((d) =>
          d.toLowerCase().startsWith('#extvlcopt:http-referrer'),
        );
        if (!refFound) {
          extraDirectives.push(
            `#EXTVLCOPT:http-referrer=${ppxLine(defaults.referer)}`,
          );
        }
      }

      let chunk = `${newHead},${name}\r\n`;
      for (const ed of extraDirectives) chunk += `${ed}\r\n`;
      for (const directive of directives) {
        if (!/^#EXTGRP:/i.test(directive)) chunk += `${directive}\r\n`;
      }
      chunk += `${line}\r\n`;

      chunks.push(chunk);
      current = null;
      count++;
    }
  }
  if (current !== null) invalid++;

  const sortedCategories: Record<string, number> = {};
  for (const key of Object.keys(categories).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' }),
  )) {
    sortedCategories[key] = categories[key];
  }

  return {
    body: chunks.join(''),
    count,
    invalid,
    categories: sortedCategories,
  };
}
