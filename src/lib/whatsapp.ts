import { siteConfig } from "@/config/site";

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${siteConfig.contact.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function whatsappProductMessage(productName: string, url?: string): string {
  return [`Hi ${siteConfig.name}! I'd like to order: ${productName}.`, url]
    .filter(Boolean)
    .join("\n");
}
