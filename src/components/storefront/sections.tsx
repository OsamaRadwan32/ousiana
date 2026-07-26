import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { iconFor } from "@/lib/icons";
import { themeClass, type ProductView } from "@/types/catalog";
import { localized, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

// "Our Signature Scents" — one accent-themed card per product.
export function SignatureScents({
  products,
  locale,
  dict,
}: {
  products: ProductView[];
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center">
        <h2 className="font-display text-3xl text-ink">{dict.home.signatureTitle}</h2>
        <p className="mt-1 text-ink-muted">{dict.home.signatureSubtitle}</p>
        <div className="mx-auto mt-3 h-0.5 w-16 rounded bg-coral" />
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {products.map((p) => {
          const name = localized(p, "name", locale);
          const desc = localized(p, "description", locale);
          return (
            <Link
              key={p.id}
              href={`/${locale}/products/${p.slug}`}
              className={`${themeClass[p.accentTheme]} group flex flex-col rounded-[var(--radius-card)] border border-blush-200 bg-accent-tint p-6 transition-shadow hover:shadow-md`}
            >
              <div className="relative mb-4 h-44">
                {p.images[0] ? (
                  <Image src={p.images[0]} alt={name} fill sizes="(max-width:768px) 90vw, 30vw" className="object-contain transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <span className="flex h-full items-center justify-center scent-script text-4xl text-accent/40">{name.charAt(0)}</span>
                )}
              </div>
              <h3 className="scent-script text-3xl leading-none text-accent">{name}</h3>
              <p className="mt-2 flex-1 text-sm text-ink-soft">{desc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                {dict.home.shopNow}
                <ArrowRight size={15} className="rtl-flip transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// "Infused with Nature's Goodness" — rebuilt in code from ingredient DATA so
// it themes per scent and stays bilingual, instead of using the baked-in
// marketing images. Reused on the homepage (a chosen product) and on every
// product detail page.
export function IngredientsSection({
  product,
  locale,
  dict,
}: {
  product: ProductView;
  locale: Locale;
  dict: Dictionary;
}) {
  if (product.ingredients.length === 0) return null;
  return (
    <section className={`${themeClass[product.accentTheme]} bg-accent-tint`}>
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="eyebrow">Infused with</p>
        <h2 className="mt-1 font-display text-3xl text-accent">{dict.product.ingredientsTitle}</h2>

        <div className="mx-auto mt-10 grid max-w-2xl gap-x-8 gap-y-6 text-start sm:grid-cols-2">
          {product.ingredients.map((ing) => {
            const Icon = iconFor(ing.icon);
            const name = localized(ing, "name", locale);
            const benefit = localized(ing, "benefit", locale);
            return (
              <div key={ing.id} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/30 text-accent">
                  <Icon size={20} />
                </span>
                <span>
                  <span className="block font-display text-sm font-medium uppercase tracking-wide text-accent">{name}</span>
                  <span className="block text-sm text-ink-soft">{benefit}</span>
                </span>
              </div>
            );
          })}
        </div>

        <p className="mt-10 scent-script text-2xl text-accent">{dict.product.ingredientsFooter}</p>
      </div>
    </section>
  );
}
