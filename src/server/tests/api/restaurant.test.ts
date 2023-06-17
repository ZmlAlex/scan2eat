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

const createRestaurantInput: inferProcedureInput<
  AppRouter["restaurant"]["createRestaurant"]
> = {
  name: "Krusty Krab",
  address: "831 Bottom Feeder Lane",
  description: "best fastfood in the Bikini Bottom",
  currencyCode: "RUB",
  workingHours: "24hrs",
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
        name: "Krusty Krab",
        address: "831 Bottom Feeder Lane",
        description: "best fastfood in the Bikini Bottom",
      },
    });
  });

  describe("when restaurant is gotten by id", () => {
    it("should get restaurant after creation", async () => {
      const testRestaurant = await createRestaurant(
        testUser.id,
        createRestaurantInput
      );

      const input: inferProcedureInput<
        AppRouter["restaurant"]["getRestaurant"]
      > = {
        restaurantId: testRestaurant.id,
        languageCode: createRestaurantInput.languageCode,
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
          name: "Krusty Krab",
          address: "831 Bottom Feeder Lane",
          description: "best fastfood in the Bikini Bottom",
        },
      });
    });

    //TODO: UPDATE WITH FULL DETAILS
    it("should get restaurant with full details", async () => {
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
        languageCode: createRestaurantInput.languageCode,
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
          name: "Krusty Krab",
          address: "831 Bottom Feeder Lane",
          description: "best fastfood in the Bikini Bottom",
        },
      });
    });
  });

  it("should get all restaurants by id", async () => {
    await Promise.all([
      createRestaurant(testUser.id, createRestaurantInput),
      createRestaurant(testUser.id, createRestaurantInput),
    ]);

    const result = await caller.restaurant.getAllRestaurants({
      languageCode: createRestaurantInput.languageCode,
    });

    expect(result).toHaveLength(2);
  });

  describe("When restaurant is updated by id", () => {
    it("should return restaurant with new data and old logoUrl", async () => {
      const testRestaurant = await createRestaurant(
        testUser.id,
        createRestaurantInput
      );

      const input: inferProcedureInput<
        AppRouter["restaurant"]["updateRestaurant"]
      > = {
        ...createRestaurantInput,
        logoUrl: undefined,
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
          name: "Chum Bucket",
          address: "830 Bottom Feeder Lane",
          description: "best fastfood in the Bikini Bottom",
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
        logoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/6/62/Barbieri_-_ViaSophia25668.jpg",
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
          name: "Chum Bucket",
          address: "830 Bottom Feeder Lane",
          description: "best fastfood in the Bikini Bottom",
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
        logoUrl: undefined,
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
          name: "Красти Крабс",
          address: "Нижний переулок 830",
          description: "лучшие бургеры",
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
        languageCode: createRestaurantInput.languageCode,
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
      languageCode: createRestaurantInput.languageCode,
    };

    const result = await caller.restaurant.deleteRestaurant(input);

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toEqual(testRestaurantSecond.id);
  });

  //TODO: DESCRIBE WITH ERROR CASES
});
