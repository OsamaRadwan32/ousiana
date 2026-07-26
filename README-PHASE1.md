# Ousiana — Phase 1 (Storefront)

Phase 1 builds the real storefront on the Phase 0 foundation: homepage, shop with
category-tree navigation, product detail, the reusable ingredients section, cart,
and the About / Ingredients / Contact pages — all reading live data from Postgres.

> Read `README.md` (Phase 0) first for the design-system and data-model rationale.

## Run

```bash
npm install
cp .env.example .env          # DATABASE_URL (Neon direct) + AUTH_SECRET
npm run db:push
npm run db:seed
npm run dev                   # → /en
```

- `/en`, `/ar` — **the real homepage** (hero, signature scents, trust bar, ingredients)
- `/en/shop` — catalogue + 3-level category tree (`?category=slug` filters)
- `/en/products/pearl-bloom` — product detail
- `/en/cart` — cart (checkout arrives in Phase 2)
- `/en/preview` — the Phase 0 design-system reference (kept for review)

## What Phase 1 adds

| Area | Detail |
|---|---|
| **Homepage** | Hero with the three bottle cutouts composed on a podium; feature icons; trust bar; signature-scent cards; brand story; ingredients feature |
| **Shop** | Recursive category tree (depth-agnostic, admin caps at 3), product grid, `?category` filter |
| **Product detail** | Image, price (sale-aware), stock/low-stock state, add-to-cart, WhatsApp order, per-scent ingredients section |
| **Ingredients section** | Rebuilt in code from `Ingredient` DATA (not the baked-in marketing images) so it themes per scent and is bilingual-ready |
| **Cart** | Zustand + localStorage; add / adjust / remove; live currency; checkout deferred to Phase 2 |
| **Currency** | USD/LBP toggle in the header, persisted; rate always from the server (a stale choice can't misprice) |
| **Data layer** | `lib/catalog.ts` + `lib/settings.ts` map Prisma rows → plain view-models; components never see `Decimal` |

## Product images

The three bottle shots were background-removed (flood-fill from the edges, so the
white dropper caps are preserved) and saved as transparent PNGs in
`public/products/`. The logo is in `public/ousiana-logo.png`.

These are **committed to the repo for now**. In Phase 4 they move to Cloudflare R2
and the product `images[]` fields point at R2 URLs instead. The seed currently
leaves `images` empty, so **cards fall back to a monogram until you either point
the seed at these files or upload via the admin.** To use the committed files now,
set each product's `images` to e.g. `["/products/pearl-bloom.png"]`.

## Rendering

Data pages use ISR (`export const revalidate = 120`) so the owner's admin edits
appear within ~2 minutes without a redeploy. Product detail is dynamic.

## Notes / carried-forward

- ⚠️ **Arabic strings** remain machine-drafted placeholders in `ar.json` (deferred by the client). The layout is RTL-safe throughout; only the wording needs a native pass.
- ⚠️ **Prices** are $25 placeholders; **cost prices** null (profit stays empty) — pending the client's spreadsheet.
- **Checkout, Google sign-in, admin panel** are Phases 2–4.
- The **green CTA** question from the mockup is still open — primary button is charcoal (one token to change).

## Build verification note

This project was built and verified with `next build` (typecheck + prerender) and
`npm run test:money` (15/15). Because the Prisma engine host is firewalled in the
build sandbox, the sandbox build used a temporary type-shim for `@prisma/client`;
it has been removed. On your machine, `npm install` runs `prisma generate` normally
and `npm run build` uses the real client.
