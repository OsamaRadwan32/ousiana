// Storefront view-models. The data layer (lib/catalog, lib/settings) maps
// Prisma rows into these plain shapes so components never touch Decimal,
// relations, or DB nullability quirks. Prices are always plain USD numbers.

export type AccentTheme = "PEARL" | "CORAL" | "OCEAN" | "NEUTRAL";
export type Currency = "USD" | "LBP";

// Maps an accent theme to its .theme-* wrapper class (see globals.css).
export const themeClass: Record<AccentTheme, string> = {
  PEARL: "theme-pearl",
  CORAL: "theme-coral",
  OCEAN: "theme-ocean",
  NEUTRAL: "theme-neutral",
};

export type IngredientView = {
  id: string;
  nameEn: string;
  nameAr: string | null;
  benefitEn: string;
  benefitAr: string | null;
  icon: string | null;
};

export type ProductView = {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  price: number; // regular price, USD
  salePrice: number | null; // USD, when on sale
  scent: string | null;
  size: string | null;
  accentTheme: AccentTheme;
  images: string[];
  stock: number;
  isFeatured: boolean;
  categoryId: string;
  ingredients: IngredientView[];
};

export type CategoryNode = {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  children: CategoryNode[];
  productCount: number; // direct products in this category
};

export type StoreSettingsView = {
  defaultCurrency: Currency;
  lbpRate: number;
  deliveryFee: number;
  lowStockAlertAt: number;
};
