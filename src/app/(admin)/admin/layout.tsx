import type { Metadata } from "next";
import { Jost, Karla } from "next/font/google";
import "../../globals.css";

// The admin panel's own root layout. It is deliberately English-only and LTR:
// the owner is one person, and translating an internal tool she uses daily
// would be effort with no customer-facing payoff.

const jost = Jost({ subsets: ["latin"], variable: "--font-jost", weight: ["300", "400", "500", "600"], display: "swap" });
const karla = Karla({ subsets: ["latin"], variable: "--font-karla", weight: ["400", "500", "600"], display: "swap" });

export const metadata: Metadata = {
  title: "Ousiana Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${jost.variable} ${karla.variable}`}>
      <body>{children}</body>
    </html>
  );
}
