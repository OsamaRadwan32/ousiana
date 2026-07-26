// ISR: regenerate at most every 2 minutes so admin edits appear without a redeploy.
export const revalidate = 120;

import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getFeaturedProducts } from "@/lib/catalog";
import { siteConfig } from "@/config/site";
import { Hero } from "@/components/storefront/hero";
import { FeatureIcons } from "@/components/storefront/feature-icons";
import { TrustBar } from "@/components/storefront/trust-bar";
import { SignatureScents, IngredientsSection } from "@/components/storefront/sections";
import { Button } from "@/components/ui/button";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);
  const featured = await getFeaturedProducts();

  // Feature the ingredients of the first featured product on the homepage.
  const ingredientFeature = featured.find((p) => p.ingredients.length > 0);

  return (
    <>
      <Hero locale={locale} dict={dict} />
      <FeatureIcons dict={dict} />
      <TrustBar dict={dict} />
      <SignatureScents products={featured} locale={locale as Locale} dict={dict} />

      {/* Brand story strip */}
      <section className="bg-sand-200">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p className="eyebrow">{siteConfig.tagline}</p>
          <p className="mt-4 font-display text-2xl leading-relaxed text-ink sm:text-3xl">
            Handmade in Lebanon in small batches, with natural oils chosen to nourish
            your skin and lift your senses.
          </p>
          <p className="mt-3 scent-script text-3xl text-coral">{siteConfig.motto}</p>
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link href={`/${locale}/about`}>{dict.nav.about}</Link>
            </Button>
          </div>
        </div>
      </section>

      {ingredientFeature && (
        <IngredientsSection product={ingredientFeature} locale={locale as Locale} dict={dict} />
      )}
    </>
  );
}
