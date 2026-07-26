"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";
import { Price } from "./price";
import { effectivePrice, isOnSale, discountPercent } from "@/lib/money";
import { themeClass, type ProductView } from "@/types/catalog";
import type { Dictionary } from "@/i18n/dictionaries";
import { localized, type Locale } from "@/i18n/config";

export function ProductCard({
  product,
  locale,
  dict,
}: {
  product: ProductView;
  locale: Locale;
  dict: Dictionary;
}) {
  const add = useCart((s) => s.add);
  const name = localized(product, "name", locale);
  const onSale = isOnSale(product.price, product.salePrice);
  const off = discountPercent(product.price, product.salePrice);
  const href = `/${locale}/products/${product.slug}`;

  return (
    <div className={`${themeClass[product.accentTheme]} group overflow-hidden rounded-[var(--radius-card)] border border-blush-200 bg-sand-100`}>
      <Link href={href} className="relative block aspect-[4/5] overflow-hidden bg-accent-tint">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full items-center justify-center scent-script text-4xl text-accent/40">
            {name.charAt(0)}
          </span>
        )}
        {product.isFeatured && !onSale && (
          <span className="absolute start-3 top-3 rounded-full bg-sand-50/90 px-3 py-1 text-[11px] font-medium text-accent">
            {dict.product.bestSeller}
          </span>
        )}
        {onSale && (
          <span className="absolute start-3 top-3 rounded-full bg-accent px-3 py-1 text-[11px] font-medium text-white">
            −{off}%
          </span>
        )}
      </Link>

      <div className="p-4">
        <Link href={href}>
          <h3 className="scent-script text-2xl leading-none text-ink">{name}</h3>
        </Link>
        {product.size && <p className="mt-1 text-xs text-ink-muted">{product.size}</p>}
        <div className="mt-3 flex items-center justify-between">
          <Price price={product.price} salePrice={product.salePrice} />
          <button
            aria-label={`${dict.product.addToCart}: ${name}`}
            disabled={product.stock <= 0}
            onClick={() =>
              add({
                productId: product.id,
                slug: product.slug,
                name: product.nameEn,
                priceUSD: effectivePrice(product.price, product.salePrice),
                image: product.images[0],
                size: product.size ?? undefined,
              })
            }
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-accent hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink"
          >
            <ShoppingBag size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
