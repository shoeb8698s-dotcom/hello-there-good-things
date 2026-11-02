export interface SourceConfig {
  url: string;
  mirrors?: string[];       // fallback URLs tried if primary fails
  group: string;
  timeout: number;
  retries?: number;          // max retry attempts (default 2)
  retryDelay?: number;       // ms between retries (default 2000)
  optional?: boolean;
  allow_empty?: boolean;
  passthrough?: boolean;    // if true, raw M3U body used as-is (no parsing/modification)
}

export interface FetchResult {
  ok: boolean;
  http: number;
  code: string | null;
  error: string | null;
  seconds: number;
  bytes: number;
  body: string;
}

export interface ParsedPlaylist {
  body: string;
  count: number;
  invalid: number;
  categories: Record<string, number>;
}

export interface SourceStats extends Omit<FetchResult, 'body'> {
  channels: number;
  invalid: number;
  categories?: Record<string, number>;
  optional?: boolean;
  state?: string;
  sony_logos?: SonyLogoResult;
}

export interface BuildResult {
  ok: boolean;
  stats: Record<string, SourceStats>;
  body: string;
}

export interface ChannelData {
  tvgId?: string;
  name: string;
  url: string;
  logo?: string;
  language?: string;
  category?: string;
  keyId?: string;
  key?: string;
}

export interface PackData {
  id: string;
  group: string;
  logo: string;
  channels: ChannelData[];
}

export interface StaticData {
  userAgent: string;
  remoteLogos: Record<string, string>;
  packs: Record<string, PackData>;
}

export interface GenreRules {
  exact: Record<string, string>;
  patterns: [string, string[]][];
  aliases: Record<string, string>;
}

export interface SonyLogoResult {
  pack: PackData;
  matched: number;
  quality_fallbacks: string[];
  unmatched: string[];
}

export interface ParseDefaults {
  logo?: string;
  category?: string;
  user_agent?: string;
  referer?: string;
}
