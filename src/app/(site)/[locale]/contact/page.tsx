import { notFound } from "next/navigation";
import { MessageCircle, Instagram, Mail } from "lucide-react";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { siteConfig } from "@/config/site";
import { whatsappLink } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Contact" };

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="font-display text-4xl text-ink">{dict.nav.contact}</h1>
      <p className="mt-3 text-ink-soft">
        Questions about a product, an order, or a custom request? We&apos;d love to hear from you.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <a href={whatsappLink("Hi Ousiana!")} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 rounded-[var(--radius-card)] border border-blush-200 bg-sand-100 p-6 hover:bg-blush-100">
          <MessageCircle className="text-[#25D366]" />
          <span className="text-sm font-medium">WhatsApp</span>
        </a>
        <a href={siteConfig.contact.instagram} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 rounded-[var(--radius-card)] border border-blush-200 bg-sand-100 p-6 hover:bg-blush-100">
          <Instagram className="text-coral" />
          <span className="text-sm font-medium">Instagram</span>
        </a>
        <a href={`mailto:${siteConfig.contact.email}`} className="flex flex-col items-center gap-2 rounded-[var(--radius-card)] border border-blush-200 bg-sand-100 p-6 hover:bg-blush-100">
          <Mail className="text-ocean" />
          <span className="text-sm font-medium">Email</span>
        </a>
      </div>

      <div className="mt-10">
        <Button asChild variant="whatsapp" size="lg">
          <a href={whatsappLink("Hi Ousiana! I'd like to place an order.")} target="_blank" rel="noopener noreferrer">
            {dict.product.orderOnWhatsapp}
          </a>
        </Button>
      </div>
    </div>
  );
}
