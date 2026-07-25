# Ousiana — Scents from Nature

E-commerce storefront and admin panel for a Lebanese natural body-oil brand.
Next.js 15 · Prisma · PostgreSQL · Tailwind v4 · bilingual EN/AR · USD/LBP.

**Status: Phase 0 complete** — foundation, design system, i18n/RTL baseline, and data model. The storefront itself lands in Phase 1.

---

## Run it

```bash
npm install                 # if prisma generate fails, see Troubleshooting
cp .env.example .env        # set DATABASE_URL + AUTH_SECRET
npm run db:push             # create the schema
npm run db:seed             # store settings, categories, 3 Blooms, admin, coupon
npm run dev
```

- `http://localhost:3000` → redirects to `/en`
- `/en` and `/ar` → **the Phase 0 design-system preview** (not the homepage)
- `/admin` → placeholder until Phase 4

```bash
npm run test:money          # the money arithmetic — run this after touching money.ts
```

---

## What Phase 0 delivers

| | |
|---|---|
| **Design tokens** | Client palette + derived ink/accents + three scent themes |
| **Type system** | Jost / Sacramento / Karla / Tajawal, with the label lockup |
| **i18n** | EN/AR routing, dictionaries, `dir` switching, Arabic font swap |
| **RTL baseline** | Logical properties throughout — no mirrored stylesheet |
| **Money** | USD base, LBP display conversion, sale pricing, order refs, **tested** |
| **Data model** | Full schema: nested categories, cost price, coupons, Auth.js, snapshots |
| **Seed** | Settings, 3-level category tree, three Blooms with ingredients, admin, coupon |

---

## Design decisions (and why)

**Surfaces are the client's; ink and accents are derived.** The palette PDF supplies five near-identical off-whites and nothing else — no text colour, no accent, no button. Those are derived from the brand's own materials: ink is the logo's charcoal; Pearl/Coral/Ocean are sampled from the bottle labels and darkened for legible contrast. **Never invent a new background** — pick from the five in `globals.css`.

**The primary button is charcoal, not a colour.** Each Bloom already owns an accent. A coloured primary would be a fourth accent belonging to nothing in the brand. *(Open question for the client: the homepage mockup had a green CTA — deliberate, or an artifact?)*

**Type comes from the bottles, not a template.** The labels pair a signature script scent name with geometric caps ("*Ocean* / **BLOOM**") and the logo ring is letterspaced geometric caps. So: Jost for display, Sacramento for scent names **only**, Karla for body, Tajawal for Arabic. Sacramento anywhere but a scent name is a bug.

**Themes are contextual, not props.** `.theme-coral` on any wrapper retints everything inside via `var(--accent)`. Components never take a colour prop.

**USD is the base currency; LBP is a display conversion.** Storing LBP would mean rewriting the catalogue on every rate change and silently re-pricing past orders. Orders snapshot `currency` + `fxRate` so history stays true.

**Numbers always format en-US, in both languages.** `ar-LB` groups thousands with dots (`2.238.000`), which misreads as a decimal. Only the currency label changes per locale. Guarded by a test.

**RTL is built in, not retrofitted.** Use logical properties — `ms-`/`me-`/`ps-`/`pe-`/`start-`/`end-`/`text-start` — **never** `ml-`/`mr-`/`left-`/`right-`. Retrofitting RTL onto a finished LTR layout is a rewrite. Add `.rtl-flip` only to direction-encoding glyphs (arrows, chevrons) — never logos, photos, or numbers.

**`costPrice` is nullable and seeded null.** Profit reporting counts only products with a real cost. Empty beats invented.

**The admin is English-only.** One person uses it daily; translating an internal tool has no customer-facing payoff.

---

## Structure

```
prisma/
  schema.prisma       # data model — read the header comment first
  seed.ts             # settings, category tree, 3 Blooms, admin, coupon
src/
  config/site.ts      # ← brand config: name, contact, payments, scents
  app/
    globals.css       # ← design tokens: surfaces, ink, accents, themes, RTL
    (site)/[locale]/  # storefront root layout (owns <html lang dir>) + preview
    (admin)/admin/    # admin root layout (English, LTR) + placeholder
  i18n/
    config.ts         # locales, direction, localized() field picker
    dictionaries/     # en.json · ar.json  ⚠️ Arabic is PLACEHOLDER
  lib/
    money.ts          # currency, sale pricing, order refs
    __tests__/        # money tests
  components/ui/      # Button
  middleware.ts       # locale redirect
```

**Re-skinning for another client = `src/config/site.ts` + the `:root` block in `globals.css` + the four fonts in `(site)/[locale]/layout.tsx`.**

Two root layouts is deliberate, not an accident: `lang`/`dir` depend on the locale segment, so the storefront's root must live under `[locale]`. Next.js supports this via top-level route groups.

---

## Known gaps

- ⚠️ **Arabic strings are machine-drafted placeholders.** Every one needs a native speaker before launch. See `_note` in `ar.json`.
- ⚠️ **Prices are placeholders** ($25). Awaiting the client's product spreadsheet.
- ⚠️ **`costPrice` is null** — profit stays empty until the client supplies real costs.
- ⚠️ **No product images.** Needs the Cloudflare R2 pipeline (Phase 4) and a plain-background Pearl Bloom shot from the client.
- ⚠️ **WhatsApp number, domain, Whish details** are `TODO` placeholders in `site.ts`.
- **Whish is manual by design** — the automated Collect/OTP API needs a merchant agreement. Out of scope until negotiated.

---

## Roadmap

| Phase | Scope | Status |
|---|---|---|
| 0 | Foundation, tokens, i18n/RTL, schema | ✅ Done |
| 1 | Catalogue + storefront pages | Next |
| 2 | Cart, checkout, COD, coupons, emails | |
| 3 | Google sign-in, admin auth | |
| 4 | Admin panel, R2 uploads, analytics | |
| 5 | QA, SEO, deploy, handover | |

---

## Troubleshooting

**`prisma generate` fails behind a firewall.** It downloads engine binaries from `binaries.prisma.sh`. If blocked:
```bash
npm install --ignore-scripts
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
```
On a normal connection `npm install` handles this automatically.

**`next/font` fails to fetch.** `next/font/google` downloads at build time and needs `fonts.googleapis.com`.

**`prisma/` is excluded from `tsconfig`.** `seed.ts` runs under `tsx`, not the Next build. Keeping it out stops the build depending on generated Prisma enums.
