import { type User } from "@prisma/client";
import { type inferProcedureInput } from "@trpc/server";

import type { AppRouter } from "~/server/api/root";
import { createCategory } from "~/server/tests/helpers/createCategory";
import { createCategoryWithMultipleLanguages } from "~/server/tests/helpers/createCategoryWithMultipleLanguages";
import { createProduct } from "~/server/tests/helpers/createProduct";
import { createProductWithMultipleLanguages } from "~/server/tests/helpers/createProductWithMultipleLanguages";
import { createRestaurant } from "~/server/tests/helpers/createRestaurant";
import { createRestaurantWithMultipleLanguages } from "~/server/tests/helpers/createRestaurantWithMultipleLanguages";
import { createUser } from "~/server/tests/helpers/createUser";
import {
  createProtectedCaller,
  type TestCaller,
} from "~/server/tests/helpers/protectedCaller";
import { createRestaurantInputFactory } from "~/server/tests/mocks";

describe("Product API", () => {
  let testUser: User;
  let caller: TestCaller;
  const createRestaurantInput = createRestaurantInputFactory();

  beforeEach(async () => {
    testUser = await createUser();
    caller = createProtectedCaller(testUser);
  });

  describe("createProduct route", () => {
    it("should create product", async () => {
      const testRestaurant = await createRestaurant(
        testUser.id,
        createRestaurantInput
      );

      const testCategory = await createCategory({
        userId: testUser.id,
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
        productI18N: {
          english: expect.objectContaining({
            name: "apple juice",
            description: "amazing fresh drink",
          }) as unknown,
        },
      });
    });

    describe("when restaurant has multiple languages", () => {
      it("should create product with translations", async () => {
        const testRestaurant = await createRestaurantWithMultipleLanguages(
          testUser.id,
          createRestaurantInput
        );

        const testCategory = await createCategory({
          userId: testUser.id,
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
              description: "удивительный свежевыжатый напиток",
            },
          }) as unknown,
        });
      });
    });
  });

  describe("updateProduct route", () => {
    it("should return product with new data and old imageUrl", async () => {
      const testRestaurant = await createRestaurant(
        testUser.id,
        createRestaurantInput
      );

      const testCategory = await createCategory({
        userId: testUser.id,
        restaurantId: testRestaurant.id,
        name: "juices",
        languageCode: "english",
      });

      const testProduct = await createProduct({
        userId: testUser.id,
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
        restaurantId: testRestaurant.id,
        productId: testProduct.id,
        name: "orange juice",
        price: 1500,
        description: "amazing fresh drink",
        languageCode: "english",
        imageBase64: "",
        isImageDeleted: false,
        isEnabled: true,
        autoTranslateEnabled: false,
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
        userId: testUser.id,
        restaurantId: testRestaurant.id,
        name: "juices",
        languageCode: "english",
      });

      const testProduct = await createProduct({
        userId: testUser.id,

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
        restaurantId: testRestaurant.id,
        productId: testProduct.id,
        name: "orange juice",
        price: 1500,
        description: "amazing fresh drink",
        languageCode: "english",
        imageBase64:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1920px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
        isEnabled: true,
        isImageDeleted: false,
        autoTranslateEnabled: false,
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
        userId: testUser.id,
        restaurantId: testRestaurant.id,

        name: "juices",
        languageCode: "english",
      });

      const testProduct = await createProduct({
        userId: testUser.id,
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
        restaurantId: testRestaurant.id,
        productId: testProduct.id,
        name: "апельсиновый сок",
        price: 1500,
        description: "свежевыжатый сок",
        languageCode: "russian",
        isEnabled: true,
        isImageDeleted: false,
        autoTranslateEnabled: false,
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

    describe("when restaurant has multiple languages", () => {
      describe("and autoTranslateEnabled checkbox is true", () => {
        it("should update category with translations all restaurant's languages", async () => {
          const testRestaurant = await createRestaurantWithMultipleLanguages(
            testUser.id,
            createRestaurantInput
          );

          const testCategory = await createCategoryWithMultipleLanguages({
            userId: testUser.id,
            restaurantId: testRestaurant.id,
            name: "juices",
            languageCode: "english",
          });

          const testProduct = await createProductWithMultipleLanguages({
            userId: testUser.id,
            categoryId: testCategory.id,
            restaurantId: testRestaurant.id,
            name: "orange juice",
            description: "fresh amazing juice",
            price: 1000,
            measurementUnit: "ml",
            measurementValue: "250",
            imageUrl: "originalUrl",
            languageCode: "english",
          });

          const updateProductInput: inferProcedureInput<
            AppRouter["product"]["updateProduct"]
          > = {
            restaurantId: testRestaurant.id,
            productId: testProduct.id,
            name: "apple juice",
            price: 1500,
            description: "fresh amazing juice",
            languageCode: "english",
            isEnabled: true,
            isImageDeleted: false,
            autoTranslateEnabled: true,
          };

          const { product } = await caller.product.updateProduct(
            updateProductInput
          );

          expect(product?.[0]).toMatchObject({
            productI18N: expect.objectContaining({
              english: {
                name: "apple juice",
                description: "fresh amazing juice",
              },
              russian: {
                name: "яблочный сок",
                description: "свежий изумительный сок",
              },
            }) as unknown,
          });
        });
      });

      describe("and autoTranslateEnabled checkbox is false", () => {
        it("should update only product with selected restaurant's language", async () => {
          const testRestaurant = await createRestaurantWithMultipleLanguages(
            testUser.id,
            createRestaurantInput
          );

          const testCategory = await createCategoryWithMultipleLanguages({
            userId: testUser.id,
            restaurantId: testRestaurant.id,
            name: "juices",
            languageCode: "english",
          });

          const testProduct = await createProductWithMultipleLanguages({
            userId: testUser.id,
            categoryId: testCategory.id,
            restaurantId: testRestaurant.id,
            name: "orange juice",
            description: "fresh amazing juice",
            price: 1000,
            measurementUnit: "ml",
            measurementValue: "250",
            imageUrl: "originalUrl",
            languageCode: "english",
          });

          const updateProductInput: inferProcedureInput<
            AppRouter["product"]["updateProduct"]
          > = {
            restaurantId: testRestaurant.id,
            productId: testProduct.id,
            name: "apple juice",
            price: 1500,
            description: "fresh amazing juice",
            languageCode: "english",
            isEnabled: true,
            isImageDeleted: false,
            autoTranslateEnabled: false,
          };

          const { product } = await caller.product.updateProduct(
            updateProductInput
          );
          console.log("product: ", product);

          expect(product?.[0]).toMatchObject({
            productI18N: expect.objectContaining({
              english: {
                name: "apple juice",
                description: "fresh amazing juice",
              },
              russian: {
                name: "текст на русском",
                description: "текст на русском",
              },
            }) as unknown,
          });
        });
      });
    });
  });

  describe("updateProductsPosition route", () => {
    it("should update positions of products", async () => {
      const testRestaurant = await createRestaurant(
        testUser.id,
        createRestaurantInput
      );

      const testCategory = await createCategory({
        userId: testUser.id,
        restaurantId: testRestaurant.id,
        name: "juices",
        languageCode: "english",
      });

      const [testProduct, testProductSecond] = await Promise.all([
        createProduct({
          userId: testUser.id,
          restaurantId: testRestaurant.id,
          categoryId: testCategory.id,
          name: "apple juice",
          description: "amazing fresh drink",
          price: 1000,
          languageCode: "english",
          measurementUnit: "ml",
          measurementValue: "250",
          imageUrl: "mockUrl",
        }),
        createProduct({
          userId: testUser.id,
          restaurantId: testRestaurant.id,
          categoryId: testCategory.id,
          name: "apple juice",
          description: "amazing fresh drink",
          price: 1000,
          languageCode: "english",
          measurementUnit: "ml",
          measurementValue: "250",
          imageUrl: "mockUrl",
        }),
      ]);

      const updateProductsPositionInput: inferProcedureInput<
        AppRouter["product"]["updateProductsPosition"]
      > = [
        { id: testProduct.id, position: 1, restaurantId: testRestaurant.id },
        {
          id: testProductSecond.id,
          position: 0,
          restaurantId: testRestaurant.id,
        },
      ];
      const { product } = await caller.product.updateProductsPosition(
        updateProductsPositionInput
      );

      // orders are returned in asc sequnce -> 0,1,2...
      expect(product?.[0]).toMatchObject({
        id: testProductSecond.id,
        position: 0,
      });
      expect(product?.[1]).toMatchObject({
        id: testProduct.id,
        position: 1,
      });
    });
  });

  describe("deleteProduct route", () => {
    it("should delete product by id", async () => {
      const testRestaurant = await createRestaurant(
        testUser.id,
        createRestaurantInput
      );

      const testCategory = await createCategory({
        userId: testUser.id,
        restaurantId: testRestaurant.id,
        name: "juices",
        languageCode: "english",
      });

      await createCategory({
        userId: testUser.id,
        restaurantId: testRestaurant.id,
        name: "soups",
        languageCode: "english",
      });

      const testProduct = await createProduct({
        userId: testUser.id,
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

      const input: inferProcedureInput<AppRouter["product"]["deleteProduct"]> =
        {
          productId: testProduct.id,
          restaurantId: testRestaurant.id,
        };

      const { product } = await caller.product.deleteProduct(input);

      expect(product).toHaveLength(0);
    });
  });

  //TODO: DESCRIBE WITH ERROR CASES
});
