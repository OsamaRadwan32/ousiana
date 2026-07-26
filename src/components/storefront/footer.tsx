import Link from "next/link";
import { Instagram } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionaries";

export function Footer({ locale, dict }: { locale: string; dict: Dictionary }) {
  return (
    <footer className="mt-24 border-t border-blush-200 bg-sand-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-display text-lg text-ink">{siteConfig.name}</p>
          <p className="mt-1 text-sm text-accent">{siteConfig.motto}</p>
          <p className="mt-3 max-w-xs text-sm text-ink-muted">{siteConfig.description}</p>
        </div>

        <div>
          <p className="eyebrow mb-3">{dict.nav.shop}</p>
          <ul className="space-y-2 text-sm text-ink-soft">
            {siteConfig.scents.map((s) => (
              <li key={s.slug}>
                <Link href={`/${locale}/products/${s.slug}`} className="hover:text-accent">
                  {s.name} Bloom
                </Link>
              </li>
            ))}
            <li><Link href={`/${locale}/shop`} className="hover:text-accent">{dict.common.viewAll}</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-3">{siteConfig.name}</p>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li><Link href={`/${locale}/about`} className="hover:text-accent">{dict.nav.about}</Link></li>
            <li><Link href={`/${locale}/ingredients`} className="hover:text-accent">{dict.nav.ingredients}</Link></li>
            <li><Link href={`/${locale}/contact`} className="hover:text-accent">{dict.nav.contact}</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-3">{dict.nav.contact}</p>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li>{dict.trust.paymentBody}</li>
            <li>{dict.trust.deliveryBody}</li>
            <li>
              <a href={siteConfig.contact.instagram} className="inline-flex items-center gap-1.5 hover:text-accent">
                <Instagram size={15} /> Instagram
              </a>
            </li>
            <li>{siteConfig.contact.email}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-blush-200 py-4 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} {siteConfig.name}. {siteConfig.tagline}.
      </div>
    </footer>
  );
}
