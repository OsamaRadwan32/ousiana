import { cache } from "react";
import { db } from "@/lib/db";
import { siteConfig } from "@/config/site";
import type { StoreSettingsView, Currency } from "@/types/catalog";

// Cached per-request so multiple components can read settings without
// repeat queries. Falls back to config defaults before the row is seeded.
export const getStoreSettings = cache(async (): Promise<StoreSettingsView> => {
  const s = await db.storeSettings.findUnique({ where: { id: "singleton" } });
  if (!s) {
    return {
      defaultCurrency: siteConfig.currency.fallbackDefault as Currency,
      lbpRate: siteConfig.currency.fallbackLbpRate,
      deliveryFee: 0,
      lowStockAlertAt: 5,
    };
  }
  return {
    defaultCurrency: s.defaultCurrency as Currency,
    lbpRate: Number(s.lbpRate),
    deliveryFee: Number(s.deliveryFee),
    lowStockAlertAt: s.lowStockAlertAt,
  };
});
