import { prisma } from "~/server/db";

import { categories, currencies, languages, products } from "./seedData";

async function main() {
  await prisma.language.createMany({
    data: languages,
  });

  await prisma.currency.createMany({
    data: currencies,
  });

  const basicUser = await prisma.user.create({
    data: {
      email: "mirrors2011@mail.com",
    },
  });

  const basicRestaurant = await prisma.restaurant.create({
    data: {
      userId: basicUser.id,
      logoUrl: "",
      workingHours: "24hrs",
      currencyCode: "USD",
      restaurantLanguage: { create: { languageCode: "english" } },
      restaurantI18N: {
        createMany: {
          data: [
            {
              fieldName: "name",
              translation: "Subway",
              languageCode: "english",
            },
            {
              fieldName: "description",
              translation:
                "Hearty doners in a pleasant atmosphere. You can quickly order on the way and without a queue through the application. We look forward to visiting!",
              languageCode: "english",
            },
            {
              fieldName: "address",
              translation: "10th Avenue st.",
              languageCode: "english",
            },
          ],
        },
      },

      menu: { create: {} },
    },
    select: { menu: { select: { id: true } } },
  });

  const basicCategoriesPromises = categories.map((category) =>
    prisma.category.create({
      data: {
        menuId: basicRestaurant.menu[0]?.id ?? "",
        categoryI18N: { create: { fieldName: "name", translation: category } },
      },
    })
  );

  const basicCategories = await prisma.$transaction(basicCategoriesPromises);

  const basicProductsPromises = products.map((product) => {
    const categoryId = basicCategories[product.categoryIndex]?.id ?? "";

    return prisma.product.create({
      data: {
        menuId: basicRestaurant.menu[0]?.id ?? "",
        categoryId: categoryId,
        imageUrl: product.imageUrl,
        measurementUnit: "",
        measurementValue: "",
        price: product.price,
        productI18N: {
          createMany: {
            data: [
              { fieldName: "name", translation: product.name },
              { fieldName: "description", translation: product.description },
            ],
          },
        },
      },
    });
  });

  await prisma.$transaction(basicProductsPromises);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
