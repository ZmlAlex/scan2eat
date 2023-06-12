import { type User } from "@prisma/client";
import { type inferProcedureInput } from "@trpc/server";

import type { AppRouter, appRouter } from "../../api/root";
import { createCategory } from "../helpers/createCategory";
import { createProduct } from "../helpers/createProduct";
import { createRestaurant } from "../helpers/createRestaurant";
import { createUser } from "../helpers/createUser";
import { createProtectedCaller } from "../helpers/protectedCaller";

//TODO: MOVE IT GLOBALLY
type TestCaller = ReturnType<typeof appRouter.createCaller>;

//TODO: MOVE IT TO THE MOCKS
const createRestaurantInput: inferProcedureInput<
  AppRouter["restaurant"]["createRestaurant"]
> = {
  name: "Krusty Krab",
  address: "831 Bottom Feeder Lane",
  description: "best fastfood in the Bikini Bottom",
  currencyCode: "RUB",
  workingHours: "24hrs",
  logoUrl: "mockUrl",
  languageCode: "english",
};

describe("Product API", () => {
  let testUser: User;
  let caller: TestCaller;

  beforeEach(async () => {
    testUser = await createUser();
    caller = createProtectedCaller(testUser);
  });
  it("should create product", async () => {
    const testRestaurant = await createRestaurant(
      testUser.id,
      createRestaurantInput
    );

    const testCategory = await createCategory({
      menuId: testRestaurant.menu[0]?.id as string,
      name: "juices",
      languageCode: "english",
    });

    const createProductInput: inferProcedureInput<
      AppRouter["product"]["createProduct"]
    > = {
      menuId: testRestaurant.menu[0]?.id as string,
      categoryId: testCategory.id,
      name: "apple juice",
      description: "amazing fresh drink",
      price: 1000,
      languageCode: "english",
      measurmentUnit: "ml.",
      measurmentValue: "250",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1920px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
    };

    const {
      menu: { product },
    } = await caller.product.createProduct(createProductInput);

    expect(product?.[0]).toMatchObject({
      price: 1000,
      isEnabled: true,
      imageUrl: expect.stringContaining("cloudinary") as string,
      productI18N: {
        english: expect.objectContaining({
          name: "apple juice",
          description: "amazing fresh drink",
        }) as unknown,
      },
    });
  });

  describe("When product is updated by id", () => {
    it("should return product with new data and old imageUrl", async () => {
      const testRestaurant = await createRestaurant(
        testUser.id,
        createRestaurantInput
      );

      const testCategory = await createCategory({
        menuId: testRestaurant.menu[0]?.id as string,
        name: "juices",
        languageCode: "english",
      });

      const testProduct = await createProduct({
        menuId: testRestaurant.menu[0]?.id as string,
        categoryId: testCategory.id,
        name: "apple juice",
        description: "amazing fresh drink",
        price: 1000,
        languageCode: "english",
        measurmentUnit: "ml.",
        measurmentValue: "250",
        imageUrl: "mockUrl",
      });

      const updateProductInput: inferProcedureInput<
        AppRouter["product"]["updateProduct"]
      > = {
        productId: testProduct.id,
        name: "orange juice",
        price: 1500,
        description: "amazing fresh drink",
        languageCode: "english",
        imageUrl: undefined,
        isEnabled: true,
      };

      const {
        menu: { product },
      } = await caller.product.updateProduct(updateProductInput);

      expect(product?.[0]).toMatchObject({
        price: 1500,
        imageUrl: "mockUrl",
        isEnabled: true,
        productI18N: {
          english: expect.objectContaining({
            name: "orange juice",
            description: "amazing fresh drink",
          }) as unknown,
        },
      });
    });

    it("should return product with new data and new imageUrl", async () => {
      const testRestaurant = await createRestaurant(
        testUser.id,
        createRestaurantInput
      );

      const testCategory = await createCategory({
        menuId: testRestaurant.menu[0]?.id as string,
        name: "juices",
        languageCode: "english",
      });

      const testProduct = await createProduct({
        menuId: testRestaurant.menu[0]?.id as string,
        categoryId: testCategory.id,
        name: "apple juice",
        description: "amazing fresh drink",
        price: 1000,
        languageCode: "english",
        measurmentUnit: "ml.",
        measurmentValue: "250",
        imageUrl: "originalUrl",
      });

      const updateProductInput: inferProcedureInput<
        AppRouter["product"]["updateProduct"]
      > = {
        productId: testProduct.id,
        name: "orange juice",
        price: 1500,
        description: "amazing fresh drink",
        languageCode: "english",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1920px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
        isEnabled: true,
      };

      const {
        menu: { product },
      } = await caller.product.updateProduct(updateProductInput);

      expect(product?.[0]).toMatchObject({
        price: 1500,
        imageUrl: expect.not.stringContaining("originalUrl") as string,
        isEnabled: true,
        productI18N: {
          english: expect.objectContaining({
            name: "orange juice",
            description: "amazing fresh drink",
          }) as unknown,
        },
      });
    });

    it("should update translations for russian language product", async () => {
      const testRestaurant = await createRestaurant(
        testUser.id,
        createRestaurantInput
      );

      const testCategory = await createCategory({
        menuId: testRestaurant.menu[0]?.id as string,
        name: "juices",
        languageCode: "english",
      });

      const testProduct = await createProduct({
        menuId: testRestaurant.menu[0]?.id as string,
        categoryId: testCategory.id,
        name: "apple juice",
        description: "amazing fresh drink",
        price: 1000,
        languageCode: "english",
        measurmentUnit: "ml.",
        measurmentValue: "250",
        imageUrl: "mockUrl",
      });

      const updateProductInput: inferProcedureInput<
        AppRouter["product"]["updateProduct"]
      > = {
        productId: testProduct.id,
        name: "апельсиновый сок",
        price: 1500,
        description: "свежевыжатый сок",
        languageCode: "russian",
        isEnabled: true,
      };

      const {
        menu: { product },
      } = await caller.product.updateProduct(updateProductInput);

      expect(product?.[0]?.productI18N.russian).toMatchObject({
        name: "апельсиновый сок",
        description: "свежевыжатый сок",
      });
    });
  });

  it("should delete product by id", async () => {
    const testRestaurant = await createRestaurant(
      testUser.id,
      createRestaurantInput
    );

    const testCategory = await createCategory({
      menuId: testRestaurant.menu[0]?.id as string,
      name: "juices",
      languageCode: "english",
    });

    await createCategory({
      menuId: testRestaurant.menu[0]?.id as string,
      name: "soups",
      languageCode: "english",
    });

    const testProduct = await createProduct({
      menuId: testRestaurant.menu[0]?.id as string,
      categoryId: testCategory.id,
      name: "apple juice",
      description: "amazing fresh drink",
      price: 1000,
      languageCode: "english",
      measurmentUnit: "ml.",
      measurmentValue: "250",
      imageUrl: "mockUrl",
    });

    const input: inferProcedureInput<AppRouter["product"]["deleteProduct"]> = {
      productId: testProduct.id,
    };

    const {
      menu: { product },
    } = await caller.product.deleteProduct(input);

    expect(product).toHaveLength(0);
  });

  //TODO: DESCRIBE WITH ERROR CASES
});