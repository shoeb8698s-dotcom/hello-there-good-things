// Supabase Edge Function (Deno runtime)
// Serves the Premium Plug X playlist as an API endpoint.
//
// Deploy: supabase functions deploy playlist
// Access: https://<project-ref>.supabase.co/functions/v1/playlist

// NOTE: In a Lovable/Supabase Edge Function environment, you would need to
// bundle the playlist library or import it differently. For now, this file
// serves as the edge function template.

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

const PPX_BUILD = 'tsx-dangal-play-17-vzy';

// Simple in-memory cache for the edge function
let cachedPlaylist: { body: string; created: number; stats: any } | null = null;
const CACHE_TTL = 300; // 5 minutes

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return new Response(
      JSON.stringify({ error: 'METHOD_NOT_ALLOWED' }),
      {
        status: 405,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json', Allow: 'GET, HEAD, OPTIONS' },
      },
    );
  }

  const url = new URL(req.url);
  const debug = url.searchParams.get('debug') === '1';
  const refresh = url.searchParams.get('refresh') === '1';

  // Check cache
  if (!debug && !refresh && cachedPlaylist && Date.now() / 1000 - cachedPlaylist.created < CACHE_TTL) {
    const headers = {
      ...CORS_HEADERS,
      'Content-Type': 'audio/x-mpegurl; charset=utf-8',
      'Content-Disposition': 'inline; filename="playlist.m3u"',
      'X-Playlist-Build': PPX_BUILD,
      'X-Playlist-Cache': 'HIT',
      'Cache-Control': 'no-store',
    };
    return new Response(req.method === 'HEAD' ? null : cachedPlaylist.body, {
      status: 200,
      headers,
    });
  }

  try {
    // Dynamic import would be needed here for the full library.
    // For now, return a helpful message directing to the client-side build.
    //
    // In production, you would:
    // 1. Bundle the playlist library into this edge function
    // 2. Use Deno's fetch() to call ppxFetchSources()
    // 3. Call ppxBuild() to generate the playlist
    // 4. Cache and return the result
    //
    // Example (pseudocode):
    // const { ppxSources } = await import('../../../src/lib/playlist/sources.ts');
    // const { ppxFetchSources } = await import('../../../src/lib/playlist/fetcher.ts');
    // const { ppxBuild } = await import('../../../src/lib/playlist/builder.ts');
    // const sources = ppxSources();
    // const fetched = await ppxFetchSources(sources);
    // const result = ppxBuild(fetched);

    return new Response(
      JSON.stringify({
        message: 'Edge function placeholder. Use /playlist page in the React app for client-side generation, or bundle the playlist library into this edge function for server-side generation.',
        build: PPX_BUILD,
        docs: 'Deploy with: supabase functions deploy playlist',
      }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: 'GENERATION_FAILED',
        message: error.message || 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      },
    );
  }
});
