"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useCart } from "@/store/cart";
import { useCurrency } from "@/components/providers/currency-provider";
import { formatMoney } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";

export default function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  if (!isLocale(locale)) notFound();

  const { items, setQty, remove, subtotalUSD } = useCart();
  const { currency, lbpRate } = useCurrency();
  const subtotal = subtotalUSD();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-ink">Your cart is empty</h1>
        <p className="mt-3 text-ink-muted">Discover our handcrafted body oils.</p>
        <Button asChild className="mt-6">
          <Link href={`/${locale}/shop`}>Shop the collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl text-ink">Your cart</h1>

      <div className="mt-8 space-y-4">
        {items.map((i) => (
          <div key={i.productId} className="flex items-center gap-4 rounded-[var(--radius-card)] border border-blush-200 bg-sand-100 p-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-blush-100">
              {i.image ? (
                <Image src={i.image} alt={i.name} fill sizes="80px" className="object-contain p-1" />
              ) : (
                <span className="flex h-full items-center justify-center scent-script text-2xl text-accent/40">{i.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-ink">{i.name}</p>
              {i.size && <p className="text-xs text-ink-muted">{i.size}</p>}
              <p className="mt-1 text-sm text-ink-soft">{formatMoney(i.priceUSD, { currency, lbpRate })}</p>
            </div>
            <input
              type="number"
              min={1}
              value={i.quantity}
              onChange={(e) => setQty(i.productId, parseInt(e.target.value) || 1)}
              className="h-9 w-16 rounded-lg border border-blush-200 bg-sand-50 text-center"
              aria-label="Quantity"
            />
            <button onClick={() => remove(i.productId)} aria-label="Remove" className="text-ink-muted hover:text-danger">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[var(--radius-card)] border border-blush-200 bg-sand-100 p-6">
        <div className="flex justify-between text-lg font-medium">
          <span>Subtotal</span>
          <span>{formatMoney(subtotal, { currency, lbpRate })}</span>
        </div>
        <p className="mt-2 text-sm text-ink-muted">Delivery calculated at checkout.</p>
        <Button size="lg" variant="accent" className="mt-6 w-full" disabled>
          Checkout — coming soon
        </Button>
        <p className="mt-2 text-center text-xs text-ink-muted">
          Checkout (cash on delivery &amp; Whish) arrives in the next phase.
        </p>
      </div>
    </div>
  );
}
