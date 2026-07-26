"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { useCart } from "@/store/cart";
import { useCurrency } from "@/components/providers/currency-provider";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/i18n/dictionaries";

// Client header: mobile menu, cart badge, and USD/LBP toggle all need state.
export function Header({ locale, dict }: { locale: string; dict: Dictionary }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const count = useCart((s) => s.count());
  const { currency, toggle } = useCurrency();

  const nav = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/shop`, label: dict.nav.shop },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/ingredients`, label: dict.nav.ingredients },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  const isActive = (href: string) =>
    href === `/${locale}` ? pathname === href : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-blush-200 bg-sand-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Left: mobile menu toggle + desktop nav */}
        <div className="flex items-center gap-2">
          <button
            className="text-ink md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={dict.nav.home}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-accent",
                  isActive(item.href) ? "text-ink" : "text-ink-soft"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Logo locale={locale} size={56} />
        </div>

        {/* Right: currency + icons */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="rounded-full border border-blush-200 px-2.5 py-1 text-xs font-medium text-ink-soft transition-colors hover:bg-blush-100"
            aria-label={dict.common.currency}
          >
            {currency}
          </button>
          <button aria-label={dict.nav.search} className="hidden text-ink-soft hover:text-accent sm:block">
            <Search size={19} />
          </button>
          <Link href={`/${locale}/account`} aria-label={dict.nav.account} className="hidden text-ink-soft hover:text-accent sm:block">
            <User size={19} />
          </Link>
          <Link href={`/${locale}/cart`} aria-label={dict.nav.cart} className="relative text-ink hover:text-accent">
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -end-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-blush-200 bg-sand-50 px-4 py-3 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block py-2 text-sm",
                isActive(item.href) ? "text-ink" : "text-ink-soft"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
