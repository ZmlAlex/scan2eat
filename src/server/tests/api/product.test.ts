import { type User } from "@prisma/client";
import { type inferProcedureInput } from "@trpc/server";

import type { AppRouter, appRouter } from "../../api/root";
import { createCategory } from "../helpers/createCategory";
import { createProduct } from "../helpers/createProduct";
import { createRestaurant } from "../helpers/createRestaurant";
import { createRestaurantWithMultipleLanguages } from "../helpers/createRestaurantWithMultipleLanguages";
import { createUser } from "../helpers/createUser";
import { createProtectedCaller } from "../helpers/protectedCaller";

//TODO: MOVE IT GLOBALLY
type TestCaller = ReturnType<typeof appRouter.createCaller>;

//TODO: MOVE IT TO THE MOCKS
const createRestaurantInput: inferProcedureInput<
  AppRouter["restaurant"]["createRestaurant"]
> & { logoUrl: string } = {
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
      restaurantId: testRestaurant.id,

      name: "juices",
      languageCode: "english",
    });

    const createProductInput: inferProcedureInput<
      AppRouter["product"]["createProduct"]
    > = {
      restaurantId: testRestaurant.id,

      categoryId: testCategory.id,
      name: "apple juice",
      description: "amazing fresh drink",
      price: 1000,
      languageCode: "english",
      measurementUnit: "ml",
      measurementValue: "250",
      imageBase64:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1920px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
    };

    const { product } = await caller.product.createProduct(createProductInput);

    expect(product?.[0]).toMatchObject({
      price: 100000,
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
        restaurantId: testRestaurant.id,

        name: "juices",
        languageCode: "english",
      });

      const testProduct = await createProduct({
        restaurantId: testRestaurant.id,

        categoryId: testCategory.id,
        name: "apple juice",
        description: "amazing fresh drink",
        price: 1000,
        languageCode: "english",
        measurementUnit: "ml",
        measurementValue: "250",
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
        imageBase64: "",
        isImageDeleted: false,
        isEnabled: true,
      };

      const { product } = await caller.product.updateProduct(
        updateProductInput
      );

      expect(product?.[0]).toMatchObject({
        price: 150000,
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
        restaurantId: testRestaurant.id,

        name: "juices",
        languageCode: "english",
      });

      const testProduct = await createProduct({
        restaurantId: testRestaurant.id,
        categoryId: testCategory.id,
        name: "apple juice",
        description: "amazing fresh drink",
        price: 1000,
        languageCode: "english",
        measurementUnit: "ml",
        measurementValue: "250",
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
        imageBase64:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1920px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
        isEnabled: true,
        isImageDeleted: false,
      };

      const { product } = await caller.product.updateProduct(
        updateProductInput
      );

      expect(product?.[0]).toMatchObject({
        price: 150000,
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

    //TODO: ADD CASE WHEN OLD DATA BUT IMAGE IS DELETED (PRODUCTS /RESTAURANTS)

    it("should update translations for russian language product", async () => {
      const testRestaurant = await createRestaurant(
        testUser.id,
        createRestaurantInput
      );

      const testCategory = await createCategory({
        restaurantId: testRestaurant.id,

        name: "juices",
        languageCode: "english",
      });

      const testProduct = await createProduct({
        restaurantId: testRestaurant.id,

        categoryId: testCategory.id,
        name: "apple juice",
        description: "amazing fresh drink",
        price: 1000,
        languageCode: "english",
        measurementUnit: "ml",
        measurementValue: "250",
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
        isImageDeleted: false,
      };

      const { product } = await caller.product.updateProduct(
        updateProductInput
      );

      console.log("product: ", product);

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
      restaurantId: testRestaurant.id,
      name: "juices",
      languageCode: "english",
    });

    await createCategory({
      restaurantId: testRestaurant.id,
      name: "soups",
      languageCode: "english",
    });

    const testProduct = await createProduct({
      restaurantId: testRestaurant.id,

      categoryId: testCategory.id,
      name: "apple juice",
      description: "amazing fresh drink",
      price: 1000,
      languageCode: "english",
      measurementUnit: "ml",
      measurementValue: "250",
      imageUrl: "mockUrl",
    });

    const input: inferProcedureInput<AppRouter["product"]["deleteProduct"]> = {
      productId: testProduct.id,
    };

    const { product } = await caller.product.deleteProduct(input);

    expect(product).toHaveLength(0);
  });

  //MULTIPLE LANGUAGES
  describe("when restaurant has multiple languages", () => {
    it("should create product with translations", async () => {
      const testRestaurant = await createRestaurantWithMultipleLanguages(
        testUser.id,
        createRestaurantInput
      );

      const testCategory = await createCategory({
        restaurantId: testRestaurant.id,
        name: "juices",
        languageCode: "english",
      });

      const createProductInput: inferProcedureInput<
        AppRouter["product"]["createProduct"]
      > = {
        restaurantId: testRestaurant.id,
        categoryId: testCategory.id,
        name: "apple juice",
        description: "amazing fresh drink",
        price: 1000,
        languageCode: "english",
        measurementUnit: "ml",
        measurementValue: "250",
        imageBase64:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1920px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
      };

      const { product } = await caller.product.createProduct(
        createProductInput
      );

      expect(product?.[0]).toMatchObject({
        price: 100000,
        isEnabled: true,
        imageUrl: expect.stringContaining("cloudinary") as string,
        productI18N: expect.objectContaining({
          english: {
            name: "apple juice",
            description: "amazing fresh drink",
          },
          russian: {
            name: "яблочный сок",
            description: "потрясающий свежий напиток",
          },
        }) as unknown,
      });
    });
  });

  //TODO: DESCRIBE WITH ERROR CASES
});
