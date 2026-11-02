import { createFileRoute } from "@tanstack/react-router";
import { ppxSources } from "../../lib/playlist/sources";
import { ppxFetchSources } from "../../lib/playlist/fetcher";
import { ppxBuild } from "../../lib/playlist/builder";
import { PPX_CACHE_TTL, PPX_STALE_MAX } from "../../lib/playlist/constants";

// ── In-memory cache for stale-while-revalidate ──
let cachedBody: string | null = null;
let cachedAt = 0;
let buildInProgress = false;

async function buildPlaylist(): Promise<{ ok: boolean; body: string; channels: number; sources: number }> {
  const sources = ppxSources();
  const fetched = await ppxFetchSources(sources);
  const result = ppxBuild(fetched);

  const channelCount = result.ok ? (result.body.match(/#EXTINF/g) || []).length : 0;

  // Log stats for debugging
  for (const [id, stat] of Object.entries(result.stats)) {
    const status = stat.ok ? '✅' : '❌';
    const extra = stat.optional ? ` [${(stat as any).state || 'required'}]` : '';
    console.log(`  ${status} ${id}: ${stat.channels}ch, ${stat.seconds}s${stat.error ? ` — ${stat.error}` : ''}${extra}`);
  }

  return {
    ok: result.ok,
    body: result.body,
    channels: channelCount,
    sources: Object.keys(fetched).length,
  };
}

export const Route = createFileRoute("/api/playlist")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const now = Date.now();
        const cacheAge = (now - cachedAt) / 1000;

        // Serve fresh cache
        if (cachedBody && cacheAge < PPX_CACHE_TTL) {
          const channels = (cachedBody.match(/#EXTINF/g) || []).length;
          return new Response(cachedBody, {
            status: 200,
            headers: {
              "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8",
              "Content-Disposition": 'inline; filename="playlist.m3u"',
              "Cache-Control": `public, max-age=${PPX_CACHE_TTL}`,
              "Access-Control-Allow-Origin": "*",
              "X-PPX-Channels": String(channels),
              "X-PPX-Cache": "HIT",
              "X-PPX-Cache-Age": String(Math.round(cacheAge)),
            },
          });
        }

        try {
          // Prevent thundering herd — only one build at a time
          if (buildInProgress && cachedBody && cacheAge < PPX_STALE_MAX) {
            const channels = (cachedBody.match(/#EXTINF/g) || []).length;
            return new Response(cachedBody, {
              status: 200,
              headers: {
                "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8",
                "Content-Disposition": 'inline; filename="playlist.m3u"',
                "Cache-Control": "public, max-age=60",
                "Access-Control-Allow-Origin": "*",
                "X-PPX-Channels": String(channels),
                "X-PPX-Cache": "STALE",
                "X-PPX-Cache-Age": String(Math.round(cacheAge)),
              },
            });
          }

          buildInProgress = true;
          console.log(`[playlist] Building fresh playlist...`);
          const result = await buildPlaylist();
          buildInProgress = false;

          if (result.ok && result.channels > 0) {
            // Update cache
            cachedBody = result.body;
            cachedAt = Date.now();

            return new Response(result.body, {
              status: 200,
              headers: {
                "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8",
                "Content-Disposition": 'inline; filename="playlist.m3u"',
                "Cache-Control": `public, max-age=${PPX_CACHE_TTL}`,
                "Access-Control-Allow-Origin": "*",
                "X-PPX-Channels": String(result.channels),
                "X-PPX-Sources": String(result.sources),
                "X-PPX-Cache": "MISS",
              },
            });
          }

          // Build failed but we have stale cache — serve it
          if (cachedBody && cacheAge < PPX_STALE_MAX) {
            const channels = (cachedBody.match(/#EXTINF/g) || []).length;
            console.warn(`[playlist] Build failed, serving stale cache (${Math.round(cacheAge)}s old)`);
            return new Response(cachedBody, {
              status: 200,
              headers: {
                "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8",
                "Content-Disposition": 'inline; filename="playlist.m3u"',
                "Cache-Control": "public, max-age=60",
                "Access-Control-Allow-Origin": "*",
                "X-PPX-Channels": String(channels),
                "X-PPX-Cache": "STALE-FALLBACK",
              },
            });
          }

          // No cache, build failed
          return new Response(
            "#EXTM3U\n#EXTINF:-1,Playlist temporarily unavailable\nhttps://example.com/error\n",
            {
              status: 200,
              headers: {
                "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8",
                "Access-Control-Allow-Origin": "*",
              },
            },
          );
        } catch (error) {
          buildInProgress = false;
          const msg = error instanceof Error ? error.message : "Unknown error";
          console.error("[playlist] Fatal error:", msg);

          // Serve stale cache on crash
          if (cachedBody) {
            return new Response(cachedBody, {
              status: 200,
              headers: {
                "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8",
                "Access-Control-Allow-Origin": "*",
                "X-PPX-Cache": "ERROR-FALLBACK",
              },
            });
          }

          return new Response(
            "#EXTM3U\n#EXTINF:-1,Playlist temporarily unavailable\nhttps://example.com/error\n",
            {
              status: 200,
              headers: {
                "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8",
                "Access-Control-Allow-Origin": "*",
              },
            },
          );
        }
      },
    },
  },
});
