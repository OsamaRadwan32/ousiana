import {
  Leaf, Droplet, Nut, Cherry, Flower, Flower2, Sparkles, Heart,
  Waves, HandHeart, type LucideIcon,
} from "lucide-react";

// Maps the `icon` string stored on ingredients/features to a component.
// Falls back to Leaf so an unknown key never breaks the render.
const map: Record<string, LucideIcon> = {
  leaf: Leaf, droplet: Droplet, nut: Nut, cherry: Cherry,
  flower: Flower, "flower-2": Flower2, sparkles: Sparkles,
  heart: Heart, waves: Waves, "hand-heart": HandHeart,
};

export function iconFor(key: string | null | undefined): LucideIcon {
  return (key && map[key]) || Leaf;
}
