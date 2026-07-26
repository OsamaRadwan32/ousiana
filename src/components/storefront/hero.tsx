import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionaries";

// Composes the three bottle cutouts on a soft podium beside the headline —
// our own take on the mockup's three-bottles-on-stone hero, built from the
// individual product shots rather than a single composed photo.
const bottles = [
  { src: "/products/pearl-bloom.png", name: "Pearl", theme: "theme-pearl", z: "z-10", scale: "h-[78%]" },
  { src: "/products/coral-bloom.png", name: "Coral", theme: "theme-coral", z: "z-20", scale: "h-[92%]" },
  { src: "/products/ocean-bloom.png", name: "Ocean", theme: "theme-ocean", z: "z-10", scale: "h-[78%]" },
];

export function Hero({ locale, dict }: { locale: string; dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:py-16">
        {/* Copy */}
        <div className="order-2 text-center md:order-1 md:text-start">
          <h1 className="font-display text-4xl leading-[1.05] text-ink sm:text-5xl">
            {dict.home.heroTitle}
          </h1>
          <p className="scent-script mt-2 text-4xl text-coral sm:text-5xl">{dict.home.heroMotto}</p>
          <p className="mx-auto mt-5 max-w-md text-ink-soft md:mx-0">{dict.home.heroBody}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start">
            <Button asChild size="lg">
              <Link href={`/${locale}/shop`}>{dict.home.heroCta}</Link>
            </Button>
          </div>
        </div>

        {/* Bottles on a podium */}
        <div className="order-1 md:order-2">
          <div className="relative mx-auto flex aspect-square max-w-md items-end justify-center">
            {/* soft podium */}
            <div className="absolute inset-x-4 bottom-[12%] top-[14%] rounded-[36%] bg-gradient-to-b from-blush-100 to-sand-200" />
            <div className="absolute inset-x-10 bottom-[10%] h-6 rounded-[50%] bg-blush-200/70 blur-md" />
            {/* bottles */}
            <div className="relative flex h-[86%] w-full items-end justify-center gap-1 sm:gap-2">
              {bottles.map((b) => (
                <div key={b.name} className={`relative ${b.z} ${b.scale} flex-1`}>
                  <Image
                    src={b.src}
                    alt={`${b.name} Bloom`}
                    fill
                    priority
                    sizes="(max-width: 768px) 30vw, 15vw"
                    className="object-contain object-bottom drop-shadow-[0_12px_16px_rgba(0,0,0,0.10)]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
