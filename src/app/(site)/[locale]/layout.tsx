import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Jost, Karla, Sacramento, Tajawal } from "next/font/google";
import { siteConfig } from "@/config/site";
import { isLocale, localeDirection, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getStoreSettings } from "@/lib/settings";
import { CurrencyProvider } from "@/components/providers/currency-provider";
import { AnnouncementBar } from "@/components/storefront/announcement-bar";
import { Header } from "@/components/storefront/header";
import { Footer } from "@/components/storefront/footer";
import { WhatsAppFab } from "@/components/storefront/whatsapp-fab";
import "../../globals.css";

const jost = Jost({ subsets: ["latin"], variable: "--font-jost", weight: ["300", "400", "500", "600"], display: "swap" });
const karla = Karla({ subsets: ["latin"], variable: "--font-karla", weight: ["400", "500", "600"], display: "swap" });
const sacramento = Sacramento({ subsets: ["latin"], variable: "--font-sacramento", weight: ["400"], display: "swap" });
const tajawal = Tajawal({ subsets: ["arabic"], variable: "--font-tajawal", weight: ["400", "500", "700"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Storefront ROOT layout — owns <html> because lang/dir depend on the locale.
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
  const [dict, settings] = await Promise.all([
    getDictionary(locale as Locale),
    getStoreSettings(),
  ]);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${jost.variable} ${karla.variable} ${sacramento.variable} ${tajawal.variable}`}
    >
      <body>
        <CurrencyProvider defaultCurrency={settings.defaultCurrency} lbpRate={settings.lbpRate}>
          <AnnouncementBar />
          <Header locale={locale} dict={dict} />
          <main className="min-h-[60vh]">{children}</main>
          <Footer locale={locale} dict={dict} />
          <WhatsAppFab />
        </CurrencyProvider>
      </body>
    </html>
  );
}
