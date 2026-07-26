"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Currency } from "@/types/catalog";

type CurrencyState = {
  currency: Currency;
  lbpRate: number;
  setCurrency: (c: Currency) => void;
  toggle: () => void;
};

const CurrencyContext = createContext<CurrencyState | null>(null);
const STORAGE_KEY = "ousiana-currency";

// Seeded from server StoreSettings (default currency + rate). The customer's
// choice persists in localStorage; the rate always comes from the server so a
// stale localStorage value can never misprice anything.
export function CurrencyProvider({
  defaultCurrency,
  lbpRate,
  children,
}: {
  defaultCurrency: Currency;
  lbpRate: number;
  children: React.ReactNode;
}) {
  const [currency, setCurrencyState] = useState<Currency>(defaultCurrency);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "USD" || saved === "LBP") setCurrencyState(saved);
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    window.localStorage.setItem(STORAGE_KEY, c);
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, lbpRate, setCurrency, toggle: () => setCurrency(currency === "USD" ? "LBP" : "USD") }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyState {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
