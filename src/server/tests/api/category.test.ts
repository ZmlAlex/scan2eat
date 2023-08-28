import type { User } from "@prisma/client";
import { type inferProcedureInput } from "@trpc/server";

import type { AppRouter, appRouter } from "../../api/root";
import { createCategory } from "../helpers/createCategory";
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
  logoUrl: "bla!",
  languageCode: "english",
};

describe("Category API", () => {
  let testUser: User;
  let caller: TestCaller;

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

    it("should update translations for russian language category", async () => {
      const testRestaurant = await createRestaurant(
        testUser.id,
        createRestaurantInput
      );

      const testCategory = await createCategory({
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
      };

      const { category } = await caller.category.updateCategory(
        updateCategoryInput
      );

      expect(category?.[0]?.categoryI18N.russian).toMatchObject({
        name: "соки",
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
          restaurantId: testRestaurant.id,
          name: "soups",
          languageCode: "english",
        }),
        createCategory({
          restaurantId: testRestaurant.id,
          name: "soups",
          languageCode: "english",
        }),
      ]);

      const updateProductsPositionInput: inferProcedureInput<
        AppRouter["category"]["updateCategoriesPosition"]
      > = [
        { id: testCategory.id, position: 1 },
        { id: testCategorySecond.id, position: 0 },
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
        restaurantId: testRestaurant.id,
        name: "juices",
        languageCode: "english",
      });

      await createCategory({
        restaurantId: testRestaurant.id,
        name: "soups",
        languageCode: "english",
      });

      const input: inferProcedureInput<
        AppRouter["category"]["deleteCategory"]
      > = {
        categoryId: testCategory.id,
      };

      const { category } = await caller.category.deleteCategory(input);

      expect(category).toHaveLength(1);
    });
  });

  //TODO: DESCRIBE WITH ERROR CASES
});
