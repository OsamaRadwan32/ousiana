"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Cart line. priceUSD is the effective (already sale-adjusted) USD price at the
// time of adding; currency conversion happens at display time. Checkout in
// Phase 2 re-validates prices server-side, so a stale cart can't set the price.
export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  priceUSD: number;
  image?: string;
  size?: string;
  quantity: number;
};

type CartState = {
  items: CartLine[];
  add: (line: Omit<CartLine, "quantity">, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  count: () => number;
  subtotalUSD: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (line, qty = 1) =>
        set((s) => {
          const found = s.items.find((i) => i.productId === line.productId);
          if (found) {
            return {
              items: s.items.map((i) =>
                i.productId === line.productId ? { ...i, quantity: i.quantity + qty } : i
              ),
            };
          }
          return { items: [...s.items, { ...line, quantity: qty }] };
        }),
      setQty: (productId, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.productId !== productId)
              : s.items.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i)),
        })),
      remove: (productId) => set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.quantity, 0),
      subtotalUSD: () => get().items.reduce((n, i) => n + i.priceUSD * i.quantity, 0),
    }),
    { name: "ousiana-cart" }
  )
);
