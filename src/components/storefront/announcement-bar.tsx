import { Leaf, Heart, MapPin, Rabbit } from "lucide-react";
import { siteConfig } from "@/config/site";

const icons = [Leaf, Heart, MapPin, Rabbit];

// The top strip: Natural Ingredients · Handmade with Love · Made in Lebanon · Cruelty Free
export function AnnouncementBar() {
  return (
    <div className="bg-blush-100">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-x-8 gap-y-1 overflow-hidden px-4 py-2 text-xs text-ink-soft sm:justify-between">
        {siteConfig.promises.map((promise, i) => {
          const Icon = icons[i] ?? Leaf;
          return (
            <span key={promise} className="flex items-center gap-1.5 whitespace-nowrap">
              <Icon size={14} className="text-accent" aria-hidden />
              <span className={i > 1 ? "hidden sm:inline" : ""}>{promise}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
