import { Truck, ShieldCheck, BadgeCheck } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";

export function TrustBar({ dict }: { dict: Dictionary }) {
  const items = [
    { icon: Truck, title: dict.trust.deliveryTitle, body: dict.trust.deliveryBody },
    { icon: ShieldCheck, title: dict.trust.paymentTitle, body: dict.trust.paymentBody },
    { icon: BadgeCheck, title: dict.trust.satisfactionTitle, body: dict.trust.satisfactionBody },
  ];
  return (
    <div className="bg-blush-100">
      <div className="mx-auto grid max-w-5xl gap-4 px-4 py-5 sm:grid-cols-3">
        {items.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex items-center justify-center gap-3 text-center sm:text-start">
            <Icon size={26} className="shrink-0 text-ink-soft" aria-hidden />
            <span>
              <span className="block text-sm font-medium text-ink">{title}</span>
              <span className="block text-xs text-ink-muted">{body}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
