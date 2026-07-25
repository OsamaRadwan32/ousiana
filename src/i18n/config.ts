// Locale configuration. Kept dependency-free: at two locales, a routing
// library would be more machinery than the problem deserves.

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// Text direction per locale. Consumed by <html dir> and by the RTL rules in
// globals.css. This is the single source of truth for direction.
export const localeDirection: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
};

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// Pick the field for the current locale, falling back to English when a
// translation is missing. Arabic content arrives late in most projects — this
// keeps the store rendering rather than showing blanks.
export function localized<T extends Record<string, unknown>>(
  record: T,
  field: string,
  locale: Locale
): string {
  const suffix = locale === "ar" ? "Ar" : "En";
  const value = record[`${field}${suffix}`] ?? record[`${field}En`];
  return typeof value === "string" ? value : "";
}
