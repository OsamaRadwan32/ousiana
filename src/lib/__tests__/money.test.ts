// Money tests. Deliberately dependency-free: run with `npm run test:money`.
//
// These cover the arithmetic that turns into real money — currency conversion,
// LBP rounding, sale pricing, and order references. If you change money.ts,
// run this first.
//
// Regression guarded here: ar-LB groups thousands with DOTS ("2.238.000"),
// which misreads as a decimal. We force en-US number formatting in both
// locales so only the currency label changes.

import { formatMoney, effectivePrice, isOnSale, discountPercent, convert, generateOrderNumber } from "../money";

let pass = 0, fail = 0;
const eq = (label: string, got: unknown, want: unknown) => {
  const ok = String(got) === String(want);
  ok ? pass++ : fail++;
  console.log(`${ok ? "✓" : "✗"} ${label}\n    got:  ${got}${ok ? "" : `\n    want: ${want}`}`);
};

const RATE = 89500;

// --- conversion + formatting -----------------------------------------------
eq("USD display", formatMoney(25, { currency: "USD", lbpRate: RATE }), "$25.00");
eq("USD keeps cents", formatMoney(18.5, { currency: "USD", lbpRate: RATE }), "$18.50");
eq("LBP converts + rounds to nearest 1000",
   formatMoney(25, { currency: "LBP", lbpRate: RATE }), "2,238,000 LBP"); // 25*89500=2,237,500 -> 2,238,000
eq("LBP arabic locale uses latin digits + ل.ل.",
   formatMoney(25, { currency: "LBP", lbpRate: RATE, locale: "ar" }), "2,238,000 ل.ل.");
eq("convert() is identity for USD", convert(25, "USD", RATE), 25);
eq("convert() applies rate for LBP", convert(2, "LBP", RATE), 179000);

// --- sale pricing ----------------------------------------------------------
eq("effectivePrice: no sale", effectivePrice(25, null), 25);
eq("effectivePrice: with sale", effectivePrice(25, 18), 18);
eq("effectivePrice: ignores sale >= price", effectivePrice(25, 30), 25);
eq("isOnSale false when null", isOnSale(25, null), false);
eq("isOnSale true when lower", isOnSale(25, 18), true);
eq("discountPercent", discountPercent(25, 18), 28); // (25-18)/25 = 28%
eq("discountPercent null when not on sale", discountPercent(25, null), "null");

// --- order numbers ---------------------------------------------------------
eq("order number format", generateOrderNumber(7, new Date("2026-08-03")), "OUS-2608-0007");
eq("order number pads to 4", generateOrderNumber(1234, new Date("2026-12-01")), "OUS-2612-1234");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
