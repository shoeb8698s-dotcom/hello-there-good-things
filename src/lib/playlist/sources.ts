import type { SourceConfig } from './types';

export function ppxSources(): Record<string, SourceConfig> {
  return {
    jio: {
      url: 'https://premiumplugx.top/ssk/playlist.php',
      mirrors: [
        'https://premiumplugx.com/ssk/playlist.php',
        'https://premiumplugx.top/ssk/playlist.php',
      ],
      group: 'Jio TV+',
      passthrough: true,
      timeout: 60,
      retries: 3,
      retryDelay: 3000,
      optional: true,
      allow_empty: true,
    },
    zeeww: {
      url: 'https://premiumplug.fun/tee/playlist.php',
      mirrors: [
        'https://premiumplug.fun/tee/playlist.php',
      ],
      group: 'ZEE5 Worldwide',
      timeout: 30,
      retries: 2,
    },
    hotstar: {
      url: 'https://premiumplugx.com/htt/hot.php?playlist=1',
      mirrors: [
        'https://premiumplugx.com/htt/hot.php?playlist=1',
      ],
      group: 'JioHotstar',
      timeout: 30,
      retries: 2,
      optional: true,
      allow_empty: true,
    },
    vzy: {
      url: 'https://premiumplugx.me/vzy/playlist.php',
      mirrors: [
        'https://premiumplugx.me/vzy/playlist.php',
      ],
      group: 'VZY',
      timeout: 25,
      retries: 2,
      optional: true,
      allow_empty: true,
    },
    fancode: {
      url: 'https://raw.githubusercontent.com/drmlive/fancode-live-events/refs/heads/main/fancode.m3u',
      group: 'FanCode',
      timeout: 15,
      retries: 2,
      optional: true,
      allow_empty: true,
    },
    sonylivevents: {
      url: 'https://premiumplugx.top/slivevents/sony.php',
      group: 'Sonyliv events',
      timeout: 15,
      retries: 2,
      optional: true,
      allow_empty: true,
    },
    willow: {
      url: 'https://raw.githubusercontent.com/srhady/willow-event/refs/heads/main/live_sports.m3u',
      group: 'Willow live events',
      timeout: 15,
      retries: 2,
      optional: true,
      allow_empty: true,
    },
    primevideo: {
      url: 'https://raw.githubusercontent.com/doctor-8trange/tekzya9/refs/heads/main/data/primevideoindia.m3u',
      group: 'Prime video Events',
      timeout: 15,
      retries: 2,
      optional: true,
      allow_empty: true,
    },
  };
}
