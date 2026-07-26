import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { siteConfig } from "@/config/site";

export const metadata = { title: "About Us" };

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);
  void dict;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="eyebrow text-center">{siteConfig.tagline}</p>
      <h1 className="mt-2 text-center font-display text-4xl text-ink">Our story</h1>
      <p className="mt-3 text-center scent-script text-3xl text-coral">{siteConfig.motto}</p>

      <div className="mt-10 space-y-5 leading-relaxed text-ink-soft">
        <p>
          {siteConfig.name} began with a simple belief: that skincare should be gentle,
          natural, and made with care. Every bottle is handmade in Lebanon in small
          batches, using pure oils chosen for what they do — nourish, soften, and let
          skin glow.
        </p>
        <p>
          Our three signature Blooms — Pearl, Coral, and Ocean — each carry their own
          scent and character, but they share the same promise: 100% natural, organic,
          and cruelty-free.
        </p>
        {/* TODO: replace with the client's own words at content handover. */}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {siteConfig.promises.map((p) => (
          <div key={p} className="rounded-[var(--radius-card)] bg-blush-100 p-4 text-center text-sm text-ink-soft">
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}
