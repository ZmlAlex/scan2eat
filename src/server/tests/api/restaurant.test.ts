// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type User } from "@prisma/client";
import { type inferProcedureInput } from "@trpc/server";

import type { AppRouter } from "~/server/api/root";
import { createCategory } from "~/server/tests/helpers/createCategory";
import { createProduct } from "~/server/tests/helpers/createProduct";
import { createRestaurant } from "~/server/tests/helpers/createRestaurant";
import { createRestaurantWithMultipleLanguages } from "~/server/tests/helpers/createRestaurantWithMultipleLanguages";
import { createUser } from "~/server/tests/helpers/createUser";
import {
  createProtectedCaller,
  type TestCaller,
} from "~/server/tests/helpers/protectedCaller";
import { createRestaurantInputFactory } from "~/server/tests/mocks";

describe("Restaurant API", () => {
  let testUser: User;
  let caller: TestCaller;
  const createRestaurantInput = createRestaurantInputFactory({
    //for real invocation via router
    logoImageBase64:
      "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
    //for helper invocation
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  });

  beforeEach(async () => {
    testUser = await createUser();
    caller = createProtectedCaller(testUser);
  });

  describe("createRestaurant route", () => {
    it("should create and return restaurant", async () => {
      const result = await caller.restaurant.createRestaurant(
        createRestaurantInput
      );

      console.log("result: ", result);

      expect(result).toMatchObject({
        logoUrl: expect.stringContaining("cloudinary") as string,
        workingHours: "24hrs",
        phone: "+70000000000",
        isPublished: false,
        restaurantI18N: {
          english: expect.objectContaining({
            name: "Krusty Krab",
            address: "831 Bottom Feeder Lane",
            description: "best fastfood in the Bikini Bottom",
          }) as unknown,
        },
      });
    });
  });

  describe("createRestaurantLanguage route", () => {
    it("should return restaurant with new language", async () => {
      const testRestaurant = await createRestaurant(
        testUser.id,
        createRestaurantInput
      );

      const [testCategory, testCategorySecond] = await Promise.all([
        createCategory({
          userId: testUser.id,
          restaurantId: testRestaurant.id,
          name: "hamburgers",
          languageCode: "english",
        }),
        createCategory({
          userId: testUser.id,
          restaurantId: testRestaurant.id,
          name: "juices",
          languageCode: "english",
        }),
      ]);

      await Promise.all([
        createProduct({
          userId: testUser.id,
          restaurantId: testRestaurant.id,
          categoryId: testCategory.id,
          name: "big mac",
          description: "description",
          price: 1000,
          languageCode: "english",
          measurementUnit: "g",
          measurementValue: "300",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1920px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
        }),
        createProduct({
          userId: testUser.id,
          restaurantId: testRestaurant.id,
          categoryId: testCategorySecond.id,
          name: "apple juice",
          description: "amazing fresh drink",
          price: 1000,
          languageCode: "english",
          measurementUnit: "ml",
          measurementValue: "250",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1920px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
        }),
      ]);

      const input: inferProcedureInput<
        AppRouter["restaurant"]["createRestaurantLanguage"]
      > = {
        restaurantId: testRestaurant.id,
        languageCode: "russian",
      };

      const result = await caller.restaurant.createRestaurantLanguage(input);
      console.log("result: ", result.product[0]);

      //TODO: ADD ORDER
      expect(result).toMatchObject({
        restaurantLanguage: [
          { languageCode: "english", isEnabled: true },
          { languageCode: "russian", isEnabled: true },
        ],
        //TODO: FIX ARRAY CHECKS
        // category: [
        //   expect.objectContaining({
        //     categoryI18N: {
        //       english: { name: "juices" },
        //       russian: { name: "соки" },
        //     },
        //   }),
        //   expect.objectContaining({
        //     categoryI18N: {
        //       english: { name: "hamburgers" },
        //       russian: { name: "гамбургеры" },
        //     },
        //   }),
        // ],
        // product: [
        //   expect.objectContaining({
        //     productI18N: {
        //       russian: { name: "бигмак", description: "описание" },
        //       english: { name: "bigmac", description: "description" },
        //     },
        //   }),
        //   expect.objectContaining({
        //     productI18N: {
        //       russian: {
        //         name: "яблочный сок",
        //         description: "потрясающий свежий напиток",
        //       },
        //       english: {
        //         name: "apple juice",
        //         description: "amazing fresh drink",
        //       },
        //     },
        //   }),
        // ],
        restaurantI18N: {
          english: {
            name: "Krusty Krab",
            description: "best fastfood in the Bikini Bottom",
            address: "831 Bottom Feeder Lane",
          },
          russian: {
            name: "Красти Краб",
            address: "831 Нижняя питающая полоса",
            description: "лучший фастфуд в Бикини Боттом",
          },
        },
      });
    });
  });

  describe("setPublishedRestaurant route", () => {
    it("should return restaurant with updated restaurant's languages settings", async () => {
      const testRestaurant = await createRestaurant(
        testUser.id,
        createRestaurantInput
      );

      //TODO: MOVE IT TO THE HELPER!
      await caller.restaurant.createRestaurantLanguage({
        restaurantId: testRestaurant.id,
        languageCode: "russian",
      });

      const input: inferProcedureInput<
        AppRouter["restaurant"]["setEnabledRestaurantLanguages"]
      > = {
        restaurantId: testRestaurant.id,
        languageCodes: [
          { languageCode: "english", isEnabled: true },
          { languageCode: "russian", isEnabled: false },
        ],
      };

      const result = await caller.restaurant.setEnabledRestaurantLanguages(
        input
      );

      expect(result).toMatchObject({
        restaurantLanguage: [
          { languageCode: "english", isEnabled: true },
          { languageCode: "russian", isEnabled: false },
        ],
      });
    });
  });

  describe("getRestaurant route", () => {
    it("should return restaurant", async () => {
      const testRestaurant = await createRestaurant(
        testUser.id,
        createRestaurantInput
      );

      const input: inferProcedureInput<
        AppRouter["restaurant"]["getRestaurant"]
      > = {
        restaurantId: testRestaurant.id,
      };

      const result = await caller.restaurant.getRestaurant(input);

      console.log("result: ", result);
      expect(result).toMatchObject({
        logoUrl: expect.stringContaining("Olympic") as string,
        workingHours: "24hrs",
        currencyCode: "RUB",
        restaurantI18N: {
          english: expect.objectContaining({
            name: "Krusty Krab",
            address: "831 Bottom Feeder Lane",
            description: "best fastfood in the Bikini Bottom",
          }) as unknown,
        },
      });
    });

    //TODO: UPDATE WITH FULL DETAILS
    it("should return restaurant with full details", async () => {
      const testRestaurant = await createRestaurant(
        testUser.id,
        createRestaurantInput
      );

      const [testCategory, testCategorySecond] = await Promise.all([
        createCategory({
          userId: testUser.id,
          restaurantId: testRestaurant.id,
          name: "hamburgers",
          languageCode: "english",
        }),
        createCategory({
          userId: testUser.id,
          restaurantId: testRestaurant.id,
          name: "juices",
          languageCode: "english",
        }),
      ]);

      await Promise.all([
        createProduct({
          userId: testUser.id,
          restaurantId: testRestaurant.id,
          categoryId: testCategory.id,
          name: "bigmac",
          description: "description",
          price: 1000,
          languageCode: "english",
          measurementUnit: "g",
          measurementValue: "300",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1920px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
        }),
        createProduct({
          userId: testUser.id,
          restaurantId: testRestaurant.id,
          categoryId: testCategorySecond.id,
          name: "apple juice",
          description: "amazing fresh drink",
          price: 1000,
          languageCode: "english",
          measurementUnit: "ml",
          measurementValue: "250",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1920px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
        }),
      ]);

      const input: inferProcedureInput<
        AppRouter["restaurant"]["getRestaurant"]
      > = {
        restaurantId: testRestaurant.id,
      };

      const result = await caller.restaurant.getRestaurant(input);

      console.log("result: ", result);
      expect(result).toMatchObject({
        logoUrl: expect.stringContaining("Olympic") as string,
        workingHours: "24hrs",
        currencyCode: "RUB",
        restaurantI18N: {
          english: expect.objectContaining({
            name: "Krusty Krab",
            address: "831 Bottom Feeder Lane",
            description: "best fastfood in the Bikini Bottom",
          }) as unknown,
        },
      });
    });
  });

  describe("getAllRestaurants route", () => {
    it("should get all restaurants by id", async () => {
      await Promise.all([
        createRestaurant(testUser.id, createRestaurantInput),
        createRestaurant(testUser.id, createRestaurantInput),
      ]);

      const result = await caller.restaurant.getAllRestaurants();

      expect(result).toHaveLength(2);
    });
  });

  describe("updateRestaurant route", () => {
    it("should return restaurant with new data and old logoUrl", async () => {
      const testRestaurant = await createRestaurant(
        testUser.id,
        createRestaurantInput
      );

      const input: inferProcedureInput<
        AppRouter["restaurant"]["updateRestaurant"]
      > = {
        ...createRestaurantInput,
        logoImageBase64: "",
        isImageDeleted: false,
        restaurantId: testRestaurant.id,
        name: "Chum Bucket",
        address: "830 Bottom Feeder Lane",
        autoTranslateEnabled: false,
      };

      const result = await caller.restaurant.updateRestaurant(input);

      expect(result).toMatchObject({
        logoUrl: expect.stringContaining("Olympic") as string,
        workingHours: "24hrs",
        currencyCode: "RUB",
        restaurantI18N: {
          english: expect.objectContaining({
            name: "Chum Bucket",
            address: "830 Bottom Feeder Lane",
            description: "best fastfood in the Bikini Bottom",
          }) as unknown,
        },
      });
    });

    it("should return restaurant with new data and new logoUrl", async () => {
      const testRestaurant = await createRestaurant(
        testUser.id,
        createRestaurantInput
      );

      const input: inferProcedureInput<
        AppRouter["restaurant"]["updateRestaurant"]
      > = {
        ...createRestaurantInput,
        logoImageBase64:
          "https://upload.wikimedia.org/wikipedia/commons/6/62/Barbieri_-_ViaSophia25668.jpg",
        isImageDeleted: false,
        restaurantId: testRestaurant.id,
        name: "Chum Bucket",
        address: "830 Bottom Feeder Lane",
        autoTranslateEnabled: false,
      };

      const result = await caller.restaurant.updateRestaurant(input);
      console.log("result: ", result);

      expect(result).toMatchObject({
        logoUrl: expect.stringContaining("cloudinary") as string,

        workingHours: "24hrs",
        currencyCode: "RUB",
        restaurantI18N: {
          english: expect.objectContaining({
            name: "Chum Bucket",
            address: "830 Bottom Feeder Lane",
            description: "best fastfood in the Bikini Bottom",
          }) as unknown,
        },
      });
    });

    it("should update translations for russian language and return restaurant with new data", async () => {
      const testRestaurant = await createRestaurant(
        testUser.id,
        createRestaurantInput
      );

      const input: inferProcedureInput<
        AppRouter["restaurant"]["updateRestaurant"]
      > = {
        ...createRestaurantInput,
        logoImageBase64: "",
        isImageDeleted: false,
        restaurantId: testRestaurant.id,
        name: "Красти Крабс",
        address: "Нижний переулок 830",
        description: "лучшие бургеры",
        languageCode: "russian",
        autoTranslateEnabled: false,
      };

      const result = await caller.restaurant.updateRestaurant(input);
      console.log("result: ", result);

      expect(result).toMatchObject({
        logoUrl: expect.stringContaining("Olympic") as string,
        workingHours: "24hrs",
        restaurantI18N: {
          russian: expect.objectContaining({
            name: "Красти Крабс",
            address: "Нижний переулок 830",
            description: "лучшие бургеры",
          }) as unknown,
        },
        currencyCode: "RUB",
      });
    });

    it("should update published status on true return restaurant with new data", async () => {
      const testRestaurant = await createRestaurant(
        testUser.id,
        createRestaurantInput
      );

      const input: inferProcedureInput<
        AppRouter["restaurant"]["setPublishedRestaurant"]
      > = {
        restaurantId: testRestaurant.id,
        isPublished: true,
      };

      const result = await caller.restaurant.setPublishedRestaurant(input);

      expect(result).toMatchObject({
        isPublished: true,
      });
    });

    //
    describe("when restaurant has multiple languages", () => {
      describe("and autoTranslateEnabled checkbox is true", () => {
        it("should update category with translations all restaurant's languages", async () => {
          const testRestaurant = await createRestaurantWithMultipleLanguages(
            testUser.id,
            createRestaurantInput
          );

          const input: inferProcedureInput<
            AppRouter["restaurant"]["updateRestaurant"]
          > = {
            ...createRestaurantInput,
            logoImageBase64: "",
            isImageDeleted: false,
            restaurantId: testRestaurant.id,
            name: "Бургер бар",
            address: "Нижний переулок 829",
            description: "лучшие бургеры",
            languageCode: "russian",
            autoTranslateEnabled: true,
          };

          const result = await caller.restaurant.updateRestaurant(input);

          expect(result).toMatchObject({
            logoUrl: expect.stringContaining("Olympic") as string,
            workingHours: "24hrs",
            restaurantI18N: expect.objectContaining({
              english: {
                address: "Nizhny Pereulok 829",
                description: "best burgers",
                name: "Burger bar",
              },
              russian: {
                address: "Нижний переулок 829",
                description: "лучшие бургеры",
                name: "Бургер бар",
              },
            }) as unknown,
            currencyCode: "RUB",
          });
        });
      });

      describe("and autoTranslateEnabled checkbox is false", () => {
        it("should update only product with selected restaurant's language", async () => {
          const testRestaurant = await createRestaurantWithMultipleLanguages(
            testUser.id,
            createRestaurantInput
          );

          const input: inferProcedureInput<
            AppRouter["restaurant"]["updateRestaurant"]
          > = {
            ...createRestaurantInput,
            logoImageBase64: "",
            isImageDeleted: false,
            restaurantId: testRestaurant.id,
            name: "Бургер бар",
            address: "Нижний переулок 829",
            description: "лучшие бургеры",
            languageCode: "russian",
            autoTranslateEnabled: false,
          };

          const result = await caller.restaurant.updateRestaurant(input);

          expect(result).toMatchObject({
            logoUrl: expect.stringContaining("Olympic") as string,
            workingHours: "24hrs",
            restaurantI18N: expect.objectContaining({
              english: {
                address: "831 Bottom Feeder Lane",
                description: "best fastfood in the Bikini Bottom",
                name: "Krusty Krab",
              },
              russian: {
                address: "Нижний переулок 829",
                description: "лучшие бургеры",
                name: "Бургер бар",
              },
            }) as unknown,
            currencyCode: "RUB",
          });
        });
      });
    });
  });

  describe("deleteRestaurant route", () => {
    it("should delete restaurant by id", async () => {
      const [testRestaurant, testRestaurantSecond] = await Promise.all([
        createRestaurant(testUser.id, createRestaurantInput),
        createRestaurant(testUser.id, createRestaurantInput),
      ]);

      const input: inferProcedureInput<
        AppRouter["restaurant"]["deleteRestaurant"]
      > = {
        restaurantId: testRestaurant.id,
      };

      const result = await caller.restaurant.deleteRestaurant(input);

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toEqual(testRestaurantSecond.id);
    });
  });

  //TODO: DESCRIBE WITH ERROR CASES
});
