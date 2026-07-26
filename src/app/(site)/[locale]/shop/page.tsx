// ISR: regenerate at most every 2 minutes so admin edits appear without a redeploy.
export const revalidate = 120;

import { notFound } from "next/navigation";
import { isLocale, localized, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllProducts, getProductsByCategory, getCategoryTree, getCategoryBySlug } from "@/lib/catalog";
import { ProductCard } from "@/components/storefront/product-card";
import { CategoryTree } from "@/components/storefront/category-tree";

export const metadata = { title: "Shop" };

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  if (!isLocale(locale)) notFound();
  const loc = locale as Locale;
  const dict = await getDictionary(loc);

  const [tree, activeCategory] = await Promise.all([
    getCategoryTree(),
    category ? getCategoryBySlug(category) : Promise.resolve(null),
  ]);

  const products =
    activeCategory
      ? await getProductsByCategory(activeCategory.id)
      : await getAllProducts();

  const heading = activeCategory ? localized(activeCategory, "name", loc) : dict.nav.shop;
  const blurb = activeCategory ? localized(activeCategory, "description", loc) : dict.home.signatureSubtitle;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="rounded-[var(--radius-card)] bg-blush-100 px-6 py-10 text-center">
        <h1 className="font-display text-3xl text-ink">{heading}</h1>
        {blurb && <p className="mt-2 text-ink-soft">{blurb}</p>}
      </header>

      <div className="mt-8 grid gap-8 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <p className="eyebrow mb-3">{dict.nav.shop}</p>
          <CategoryTree tree={tree} locale={loc} activeSlug={category} allLabel={dict.common.viewAll} />
        </aside>

        <div>
          <p className="mb-4 text-sm text-ink-muted">{products.length} products</p>
          {products.length === 0 ? (
            <p className="py-16 text-center text-ink-muted">Nothing here yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} locale={loc} dict={dict} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
