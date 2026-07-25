// Ousiana — brand configuration.
//
// This file plus src/app/globals.css control the entire identity. Re-skinning
// for another client should mean editing these two and nothing else.
//
// NOTE: values marked TODO are placeholders pending client handover.

export const siteConfig = {
  name: "Ousiana",
  // The logo ring's own words. Used as the tagline throughout.
  tagline: "Scents from Nature",
  motto: "Nourish. Glow. Bloom.",

  description:
    "Natural body oils, handmade in Lebanon, crafted to hydrate your skin and uplift your senses.",

  // Announcement strip across the top of every page.
  promises: ["Natural Ingredients", "Handmade with Love", "Made in Lebanon", "Cruelty Free"],

  contact: {
    // TODO: client to provide. International format, no "+" or spaces.
    whatsappNumber: "9617XXXXXXX",
    email: "hello@ousiana.com", // TODO: confirm on domain handover
    instagram: "https://instagram.com/ousiana", // TODO: confirm
  },

  // Currency display. USD is the BASE: all prices are stored in USD and
  // converted for display. The owner overrides defaultCurrency and the LBP
  // rate at runtime from admin -> Settings; these are only fallbacks used
  // before StoreSettings is seeded.
  currency: {
    base: "USD",
    fallbackDefault: "USD" as "USD" | "LBP",
    fallbackLbpRate: 89500,
  },

  payments: {
    cashOnDelivery: true,
    whish: {
      // Shown as a checkout option, but confirmed manually by the owner.
      // The automated Collect/OTP API needs a merchant agreement with Whish —
      // out of scope until that's negotiated. See lib/payments/whish.ts.
      enabled: true,
      automated: false,
      accountName: "Ousiana", // TODO: client to provide
      phoneNumber: "9617XXXXXXX", // TODO: client to provide
    },
  },

  // The three launch scents. `theme` maps to the .theme-* classes in
  // globals.css; `slug` must match the seeded product slugs.
  scents: [
    { key: "pearl", slug: "pearl-bloom", name: "Pearl", theme: "theme-pearl" },
    { key: "coral", slug: "coral-bloom", name: "Coral", theme: "theme-coral" },
    { key: "ocean", slug: "ocean-bloom", name: "Ocean", theme: "theme-ocean" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
