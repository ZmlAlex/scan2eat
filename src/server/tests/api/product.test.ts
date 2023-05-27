import { type AppRouter } from "../../api/root";
import { type inferProcedureInput } from "@trpc/server";
import { createUser } from "../utils/createUser";
import { createRestaurant } from "../utils/createRestaurant";
import { createProtectedCaller } from "../utils/protectedCaller";
import { createCategory } from "../utils/createCategory";
import { createProduct } from "../utils/createProduct";

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

describe("Product API", () => {
  it("should create product", async () => {
    //TODO: MOVE IT TO THE BEFORE EACH?
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

    const createProductInput: inferProcedureInput<
      AppRouter["product"]["createProduct"]
    > = {
      menuId: testRestaurant.menu[0]?.id as string,
      categoryId: testCategory.id,
      name: "apple juice",
      description: "amazing fresh drink",
      price: 1000,
      languageCode: "english",
      measurmentUnit: "ml.",
      measurmentValue: "250",
      imageUrl: "blabla",
    };

    const {
      menu: { product },
    } = await caller.product.createProduct(createProductInput);

    console.log("product: ", product);

    expect(product?.[0]).toMatchObject({
      name: "apple juice",
      description: "amazing fresh drink",
      price: 1000,
      isEnabled: true,
    });
  });
  it("should update product by id", async () => {
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

    const testProduct = await createProduct({
      menuId: testRestaurant.menu[0]?.id as string,
      categoryId: testCategory.id,
      name: "apple juice",
      description: "amazing fresh drink",
      price: 1000,
      languageCode: "english",
      measurmentUnit: "ml.",
      measurmentValue: "250",
      imageUrl: "mockUrl",
    });

    const updateProductInput: inferProcedureInput<
      AppRouter["product"]["updateProduct"]
    > = {
      productId: testProduct.id,
      name: "orange juice",
      price: 1500,
      description: "amazing fresh drink",
      languageCode: "english",
      imageUrl: "mockUrl",
      isEnabled: true,
    };

    const {
      menu: { product },
    } = await caller.product.updateProduct(updateProductInput);

    expect(product?.[0]).toMatchObject({
      name: "orange juice",
      price: 1500,
      description: "amazing fresh drink",
      imageUrl: "mockUrl",
      isEnabled: true,
    });
  });

  it("should delete product by id", async () => {
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

    const testProduct = await createProduct({
      menuId: testRestaurant.menu[0]?.id as string,
      categoryId: testCategory.id,
      name: "apple juice",
      description: "amazing fresh drink",
      price: 1000,
      languageCode: "english",
      measurmentUnit: "ml.",
      measurmentValue: "250",
      imageUrl: "mockUrl",
    });

    const input: inferProcedureInput<AppRouter["product"]["deleteProduct"]> = {
      productId: testProduct.id,
    };

    const {
      menu: { product },
    } = await caller.product.deleteProduct(input);

    expect(product).toHaveLength(0);
  });

  //TODO: DESCRIBE WITH ERROR CASES
});
