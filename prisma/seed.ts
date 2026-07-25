import { PrismaClient, Prisma, AccentTheme } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const D = (v: string) => new Prisma.Decimal(v);

async function main() {
  // --- Store settings (single row) --------------------------------------
  await prisma.storeSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      defaultCurrency: "USD",
      lbpRate: D("89500"), // TODO: owner sets the real rate from admin -> Settings
      deliveryFee: D("3.00"), // TODO: confirm with client
      lowStockAlertAt: 5,
    },
  });

  // --- Admin -------------------------------------------------------------
  const email = process.env.SEED_ADMIN_EMAIL ?? "owner@ousiana.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "changeme123";
  await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN" },
    create: {
      email,
      name: "Ousiana Owner",
      role: "ADMIN",
      passwordHash: await bcrypt.hash(password, 10),
    },
  });
  console.log(`✓ Admin: ${email} / ${password}  (change this immediately)`);

  // --- Category tree -----------------------------------------------------
  // Deliberately shallow: the client hasn't decided a taxonomy yet, and she
  // can build it herself in the admin. This just proves the self-relation and
  // gives the storefront something real to render.
  //
  //   Body Care
  //     └── Body Oils
  //           └── Signature Blooms   <- products live here
  const bodyCare = await prisma.category.upsert({
    where: { slug: "body-care" },
    update: {},
    create: { nameEn: "Body Care", nameAr: "العناية بالجسم", slug: "body-care", sortOrder: 1 },
  });

  const bodyOils = await prisma.category.upsert({
    where: { slug: "body-oils" },
    update: {},
    create: {
      nameEn: "Body Oils",
      nameAr: "زيوت الجسم",
      slug: "body-oils",
      parentId: bodyCare.id,
      descriptionEn: "Natural oils crafted to hydrate your skin and uplift your senses.",
      descriptionAr: "زيوت طبيعية مصنوعة لترطيب بشرتك وإنعاش حواسك.",
      sortOrder: 1,
    },
  });

  const blooms = await prisma.category.upsert({
    where: { slug: "signature-blooms" },
    update: {},
    create: {
      nameEn: "Signature Blooms",
      nameAr: "عطورنا المميزة",
      slug: "signature-blooms",
      parentId: bodyOils.id,
      sortOrder: 1,
    },
  });

  // --- Products ----------------------------------------------------------
  // Prices are PLACEHOLDERS pending the client's spreadsheet. costPrice is
  // intentionally null: profit reporting stays empty until she supplies real
  // costs, rather than showing a made-up margin.
  const products = [
    {
      slug: "pearl-bloom",
      nameEn: "Pearl Bloom Body Oil",
      nameAr: "زيت الجسم بيرل بلوم",
      descriptionEn:
        "A warm, elegant aroma of rose and vanilla that soothes and pampers. Absorbs quickly, leaving skin soft and quietly radiant.",
      descriptionAr:
        "عبير دافئ وأنيق من الورد والفانيليا يهدئ ويدلل البشرة. سريع الامتصاص، يترك البشرة ناعمة ومتألقة.",
      price: D("25.00"),
      scent: "Rose & vanilla",
      accentTheme: AccentTheme.PEARL,
      stock: 20,
      isFeatured: true,
      ingredients: [
        { nameEn: "Rose essential oil", nameAr: "زيت الورد العطري", benefitEn: "Soothes and refreshes the skin with a delicate touch.", benefitAr: "يهدئ وينعش البشرة بلمسة رقيقة.", icon: "flower" },
        { nameEn: "Vanilla essential oil", nameAr: "زيت الفانيليا العطري", benefitEn: "Calms the senses and leaves skin beautifully scented.", benefitAr: "يهدئ الحواس ويترك البشرة بعبير جميل.", icon: "flower-2" },
        { nameEn: "Coconut oil", nameAr: "زيت جوز الهند", benefitEn: "Deeply hydrates and nourishes the skin.", benefitAr: "يرطب ويغذي البشرة بعمق.", icon: "nut" },
        { nameEn: "Jojoba oil", nameAr: "زيت الجوجوبا", benefitEn: "Balances and softens for a smooth feel.", benefitAr: "يوازن وينعم البشرة لملمس حريري.", icon: "leaf" },
        { nameEn: "Sweet almond oil", nameAr: "زيت اللوز الحلو", benefitEn: "Improves texture and enhances natural radiance.", benefitAr: "يحسّن الملمس ويعزز الإشراق الطبيعي.", icon: "leaf" },
        { nameEn: "Vitamin E", nameAr: "فيتامين E", benefitEn: "Protects and supports healthy, glowing skin.", benefitAr: "يحمي ويدعم بشرة صحية ومشرقة.", icon: "droplet" },
      ],
    },
    {
      slug: "coral-bloom",
      nameEn: "Coral Bloom Body Oil",
      nameAr: "زيت الجسم كورال بلوم",
      descriptionEn:
        "A soft floral blend that refreshes your spirit and nourishes your skin. Lightweight, non-greasy, and made for every day.",
      descriptionAr:
        "مزيج زهري ناعم ينعش روحك ويغذي بشرتك. خفيف، غير دهني، ومصنوع للاستخدام اليومي.",
      price: D("25.00"),
      scent: "Floral blend",
      accentTheme: AccentTheme.CORAL,
      stock: 20,
      isFeatured: true,
      ingredients: [
        { nameEn: "Jojoba oil", nameAr: "زيت الجوجوبا", benefitEn: "Balances and softens skin.", benefitAr: "يوازن وينعم البشرة.", icon: "leaf" },
        { nameEn: "Coconut oil", nameAr: "زيت جوز الهند", benefitEn: "Deeply hydrates and nourishes.", benefitAr: "يرطب ويغذي بعمق.", icon: "nut" },
        { nameEn: "Sweet almond oil", nameAr: "زيت اللوز الحلو", benefitEn: "Improves texture and tone.", benefitAr: "يحسّن ملمس البشرة ولونها.", icon: "leaf" },
        { nameEn: "Vitamin E", nameAr: "فيتامين E", benefitEn: "Protects and supports healthy skin.", benefitAr: "يحمي ويدعم بشرة صحية.", icon: "droplet" },
      ],
    },
    {
      slug: "ocean-bloom",
      nameEn: "Ocean Bloom Body Oil",
      nameAr: "زيت الجسم أوشن بلوم",
      descriptionEn:
        "A fresh, fruity scent that revitalizes and hydrates deeply. Silky, weightless, and made with love.",
      descriptionAr:
        "عبير منعش وفاكهي ينشّط ويرطب بعمق. حريري، خفيف، ومصنوع بحب.",
      price: D("25.00"),
      scent: "Blueberry & fresh",
      accentTheme: AccentTheme.OCEAN,
      stock: 20,
      isFeatured: true,
      ingredients: [
        { nameEn: "Blueberry oil", nameAr: "زيت التوت الأزرق", benefitEn: "Rich in antioxidants to protect and revitalize skin.", benefitAr: "غني بمضادات الأكسدة لحماية البشرة وتنشيطها.", icon: "cherry" },
        { nameEn: "Coconut oil", nameAr: "زيت جوز الهند", benefitEn: "Deeply hydrates and nourishes the skin.", benefitAr: "يرطب ويغذي البشرة بعمق.", icon: "nut" },
        { nameEn: "Jojoba oil", nameAr: "زيت الجوجوبا", benefitEn: "Balances and softens for a smooth feel.", benefitAr: "يوازن وينعم البشرة لملمس حريري.", icon: "leaf" },
        { nameEn: "Sweet almond oil", nameAr: "زيت اللوز الحلو", benefitEn: "Improves texture and enhances natural radiance.", benefitAr: "يحسّن الملمس ويعزز الإشراق الطبيعي.", icon: "leaf" },
        { nameEn: "Vitamin E", nameAr: "فيتامين E", benefitEn: "Protects and supports healthy, glowing skin.", benefitAr: "يحمي ويدعم بشرة صحية ومشرقة.", icon: "droplet" },
      ],
    },
  ];

  for (const p of products) {
    const { ingredients, ...data } = p;
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: { ...data, categoryId: blooms.id },
      create: {
        ...data,
        size: "125ml",
        images: [], // TODO: R2 URLs once photography is uploaded (Phase 4)
        costPrice: null, // TODO: client to supply — profit stays empty until then
        categoryId: blooms.id,
        isActive: true,
      },
    });

    // Replace rather than merge, so re-seeding stays idempotent.
    await prisma.ingredient.deleteMany({ where: { productId: product.id } });
    await prisma.ingredient.createMany({
      data: ingredients.map((ing, i) => ({ ...ing, productId: product.id, sortOrder: i })),
    });
  }
  console.log(`✓ Seeded ${products.length} products under Body Care → Body Oils → Signature Blooms`);

  // --- A sample coupon ---------------------------------------------------
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      type: "PERCENTAGE",
      value: D("10"),
      minSubtotal: D("20.00"),
      isActive: true,
    },
  });
  console.log("✓ Coupon: WELCOME10 (10% off orders over $20)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
