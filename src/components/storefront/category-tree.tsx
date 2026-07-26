import Link from "next/link";
import type { CategoryNode } from "@/types/catalog";
import { localized, type Locale } from "@/i18n/config";

// Recursive category tree for the shop sidebar. Renders up to the 3 levels the
// admin allows, but is depth-agnostic.
function Branch({ node, locale, activeSlug, depth }: { node: CategoryNode; locale: Locale; activeSlug?: string; depth: number }) {
  const name = localized(node, "name", locale);
  const active = node.slug === activeSlug;
  return (
    <li>
      <Link
        href={`/${locale}/shop?category=${node.slug}`}
        className={`flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-blush-100 ${active ? "bg-blush-100 font-medium text-ink" : "text-ink-soft"}`}
        style={{ paddingInlineStart: `${depth * 12 + 8}px` }}
      >
        <span>{name}</span>
        <span className="text-xs text-ink-muted">{node.productCount}</span>
      </Link>
      {node.children.length > 0 && (
        <ul className="mt-0.5">
          {node.children.map((c) => (
            <Branch key={c.id} node={c} locale={locale} activeSlug={activeSlug} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function CategoryTree({ tree, locale, activeSlug, allLabel }: { tree: CategoryNode[]; locale: Locale; activeSlug?: string; allLabel: string }) {
  return (
    <ul className="space-y-0.5">
      <li>
        <Link
          href={`/${locale}/shop`}
          className={`block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-blush-100 ${!activeSlug ? "bg-blush-100 font-medium text-ink" : "text-ink-soft"}`}
        >
          {allLabel}
        </Link>
      </li>
      {tree.map((node) => (
        <Branch key={node.id} node={node} locale={locale} activeSlug={activeSlug} depth={0} />
      ))}
    </ul>
  );
}
