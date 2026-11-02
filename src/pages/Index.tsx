import { useEffect, useState } from 'react';

const JOIN_URL = 'https://t.me/+27i16q_PeVRmNzFl';
const LOGO_URL =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/240px-Telegram_logo.svg.png';

export default function Index() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex min-h-screen items-center justify-center p-3.5"
      style={{
        background:
          'radial-gradient(circle at 50% 0, #143b55 0, transparent 36%), ' +
          'radial-gradient(circle at 0 100%, #25114c 0, transparent 30%), #05060b',
      }}>
      <main className="w-full max-w-[920px]">
        <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(10,14,24,0.92)] shadow-[0_28px_90px_rgba(0,0,0,0.5)]">
          {/* animated top bar */}
          <div
            className="h-[3px] animate-flow"
            style={{
              background:
                'linear-gradient(90deg,#25d9ff,#5076ff,#b55cff,#ff52da,#25d9ff)',
              backgroundSize: '220% 100%',
            }}
          />

          <div className="p-6 sm:p-10 lg:p-14">
            <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-[260px_1fr] sm:gap-10 lg:gap-16">
              {/* Logo */}
              <div className="flex justify-center">
                <div
                  className={`w-[min(230px,62vw)] aspect-square rounded-full bg-gradient-to-br from-[#1ab9e8]/20 to-[#9957ff]/20 flex items-center justify-center transition-all duration-700 ${
                    mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                  }`}
                  style={{ filter: 'drop-shadow(0 18px 30px rgba(0,0,0,0.45))' }}
                >
                  <span className="text-7xl">📺</span>
                </div>
              </div>

              {/* Content */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(79,211,255,0.2)] bg-[rgba(79,211,255,0.06)] px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#bdefff]">
                  <span className="h-[7px] w-[7px] rounded-full bg-[#59f59f] shadow-[0_0_12px_#59f59f]" />
                  Live streaming community
                </div>

                <h1 className="mt-4 text-[clamp(38px,6vw,70px)] leading-none tracking-[-0.05em]">
                  Welcome to{' '}
                  <span className="bg-gradient-to-r from-white via-[#9deeff] via-[#b48cff] to-[#ffb4ed] bg-clip-text text-transparent">
                    Premium Plug X
                  </span>
                </h1>

                <p className="mt-4 max-w-[620px] text-[clamp(15px,2vw,18px)] leading-relaxed text-[#b7c1d2]">
                  🔥 Amazing live streams, entertainment and fresh playlist
                  updates — all in one place. Join our official community for
                  the latest updates.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href={JOIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-white/[0.14] bg-gradient-to-br from-[#1ab9e8] via-[#486dff] to-[#9957ff] px-5 font-black text-white shadow-[0_15px_35px_rgba(57,109,255,0.25)] transition-transform hover:-translate-y-0.5"
                  >
                    🚀 Join Premium Plug X
                  </a>
                  <span className="text-xs text-[#7f8ba3]">
                    Fast • Premium • Community updates
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap justify-between gap-3 border-t border-white/[0.07] pt-5 text-[11px] text-[#77839a]">
              <span>© Premium Plug X</span>
              <span>Enjoy the streams ❤️</span>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes flow {
          to { background-position: 220% 0; }
        }
        .animate-flow {
          animation: flow 7s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-flow { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
