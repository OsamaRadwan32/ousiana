// ISR: regenerate at most every 2 minutes so admin edits appear without a redeploy.
export const revalidate = 120;

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, localized, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getProductBySlug } from "@/lib/catalog";
import { getStoreSettings } from "@/lib/settings";
import { siteConfig } from "@/config/site";
import { themeClass } from "@/types/catalog";
import { Price } from "@/components/storefront/price";
import { AddToCart } from "@/components/storefront/add-to-cart";
import { IngredientsSection } from "@/components/storefront/sections";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product ? product.nameEn : "Product" };
}

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const loc = locale as Locale;
  const [dict, product, settings] = await Promise.all([
    getDictionary(loc),
    getProductBySlug(slug),
    getStoreSettings(),
  ]);
  if (!product) notFound();

  const name = localized(product, "name", loc);
  const desc = localized(product, "description", loc);
  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= settings.lowStockAlertAt;

  return (
    <div className={themeClass[product.accentTheme]}>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <nav className="mb-6 flex items-center gap-2 text-sm text-ink-muted">
          <Link href={`/${loc}`} className="hover:text-accent">{dict.nav.home}</Link>
          <span>/</span>
          <Link href={`/${loc}/shop`} className="hover:text-accent">{dict.nav.shop}</Link>
          <span>/</span>
          <span className="text-ink">{name}</span>
        </nav>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] border border-blush-200 bg-accent-tint">
            {product.images[0] ? (
              <Image src={product.images[0]} alt={name} fill sizes="(max-width:768px) 100vw, 50vw" className="object-contain p-6" priority />
            ) : (
              <span className="flex h-full items-center justify-center scent-script text-6xl text-accent/30">{name.charAt(0)}</span>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="eyebrow">{product.scent}</p>
            <h1 className="mt-1 scent-script text-5xl leading-none text-accent">{name}</h1>
            <p className="lockup-caps mt-1 text-xl text-ink">Body Oil</p>

            <div className="mt-4">
              <Price price={product.price} salePrice={product.salePrice} size="lg" />
            </div>
            {product.size && <p className="mt-1 text-sm text-ink-muted">{product.size}</p>}

            {desc && <p className="mt-6 leading-relaxed text-ink-soft">{desc}</p>}

            <div className="mt-6 text-sm">
              {!inStock ? (
                <span className="text-danger">{dict.product.outOfStock}</span>
              ) : lowStock ? (
                <span className="text-warning">{dict.product.lowStock}</span>
              ) : (
                <span className="text-success">{dict.product.inStock}</span>
              )}
            </div>

            <div className="mt-6">
              <AddToCart product={product} dict={dict} />
            </div>

            <ul className="mt-8 space-y-1.5 text-sm text-ink-muted">
              {siteConfig.promises.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-accent" /> {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <IngredientsSection product={product} locale={loc} dict={dict} />
    </div>
  );
}
