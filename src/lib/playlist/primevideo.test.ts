/// <reference types="node" />
import { describe, test } from 'node:test';
import { strict as assert } from 'node:assert';
import { ppxSources } from './sources';
import { ppxBuild } from './builder';
import type { FetchResult } from './types';

function response(body: string): FetchResult {
  return { ok: true, http: 200, code: null, error: null, seconds: 0, bytes: body.length, body };
}

function inputs(primeBody: string): Record<string, FetchResult> {
  return Object.fromEntries(Object.keys(ppxSources()).map(id => [id, response(
    id === 'primevideo' ? primeBody : `#EXTM3U\n#EXTINF:-1,${id} test\nhttps://example.org/${id}.m3u8\n`,
  )]));
}

describe('Prime video Events integration', () => {
  test('uses the supplied source URL', () => {
    assert.equal(ppxSources().primevideo.url, 'https://raw.githubusercontent.com/doctor-8trange/tekzya9/refs/heads/main/data/primevideoindia.m3u');
  });

  test('exports entries under Prime video Events after existing event sources', () => {
    const result = ppxBuild(inputs('#EXTM3U\n#EXTINF:-1 group-title="Original",Prime fixture\nhttps://example.org/prime.m3u8\n'));
    assert.equal(result.ok, true);
    assert.equal(result.stats.primevideo.channels, 1);
    assert.ok(result.body.includes('group-title="Prime video Events",Prime fixture'));
    assert.ok(result.body.indexOf('https://example.org/prime.m3u8') > result.body.indexOf('https://example.org/willow.m3u8'));
  });

  test('accepts an empty event feed without breaking the VIP playlist', () => {
    const result = ppxBuild(inputs('#EXTM3U\n#DATE:- 27-10-2026 00:15\n'));
    assert.equal(result.ok, true);
    assert.equal(result.stats.primevideo.state, 'NO_EVENTS');
    assert.equal(result.stats.primevideo.channels, 0);
  });

  test('an unavailable Prime feed does not break other groups', () => {
    const fetched = inputs('#EXTM3U\n');
    fetched.primevideo = { ...response(''), ok: false, http: 503, code: 'HTTP_503', error: 'Unavailable' };
    const result = ppxBuild(fetched);
    assert.equal(result.ok, true);
    assert.equal(result.stats.primevideo.state, 'UNAVAILABLE');
    assert.ok(result.body.includes('group-title="Prime video Events",No live events'));
  });

  for (const [id, source] of Object.entries(ppxSources()).filter(([, source]) => source.allow_empty)) {
    test(`${id}: empty feed retains its section without counting a live event`, () => {
      const fetched = inputs('#EXTM3U\n');
      fetched[id] = response('#EXTM3U\n');
      const result = ppxBuild(fetched);
      assert.equal(result.ok, true);
      assert.equal(result.stats[id].channels, 0);
      assert.equal(result.stats[id].state, 'NO_EVENTS');
      assert.ok(result.body.includes(`group-title="${source.group}",No live events\r\nhttps://no-live-events.invalid/${id}`));
    });

    test(`${id}: unavailable feed retains its section`, () => {
      const fetched = inputs('#EXTM3U\n');
      fetched[id] = { ...response(''), ok: false, http: 503, code: 'HTTP_503', error: 'Unavailable' };
      const result = ppxBuild(fetched);
      assert.equal(result.ok, true);
      assert.equal(result.stats[id].state, 'UNAVAILABLE');
      assert.ok(result.body.includes(`tvg-id="${id}-no-events"`));
    });

    test(`${id}: arriving events replace the non-playing entry`, () => {
      const fetched = inputs('#EXTM3U\n');
      fetched[id] = response(`#EXTM3U\n#EXTINF:-1,Live fixture\nhttps://example.org/${id}-live.m3u8\n`);
      const result = ppxBuild(fetched);
      assert.equal(result.stats[id].channels, 1);
      assert.ok(result.body.includes(`https://example.org/${id}-live.m3u8`));
      assert.ok(!result.body.includes(`tvg-id="${id}-no-events"`));
    });
  }
});