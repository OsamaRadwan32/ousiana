// Money handling.
//
// THE RULE: USD is the base. Every price in the database is USD. LBP is a
// DISPLAY conversion applied at render time using the owner's rate.
//
// Why not store both? Because the rate moves. If we stored LBP prices, every
// rate change would need a catalogue-wide rewrite, and historical orders would
// drift. Instead, orders snapshot `currency` + `fxRate` at checkout, so what a
// customer was charged in June stays true after a July rate change.

import type { Locale } from "@/i18n/config";

export type Currency = "USD" | "LBP";

/** Convert a USD amount to the target currency at the given rate. */
export function convert(usdAmount: number, currency: Currency, lbpRate: number): number {
  return currency === "USD" ? usdAmount : usdAmount * lbpRate;
}

/**
 * Format a USD amount for display.
 *
 * LBP is rounded to the nearest 1,000 — Lebanese pricing doesn't use minor
 * units and unrounded figures like "1,342,847 L.L." read as machine output.
 */
export function formatMoney(
  usdAmount: number,
  opts: { currency: Currency; lbpRate: number; locale?: Locale }
): string {
  const { currency, lbpRate, locale = "en" } = opts;
  const value = convert(usdAmount, currency, lbpRate);

  // Numbers are ALWAYS formatted with en-US, in both languages. Two reasons:
  //   1. ar-LB groups thousands with dots ("2.238.000"), which reads as a
  //      decimal to anyone scanning quickly. Lebanese shops use commas.
  //   2. Arabic-Indic digits are correct in some contexts, but Lebanese
  //      e-commerce overwhelmingly prints Latin digits for prices.
  // Only the currency LABEL changes per locale — never the digits.
  // Revisit only if the client explicitly asks.
  const NUMBER_LOCALE = "en-US";

  if (currency === "LBP") {
    // LBP has no minor unit in practice; unrounded figures read as machine
    // output. Round to the nearest 1,000.
    const rounded = Math.round(value / 1000) * 1000;
    const formatted = new Intl.NumberFormat(NUMBER_LOCALE, {
      maximumFractionDigits: 0,
    }).format(rounded);
    return locale === "ar" ? `${formatted} ل.ل.` : `${formatted} LBP`;
  }

  return new Intl.NumberFormat(NUMBER_LOCALE, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

/** The price a customer actually pays: sale price when set, else the regular price. */
export function effectivePrice(price: number, salePrice?: number | null): number {
  return salePrice != null && salePrice < price ? salePrice : price;
}

export function isOnSale(price: number, salePrice?: number | null): boolean {
  return salePrice != null && salePrice < price;
}

/** Discount percentage for a sale badge, e.g. 28 for "-28%". */
export function discountPercent(price: number, salePrice?: number | null): number | null {
  if (!isOnSale(price, salePrice)) return null;
  return Math.round(((price - salePrice!) / price) * 100);
}

/**
 * Human-friendly order reference: OUS-YYMM-NNNN.
 * Sequence is supplied by the caller inside the order transaction.
 */
export function generateOrderNumber(sequence: number, at: Date = new Date()): string {
  const yy = String(at.getFullYear()).slice(-2);
  const mm = String(at.getMonth() + 1).padStart(2, "0");
  return `OUS-${yy}${mm}-${String(sequence).padStart(4, "0")}`;
}
