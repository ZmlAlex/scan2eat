import { type AppRouter } from "../../api/root";
import { type inferProcedureInput } from "@trpc/server";
import { createUser } from "../utils/createUser";
import { createRestaurant } from "../utils/createRestaurant";
import { createProtectedCaller } from "../utils/protectedCaller";

const createRestaurantInput: inferProcedureInput<
  AppRouter["restaurant"]["createRestaurant"]
> = {
  name: "Krusty Krab",
  address: "831 Bottom Feeder Lane",
  description: "best fastfood in the Bikini Bottom",
  currencyCode: "RUB",
  workingHours: "24hrs",
  logoUrl: "bla!",
  languageCode: "english",
};

describe("Restaurant API", () => {
  it("should create restaurant", async () => {
    const testUser = await createUser();
    const caller = createProtectedCaller(testUser);

    const result = await caller.restaurant.createRestaurant(
      createRestaurantInput
    );

    console.log("result: ", result);

    expect(result).toMatchObject({
      name: "Krusty Krab",
      address: "831 Bottom Feeder Lane",
      description: "best fastfood in the Bikini Bottom",
      currencyCode: "RUB",
      logoUrl: "bla!",
      workingHours: "24hrs",
    });
  });
  it("should get restaurant by id", async () => {
    const testUser = await createUser();
    const caller = createProtectedCaller(testUser);

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
      name: "Krusty Krab",
      address: "831 Bottom Feeder Lane",
      description: "best fastfood in the Bikini Bottom",
      currencyCode: "RUB",
      logoUrl: "bla!",
      workingHours: "24hrs",
      currency: {
        code: "RUB",
        title: "рубль",
      },
    });
  });

  it("should get all restaurants by id", async () => {
    const testUser = await createUser();
    const caller = createProtectedCaller(testUser);

    await Promise.all([
      createRestaurant(testUser.id, createRestaurantInput),
      createRestaurant(testUser.id, createRestaurantInput),
    ]);

    const result = await caller.restaurant.getAllRestaurants();

    console.log("result: ", result);

    expect(result).toHaveLength(2);
  });

  it("should update restaurant by id", async () => {
    const testUser = await createUser();
    const caller = createProtectedCaller(testUser);

    const testRestaurant = await createRestaurant(
      testUser.id,
      createRestaurantInput
    );

    const input: inferProcedureInput<
      AppRouter["restaurant"]["updateRestaurant"]
    > = {
      ...createRestaurantInput,
      restaurantId: testRestaurant.id,
      name: "Chum Bucket",
      address: "830 Bottom Feeder Lane",
    };

    const result = await caller.restaurant.updateRestaurant(input);

    console.log("result: ", result);
    expect(result).toMatchObject({
      name: "Chum Bucket",
      address: "830 Bottom Feeder Lane",
      description: "best fastfood in the Bikini Bottom",
      currencyCode: "RUB",
      logoUrl: "bla!",
      workingHours: "24hrs",
      currency: {
        code: "RUB",
        title: "рубль",
      },
    });
  });

  it("should delete restaurant by id", async () => {
    const testUser = await createUser();
    const caller = createProtectedCaller(testUser);

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
