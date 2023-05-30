import type { User } from "@prisma/client";
import { type inferProcedureInput } from "@trpc/server";

import type { AppRouter, appRouter } from "../../api/root";
import { createCategory } from "../helpers/createCategory";
import { createRestaurant } from "../helpers/createRestaurant";
import { createUser } from "../helpers/createUser";
import { createProtectedCaller } from "../helpers/protectedCaller";

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
  it("should create category", async () => {
    const testRestaurant = await createRestaurant(
      testUser.id,
      createRestaurantInput
    );

    console.log("testRestaurant: ", testRestaurant);

    const createCategoryInput: inferProcedureInput<
      AppRouter["category"]["createCategory"]
    > = {
      menuId: testRestaurant.menu[0]?.id as string,
      name: "juices",
      languageCode: "english",
    };

    const {
      menu: { category },
    } = await caller.category.createCategory(createCategoryInput);

    expect(category?.[0]).toMatchObject({
      name: "juices",
    });
  });
  it("should update category by id", async () => {
    const testRestaurant = await createRestaurant(
      testUser.id,
      createRestaurantInput
    );

    const testCategory = await createCategory({
      menuId: testRestaurant.menu[0]?.id as string,
      name: "juices",
      languageCode: "english",
    });

    const updateCategoryInput: inferProcedureInput<
      AppRouter["category"]["updateCategory"]
    > = {
      categoryId: testCategory.id,
      name: "beverages",
      languageCode: "english",
    };

    const {
      menu: { category },
    } = await caller.category.updateCategory(updateCategoryInput);

    expect(category?.[0]).toMatchObject({
      name: "beverages",
    });
  });

  it("should delete restaurant by id", async () => {
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

    const input: inferProcedureInput<AppRouter["category"]["deleteCategory"]> =
      {
        categoryId: testCategory.id,
      };

    const {
      menu: { category },
    } = await caller.category.deleteCategory(input);

    expect(category).toHaveLength(1);
  });

  //TODO: DESCRIBE WITH ERROR CASES
});
