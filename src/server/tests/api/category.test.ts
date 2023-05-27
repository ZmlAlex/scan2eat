import { type AppRouter } from "../../api/root";
import { type inferProcedureInput } from "@trpc/server";
import { createUser } from "../utils/createUser";
import { createRestaurant } from "../utils/createRestaurant";
import { createProtectedCaller } from "../utils/protectedCaller";
import { createCategory } from "../utils/createCategory";

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
  it("should create category", async () => {
    //TODO: MOVE IT TO THE BEFORE EACH?
    const testUser = await createUser();

    const caller = createProtectedCaller(testUser);

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
    const testUser = await createUser();
    const caller = createProtectedCaller(testUser);

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
    const testUser = await createUser();
    const caller = createProtectedCaller(testUser);

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
    console.log("category: ", category);

    expect(category).toHaveLength(1);
  });

  //TODO: DESCRIBE WITH ERROR CASES
});
