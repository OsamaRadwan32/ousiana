import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getFeaturedProducts } from "@/lib/catalog";
import { IngredientsSection } from "@/components/storefront/sections";

export const metadata = { title: "Ingredients" };

export default async function IngredientsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const loc = locale as Locale;
  const dict = await getDictionary(loc);
  const products = await getFeaturedProducts();

  return (
    <div>
      <div className="mx-auto max-w-3xl px-4 py-14 text-center">
        <p className="eyebrow">Pure by nature</p>
        <h1 className="mt-2 font-display text-4xl text-ink">{dict.product.ingredientsTitle}</h1>
        <p className="mt-3 text-ink-soft">
          Every Bloom is built from natural oils, each chosen for what it does for your skin.
        </p>
      </div>
      {products.map((p) => (
        <IngredientsSection key={p.id} product={p} locale={loc} dict={dict} />
      ))}
    </div>
  );
}
