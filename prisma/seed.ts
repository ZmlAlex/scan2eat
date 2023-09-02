import { prisma } from "~/server/db";

import { burgerRestaurant, currencies, languages } from "./seedData";

const createBurgerRestaurant = async (userId: string) => {
  const basicRestaurant = await prisma.restaurant.create({
    data: {
      userId,
      logoUrl:
        "https://imageproxy.wolt.com/venue/60c85dc2217f0acff63e8d85/04f1979c-f066-11eb-bc14-1e9e0d11d27c_e2caff18_f061_11eb_a1db_4ea078b3f7fb_cover_photo_1.jpeg",
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
        categoryI18N: {
          create: {
            fieldName: "name",
            translation: category,
            languageCode: "english",
          },
        },
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
              {
                fieldName: "name",
                translation: product.name,
                languageCode: "english",
              },
              {
                fieldName: "description",
                translation: product.description,
                languageCode: "english",
              },
            ],
          },
        },
      },
    });
  });

  await prisma.$transaction(basicProductsPromises);
};

async function main() {
  // await prisma.language.createMany({
  //   data: languages,
  // });

  // await prisma.currency.createMany({
  //   data: currencies,
  // });

  // const basicUser = await prisma.user.create({
  //   data: {
  //     email: "amazonalexzml@gmail.com",
  //   },
  // });

  // await createBurgerRestaurant(basicUser.id);
  await createBurgerRestaurant("clm1vekrv00003s7o7awpaw70");
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
