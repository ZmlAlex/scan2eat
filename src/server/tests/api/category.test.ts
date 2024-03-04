import type { User } from "@prisma/client";
import { type inferProcedureInput } from "@trpc/server";

import type { AppRouter } from "~/server/api/root";
import { createCategory } from "~/server/tests/helpers/createCategory";
import { createCategoryWithMultipleLanguages } from "~/server/tests/helpers/createCategoryWithMultipleLanguages";
import { createRestaurant } from "~/server/tests/helpers/createRestaurant";
import { createRestaurantWithMultipleLanguages } from "~/server/tests/helpers/createRestaurantWithMultipleLanguages";
import { createUser } from "~/server/tests/helpers/createUser";
import {
  createProtectedCaller,
  type TestCaller,
} from "~/server/tests/helpers/protectedCaller";
import { createRestaurantInputFactory } from "~/server/tests/mocks";

describe("Category API", () => {
  let testUser: User;
  let caller: TestCaller;
  const createRestaurantInput = createRestaurantInputFactory();

  beforeEach(async () => {
    testUser = await createUser();
    caller = createProtectedCaller(testUser);
  });

  describe("createCategory route", () => {
    it("should create category", async () => {
      const testRestaurant = await createRestaurant(
        testUser.id,
        createRestaurantInput
      );

      console.log("testRestaurant: ", testRestaurant);

      const createCategoryInput: inferProcedureInput<
        AppRouter["category"]["createCategory"]
      > = {
        restaurantId: testRestaurant.id,
        name: "juices",
        languageCode: "english",
      };

      const { category } = await caller.category.createCategory(
        createCategoryInput
      );

      expect(category?.[0]).toMatchObject({
        categoryI18N: {
          english: expect.objectContaining({
            name: "juices",
          }) as unknown,
        },
      });
    });

    describe("when restaurant has multiple languages", () => {
      it("should create category with translations", async () => {
        const testRestaurant = await createRestaurantWithMultipleLanguages(
          testUser.id,
          createRestaurantInput
        );

        const createCategoryInput: inferProcedureInput<
          AppRouter["category"]["createCategory"]
        > = {
          restaurantId: testRestaurant.id,

          name: "juices",
          languageCode: "english",
        };

        const { category } = await caller.category.createCategory(
          createCategoryInput
        );

        expect(category?.[0]).toMatchObject({
          categoryI18N: expect.objectContaining({
            english: {
              name: "juices",
            },
            russian: {
              name: "соки",
            },
          }) as unknown,
        });
      });
    });
  });

  describe("updateCategory route", () => {
    it("should return category with new data", async () => {
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

      const updateCategoryInput: inferProcedureInput<
        AppRouter["category"]["updateCategory"]
      > = {
        restaurantId: testRestaurant.id,
        categoryId: testCategory.id,
        name: "beverages",
        languageCode: "english",
        autoTranslateEnabled: false,
      };

      const { category } = await caller.category.updateCategory(
        updateCategoryInput
      );

      expect(category?.[0]).toMatchObject({
        categoryI18N: {
          english: expect.objectContaining({
            name: "beverages",
          }) as unknown,
        },
      });
    });

    it("should create translation for russian language category if it doesn't exist", async () => {
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

      const updateCategoryInput: inferProcedureInput<
        AppRouter["category"]["updateCategory"]
      > = {
        restaurantId: testRestaurant.id,
        categoryId: testCategory.id,
        name: "соки",
        languageCode: "russian",
        autoTranslateEnabled: false,
      };

      const { category } = await caller.category.updateCategory(
        updateCategoryInput
      );

      expect(category?.[0]?.categoryI18N.russian).toMatchObject({
        name: "соки",
      });
    });

    describe("when restaurant has multiple languages", () => {
      describe("and autoTranslateEnabled checkbox is true", () => {
        it("should update category with translations all restaurant's languages", async () => {
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

          const updateCategoryInput: inferProcedureInput<
            AppRouter["category"]["updateCategory"]
          > = {
            restaurantId: testRestaurant.id,
            categoryId: testCategory.id,
            name: "homemade lemonades",
            languageCode: "english",
            autoTranslateEnabled: true,
          };

          const { category } = await caller.category.updateCategory(
            updateCategoryInput
          );

          console.log("category: ", category);

          expect(category?.[0]).toMatchObject({
            categoryI18N: expect.objectContaining({
              english: {
                name: "homemade lemonades",
              },
              russian: {
                name: "домашние лимонады",
              },
            }) as unknown,
          });
        });
      });

      describe("and autoTranslateEnabled checkbox is false", () => {
        it("should update only category with selected restaurant's language", async () => {
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

          const updateCategoryInput: inferProcedureInput<
            AppRouter["category"]["updateCategory"]
          > = {
            restaurantId: testRestaurant.id,
            categoryId: testCategory.id,
            name: "homemade lemonades",
            languageCode: "english",
            autoTranslateEnabled: false,
          };

          const { category } = await caller.category.updateCategory(
            updateCategoryInput
          );

          expect(category?.[0]).toMatchObject({
            categoryI18N: expect.objectContaining({
              english: {
                name: "homemade lemonades",
              },
              russian: {
                name: "текст на русском",
              },
            }) as unknown,
          });
        });
      });
    });
  });

  describe("updateCategoriesPosition route", () => {
    it("should update categories position", async () => {
      const testRestaurant = await createRestaurant(
        testUser.id,
        createRestaurantInput
      );

      const [testCategory, testCategorySecond] = await Promise.all([
        createCategory({
          userId: testUser.id,
          restaurantId: testRestaurant.id,
          name: "soups",
          languageCode: "english",
        }),
        createCategory({
          userId: testUser.id,
          restaurantId: testRestaurant.id,
          name: "soups",
          languageCode: "english",
        }),
      ]);

      const updateProductsPositionInput: inferProcedureInput<
        AppRouter["category"]["updateCategoriesPosition"]
      > = [
        { id: testCategory.id, position: 1, restaurantId: testRestaurant.id },
        {
          id: testCategorySecond.id,
          position: 0,
          restaurantId: testRestaurant.id,
        },
      ];
      const { category } = await caller.category.updateCategoriesPosition(
        updateProductsPositionInput
      );

      // categories are returned in asc sequnce -> 0,1,2...
      expect(category?.[0]).toMatchObject({
        id: testCategorySecond.id,
        position: 0,
      });
      expect(category?.[1]).toMatchObject({
        id: testCategory.id,
        position: 1,
      });
    });
  });

  describe("deleteСategory route", () => {
    it("should delete category by id", async () => {
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

      const input: inferProcedureInput<
        AppRouter["category"]["deleteCategory"]
      > = {
        categoryId: testCategory.id,
        restaurantId: testRestaurant.id,
      };

      const { category } = await caller.category.deleteCategory(input);

      expect(category).toHaveLength(1);
    });
  });

  //TODO: DESCRIBE WITH ERROR CASES
});
