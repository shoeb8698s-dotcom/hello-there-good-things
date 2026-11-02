import { createFileRoute } from "@tanstack/react-router";
import heroImage from "@/assets/hero.jpg";
import ctaImage from "@/assets/cta.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Premium — Everything worth having, elevated" },
      {
        name: "description",
        content:
          "Premium is a members-only experience: hand-selected products, private drops and concierge service for people who expect more.",
      },
      { property: "og:title", content: "Premium — Everything worth having, elevated" },
      {
        property: "og:description",
        content: "Members-only products, private drops and concierge service.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <SiteNav />
      <Hero />
      <Pillars />
      <Pricing />
      <Quote />
      <ClosingCta />
      <SiteFooter />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-obsidian/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="font-display text-2xl font-medium tracking-[0.18em] text-foreground">
          <span className="text-gold-gradient">PREMIUM</span>
        </a>
        <div className="hidden items-center gap-8 text-[0.8rem] tracking-wide text-muted-foreground md:flex">
          <a href="#pillars" className="transition-colors hover:text-gold">The Standard</a>
          <a href="#membership" className="transition-colors hover:text-gold">Membership</a>
          <a href="#voices" className="transition-colors hover:text-gold">Voices</a>
        </div>
        <a
          href="#membership"
          className="rounded-full border border-gold/50 px-5 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-gold transition-all hover:bg-gold hover:text-primary-foreground"
        >
          Join
        </a>
      </nav>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden">
      <img
        src={heroImage}
        alt="Molten gold flowing through dark silk"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-obsidian/95 via-obsidian/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="relative mx-auto w-full max-w-6xl px-6 pt-16">
        <p className="eyebrow reveal" style={{ animationDelay: "0.15s" }}>
          Est. MMXXVI — By invitation
        </p>
        <h1
          className="reveal mt-6 max-w-3xl font-display text-6xl font-light leading-[1.02] tracking-tight text-foreground sm:text-7xl lg:text-8xl"
          style={{ animationDelay: "0.3s" }}
        >
          Everything worth having,
          <em className="text-gold-gradient not-italic"> elevated.</em>
        </h1>
        <p
          className="reveal mt-8 max-w-xl text-lg font-light leading-relaxed text-muted-foreground"
          style={{ animationDelay: "0.45s" }}
        >
          One membership. Hand-selected objects, private drops before anyone else,
          and a concierge that answers in minutes — not days.
        </p>
        <div className="reveal mt-10 flex flex-wrap items-center gap-4" style={{ animationDelay: "0.6s" }}>
          <a
            href="#membership"
            className="rounded-full bg-gold px-8 py-3.5 text-[0.75rem] font-semibold uppercase tracking-[0.24em] text-primary-foreground shadow-lux transition-transform hover:scale-[1.03]"
          >
            Request an invitation
          </a>
          <a
            href="#pillars"
            className="text-[0.75rem] font-medium uppercase tracking-[0.24em] text-muted-foreground underline-offset-8 transition-colors hover:text-gold hover:underline"
          >
            See the standard
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Pillars                                                             */
/* ------------------------------------------------------------------ */

const pillars = [
  {
    numeral: "I",
    title: "Curated, never crowded",
    body: "Every piece is chosen by our atelier panel. Fewer than one in forty submissions make it into the collection.",
  },
  {
    numeral: "II",
    title: "Private drops",
    body: "Members see each release seventy-two hours before it exists publicly — and can reserve their size on the spot.",
  },
  {
    numeral: "III",
    title: "Concierge, always",
    body: "A named advisor on WhatsApp and email, answering within minutes. From sourcing to returns, one person handles it all.",
  },
];

function Pillars() {
  return (
    <section id="pillars" className="mx-auto max-w-6xl px-6 py-28">
      <div className="mb-16">
        <p className="eyebrow">The Standard</p>
        <h2 className="mt-4 max-w-2xl font-display text-4xl font-light leading-tight sm:text-5xl">
          Three promises we keep <em className="text-gold-gradient not-italic">without exception</em>
        </h2>
        <div className="gold-rule mt-6" />
      </div>
      <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
        {pillars.map((p) => (
          <article key={p.numeral} className="group bg-card p-10 transition-colors hover:bg-accent">
            <span className="font-display text-3xl italic text-gold/70 transition-colors group-hover:text-gold">
              {p.numeral}
            </span>
            <h3 className="mt-6 font-display text-2xl font-medium">{p.title}</h3>
            <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground">{p.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Pricing                                                             */
/* ------------------------------------------------------------------ */

const tiers = [
  {
    name: "Signature",
    price: "$28",
    period: "per month",
    blurb: "The essential membership.",
    features: ["Full collection access", "72-hour early drops", "Email concierge"],
    cta: "Begin with Signature",
    featured: false,
  },
  {
    name: "Noir",
    price: "$68",
    period: "per month",
    blurb: "For those who want first and best.",
    features: [
      "Everything in Signature",
      "Named concierge, minutes-fast",
      "First allocation on every drop",
      "Private atelier previews",
    ],
    cta: "Request Noir",
    featured: true,
  },
  {
    name: "House",
    price: "$220",
    period: "per month",
    blurb: "A membership for two households.",
    features: ["Everything in Noir", "Two household profiles", "Annual gifting service", "Event invitations"],
    cta: "Speak with us",
    featured: false,
  },
];

function Pricing() {
  return (
    <section id="membership" className="border-y border-border bg-obsidian/60 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="eyebrow">Membership</p>
          <h2 className="mt-4 font-display text-4xl font-light leading-tight sm:text-5xl">
            Choose your <em className="text-gold-gradient not-italic">tier</em>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm font-light text-muted-foreground">
            Every tier is month-to-month. Cancel anytime; keep what you have claimed.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {tiers.map((t) => (
            <article
              key={t.name}
              className={
                t.featured
                  ? "relative flex flex-col rounded-xl border border-gold/40 bg-card p-10 shadow-lux"
                  : "flex flex-col rounded-xl border border-border bg-card/60 p-10"
              }
            >
              {t.featured && (
                <span className="absolute -top-3 left-10 rounded-full bg-gold px-4 py-1 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-primary-foreground">
                  Most chosen
                </span>
              )}
              <h3 className="font-display text-2xl font-medium tracking-wide">{t.name}</h3>
              <p className="mt-1 text-sm font-light text-muted-foreground">{t.blurb}</p>
              <p className="mt-6 font-display">
                <span className="text-5xl font-light text-gold">{t.price}</span>
                <span className="ml-2 text-sm font-light text-muted-foreground">{t.period}</span>
              </p>
              <ul className="mt-8 flex-1 space-y-3 border-t border-border pt-8 text-sm font-light">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-[0.4rem] h-1 w-1 shrink-0 rounded-full bg-gold" aria-hidden />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#top"
                className={
                  t.featured
                    ? "mt-10 rounded-full bg-gold py-3 text-center text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary-foreground transition-transform hover:scale-[1.02]"
                    : "mt-10 rounded-full border border-border py-3 text-center text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-foreground transition-colors hover:border-gold hover:text-gold"
                }
              >
                {t.cta}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Voices                                                              */
/* ------------------------------------------------------------------ */

function Quote() {
  return (
    <section id="voices" className="mx-auto max-w-4xl px-6 py-28 text-center">
      <p className="eyebrow">Voices</p>
      <blockquote className="mt-8 font-display text-3xl font-light leading-snug sm:text-4xl">
        <span className="text-gold">“</span>The only membership I have kept for five years.
        My concierge remembered my measurements before my tailor did.
        <span className="text-gold">”</span>
      </blockquote>
      <figcaption className="mt-8 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
        A. Marchetti — Noir member, Milan
      </figcaption>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Closing CTA                                                         */
/* ------------------------------------------------------------------ */

function ClosingCta() {
  return (
    <section className="relative overflow-hidden border-t border-border">
      <img
        src={ctaImage}
        alt="A black pedestal under a single gold spotlight"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-bottom"
      />
      <div className="absolute inset-0 bg-obsidian/80" />
      <div className="relative mx-auto max-w-3xl px-6 py-32 text-center">
        <p className="eyebrow">Limited intake</p>
        <h2 className="mt-5 font-display text-4xl font-light leading-tight sm:text-5xl">
          The waitlist moves <em className="text-gold-gradient not-italic">slowly on purpose.</em>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-sm font-light leading-relaxed text-muted-foreground">
          We admit a handful of new members each month, so the service never thins.
          Request your invitation today.
        </p>
        <a
          href="#membership"
          className="mt-10 inline-block rounded-full bg-gold px-10 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.24em] text-primary-foreground shadow-lux transition-transform hover:scale-[1.03]"
        >
          Request an invitation
        </a>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

function SiteFooter() {
  return (
    <footer className="border-t border-border bg-obsidian py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <span className="font-display text-xl tracking-[0.18em] text-gold-gradient">PREMIUM</span>
        <p className="text-xs font-light tracking-wide text-muted-foreground">
          © 2026 Premium. Crafted for the few.
        </p>
        <div className="flex gap-6 text-xs tracking-wide text-muted-foreground">
          <a href="#pillars" className="transition-colors hover:text-gold">The Standard</a>
          <a href="#membership" className="transition-colors hover:text-gold">Membership</a>
          <a href="#voices" className="transition-colors hover:text-gold">Voices</a>
        </div>
      </div>
    </footer>
  );
}
