"use client";

import { useCurrency } from "@/components/providers/currency-provider";
import { formatMoney, effectivePrice, isOnSale } from "@/lib/money";
import { cn } from "@/lib/utils";

// Renders a price in the customer's chosen currency. When a sale price is
// present, shows it with the regular price struck through.
export function Price({
  price,
  salePrice,
  className,
  size = "md",
}: {
  price: number;
  salePrice?: number | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const { currency, lbpRate } = useCurrency();
  const onSale = isOnSale(price, salePrice);
  const effective = effectivePrice(price, salePrice);
  const sizes = { sm: "text-sm", md: "text-base", lg: "text-xl" };

  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className={cn("font-medium text-ink", sizes[size])}>
        {formatMoney(effective, { currency, lbpRate })}
      </span>
      {onSale && (
        <span className="text-sm text-ink-muted line-through">
          {formatMoney(price, { currency, lbpRate })}
        </span>
      )}
    </span>
  );
}
