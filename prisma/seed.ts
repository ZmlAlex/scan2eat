import { prisma } from "~/server/db";

import { burgerRestaurant, currencies, languages } from "./seedData";

const createBurgerRestaurant = async (userId: string) => {
  const basicRestaurant = await prisma.restaurant.create({
    data: {
      userId,
      logoUrl: "",
      workingHours: "24hrs",
      currencyCode: "USD",
      restaurantLanguage: { create: { languageCode: "english" } },
      restaurantI18N: {
        createMany: {
          data: [
            {
              fieldName: "name",
              translation: "Burger space",
              languageCode: "english",
            },
            {
              fieldName: "description",
              translation:
                "Hearty burgers in a pleasant atmosphere. You can quickly order on the way and without a queue through the application. We look forward to visiting!",
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
    },
    select: { id: true },
  });

  const basicCategoriesPromises = burgerRestaurant.categories.map((category) =>
    prisma.category.create({
      data: {
        restaurantId: basicRestaurant.id,
        categoryI18N: { create: { fieldName: "name", translation: category } },
      },
    })
  );

  const basicCategories = await prisma.$transaction(basicCategoriesPromises);

  const basicProductsPromises = burgerRestaurant.products.map((product) => {
    const categoryId = basicCategories[product.categoryIndex]?.id ?? "";

    return prisma.product.create({
      data: {
        restaurantId: basicRestaurant.id,

        categoryId: categoryId,
        imageUrl: product.imageUrl,
        measurementUnit: "g",
        measurementValue: "100",
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
};

async function main() {
  await prisma.language.createMany({
    data: languages,
  });

  await prisma.currency.createMany({
    data: currencies,
  });

  const basicUser = await prisma.user.create({
    data: {
      email: "amazonalexzml@gmail.com",
    },
  });

  await createBurgerRestaurant(basicUser.id);
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
