import Link from "next/link";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, localeNames, locales, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { formatMoney } from "@/lib/money";
import { Button } from "@/components/ui/button";

// PHASE 0 — foundation preview.
//
// Not the homepage. This exists so the design system can be reviewed on a
// screen instead of taken on trust: every token, type role, scent theme, and
// money format rendered once. Delete it when Phase 1 lands the real homepage.

export default async function FoundationPreview({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getDictionary(locale as Locale);

  const surfaces = [
    { name: "sand-50", hex: "#FCF9F5", use: "Page background", cls: "bg-sand-50" },
    { name: "sand-100", hex: "#F8F4EF", use: "Cards", cls: "bg-sand-100" },
    { name: "sand-200", hex: "#F6F1EA", use: "Alt sections", cls: "bg-sand-200" },
    { name: "blush-100", hex: "#F8ECEB", use: "Tinted panels", cls: "bg-blush-100" },
    { name: "blush-200", hex: "#F4E4E2", use: "Borders, hover", cls: "bg-blush-200" },
  ];

  const derived = [
    { name: "ink", hex: "#3F3F3F", use: "Text, buttons", cls: "bg-ink" },
    { name: "ink-soft", hex: "#5C5854", use: "Secondary", cls: "bg-ink-soft" },
    { name: "ink-muted", hex: "#8A817C", use: "Captions", cls: "bg-ink-muted" },
    { name: "pearl", hex: "#C98A28", use: "Pearl Bloom", cls: "bg-pearl" },
    { name: "coral", hex: "#C9527C", use: "Coral Bloom", cls: "bg-coral" },
    { name: "ocean", hex: "#4A87BE", use: "Ocean Bloom", cls: "bg-ocean" },
  ];

  const scents = [
    { theme: "theme-pearl", script: "Pearl", tint: "bg-pearl-tint" },
    { theme: "theme-coral", script: "Coral", tint: "bg-coral-tint" },
    { theme: "theme-ocean", script: "Ocean", tint: "bg-ocean-tint" },
  ];

  const rate = siteConfig.currency.fallbackLbpRate;

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      {/* Header */}
      <header className="border-b border-blush-200 pb-8">
        <p className="eyebrow">Phase 0 · Foundation</p>
        <h1 className="mt-3 text-4xl">{siteConfig.name} design system</h1>
        <p className="mt-2 max-w-xl text-ink-muted">
          Every token, type role, and theme rendered once for review. Not the homepage.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {locales.map((l) => (
            <Link
              key={l}
              href={`/${l}`}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                l === locale
                  ? "bg-ink text-sand-50"
                  : "border border-blush-200 bg-sand-100 text-ink hover:bg-blush-100"
              }`}
            >
              {localeNames[l]}
            </Link>
          ))}
          <span className="text-xs text-ink-muted">
            ← switch to check right-to-left
          </span>
        </div>
      </header>

      {/* Surfaces */}
      <section className="mt-14">
        <h2 className="text-xl">Surfaces</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Straight from the client palette PDF. Don&apos;t invent new background shades.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {surfaces.map((c) => (
            <div key={c.name} className="overflow-hidden rounded-[var(--radius-card)] border border-blush-200">
              <div className={`h-20 ${c.cls}`} />
              <div className="bg-sand-100 px-3 py-2">
                <p className="font-display text-sm">{c.name}</p>
                <p className="font-mono text-[11px] text-ink-muted">{c.hex}</p>
                <p className="mt-0.5 text-[11px] text-ink-muted">{c.use}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Derived */}
      <section className="mt-12">
        <h2 className="text-xl">Ink &amp; accents</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Derived, not supplied — the PDF has no text or accent colour. Ink is the
          logo&apos;s charcoal; the three accents are sampled from the bottle labels and
          darkened for legible text contrast.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-6">
          {derived.map((c) => (
            <div key={c.name} className="overflow-hidden rounded-[var(--radius-card)] border border-blush-200">
              <div className={`h-20 ${c.cls}`} />
              <div className="bg-sand-100 px-3 py-2">
                <p className="font-display text-sm">{c.name}</p>
                <p className="font-mono text-[11px] text-ink-muted">{c.hex}</p>
                <p className="mt-0.5 text-[11px] text-ink-muted">{c.use}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Type */}
      <section className="mt-12">
        <h2 className="text-xl">Type</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Taken from the bottles, not from a template.
        </p>

        <div className="mt-5 space-y-6 rounded-[var(--radius-card)] border border-blush-200 bg-sand-100 p-8">
          <div>
            <p className="eyebrow">Eyebrow · Jost 500 · 0.18em</p>
            <p className="mt-1 text-xs text-ink-muted">The logo ring&apos;s letterspaced caps.</p>
          </div>

          <div className="border-t border-blush-200 pt-6">
            <h1 className="text-5xl">{t.home.heroTitle}</h1>
            <p className="mt-1 text-xs text-ink-muted">H1 · Jost 400 · 48px</p>
          </div>

          <div className="border-t border-blush-200 pt-6">
            {/* The label lockup: script scent name over geometric caps. */}
            <p className="scent-script text-5xl">Ocean</p>
            <p className="lockup-caps text-4xl text-ocean">Bloom</p>
            <p className="mt-2 text-xs text-ink-muted">
              Script · Sacramento — scent names only. Never body text, never buttons.
            </p>
          </div>

          <div className="border-t border-blush-200 pt-6">
            <p className="max-w-md">{t.home.heroBody}</p>
            <p className="mt-1 text-xs text-ink-muted">Body · Karla 400 · 16px</p>
          </div>
        </div>
      </section>

      {/* Scent themes */}
      <section className="mt-12">
        <h2 className="text-xl">Scent themes</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Wrap any subtree in <code className="font-mono text-xs">.theme-coral</code> and its
          accents retint. Components read <code className="font-mono text-xs">var(--accent)</code>{" "}
          instead of taking a colour prop.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {scents.map((s) => (
            <div
              key={s.theme}
              className={`${s.theme} ${s.tint} rounded-[var(--radius-card)] border border-blush-200 p-6`}
            >
              <p className="scent-script text-3xl">{s.script}</p>
              <p className="lockup-caps text-2xl text-accent">Bloom</p>
              <p className="mt-3 text-sm text-ink-muted">{t.home.heroBody}</p>
              <Button variant="accent" size="sm" className="mt-4">
                {t.home.shopNow}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Buttons */}
      <section className="mt-12">
        <h2 className="text-xl">Buttons</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Primary is charcoal by design — each Bloom already owns a colour, so a coloured
          primary would be a fourth accent belonging to nothing.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-[var(--radius-card)] border border-blush-200 bg-sand-100 p-6">
          <Button>{t.product.addToCart}</Button>
          <Button variant="outline">{t.common.viewAll}</Button>
          <Button variant="ghost">{t.nav.shop}</Button>
          <Button variant="whatsapp">{t.product.orderOnWhatsapp}</Button>
          <Button disabled>{t.product.outOfStock}</Button>
        </div>
      </section>

      {/* Money */}
      <section className="mt-12">
        <h2 className="text-xl">Money</h2>
        <p className="mt-1 text-sm text-ink-muted">
          USD is the base; LBP is converted at render time and rounded to the nearest 1,000.
          Rate shown: {rate.toLocaleString()} L.L. per $1.
        </p>
        <div className="mt-5 overflow-hidden rounded-[var(--radius-card)] border border-blush-200">
          <table className="w-full bg-sand-100 text-sm">
            <thead className="text-ink-muted">
              <tr className="border-b border-blush-200">
                <th className="p-3 text-start font-normal">Stored (USD)</th>
                <th className="p-3 text-start font-normal">Shown as USD</th>
                <th className="p-3 text-start font-normal">Shown as LBP</th>
              </tr>
            </thead>
            <tbody>
              {[25, 18.5, 47].map((usd) => (
                <tr key={usd} className="border-b border-blush-200 last:border-0">
                  <td className="p-3 font-mono text-xs text-ink-muted">{usd.toFixed(2)}</td>
                  <td className="p-3">
                    {formatMoney(usd, { currency: "USD", lbpRate: rate, locale: locale as Locale })}
                  </td>
                  <td className="p-3">
                    {formatMoney(usd, { currency: "LBP", lbpRate: rate, locale: locale as Locale })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* RTL check */}
      <section className="mt-12">
        <h2 className="text-xl">Direction</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Current: <code className="font-mono text-xs">dir=&quot;{locale === "ar" ? "rtl" : "ltr"}&quot;</code>.
          Layout uses logical properties throughout, so this mirrors without duplicate CSS.
        </p>
        <div className="mt-5 rounded-[var(--radius-card)] border border-blush-200 bg-sand-100 p-6">
          <div className="flex items-center gap-4 border-s-4 border-accent ps-4">
            <span className="rtl-flip text-2xl">→</span>
            <div>
              <p className="font-display">{t.trust.deliveryTitle}</p>
              <p className="text-sm text-ink-muted">{t.trust.deliveryBody}</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-ink-muted">
            The border sits on the <em>start</em> edge and the arrow flips — both follow
            direction automatically.
          </p>
        </div>
      </section>

      <footer className="mt-16 border-t border-blush-200 pt-8 text-xs text-ink-muted">
        <p>
          Open questions for review: is charcoal right for the primary button, or did the
          green CTA in the mockup mean something? Arabic strings here are placeholder —
          every one needs a native speaker before launch.
        </p>
      </footer>
    </main>
  );
}
