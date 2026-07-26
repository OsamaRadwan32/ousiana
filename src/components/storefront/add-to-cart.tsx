"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { effectivePrice } from "@/lib/money";
import { whatsappLink, whatsappProductMessage } from "@/lib/whatsapp";
import type { ProductView } from "@/types/catalog";
import type { Dictionary } from "@/i18n/dictionaries";

export function AddToCart({
  product,
  dict,
  layout = "row",
}: {
  product: ProductView;
  dict: Dictionary;
  layout?: "row" | "stacked";
}) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);
  const inStock = product.stock > 0;

  const onAdd = () => {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.nameEn,
      priceUSD: effectivePrice(product.price, product.salePrice),
      image: product.images[0],
      size: product.size ?? undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className={layout === "stacked" ? "flex flex-col gap-3" : "flex flex-col gap-3 sm:flex-row"}>
      <Button size="lg" variant="accent" disabled={!inStock} onClick={onAdd}>
        {!inStock ? dict.product.outOfStock : added ? dict.product.added + " ✓" : dict.product.addToCart}
      </Button>
      <Button asChild size="lg" variant="whatsapp">
        <a href={whatsappLink(whatsappProductMessage(product.nameEn))} target="_blank" rel="noopener noreferrer">
          {dict.product.orderOnWhatsapp}
        </a>
      </Button>
    </div>
  );
}
