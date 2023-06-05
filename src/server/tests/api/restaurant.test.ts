import { type User } from "@prisma/client";
import { type inferProcedureInput } from "@trpc/server";

import type { AppRouter, appRouter } from "../../api/root";
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
  it("should get restaurant by id", async () => {
    const testRestaurant = await createRestaurant(
      testUser.id,
      createRestaurantInput
    );

    const input: inferProcedureInput<AppRouter["restaurant"]["getRestaurant"]> =
      {
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

  it("should get all restaurants by id", async () => {
    await Promise.all([
      createRestaurant(testUser.id, createRestaurantInput),
      createRestaurant(testUser.id, createRestaurantInput),
    ]);

    const result = await caller.restaurant.getAllRestaurants();

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
