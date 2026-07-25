import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Jost, Karla, Sacramento, Tajawal } from "next/font/google";
import { siteConfig } from "@/config/site";
import { isLocale, localeDirection, locales, type Locale } from "@/i18n/config";
import "../../globals.css";

// Type roles, taken from the brand's own materials rather than defaults:
//  - Jost:       geometric sans. Echoes the letterspaced caps of the logo ring
//                and the "BLOOM" lockup on every bottle.
//  - Sacramento: signature script. Mirrors the handwritten scent name on the
//                labels. Used ONLY for scent names — the restraint is the point.
//  - Karla:      humanist body face, quiet enough to sit under the above.
//  - Tajawal:    geometric Arabic; sits beside Jost without a style clash.

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  weight: ["400", "500", "600"],
  display: "swap",
});

const sacramento = Sacramento({
  subsets: ["latin"],
  variable: "--font-sacramento",
  weight: ["400"],
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  variable: "--font-tajawal",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

// Pre-render both locales at build time.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// This is the storefront's ROOT layout — it owns <html>, because lang and dir
// can't be known any higher up. The admin panel has its own root layout under
// (admin); Next.js supports multiple roots via top-level route groups.
export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dir = localeDirection[locale as Locale];

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${jost.variable} ${karla.variable} ${sacramento.variable} ${tajawal.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
