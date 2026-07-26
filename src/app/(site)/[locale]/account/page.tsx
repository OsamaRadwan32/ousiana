import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export const metadata = { title: "Account" };

// Google sign-in + order history arrive in Phase 3. Guest checkout is the
// primary flow, so this is intentionally a placeholder for now.
export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-display text-3xl text-ink">{dict.nav.account}</h1>
      <p className="mt-3 text-ink-muted">Sign-in and order history are coming soon.</p>
    </div>
  );
}
