import type { ProductMeasurementUnit } from "@prisma/client";

import { prisma } from "~/server/db";

export const createWokRestaurant = async (userId: string) => {
  const basicRestaurant = await prisma.restaurant.create({
    data: {
      userId,
      logoUrl:
        "https://res.cloudinary.com/du3ndixsk/image/upload/v1693744873/foodmate-development/clm1vekrv00003s7o7awpaw70/48a32450d117a65772531f2b8b33cd78708e1b9a.png",
      workingHours: "24hrs",
      currencyCode: "USD",
      restaurantLanguage: { create: { languageCode: "english" } },
      restaurantI18N: {
        createMany: {
          data: [
            {
              fieldName: "name",
              translation: "Wok house",
              languageCode: "english",
            },
            {
              fieldName: "description",
              translation: "Asian cuisine",
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

  const basicCategoriesPromises = wokRestaurant.categories.map(
    (category, index) =>
      prisma.category.create({
        data: {
          userId,
          restaurantId: basicRestaurant.id,
          position: index,
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

  const basicProductsPromises = wokRestaurant.products.map((product) => {
    const categoryId = basicCategories[product.categoryIndex]?.id ?? "";

    return prisma.product.create({
      data: {
        userId,

        restaurantId: basicRestaurant.id,
        categoryId: categoryId,
        position: product.position,
        imageUrl: product.imageUrl,
        measurementUnit: product.measurementUnit as ProductMeasurementUnit,
        measurementValue: product.measurementValue,
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

export const wokRestaurant = {
  categories: ["wok", "bao", "soups", "chicken wings", "drinks"],

  products: [
    {
      name: "Fried Noodles on Wok with Beef 🥡",
      description:
        "Noodles, beef, carrot, bell pepper, marrow squash, cabbage, green onion, sesame",
      price: 400,
      measurementUnit: "g",
      measurementValue: "300",
      imageUrl:
        "https://res.cloudinary.com/du3ndixsk/image/upload/v1693742483/foodmate-development/clm1vekrv00003s7o7awpaw70/4e0eb82ef6b38d5a0147846a503f660fd0f365aa.png",
      categoryIndex: 0,
      position: 0,
    },
    {
      name: "Fried Rice on Wok with Beef 🥡",
      description:
        "Rice, beef, carrot, bell pepper, marrow squash, cabbage, green onion, sesame",
      measurementUnit: "g",
      measurementValue: "300",
      price: 400,
      imageUrl:
        "https://res.cloudinary.com/du3ndixsk/image/upload/v1693742646/foodmate-development/clm1vekrv00003s7o7awpaw70/011933f11070d0d40bfb8241d98e754ec43f719b.png",
      categoryIndex: 0,
      position: 1,
    },
    {
      name: "Pad Thai Noddles with Chicken",
      description:
        "Chicken breast, rice noddles, cabbage, carrot, green onion, red onions, sweet sour tamarind sauce, eggs, ground peanuts. lemon",
      price: 500,
      measurementUnit: "g",
      measurementValue: "320",
      imageUrl:
        "https://res.cloudinary.com/du3ndixsk/image/upload/v1693742772/foodmate-development/clm1vekrv00003s7o7awpaw70/7a481232a15105d12ffa71c8890f8700ebe0dcb7.png",
      categoryIndex: 0,
      position: 2,
    },
    {
      name: "Pad Thai with Shrimps",
      description:
        "Rice noddles, red onion, shrimps, cabbage, carrot, sweet sour sauce, fish sauce, eggs, ground peanuts, green onion",
      price: 800,
      measurementUnit: "g",
      measurementValue: "320",
      imageUrl:
        "https://res.cloudinary.com/du3ndixsk/image/upload/v1693742801/foodmate-development/clm1vekrv00003s7o7awpaw70/d32381bcf13016732071b41b73f2ebcf36102f80.png",
      categoryIndex: 0,
      position: 3,
    },
    {
      name: "Classic Fried Rice Shrimp",
      description:
        "Shrimps, rice, carrot, onion, garlic, egg, green onion, soy sauce, green onion, coriander, lemon. ground white paper",
      price: 750,
      measurementUnit: "g",
      measurementValue: "350",
      imageUrl:
        "https://res.cloudinary.com/du3ndixsk/image/upload/v1693743335/foodmate-development/clm1vekrv00003s7o7awpaw70/76bae954de0bf6b0d22d82c959062b4ee7ad45b5.png",
      categoryIndex: 0,
      position: 4,
    },
    {
      name: "Classic Fried Rice with Chicken",
      description:
        "Chicken breast, carrot, garlic, rice, onion, egg, soy sauce, green onion, coriander, lemon. Ground white paper",
      price: 450,
      measurementUnit: "g",
      measurementValue: "350",
      imageUrl:
        "https://res.cloudinary.com/du3ndixsk/image/upload/v1693743284/foodmate-development/clm1vekrv00003s7o7awpaw70/a7c3331da32c253da05c3aeed968c6d7c5ae927e.png",
      categoryIndex: 0,
      position: 5,
    },
    {
      name: "Bao-Buns (with Chicken)",
      description:
        "Buns bread, peanut, sesame, carrot and cucumber marinade, green onion, buns sauce",
      price: 576,
      measurementUnit: "pcs",
      measurementValue: "2",
      imageUrl:
        "https://res.cloudinary.com/du3ndixsk/image/upload/v1693743676/foodmate-development/clm1vekrv00003s7o7awpaw70/974bf1262182e76f51b0b16223a3d6e042ac9f50.png",
      categoryIndex: 1,
      position: 0,
    },
    {
      name: "Bao-Buns (with Pork Belly)",
      description:
        "Buns bread, peanut, sesame, carrot and cucumber marinade green onion, buns sauce",
      price: 615,
      measurementUnit: "pcs",
      measurementValue: "2",
      imageUrl:
        "https://res.cloudinary.com/du3ndixsk/image/upload/v1693743611/foodmate-development/clm1vekrv00003s7o7awpaw70/4ff8185bf3dd151581dac269a1f193dd10d5671f.png",
      categoryIndex: 1,
      position: 1,
    },
    {
      name: "Bao-Buns (with Tofu)",
      description:
        "Buns bread, peanut, sesame, carrot and cucumber marinade, green onion, buns sauce",
      price: 615,
      measurementUnit: "pcs",
      measurementValue: "2",
      imageUrl:
        "https://res.cloudinary.com/du3ndixsk/image/upload/v1693743676/foodmate-development/clm1vekrv00003s7o7awpaw70/974bf1262182e76f51b0b16223a3d6e042ac9f50.png",
      categoryIndex: 1,
      position: 2,
    },
    {
      name: "Chashu Ramen",
      description:
        "Japanese traditional soup, rich Tonkasu Broth Base, with pork chashu meat, home make Srect sauce, home make egg ramen noddles, spring onion, black fungus. Bean Sprouts, topped with marinated soft boiled egg, for a little fried garlic oil",
      price: 884,
      measurementUnit: "ml",
      measurementValue: "450",
      imageUrl:
        "https://res.cloudinary.com/du3ndixsk/image/upload/v1693743716/foodmate-development/clm1vekrv00003s7o7awpaw70/7ec04221d7401be6fa9f50e558b16658ca3ea68e.png",
      categoryIndex: 2,
      position: 0,
    },
    {
      name: "Spicy Ramen",
      description:
        "Asian spicy cuisine soup, classic broth base, with most popular pork chaschu meat, and home make screct sauce with spicy base, home make egg ramen noddles, Black fungus, bean sprouts, spring onion, topped with soft boiled egg, home make hot cooking oil",
      price: 884,
      measurementUnit: "ml",
      measurementValue: "450",
      imageUrl:
        "https://res.cloudinary.com/du3ndixsk/image/upload/v1693743749/foodmate-development/clm1vekrv00003s7o7awpaw70/2c515b31940acb83e398ebe8e096f28ec144b7b8.png",
      categoryIndex: 2,
      position: 1,
    },
    {
      name: "Tom Yum with Shrimps",
      description:
        "A type of hot and sour thai soup, the word tom refers to the boiling, while yum means mixed, Fresh ingredients, classic broth, lemongrass, kaffir lime leaves, mushroom, cherry, galangal, lime, fish sauce, chilli paper, tom yum paste, coconut milk, home make paste, coriander",
      price: 961,
      measurementUnit: "ml",
      measurementValue: "450",
      imageUrl:
        "https://res.cloudinary.com/du3ndixsk/image/upload/v1693743819/foodmate-development/clm1vekrv00003s7o7awpaw70/0e1cac77308c613824626f50dbb9fdf87558fe6f.png",
      categoryIndex: 2,
      position: 2,
    },
    {
      name: "Tom Yum with Chicken",
      description:
        "A type of hot and sour thai soup, the word tom refers to the boiling, while yum means mixed, Fresh ingredients, classic broth, lemongrass, kaffir lime leaves, mushroom, cherry, galangal, lime, fish sauce, chilli paper, tom yum paste, coconut milk, home make paste, coriander",
      price: 692,
      measurementUnit: "ml",
      measurementValue: "450",
      imageUrl:
        "https://res.cloudinary.com/du3ndixsk/image/upload/v1693743819/foodmate-development/clm1vekrv00003s7o7awpaw70/0e1cac77308c613824626f50dbb9fdf87558fe6f.png",
      categoryIndex: 2,
      position: 3,
    },
    {
      name: "Fried Chicken Wings with Mango",
      description: "Chicken wings, peanut, green onion, sauce, mango sauce",
      price: 577,
      measurementUnit: "g",
      measurementValue: "300",
      imageUrl:
        "https://res.cloudinary.com/du3ndixsk/image/upload/v1693743909/foodmate-development/clm1vekrv00003s7o7awpaw70/4c1f0f3ad9eb71bceeffaa7f1fe746d5e40e2e76.png",
      categoryIndex: 3,
      position: 0,
    },
    {
      name: "Fried Chicken Wings with BBQ",
      description: "Chicken wings, peanut, green onion, sauce, BBQ sauce",
      price: 538,
      measurementUnit: "g",
      measurementValue: "300",
      imageUrl:
        "https://res.cloudinary.com/du3ndixsk/image/upload/v1693743940/foodmate-development/clm1vekrv00003s7o7awpaw70/f47bb7ae93eb420b5eafca7477e326492c0c09dc.png",
      categoryIndex: 3,
      position: 1,
    },
    {
      name: "Coca-cola 0.33L",
      description: "",
      price: 115,
      measurementUnit: "ml",
      measurementValue: "330",
      imageUrl:
        "https://res.cloudinary.com/du3ndixsk/image/upload/v1693743965/foodmate-development/clm1vekrv00003s7o7awpaw70/cfddf31813faaf849afcabe42cc1ba14e51b91dd.png",
      categoryIndex: 4,
      position: 0,
    },
    {
      name: "Fanta 0.33L",
      description: "",
      price: 115,
      measurementUnit: "ml",
      measurementValue: "330",
      imageUrl:
        "https://res.cloudinary.com/du3ndixsk/image/upload/v1693743994/foodmate-development/clm1vekrv00003s7o7awpaw70/8951ea49f2497d1001ee0456f75fef80d6856f97.png",
      categoryIndex: 4,
      position: 1,
    },
    {
      name: "Beer Alkhanaidze lager 0.5 l",
      description: "",
      price: 346,
      imageUrl: "",
      measurementUnit: "ml",
      measurementValue: "500",
      categoryIndex: 4,
      position: 2,
    },
    {
      name: "Kombucha Ginger",
      imageUrl:
        "https://res.cloudinary.com/du3ndixsk/image/upload/v1693744065/foodmate-development/clm1vekrv00003s7o7awpaw70/3aef3d66adc916e19520d12b5199c3a962592942.png",
      price: 307,
      measurementUnit: "ml",
      measurementValue: "400",
      description: "",
      categoryIndex: 4,
      position: 3,
    },
    {
      name: "Kombucha Lavender",
      description: "",
      price: 307,
      measurementUnit: "ml",
      measurementValue: "400",
      imageUrl:
        "https://res.cloudinary.com/du3ndixsk/image/upload/v1693744086/foodmate-development/clm1vekrv00003s7o7awpaw70/853480954d70c265e6f0aee52e0765935c511372.png",
      categoryIndex: 4,
      position: 4,
    },
  ],
};
