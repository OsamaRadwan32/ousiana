import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Logo({ locale, size = 64 }: { locale: string; size?: number }) {
  return (
    <Link href={`/${locale}`} aria-label={siteConfig.name} className="inline-flex items-center">
      <Image
        src="/ousiana-logo.png"
        alt={siteConfig.name}
        width={size}
        height={Math.round(size * 1.09)}
        priority
      />
    </Link>
  );
}
