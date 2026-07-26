import { cache } from "react";
import { db } from "@/lib/db";
import type {
  ProductView,
  CategoryNode,
  IngredientView,
  AccentTheme,
} from "@/types/catalog";

// --- mappers ---------------------------------------------------------------

type ProductRow = {
  id: string; slug: string; nameEn: string; nameAr: string | null;
  descriptionEn: string | null; descriptionAr: string | null;
  price: unknown; salePrice: unknown; scent: string | null; size: string | null;
  accentTheme: string; images: string[]; stock: number; isFeatured: boolean;
  categoryId: string;
  ingredients?: Array<{
    id: string; nameEn: string; nameAr: string | null;
    benefitEn: string; benefitAr: string | null; icon: string | null;
  }>;
};

function toNumber(d: unknown): number {
  // Prisma Decimal -> number. Decimal has toString(); Number handles it.
  return d == null ? 0 : Number(d as { toString(): string });
}

function mapIngredient(i: NonNullable<ProductRow["ingredients"]>[number]): IngredientView {
  return {
    id: i.id, nameEn: i.nameEn, nameAr: i.nameAr,
    benefitEn: i.benefitEn, benefitAr: i.benefitAr, icon: i.icon,
  };
}

function mapProduct(p: ProductRow): ProductView {
  return {
    id: p.id, slug: p.slug, nameEn: p.nameEn, nameAr: p.nameAr,
    descriptionEn: p.descriptionEn, descriptionAr: p.descriptionAr,
    price: toNumber(p.price),
    salePrice: p.salePrice == null ? null : toNumber(p.salePrice),
    scent: p.scent, size: p.size,
    accentTheme: (p.accentTheme as AccentTheme) ?? "NEUTRAL",
    images: p.images ?? [],
    stock: p.stock, isFeatured: p.isFeatured, categoryId: p.categoryId,
    ingredients: (p.ingredients ?? []).map(mapIngredient),
  };
}

const productInclude = { ingredients: { orderBy: { sortOrder: "asc" as const } } };

// --- queries ---------------------------------------------------------------

export const getFeaturedProducts = cache(async (): Promise<ProductView[]> => {
  const rows = await db.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: 6,
  });
  return rows.map(mapProduct);
});

export const getAllProducts = cache(async (): Promise<ProductView[]> => {
  const rows = await db.product.findMany({
    where: { isActive: true },
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapProduct);
});

export const getProductBySlug = cache(async (slug: string): Promise<ProductView | null> => {
  const p = await db.product.findUnique({ where: { slug }, include: productInclude });
  if (!p || !p.isActive) return null;
  return mapProduct(p as ProductRow);
});

export const getProductsByCategory = cache(async (categoryId: string): Promise<ProductView[]> => {
  const rows = await db.product.findMany({
    where: { isActive: true, categoryId },
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapProduct);
});

// Build the category tree in memory. At 50-100 products this is one cheap
// query; no recursive SQL needed.
export const getCategoryTree = cache(async (): Promise<CategoryNode[]> => {
  const cats = await db.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });

  const nodes = new Map<string, CategoryNode & { parentId: string | null }>();
  for (const c of cats) {
    nodes.set(c.id, {
      id: c.id, slug: c.slug, nameEn: c.nameEn, nameAr: c.nameAr,
      descriptionEn: c.descriptionEn, descriptionAr: c.descriptionAr,
      children: [], productCount: c._count.products, parentId: c.parentId,
    });
  }

  const roots: CategoryNode[] = [];
  for (const node of nodes.values()) {
    if (node.parentId && nodes.has(node.parentId)) {
      nodes.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
});

export const getCategoryBySlug = cache(async (slug: string) => {
  const c = await db.category.findUnique({
    where: { slug },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });
  if (!c || !c.isActive) return null;
  return {
    id: c.id, slug: c.slug, nameEn: c.nameEn, nameAr: c.nameAr,
    descriptionEn: c.descriptionEn, descriptionAr: c.descriptionAr,
  };
});
