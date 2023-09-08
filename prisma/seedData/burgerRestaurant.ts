import { prisma } from "~/server/db";

export const createBurgerRestaurant = async (userId: string) => {
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

  const basicCategoriesPromises = burgerRestaurant.categories.map(
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

  const basicProductsPromises = burgerRestaurant.products.map((product) => {
    const categoryId = basicCategories[product.categoryIndex]?.id ?? "";

    return prisma.product.create({
      data: {
        userId,

        restaurantId: basicRestaurant.id,
        categoryId: categoryId,
        position: product.position,
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

export const burgerRestaurant = {
  categories: [
    "burgers",
    "mini burgers",
    "wraps",
    "sides",
    "snacks",
    "salads",
    "deserts",
    "cold drinks",
  ],

  products: [
    {
      name: "Space Burger",
      description:
        "Bun, beef, cherry sweet-spicy sauce, special sause, bacon, caramelised onion, cheddar cheese, Iceberg",
      price: 1290,
      measurementUnit: "g",
      measurementValue: "350",
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/85e5d9ce-f2e3-11eb-be3d-560e5dd32032_space_burger.jpeg",
      categoryIndex: 0,
      position: 0,
    },
    {
      name: "Hill Burger",
      description:
        "Bun, beef, cherry sweet-spicy sauce, special sause, bacon, caramelised onion, cheddar cheese, Iceberg",
      price: 1390,
      measurementUnit: "g",
      measurementValue: "350",
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/6286d1ce-f2e6-11eb-ab2b-669761f20ae3_hill_burger_.jpeg",

      categoryIndex: 0,
      position: 1,
    },
    {
      name: "Soho Burger",
      description:
        "Bun, beef, cherry sweet-spicy sauce, special sause, bacon, caramelised onion, cheddar cheese, Iceberg",
      measurementUnit: "g",
      measurementValue: "350",

      price: 1300,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/e7e2cfc2-f2e5-11eb-a2b6-7ad37010b809_soho_burger_.jpeg",

      categoryIndex: 0,
      position: 2,
    },
    {
      name: "Tesla Burger",
      description:
        "Bun, beef, cherry sweet-spicy sauce, special sause, bacon, caramelised onion, cheddar cheese, Iceberg",
      measurementUnit: "g",
      measurementValue: "350",
      price: 1240,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/716452bc-dfde-11ec-9cf5-6e388b50cd6c_dsc_5121_burgerspace_27m_burgerspace_27m_wolt.jpeg?w=960",

      categoryIndex: 0,
      position: 3,
    },
    {
      name: "Gibbs Burger",
      description:
        "Bun, beef, cherry sweet-spicy sauce, special sause, bacon, caramelised onion, cheddar cheese, Iceberg",
      measurementUnit: "g",
      measurementValue: "350",
      price: 1410,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/b3f7d466-f2e3-11eb-b64b-d24700261595_gibbs_burger_.jpeg",

      categoryIndex: 0,
      position: 4,
    },
    {
      name: "Hubble Space Burger",
      description:
        "Bun, beef, cherry sweet-spicy sauce, special sause, bacon, caramelised onion, cheddar cheese, Iceberg",
      measurementUnit: "g",
      measurementValue: "350",
      price: 1380,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/33540520-35d8-11ee-a2f2-1e93eb3fe494_rmn03551_burger_space.jpg",

      categoryIndex: 0,
      position: 5,
    },
    {
      name: "Space Mac Burger",
      description:
        "Bun, beef, cherry sweet-spicy sauce, special sause, bacon, caramelised onion, cheddar cheese, Iceberg",
      measurementUnit: "g",
      measurementValue: "350",
      price: 1420,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/3b1f3654-dfde-11ec-9dfd-16d3e579fdce_dsc_5107_burgerspace_27m_burgerspace_27m_wolt.jpeg",

      categoryIndex: 0,
      position: 6,
    },
    {
      name: "Wolf Burger",
      description:
        "Bun, beef, cherry sweet-spicy sauce, special sause, bacon, caramelised onion, cheddar cheese, Iceberg",
      measurementUnit: "g",
      measurementValue: "350",
      price: 1420,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/351657d8-b841-11ed-98fc-56384c971b5d_rmn09043_bs.jpeg",

      categoryIndex: 0,
      position: 7,
    },
    {
      name: "Mini Space  Burger",
      description:
        "Bun, beef, cherry sweet-spicy sauce, special sause, bacon, caramelised onion, cheddar cheese, Iceberg",
      measurementUnit: "g",
      measurementValue: "350",
      price: 1420,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/ebb134e2-c177-11ed-9e01-5a206883106f_space_burger.jpeg?w=960",

      categoryIndex: 1,
      position: 0,
    },
    {
      name: "Mini Hill Burger",
      description:
        "Bun, beef, cherry sweet-spicy sauce, special sause, bacon, caramelised onion, cheddar cheese, Iceberg",
      measurementUnit: "g",
      measurementValue: "350",
      price: 1420,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/6286d1ce-f2e6-11eb-ab2b-669761f20ae3_hill_burger_.jpeg",

      categoryIndex: 1,
      position: 1,
    },
    {
      name: "Mini Wolf Burger",
      description:
        "Bun, beef, cherry sweet-spicy sauce, special sause, bacon, caramelised onion, cheddar cheese, Iceberg",
      measurementUnit: "g",
      measurementValue: "350",
      price: 1420,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/351657d8-b841-11ed-98fc-56384c971b5d_rmn09043_bs.jpeg",

      categoryIndex: 1,
      position: 2,
    },
    {
      name: "Tesla Wrap",
      description:
        "Bun, beef, cherry sweet-spicy sauce, special sause, bacon, caramelised onion, cheddar cheese, Iceberg",
      measurementUnit: "g",
      measurementValue: "350",
      price: 1000,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/588f8ce8-b841-11ed-910a-32abe51e7c79_rmn09049_bs.jpeg",
      categoryIndex: 2,
      position: 0,
    },
    {
      name: "Brooks Wrap",
      description:
        "Bun, beef, cherry sweet-spicy sauce, special sause, bacon, caramelised onion, cheddar cheese, Iceberg",
      measurementUnit: "g",
      measurementValue: "350",
      price: 1100,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/7eef51e8-b841-11ed-84aa-ce01b4a2ee53_rmn09065_bs.jpeg",

      categoryIndex: 2,
      position: 1,
    },
    {
      name: "French Fries",
      description: "",
      measurementUnit: "g",
      measurementValue: "350",
      price: 2,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/404b9666-f2e7-11eb-839b-5ed0add84507_dsc_1532_burger_space.jpeg",

      categoryIndex: 3,
      position: 0,
    },

    {
      name: "French Fries spicy",
      description: "",
      measurementUnit: "g",
      measurementValue: "350",
      price: 21,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/404b9666-f2e7-11eb-839b-5ed0add84507_dsc_1532_burger_space.jpeg",

      categoryIndex: 3,
      position: 1,
    },
    {
      name: "Mexican Potato",
      description: "",
      measurementUnit: "g",
      measurementValue: "350",
      price: 20,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/2932d6b0-f2e7-11eb-a47b-ba31b56005bc_dsc_1586_burger_space.jpeg",

      categoryIndex: 3,
      position: 2,
    },
    {
      name: "French Fries with hot cheese",
      description: "",
      measurementUnit: "g",
      measurementValue: "350",
      price: 21,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/36540ef0-f525-11eb-996c-26cd9e85c588_dsc_1579_burger_space.jpeg",

      categoryIndex: 3,
      position: 3,
    },
    {
      name: "French Fries with bacon, chesse sause and jalapeno",
      description: "",
      measurementUnit: "g",
      measurementValue: "350",
      price: 37,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/15339e44-b846-11ed-af4e-32abe51e7c79_rmn09032_bs.jpeg",

      categoryIndex: 3,
      position: 4,
    },
    {
      name: "Cheese Balls",
      description: "",
      measurementUnit: "g",
      measurementValue: "350",
      price: 37,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/8f4d6c64-dfde-11ec-8cfe-b698aa243eac_dsc_5104_burgerspace_27m_burgerspace_27m_wolt.jpeg",

      categoryIndex: 4,
      position: 0,
    },
    {
      name: "Onion Rings",
      description: "",
      measurementUnit: "g",
      measurementValue: "350",
      price: 37,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/9b72e186-dfde-11ec-8f8b-767b28da86b0_dsc_5132_burgerspace_27m_burgerspace_27m_wolt.jpeg?w=300",

      categoryIndex: 4,
      position: 1,
    },
    {
      name: "Chicken Nuggets",
      description: "",
      measurementUnit: "g",
      measurementValue: "350",
      price: 37,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/a496ce30-dfde-11ec-8748-b26e21f8ccf9_dsc_5099_burgerspace_27m_burgerspace_27m_wolt.jpeg",
      categoryIndex: 4,
      position: 2,
    },
    {
      name: "Steak Salad",
      description: "",
      measurementUnit: "g",
      measurementValue: "350",
      price: 37,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/12398cce-35d9-11ee-afa6-22953bca3e3c_rmn03533_burger_space.jpg",
      categoryIndex: 5,
      position: 0,
    },
    {
      name: "Beef Salad",
      description: "",
      measurementUnit: "g",
      measurementValue: "350",
      price: 37,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/d45630ca-b841-11ed-b280-4a19bad0827f_rmn09004_bs.jpeg",
      categoryIndex: 5,
      position: 1,
    },
    {
      name: "Chef Salad",
      description: "",
      measurementUnit: "g",
      measurementValue: "350",
      price: 37,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/8d339eb6-f525-11eb-ba95-46daa792c894_dsc_1487_burger_space.jpeg?w=300",
      categoryIndex: 5,
      position: 2,
    },
    {
      name: "Carrot Cake",
      description: "",
      measurementUnit: "g",
      measurementValue: "350",
      price: 37,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/08e2e556-73d6-11ec-b6f8-be7c78c29a5d_img_0265.jpeg",
      categoryIndex: 6,
      position: 0,
    },
    {
      name: "Cherry Muffin",
      description: "",
      measurementUnit: "g",
      measurementValue: "350",
      price: 37,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/fd1e74e2-73d5-11ec-9f84-36c21394d9ba_img_0254.jpeg",
      categoryIndex: 6,
      position: 1,
    },
    {
      name: "Chocolate Muffin",
      description: "",
      measurementUnit: "g",
      measurementValue: "350",
      price: 37,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/edab726c-73d5-11ec-83f2-be4d5b487b7c_img_0262.jpeg",
      categoryIndex: 6,
      position: 2,
    },
    {
      name: "Honeycake",
      description: "",
      measurementUnit: "g",
      measurementValue: "350",
      price: 37,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/b36fe222-2ab9-11ed-9016-9edfd060f520_3a11b98b_69fb_485e_8e82_0180dc1b61f3.jpeg",
      categoryIndex: 6,
      position: 3,
    },
    {
      name: "Coca-Cola",
      description: "",
      measurementUnit: "g",
      measurementValue: "350",
      price: 37,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/509181a6-5d05-11ec-855e-6eca42050f72_nyjsaus9ra9u4prhin7fhpmmrhz7pw.jpeg",
      categoryIndex: 7,
      position: 0,
    },
    {
      name: "Sprite",
      description: "",
      measurementUnit: "g",
      measurementValue: "350",
      price: 37,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/66ee701c-5d05-11ec-975c-0ed4e165a157_0d4myzw1i4atyngpbnb4pp4l55d1av.jpeg",
      categoryIndex: 7,
      position: 1,
    },
    {
      name: "Fuse tea mango-pineapple",
      description: "",
      measurementUnit: "g",
      measurementValue: "350",
      price: 37,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/cc8468ae-3299-11ed-a417-eef357bf85fc_______________________.jpeg",
      categoryIndex: 7,
      position: 2,
    },
    {
      name: "Water",
      description: "",
      measurementUnit: "g",
      measurementValue: "350",
      price: 37,
      imageUrl:
        "https://imageproxy.wolt.com/menu/menu-images/60c86051332d27247389702c/abf03a46-3299-11ed-9f0f-d67e3241784b___________.jpeg",
      categoryIndex: 7,
      position: 3,
    },
  ],
};
