import { Leaf, Droplet, Sparkles, Heart } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";

// The four little product-promise icons under the hero.
export function FeatureIcons({ dict }: { dict: Dictionary }) {
  const features = [
    { icon: Leaf, label: "Natural Ingredients" },
    { icon: Droplet, label: "Deep Hydration" },
    { icon: Sparkles, label: "Beautiful Scents" },
    { icon: Heart, label: "Made with Love" },
  ];
  void dict;
  return (
    <div className="mx-auto max-w-3xl px-4">
      <div className="grid grid-cols-4 gap-3 border-y border-blush-200 py-6">
        {features.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blush-100 text-accent">
              <Icon size={20} />
            </span>
            <span className="text-xs text-ink-soft">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
