import { prisma } from "./db";
// const { prisma } = await import("./db");
// const { all } = require("./db");

async function main() {
  //   const user = await prisma.user.create({
  //     data: {
  //       name: "Alice",
  //       email: "alice@prisma.io",
  //     },
  //   });
  const restaurant = await prisma.restaurant.create({
    data: {
      // address: "blabla",
      // description: "111",

      workingHours: "24hrs",
      logoUrl: "blabla",
      userId: "clhnujfeb00003s8fw5f3l35m",
      currencyCode: "RUB",
      RestaurantI18N: {
        createMany: {
          data: [
            {
              fieldName: "name",
              translation: "Шаверма",
              languageId: "clhnu9dgw00013su6no4pkai7",
            },
            {
              fieldName: "description",
              translation: "шава на районе",
              languageId: "clhnu9dgw00013su6no4pkai7",
            },
            {
              fieldName: "address",
              translation: "Таганрог",
              languageId: "clhnu9dgw00013su6no4pkai7",
            },
          ],
        },
      },
      // category: { create: { name: "juice" } },
    },
  });
  // const test = await prisma.restaurantI18N.createMany({
  //   data: [
  //     {
  //       restaurantId: restaurant.id,
  //       fieldName: "name",
  //       translation: "yo",
  //       languageId: "",
  //     },
  //   ],
  // });
  // const language = await prisma.language.createMany({
  //   data: [
  //     {
  //       title: "english",
  //     },
  //     {
  //       title: "russian",
  //     },
  //   ],
  // });
  // console.log("language: ", language);
  // const currency = await prisma.currency.createMany({
  //   data: [
  //     {
  //       code: "USD",
  //       title: "dollar",
  //     },
  //     {
  //       code: "RUB",
  //       title: "рубль",
  //     },
  //   ],
  // });
  // const category = await prisma.category.create({
  //   data: {
  //     restaurantId: "clhnllt8z00013ss78wcxa8x3",
  //     name: "hamburgers",
  //   },
  // });
  // const product = await prisma.product.create({
  //   data: {
  //     imageUrl: "123",
  //     isEnabled: true,
  //     name: "yo",
  //     measurementUnit: "мл",
  //     measurementValue: "700",
  //     price: 100,
  //     categoryId: "clhnqn1pm00013sicmleygx3x",
  //     restaurantId: "clhnllt8z00013ss78wcxa8x3",
  //   },
  // });
  // const translation = await prisma.translation.create({
  //   data: {
  //     entityId: "clhnqn1pm00013sicmleygx3x",
  //     // entityType: "category",
  //     fieldName: "name",
  //     translation: "гамбургерсы",
  //     languageId: "clhnmusv100003so9mzbpevzf",
  //   },
  // });
  // console.log("test: ", test);
  // console.log("category: ", category);
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
