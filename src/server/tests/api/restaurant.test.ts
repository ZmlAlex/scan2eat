// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

//TODO: move it to the mocks
const createRestaurantInput: inferProcedureInput<
  AppRouter["restaurant"]["createRestaurant"]
> & { logoUrl: string } = {
  name: "Krusty Krab",
  address: "831 Bottom Feeder Lane",
  description: "best fastfood in the Bikini Bottom",
  currencyCode: "RUB",
  workingHours: "24hrs",
  //for real invocation via router
  logoImageBase64:
    "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  //for helper invocation
  logoUrl:
    "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  languageCode: "english",
};

describe("Restaurant API", () => {
  let testUser: User;
  let caller: TestCaller;

  beforeEach(async () => {
    testUser = await createUser();
    caller = createProtectedCaller(testUser);
  });

  it("should create restaurant", async () => {
    const result = await caller.restaurant.createRestaurant(
      createRestaurantInput
    );

    console.log("result: ", result);

    expect(result).toMatchObject({
      logoUrl: expect.stringContaining("cloudinary") as string,
      workingHours: "24hrs",
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

  describe("when new restaurant language is created", () => {
    it("should returns restaurant with new language", async () => {
      const testRestaurant = await createRestaurant(
        testUser.id,
        createRestaurantInput
      );

      const [testCategory, testCategorySecond] = await Promise.all([
        createCategory({
          menuId: testRestaurant.menu[0]?.id as string,
          name: "hamburgers",
          languageCode: "english",
        }),
        createCategory({
          menuId: testRestaurant.menu[0]?.id as string,
          name: "juices",
          languageCode: "english",
        }),
      ]);

      await Promise.all([
        createProduct({
          menuId: testRestaurant.menu[0]?.id as string,
          categoryId: testCategory.id,
          name: "bigmac",
          description: "description",
          price: 1000,
          languageCode: "english",
          measurmentUnit: "g.",
          measurmentValue: "300",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1920px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
        }),
        createProduct({
          menuId: testRestaurant.menu[0]?.id as string,
          categoryId: testCategorySecond.id,
          name: "apple juice",
          description: "amazing fresh drink",
          price: 1000,
          languageCode: "english",
          measurmentUnit: "ml.",
          measurmentValue: "250",
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

      //TODO: ADD ORDER
      expect(result).toMatchObject({
        restaurantLanguage: [
          { languageCode: "english", isEnabled: true },
          { languageCode: "russian", isEnabled: true },
        ],
        //TODO: FIX ARRAY CHECKS
        // menu: expect.objectContaining({
        //   category: [
        //     expect.objectContaining({
        //       categoryI18N: {
        //         english: { name: "juices" },
        //         russian: { name: "соки" },
        //       },
        //     }),
        //     expect.objectContaining({
        //       categoryI18N: {
        //         english: { name: "hamburgers" },
        //         russian: { name: "гамбургеры" },
        //       },
        //     }),
        //   ],
        //   product: [
        //     expect.objectContaining({
        //       productI18N: {
        //         russian: { name: "бигмак", description: "описание" },
        //         english: { name: "bigmac", description: "description" },
        //       },
        //     }),
        //     expect.objectContaining({
        //       productI18N: {
        //         russian: {
        //           name: "яблочный сок",
        //           description: "потрясающий свежий напиток",
        //         },
        //         english: {
        //           name: "apple juice",
        //           description: "amazing fresh drink",
        //         },
        //       },
        //     }),
        //   ],
        // }) as unknown,
        restaurantI18N: {
          english: {
            name: "Krusty Krab",
            description: "best fastfood in the Bikini Bottom",
            address: "831 Bottom Feeder Lane",
          },
          russian: {
            name: "Красти Краб",
            description: "лучший фастфуд в Бикини Боттом",
            address: "831 Нижняя фидерная дорожка",
          },
        },
      });
    });
  });

  describe("when restaurant language is toggled", () => {
    it("should returns restaurant with updated restaurant's languages settings", async () => {
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

  describe("when restaurant is gotten by id", () => {
    it("should returns restaurant after creation", async () => {
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
        currency: {
          code: "RUB",
          title: "рубль",
        },
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
    it("should returns restaurant with full details", async () => {
      const testRestaurant = await createRestaurant(
        testUser.id,
        createRestaurantInput
      );

      const [testCategory, testCategorySecond] = await Promise.all([
        createCategory({
          menuId: testRestaurant.menu[0]?.id as string,
          name: "hamburgers",
          languageCode: "english",
        }),
        createCategory({
          menuId: testRestaurant.menu[0]?.id as string,
          name: "juices",
          languageCode: "english",
        }),
      ]);

      await Promise.all([
        createProduct({
          menuId: testRestaurant.menu[0]?.id as string,
          categoryId: testCategory.id,
          name: "bigmac",
          description: "description",
          price: 1000,
          languageCode: "english",
          measurmentUnit: "g.",
          measurmentValue: "300",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1920px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
        }),
        createProduct({
          menuId: testRestaurant.menu[0]?.id as string,
          categoryId: testCategorySecond.id,
          name: "apple juice",
          description: "amazing fresh drink",
          price: 1000,
          languageCode: "english",
          measurmentUnit: "ml.",
          measurmentValue: "250",
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
        currency: {
          code: "RUB",
          title: "рубль",
        },
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

  it("should get all restaurants by id", async () => {
    await Promise.all([
      createRestaurant(testUser.id, createRestaurantInput),
      createRestaurant(testUser.id, createRestaurantInput),
    ]);

    const result = await caller.restaurant.getAllRestaurants();

    expect(result).toHaveLength(2);
  });

  describe("When restaurant is updated by id", () => {
    it("should returns restaurant with new data and old logoUrl", async () => {
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
      };

      const result = await caller.restaurant.updateRestaurant(input);

      expect(result).toMatchObject({
        logoUrl: expect.stringContaining("Olympic") as string,
        workingHours: "24hrs",
        currency: {
          code: "RUB",
          title: "рубль",
        },
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
      };

      const result = await caller.restaurant.updateRestaurant(input);
      console.log("result: ", result);

      expect(result).toMatchObject({
        logoUrl: expect.stringContaining("cloudinary") as string,

        workingHours: "24hrs",
        currency: {
          code: "RUB",
          title: "рубль",
        },
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
        currency: {
          code: "RUB",
          title: "рубль",
        },
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
  });

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

  //TODO: DESCRIBE WITH ERROR CASES
});
